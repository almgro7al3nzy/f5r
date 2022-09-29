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

io.on('connection', (socket) => {

console.log('user connected')

socket.on('join', function(userNickname) {

        console.log(userNickname +" : has joined the chat "  );

        socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat ");
    });


socket.on('messagedetection', (senderNickname,messageContent) => {
       
       //log the message in console 

       console.log(senderNickname+" :" +messageContent)
        //create a message object 
       let  message = {"message":messageContent, "senderNickname":senderNickname}
          // send the message to the client side  
       io.emit('message', message );
     
      });
      
  
 socket.on('disconnect', function() {
    console.log( ' user has left ')
    socket.broadcast.emit("userdisconnect"," user has left ") 

});



});





server.listen(3000,()=>{

console.log('Node app is running on port 3000');

});
