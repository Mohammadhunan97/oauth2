const express 	   = require('express'), 
	app 	  	   = express(),
	mongoose  	   = require('mongoose'),
	passport  	   = require('passport'),
	// GoogleStrategy = require('passport-google-oauth20'),
	bodyParser	   = require('body-parser'),
	session 	   = require('express-session'),
	bcrypt 		   = require('bcryptjs'),
	key 	  	   = require('./key'),
	User 		   = require('./userschema'),
	googleRoutes   = require('./googleroutes'),
	facebookRoutes = require('./facebookroutes'),
	localRoutes    = require('./localroutes'),
	db			   = 'mongodb://localhost/oauthapp',
	port		   = process.env.PORT || 3000,
	c 		  	   = console.log;

mongoose.connect(db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: key.encryptionKey }));

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth/google/',googleRoutes);
app.use('/auth/facebook/',facebookRoutes);
app.use('/user/',localRoutes);

app.get('/',(req,res) => {
	res.sendFile(__dirname + '/index.html');
})

app.get('/newlocallogout',(req,res)=>{
	req.session.localUser = null;
	res.redirect('/');
})

app.post('/login',(req,res)=>{
	User.find({username: req.body.username},(err,user)=>{
		console.log(user);
		console.log("/n",req.body);
		if(user.length === 0){
			res.redirect("/");
		}else{
			if(bcrypt.compareSync(req.body.password, user[0].password)){
				req.session.localUser = user[0];
				res.redirect("/user/"+user[0]._id);
			}else{
				res.redirect("/");
			}
		}
	})
})


app.listen(port, ()=> c('listening on port:',port));