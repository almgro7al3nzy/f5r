const socket = io();

let playerNumber;
let roomNumber;

socket.on('connection_error', (data) => {
    $(document).ready(function() {
        $('#main-container').hide();
        $('#end-container').hide();
        $('#error-container').show();
    });
});

socket.on('joined_room', (data) => {
    playerNumber = data.playerNumber;
    $(document).ready(function() {
        $('#main-container').hide();
        $('#wait-for-player-container').show();
    });
});

socket.on('game_start', function (data) {
    $(document).ready(function() {
        $('#main-container').hide();
        $('#end-container').hide();
        $('#wait-for-player-container').hide();
        $('#buttons-container').show();
    });
});

socket.on('game_over', function (data) {
    $(document).ready(function() {
        $('#buttons-container').hide();
        $('#end-container').show();
    });
});

socket.on('room_destroyed', function (data) {
    $(document).ready(function() {
        $('#buttons-container').hide();
        $('#main-container').hide();
        $('#end-container').hide();
        $('#room-delete-container').show();
    });
});

$(document).ready(function() {
    $('#up').on('click touchstart', function() {
        socket.emit('player_state_changed', {
            playerNumber,
            roomNumber,
            direction: 'up',
            start: true
        });
    }).on('click touchend', function() {
        socket.emit('player_state_changed', {
            playerNumber,
            roomNumber,
            direction: 'up',
            start: false
        });
    });

    $('#down').on('click touchstart', function() {
        socket.emit('player_state_changed', {
            playerNumber,
            roomNumber,
            direction: 'down',
            start: true
        });
    }).on('click touchend', function() {
        socket.emit('player_state_changed', {
            playerNumber,
            roomNumber,
            direction: 'down',
            start: false
        });
    });

    $('#confirm').off('click').on('click', function (event) {
        event.preventDefault();
        roomNumber = $('#roomNumber').val();
        playerName = $('#playerName').val();
        socket.emit('controller_connection', {
            roomNumber: roomNumber,
            playerName: playerName
        });
    });
});



