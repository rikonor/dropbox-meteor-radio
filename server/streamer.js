// Need to convert this one to a server player,
// sort of a streamer of current file path for clients to play and the current time to start at
Streamer = function() {

// TO GET SOME INSPIRATION
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
// audio.preload
// audio.readystate
// audio.seekable
// audio.seeking
// audio.volume = hell yea baby!

  
  this.queue = [];
  this.currentfile = null;

  return {
    clearList: function() {
      this.queue = [];
    },
    addToList: function(path) {
      this.queue.push(path);
    },
    getList: function() {
      return this.queue;
    },
    play: function() {
      this.audioElement.play();
    },
    pause: function() {
      this.audioElement.pause();
    },
    mute: function() {
      if (!this.audioElement.muted) {
        this.audioElement.muted = true;
      }
      else {
        this.audioElement.muted = false;
      }
    },
    playNext: function() {

    },
    playRandom: function() {

    }
  };
};