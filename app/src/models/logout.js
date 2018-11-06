var db = require('../db');
module.exports = {
	deco: function(id) {
		var sql = 'UPDATE `user` SET last_seen=now() WHERE id = ?';
		db.query(sql, [id], (err, res) => {
			if (err)
			{
				throw (err);
			}
		});
	}
}
