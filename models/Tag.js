var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
	name: String,
	users: [{type: Schema.Types.ObjectId, ref: 'User'}]

});

module.exports = mongoose.model('Tag', userSchema);
