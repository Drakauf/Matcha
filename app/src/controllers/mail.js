var express = require('express');
var session = require('express-session');
var router = express.Router();
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'matchounet69@gmail.com',
		pass: 'oui123NON!!!'
	}
});

var mailOptions = {
	from: 'matchounet69@gmail.com',
	to: 'shthevak@student.le-101.fr',
	subject: 'Sending Email using Node.js',
	text: 'That was easy!'
};

router.get('/', function (req, res) {
transporter.sendMail(mailOptions, function(error, info){
	if (error) {
		console.log(error);
	}
});
});

module.exports = router;
