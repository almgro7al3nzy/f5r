const express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  bodyParser = require('body-parser'),
  io = require('socket.io').listen(server),
  port = process.env.PORT || 5000,
  mongoose = require('mongoose');
const ExpressPeerServer = require('peer').ExpressPeerServer;
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/peerjs', peerServer);

const apiRoom = require('./api/room');
const apiUser = require('./api/user');
const apiMessage = require('./api/message');
const userRouter = require('./routes/user');

const db = require('./config/keys').mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.use(function(req, res, next) {
    res.setHeader(
      'Access-Control-Allow-Headers',
      'accept, authorization, content-type, x-requested-with'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE'
    );
    res.setHeader('Access-Control-Allow-Origin', req.header('origin'));
    next();
  });
}

app.use('/api/user', userRouter);

server.listen(port, () => console.log(`Server running on port ${port}`));

let peers = [];
let onlineUsers = [];

io.sockets.on('connection', async socket => {
  // user related
  socket.on('new user', async data => {
    try {
      await apiRoom.newUserInTheRoom(data._id);
    } catch (err) {
      await apiRoom.createRoom('main channel');
      console.log('room created');
      await apiRoom.newUserInTheRoom(data._id);
    }
    const { users } = await apiRoom.getAllUsers();
    socket.broadcast.emit('get users of the room', users);
  });

  socket.on('login', async data => {
    if (userLoggedIn(data)) {
      socket.send({ loginError: 'user already logged in' });
      return;
    }

    try {
      const { user, msg } = await apiUser.login(data);
      if (!user) return;
      onlineUsers.push({ socketId: socket.id, user });
      socket.emit('login', user);
      io.sockets.emit('get online users', onlineUsers);
      const { users } = await apiRoom.getAllUsers();
      socket.emit('get users of the room', users);

      const { messages: allMessages } = await apiRoom.getAllMessages();

      io.sockets.emit('get all messages', allMessages);
      console.log('online users', onlineUsers.length);

      const peerUsers = getPeerUsers();
      socket.emit('get all peers users', peerUsers);
    } catch (err) {
      socket.emit('error', { msg: 'user not found' });
      console.log('error with login:', err);
    }
  });

  // message related
  socket.on('new message', async data => {
    const { newMessage, error } = await apiMessage.newMessage(data);
    if (error) {
      throw new Error(error);
    }
    const user = await apiUser.getUserById(newMessage.user);
    const message = {
      _id: newMessage._id,
      user: user,
      body: newMessage.body,
      date: newMessage.date
    };
    io.sockets.emit('new message', message);
    await apiRoom.newMessage(newMessage._id);
  });

  socket.on('typing', data => {
    io.sockets.emit('typing', data);
  });

  socket.on('stop typing', data => {
    io.sockets.emit('stop typing', data);
  });

  // peer related
  socket.on('add new peer', peerId => {
    const exists = peers.map(peer => peer.peerId === peerId).includes(true);
    if (!exists) {
      peers.push({ socketId: socket.id, peerId });
    }
    console.log(`number of users in voice chaht: ${peers.length}`);
    socket.broadcast.emit('get other peer id', peerId);

    const peersUsers = getPeerUsers();

    io.sockets.emit('get all peers users', peersUsers);
  });

  socket.on('get all peers user', () => {
    const peersUsers = getPeerUsers();
    io.sockets.emit('get all peers users', peersUsers);
  });

  socket.on('disconnect peer', data => {
    const index = findPeerIndex(data);
    removePeerByIndex(index);
    const peersUsers = getPeerUsers();
    console.log('peer disconnected, peer length:', peersUsers.length);
    io.sockets.emit('get all peers users', peersUsers);
    socket.broadcast.emit('disconnect peer', data);
  });

  socket.on('disconnect', () => {
    const peerIndex = findPeerIndexBySocketId(socket.id);
    const onlineUsersIndex = findUserIndex(socket.id);

    let disconnectedUser = onlineUsers[onlineUsersIndex];
    if (disconnectedUser) {
      removeUserByIndex(onlineUsersIndex);
      socket.broadcast.emit('get online users', onlineUsers);
    }
    removePeerByIndex(peerIndex);

    const peerUsers = getPeerUsers();
    socket.broadcast.emit('get all peers users', peerUsers);
    console.log(
      `user disconnected, number of users: ${onlineUsers.length}, peers: ${
        peers.length
      }`
    );
  });
});

const getPeerUsers = () => {
  const peerUsers = [];
  for (const peer of peers) {
    for (const usr of onlineUsers) {
      if (peer.socketId === usr.socketId) {
        peerUsers.push(usr);
      }
    }
  }
  return findDupPeerUserAndRemove(peerUsers);
};

const findDupPeerUserAndRemove = peerUsers => {
  const newPeerUsers = [];
  const socketIds = Array.from(new Set(peerUsers.map(usr => usr.socketId)));
  for (const id of socketIds) {
    const user = peerUsers.find(value => value.socketId === id);
    if (user) {
      newPeerUsers.push(user);
    }
  }
  return newPeerUsers;
};

const userLoggedIn = user =>
  onlineUsers.map(usr => user.username === usr.user.username).includes(true);

const removeUserByIndex = onlineUsersIndex =>
  onlineUsers.splice(onlineUsersIndex, 1);
const removePeerByIndex = peerIndex => peers.splice(peerIndex, 1);

const findPeerIndexBySocketId = socketId => {
  let peerIndex = null;
  peers.filter((peer, index) => {
    if (peer.socketId === socketId) {
      peerIndex = index;
      return true;
    }
    return false;
  });

  return peerIndex;
};

const findPeerIndex = peerId => {
  let peerIndex = null;
  peers.filter((peer, index) => {
    if (peer.peerId === peerId) {
      peerIndex = index;
      return true;
    }
    return false;
  });

  return peerIndex;
};

const findUserIndex = id => {
  let onlineUsersIndex = null;
  onlineUsers.filter((user, index) => {
    if (user.socketId === id) {
      onlineUsersIndex = index;
      return true;
    }
    return false;
  });

  return onlineUsersIndex;
};
