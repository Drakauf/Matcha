var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');

var NewsModels = require('../models/news');
var ChatModels = require('../models/chat');

router.post('', function (req, res) {
	sess = req.session;
	if (sess.user) {
		var nb_notifs;
		NewsModels.nb_notifs(sess.user.id)
		.then(data => {
			var nb_notifs = data;
			NewsModels.nb_notifs_chat(sess.user.id)
			.then(data => {
				res.status(200).send({nb_notifs: nb_notifs, nb_notifs_chat: data});
			})
		})
	}
});

router.post('/connection', function (req, res) {
	sess = req.session;
	if (sess.user) {
		res.status(200).send({id: sess.user.id});
	}
});

router.post('/chat', function (req, res) {
	sess = req.session;
	if (sess.user) {
		ChatModels.get_receiver(sess.user.id, req.body.id_chat)
		.then(id_receiver => {
			res.status(200).send({id_receiver: id_receiver});
		})
	}
});

router.post('/save', function (req, res) {
	if (sess.user) {
		var msg;
		if (req.body.type == 'visited')
			msg = '';
	}
});

module.exports = router;
