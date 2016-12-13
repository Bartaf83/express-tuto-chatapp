var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash = require('connect-flash');
var users = require('./data/users.json');
var _ = require('lodash');

router.get('/login', function(req, res) {
	console.log('req.app.get("env"): ' + req.app.get("env"));
	if(req.app.get("env") == "development"){
		
		if(req.query.user){
			var user = _.find(users, u => u.name == req.query.user)
		} else {
			var user = users[0];
		}
		req.logIn(user, function(err){
            if(err){ return next(err); }
            return res.redirect("/");
        });
        return;
	}
    res.render('login');
});


// This is how passport is actually used (but the definition for the local strategy will be made elsewhere (in passport-init.js file))
/*router.post('/login',
    passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login' // redirect back to the login page if there is an error
    )
);*/
router.post("/login", function(req, res, next){
    passport.authenticate("local", function(err, user, info){

    	/* this is the done function indeed*/

        if(err){ return next(err);}
        if(!user){return res.render("login", {messages : info.messages})}
        req.logIn(user, function(err){
            if(err){ return next(err); }
            return res.redirect("/");
        })
    })(req, res, next);
})

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});
module.exports = router;
