var db = require('../db');

module.exports = {
	get_chat_id: function(id) {
		sql = "SELECT user.id, user.login, chat.id, user_block.blocked, news.read_statut FROM `user` \
				INNER JOIN chat ON (user.id = chat.user2 OR user.id = chat.user1) \
				LEFT JOIN user_block ON ((user.id = user_block.blocker AND user_block.blocked = ?) \
					OR (user.id = user_block.blocked AND user_block.blocker = ?)) \
				LEFT JOIN news ON (news.passive = ? AND news.active = user.id AND type = 'chat') \
				WHERE IF(user.id = user1, chat.user2 = ?, chat.user1 = ?)"; 
		return new Promise ((resolve, reject) => {
			db.query(sql, [id, id, id, id, id], ( err, rows ) => {
				if ( err )
					return reject(err);
				resolve(rows);
			});
		});
	},
	get_login2 (chat_id, id) {
		sql = "SELECT user.login FROM user \
				INNER JOIN chat ON IF(chat.user1 = ?, chat.user2 = user.id, chat.user1 = user.id) \
				WHERE chat.id = ?";
		return new Promise ((resolve, reject) => {
			db.query(sql, [id, chat_id], ( err, rows ) => {
				if ( err )
					return reject(err);
				resolve(rows[0].login);
			});
		});		
	},
	chat_exist: function(chat_id, id) {
		sql = "SELECT * FROM `chat` WHERE id = ? AND (user1 = ? OR user2 = ?)";
		return new Promise ((resolve, reject) => {
			db.query(sql, [chat_id, id, id], ( err, rows ) => {
				if ( err )
					return reject(err);
				resolve(rows);
			});
		});
	},
	save_message: function(chat_id, user_id, message){
		message = message.replace(/[\\$'"]/g, "\\$&");
		sql = "INSERT INTO user_chat(chat_id, sender, message) VALUES (" + chat_id + "," + user_id + ",'" + message + "')";
		return new Promise ((resolve, reject) => {
			db.query(sql, ( err, rows ) => {
				if ( err )
					return reject(err);
				sql = "SELECT user1, user2 FROM chat WHERE id = " + chat_id;
				db.query(sql, ( err, rows ) => {
					if ( err )
						return reject(err);
					if (rows[0].user1 == user_id)
						var sender_id = rows[0].user2;
					else
						var sender_id = rows[0].user1;
					sql2 = "UPDATE news SET read_statut = 'red' \
						WHERE (active = " + user_id + " AND passive = " + sender_id + ")  AND type = 'chat' ";
					db.query(sql2, ( err, rows ) => {
						if ( err )
							return reject(err);
						if (rows.affectedRows == 0) {
							sql3 = "INSERT INTO news(active, passive, type, read_statut) \
								VALUES (" + user_id + ", " + sender_id + ", 'chat', 'red')";
						 	db.query(sql3, ( err, rows ) => {
								if ( err )
									return reject(err);
							});
						}						
					})	
				})
			})
		})
	},
	get_history: function(chat_id) {
		sql = "SELECT * FROM (SELECT user_chat.updated_at, user.login, user_chat.message FROM user_chat \
				INNER JOIN user ON user.id = user_chat.sender WHERE user_chat.chat_id = ? \
				ORDER BY user_chat.updated_at DESC LIMIT 50) sub ORDER BY updated_at ASC";
		return new Promise ((resolve, reject) => {
			db.query(sql, [chat_id], ( err, rows ) => {
				if ( err )
					return reject(err);
				resolve(rows);
			});
		});
	},
	get_receiver: function(sender_id, chat_id) {
		sql = "SELECT user.id FROM user \
				INNER JOIN chat ON (user.id = chat.user2 OR user.id = chat.user1) \
				WHERE IF(user.id = user1, chat.user2 = ?, chat.user1 = ?) AND chat.id = ?";
		return new Promise ((resolve, reject) => {
			db.query(sql, [sender_id, sender_id, chat_id], ( err, rows ) => {
				if ( err )
					return reject(err);
				if (rows[0])
					resolve(rows[0].id);
			});
		});

	},
	reset_read: function(user_id, chat_id) {
		sql = "SELECT user1, user2 FROM chat WHERE id = " + chat_id;
				db.query(sql, ( err, rows ) => {
					if ( err )
						return reject(err);
					if (rows[0].user1 == user_id)
						var sender_id = rows[0].user2;
					else
						var sender_id = rows[0].user1;
					sql = "UPDATE news SET news.`read_statut` = 'transparent' WHERE passive = ? AND active = ? AND type = 'chat' ";
					db.query(sql, [user_id, sender_id], (err, rows) =>{
						if (err)
							error(err);
					})
		});
	}

}