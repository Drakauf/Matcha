const bcrypt = require('bcrypt');

module.exports = {
	forget_mail: function(req, res, next)
	{
		var key = Math.random().toString(36).replace('0.', '');
		req.form = {
					mail: req.body.mail,
					key: key
					};
		next();
	},
	set_newpwd: function(req, res, next)
	{
		req.form = {
			login: req.body.login,
			key: req.body.key,
			pwd: req.body.new_pwd,
			conf_pwd: req.body.confirm_pwd
					};
		next();
	},
	signup : function (req, res, next) {
		var key = Math.random().toString(36).replace('0.', '');
		key = bcrypt.hashSync(key, 10);
		key = key.replace(/\//g, "");
		req.form = {
					username: req.body.username,
					last_name: req.body.last_name,
					first_name: req.body.first_name,
					birth_date: req.body.birth_date,				
					password: req.body.pwd,
					confirm_password: req.body.confirm_pwd,
					email: req.body.email,
					key: key
					};
		next();
	},
	login : function(req, res, next) {
		req.form = {
					username: req.body.username,
					password: req.body.password
					};
		next();
	},
	update_names: function (req, res, next) {
		req.form = {
					login: req.body.login,
					last_name: req.body.last_name,
					first_name: req.body.first_name,				
					email: req.body.email,
					};
		next();
	},
	update_address: function (req, res, next) {
		req.form = {
					number_address: req.body.number_address,
					street: req.body.street,
					city: req.body.city,
					zip: req.body.zip,
					country: req.body.country,
					complement: req.body.complement
					};
		next();
	},
	update_password: function (req, res, next) {
		req.form = {
					password: req.body.password,
					new_password: req.body.new_password,
					confirm_new_password: req.body.confirm_new_password
					};
		next();
	},
	update_lookingfor: function (req, res, next) {
		req.form = {
					gender: req.body.gender,
					affinity_age_less: req.body.affinity_age_less,
					affinity_age_more: req.body.affinity_age_more,
					affinity : req.body.affinity
					};
		next();
	},
	update_biography: function (req, res, next) {
		req.form = {
					biography: req.body.biography
					};
		next();
	},
	update_tags: function (req, res, next) {
		var tag_body = req.body.tag;
		tag_body = tag_body.replace(/[\\$'"]/g, "\\$&");
		req.form = {
					tag: tag_body
					};
		next();
	},
	delete_tags: function (req, res, next) {
		var tab = req.body.tag.split('#', 2);
		req.form = {
					tag: "#" + tab[1],
					index: tab[0]
					};
		next();
	},
	delete_tags2: function (req, res, next) {
		req.form = {
					id_user_tag: req.body.tag,
					};
		next();
	},
	search: function (req, res, next) {
		req.form = {
					affinity_age_less: req.body.age_less_home,
					affinity_age_more: req.body.age_more_home,
					km: req.body.km,
					connected: req.body.connected,
					sexappeal: req.body.popularity,
					common_tag: req.body.common_tag
					};
		next();
	}, 

}
