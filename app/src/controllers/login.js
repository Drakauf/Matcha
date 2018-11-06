var express = require('express');
var session = require('express-session');
var router = express.Router();
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var LoginModels = require('../models/login');
var UserModels = require('../models/user');
var Validator = require('../middlewares/Validator');
var Serializer = require('../middlewares/Serializer');

router.post('/', Serializer.login, Validator.login, function (req, res) {
	var sess;
	sess = req.session;
	var time;
	if (sess.user.activated == 1) 
		time = 1;	
	else 
		time = 0;
	LoginModels.photo(sess.user.id)		
		.then(data => {
			sess.photo = data;
			if (time == 1)
				res.status(200).json({status: "success", redirect: "/", id: sess.user.id});
			else
				res.status(200).json({status: "success", redirect: "/user/update", id: sess.user.id});			
		})
});

router.get('/activate/:auth_key', function (req, res){
	LoginModels.valid_mail(req.params.auth_key);
	res.redirect("/");
});

router.get('/forget', function (req, res){
	res.status(200).render('forget.pug');
});

router.post('/forget/mail', Serializer.forget_mail, Validator.forget_mail, function (req, res){
	res.status(200).json({txt: "Un mail viens de vous être envoyé. veuillez récupérer le code afin de pouvoir choisir un nouveau mot de passe"});
})

router.post('/forget/set',Serializer.set_newpwd, Validator.set_newpwd, function (req, res){
	var new_pwd = bcrypt.hashSync(req.form.pwd, 10);
	UserModels.set_newpwd(req.form.login, new_pwd);
	UserModels.set_keynull(req.form.login);
	res.status(200).json({txt: "Nouveau mot de passse defini"});
});

module.exports = router;
