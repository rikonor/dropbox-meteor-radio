// Server

Songs = new Meteor.Collection('songs');

if (Meteor.isServer) {

  var songsList = [];

  Meteor.methods({
    getAllSongs: function() {
      return songsList;
    }
  });

  Meteor.startup(function () {
    Songs.remove({});
    var client = DropboxUtils.createClient();
    DropboxUtils.getRootContent(client, Meteor.bindEnvironment(function(err, data) {
      if (err) { return console.log(err); }
      if (!data || data.length === 0) {
        return console.log("Root folder is empty.");
      }
      DropboxUtils.mediaLinks(client, data, Meteor.bindEnvironment(function(err, data) {
        if (err) { return console.log(err); }
        if (!data || data.length === 0) {
          return console.log("Failed to get media links.");
        }
        for (var i = 0; i < data.length; i++) {
          Songs.insert({path: data[i]});
        }
      }));
    }));
  });
}