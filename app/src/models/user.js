var db = require('../db');
var session = require('express-session');
const moment = require('moment');

module.exports = {
	all: function() {
		return db.any('SELECT * FROM users')
	},
	login_exist: function(login) {
		return new Promise ((success, error) => 
				{
					success (this.get_login(login)
							.then(res => 
								{
									if (res[0])
										return "Username déjà utilisé<br/>";
									else 
										return "\0";
								})
							.catch(error => {
								console.log(error);
							})
							)
				});
	},
	mail_exist: function(email, data) {
		return new Promise ((success, error) => 
				{
					success (this.get_email(email)
							.then(res => 
								{
									if (res[0])
										return data + "email déjà utilisé<br/>";
									else 
										return data + "\0";
								})
							.catch(error => {
								console.log(error);
							})
							);
				});

	},
	create: function(username, last_name, first_name, birth_date, pwd, confirm_pwd, email, key){
		var req = "INSERT INTO `user`(login, last_name, first_name, birth_date, password, email, auth_key) VALUES ?";
		var values = [[username, last_name, first_name, birth_date, pwd, email, key]];
		db.query(req, [values], (err, result) => 
		{
			if (err) throw err;
		});
	},
	get_login: async function(login) {
		var sql = 'SELECT login FROM `user` WHERE login = ?';
		return new Promise ((resolve, reject) => {
			db.query(sql, [login], ( err, rows ) => {
				if ( err )
					return reject(err);
				resolve(rows);
			});
		});
	},
	get_id: function(login) {
		var sql = 'SELECT id FROM `user` WHERE login = ?';
		return new Promise ((resolve, reject) => {
			db.query(sql, [login], ( err, rows ) => {
				if ( err )
					return reject(err);
				resolve(rows);
			});
		});
	},
	get_email: async function(email) {
		var sql = 'SELECT email FROM `user` WHERE email = ?';
		return new Promise ((resolve, reject) => {
			db.query(sql, [email], ( err, rows ) => {
				if ( err )
					return reject(err);
				resolve(rows);
			});
		});
	},
	get_password: function(id) {
		var sql = 'SELECT password FROM `user` WHERE id = ?';
		return new Promise ((resolve, reject) => {
			db.query(sql, [id], ( err, rows ) => {
				if ( err )
					return reject(err);
				resolve(rows);
			});
		});
	},
	get_all: function(login) {
		var sql = 'SELECT * FROM `user` WHERE login = ?';
		return new Promise ((resolve, reject) => {
			db.query(sql, [login], ( err, rows ) => {
				if ( err ) 
					return reject(err);
				resolve(rows);
			});
		});
	},
	get: function(elem) {
		var sql = 'SELECT '+ elem +' FROM `user`';
		return new Promise ((resolve, reject) => {
			db.query(sql, ( err, rows ) => {
				if ( err ) 
					return reject(err);
				resolve(rows);
			});
		});
	},
	get_address: function(id) {
		var sql = 'SELECT * FROM `user_address` WHERE user_id = ?';
		return new Promise ((resolve, reject) => {
			db.query(sql, [id], ( err, rows ) => {
				if ( err ) 
					return reject(err);
				resolve(rows);
			});
		});
	},
 	get_user_no_filter: function(user) {
 		var age = moment().diff(moment(user.birth_date, 'YYYYMMDD'), 'years');
 		if (user.affinity == "bisexuel(le)") {
 			var sql = "SELECT user.id, user.last_seen,user.login,user.birth_date,user.sexappeal,user.last_seen, \
						pictures.picture,user_address.city,user_block.blocked,\
						user_address.latitude, user_address.longitude \
					FROM `user` INNER JOIN user_pictures \
					INNER JOIN pictures ON user_pictures.picture_id = pictures.id \
					INNER JOIN user_address ON user.id = user_address.user_id \
					LEFT JOIN user_block ON \
						((user.id = user_block.blocked AND user_block.blocker = " + user.id + ") OR \
                        (user.id = user_block.blocker AND user_block.blocked = " + user.id + ")) \
					WHERE user.id <>  " + user.id + " \
					AND (pictures.id = user_pictures.picture_id AND user_pictures.profil = 1)\
					AND user.id = user_pictures.user_id \
					AND user.affinity_age_less <= " + age + " \
					AND user.affinity_age_more >= " + age + " \
					AND (user.affinity = '" + user.gender + "' OR user.affinity = 'bisexuel(le)') \
					ORDER BY sexappeal DESC;";
 		}
 		else {
 			var sql = "SELECT user.id, user.last_seen,user.login,user.birth_date,user.sexappeal,user.last_seen, \
						pictures.picture,user_address.city, user_block.blocked,\
						user_address.latitude, user_address.longitude \
					FROM `user` INNER JOIN user_pictures \
					INNER JOIN pictures ON user_pictures.picture_id = pictures.id \
					INNER JOIN user_address ON user.id = user_address.user_id \
					LEFT JOIN user_block ON \
						((user.id = user_block.blocked AND user_block.blocker = " + user.id + ") OR \
                        (user.id = user_block.blocker AND user_block.blocked = " + user.id + ")) \
					WHERE user.id <>  " + user.id + " \
					AND (pictures.id = user_pictures.picture_id AND user_pictures.profil = 1)\
					AND user.id = user_pictures.user_id \
					AND user.affinity_age_less <= " + age + " \
					AND user.affinity_age_more >= " + age + " \
					AND (user.affinity = '" + user.gender + "' OR user.affinity = 'bisexuel(le)') \
					AND user.gender = '" + user.affinity + "' \
					ORDER BY sexappeal DESC;";
 		}
		return new Promise ((resolve, reject) => {
			values = [[age, age, user.gender, user.affinity]];
			db.query(sql, ( err, rows ) => {
				if ( err ) 
					reject(err);
				resolve(rows);
			});
		});
 	},
	is_tag: function(id){
		var sql = 'SELECT * FROM `user_tags` WHERE user_id = ?';
		return new Promise ((resolve, reject) => {
			db.query(sql, [id], ( err, rows ) => {
				if ( err ) 
					return reject(err);
				resolve(rows);
			});
		});
	},
	check_tag: function(id, tag) {
		var sql = 'SELECT tags.tag FROM tags INNER JOIN user_tags ON tags.id=user_tags.tag_id WHERE tags.tag = ? AND user_tags.user_id= ?';
		values = [tag, id];
		return new Promise ((resolve, reject) => {
			db.query(sql, values, ( err, rows ) => {
				if ( err ) 
					return reject(err);
				resolve(rows);
			});
		});
	},
	get_common_tags: function(id1, user) {
		var len = user.length;
		var user_tag = [];
		return new Promise ((resolve, reject) => {
			for (var i = 0; i < len; i++) {
				sql = "SELECT A.tag_id AS tag1, B.tag_id AS tag2, A.user_id \
				FROM user_tags A, user_tags B \
				WHERE A.user_id = " + id1 + " AND B.user_id = " + user[i].id + " \
				AND A.tag_id = B.tag_id ";
				db.query(sql, ( err, rows ) => {
					if ( err ) 
						return reject(err);
					user_tag.push(rows.length);
					if (user_tag.length  == len) {
						resolve(user_tag);
					}
				});
			}
		});
	}, 
	get_id_user_blocked: function(id)
	{
		return new Promise ((resolve, reject) => {
			sql = "SELECT blocked FROM user_block WHERE blocker = ?";
			db.query(sql, id, ( err, rows ) => {
				if ( err ) 
					throw (err);
				resolve(rows);
			});
		})

	},
	get_login_user_blocked: function(id_blocked)
	{
		var login_blocked = [];
		var len = id_blocked.length;
		return new Promise ((resolve, reject) => {
			for (var i = 0; i < len; i++) {
				sql = 'SELECT login FROM `user` WHERE id = ?';
				db.query(sql, id_blocked[i].blocked, ( err, rows ) => {
					if ( err ) 
						return reject(err);
					login_blocked.push(rows[0].login);
					if (login_blocked.length == len)
						resolve(login_blocked);
				})
			}
		})
	},
	get_picture_user_blocked: function(id_blocked)
	{
		var picture_blocked = [];
		var len = id_blocked.length;
		return new Promise ((resolve, reject) => {
			for (var i = 0; i < len; i++) {
				sql = 'SELECT picture FROM `pictures` WHERE id IN  (SELECT picture_id from user_pictures WHERE user_id = ? and profil = 1)'
					db.query(sql, id_blocked[i].blocked, ( err, rows ) => {
						if ( err ) 
							return reject(err);
						if (!rows[0])
							picture_blocked.push("https://image.flaticon.com/icons/png/512/552/552848.png");
						else
							picture_blocked.push(rows[0].picture);
						if (picture_blocked.length == len) {
							resolve(picture_blocked);
						}
					})
			}
		})
	},
	get_tags: function(id) {
		var sql = 'SELECT tags.tag FROM tags INNER JOIN user_tags ON tags.id=user_tags.tag_id WHERE user_tags.user_id = ?';
		return new Promise ((resolve, reject) => {
			db.query(sql, [id], ( err, rows ) => {
				if ( err ) 
					return reject(err);
				resolve(rows);
			});
		});
	},
	get_coordonates: function(id) {
		var sql = "SELECT latitude,longitude FROM user_address WHERE user_id = ? ";
		return new Promise ((resolve, reject) => {
			db.query(sql, [id], ( err, rows ) => {
				if ( err ) 
					return reject(err);
				resolve(rows);
			});
		});
	},
	get_ip_coordonates: function(id) {
		var sql = "SELECT ip_latitude, ip_longitude FROM user WHERE id = ? ";
		return new Promise ((resolve, reject) => {
			db.query(sql, [id], ( err, rows ) => {
				if ( err ) 
					return reject(err);
				resolve(rows);
			});
		});
	},
	delete: function(args) {
		arg = defineIdOrUsername(args)
			return db.one('DELETE FROM users WHERE ' + arg.key + ' = $1 RETURNING id', [arg.value])
	},
	update: function(id, form) {
		return new Promise ((resolve, reject) => {
			for (var key in form) {
				var sql = "UPDATE `user` SET " + key + " = ? WHERE id = ?";
				var values = [form[key], sess.user.id];				
				db.query(sql, values, ( err, rows ) => {
					if ( err )
						return reject(err);
					resolve(rows);
				});
			}
		});
	},
	update_tag: function(id, tag) {
		return new Promise ((resolve, reject) => {
			sql = "SELECT * FROM tags WHERE tag = ?";
			db.query(sql, [tag], ( err, rows ) => {
				if ( err ) 
					throw (err);
				resolve(rows);
			});
		})
		.then (data => {
			if (data[0]) {
				return new Promise ((resolve, reject) => {
					sql = "INSERT INTO user_tags(tag_id, user_id) VALUES ("+ data[0].id + "," + id + ")";
					values = [[data[0].id, id]];
					db.query(sql, values, ( err, rows ) => {
						if ( err ) 
							throw (err);
						resolve(rows);
					});
				})
				.then (data => {
					return data;
				})
			}
			else {
				return new Promise ((resolve, reject) => {
					sql = "INSERT INTO tags(tag) VALUES ('" + tag + "')";
					db.query(sql, ( err, rows ) => {
						if ( err ) 
							throw (err);
						resolve(rows);
					});
				})
				.then (data => {
					return new Promise ((resolve, reject) => {
						sql = "INSERT INTO user_tags(tag_id, user_id) VALUES ?";
						values = [[data.insertId, id]];
						db.query(sql, [values], ( err, rows ) => {
							if ( err ) 
								throw (err);
							resolve(rows);
						});
					});
				})
				.then (data => {
					return data;
				})
			}
		})

	},
	geolocation: function(req, id, latLng) {
		sess = req.session;
		return new Promise ((resolve, reject) => {
			var sql = "UPDATE `user` SET ip_latitude = ? , ip_longitude = ? WHERE id = ?";
			db.query(sql, [latLng.lat, latLng.lng, id], ( err, rows ) => {
				if ( err )
					return reject(err);
				sess.user.ip_latitude = latLng.lat;
				sess.user.ip_longitude = latLng.lng;
				resolve(rows);
			});
		});

	},
	insert_coordonates: function(req, lat, long, city, zip, id) {
		sess = req.session;
		sql = "UPDATE `user` SET ip_latitude = " + lat + ", ip_longitude = " + long + " \
				, ip_city = '" + city + "', ip_zip = " + zip + "\
				WHERE id = ?";
		values = [id];
		db.query(sql, values, ( err, rows ) => {
			if ( err ) 
				throw (err);
			sess.user.ip_latitude = lat;
			sess.user.ip_longitude = long;
		});
	},
	update_sess: function(req, form) {
		sess = req.session;
		return new Promise ((resolve, reject) => {
			for (var key in form) {
				var sql = "UPDATE `user` SET " + key + " = ? WHERE id = ?";
				var values = [form[key], sess.user.id];
				sess.user[key] = form[key];
				db.query(sql, values, ( err, rows ) => {
					if ( err )
						return reject(err);
					resolve(rows);
				});
			}
		});

	},
	update_activated: function(id) {
		return new Promise ((resolve, reject) => {
			var sql = "UPDATE `user` SET activated = 1 WHERE id = ?";
			db.query(sql, [id], ( err, rows ) => {
				if ( err )
					return reject(err);
				resolve(rows);
			});
		});

	},
	update_address: function(req, id, form) {
		sess = req.session;
		var sql = 'SELECT * FROM `user_address` WHERE user_id = ?';
		return new Promise ((resolve, reject) => {
			db.query(sql, [id], ( err, result ) => {
				if ( err )
					return reject(err);
				if (result.length > 0) {
					for (var key in form) {
						var sql = "UPDATE `user_address` SET " + key + " = ? WHERE user_id = ?";
						var values = [form[key], id];
						db.query(sql, values, ( err, rows ) => {
							if ( err ) {
								throw (err);
							}
						});
					}
					resolve("already exists")
				}
				else {
					var req = "INSERT INTO user_address(user_id, number_address, street, city, zip, country, complement, latitude, longitude) VALUES ?";
					var values = [[id, form.number_address, form.street, form.city, form.zip, form.country, form.complement, form.latitude, form.longitude]];
					db.query(req, [values], ( err, rows ) => {
						if ( err ) {
							throw (err);
						}
						var req = "UPDATE `user` SET user_location = ? WHERE id = ?";
						var values = [rows.insertId, id];
						sess.user.user_location = rows.insertId;
						db.query(req, values, ( err, rows ) => {
								if ( err ) {
									throw (err);
							}
						});
						resolve(rows);
					});		
				}
			});
		})
	},
	unblock_user: function(id, login_blocked) {
		return new Promise ((resolve, reject) => {
			sql = "DELETE user_block FROM user_block INNER JOIN user ON user.id = user_block.blocked  WHERE user_block.blocker = ? AND user.login = ?"
				values = [id, login_blocked];
			db.query(sql, values, ( err, rows ) => {
				if ( err )
					return reject(err);
				resolve(rows);
			});
		})	
	},
	delete_tag: function(id, tag) {
		return new Promise ((resolve, reject) => {
			sql = "DELETE user_tags FROM user_tags INNER JOIN tags ON tags.id = user_tags.tag_id WHERE user_tags.user_id = ? AND tags.tag = ?";
			values = [id, tag];
			db.query(sql, values, ( err, rows ) => {
				if ( err )
					return reject(err);
				resolve(rows);
			});
		})

	},
	delete_tag2: function(id_user_tag) {
		return new Promise ((resolve, reject) => {
			sql = "DELETE user_tags FROM user_tags WHERE id = ? ";
			values = [id_user_tag];
			db.query(sql, values, ( err, rows ) => {
				if ( err )
					return reject(err);
				resolve(rows);
			});
		})

	},
	forget_mail_key: function(login, key){
		var sql = 'UPDATE user SET auth_key_reset = ? WHERE login = ?';
		db.query(sql, [key, login], (err, res) => {
			if (err)
				return (err);
		});
	},
	set_newpwd: function(login, pwd)
	{
		var sql = 'UPDATE user SET password = ? WHERE login = ?';
		db.query(sql, [pwd, login], (err, res) => {
			if (err)
				return (err);
		});
	},
	set_keynull: function(login){
	var sql = 'UPDATE user SET auth_key_reset = NULL WHERE login = ?';
		db.query(sql, [login], (err, res) => {
			if (err)
				return (err);
		});
	}
}
