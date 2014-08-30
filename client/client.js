Meteor.subscribe('songs');

Meteor.startup(function() {
  player = new Player(document.getElementById('audio'));

  loadNext = function() {
    Session.set("currentSrc", player.getRandomSong().path);
  };
  setTimeout(loadNext, 1000);
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
  'click button#pause': function() {
    player.pause();
  },
  'click button#play': function() {
    player.play();
  },
  'click button#loadnext': function() {
    loadNext();
  },
  'change input#volume': function(e) {
    player.setVolume(e.target.value / 100);
  }
});