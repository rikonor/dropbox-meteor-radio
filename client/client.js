Meteor.subscribe('songs', function() {
    Session.set('songs_loaded', true);
});

Meteor.startup(function() {
  player = new Player(document.getElementById('audio'));

  loadNext = function() {
    Session.set("currentSrc", player.getRandomSong().path);
  };

  var checkLoadedSongs = function() {
    console.log("Checking if songs collection is ready...");
    if (!Session.get('songs_loaded')) {
        console.log("Still not ready, checking again in 1s.");
        Meteor.setTimeout(checkLoadedSongs, 1000);
    }
    else {
        console.log("Songs collection ready, loading next song.");
        loadNext();
    }
  };
  checkLoadedSongs();

  player.audioElement.onended = loadNext;
});

Template.player.helpers({
  currentSrc: function() {
    return Session.get("currentSrc");
  },
  currentSrcName: function() {
    return SongUtils.getSongName(Session.get("currentSrc"));
  }
});

Template.player.events({
  'change input#volume': function(e) {
    player.setVolume(e.target.value / 100);
  }
});