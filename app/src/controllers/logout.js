var express = require('express');
var session = require('express-session');
var router = express.Router();

var LogoutModels = require('../models/logout');

router.get('/', function (req, res) {
	if (req.session.user)
	{
		LogoutModels.deco(sess.user.id);
		req.session.destroy();
	}
	res.redirect("/");
});

module.exports = router;
