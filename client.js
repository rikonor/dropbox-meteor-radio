var SongsUtil = {
  getAllSongs: function(callback) {
      Meteor.call('getAllSongs', function(err, data) {
      if (err) { return callback(err); }
      callback(null, data);
    });  
  },
  getRandomSong: function() {
    var i = Math.floor(Math.random() * Songs.find().count());
    return Songs.find().fetch()[i];
  }
};

// Client

if (Meteor.isClient) {
  
  Template.player.helpers({
    songName: function () {
      if (!Session.get("currentSong")) {
        return "N/A";
      }
      else {
        var pathParts = Session.get("currentSong").split("/"),
            path = pathParts[pathParts.length-1],
            name = decodeURI(path);
        return name;
      }
    },
    currentSong: function () {
      return Session.get("currentSong") || "N/A";
    },
    playerState: function() {
      return Session.get("playerState") || "";
    }
  });

  Template.player.events({
    'click button#pause': function () {
      document.getElementById('audio').pause();
    },
    'click button#play': function () {
      document.getElementById('audio').play();
    },
    'click button#loadnext': function () {
      Session.set("currentSong", SongsUtil.getRandomSong().path);
    }
  });
}