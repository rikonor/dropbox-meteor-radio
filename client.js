var SongsUtil = {
  getAllSongs: function(callback) {
      Meteor.call('getAllSongs', function(err, data) {
      if (err) { return callback(err); }
      callback(null, data);
    });  
  },
  getRandomSong: function(songsList) {
    var i = Math.floor(Math.random() * songsList.length);
    return songsList[i];
  }
};

// Client

if (Meteor.isClient) {
  var songsList = [];

  setTimeout(function() {
    SongsUtil.getAllSongs(function(err, data) {
      if (err) { return console.log(err); }
      if (!data || data.length == 0) { return console.log("No songs found."); }
      songsList = data;
    });
  }, 2000);

  // Session.setDefault("currentSong", songsList[0] || undefined)

  Template.player.helpers({
    currentSong: function () {
      return Session.get("currentSong") || "N/A";
    }
  });

  Template.player.events({
    'click button': function () {
      Session.set("currentSong", SongsUtil.getRandomSong(songsList));
    }
  });
}