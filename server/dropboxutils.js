// Utils

defaultDropboxCreds = {
  token: "95pyx-gDahwAAAAAAAAFnN97dL-iHLkUWzH8AzgequGcrUcf5L7HttopEyNrpcnx"
};

DropboxUtils = {
  createClient: function(token) {
    if (token === "") {
      return undefined;
    }
    var client = new Dropbox.Client({
      sandbox: false,
      token: token
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
