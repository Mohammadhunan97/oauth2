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
		required: false //only needed for google Users
	}
})


module.exports = mongoose.model('User',UserSchema);