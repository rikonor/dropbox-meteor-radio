// Utils

defaultDropboxCreds = {
  key: "hmszotb9dwz2cpz",
  secret: "0oktwgqm6kjpa1o",
  token: "95pyx-gDahwAAAAAAAAFnN97dL-iHLkUWzH8AzgequGcrUcf5L7HttopEyNrpcnx"
};

DropboxUtils = {
  createClient: function(key, secret, token) {
    if (key === "" || secret === "" || token === "") {
      return undefined;
    }
    var client = new Dropbox.Client({
      key: key,
      secret: secret,
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
