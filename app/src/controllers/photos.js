var express = require('express');
var session = require('express-session');
var router = express.Router();
var bodyParser = require('body-parser');

var PhotosModels = require('../models/photos');
var LoginModels = require('../models/login');
var sess;

router.get('/', function (req, res) {
	if (!(req.session.user))
		res.redirect("/");
	else
	{
		sess = req.session;
		PhotosModels.all_photos(sess.user.id)
			.then(data => {
		res.render("photo.pug", {
			uploaderror: 0,
			profil_pic: sess.photo,
			user_id: sess.user.id,
			data: data});
			})
	}
});

router.post('/detail', function (req, res) {
	var active;
	var profil;
	var	img;
	PhotosModels.this_photo(req.body.id_photo)
		.then(data => {
		if (data[0].active == null)
			active = 0;
		else
			active = data[0].active;
		profil = data[0].profil
		return(PhotosModels.photo(req.body.id_photo))
		})
		.then(data =>{
			img = data[0].picture;
			return(data);
		})
		.then(data => {
		res.status(200).json({status: "success", is_profil: profil, is_descri: active, src: img});
		})
		.catch(error =>{
				res.status(200).json({status: "error", message: data})});
});

router.post('/profil', function (req, res) {
	sess = req.session;
	PhotosModels.profil(req.body.id_photo, sess.user.id)
		.then(data => {
			return(LoginModels.photo(sess.user.id))
		})
		.then(data => {
			sess.photo = data;
			res.status(200).json({status: "success", src: data});
		})
		.catch(data => {
		console.log(data);
		})
});

router.post('/descri', function (req, res) {
	sess = req.session;
	PhotosModels.descri(sess.user.id, req.body.id_photo, req.body.nbr)
		.then(data => {
			return(LoginModels.photo(sess.user.id))
		})
		.then(data => {
			sess.photo = data;
			res.status(200).json({status: "success", src: data});
		})
		.catch(data => {
		console.log(data);
		})
});

router.post('/delphoto', function (req, res) {
	sess = req.session;
	PhotosModels.delphoto(req.body.id_photo)
		.then(data => {
			return(LoginModels.photo(sess.user.id))
		})
		.then(data => {
			sess.photo = data;
			res.status(200).json({status: "success", src: data});
		})
		.catch(data => {
		console.log(data);
		})
});



module.exports = router;
