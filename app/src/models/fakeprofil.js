var db = require('../db');
const bcrypt = require('bcrypt');

function RandomInt(i)
{
	var number = Math.random() * i;
	number = Math.floor(number);
	return (number);
}

var tags = [
	"#work",
	"#studies",
	"#DoingNothing",
	"#velo",
	"#trotti",
	"#skate",
	"#Pokemon",
	"#DragonBall",
	"#Dracaufeu",
	"#Celebrity",
	"#Fun",
	"#FeelBad",
	"#LOL",
	"#Proud",
	"#Science",
	"#Maths",
	"#French",
	"#Philosophy",
	"#KakunaRattata"
]

function createtag(tag) {
	var sqlsearch = "SELECT *FROM tags WHERE tag = ?";
	db.query(sqlsearch, [tag], (err, res) =>
			{
				if (err)
					console.log(err);
				if (res.length == 0)
				{
					var sqlcrea = "INSERT INTO `tags`(tag) VALUE ?";
					db.query(sqlcrea, [[[tag]]], (err, res) =>
							{
								if (err)
									console.log(err);
							});

				}
			});
}

function addtag(id, tagtab)
{
	var i = 0;

	function linktag(tag)
	{
		var sqlsearch = "SELECT * FROM tags WHERE tag = ?";
		db.query(sqlsearch, [tag], (err, res) =>
				{
					if (err)
						console.log(err);
					if (res.length != 0)
					{
						var sqlcrea = "INSERT INTO `user_tags`(tag_id, user_id) VALUE ?";
						db.query(sqlcrea, [[[res[0].id, id]]], (err, res) =>
								{
									if (err)
										console.log(err);
								});
					}
				});


	}

	while(i < tagtab.length)
	{
		linktag(tags[tagtab[i]]);
		i++;
	}
}

function getusertag()
{
	var tabtag = tags;
	var i = RandomInt(5) + 1;
	var j = 0;
	var usertag = [];

	while (j < i)
	{
		var k = RandomInt(19);
		if (j == 0)
		{
			usertag.push(k);
			j++;
		}
		else if (!(usertag.includes(k)))
		{
			usertag.push(k);
			j++;
		}
	}
	j = 0;
	while(j < i)
	{
		createtag(tags[usertag[j]]);
		j++;
	}
	return (usertag);
}

function affinity_range()
{
	var min = RandomInt(59) + 18;
	var max = min + RandomInt(78 - min);
	if (min == max && max < 77)
		max++;
	else if (min == max) 
		min--;
	return ([min, max]);
}

