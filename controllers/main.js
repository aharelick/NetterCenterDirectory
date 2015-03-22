exports.index = function(req, res) {
  res.render('index.ejs', {
	title : "Netter Center Directory",
	css_rels : [ "index.css" ],		
	js_files : [ "index.js" ]
  });
};

exports.validate = function(req, res) {

};

exports.profile = function(req, res) {
  res.render('index.ejs', {
	title : "Profile",
	css_rels : [ "nav.css", "profile.css" ],
	js_files : []
  });
};