var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var FakeModels = require('../models/fakeprofil');

router.get('/', function(req, res) {
	res.render("Faker.pug");
})

router.post('/', function(req, res){
	FakeModels.create(req.body.user)
		.then(data => {
			res.status(200).json({id: data, user: req.body.user});
			console.log("============================== fake profil created ==============================");
			console.log("id = " + data);
		})
})

module.exports = router;
