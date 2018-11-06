var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var UserModels = require('../models/user');
var Filter = require('../middlewares/Filter');
var Validator = require('../middlewares/Validator');
var Serializer = require('../middlewares/Serializer');


router.post('/geolocation',  Validator.session, function (req, res) {
	if (sess.user) {
		if (req.body.latLng)
			UserModels.geolocation(req, sess.user.id, req.body.latLng);
		res.render('home.pug');
	}
})

router.get('/', Validator.activated, Filter.no_filter, function (req, res) {
	sess = req.session;
	var online = "Utilisateurs en ligne";
	var filters = "none";
	var button_search = "display";
	var online_style = "none";
	if (sess.user && req.user_sort != "error")
	{
		res.render('home.pug', {
							user_id: sess.user.id,
							profil_pic: sess.photo,
							filters: filters,
							button_search: button_search,
							online: online,
							user: req.user_sort
		})
	}
	else if (sess.user) {
		res.render('home.pug', {
							user_id: sess.user.id,
							profil_pic: sess.photo,
							filters: filters,
							button_search: button_search,
							online: online,
		})
	}
	else
		res.render('home.pug', {
								profil_pic: sess.photo,
								filters: filters,
								online_style: online_style
							});
});


router.post('/autocomplete',  Validator.session, function (req, res) {
	UserModels.get("login")
	.then(result => {
		var login_list = [];
		for (var i = 0; i < result.length; i++)
			login_list.push(result[i].login)
		res.status(200).send({login_list: login_list});
	})
})

router.post('/home/search',  Validator.session, function (req, res) {
	if (sess.user) {
		UserModels.get_id(req.body.profil)
		.then (result => {
			if (!result[0]) {
				res.status(400);
				res.send("Profil inexistant");
			}
			else
				res.status(200).json({redirect: "/profil/" + result[0].id});
		})
		
	}
	else
		res.render('home.pug');
})

router.post('/',  Validator.session, function (req, res) {
	if (sess.user)
		res.status(200).json({redirect: "/"});
	else
		res.render('home.pug');
})

router.get('/home/connected',  Validator.session, Filter.no_filter, Filter.filter_connected, function (req, res) {
	sess = req.session;
	var online = "Tous les utilisateurs";
	var filters = "none";
	var button_search = "display";
	if (sess.user)
	{
		res.render('home.pug', {
							user_id: sess.user.id,
							profil_pic: sess.photo,
							filters: filters,
							button_search: button_search,
							online: online,
							user: req.user_sort
		})
	}
	else
		res.render('home.pug');

})

router.post('/home/connected', Validator.session, function (req, res) {
	if (sess.user)
		res.status(200).json({redirect: "/home/connected"});
	else
		res.render('home.pug');
})


router.post('/home/filters', Validator.session, function (req, res) {
	var filters = "visible";
	var button_search = "none";
	var filters = "display";
	if (sess.user)
		res.status(200).send({
								user_id: sess.user.id,
								profil_pic: sess.photo,
								filters: filters,
								button_search: button_search,
							});

})

router.get('/home/sort', Validator.session, function (req, res) {
	var filters = "visible";
	var button_search = "none";
	var filters = "display";
	var online_style = "none";
	if (sess.user)
		res.render('home.pug', {
								user_id: sess.user.id,
								online_style: online_style,
								profil_pic: sess.photo,
								filters: filters,
								button_search: button_search,
								user: sess.sort
							});
	else
		res.render('home.pug');

})

router.post('/home/sort_by_filter', Validator.session, Serializer.search, Validator.search, Filter.filter_parse, function (req, res) {
	sess = req.session;
	sess.sort = req.user_sort;
	if (sess.user)
		res.status(200).send({redirect: "/home/sort"});
})

module.exports = router;

