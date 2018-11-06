var express = require('express');
var session = require('express-session');
var router = express.Router();
var bodyParser = require('body-parser');

var NewsModels = require('../models/news');

router.get('/', function (req, res) {
	var unmatch;
	var match;
	var viewers;
	var read;
	var match_back;
	sess = req.session;
	 if (!sess.user)
		   res.redirect("/");
	  else
		   {
				NewsModels.viewers(sess.user.id)
					.then(data => {
						var i = 0;
						while(i <  data.length) {
							if (data[i].blocked != null) {
								data[i].login = '';
								data[i].picture = 'https://image.flaticon.com/icons/png/512/237/237422.png';
							}
							i++;
						}
						return (data);
					})
					.then(async data => {
						viewers = await data;
						return (NewsModels.u_matched(sess.user.id, "match"));
					})
					.then(data => {
						var i = 0;
						while(i <  data.length) {
							if (data[i].blocked != null) {
								data[i].login = '';
								data[i].picture = 'https://image.flaticon.com/icons/png/512/237/237422.png';
							}
							i++;
						}
						return (data);
					})
					.then(async data =>
					{
						match = await data;
						return (NewsModels.u_matched(sess.user.id, "unmatch"));
					})
					.then(data => {
						var i = 0;
						while(i <  data.length) {
							if (data[i].blocked != null) {
								data[i].login = '';
								data[i].picture = 'https://image.flaticon.com/icons/png/512/237/237422.png';
							}
							i++;
						}
						return (data);
					})
					.then (data => {
						unmatch = data;
						return (NewsModels.u_matched(sess.user.id, "match_back"));
					})
					.then(data => {
						var i = 0;
						while(i <  data.length) {
							if (data[i].blocked != null) {
								data[i].login = '';
								data[i].picture = 'https://image.flaticon.com/icons/png/512/237/237422.png';
							}
							i++;
						}
						return (data);
					})
					.then (data => {
						match_back = data;
						if (!data[0])
							return;
					})
					.then (() => {
						NewsModels.reset_read(sess.user.id);
						res.render("news.pug", {
							read : read,
							profil_pic : sess.photo,
							user_id: sess.user.id,
							viewers : viewers,
							match : match,
							match_back : match_back,
							unmatch : unmatch,
						});
					})

									  }
});

module.exports = router;
