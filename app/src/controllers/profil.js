var express = require('express');
var app = express();
var router = express.Router();
var session = require('express-session');
var timediff = require('timediff');
var moment = require('moment');


var ProfilModels = require("../models/profil");
var LoginModels = require('../models/login');
var UserModels = require('../models/user');


router.get('', function (req, res) {
	res.redirect("/");
});

router.post('/geolocalisation', function (req, res) {
	if (sess.user) {
		UserModels.get_ip_coordonates(req.body.id)
		.then (latLng => {
			res.status(200).send({lat : latLng[0].ip_latitude , lng : latLng[0].ip_longitude });
		})
	}
});


router.post('/unmatch', function (req, res){
	if (req.body.id_matched == sess.user.id)
		res.status(200).json({success: "no"});
	else
	{
		ProfilModels.add_points(req.body.id_matched, -36);
		ProfilModels.unmatch(sess.user.id, req.body.id_matched);
		res.status(200).json({success: "yes"});
	}
});


router.post('/match', function (req, res){
	if (req.body.id_matched == sess.user.id)
		res.status(200).json({success: "no"});
	else
	{
		ProfilModels.add_points(req.body.id_matched, 10);
		ProfilModels.match(sess.user.id, req.body.id_matched);
		res.status(200).json({success: "yes"});
	}
});

router.post('/block', function (req, res){
	if (req.body.id_matched == sess.user.id)
		res.status(200).json({success: "no"});
	else
	{
		ProfilModels.block(sess.user.id, req.body.id_matched);
		res.status(200).json({success: "yes"});
	}
});


router.post('/report', function (req, res){
	if (req.body.id_matched == sess.user.id)
		res.status(200).json({success: "no"});
	else
	{
		ProfilModels.report(sess.user.id, req.body.id_matched);
		res.status(200).json({success: "yes"});
	}
});

router.post('/message', function(req, res){
	if (req.body.id_matched == sess.user.id)
		res.status(200).json({success: "no"});
	else
	{
		ProfilModels.chat_exist(sess.user.id, req.body.id_matched)
			.then(data =>
					{
						if (data == "no")
						{
							ProfilModels.add_points(req.body.id_matched, 15);
							ProfilModels.create_chat(sess.user.id, req.body.id_matched)
								.then(data => {
									res.status(200).json({success: "yes", chat_id: data});
								})

						}
						else
						{
							res.status(200).json({success: "yes", chat_id: data});
						}
					})
	}
});

router.get('/:user_id', function (req, res){
	var pprof;
	var desc1;
	var desc2;
	var desc3;
	var desc4;
	var city;

	var lname;
	var fname;
	var login;
	var dob;
	var gender;
	var	affinite;
	var ip_city; 
	var ip_zip ; 
	var bio;
	var pts;
	var lastSeen;
	var matched;
	var matchme;
	var itsme;
	var ireported;
	var tags;
	sess = req.session;
	if (!sess.user)
		res.status(200).redirect("/");
	else
	{
		ProfilModels.im_blocked(sess.user.id, req.params.user_id)
			.then(data =>{
				if (data != 0)
					return	res.status(200).redirect("/");
				else
				{
					ProfilModels.user(req.params.user_id)
						.then(data => {
							if (data.length == 0)
								res.redirect("/");
							else 
							{
								lname = data.last_name;
								fname = data.first_name;
								login = data.login;
								ip_latitude = data.ip_latitude; 
								ip_longitude = data.ip_longitude;
								ip_city = data.ip_city
								ip_zip = data.ip_zip;
								dob = moment().diff(moment(data.birth_date, 'YYYYMMDD'), 'years');
								if (data.gender == null)
									gender = "N/A";
								else
									gender = data.gender;
								if (data.affinity == null)
									affinite = "N/A";
								else
									affinite = data.affinity;
								bio = data.biography;
								pts = data.sexappeal;
								if (data.last_seen == null)
									lastSeen = "En ligne";
								else
								{
									lastSeen = timediff(data.last_seen, new Date(), 'YMWDHms');
									if (lastSeen.years)
										lastSeen = lastSeen.years + " annee";
									else if (lastSeen.months)
										lastSeen = lastSeen.months + " moiss";
									else if (lastSeen.weeks)
										lastSeen = lastSeen.weeks + " semaines";
									else if (lastSeen.days)
										lastSeen = lastSeen.days + " jours";
									else if (lastSeen.hours)
										lastSeen = lastSeen.hours + " heures";
									else
										lastSeen = lastSeen.minutes + " minutes";
								}
								return (LoginModels.photo(req.params.user_id));
							}
						})
					.then(data =>{
						if (data){
							pprof = data;
							return (ProfilModels.desc(req.params.user_id, 1));}
					})
					.then(data =>{
						if (data){
							desc1 = data;
							return (ProfilModels.desc(req.params.user_id, 2));}
					})
					.then(data =>{
						if (data){
							desc2 = data;
							return (ProfilModels.desc(req.params.user_id, 3));}
					})
					.then(data =>{
						if (data){
							desc3 = data;
							return (ProfilModels.desc(req.params.user_id, 4));}
					})
					.then(data =>{
						if (data){
							desc4 = data;
							return (ProfilModels.city(req.params.user_id));}
					})
					.then(data => {
						if (data){
							city = data;
							return (ProfilModels.my_matching(sess.user.id, req.params.user_id));}
					})
					.then(data => {
						if (data == 0 || data == 1){
							matched = data;
							return (ProfilModels.is_matching_me(sess.user.id, req.params.user_id));}
					})
					.then(data => {
						if (data == 0 || data == 1){
							matchme = data;
							return (ProfilModels.i_reported(sess.user.id, req.params.user_id));}
					})
					.then(data => {
						if (data == 0 || data == 1){
							ireport = data;
							return (UserModels.get_tags(req.params.user_id));}
					})
					.then(data => {
						if (data){
							if (data.length == 0)
								tags = 0;
							else
								tags = data;
							itsme = 0;
							if (sess.user.id != req.params.user_id)
							{
								itsme = 1;
								ProfilModels.add_points(req.params.user_id, 1);
								ProfilModels.view(sess.user.id, req.params.user_id);
							}
							res.render('profil.pug', {
								user_id: sess.user.id,
								profil_pic : sess.photo,	
								ip_city : ip_city,
								ip_zip : ip_zip,
								pprof : pprof,
								desc1 : desc1,
								desc2 : desc2,
								desc3 : desc3,
								desc4 : desc4,
								city : city,
								lname : lname,
								fname : fname,
								login : login,
								dob : dob + ' ans',
								gender : gender,
								affinite : affinite,
								bio : bio,
								pts : pts + ' pts',
								last_seen : lastSeen,
								matched: matched,
								matchme: matchme,
								itsme: itsme,
								ireport: ireport,
								tags : tags
							});
						}
					})
				}
			})
	}
});


module.exports = router;
