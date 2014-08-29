/* Collections */

// Songs
Songs = new Meteor.Collection('songs');

// CurrentSong
// The users only need to have access to a current song (or possibly a coming up song as well to buffer)
CurrentSong = new Meteor.Collection('current_song');

// Users
// Should be covered by a package

// Messages
Messages = new Meteor.Collection('messages');


/* Rules */

// Songs
// Since the server acts as a stremer the users should have no direct access to the songs collection

// CurrentSong
// Users shouldn't be able to directly change the current song

// Users
// Package?

// Messages