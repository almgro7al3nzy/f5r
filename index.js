const express = require('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

let numUsers = 0;


const Rooms = io.of("/1");
const Rooms = io.of("/2");
const Rooms = io.of("/3");
const Rooms = io.of("/4");
const Rooms = io.of("/5");
const Rooms = io.of("/6");
const Rooms = io.of("/7");
const Rooms = io.of("/8");
const Rooms = io.of("/9");

const Rooms = io.of("/10");
const Rooms = io.of("/11");
const Rooms = io.of("/12");
const Rooms = io.of("/13");
const Rooms = io.of("/14");
const Rooms = io.of("/15")
const Rooms = io.of("/16");
const Rooms = io.of("/17");
const 18 = io.of("/18");
var people = {};

let generalTotalUser = 0;
let footballTotalUser = 0;
let basketballTotalUser = 0;

general.on('connection', function (socket) {

    nickname = socket.handshake.query['nickname'];
    people[socket.id] = nickname;

    socket.on('join', function(msg){
        footballTotalUser = generalTotalUser + 1;
        console.log(nickname + ": has joined to general channel");
        console.log("channel user count:" + generalTotalUser);
        socket.broadcast.emit('join', {nickname: nickname, count: generalTotalUser});
        socket.emit('activeUser', {count: generalTotalUser});
    });

    socket.on('disconnect', function(msg){
        generalTotalUser = generalTotalUser - 1;
        console.log( people[socket.id] + ": has left to general channel");
        console.log("channel user count:" + generalTotalUser);
        socket.broadcast.emit('left', {nickname:  people[socket.id], count: generalTotalUser});
    });

    socket.on('new_message', function(msg){
        console.log(msg.nickname + " has send message: " + msg.message);
        socket.broadcast.emit('new_message', {nickname: msg.nickname, message: msg.message});
    });
});

football.on('connection', function (socket) {

    nickname = socket.handshake.query['nickname'];
    people[socket.id] = nickname;

    socket.on('join', function(msg){
        footballTotalUser = footballTotalUser + 1;
        console.log(nickname + ": has joined to general channel");
        console.log("channel user count:" + footballTotalUser);
        socket.broadcast.emit('join', {nickname: nickname, count: footballTotalUser});
        socket.emit('activeUser', {count: footballTotalUser});
    });

    socket.on('disconnect', function(msg){
        footballTotalUser = footballTotalUser - 1;
        console.log( people[socket.id] + ": has left to general channel");
        console.log("channel user count:" + footballTotalUser);
        socket.broadcast.emit('left', {nickname:  people[socket.id], count: footballTotalUser});
    });

    socket.on('new_message', function(msg){
        console.log(msg.nickname + " has send message: " + msg.message);
        socket.broadcast.emit('new_message', {nickname: msg.nickname, message: msg.message});
    });
});

basketball.on('connection', function (socket) {

    nickname = socket.handshake.query['nickname'];
    people[socket.id] = nickname;

    socket.on('join', function(msg){
        basketballTotalUser = basketballTotalUser + 1;
        console.log(nickname + ": has joined to general channel");
        console.log("channel user count:" + basketballTotalUser);
        socket.broadcast.emit('join', {nickname: nickname, count: basketballTotalUser});
        socket.emit('activeUser', {count: basketballTotalUser});
    });

    socket.on('disconnect', function(msg){
        basketballTotalUser = basketballTotalUser - 1;
        console.log( people[socket.id] + ": has left to general channel");
        console.log("channel user count:" + basketballTotalUser);
        socket.broadcast.emit('left', {nickname:  people[socket.id], count: basketballTotalUser});
    });

    socket.on('new_message', function(msg){
        console.log(msg.nickname + " has send message: " + msg.message);
        socket.broadcast.emit('new_message', {nickname: msg.nickname, message: msg.message});
    });
});


server.listen(app.get('port'), function(){
    console.log("Server is now running...");
    console.log("Port is on", app.get('port'))
});