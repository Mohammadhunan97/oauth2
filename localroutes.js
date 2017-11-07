//http://localhost:3000/user/<Route>
const Router 	= require('express').Router(),
	User     	= require('./userschema'),
	bcrypt 		= require('bcryptjs'),
	salt 		= bcrypt.genSaltSync(10);


Router.get('/:id',(req,res) => {
	if(req.isAuthenticated() && req.user._id == req.params.id) {
		let html = '<p> welcome to your homepage '+req.user.username+'</p><br/> <p> you are '+req.user.age+' years old</p> <a href="/user/logout/">logout</>'
		res.send(html);
	}else if(req.session.localUser){
		let html = '<p> welcome to your local user homepage '+req.session.localUser.username+'</p><br/> <p> you are '+req.session.localUser.age+' years old</p>  <br/> <a href="/newlocallogout/">new local logout</a>';

		res.send(html);
	}else{
		res.redirect('/');
	}
})

Router.get('/logout',(req,res) => {
	 req.logout();
  	 res.redirect('/'); //Can fire before session is destroyed?
})


Router.post('/new',(req,res) => {
	let newuser 	 = new User;
	if(req.body.username && req.body.password && req.body.age) {
		newuser.username = req.body.username;
		newuser.password = bcrypt.hashSync(req.body.password,salt); 
		newuser.age 	 = req.body.age;
		newuser.save((err, user) => {
			if(err) res.send(err);
			req.session.localUser = user;
			res.send('<a href="/user/'+user._id+'">Homepage</a>')
		})
	}else{ 
		res.redirect('/unable');
	}
})
Router.put('/update/:id',(req,res) => {
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
Router.delete('/delete/:id',(req,res) => {
	User.findByIdAndRemove(req.params.id,(err,user) => {
		if(err) res.send(err);
		res.send(user);
	})
})


module.exports = Router;