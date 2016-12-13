var uuid = require('node-uuid');
var _ = require('lodash');
var express = require('express');
var router = express.Router();
var rooms = require('./data/rooms.json');


module.exports = router;

router.use(function(req, res, next){
	console.log('req.user.admin : ' + req.user.admin);
	if(req.user.admin){
		console.log('incomming req : ' + req.url);
		next();
		return;
	}
	res.redirect('/login');
});

router.get('/rooms', function(req, res) {
    res.render('rooms', {
        title: 'Rooms',
        rooms: rooms
    });
});

router.route('/rooms/add')
    .get(function(req, res) {
        res.render('add');
    }).post(function(req, res) {
        var room = {
            name: req.body.name,
            id: uuid.v4()
        };
        rooms.push(room);
        res.redirect(req.baseUrl + '/rooms');
    });
router.get('/rooms/delete/:id', function(req, res) {
    var roomid = req.params.id;
    rooms = rooms.filter(r => r.id != roomid);
    res.redirect(req.baseUrl + '/rooms');
});

router.use(function(req, res, next){
	console.log('##the route edit gonna start nowwwww######################### ');
	next();
});

router.route('/rooms/edit/:id')
.all(function(req, res, next) {
	console.log('!!!!!!!!! .all !!!!!!!!!!!!!!');
	var roomid = req.params.id;

	console.log('___roomid : ' + roomid);
    var room = _.find(rooms, r => r.id == roomid);
    if (!room) {
    	console.log('!!!!!!!!!!!!!!!!!!!404 will be sent!!!!!!!!!!!!!!!');
    	// we can send a 404 error
        //res.sendStatus(404);
        // or we can send a customer error using next(err) and that err will be shown in the webpage
        //next("can't find this room"); // also we can get the full stack trace by passing new error()
        next(new Error("can\'t find this room"));
        return;
    }
    res.locals.room = room;
    next();
}).get(function(req, res) {
	console.log('!!!!!!!!! .get !!!!!!!!!!!!!!');
    res.render('edit');
}).post(function(req, res) {
	console.log('!!!!!!!!! .post !!!!!!!!!!!!!!');
    res.locals.room.name = req.body.name;
    console.log('res.locals.room.name : ' + res.locals.room.name);
    res.redirect(req.baseUrl + '/rooms'); //or we can also
    //res.redirect('./'); // but this is not good because if we had http://localhost:3000/admin/rooms/add/ it will take us to /add
});
