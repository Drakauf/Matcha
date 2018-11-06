var express = require('express');
var session = require('express-session');
var router = express.Router();
var bodyParser = require('body-parser');

var formidable = require('formidable');
const isimage = require('is-image');
var fs = require('fs');

var UploadModels = require('../models/upload');
var PhotosModels = require('../models/photos');

router.post('/', function (req, res) {
	var sess = req.session;
	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		if (!(isimage(files.file.name)))
		{
			PhotosModels.all_photos(sess.user.id)
				.then(data =>{
					res.status(200).render('photo.pug', {uploaderror : 1, profil_pic: sess.photo, user_id: sess.user.id, data:data});
				})
		}
		else
		{
			UploadModels.upload(sess.user.id, files.file.path);
			res.status(200).redirect("/user/photos");
		}
	});
});

module.exports = router;
