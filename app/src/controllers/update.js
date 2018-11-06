var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
var session = require('express-session');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var UserModels = require('../models/user');
var ProfilModels = require("../models/profil");
var LoginModels = require('../models/login');
var Serializer = require('../middlewares/Serializer');
var Validator = require('../middlewares/Validator');

router.get('/', Validator.session, Validator.update, function (req, res) {
	sess = req.session;
	var address;
	var tags;
	var id_blocked;
	var login_blocked;
	var picture_blocked;
	var i;
	var pprof;
	var desc1;
	var desc2;
	var desc3;
	var desc4;
	var form_unfill = "visible";
 		if (sess.user.activated == 1)
 			form_unfill = "none";
 		UserModels.get_address(sess.user.id)
		.then (data => {
			if (data[0]) {
					address = ({
								number_address: data[0].number_address,
								street: data[0].street,
								city: data[0].city,
								zip: data[0].zip,
								country: data[0].country,
								complement: data[0].complement,		
							})
			}
			else {
					address = ({
								number_address: "Ex: 101",
								street: "EX: rue Imega",
								city: "Ex: Ginger Tower",
								zip: "Ex: 01337",
								country: "Ex: Vegeta",
								complement: "Ex: Résidence Bulma", 
							})
			}
		})
		.then(() => {
			UserModels.get_tags(sess.user.id)
			.then (data => {
				tags = data;
			})
			.then ( () => {
				UserModels.get_id_user_blocked(sess.user.id)
				.then(data => {
					if (data)
					{
						id_blocked = data;
						i = id_blocked.length;
						UserModels.get_login_user_blocked(id_blocked)
						.then(data => {
							login_blocked = data;
							UserModels.get_picture_user_blocked(id_blocked)
							.then(data => {
								picture_blocked = data;
							})
						})
					}	
							LoginModels.photo(sess.user.id)
								.then(data =>{
									pprof = data;
									return (ProfilModels.desc(sess.user.id, 1));
								})
								.then(data =>{
									desc1 = data;
									return (ProfilModels.desc(sess.user.id, 2));
								})
								.then(data =>{
									desc2 = data;
									return (ProfilModels.desc(sess.user.id, 3));
								})
								.then(data =>{
									desc3 = data;
									return (ProfilModels.desc(sess.user.id, 4));
								})
								.then(data =>{
									desc4 = data;
								})
								.then(data => {								
									if (sess.user.gender == "Femme")
										var checked_IamW = "checked";
									if (sess.user.gender == "Homme")
										var checked_IamM = "checked";
									if (sess.user.affinity == "Femme")
										var checked_lookingforW = "checked"
									if (sess.user.affinity == "Homme")
										var checked_lookingforM = "checked";
									if (sess.user.affinity == "bisexuel(le)")
										var checked_lookingforB = "checked";
									res.render('update.pug', {
													form_unfill: form_unfill,
													profil_pic: pprof,
													user_id: sess.user.id,
				 									username:  sess.user.login,
				 									last_name: sess.user.last_name,
				 									first_name: sess.user.first_name,
				 									email: sess.user.email,
				 									number_address: address.number_address,
				 									street: address.street,
				 									city: address.city,
				 									zip: address.zip,
				 									country: address.zip,
				 									complement: address.complement,
				 									checked_IamW: checked_IamW,
				 									checked_IamM: checked_IamM,
				 									checked_lookingforW: checked_lookingforW,
				 									checked_lookingforM: checked_lookingforM,
				 									checked_lookingforB: checked_lookingforB,
				 									affinity: sess.user.affinity,
				 									affinity_age_less: sess.user.affinity_age_less,
				 									affinity_age_more: sess.user.affinity_age_more, 
				 									biography: sess.user.biography,
				 									tags: tags,
				 									pprof : pprof,
													desc1 : desc1,
													desc2 : desc2,
													desc3 : desc3,
													desc4 : desc4,
				 									login_blocked: login_blocked,
				 									picture_blocked: picture_blocked,									
			 									});
						
					})
				})
			})
		})
});

router.post('/names', Serializer.update_names,  Validator.update, Validator.update_names, function (req, res) {
	UserModels.update_sess(req, req.form)
	.then (() => {
		res.status(200).send({
								username:  sess.user.login,
								last_name: sess.user.last_name,
 								first_name: sess.user.first_name,
 								email: sess.user.email
 							});
	})
});

router.post('/address', Serializer.update_address,  Validator.update, Validator.update_address, function (req, res) {
	UserModels.update_address(req, sess.user.id, req.form)
	.then (() => {
		UserModels.get_address(sess.user.id)
		.then (data => {
			res.status(200).send({
									number_address: data[0].number_address,
									street: data[0].street,
									city: data[0].city,
									zip: data[0].zip,
									country: data[0].country,
									complement: data[0].complement
								})
		})
	})
});

router.post('/password', Serializer.update_password,  Validator.update, Validator.update_password, function (req, res) {
	UserModels.update(sess.user.id, req.form);
 	res.status(200).send({});
});

router.post('/lookingfor', Serializer.update_lookingfor,  Validator.update, Validator.update_lookingfor, function (req, res) {
	UserModels.update_sess(req, req.form)
	.then (() => {
		res.status(200).send({
	 							affinity_age_less: sess.user.affinity_age_less,
	 							affinity_age_more: sess.user.affinity_age_more, 
 							});
	})
	.catch (err => {
		console.log("ERR => ");
		console.log(err);
	})
});

router.post('/biography', Serializer.update_biography,  Validator.update, Validator.update_biography, function (req, res) {
	UserModels.update_sess(req, req.form)
	.then (() => {
		res.status(200).send({
								biography:  sess.user.biography
 							});
	})
});

router.post('/tags', Serializer.update_tags,  Validator.update, Validator.update_tags, function (req, res) {
	UserModels.update_tag(sess.user.id, req.form.tag)
	.then (data => {	
		res.status(200).send({ index2: data["insertId"], index3: data["insertId"] + "b", tag: req.form.tag });
	})
});

router.post('/delete_tag', Serializer.delete_tags,  Validator.update, function (req, res) {
	UserModels.delete_tag(sess.user.id, req.form.tag)
	.then (() => {
		res.status(200).send({ index: req.form.index });
	})
});

router.post('/delete_tag2', Serializer.delete_tags2,  Validator.update, function (req, res) {
	UserModels.delete_tag2(req.form.id_user_tag)
	.then (() => {
		res.status(200).send({ index: "#" + req.body.tag + "b"});
	})
	
});

router.post('/unblock',  Validator.update, function (req, res) {
	UserModels.unblock_user(sess.user.id, req.body.login_unblock);
	res.status(200).send({});
	
});

module.exports = router;

