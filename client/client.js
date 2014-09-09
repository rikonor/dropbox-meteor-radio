//-----------------//
//-- Collections --//
//-----------------//

Meteor.subscribe('songs', function() {
    Session.set('songs_loaded', true);
});

Meteor.subscribe('users');

//------------//
//-- client --//
//------------//

Meteor.startup(function() {
   if (Accounts._resetPasswordToken) {
    Session.set('resetPassword', Accounts._resetPasswordToken);
  }

  player = new Player(document.getElementById('audio'));

  // load next song
  loadNext = function() {
    Session.set("currentSrc", player.getRandomSong().path);
  };

  var checkLoadedSongs = function() {
    console.log("Checking if songs collection is ready...");
    var check = function() {
      if (!Session.get('songs_loaded')) {
        console.log("Still not ready, checking again in 1s.");
        Meteor.setTimeout(check, 1000);
      }
      else {
          console.log("Songs collection ready, loading next song.");
          Meteor.setTimeout(loadNext, 1000);
      }
    };
    check();
  };
  checkLoadedSongs();

  // Continuous Playback
  player.audioElement.onended = loadNext;
});

// UIKit Notification Listener
Meteor.autorun(function() {
  var message = Session.get('displayMessage');
  if (message) {
    var stringArray = message.split('&');
    ui.notify(stringArray[0], stringArray[1]);
    Session.set('displayMessage', null);
  }
});

//------------//
//-- player --//
//------------//

// Set current song
var refreshState = function(currentSrc) {
  if (!Meteor.user()) {
    return false;
  }
  var currentSrc = player.getCurrentSrc();
  Meteor.users.update({_id: Meteor.userId()}, {$set:{"status.currentsrc": currentSrc}});
  console.info("Now listening to ", SongUtils.getSongName(currentSrc));
  return true;
};

Template.player.events({
  'change input#volume': function(e) {
    player.setVolume(e.target.value / 100);
  },
  'play audio': function(e) {
    refreshState();
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

//--------------//
//-- userlist --//
//--------------//

Template.userlist.helpers({
  users: function() {
    return Meteor.users.find().fetch();
  }
});

//-----------//
//-- user ---//
//-----------//

Template.user.helpers({
  online: function() {
    return this.status && this.status.online;
  },
  email: function() {
    return this.emails[0].address || "N/A";
  },
  listeningTo: function() {
    var currentSrc = this.status && this.status.currentsrc;
    if (!currentSrc) {
      return "N/A";
    }
    else {
      return SongUtils.getSongName(currentSrc);
    }
  }
});

//---------------------------//
//-- connection indicator ---//
//---------------------------//

Template.connection_indicator.helpers({
  connection_status: function() {
    var status = Meteor.connection.status();
    return status.connected ? "Connected" : "Disconnected";
  }
});
