var express = require('express');
var fs = require('fs');
var app = express();

var port = 8000;

// key = name of view file
// value = [title, unique css files, unique js files]
var view_list = {
	"create_profile" : [ "Create Profile", [], [] ],
	"create-account" : [ "Create Account", [], [] ],
	"error" : [ "Error", [], [] ],
	"footer" : [ "Footer", [], [] ],
	"header" : [ "Header", [], [] ],
	"index" : [ "Netter Center Directory", [ "index.css" ] ],
	"profile" : [ "Profile", [ "nav.css", "profile.css" ], [] ],
	"search" : [ "Search", [], [] ],
	"search-results" : [ "Search Results", ["nav.css", "search-results.css"], ["search-results.js"] ],
	"validate" : [ "Validate", [], [] ],
	"post" : [ "Posts", [], [] ]
};

app.use('/public', express.static(__dirname + '/public'));

app.locals = {
	title : 'Netter Center Directory',
	css_rels : [],
	js_files : []
};

// app.all('*', function(req, res, next) {
// 	fs.readFile('people.json', function(err, data) {
// 		// store posts locally
// 		res.locals.people = JSON.parse(data);
// 		next();
// 	});
// });

app.get('/', function(req, res) {
	res.render('index.ejs', {
		title : "Netter Center Directory",
		css_rels : [ "index.css" ],
		js_files : [ "index.js" ]
	});
});

app.get('/:file', function(req, res) {
	var file = req.params.file;
	// check if file is in view_list, and render if it is
	if (file in view_list) {
		info = view_list[file];
		res.render(file + '.ejs', {
			title : info[0],
			css_rels : info[1],
			js_files : info[2]
		});
	} else {
		res.render('error.ejs', {
			msg : "Page Not Found"
		})
	}
});

// eventually, this will sort through tags- right now the tag must be unique
app.get('/post/:slug', function(req, res, next) {
	// loop through all people
	var slug = req.params.slug;
	res.locals.people.forEach(function(person) {
		// check if tag exists
		if (person.tags.indexOf(slug) > -1) {
			res.render('post.ejs', {
				post : person
			});
		}
	})
});

app.post("/:slug", function(req, res) {
	if (req.params.slug == "validate" || req.params.slug == "create-account") {
		res.render('error.ejs', {
			msg : "Login and Registration Coming Soon"
		})
	}
});

app.listen(port);
console.log('app is listening at localhost:' + port);