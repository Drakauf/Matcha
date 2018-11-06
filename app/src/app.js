var express = require('express');
var session = require('express-session');
var app = express();
var db = require('./db');
var path = require("path");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(session({secret: 'shan', proxy: true, resave: true, saveUninitialized: true}));
app.use(express.static(path.join(__dirname, 'public')));

var createDatabase = require('./config/database_setup');
var socketEvents = require('./middlewares/socketEvents');

app.use('/setup', function (req, res) {
	createDatabase();
    res.render('setup.pug')
    });

var HomeControllers = require('./controllers/home');
var signupController = require('./controllers/signup');
var loginController = require('./controllers/login');
var logoutController = require('./controllers/logout');
var UpdateControllers = require('./controllers/update');
var PhotosControllers = require('./controllers/photos');
var UploadControllers = require('./controllers/upload');
var ProfilControllers = require('./controllers/profil');
var NewsControllers = require('./controllers/news');
var ChatControllers = require('./controllers/chat');
var NotificationsControllers = require('./controllers/notifications');
var FakerControllers = require('./controllers/fakeprofil');



app.use('/', HomeControllers);
app.use('/signup', signupController);
app.use('/login', loginController);
app.use('/logout', logoutController);
app.use('/user/update', UpdateControllers);
app.use('/user/photos', PhotosControllers);
app.use('/upload', UploadControllers);
app.use('/profil', ProfilControllers);
app.use('/news', NewsControllers);
app.use('/chat', ChatControllers);
app.use('/notifications', NotificationsControllers);
app.use('/Faker', FakerControllers);

socketEvents(io);

http.listen(port, function(){
  console.log('listening on *:' + port);
});

