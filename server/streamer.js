// Need to convert this one to a server player,
// sort of a streamer of current file path for clients to play and the current time to start at

// Currently the project as a whole does not use this module.

Streamer = function() {
  
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