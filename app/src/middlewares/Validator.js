const bcrypt = require('bcrypt');
const moment = require('moment');
const NodeGeocoder = require('node-geocoder');
var session = require('express-session');
const SMTPServer = require('smtp-server').SMTPServer;
const nodemailer = require('nodemailer');
const request = require('request');

var UserModels = require('../models/user');
var LoginModels = require('../models/login');

function check_password(password, confirm_password, data) {
		if (password != confirm_password)
			data = data + "Confirmation du mot de passe non valide<br/>";
		if ((password.match(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/)) == null)
		{
			data = data + "Le mot de passe doit contenir plus de 8 caractères, des minuscules, majuscules, chiffres et caractères spéciaux. Le tout sans espace <br/>"
		}
		return data;
}

function check_valid_tag(tag, data) {
	var tab = tag.split('#');
	if (tab.length > 2)
		data = data + 'Le hashtag ne doit contenir qu\'un seul "#"';
	if (tag.length > 50)
		data = data + "Hashtag trop long<br/>";
	if (tag.length < 2)
		data = data + "Le hashtag ne doit pas être vide<br/>";
	if(tag.match(/^#/gm) == null)
		data = data + 'Le hashtag doit commencer pas "#"<br/>'
	if(tag.match(/ /gm) != null) 
		data = data + "Le Hashtag ne doit pas contenir d'espaces<br/>"
	return data;
}

function check_right_password(password) {
	return new Promise ((resolve, reject) => {
		UserModels.get_password(sess.user.id)
 			.then(result => {
 				if (!bcrypt.compareSync(password, result[0].password))
		 		{
		 			reject("Mot de passe incorrect<br/>");
		 		}
		 		else
		 			resolve('\0');		
		});
	});
}

function check_biography(biography, data) {
	if (biography.length > 255) {
		data = data + "Votre biographie de doit pas contenir plus 255 catactères actuellement elle en fait " + biography.length + "."
	}
	return data;
}

function check_login(username, data) {
	if (username.length > 8)
		data = data + "Le pseudonyme ne doit pas contenir plus de 8 caractères<br/>";
	if(username.match(/ /gm) != null) 
		data = data + "Le login ne doit pas contenir d'espaces<br/>";
	return data;
}

function check_last_name(last_name, data) {
	if (last_name.length < 2 || last_name.length > 20)
		data = data + "le nom doit contenir entre 2 et 20 caractères<br/>";
	if(last_name.match(/ /gm) != null) 
		data = data + "Le nom ne doit pas contenir d'espaces<br/>";
	return data;
}

function check_first_name(first_name, data) {
	if (first_name.length < 2 || first_name.length > 20)
		data = data + "le prénom doit contenir entre 2 et 20 caractères<br/>";
	if(first_name.match(/ /gm) != null) 
		data = data + "Le prénom ne doit pas contenir d'espaces<br/>";
	return data;
}

function check_zip(zip, data) {
	if (zip.length < 5)
		data = data + "Code postal non valide";
	return data;
}

async function check_range(req, age_less, age_more, data) {
	if (!age_less) {
		age_less = sess.user.affinity_age_less;
		delete req.form.affinity_age_less;
	}
	if (!age_more) {
		age_more = sess.user.affinity_age_more;
		delete req.form.affinity_age_more;
	}
	if (age_less > age_more)
		data = data + "l'âge maximum doit être supérieur ou égal à l'âge minimum<br/>";
	return data;
}

function check_age(birth_date, data) {
	var age = moment().diff(moment(birth_date, 'YYYYMMDD'), 'years');
	if (age < 18 && age > 0)
		data = data + "Oups tu dois être majeur pour utiliser ce site<br/>";
	else if (age <= 0)
		data = data + "Oups tu n'es pas encore né<br/>";
	return data;
}

var options = {
  provider: 'mapquest',
  httpAdapter: 'https',
  apiKey: 'oaMyVQO9CAwVdt6ZrZWcLUvdiySTyubp', // mapquest key usename:Matchounet Pwd: ouiOUI123!!!
  formatter: null  
};

// google key : AIzaSyAYvhepQr3vm9IJQHTYTvtFuPJDePi0-Xo
var geocoder = NodeGeocoder(options);

function get_coordonates(number, address, city, zip)
{
	return new Promise ((resolve, reject) => { 
		geocoder.geocode({
							streetName: number + " " + address,
							country: "France",
							countryCode: 'FR',
							city: city,
							zipcode: zip
						})
			.then (function (result) {
				resolve(result[0]);
			})
			.catch(function(err) {
	    		console.log(err);
	  		})
	})
}

function check_address(form){
	return new Promise ((resolve, reject) => {
		var address = form.number_address + ' '	+ form.street + ' ' + form.zip + ' ' + form.city;

		var headers = {
				    'X-Okapi-Key': 'hmUZjftXCZRwAqJWvdvPDiZJ7gWkYCmzXHxP07cWqAo2u52FTrRk6MXYWSxAxlAm'
				};

		var options = {
		    url: 'https://api.laposte.fr/controladresse/v1/adresses?q='+ address,													
				    headers: headers
				};
				function callback(error, response, body) {
				    if (!error && response.statusCode == 200) {
				    	var result = "\0";
				    	address = address.toUpperCase();
				    	var match = body.match(address);
				    	if (!match) {
				    		var tab = body.split('"');
				    		var advices_addresses = [];
				    		i = 9;
				    		while (i < tab.length) {
				    			advices_addresses.push(tab[i]);
				    			i = i + 10; 
				    		}
				    		result = advices_addresses;
				    		resolve(advices_addresses);
				    	}
				    }
					resolve(result);
				}
				request(options, callback);
	})
}

function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

async function sendEmail(req, type) {
	var transporter = nodemailer.createTransport({
	  service: 'gmail.com',
	  auth: {
		user: 'your email',
	    pass: 'your password'
	  }
	});

	var Log_in = {
	  from: 'your email',
	  to: req.form.email,
	  subject: 'Confirmation d\'inscription - Matcha',
	  text: 'Hello,\n Nous confirmons via ce mail que tu as bien été enregistré sur Matcha, il te reste encore quelques petites choses à faire avant de pouvoir en profiter pleinement.\nTout d\'abord rends-toi sur ce lien pour activer ton compte :) \http://localhost:8080/login/activate/' + req.form.key + '\nÀ bientôt sur Matcha'
	};
	
	var Forget = {
	  from: 'your email',
	  to: req.form.mail,
	  subject: 'Code de récuperation mot de passe - Matcha',
	  text: 'Hello,\n Tu as demandé un changement de mot de passe, si ce n\'est pas toi oublie ce mail et connecte-toi comme d\'habitude avec ton mot de passe.\n Si c\'est bien toi qui a demandé un changement de mot de passe voici la clé qui te permettra de definir un nouveau mot de passe :\n' + req.form.key + ' À bientôt sur Matcha'
	};

	var mailOptions

	if (type == "log")
	{
		mailOptions = Log_in;
	}
	if (type == "forget")
	{
		mailOptions  = Forget;
	}

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
}


module.exports = {

	signup: async function(req, res, next) {
		data = "\0";
		UserModels.get_login(req.form.username)
		.then( result => {
			if (result[0])
				data = data + "Login déjà utilisé <br/>";
			return (UserModels.get_email(req.form.email))
		})
		.then ( result => {
			if (result[0])
				data = data + "Email déjà utilisé <br/>";
			data = check_login(req.form.username, data);
			data = check_last_name(req.form.last_name, data);
			data = check_first_name(req.form.first_name, data);
			data = check_age(req.form.birth_date, data);
			data = check_password(req.form.password, req.form.confirm_password, data);
			if (data != '\0') {
				res.status(400);
				res.send(data);
			}
			else {
				sendEmail(req, "log");
				next();
			}
		})
	},
	session: function(req, res, next){
		var sess;
		sess = req.session;
		if (!sess.user)
			res.redirect("/");
		else
			next();
	},
	activated: function(req, res, next) {
		var sess;
		sess = req.session;
		if (sess.user) {
			if (sess.user.activated != 1)
				res.redirect("/user/update");
			else 
				next();
		}
		else
			next();
	},
	login: function(req, res, next){
		var sess;
		sess = req.session;
		LoginModels.check_and_get(req.form.username, req.form.password)
		.then (result => {
			if (result == 'error') {
				data = "Login ou mot de passe incorrect. Vérifiez également que votre compte est activé."
				res.status(400);
				res.send(data);
			}
			else {
				sess.user = result[0];
				var options = {
		    		url: 'http://ip-api.com/json'
				};
				function callback(error, response, body) {
				    if (!error && response.statusCode == 200) {
				    	var result = "\0";
				    	var result = body.split(",");
				    	var latitude = result[5].split(":");
				    	latitude = latitude[1];
				    	var longitude = result[6].split(":");
				    	longitude = longitude[1];
				    	var ip_city = result[1].split(":");
				    	ip_city = ip_city[1].split('"');
				    	ip_city = ip_city[1];
				    	var ip_zip = result[13].split(":");
				    	ip_zip = ip_zip[1].split('"');
				    	ip_zip = ip_zip[1];
						UserModels.insert_coordonates(req, latitude, longitude, ip_city, ip_zip, sess.user.id);
						next();
				    }
				}
				request(options, callback);
			}
		})
	},
	forget_mail: function(req, res, next){
		UserModels.get_all(req.body.login)
			.then(data =>{
					if (data[0].email != req.body.mail)
					{
						res.status(400).send("Aucun compte avec ce Login et Mail n'as ete trouve")
					}
					else
					{
						UserModels.forget_mail_key(req.body.login, req.form.key)
						sendEmail(req, "forget");
						next();
					}
			})
	},
	set_newpwd: function(req, res, next){
		var data;
		data = '\0';
		data = check_password(req.form.pwd, req.form.conf_pwd, data);
		if (data != '\0')
			res.status(400).send(data);
		else
		{
			UserModels.get_all(req.form.login)
				.then(data => {
					if (data[0].auth_key_reset != req.form.key)
						res.status(400).send("Cette clee ne correspond pas a ce login");
					else
						next();
				})
		}
	},
	update: function(req, res, next) {
		var sess;
		sess = req.session;
		UserModels.is_tag(sess.user.id)
		.then(data => {
			if (data[0] != null && sess.user.user_location != null && sess.user.affinity != null && sess.user.gender != null && sess.user.biography != null) {
				sess.user.activated = 1;
				UserModels.update_activated(sess.user.id);
			}
			next();
		})
	},
	update_names: async function(req, res, next) {
		var data = '\0'; 
		if (req.form.login)
		{
			data = check_login(req.form.login, data);
			result = await UserModels.get_login(req.form.login)
			if (result[0])
				data = data + "Login déjà existant";
		}
		else
			delete req.form.login;
		if (req.form.last_name)
			data = check_last_name(req.form.last_name, data);
		else
			delete req.form.last_name;
		if (req.form.first_name)
			data = check_first_name(req.form.first_name, data);
		else
			delete req.form.first_name;
		if (!req.form.email) 
			delete req.form.email;
		else {
			result = await UserModels.get_email(req.form.email)
			if (result[0])
				data = data + "Email déjà existant";
		}
		if (data != '\0') {

			res.status(400);
			res.send(data);
		}
		else
			next();
	},
	update_address: async function(req, res, next) {
		distance("45.757598", "4.832332", "45.758262", "4.799075","K");
		get_coordonates(req.form.number_address, req.form.address, req.form.city, req.form.country, req.form.zip)
	  		.then (result => {
	  			req.form.latitude = result.latitude; 
				req.form.longitude = result.longitude;
	  			var data = '\0'; 
	  		})
	  		.then (() => {
	  			check_address(req.form)
	  			.then (data => {
	  				if (data != '\0') {
						res.status(400).send({data: data});
					}
					else
						next();
		  		})
	  		}) 				
	},
	update_password: function(req, res, next) {
		check_right_password(req.form.password)
		.then(data => {
			data = check_password(req.form.new_password, req.form.confirm_new_password, data);
			if (data != '\0') {
				res.status(400);
				res.send(data);
			}
			else {
				req.form.password = bcrypt.hashSync(req.form.new_password, 10);
				delete req.form.new_password;
				delete req.form.confirm_new_password;
				next();
			}
		})
		.catch(function(err) {
			var data = '\0';
			data = err + check_password(req.form.new_password, req.form.confirm_new_password, data);
			res.status(400);
			res.send(data);
		})
	},
	update_lookingfor: async function(req, res, next) {
		var data = '\0';
		if (!req.form.gender) 
			delete req.form.gender;
		if (!req.form.affinity)
			delete req.form.affinity;
		if (req.form.affinity_age_more || req.form.affinity_age_less) {
			check_range(req, req.form.affinity_age_less, req.form.affinity_age_more, data)
			.then (data => {
				if (data != '\0') {
					res.status(400);
				}
				else
					next();
				})
		}
		else {
			delete req.form.affinity_age_less;
			delete req.form.affinity_age_more;
			next();
		}		
	},
	update_biography: async function(req, res, next) {
		var data = '\0'; 
		data = check_biography(req.form.biography, data); 
		if (data != '\0') {
			res.status(400);
			res.send(data);
		}
		else
			next();
	},
	update_tags: async function(req, res, next) {
		UserModels.check_tag(sess.user.id, req.form.tag)
		.then (result => {
			var data = '\0';
			if (result[0])
				data = "Oups vous détenez déjà ce tag :)<br/>";
			data = check_valid_tag(req.form.tag, data);
			if (data != '\0') {
				res.status(400);
				res.send(data);
			}
			else
				next();
		})		
	},

	search: async function(req, res, next) {
		if (!req.form.affinity_age_less) {
			req.form.affinity_age_less = sess.user.affinity_age_less;
			req.form.affinity_age_more = sess.user.affinity_age_more;
		}
		else {
			var data = '\0'; 
			data = await check_range(req, req.form.affinity_age_less, req.form.affinity_age_more, data)
			if (data != '\0') {
				res.status(400);
				res.send(data);
			}
		}
		if (req.form.common_tag == '')
			req.form.common_tag = "0";
		if (req.form.km == '')
			req.form.km = "1000";
		next();
	}
}