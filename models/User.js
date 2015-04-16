var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: { type: String, unique: true},
  password: String,
  category: String,
  name: String,
  email: String,
  picture: String,
  phone: String,
  bio: String,
  updated: {type: Date, default: Date.now},
  created_profile: { type: Boolean, default: false},
  tags: [
    {
      type: String,
      tags: [{ type: String}]
    }
  ]
});

/**
 * Password hashing Mongoose middleware.
 */

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) { return next(); }

  bcrypt.genSalt(5, function(err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validationg user's password.
 */

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