function citydetails()
{
	var cities = [
		["Paris", "75001", "48.84495494047618", "2.376084880952381"],
		["Lille", "59000", "50.63452821167886", "3.0510686131386864"],
		["Paris", "75002", "48.84495494047618", "2.376084880952381"],
		["Lyon", "69004", "45.76757146118722", "4.823975114155247"],
		["Paris", "75003", "48.84495494047618", "2.376084880952381"],
		["Paris", "75004", "48.84495494047618", "2.376084880952381"],
		["Marseille", "13003", "43.259333573211315", "5.370367915973383"],
		["Paris", "75005", "48.84495494047618", "2.376084880952381"],
		["Paris", "75006", "48.84495494047618", "2.376084880952381"],
		["Paris", "75007", "48.84495494047618", "2.376084880952381"],
		["Toulouse", "31100", "43.60790065616799", "1.4383100000000002"],
		["Paris", "75008", "48.84495494047618", "2.376084880952381"],
		["Paris", "75009", "48.84495494047618", "2.376084880952381"],
		["Paris", "75011", "48.84495494047618", "2.376084880952381"],
		["Lyon", "69003", "45.76757146118722", "4.823975114155247"],
		["Paris", "75012", "48.84495494047618", "2.376084880952381"],
		["Marseille", "13008", "43.259333573211315", "5.370367915973383"],
		["Paris", "75014", "48.84495494047618", "2.376084880952381"],
		["Paris", "75015", "48.84495494047618", "2.376084880952381"],
		["Marseille", "13010", "43.259333573211315", "5.370367915973383"],
		["Paris", "75019", "48.84495494047618", "2.376084880952381"],
		["Lille", "59160", "50.63452821167886", "3.0510686131386864"],
		["Paris", "75020", "48.84495494047618", "2.376084880952381"],
		["Lille", "59260", "50.63452821167886", "3.0510686131386864"],
		["Toulouse", "31200", "43.60790065616799", "1.4383100000000002"],
		["Lille", "59800", "50.63452821167886", "3.0510686131386864"],
		["Lyon", "69001", "45.76757146118722", "4.823975114155247"],
		["Lyon", "69002", "45.76757146118722", "4.823975114155247"],
		["Paris", "75016", "48.84495494047618", "2.376084880952381"],
		["Marseille", "13002", "43.259333573211315", "5.370367915973383"],
		["Lyon", "69005", "45.76757146118722", "4.823975114155247"],
		["Marseille", "13006", "43.259333573211315", "5.370367915973383"],
		["Lyon", "69008", "45.76757146118722", "4.823975114155247"],
		["Marseille", "13013", "43.259333573211315", "5.370367915973383"],
		["Lyon", "69009", "45.76757146118722", "4.823975114155247"],
		["Marseille", "13001", "43.259333573211315", "5.370367915973383"],
		["Paris", "75013", "48.84495494047618", "2.376084880952381"],
		["Marseille", "13004", "43.259333573211315", "5.370367915973383"],
		["Marseille", "13005", "43.259333573211315", "5.370367915973383"],
		["Lille", "59777", "50.63452821167886", "3.0510686131386864"],
		["Marseille", "13007", "43.259333573211315", "5.370367915973383"],
		["Paris", "75018", "48.84495494047618", "2.376084880952381"],
		["Marseille", "13009", "43.259333573211315", "5.370367915973383"],
		["Marseille", "13011", "43.259333573211315", "5.370367915973383"],
		["Lyon", "69006", "45.76757146118722", "4.823975114155247"],
		["Marseille", "13012", "43.259333573211315", "5.370367915973383"],
		["Lyon", "69007", "45.76757146118722", "4.823975114155247"],
		["Marseille", "13014", "43.259333573211315", "5.370367915973383"],
		["Paris", "75017", "48.84495494047618", "2.376084880952381"],
		["Marseille", "13015", "43.259333573211315", "5.370367915973383"],
		["Rennes", "35200", "48.110870645161306", "-1.680148629032257"],
		["Marseille", "13016", "43.259333573211315", "5.370367915973383"],
		["Drancy", "93700", "48.923822976190486", "2.4538282142857155"],
		["Brest", "29200", "48.402931706263466", "-4.501745593952485"],
		["Toulouse", "31000", "43.60790065616799", "1.4383100000000002"],
		["Bordeaux", "33000", "44.85851953216375", "-0.5906000584795318"],
		["Toulouse", "31300", "43.60790065616799", "1.4383100000000002"],
		["Paris", "75010", "48.84495494047618", "2.376084880952381"],
		["Toulouse", "31400", "43.60790065616799", "1.4383100000000002"],
		["Bordeaux", "33100", "44.85851953216375", "-0.5906000584795318"],
		["Rennes", "35000", "48.110870645161306", "-1.680148629032257"],
		["Bordeaux", "33200", "44.85851953216375", "-0.5906000584795318"],
		["Toulouse", "31500", "43.60790065616799", "1.4383100000000002"],
		["Bordeaux", "33300", "44.85851953216375", "-0.5906000584795318"],
		["Bordeaux", "33800", "44.85851953216375", "-0.5906000584795318"],
		["Rennes", "35700", "48.110870645161306", "-1.680148629032257"]
			]
				return (cities[RandomInt(66)]);
}

module.exports = {
	create: function(user)
	{
		var pwd = bcrypt.hashSync(user.login.password, 10);
		var dob = user.dob.date;
		var affinity = ["Homme", "Femme", "bisexuel(le)"];
		var affinity_age = affinity_range();
		var gender;
		var usertags = getusertag();
		if (user.gender == "male")
			gender = "Homme";
		else
			gender = "Femme";
		dob = dob.substr(0, 10);
		city = citydetails();
		var sql = "INSERT INTO `user`(login, last_name, first_name, birth_date, email,  password, gender, affinity, affinity_age_less, affinity_age_more, ip_latitude, ip_longitude, ip_city, ip_zip, sexappeal,  activated) VALUES ?";
		var values = [[user.login.username, user.name.last, user.name.first, dob, user.email, pwd, gender, affinity[RandomInt(3)], affinity_age[0], affinity_age[1], city[2], city[3], city[0], city[1], RandomInt(501), 1]];
				return new Promise ((resolve, reject) => {
				db.query(sql, [values], (err, res) => {
				if (err)
				return reject(err);
				resolve(res.insertId);
				});
				})
				.then(data => {
				var img = [[user.picture.medium]];
				var query = "INSERT INTO `pictures`(picture) VALUES ?";
				return new Promise ((resolve, reject) => {
				db.query(query, [img], (err, res) => {
				if (err)
				return reject(err);
				resolve(res.insertId);
				});
				})
				.then(photoid => {
				var photosql = "INSERT INTO `user_pictures`(user_id, picture_id, profil) VALUE ?";
				var values = [[data, photoid, "1"]];
				db.query(photosql, [values], (err, res) => {
				if (err)
				throw (err);
				});
				return(data);
				})
				})
				.then(data => {
				var addresssql = "INSERT INTO `user_address`(user_id, city, zip, latitude, longitude) VALUE ?";
				var values = [[data, city[0], city[1], city[2], city[3]]];
				db.query(addresssql, [values], (err, res) => {
				if (err)
				throw (err);
				});
				return (data);
				})
				.then(data => {
				addtag(data, usertags);
				return(data);
				});
	}
}
