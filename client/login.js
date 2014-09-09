//--------------------//
//-- navbar buttons --//
//--------------------//

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
  },
  'click #profileButton': function() {
    if (Session.get("showLoginWindow") !== "profile") {
      Session.set("showLoginWindow", "profile");
    } else {
      Session.set("showLoginWindow", false);
    }
  },
});

Template.loginWindow.helpers({
  showLoginWindow: function() {
    return Session.get("showLoginWindow");
  },
  showLogin: function() {
    return Session.get("showLoginWindow") === "login";
  },
  showRegister: function() {
    return Session.get("showLoginWindow") === "register";
  },
  showPasswordRecovery: function() {
    return Session.get("showLoginWindow") === "passwordrecovery";
  },
  showProfile: function() {
    return Session.get("showLoginWindow") === "profile";
  }
});

//-----------//
//-- FORMS --//
//-----------//

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

//-----------//
//-- login --//
//-----------//

Template.login.events({
  'submit #login-form' : function(e, t){
    e.preventDefault();
    var email    = t.find('#login-email').value;
    var password = t.find('#login-password').value;

    email = trimInput(email);

    Meteor.loginWithPassword(email, password, function(err) {
      if (err) {
        Session.set('displayMessage', 'Sorry & Failed to login');
      } else {
        Session.set("showLoginWindow", false);
        refreshState();
      }
    });
    return false;
  }
});

//--------------//
//-- register --//
//--------------//

Template.register.events({
  'submit #register-form' : function(e, t) {
    e.preventDefault();
    var username = t.find("#account-username").value;
    var email = t.find('#account-email').value;
    var password = t.find('#account-password').value;

    email = trimInput(email);
    if (!isValidPassword(password)) {
      return false;
    }

    Accounts.createUser({
      username: username,
      email: email,
      password : password
    }, function(err){
      if (err) {
        Session.set('displayMessage', 'Sorry & Failed to create account');
      } else {
        Session.set("showLoginWindow", false);
        refreshState();
      }
    });
    return false;
  }
});

//-------------//
//-- profile --//
//-------------//

Template.profile.helpers({
  dropboxtoken: function() {
    var user = Meteor.user();
    return user.services.dropbox && user.services.dropbox.token;
  }
});

Template.profile.events({
  'submit #profile-form' : function(e, t) {
    e.preventDefault();
    var dropboxtoken = t.find('#account-dropboxtoken').value;

    // Update the user with dropbox information
    if (dropboxtoken === "") {
      // Empty creds should be removed
      Meteor.users.update({_id: Meteor.userId()},{$unset: {"services.dropbox": ""}});
      Session.set('displayMessage', "Update & Removed dropbox information");
    }
    else {
      Meteor.users.update({_id: Meteor.userId()},{$set: {"services.dropbox.token": dropboxtoken}});
      Session.set('displayMessage', "Update & Set dropbox information");

      // update songs collection on the server
      Meteor.call("updateSongsCollection");
    }

    Session.set("showLoginWindow", false);
    return false;
  }
});

//-----------------------//
//-- password recovery --//
//-----------------------//

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
