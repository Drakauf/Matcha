var express = require('express');
var session = require('express-session');
const moment = require('moment');

var UserModels = require('../models/user');


function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}

function sort_all(id, sess, affinity_age_less, affinity_age_more) {
	var lat1;
	var long1;
	var tmp;
	var i = 0;
	return new Promise (function (resolve, reject) {
		UserModels.get_coordonates(id)
			.then (coordonates => {
				var user_tmp = [];
				lat1 = coordonates[0].latitude;
				long1 = coordonates[0].longitude;
				UserModels.get_user_no_filter(sess)
					.then(user => {;
						while(i <  user.length)
						{
							if (user[i].last_seen != null) 
								user[i].last_seen = "red";
							else
								user[i].last_seen = "green";
							user[i].birth_date = moment().diff(moment(user[i].birth_date, 'YYYYMMDD'), 'years');
							user[i].distance = distance(lat1, long1, user[i].latitude, user[i].longitude,"K");
							i++;
						}
						return (user);
				})
				.then (user => {
					i = 0;
					j = 0;
					var user2 = [];
					while(i <  user.length)
						{
							if (user[i].birth_date < affinity_age_less || user[i].birth_date > affinity_age_more) {
								i++;	
							}
							else {
								user2[j] = user[i];
								j++; 
								i++;
							}
						}
						return (user2);
				})
				.then (async user=> {
					if (!user[0])
						return "error";
					i = 0;
					j = 0;
					var user3 = [];
					while(i <  user.length) {
						if (user[i].blocked != null)
							i++;
						else {
							user3[j] = user[i];
							j++;
							i++;
						}
					}
					return (user3);
				})
				.then (async user => {
					if (user.length == 0 || user == 'error') 
						return "error";
					i = 0;
					var tag  =  await UserModels.get_common_tags(id, user);
					var len = tag.length;
					while (i < len) {
							user[i].tags = tag[i];
							if (user[i].distance == 0)
								user[i].sexappeal + tag[i] * 5;
							else
								user[i].points = user[i].sexappeal + tag[i] * 5 - (user[i].distance / 2 ); 
						i++;
					}
					return user;
				})
				.then (user => {
					i = 0;
					while (i < (user.length - 1)) {
						if (user[i].points < user[i + 1].points) {
							tmp = user[i];
							user[i] = user[i + 1];
							user[i + 1] = tmp
							i = 0
						}
						else
							i++;
					}
					resolve(user);
				})
		})
	})
}

function sort_sexappeal(req) {
	return new Promise (function(resolve, reject){
		var i = 0;
		while (i < (req.user_sort.length - 1)) {
			if (req.user_sort[i].sexappeal < req.user_sort[i + 1].sexappeal) {
				tmp = req.user_sort[i];
				req.user_sort[i] = req.user_sort[i + 1];
				req.user_sort[i + 1] = tmp
				i = 0
			}
			else
				i++;
		}	
		resolve(req.user_sort);
	})

}

function sort_connected(req) {
	return new Promise (function(resolve, reject){
		var i = 0;
		var j = 0;
		var user_connected = [];
		var len = req.user_sort.length;
		while (i < len) {
			if (req.user_sort[i].last_seen == "green") {
				user_connected[j] = req.user_sort[i];
				j++;
			}
			i++;
		}
		resolve(user_connected);
	})
}

function sort_tag(req, nb_tag) {
	return new Promise (function(resolve, reject){
		var i = 0;
		var j = 0;
		var user = [];
		var len = req.user_sort.length;
		while (i < len) {
			if (req.user_sort[i].tags >= nb_tag) {
				user[j] = req.user_sort[i];
				j++;
			}
			i++;
		}
		if (!user[0])
			resolve("error");
		resolve(user);
	})
}

function sort_distance(req, km) {
	return new Promise (function(resolve, reject){
		var i = 0;
		var j = 0;
		var user = [];
		var len = req.user_sort.length;
		while (i < len) {
			if (req.user_sort[i].distance <= km) {
				user[j] = req.user_sort[i];
				j++;
			}
			i++;
		}
		if (!user[0])
			resolve("error");
		resolve(user);
	})

}

module.exports = {
	no_filter: async function (req, res, next) {
		sess = req.session;
		if (sess.user) {
			sort_all(sess.user.id, sess.user, sess.user.affinity_age_less, sess.user.affinity_age_more)
			.then(user => {
				req.user_sort = user;
				next();
			})						
		}
		else
			next();
	},
	filter_connected: function(req, res, next) {
		sort_connected(req)
		.then(user_connected => {
			req.user_sort = user_connected;
			next();
		})		
	},
	filter_parse: function(req, res, next) {
		sess = req.session;
			if (sess.user) {
				sort_all(sess.user.id, sess.user, req.form.affinity_age_less, req.form.affinity_age_more)
				.then(user => {
					if (user == "error") {
						res.status(400);
						res.send("Aucun profil ne correspond à votre recherche");
						next();
						// sort by tag 
						// sort by distance
					}
					else {
						req.user_sort = user;
						sort_tag(req, req.form.common_tag)
						.then(async user_tag => {
							if (user_tag == "error") {
								res.status(400);
								res.send("Aucun profil avec au moins " + req.form.common_tag + " ne correspond à votre recherche");
								next();	
							}
							req.user_sort = await user_tag;
							sort_distance(req, req.form.km)
							.then(async user_distance => {
								if (user_distance == "error") {
									res.status(400);
									res.send("Aucun profil dans un périmètre de " + req.form.km + "km ne correspond à votre recherche");
									next();
								}
								req.user_sort = await user_distance;
								if (req.form.sexappeal == "on") {
									sort_sexappeal(req)
									.then(async user_sexappeal => {
										req.user_sort = await user_sexappeal;
										if (req.form.connected == "on") {
										sort_connected(req)
										.then(user_connected => {
											if (user == "error") {
												res.status(400);
												res.send("Aucun profil connecté ne correspond à votre recherche");
												next();
											}
											req.user_sort = user_connected;
											next();
										})
									}
									else
										next();
										
									})
								}
								else { 
									if (req.form.connected == "on") {
										sort_connected(req)
										.then(user_connected => {
											if (user == "error") {
												res.status(400);
												res.send("Aucun profil connecté ne correspond à votre recherche");
												next();
											}
											req.user_sort = user_connected;
											next();
										})
									}
									else
										next();
								}
								})
						})
					}
				})						
			}
	}
}
