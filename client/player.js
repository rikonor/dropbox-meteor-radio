SongUtils = {
  getSongName: function(filename) {
    if (!filename) {
      return "N/A";
    }
    else {
      var pathParts = filename.split("/"),
          path = pathParts[pathParts.length-1],
          name = decodeURI(path).replace(".mp3", "");
      return name;
    }
  }
};

Player = function(audioElement) {
  if (!audioElement) {
    throw new Error("Please call this constructor with a valid 'audio' element.");
  }

  // root element
  this.audioElement = audioElement;

  // default settings
  this.audioElement.currentSrc = null;
  this.audioElement.volume = 0.2;
  this.audioElement.muted = false;

};

// src
Player.prototype.setCurrentSrc = function(path) {
  this.audioElement.currentSrc = path;
};

Player.prototype.getCurrentSrc = function() {
  return this.audioElement.currentSrc;
};

Player.prototype.getRandomSong = function() {
  var i = Math.floor(Math.random() * Songs.find().count());
  return Songs.find().fetch()[i];
};

// volume
Player.prototype.setVolume = function(volume) {
  this.audioElement.volume = volume;
};

Player.prototype.getVolume = function() {
  return this.audioElement.volume;
};

// mute
Player.prototype.mute = function() {
  this.audioElement.muted = true;
};

Player.prototype.unmute = function() {
  this.audioElement.muted = false;
};

Player.prototype.toggleMute = function() {
  if (!this.audioElement.muted) {
    this.mute();
  }
  else {
    this.unmute();
  }
};

// play
Player.prototype.play = function() {
  this.audioElement.play();
};

Player.prototype.pause = function() {
  this.audioElement.pause();
};

Player.prototype.togglePlay = function() {
  if (this.audioElement.paused) {
    this.play();
  }
  else {
    this.pause();
  }
};

Player.prototype.paused = function() {
  return this.audioElement.paused;
};

// time
Player.prototype.setCurrentTime = function(time) {
  this.audioElement.currentTime = time;
};

Player.prototype.getCurrentTime = function() {
  return this.audioElement.currentTime;
};

Player.prototype.getDuration = function() {
  return this.audioElement.duration;
};

