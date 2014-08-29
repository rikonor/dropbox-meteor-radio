SongsUtil = {
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

// audio.muted
// audio.autoplay
// audio.currentSrc
// audio.currentTime - can change the current time
// audio.duration
// audio.ended
// audio.dispatchEvent, what is this?
// audio.load ??
// audio.onplay
// audio.onplaying
// audio.onprogress
// audio.played ?
// audio.preload - should be set to auto so that the browser starts caching as soon as possible
// audio.readystate
// audio.seekable
// audio.seeking
// audio.volume = hell yea baby!

// player state
// actions (play, pause, stop, mute, volume?)
// playlist queue
// playNext
// playRandom

Player = function(audioElement) {
  if (!audioElement) {
    throw new Error("Please call this constructor with a valid 'audio' element.");
  }

  this.audioElement = audioElement;

  // Default settings
  this.audioElement.currentSrc = null;
  this.audioElement.volume = 0.5;
  this.audioElement.muted = false;

  return {
    // current src
    setCurrentSrc: function(path) {
      this.audioElement.currentSrc = path;
    },
    getCurrentSrc: function() {
      return this.audioElement.currentSrc;
    },
    // volume
    setVolume: function(volume) {
      this.audioElement.volume = volume;
    },
    getVolume: function() {
      return this.audioElement.volume;
    },
    // mute
    mute: function() {
      this.audioElement.muted = true;
    },
    unmute: function() {
      this.audioElement.muted = false;
    },
    toggleMute: function() {
      if (!this.audioElement.muted) {
        this.mute();
      }
      else {
        this.unmute();
      }
    },
    // play
    play: function() {
      this.audioElement.play();
    },
    pause: function() {
      this.audioElement.pause();
    },
    togglePlay: function() {
      if (this.audioElement.paused) {
        this.play();
      }
      else {
        this.pause();
      }
    },
    // time
    setCurrentTime: function(time) {
      this.audioElement.currentTime = time;
    },
    getCurrentTime: function() {
      return this.audioElement.currentTime;
    },
    getDuration: function() {
      return this.audioElement.duration;
    }
  };
};