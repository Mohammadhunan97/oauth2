const mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

let UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	age: {
		type: Number,
		required: false
	},
	googleid: {
		type: Number,
		required: false //only needed for google users
	},
	facebookid: {
		type: Number,
		required: false //only needed for facebook users
	},
	password: {
		type: String,
		required: false //only required for local users
	}
})


module.exports = mongoose.model('User',UserSchema);