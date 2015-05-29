var passport = require('passport');
var moment = require('moment');
var _ = require('underscore');
var async = require('async');
var User = require('../models/User');
var Tag = require('../models/Tag');


exports.index = function(req, res) {
  res.render('index.ejs', {
    title : "Netter Center Directory"
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
  // check to make sure
  req.asert('username', 'Username must be at least 4 characters long').len(4);
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
    js_files : ["create-profile.js", "search.js", "jquery.tokenize.js", "validate.js"]
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
    case "alumni-friends":
    return "Alumni & Friends";
  }
}

function stakeHolderCategories(input) {
  switch(input) {
    case "students":
    return ["Experience", "Program/Group", "Site"];
    case "faculty":
    return ["Department", "Courses Taught", "Research Interests"];
    case "community-members":
    return ["Professional Skills", "Program Interests", "Group/Netter Involvement"];
    case "netter-staff":
    return ["Position/Role", "Projects/Specific Involvements", "Professional Skills"];
    case "alumni-friends":
    return ["Professional Skills", "Areas of Interest", "Projects/Specific Involvement w/ Netter"];
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
  var tagsObject = [];
  var allTags = [];
  var stakeholder = stakeHolderParser(req.body.stakeholder);
  var categories = stakeHolderCategories(req.body.stakeholder);
  async.series([
    function(callback) {
      // we should probably do validation on the tags
      tags1 = JSON.parse(req.body.tags1);
      tags2 = JSON.parse(req.body.tags2);
      tags3 = JSON.parse(req.body.tags3);
      tagsObject.push({category: categories[0], tags: tags1});
      tagsObject.push({category: categories[1], tags: tags2});
      tagsObject.push({category: categories[2], tags: tags3});
      allTags = _.union(tags1, tags2, tags3);
      callback();
    },
    function(callback) {
      User.findOne({username: req.user.username}, function(err, current_user) {
        current_user.stakeholder = stakeholder;
        current_user.name = req.body.name;
        current_user.email = req.body.email;
        current_user.phone = req.body.phone;
        current_user.bio = req.body.bio;
        current_user.hometown = req.body.hometown;
        current_user.picture = req.body.image;
        current_user.updated = Date.now();
        current_user.tags = tagsObject;
        current_user.created_profile = true;
        current_user.save(function(err) {
          if (err) {
            callback(err)
          } else {
            callback();
          }
        });
      });
    },
    function(callback) {
      async.each(allTags, function(tag, each_callback) {
        Tag.findOne({name: tag}, function(err, current_tag) {
          if (err) {
            each_callback(err);
          } else if (current_tag) {
            current_tag.users.push(req.user._id);
            current_tag.save(function(err) {
              if (err) {
                each_callback(err);
              } else {
                each_callback();
              }
            });
          } else {
            var new_tag = new Tag({
              name: tag,
              users: [req.user._id],
            });
            new_tag.save(function(err) {
              if (err) {
                each_callback(err);
              } else {
                each_callback();
              }
            });
          }
        });
      }, function(err) {
        if(err) {
          callback(err);
        } else {
          callback();
        }
      });
    }
  ],
  function(err, results) {
    if (err) {
      next(err);
    } else {
      res.redirect('/profile');
    }
  });
}

exports.profile = function(req, res, next) {
  // TODO compress the two res.redners into one async callback or promise
  var username = req.params.username;
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var date;
  var user = {};
  if (username === req.user.username) {
    date = moment(req.user.updated);
    user = {
      name: req.user.name,
      phone: req.user.phone,
      email: req.user.email,
      bio: req.user.bio,
      image: req.user.picture,
      hometown: req.user.hometown,
      tags: req.user.tags,
      last_updated: date.format("dddd, MMMM Do YYYY"),
      stakeholder_group: req.user.stakeholder
    };
    res.render('profile.ejs', { title : "Profile", user: user});
  } else {
    User.findOne({username: username}, function(err, result_user) {
      if (result_user == null) {
        return next("That is not a valid username");
      }
      date = moment(result_user.updated);
      user = {
        name: result_user.name,
        phone: result_user.phone,
        email: result_user.email,
        bio: result_user.bio,
        image: result_user.picture,
        hometown: result_user.hometown,
        tags: result_user.tags,
        last_updated: date.format("dddd, MMMM Do YYYY"),
        stakeholder_group: result_user.stakeholder
      };
      res.render('profile.ejs', { title : "Profile", user: user});
    });
  }
};

exports.search_results = function(req, res, next) {
  // put in parameter validation
  var query = req.query.query;
  // var page = req.params.page;
  // if (page == null) {
  //   page = 1;
  // }
  var user = {image: req.user.picture}
  Tag.findOne({name: query}).populate('users', '-password').exec(function(err, result) {
    if (err) {
      next(err);
    } else if (result === null) {
      res.render('search-results.ejs', {
        title : "Results",
        user: user,
        query: query,
        count: 0,
        results: []
      });
    } else {
      res.render('search-results.ejs', {
        title : "Results",
        user: user,
        query: query,
        count: result.users.length,
        results: result.users
      });
    }
  });
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
