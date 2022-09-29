const express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  p2pserver = require('socket.io-p2p-server').Server,
  port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

server.listen(port, () => console.log(`Server running on port ${port}`));

let users = [];
let connections = [];

io.use(p2pserver);

io.on('connection', socket => {
  connections.push(socket);
  console.log('Here comes a new user!');
  socket.emit('news', { hello: 'world' });

  // socket.on('talking', data => {
  //   // console.log(data);
  //   socket.broadcast.emit('talking', data);
  // });

  console.log('NUMBER OF CONNECTED PEOPLE :', connections.length);

  socket.on('start-stream', function(data) {
    console.log('Stream started');
    socket.broadcast.emit('start-stream', data);
  });

  socket.on('disconnect', socket => {
    connections.pop();
    console.log('user disconnected');
    console.log('NUMBER OF CONNECTED PEOPLE :', connections.length);
  });
});
