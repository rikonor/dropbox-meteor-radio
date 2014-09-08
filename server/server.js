//-----------------
//-- Collections --
//-----------------

Meteor.publish('songs', function() {
  return Songs.find({});
});

Meteor.publish("users", function () {
  return Meteor.users.find({});
});

Meteor.users.allow({
  update: function(userId, doc, fields, modifier) {
    return doc._id === userId;
  }
});

//------------
//-- Server --
//------------

var insertSongs = function(paths) {
  for (var i = 0; i < paths.length; i++) {
    Songs.insert({path: paths[i]});
  }
};

var collectDropboxCreds = function() {
  var dropboxCreds = [];

  users = Meteor.users.find({'services.dropbox': {$exists: 1}}).fetch();
  users.forEach(function(user) {
    var cred = user.services.dropbox;
    cred.username = user.username;
    dropboxCreds.push(cred);
  });

  if (dropboxCreds.length === 0) {
    dropboxCreds.push(defaultDropboxCreds);
  }
  return dropboxCreds;
};

var updateSongsCollection = function() {
  console.log("Updating the songs collection.");

  Songs.remove({});

  var dropboxCreds = collectDropboxCreds();

  dropboxCreds.forEach(function(cred) {
    var client = DropboxUtils.createClient(cred.token);
    if (client === undefined) {
      console.log("Improper credentials: ", cred.username);
      return;
    }
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
        console.log("Found", data.length, "songs. Inserting now (" + cred.username + ")");
        insertSongs(data);
        return data.length;
      }));
    }));
  });
};

Meteor.methods({
  updateSongsCollection: updateSongsCollection
});

Meteor.startup(function () {
  // Dropbox links expire after 4 hours, so update the collection every 3.5 hours just to be safe.
  Meteor.setInterval(updateSongsCollection, 3.5 * 3600 * 1000);
  updateSongsCollection();
});
