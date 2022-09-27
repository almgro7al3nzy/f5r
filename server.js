const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const socketIO = require('socket.io');
const $ = require("jquery");

const gameSessions = new Map();
const PLAYERS_REQUIRED = 2;
const ROOM_NUMBER_UP_LIMIT = 999999;
const ROOM_NUMBER_DOWN_LIMIT = 100000;

const app = express();
const port = normalizePort(process.env.PORT || '80');
app.set('port', port);

const server = http.createServer(app);
const io = socketIO(server);
server.listen(port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
    res.render('/public/index');
});

module.exports = server;

// Bind listeners
io.sockets.on('connection', function (socket) {

    //Handle incoming request from desktop
    socket.on('display_connection', function (data) {
        assignGameRoomOnConnection(socket);
    });

    //Handle incoming request from mobile device
    socket.on('controller_connection', function (data) {
        addPlayerToRoom(socket, data.roomNumber, data.playerName);
    });

    //Player makes smf
    socket.on('player_state_changed', function (data) {
        if (!gameSessions.has(data.roomNumber) || gameSessions.get(data.roomNumber).players[socket.id].playerNumber !== data.playerNumber) {
            kickClient(socket);
            return false;
        }

        // Emit player-update to viewer
        io.to(gameSessions.get(data.roomNumber).displaySocket).emit('player_state_changed', data);
    });

    //Players want to start
    socket.on('game_start', function (data) {
        gameSessions.get(data.roomNumber).active = true;

        io.to(gameSessions.get(data.roomNumber).displaySocket).emit('game_start', gameSessions.get(data.roomNumber).players);
        // Emit game-start to all joined players
        socket.broadcast.to('room-' + data.roomNumber).emit('game_start');
    });

    socket.on('game_over', function (data) {
        // Emit game-start to all joined players
        socket.broadcast.to('room-' + data.roomNumber).emit('game_over');
    });

    socket.on('disconnect', function (reason) {
        // if viewer disconnects, delete game and emit game-invalid
        let isViewer = false;
        for (let key of gameSessions.keys()) {
            if (gameSessions.get(key).displaySocket === socket.id) {
                isViewer = true;
                socket.broadcast.to('room-' + key).emit('room_destroyed');
                gameSessions.delete(key);
                return;
            }
        }

        if (!isViewer) {
            //var gameRoom = false;
            gameSessions.forEach(function(value, key) {
                for (let player in value.players) {
                    if (player === socket.id) {
                        if (gameSessions.get(key).active === true) {
                            socket.broadcast.to('room-' + key).emit('room_destroyed');
                            gameSessions.delete(key);
                        } else {
                            delete gameSessions.get(key).players[player];
                            roomFilled(key);
                        }
                        return;
                    }
                }
            });
        }
    });
});

function assignGameRoomOnConnection(socket) {
    let successGen = false;
    let roomNumber;
    while (!successGen) {
        roomNumber = (Math.floor(Math.random() * ROOM_NUMBER_UP_LIMIT) + ROOM_NUMBER_DOWN_LIMIT).toString();
        if (!gameSessions.has(roomNumber)){
            successGen = true;
        }
    }

    gameSessions.set(roomNumber, {
        displaySocket: socket.id,
        players: {},
        active: false,
        players_id: 0
    });

    // Add viewer to gameRoom
    socket.join('room-' + roomNumber);

    socket.emit('room_assigned', {
        roomNumber
    });
}

function addPlayerToRoom(socket, roomNumber, playerName) {
    if (!gameSessions.has(roomNumber) || Object.keys(gameSessions.get(roomNumber).players).length >= PLAYERS_REQUIRED) {
        kickClient(socket);
        return;
    }

    // Add player to gameRoom
    socket.join('room-' + roomNumber);

    const playerNumber = gameSessions.get(roomNumber).players_id;
    gameSessions.get(roomNumber).players_id++;

    const room = gameSessions.get(roomNumber);
    room.players[socket.id] = {
        playerName,
        playerNumber
    };
    gameSessions.set(roomNumber, room);

    socket.emit('joined_room', {
        playerNumber
    });

    roomFilled(roomNumber)
}

function roomFilled(roomNumber) {
    if (Object.keys(gameSessions.get(roomNumber).players).length === PLAYERS_REQUIRED){
        io.to(gameSessions.get(roomNumber).displaySocket).emit('players_ready');
    } else {
        io.to(gameSessions.get(roomNumber).displaySocket).emit('players_not_ready');
    }
}

function log(logline) {
    console.log('[' + new Date().toUTCString() + '] ' + logline);
}

function kickClient(socket) {
    io.to(socket.id).emit('connection_error');
    socket.disconnect();
}

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
