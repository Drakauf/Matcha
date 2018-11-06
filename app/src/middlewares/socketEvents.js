var express = require('express');
var session = require('express-session');
var app = express();
var http = require('http').Server(app);

exports = module.exports = function(io) {		 


		io.on('connection', function(socket){
	  		socket.on('conversation', function(room){
			    socket.join(room);
	  		})
	  		socket.on('send message', function(room, msg, login) {
			    socket.broadcast.to(room).emit('private message', msg, login);
			});
			socket.on('log', function(id){
			     socket.join(id + "n");
			 });
	  		socket.on('to notif', function(room, type_not, chat_id) {
	  			if (type_not == "new_conversation") {
	  				socket.broadcast.to(room + "n").emit('new conversation', type_not, chat_id);
	  			}
	  			else {
	  				if (room != sess.user.id)
			    		socket.broadcast.to(room + "n").emit('new notif', type_not);
			    }
			});
  		})
		
};