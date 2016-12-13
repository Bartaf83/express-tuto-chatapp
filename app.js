var express = require('express');
var app = express();
var bodyParser =  require('body-parser');
var passport = require('passport');
require('./passport-init');
var flash = require('connect-flash');


app.set("views", "./views");
app.set("view engine", "jade");

app.use(flash());

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

/*
(passport.initialize) is invoked on the request, it finds the "passport.user" attached to the session. 
If is doesn't (user is not yet authenticated) it creates it like req.passport.user = {}.
*/
app.use(passport.initialize());
/*
next passport.session is invoked. 
This middleware is a Passport Strategy invoked on every request. 
If it finds a serialised user object in the session, it will consider this request authenticated.
The "passport.session" middleware calls "passport.deserializeUser" we've setup.
Attaching the loaded user object to the request as "req.user".
*/

app.use(passport.session());

require('express-debug')(app, {/* settings */});


/*app.get('/flash', function(req, res){
  req.flash('info', 'Flash is back!')
  res.redirect('/');
});*/

var authRouter = require('./auth');
app.use(authRouter);


app.use(function(req, res, next){
	console.log('isAuthenticated ?? : ' + req.isAuthenticated());
	if(req.isAuthenticated()){
		res.locals.user = req.user;
		console.log('incomming req : ' + req.url);
		next();
		return;
	}
	res.redirect('/login');
});

app.get('/', function(req, res){
	res.render('home', {title:'Home'});
});


var adminRouter = require('./admin');
app.use("/admin", adminRouter);

var apiRouter = require('./api');
app.use("/api", apiRouter);

app.listen(3000, function(){
	console.log('app running on port 3000');
});


/*********/
app.get('/', function(req, res){

	settimeout(function(){
		throw new Error("oh no!");
		res.render('home', {title:'Home'});
	}, 1000);
	
});