///localhost:3000/auth/google/


const Router = require('express').Router(),
	passport = require('passport'),
	passportSetup = require('./googlepassport');




Router.get('/', passport.authenticate('google',{
	scope: ['profile']
}));
Router.get('/redirect',passport.authenticate('google'),(req,res) => {
	let html = '<p>successfully logged in with google</p><br/><a href="/user/'+req.user._id+'">Your Homepage</a>'
	res.send(html);
})


module.exports = Router;