var express = require('express');
var path = require('path');

/**
 * Controllers (route handlers).
 */

var controller = require('./controllers/main');


/**
 * Create Express server.
 */

var app = express();

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Routes
 */

app.get('/', controller.index);


/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});


module.exports = app;
