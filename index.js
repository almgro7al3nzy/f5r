const express = require('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', (req, res) => {

res.send('Chat Server is running on port 3000')
});
io.on('connection', (socket) => {
app.use(express.static(__dirname + '/public'));

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
http.listen(3000, function () {
    console.log('listening on *:3000');
});