const express = require('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

let numUsers = 0;

);






server.listen(app.get('port'), function(){
    console.log("Server is now running...");
    console.log("Port is on", app.get('port'))
});