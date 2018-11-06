var db = require('../db');
var fs = require('fs');

module.exports = {
	upload: function(user_id, path)
	{
		var bitmap = fs.readFileSync(path);
		var img = [["data:image/png;base64," +  Buffer.from(bitmap).toString('base64')]];

	var query = "INSERT INTO `pictures`(picture) VALUES ?";
		return new Promise ((resolve, reject) => {
			db.query(query, [img], (err, res) => {
				if (err)
					return reject(err);
				resolve(res.insertId);
			});
		})
		.then(data => {
			var query2 = "INSERT INTO `user_pictures`(user_id, picture_id) VALUE ?";
			var values = [[user_id, data]];
			db.query(query2, [values], (err, res) => {
				if (err)
					throw (err);
			});
			return("done");
		})
	}
}
