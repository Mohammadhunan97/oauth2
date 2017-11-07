///localhost:3000/auth/facebook/


const Router = require('express').Router(),
	passport = require('passport');
	passportSetup = require('./facebookpassport');




Router.get('/', passport.authenticate('facebook',{
	scope: ['public_profile']
}));
Router.get('/redirect',passport.authenticate('facebook'),(req,res) => {
	let html = '<p>successfully logged in with facebook</p><br/><a href="/user/'+req.user._id+'">Your Homepage</a>'
	res.send(html);
})


module.exports = Router;