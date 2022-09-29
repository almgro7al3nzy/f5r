const express = require('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const general = io.of("/general");
const football = io.of("/football");
const basketball = io.of("/basketball");
const abbas = io.of("/abbas");
var people = {};


app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

var generalTotalUser = 0;
var footballTotalUser = 0;
var basketballTotalUser = 0;
let numUsers = 0;


general.on('connection', function (socket) {

    username = socket.handshake.query['nickname'];
    people[socket.id] = username;

    socket.on('join', function(msg){
        footballTotalUser = generalTotalUser + 1;
        console.log(username + ": has joined to general channel");
        console.log("channel user count:" + generalTotalUser);
        socket.broadcast.emit('join', {username: username, count: generalTotalUser});
        socket.emit('activeUser', {count: generalTotalUser});
    });

    socket.on('disconnect', function(msg){
        generalTotalUser = generalTotalUser - 1;
        console.log( people[socket.id] + ": has left to general channel");
        console.log("channel user count:" + generalTotalUser);
        socket.broadcast.emit('left', {username:  people[socket.id], count: generalTotalUser});
    });

    socket.on('new_message', function(msg){
        console.log(msg.username + " has send message: " + msg.message);
        socket.broadcast.emit('new_message', {username: msg.username, message: msg.message});
    });
});

football.on('connection', function (socket) {

    username = socket.handshake.query['username'];
    people[socket.id] = username;

    socket.on('join', function(msg){
        footballTotalUser = footballTotalUser + 1;
        console.log(username + ": has joined to general channel");
        console.log("channel user count:" + footballTotalUser);
        socket.broadcast.emit('join', {username: username, count: footballTotalUser});
        socket.emit('activeUser', {count: footballTotalUser});
    });

    socket.on('disconnect', function(msg){
        footballTotalUser = footballTotalUser - 1;
        console.log( people[socket.id] + ": has left to general channel");
        console.log("channel user count:" + footballTotalUser);
        socket.broadcast.emit('left', {username:  people[socket.id], count: footballTotalUser});
    });

    socket.on('new_message', function(msg){
        console.log(msg.username + " has send message: " + msg.message);
        socket.broadcast.emit('new_message', {username: msg.username, message: msg.message});
    });
});

basketball.on('connection', function (socket) {

    username = socket.handshake.query['username'];
    people[socket.id] = username;

    socket.on('join', function(msg){
        basketballTotalUser = basketballTotalUser + 1;
        console.log(username + ": has joined to general channel");
        console.log("channel user count:" + basketballTotalUser);
        socket.broadcast.emit('join', {username: username, count: basketballTotalUser});
        socket.emit('activeUser', {count: basketballTotalUser});
    });

    socket.on('disconnect', function(msg){
        basketballTotalUser = basketballTotalUser - 1;
        console.log( people[socket.id] + ": has left to general channel");
        console.log("channel user count:" + basketballTotalUser);
        socket.broadcast.emit('left', {username:  people[socket.id], count: basketballTotalUser});
    });

    socket.on('new_message', function(msg){
        console.log(msg.username + " has send message: " + msg.message);
        socket.broadcast.emit('new_message', {username: msg.username, message: msg.message});
    });
});

io.on('connection', (socket) => {
    let addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', (data) => {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
          username: socket.username,
          message: data
        });
    });
    //console.log(socket.id, "a user connected to server!");

    // when the client emits 'add user', this listens and executes
    socket.on('add user', (username) => {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
          numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
          username: socket.username,
          numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
      socket.on('typing', () => {
        socket.broadcast.emit('typing', {
          username: socket.username
        });
      });

      // when the client emits 'stop typing', we broadcast it to others
      socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', {
          username: socket.username
        });
      });

    socket.on('disconnect', function () {
        if (addedUser){
            --numUsers;

            // صدى عالميًا أن هذا العميل قد غادر
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});

server.listen(app.get('port'), function(){
    console.log("Server is now running...");
    console.log("Port is on", app.get('port'))
});