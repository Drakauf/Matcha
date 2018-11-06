var db = require('../db.js')


module.exports = async function user_address()
{
        var user_address = `CREATE TABLE IF NOT EXISTS user_address(
        id              INT AUTO_INCREMENT PRIMARY KEY,
        user_id         INT NOT NULL,
        number_address  INT default NULL,
        street          VARCHAR(50),
        city            VARCHAR(25),
        zip             INT NOT NULL,
        country         VARCHAR(25),
        complement      VARCHAR(50) DEFAULT NULL,
        latitude        DOUBLE NOT NULL,
        longitude       DOUBLE NOT NULL,
        updated_at      TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at      TIMESTAMP NOT NULL DEFAULT NOW());`

        db.query(user_address, function (error, results, fields) {if (error) throw error; setup_user()});
}

/*
A cause des clees etrangeres toutes les tables de la bdd ne sont pas creees instant...
don't know why...
so function to create the rest of db only if table user has been created.
*/
async function setup_user() 
{
        var query = `CREATE TABLE IF NOT EXISTS user(
        id INT AUTO_INCREMENT PRIMARY KEY,
        last_name VARCHAR(50) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        login VARCHAR(25) NOT NULL,
        birth_date DATE,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(255),
        gender VARCHAR(25),
        affinity VARCHAR(25) default "bisexuel(le)",
        affinity_age_less INT default 18,
        affinity_age_more INT default 77,
        biography VARCHAR(255) default NULL,
        ip_latitude DOUBLE default NULL,
        ip_longitude DOUBLE default NULL,
        ip_city VARCHAR(50) default NULL,
        ip_zip INT default NULL,
        user_location INT default NULL,
        sexappeal INT default 0,
        last_seen TIMESTAMP NULL default NULL,
        auth_key VARCHAR(255),
        auth_key_reset VARCHAR(255) default NULL,
        activated INT DEFAULT 0,
        FOREIGN KEY (user_location) REFERENCES user_address(id),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW());`

        db.query(query, function (error, results, fields) { if (error) throw error; setup_tables();});
}

