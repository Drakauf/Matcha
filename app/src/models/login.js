var db = require('../db');
const bcrypt = require('bcrypt');

module.exports = {
	check_and_get: function(user, password) {
		var sql = 'SELECT * FROM `user` WHERE login = ? AND NOT (activated = 0)';
		return new Promise ((success, error) => 
				{
					db.query(sql, [user, password], (err, res) => {
						if (err)
							return error(err);
						success(res);
					});
				})
		.then(data => {
			if (data.length == 0)
				return "error";
			if (bcrypt.compareSync(password, data[0].password))
			{
				delete data[0].password;
				var sess = data;
				return new Promise ((resolve, reject) => {
					var sql = "UPDATE `user` SET last_seen = NULL WHERE id = ?";
					db.query(sql, data[0].id, ( err, rows ) => {
							if ( err )
								return reject(err);
							resolve(sess);
						});
				})
				//return (data);
			}
			else {
				return "error";
			}
		})
	},
	valid_mail: function(key){
		var sql = 'UPDATE `user` SET activated = -1 WHERE auth_key = ? AND activated = 0';
		db.query(sql, [key], (err, res) => {
			if (err)
			{
				console.log(err);
				return err
			}
		});
	},
	photo: function(user_id){
		var sql = 'SELECT picture FROM `pictures` WHERE id IN  (SELECT picture_id from user_pictures WHERE user_id = ? and profil = 1)';
		return new Promise ((success, error) => 
				{
					db.query(sql, [user_id], (err, res) => {
						if (err)
							return error(err);
						if (res.length - 1 >= 0)
							success(res[res.length-1]);
						else
							success(res);
					});
				})
		.then(data => {
			if (data.length == 0) {
				var img = [["https://image.flaticon.com/icons/png/512/552/552848.png"]];
				var query = "INSERT INTO `pictures`(picture) VALUES ?";
				return new Promise ((resolve, reject) => {
					db.query(query, [img], (err, res) => {
					if (err)
						return reject(err);
					resolve(res.insertId);
					});
				})
					.then(data => {
						var query2 = "INSERT INTO `user_pictures`(user_id, picture_id, profil) VALUE ?";
						var values = [[user_id, data, "1"]];
						db.query(query2, [values], (err, res) => {
							if (err)
								throw (err);
						});
						return("https://image.flaticon.com/icons/png/512/552/552848.png");
					})
			}
			else
				return (data.picture);
		})
		.catch(error => {
			console.log(error);
		})
	}
}
