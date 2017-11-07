const passport 	   = require('passport'),
	GoogleStrategy = require('passport-google-oauth20'),
	key			   = require('./key'),
	User 		   = require('./userschema');

passport.serializeUser((user,done)=>{
	// requests data by identifying user id
	done(null,user.id); //passes id to later stuff it in a cookie
})

passport.deserializeUser((id,done) => {		
	// next step is to take the id, and 
	User.findById(id).then((user)=>{
		done(null,user); // takes the user and stuffs it into the cookie
	})
})


passport.use(new GoogleStrategy({
	clientID: key.google.client_ID,
	clientSecret: key.google.client_secret,
	callbackURL: '/auth/google/redirect'
},(accessToken,refreshToken,profile,done) => {
	User.findOne({ googleid: profile.id }).then((currentuser) => {
		if(currentuser) {
			done(null,currentuser);
		}else{
			let newuser = new User;
			newuser.googleid = profile.id;
			newuser.username = profile.displayName;
			newuser.age = Math.floor(Math.random() * (100 - 14) + 14);
			newuser.save().then((thenewuser) => {
				done(null,thenewuser);
			})
		}
	})
}))