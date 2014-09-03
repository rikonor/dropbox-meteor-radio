//-----------------
//-- Collections --
//-----------------

Meteor.publish('songs', function() {
  return Songs.find({});
});

Meteor.publish("userData", function () {
  return Meteor.users.find({});
});

//------------
//-- Server --
//------------

var insertSongs = function(paths) {
  for (var i = 0; i < paths.length; i++) {
    Songs.insert({path: paths[i]});
  }
};

var updateSongsCollection = function() {
  console.log("Updating the songs collection.");

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
      console.log("Found", data.length, "songs. Inserting now.");
      insertSongs(data);
      return data.length;
    }));
  }));
};

Meteor.methods({
  updateSongsCollection: updateSongsCollection
});

Meteor.startup(function () {
  // Dropbox links expire after 4 hours, so update the collection every 3.5 hours just to be safe.
  Meteor.setInterval(updateSongsCollection, 3.5 * 3600 * 1000);
  updateSongsCollection();
});
