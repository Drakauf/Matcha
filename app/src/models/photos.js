var db = require('../db');

module.exports = {
	photo:		function(photo_id)
	{
		var sql = 'SELECT * FROM `pictures` WHERE id = ?';
		return new Promise ((success, error) =>
				{
					db.query(sql, [photo_id], (err, res) => {
						if (err)
							return error(err);
						success(res);
					});
				})
	},

	all_photos: function(user_id)
	{
		var sql = 'SELECT id , picture FROM `pictures` WHERE id IN (SELECT picture_id from user_pictures WHERE user_id = ?)';
		return new Promise ((success, error) =>
				{
					db.query(sql, [user_id], (err, res) => {
						if (err)
							return error(err);
						success(res);
					});
				})
	},

	this_photo: function(photo_id)
	{
		var sql = 'SELECT * FROM `user_pictures` WHERE picture_id = ?';
		return new Promise ((success, error) =>
				{
					db.query(sql, [photo_id], (err, res) => {
						if (err)
							return error(err);
						success(res);
					});
				})

	},

	profil: function(photo_id, user_id)
	{
		var req = 'UPDATE `user_pictures` SET active = 0 WHERE picture_id = ?';
		db.query(req, [photo_id], (err, res) => {
			if (err)
				return err;
		});
		var sql = 'UPDATE `user_pictures` SET profil = (case when picture_id != ? then 0 when picture_id = ? then 1 end) WHERE user_id = ?';
		return new Promise ((success, error) =>
				{
					db.query(sql, [photo_id, photo_id, user_id], (err, res) => {
						if (err)
							return error(err);
						success(res);
					});
				})
	},

	descri: function(user_id, photo_id, nbr)
	{
		var req = 'UPDATE `user_pictures` SET profil = 0 WHERE picture_id = ?';
		db.query(req, [photo_id], (err, res) => {
			if (err)
				return err;
		});
		var req2 = 'UPDATE `user_pictures` SET active = 0 WHERE user_id = ? AND active = ?';
		db.query(req2, [user_id, nbr], (err, res) => {
			if (err)
				return err;
		});
		var sql = 'UPDATE `user_pictures` SET active = ?  WHERE picture_id = ?';
		return new Promise ((success, error) =>
				{
					db.query(sql, [nbr, photo_id], (err, res) => {
						if (err)
							return error(err);
						success(res);
					});
				})
	},

	delphoto: function(photo_id)
	{
		var req = 'DELETE FROM `user_pictures`  WHERE picture_id = ?';
		db.query(req, [photo_id], (err, res) => {
			if (err)
				return err;
		});
		var sql = 'DELETE FROM `pictures`  WHERE id = ?';
		return new Promise ((success, error) =>
				{
					db.query(sql, [photo_id], (err, res) => {
						if (err)
							return error(err);
						success(res);
					});
				})
	}
}
