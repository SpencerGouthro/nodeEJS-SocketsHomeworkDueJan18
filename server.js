var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');

// your default messages and users array: this is where you'll store your messages and users
var messages = [];
var users = [];
var connections = [];

// set up to accept json as parameters
app.use(bodyParser.json());

// @NOTE: do this if you want to change the default directory for views, which is /views
app.set('views', path.join(__dirname, '/templates'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// set the static path (for css, js, etc.)
app.use('/css', express.static(path.join(__dirname, 'public/css')));

// routes via express
app.get('/', function(req, res) {
	res.render('index', { 
		name: 'Spencer',
		descOfText: 'dynamic'
	});
                          	// @TODO: add your ejs rendering code here! Remember, this has been done many times
                          	//		  before by many other people, so Google is your friend!
});


// socket.io functionality
// io.on('connection', function(socket){
//   console.log('Socket user connected!');

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    // Disconnect 
    socket.on('disconnect', function(data){
      users.splice(users.indexOf(socket.username), 1);
      updateUsernames();
      connections.splice(connections.indexOf(socket), 1);
      console.log('Disconnected: %s sockets connected', connections.length);
    });

    // Send Message
    socket.on('send message', function(data){
    	console.log(data);
      io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    // New User
    socket.on('new user', function(data, callback){
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateUsernames();
    });

    function updateUsernames(){
      io.sockets.emit('get users', users);
    }
});



  // @TODO: set up your send message, show messages and add username functions.
  //		Remember, there is a video on all of this stuff that we watched!


// });

http.listen(8080);
console.log("Listening on port 8080...");