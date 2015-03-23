var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ _id:id }, function(err, user) {
    done(err, user);
  });
});

// Sign in using Username and Password.

passport.use(new LocalStrategy({ usernameField: 'username' }, function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (!user) return done(null, false, { message: 'Username ' + username + ' not found'});
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid username or password.' });
      }
    });
  });
}));

// Login Required middleware.
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
};