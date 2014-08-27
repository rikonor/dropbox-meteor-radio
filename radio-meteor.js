// Utils

var DropboxUtils = {
  createClient: function() {
    var client = new Dropbox.Client({
      key: "hmszotb9dwz2cpz",
      secret: "0oktwgqm6kjpa1o",
      sandbox: false,
      token: "95pyx-gDahwAAAAAAAAFnN97dL-iHLkUWzH8AzgequGcrUcf5L7HttopEyNrpcnx"
    });
    return client;
  },
  getRootContent: function(client, callback) {
    client.readdir("/", callback);
  },
  mediaLinks: function(client, paths, callback) {
    async.map(paths, function(path, callback) {
      client.makeUrl(path, {download: true}, function(err, data) {
        if (err) { return callback(err); }
        callback(null, data.url);
      });
    }, callback);
  }
};

// Client

if (Meteor.isClient) {
  var songsList = [];

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

// Server

if (Meteor.isServer) {
  var songsList = [];

  Meteor.methods({
    getAllSongs: function() {
      return songsList;
    }
  });

  Meteor.startup(function () {
    var client = DropboxUtils.createClient();
    DropboxUtils.getRootContent(client, function(err, data) {
      if (err) { return console.log(err); }
      if (!data || data.length == 0) {
        return console.log("Root folder is empty.");
      }
      DropboxUtils.mediaLinks(client, data, function(err, data) {
        if (err) { return console.log(err); }
        if (!data || data.length == 0) {
          return console.log("Failed to get media links.");
        }
        songsList = data;
        console.log(songsList);
      });
    });
  });
}