var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var users = require('./data/users.json');
var _ = require('lodash');


passport.use(new LocalStrategy(function(username, password, done){
	 /*verification function in the local strategy.*/
	var user = _.find(users, u => u.name == username);
	/*
		Calling done will make the flow jump back into passport.authenticate.
		It's passed the error, user and additional info object (if defined).
	*/
	if(!user || user.password != password){
		console.log('no user found');
		done(null, false, {messages : "no such user" });
		return;
	}
	/*
		If the user was passed, the middleware will call "req.login" (a passport function attached to the request).

		This will call our "passport.serializeUser" method we've defined earlier. 
		This method can access the user object we passed back to the middleware. 
		It's its job to determine what data from the user object should be stored in the session. 

	*/
	done(null, user);	

}));


passport.serializeUser(function(user, done) {
	/*
		The result of the serializeUser method is attached to the session as 
			req.session.passport.user = { // our serialised user object // }.
		The result is also attached to the request as "req.user".

		Once done, our "requestHandler" is invoked. In the example the user is redirected to the homepage.
	*/
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	var user = _.find(users, u => u.id == id)
    done(null, user);
});