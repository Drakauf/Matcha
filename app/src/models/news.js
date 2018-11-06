var db = require('../db');

module.exports = {
	viewers: function(id)
	{
		return new Promise ((success, error) => {
			var sql = 'SELECT view.read_statut, user_block.blocked, user.id, user.login, pictures.picture FROM view \
						INNER JOIN `user` ON user.id = view.viewer \
						INNER JOIN user_pictures ON user_pictures.user_id = user.id \
						INNER JOIN pictures ON user_pictures.picture_id = pictures.id \
						LEFT JOIN user_block ON ((view.viewer = user_block.blocked AND user_block.blocker = ?) \
						OR (view.viewer = user_block.blocker AND user_block.blocked = ?)) \
						WHERE viewed = ? AND (pictures.id = user_pictures.picture_id AND user_pictures.profil = 1) \
						ORDER BY view.updated_at DESC';
			db.query(sql, [id, id, id], (err, rows) => {
				if (err)
					error(err);
				success(rows);
			});
		});
	},
	u_matched: function(id, statu)
	{
		return new Promise ((success, error) => {
			var sql = "SELECT news.read_statut, user_block.blocked, user.id, user.login, pictures.picture FROM news \
						INNER JOIN `user` ON user.id = news.active \
						INNER JOIN user_pictures ON user_pictures.user_id = user.id \
						INNER JOIN pictures ON user_pictures.picture_id = pictures.id \
						LEFT JOIN user_block ON ((user.id = user_block.blocked AND user_block.blocker = ?) \
    							OR (user.id = user_block.blocker AND user_block.blocked = ?)) \
						WHERE news.passive = ? AND news.type = ? \
						AND (pictures.id = user_pictures.picture_id AND user_pictures.profil = 1) \
						ORDER BY news.updated_at DESC";
			db.query(sql, [id, id, id, statu], (err, rows) =>{
				if (err)
					error(err);
				success(rows);
			});
		});
	},
	reset_read: function(id) {
		sql = "UPDATE news SET `read_statut` = 'transparent' WHERE news.passive = ? AND news.type <> 'chat'";
		sql2 = "UPDATE view SET `read_statut` = 'transparent' WHERE view.viewed = ? ";
		db.query(sql, [id], (err, rows) =>{
				if (err)
					error(err);
		});
		db.query(sql2, [id], (err, rows) =>{
				if (err)
					error(err);
		});
	},
	nb_notifs(id) {
		sql = "SELECT ( \
 					(SELECT COUNT(*) FROM view  WHERE view.viewed = ? AND view.`read_statut` = 'red') + \
    				(SELECT COUNT(*) FROM news  WHERE news.passive = ? AND news.`read_statut` = 'red' AND type <> 'chat') \
					) AS res FROM dual";
		return new Promise ((success, error) => {
			db.query(sql, [id, id], (err, rows) =>{
				if (err)
					error(err);
				if (rows[0]) {
					success(rows[0].res);
				}
			});
		});		
	},
	nb_notifs_chat(id) {
		sql = "SELECT COUNT(*) FROM news  WHERE news.passive = ? AND news.`read_statut` = 'red' AND type = 'chat'";
		return new Promise ((success, error) => {
			db.query(sql, [id, id], (err, rows) =>{
				if (err)
					error(err);
				if (rows[0]) {
					success(rows[0]['COUNT(*)'])
				}
			});
		});
		
	}
}
