var db= require('../db');
module.exports = {
	add_points: function(user_id, points)
	{
		var sql = 'UPDATE user SET sexappeal = sexappeal + ?  WHERE id = ?';
				db.query(sql, [points ,user_id], (err, res) => {
					if (err)
						return (err);
				});


	},
	user: function(user_id)
	{
		var sql = 'SELECT * FROM `user` WHERE id = ?';
		return new Promise ((success, error) =>
				{
					db.query(sql, [user_id], (err, res) => {
						if (err)
							return reject(err);
						if (res.length > 0)
							success(res[0]);
						else
							success(res);
					});
				})
	},

	desc: function(user_id, nbr){
		var sql = 'SELECT picture FROM `pictures` WHERE id IN  (SELECT picture_id from user_pictures WHERE user_id = ? and active = ?)';
		return new Promise ((success, error) =>
				{
					db.query(sql, [user_id, nbr], (err, res) => {
						if (err)
							return error(err);
						if (res.length - 1 >= 0)
							success(res[res.length-1]);
						else
							success(res);
					});
				})
		.then(data => {
			if (data.length == 0)
				return "https://image.flaticon.com/icons/png/512/552/552848.png";
			else
				return (data.picture);
		})
		.catch(error => {
			console.log(error);
		})
	},

	city: function(user_id)
	{
		var sql = 'SELECT * FROM `user_address` WHERE user_id = ?';
		return new Promise ((success, error) =>
				{
					db.query(sql, [user_id], (err, res) => {
						if (err)
							return reject(err);
						if (res.length > 0)
							success(res[0].city);
						else
							success("N/A");
					});
				})
	},

	news: function(active, passive, type)
	{
		return new Promise((success, error) => {
			var sql = 'DELETE FROM news WHERE active= ? AND  passive = ? AND type = ?';
			db.query(sql, [active, passive, type], (err, res) => {
				if (err)
					return (err);
				success(res);
			});
		})
		.then(data=>{
			var sql = 'INSERT INTO news(active, passive, type, `read_statut`) VALUES ?';
			db.query(sql, [[[active, passive, type, 'red']]], (err, res) => {
				if (err)
					return (err);
			});
		})
	},

	view: function(viewer, viewed)
	{
		var sql = 'SELECT * FROM view WHERE viewer = ? AND viewed = ?';
		return new Promise ((success, error) =>
				{
					db.query(sql, [viewer, viewed], (err, res) => {
						if (err)
							return reject(err);
						if (res.length == 0)
							success("first");
						else
							success(res[0].times);
					});
				})
		.then(data =>{
			if (data == "first")
			{
				var sql = 'INSERT INTO view(viewer, viewed, times, `read_statut`) VALUES ?';
				db.query(sql, [[[viewer, viewed, 1, 'red']]], (err, res) => {
					if (err)
						return (err);
				});
			}
			else
			{
				var sql = 'UPDATE view SET times = ?, `read_statut` = ? WHERE viewer = ? AND viewed = ?';
				db.query(sql, [data + 1 , 'red', viewer, viewed], (err, res) => {
					if (err)
						return (err);
				});

			}
		})
	},

	my_matching: function(matcher, matched)
	{
		var sql = 'SELECT * FROM matching WHERE matcher = ? AND matched = ?';
		return new Promise ((success, error) =>
				{
					db.query(sql, [matcher, matched], (err, res) => {
						if (err)
							return reject(err);
						if (res.length == 0)
							success(0);
						else
							success(1);
					});

				});
	},

	is_matching_me: function(me, him)
	{
		var sql = 'SELECT * FROM matching WHERE matcher = ? AND matched = ?';
		return new Promise ((success, error) =>
				{
					db.query(sql, [him, me], (err, res) => {
						if (err)
							return reject(err);
						if (res.length == 0)
								success(0);
						else
							success(1);
					});

				});
	},

	match: function(matcher, matched)
	{
		var sql = 'SELECT * FROM matching WHERE matcher = ? AND matched = ?';
		db.query(sql, [matcher, matched], (err, res) => {
			if (res.length == 0)
			{
				var sql = 'INSERT INTO matching(matcher, matched) VALUES ?';
				db.query(sql, [[[matcher, matched]]], (err, res) => {
					if (err)
						return (err);
					var sql = 'SELECT * FROM matching WHERE matched = ? AND matcher = ?';
					db.query(sql, [matcher, matched], (err, res) => {
						if (res.length == 0)
							this.news(matcher, matched, "match");
						else
							this.news(matcher, matched, "match_back");
					})
			});
			}
		});
		
	},

	unmatch: function(matcher, matched)
	{
		var sql = 'DELETE FROM matching WHERE matcher= ? AND  matched = ?';
		db.query(sql, [matcher, matched], (err, res) => {
			if (err)
				return (err);
		});
		this.news(matcher, matched, "unmatch");
	},

	im_blocked: function(me, him)
	{
		var sql = 'SELECT * FROM user_block WHERE (blocker = ? AND blocked = ? ) OR (blocker = ? AND blocked = ?)';
		return new Promise ((success, error) =>
				{
					db.query(sql, [him, me, me, him], (err, res) => {
						if (err)
							return reject(err);
						if (res.length == 0)
							success(0);
						else
							success(1);
					});
				});
	},

	block: function(blocker, blocked)
	{
		var sql = 'INSERT INTO user_block(blocker, blocked) VALUES ?';
		db.query(sql, [[[blocker, blocked]]], (err, res) => {
			if (err)
				return (err);
		});
	},

	report: function(reporter, reported)
	{
		var sql = 'INSERT INTO user_report(reporter, reported) VALUES ?';
		db.query(sql, [[[reporter, reported]]], (err, res) => {
			if (err)
				return (err);
		});
	},
	i_reported: function(reporter, reported)
	{
		var sql = 'SELECT * FROM user_report WHERE reporter = ? AND reported = ?';
		return new Promise ((success, error) =>
				{
					db.query(sql, [reporter, reported], (err, res) => {
						if (err)
							return reject(err);
						if (res.length == 0)
							success(0);
						else
							success(1);
					});
				});
	},

	chat_exist: function(me, him)
	{
		var sql = 'SELECT * FROM chat WHERE (user1 = ? AND user2 = ? ) OR (user1 = ? AND user2 = ?)';
		return new Promise ((success, error) =>
				{
					db.query(sql, [him, me, me, him], (err, res) => {
						if (err)
						{
							return error(err);
						}
						if (res.length == 0)
							success("no");
						else
						{
							success(res[0].id);
						}
					});
				});
	},

	create_chat: function(user1, user2)
	{
		var sql = 'INSERT INTO chat(user1, user2) VALUES ?';
		return new Promise ((success, error) => {
			db.query(sql, [[[user1, user2]]], (err, res) => {
			if (err)
			{
				return (error(err));
			}
			success(res.insertId);
			this.news(user1, user2, "chat");
		});
		});
	}
}
