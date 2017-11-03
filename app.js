const express 	   = require('express'), 
	app 	  	   = express(),
	mongoose  	   = require('mongoose'),
	passport  	   = require('passport'),
	GoogleStrategy = require('passport-google-oauth20'),
	bodyParser	   = require('body-parser'),
	session 	   = require('express-session');
	key 	  	   = require('./key'),
	User 		   = require('./userschema'),
	db			   = 'mongodb://localhost/oauthapp',
	port		   = process.env.PORT || 3000,
	c 		  	   = console.log;

mongoose.connect(db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: key.encryptionKey }));

app.use(passport.initialize());
app.use(passport.session());


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


app.get('/',(req,res) => {
	let html = '<a href="/auth/google" style="background:#e74c3c; color: white; padding:5px;"> Sign in with Google</a>';
	res.send(html);
})

app.get('/auth/google', passport.authenticate('google',{
	scope: ['profile']
}));
app.get('/auth/google/redirect',passport.authenticate('google'),(req,res) => {
	let html = '<p>successfully logged in with google</p><br/><a href="/user/'+req.user._id+'">Your Homepage</a>'
	res.send(html);
})

app.get('/user/:id',(req,res) => {
	if(req.isAuthenticated()){
		let html = '<p> welcome to your homepage '+req.user.username+'</p><br/> <p> you are '+req.user.age+' years old</p> <a href="/logout/">logout</>'
		res.send(html);
	}else{
		res.redirect('/');
	}
})
app.get('/logout',(req,res) => {

	 req.logout();
  	 res.redirect('/'); //Can fire before session is destroyed?
})

app.get('/user/',(req,res)=> {
	User.find({}).exec((err, user) =>{ 
		if(!err) res.send(user);
	});
})
app.post('/user/new',(req,res) => {
	let newuser 	 = new User;
	newuser.username = req.body.username;
	newuser.age 	 = req.body.age;
	newuser.save((err, user) => {
		if(err) res.send(err);
		res.send(user);
	})
})
app.put('/user/update/:id',(req,res) => {
	User.findById(req.params.id,(err,user) => {
		if(!err) {
			user.username = req.body.username || user.username;
			user.age      = req.body.age	  || user.age;

			user.save((err,user)=> {
				if(err) res.send(err);
				res.send(user);
			})
		}
	})
})
app.delete('/user/delete/:id',(req,res) => {
	User.findByIdAndRemove(req.params.id,(err,user) => {
		if(err) res.send(err);
		res.send(user);
	})
})


app.listen(port, ()=> c('listening on port:',port));