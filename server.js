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
      if (!data || data.length === 0) {
        return console.log("Root folder is empty.");
      }
      DropboxUtils.mediaLinks(client, data, function(err, data) {
        if (err) { return console.log(err); }
        if (!data || data.length === 0) {
          return console.log("Failed to get media links.");
        }
        songsList = data;
      });
    });
  });
}