function setup_tables()
{
    var user_views = `CREATE TABLE IF NOT EXISTS user_views(
        id INT PRIMARY KEY AUTO_INCREMENT,
        viewed  INT NOT NULL,
        viewer  INT NOT NULL,
        FOREIGN KEY (viewed) REFERENCES user(id),
        FOREIGN KEY (viewer) REFERENCES user(id),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW());`


    var user_likes = `CREATE TABLE IF NOT EXISTS user_likes(
        id INT PRIMARY KEY AUTO_INCREMENT,
        liked  INT NOT NULL,
        liker  INT NOT NULL,
        FOREIGN KEY (liked) REFERENCES user(id),
        FOREIGN KEY (liker) REFERENCES user(id),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW());`

    var chat = `CREATE TABLE IF NOT EXISTS chat(
        id INT PRIMARY KEY AUTO_INCREMENT,
        user1   INT NOT NULL,
        user2   INT NOT NULL,
        FOREIGN KEY (user1) REFERENCES user(id),
        FOREIGN KEY (user2) REFERENCES user(id),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW());`

    var tags = `CREATE TABLE IF NOT EXISTS tags(
        id INT PRIMARY KEY AUTO_INCREMENT,
        tag VARCHAR(50),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW());`

    var user_notification = `CREATE TABLE IF NOT EXISTS user_notifications(
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id     INT NOT NULL,
        message     VARCHAR(255),
        type        VARCHAR(10),
        viewed      BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES user(id),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW());`

    var user_report = `CREATE TABLE IF NOT EXISTS user_report(
        id INT PRIMARY KEY AUTO_INCREMENT,
        reporter     INT NOT NULL,
        reported     INT NOT NULL,
        FOREIGN KEY (reported) REFERENCES user(id),
        FOREIGN KEY (reporter) REFERENCES user(id),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW());`

    var user_block = `CREATE TABLE IF NOT EXISTS user_block(
        id INT PRIMARY KEY AUTO_INCREMENT,
        blocker     INT NOT NULL,
        blocked     INT NOT NULL,
        FOREIGN KEY (blocked) REFERENCES user(id),
        FOREIGN KEY (blocker) REFERENCES user(id),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW());`

    var user_chat = `CREATE TABLE IF NOT EXISTS user_chat(
        id INT PRIMARY KEY AUTO_INCREMENT,
        chat_id INT NOT NULL,
        sender  INT NOT NULL,
        message     VARCHAR(255),
        FOREIGN KEY (sender)    REFERENCES user(id),
        FOREIGN KEY (chat_id)   REFERENCES chat(id),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW());`

    var user_tags = `CREATE TABLE IF NOT EXISTS user_tags(
        id INT PRIMARY KEY AUTO_INCREMENT,
        tag_id      INT NOT NULL,
        user_id     INT NOT NULL,
        FOREIGN KEY (tag_id)    REFERENCES tags(id),
        FOREIGN KEY (user_id)   REFERENCES user(id),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW());`

	var pictures = `CREATE TABLE IF NOT EXISTS pictures(
		id 			INT PRIMARY KEY AUTO_INCREMENT,
		picture 	TEXT(200000),
        updated_at 	TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at 	TIMESTAMP NOT NULL DEFAULT NOW());`

	var user_pictures = `CREATE TABLE IF NOT EXISTS user_pictures(
		id 			INT PRIMARY KEY AUTO_INCREMENT,
        user_id     INT NOT NULL,
		picture_id	INT NOT NULL,	
		profil		INT,
		active		INT,
        FOREIGN 	KEY (user_id)   	REFERENCES user(id),
        FOREIGN 	KEY (picture_id)	REFERENCES pictures(id),
        updated_at 	TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at 	TIMESTAMP NOT NULL DEFAULT NOW());`

	var match = `CREATE TABLE IF NOT EXISTS matching(
   	    id 			INT PRIMARY KEY AUTO_INCREMENT,
        matcher      INT NOT NULL,
        matched      INT NOT NULL,
        FOREIGN KEY (matcher) REFERENCES user(id),
        FOREIGN KEY (matched) REFERENCES user(id),
        updated_at 	TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at 	TIMESTAMP NOT NULL DEFAULT NOW());`

	var news = `CREATE TABLE IF NOT EXISTS news(
        id 			INT PRIMARY KEY AUTO_INCREMENT,
        active	    INT NOT NULL,
        passive		INT NOT NULL,
        type        VARCHAR(25),
        read_statut      VARCHAR(25) default NULL,
        FOREIGN KEY (active) REFERENCES user(id),
        FOREIGN KEY (passive) REFERENCES user(id),
        updated_at 	TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at 	TIMESTAMP NOT NULL DEFAULT NOW());`

	var view = `CREATE TABLE IF NOT EXISTS view(
   	    id 			INT PRIMARY KEY AUTO_INCREMENT,
        viewer      INT NOT NULL,
        viewed      INT NOT NULL,
        read_statut      VARCHAR(25) default NULL,
		times		INT,
        FOREIGN KEY (viewer) REFERENCES user(id),
        FOREIGN KEY (viewed) REFERENCES user(id),
        updated_at 	TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
        created_at 	TIMESTAMP NOT NULL DEFAULT NOW());`

    db.query(user_views, function (error, results, fields) {if (error) throw error;});
    db.query(user_likes, function (error, results, fields) {if (error) throw error;});
    db.query(chat, function (error, results, fields) {if (error) throw error;});
    db.query(tags, function (error, results, fields) {if (error) throw error;});
    db.query(user_report, function (error, results, fields) {if (error) throw error;});
    db.query(user_block, function (error, results, fields) {if (error) throw error;});
    db.query(user_chat, function (error, results, fields) {if (error) throw error;});
    db.query(user_tags, function (error, results, fields) {if (error) throw error;});
    db.query(user_notification, function (error, results, fields) {if (error) throw error;});
    db.query(pictures, function (error, results, fields) {if (error) throw error;});
    db.query(user_pictures, function (error, results, fields) {if (error) throw error;});
  	db.query(match, function (error, results, fields) {if (error) throw error;});
    db.query(news, function (error, results, fields) {if (error) throw error;});
    db.query(view, function (error, results, fields) {if (error) throw error;});
}
