var express = require('express');
var router = express.Router();
var _ = require('lodash');
var rooms = require('./data/rooms.json');
var messages = require('./data/messages.json');
var uuid = require('node-uuid');
var users = require('./data/users.json');

module.exports = router;


router.get('/rooms', function(req, res) {
	res.json(rooms);
});

router.route('/rooms/:roomId/messages')
.get(function(req, res) {
	var roomId = req.params.roomId;
	var roomMessages = messages
						.filter(m => m.roomId === roomId)
						.map(m => {
							var user = _.find(users, u => u.id == m.userId);
							return {text: user.name +" : "+ m.text}
						});



	var room = _.find(rooms, r => r.id == roomId);
    if (!room) {
    	console.log('!!!!!!!!!!!!!!!!!!!404 will be sent!!!!!!!!!!!!!!!');
    	// we can send a 404 error
        //res.sendStatus(404);
        // or we can send a customer error using next(err) and that err will be shown in the webpage
        //next("can't find this room"); // also we can get the full stack trace by passing new error()
        next(new Error("can\'t find this room"));
        return;
    }

    res.json({
    	room:room,
    	messages:roomMessages
    })

})
.post(function(req, res) {
	var roomId = req.params.roomId;
	var message = {
		roomId : roomId,
		text:req.body.text,
		userId:req.user.id,
		id:uuid.v4()
	}
	messages.push(message);
	res.sendStatus(200);
})
.delete(function(req, res) {
	var roomId = req.params.roomId;
	//messages = messages.filter(m => m.roomId !== roomId);
	//messages = _.remove(messages, m => m.roomId === roomId);
	messages = _.reject(messages, m => m.roomId === roomId);
	res.sendStatus(200);
});