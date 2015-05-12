var express = require('express');
var path = require('path');
var fs = require('fs');
var session = require('express-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var methodOverride = require('method-override');
var _ = require('lodash');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
var mongoose = require('mongoose');
var passport = require('passport');

/**
 * Controllers (route handlers).
 */

var controller = require('./controllers/main');

/**
 * Create Express server.
 */

var app = express();

/**
 * Connect to MongoDB.
 */

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/NetterCenterDirectory');
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

var pass = require('./config/pass');

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator({
	customValidators: {
	    stakeholder: function(param) {
	        return param === "students" || param === "faculty" || param === "community-members" || 
	        param === "netter-staff" || param === "alumni-friends";
	    }
 	}   
}));
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET || 'temp',
  store: new MongoStore({ 
  	url: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/NetterCenterDirectory', 
  	touchAfter: 24 * 3600,
  	ttl: 7 * 24 * 3600,
  	autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Routes
 */

// There's probably a better way to do this twice
function toCreateProfile(req, res, next) {  
    if (req.user.created_profile) {
        next();
    } else {
        res.redirect('/create-profile');
    }
};

function toProfile(req, res, next) {
	if (!req.user.created_profile) {
        next();
    } else {
        res.redirect('/profile');
    }
}

function profileRedirect(req, res, next) {
	res.redirect('/profile/' + req.user.username);
}

app.get('/', controller.index);
app.get('/index', controller.index);
app.get('/logout', controller.logout);
app.post('/validate', controller.validate);
app.post('/create-user', controller.create_user);
app.get('/create-profile', pass.isAuthenticated, toProfile, controller.create_profile_get);
app.post('/create-profile', pass.isAuthenticated, toProfile, controller.create_profile_post);
app.all('*', pass.isAuthenticated, toCreateProfile);
app.get('/profile', profileRedirect);
app.get('/profile/:username', controller.profile);
app.get('/search-results', controller.search_results);



/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;