const socket = io();

socket.emit('display_connection');

let roomNumber;
socket.on('room_assigned', function (data) {
    roomNumber = data.roomNumber;
    $(document).ready(function() {
        $('#roomNumber').text(roomNumber);
    });

    $('#roomNumberInGame').text(roomNumber);
});

socket.on('players_ready', function (data) {
    $(document).ready(function() {
        $('#gameStart').removeAttr("disabled");
    });
});

socket.on('players_not_ready', function (data) {
    $(document).ready(function() {
        $('#gameStart').attr("disabled", true);
    });
});

socket.on('room_destroyed', function (data) {
    $(document).ready(function() {
        stopGame();
        $('#main-container').hide();
        $('#end-container').hide();
        $('#game-container').hide();
        $('#wait-for-player-container').hide();

        $('#room-delete-container').show();
    });
});

socket.on('player_state_changed', function (data) {
    let player = players[0].playerNumber === data.playerNumber ? players[0] : players[1];

    if (data.start) {
        if (data.direction === 'up') {
            player.speed -= PLAYER_SPEED_CHANGE;
        } else if (data.direction === 'down'){
            player.speed += PLAYER_SPEED_CHANGE;
        } else {
            player.speed = 0
        }
    } else {
        player.speed = 0
    }

    player.paddle.setVelocityY(player.speed);
});

socket.on('game_start', function (data) {
    console.log("data for game start");
    console.log(data);

    let i_player = 0;
    for (var i_data in data) {
        if (!players[i_player]) {
            players[i_player] = {};
        }

        players[i_player].playerNumber = data[i_data].playerNumber;
        players[i_player].playerName = data[i_data].playerName;
        i_player += 1;
    }
});

$(document).ready(function() {
    $('#gameStart').off('click').on('click', function (event) {
        event.preventDefault();
        socket.emit('game_start', {
            roomNumber
        });
        $('#main-container').hide();
        $('#game-container').show();
        startGame();
    });
    $('#gameRestart').off('click').on('click', function (event) {
        event.preventDefault();
        socket.emit('game_start', {
            roomNumber
        });
        $('#end-container').hide();
        $('#game-container').show();
        startGame();
    });
});

function gameOver() {
    setLeaderboard(getLeaderboard(players));

    $(document).ready(function() {
        $('#game-container').hide();
        $('#end-container').show();
    });
    socket.emit('game_over', {
        roomNumber
    });
}

function updatePlayersLife() {
    $('#lifePlayerLeft').text(players[PLAYER_LEFT].life);
    $('#lifePlayerRight').text(players[PLAYER_RIGHT].life);
}

function updatePlayersScore() {
    $('#scorePlayerLeft').text(players[PLAYER_LEFT].score);
    $('#scorePlayerRight').text(players[PLAYER_RIGHT].score);
}

function setLeaderboard(leaderboard) {
    $('#leaderboard').text("");
    //console.log(leaderboard);

    let tableHTML =
        '<tr style="margin: auto; text-allign: center">' +
        '<td style="padding-bottom: 20px;">position</td>' +
        '<td style="padding-bottom: 20px;">player</td>' +
        '<td style="padding-bottom: 20px;">score</td>' +
        '</tr>';

    for (player of leaderboard){
        console.log(player);
        tableHTML +=
            '<tr>' +
            '<td>' + player.leaderboardPosition + '</td>' +
            '<td>' + player.playerName + '</td>' +
            '<td>' + player.score + '</td>' +
            '</tr>';
    }

    $('#leaderboard').append(tableHTML);
}
