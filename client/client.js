//-----------------
//-- Collections --
//-----------------

Meteor.subscribe('songs', function() {
    Session.set('songs_loaded', true);
});

Meteor.subscribe('users');

//------------
//-- client --
//------------

Meteor.startup(function() {
   if (Accounts._resetPasswordToken) {
    Session.set('resetPassword', Accounts._resetPasswordToken);
  }

  player = new Player(document.getElementById('audio'));

  loadNext = function() {
    Session.set("currentSrc", player.getRandomSong().path);
  };

  var checkLoadedSongs = function() {
    console.log("Checking if songs collection is ready...");
    if (!Session.get('songs_loaded')) {
        console.log("Still not ready, checking again in 1s.");
        Meteor.setTimeout(checkLoadedSongs, 1000);
    }
    else {
        console.log("Songs collection ready, loading next song.");
        Meteor.setTimeout(loadNext, 500);
    }
  };
  checkLoadedSongs();

  player.audioElement.onended = loadNext;
});

// UIKit Notification Listener
Meteor.autorun(function() {
  var message = Session.get('displayMessage');
  if (message) {
    var stringArray = message.split('&');
    ui.notify(stringArray[0], stringArray[1])
      .effect('slide')
      .closable();
    Session.set('displayMessage', null);
  }
});

//------------
//-- player --
//------------

var setUserState = function(currentSrc) {

};

Template.player.events({
  'change input#volume': function(e) {
    player.setVolume(e.target.value / 100);
  },
  'play audio': function(e) {
    var currentSrc = player.getCurrentSrc();
    Meteor.users.update({_id: Meteor.userId()}, {$set:{"state.currentsrc": currentSrc}});
    console.log("Now listening to ", SongUtils.getSongName(currentSrc));
  }
});

Template.player.helpers({
  currentSrc: function() {
    return Session.get("currentSrc");
  },
  currentSrcName: function() {
    return SongUtils.getSongName(Session.get("currentSrc"));
  }
});

//--------------
//-- userlist --
//--------------

Template.userlist.helpers({
  users: function() {
    return Meteor.users.find().fetch();
  },
  email: function() {
    return this.emails[0].address || "N/A";
  }
});

//-----------
//-- login --
//-----------

Template.loginButtons.helpers({
  email: function() {
    return this.emails[0].address;
  }
});

Template.loginButtons.events({
  'click #loginButton': function() {
    if (Session.get("showLoginWindow") !== "login") {
      Session.set("showLoginWindow", "login");
    } else {
      Session.set("showLoginWindow", false);
    }
  },
  'click #logoutButton': function() {
    Meteor.logout();
  },
  'click #registerButton': function() {
    if (Session.get("showLoginWindow") !== "register") {
      Session.set("showLoginWindow", "register");
    } else {
      Session.set("showLoginWindow", false);
    }
  }
});

Template.loginWindow.helpers({
  showLoginWindow: function() {
    return Session.get("showLoginWindow");
  },
  showLogin: function() {
    return Session.get("showLoginWindow") === "login";
  },
  showRegister: function() {
    return Session.get("showLoginWindow") === "register"
  },
  showPasswordRecovery: function() {
    return Session.get("showLoginWindow") === "passwordrecovery"
  }
});

// Validations

var trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
};

var isNotEmpty = function(val) {
  return val && val.length >= 0;
};

var isEmail = function(val) {
  // need to find email regex
  return true;
};

var isValidPassword = function(val, field) {
  if (val.length >= 6) {
    return true;
  } else {
    Session.set('displayMessage', 'Error & Too short.');
    return false;
  }
};

Template.login.events({
  'submit #login-form' : function(e, t){
    e.preventDefault();
    var email    = t.find('#login-email').value;
    var password = t.find('#login-password').value;

    // Trim and validate your fields here....
    email = trimInput(email);

    // If validation passes, supply the appropriate fields to the
    // Meteor.loginWithPassword() function.
    Meteor.loginWithPassword(email, password, function(err) {
      if (err) {
        // The user might not have been found, or their passwword
        // could be incorrect. Inform the user that their
        // login attempt has failed.
      } else {
        Session.set("showLoginWindow", false);
        // The user has been logged in.
      }
    });
    return false;
  }
});

Template.register.events({
  'submit #register-form' : function(e, t) {
    e.preventDefault();
    // var name     = t.find('#login-name').value;
    var email = t.find('#account-email').value;
    var password = t.find('#account-password').value;

    // Trim and validate the input
    email = trimInput(email);
    if (!isValidPassword(password)) {
      return false;
    }

    Accounts.createUser({
      email: email,
      password : password
    }, function(err){
      if (err) {
        // Inform the user that account creation failed
      } else {
        Session.set("showLoginWindow", false);
        // Success. Account has been created and the user
        // has logged in successfully.
      }
    });
    return false;
  }
});

Template.passwordRecovery.helpers({
  resetPassword : function(t) {
    return Session.get('resetPassword');
  }
});

Template.passwordRecovery.events({
  'submit #recovery-form' : function(e, t) {
    e.preventDefault();
    var email = trimInput(t.find('#recovery-email').value);

    if (isNotEmpty(email) && isEmail(email)) {
      Session.set('loading', true);
      Accounts.forgotPassword({email: email}, function(err) {
        if (err)
          Session.set('displayMessage', 'Password Reset Error & Doh');
        else {
          Session.set('displayMessage', 'Email Sent & Please check your email.');
        }
        Session.set('loading', false);
      });
    }
    return false;
  },
  'submit #new-password' : function(e, t) {
    e.preventDefault();
    var pw = t.find('#new-password-password').value;
    if (isNotEmpty(pw) && isValidPassword(pw)) {
      Session.set('loading', true);
      Accounts.resetPassword(Session.get('resetPassword'), pw, function(err){
        if (err)
          Session.set('displayMessage', 'Password Reset Error & Sorry');
        else {
          Session.set('resetPassword', null);
        }
        Session.set('loading', false);
      });
    }
  return false;
  }
});
