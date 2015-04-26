var passport = require('passport');
var moment = require('moment');
var User = require('../models/User');


exports.index = function(req, res) {
  res.render('index.ejs', {
	title : "Netter Center Directory",
	css_rels : [ "index.css" ],		
	js_files : [ "index.js" ]
  });
};

exports.validate = function(req, res, next) {
	// server side validation, maybe make this more specific
	req.assert('username', 'Your username is not a valid').len(4);
  req.assert('password', 'Your password is invalid').len(6);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/');
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      req.flash('errors', { msg: info.message });
      return res.redirect('/');
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect('/profile');
    });
  })(req, res, next);
};

exports.create_user = function(req, res, next) {
	console.log("in create user");
	req.assert('username', 'Username must be at least 4 characters long').len(4);
 	req.assert('password', 'Password must be at least 6 characters long').len(6);
 	req.assert('repassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/');
	}

  var user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  User.findOne({ username: req.body.username }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that username already exists.' });
      return res.redirect('/');
    }
    user.save(function(err) {
      if (err) return next(err);
      req.logIn(user, function(err) {
        if (err) return next(err);
        res.redirect('/create-profile');
      });
    });
  });
};

exports.create_profile_get = function(req, res) {
  res.render('create_profile.ejs', {
    title : "Create Profile",
    css_rels : ["nav.css", "create-profile.css", "jquery.tokenize.css"],
    js_files : ["create-profile.js", "search.js", "jquery.tokenize.js"]
  });
}

function stakeHolderParser(input) {
  switch(input) {
    case "students":
      return "Student";
    case "faculty":
      return "Faculty";
    case "community-members":
      return "Community Member";
    case "netter-staff":
      return "Netter Center Staff";
    case "alumni-patrons":
      return "Alumni or Patron";
  }
}

exports.create_profile_post = function(req, res, next) {
  // validation checks
  req.assert('name', 'Your name cannot be blank').notEmpty();
  req.assert('email', 'Your email cannot be blank').isEmail();
  req.assert('bio', 'Your bio cannot be blank').notEmpty();
  req.assert('phone', 'Your phone number is not valid').notEmpty();
  req.assert('hometown', 'Your phone number is not valid').notEmpty();
  //req.assert('password', 'Password must be at least 6 characters long').len(6);
  req.assert('stakeholder', 'Not a valid role').stakeholder();
  req.assert('image', 'Not a valid image').isURL();

  var errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    console.log("there were flash errrors");
    return res.redirect('/create-profile');
  }

  var stakeholder = stakeHolderParser(req.body.stakeholder);
  console.log(req.body.image);

  User.findOne({username: req.user.username}, function(err, current_user) {
    // not doing picture
    current_user.category = stakeholder;
    current_user.name = req.body.name;
    current_user.email = req.body.email;
    current_user.phone = req.body.phone;
    current_user.bio = req.body.bio;
    current_user.hometown = req.body.hometown;
    current_user.picture = req.body.image;
    current_user.updated = Date.now();
    current_user.created_profile = true;
    current_user.save(function(err) {
      if (err) {
        next(err)
      } else {
        res.redirect('/profile');
      }
    });
  });
}

exports.profile = function(req, res) {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var date = moment(req.user.updated);
  var user = {name: req.user.name,
              phone: req.user.phone,
              email: req.user.email,
              bio: req.user.bio,
              image: req.user.picture,
              last_updated: date.format("dddd, MMMM Do YYYY")
            };
  res.render('profile.ejs', {
	title : "Profile",
  user: user,
	css_rels : [ "nav.css", "profile.css" ],
	js_files : [ "search.js"]
  });
};

exports.search_results = function(req, res) {
  // put in parameter validation
  // check if sorted
  var query = req.params.query;
  var page = req.params.page;
  if (page == null) {
    page = 1;
  }
  data = [{
    username: "username1",
    category: "category1",
    name: "First Name11",
    picture: "http://consettmagazine.com/wp-content/uploads/2014/04/picnic1.jpg",
    bio: "I'm a bio.1",
  }, {
    username: "username2",
    category: "category2",
    name: "First Name2",
    picture: "http://consettmagazine.com/wp-content/uploads/2014/04/picnic1.jpg",
    bio: "I'm a bio.2",
  }];
  res.render('search-results.ejs', {
    title : "Results",
    css_rels : [ "nav.css", "search-results.css"],
    js_files : [ "search-results.js", "search.js"],
    results: data
  });
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};