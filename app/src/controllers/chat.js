var express = require('express');
var app = express();
var session = require('express-session');
var router = express.Router();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var ChatModels = require('../models/chat');

router.get('/', function (req, res) {
	if (!req.session.user) 
		res.status(200).redirect("/");
	else
	{
		sess = req.session;
		ChatModels.get_chat_id(sess.user.id)
		.then (data => {
			var user = [];
			var j = 0;
			var i = 0;
			while (i < data.length) {
				if (data[i].blocked != null) {
					if (data[i].read_statut === 'red'){
						user[j] = data[i];
						user[j].login = 'utilisateur bloqué';
						j++; 
					}
					i++;
				}
				else {
					user[j] = data[i];
					j++;
					i++;
				}
			} 
				return (user);
			})
			.then (async user => {
			var chats = await user;
			res.render('chat.pug', {
				profil_pic : sess.photo,
				user_id: sess.user.id,
				login : sess.user.login,
				chats: chats,
				chat: "none"
			})
		})
	}
});

router.post('/conversation/:id_chat', function (req, res) {
	ChatModels.reset_read(sess.user.id, req.params.id_chat);
	res.status(200).send({redirect: "/chat/conversation/" + req.body.id});
});

router.post('/blocked_conversation', function (req, res) {
	ChatModels.reset_read(sess.user.id, req.body.id);
	res.status(200).send({});
});

router.get('/conversation/:id_chat', function (req, res) {
	if (!req.session.user)
		res.status(200).redirect("/");
	else
	{
		ChatModels.chat_exist(req.params.id_chat, sess.user.id)
		.then(data => {
			if (data == 0)
				res.status(200).redirect("/chat");
			else
			{
				sess = req.session;
		ChatModels.get_chat_id(sess.user.id)
		.then (data => {
			if (data[0]) {
				var user = [];
				var j = 0;
				var i = 0;
				while (i < data.length) {
					if (data[i].blocked != null) {
						if (data[i].read_statut === 'red'){
							user[j] = data[i];
							user[j].login = 'utilisateur bloqué';
							j++; 
						}
						i++;
					}
					else {
						user[j] = data[i];
						j++;
						i++;
					}
				} 
				ChatModels.get_history(req.params.id_chat)
				.then(history => {
					for (var i = 0; i < history.length; i++) {
						if (history[i].login == sess.user.login) {
							history[i].user2_login =  "col-md-9";
							history[i].user2_message = "col-md-5";
							history[i].backcol = "#d8d8d8";
						}
						else {
							history[i].backcol = "#f5c12d";
						}
					}
					ChatModels.get_login2(req.params.id_chat, sess.user.id)
					.then ( login2 => {
						res.render('chat.pug', {
							profil_pic : sess.photo,
							user_id: sess.user.id,
							login : sess.user.login,
							login2 : login2,
							chats: user,
							history: history, 
							id_user_chat : sess.user.id,
							chat: "display"
						});
					})
					
				})
			}
			else {
				res.render('chat.pug', {
					profil_pic : sess.photo,
					user_id: sess.user.id,
					login : sess.user.login,
					chats: data,
					id_user_chat : sess.user.id,
					chat: "display"
				});
			}
		})
			}

		})
		
	}
});




router.post('/history', function(req, res) {
	sess = req.session;
	ChatModels.save_message(req.body.id_chat , sess.user.id, req.body.message);
	res.status(200).send({sender_login : req.body.login,
						sender_msg : req.body.message });

})


module.exports = router;
