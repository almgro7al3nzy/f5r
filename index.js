require('dotenv').config()

const express = require("express");   
const socketio = require("socket.io"); 
const http = require("http");
const { ExpressPeerServer } = require('peer');
const schedule = require('node-schedule');
const controlRooms = require("./controllers/controlRooms"); 

const twilioObj = {
    username : null,
    cred : null 
}

// Voice chat uses turn server, not required locally 
if(process.env.USE_TWILIO==="yes") { 
    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    client.tokens.create().then(token => {
        twilioObj.username = token.username;
        twilioObj.cred = token.password; 
    });

    //every 12 hours 
    schedule.scheduleJob("*/12 * * *",()=>{
        console.log("CRON running"); 
        const client = require('twilio')(process.env.accountSid, process.env.authToken);
        client.tokens.create().then(token => {
            twilioObj.username = token.username;
            twilioObj.cred = token.password; 
        });
        controlRooms.deQRoom();
    })
}

const cors = require('cors');
const app = express(); 

const router = require("./controllers/chatController");
const server = http.createServer(app);
const io = socketio(server); 

const general = io.of("/general");
const football = io.of("/football");
const basketball = io.of("/basketball");
var people = {};

var generalTotalUser = 0;
var footballTotalUser = 0;
var basketballTotalUser = 0;

general.on('connection', function (socket) {

    nickname = socket.handshake.query['nickname'];
    people[socket.id] = nickname;

    socket.on('join', function(msg){
        footballTotalUser =  1;
        console.log(nickname);
        console.log("channel user count:");
        socket.broadcast.emit('join');
        socket.emit('activeUser');
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



const PORT = process.env.PORT || 5000; 
server.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`); 
});
