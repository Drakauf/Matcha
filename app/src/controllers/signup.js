var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var UserModels = require('../models/user');
var Serializer = require('../middlewares/Serializer');
var Validator = require('../middlewares/Validator');

router.post('/', Serializer.signup, Validator.signup, function (req, res) {
	var pwd_hash = bcrypt.hashSync(req.form.password, 10);
 	UserModels.create(req.form.username, req.form.last_name, req.form.first_name, req.form.birth_date, pwd_hash, req.form.confirm_password, req.form.email, req.form.key);
 	res.status(200).send({});
});

module.exports = router;
