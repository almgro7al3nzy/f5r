const WIDTH = 1920;
const HEIGHT = 1080;

const PADDING = 20;
const SHIFT = 30;

const PLAYER_SPEED_CHANGE = 500;
const BALL_SPEED = 500;
const PLAYERS_NUMBER = 2;
const MAX_PLAYER_LIFE = 3;

const PLAYER_LEFT = 0;
const PLAYER_RIGHT = 1;
let lastBallHitBy = -1;
let restart = true;

let ball;
let bricks = [];
var players = [];

const ball_name = 'ball';
const paddle_name = 'paddle';
const brick_name = 'brick';

const config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    top: 0,
    left: 0,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    callbacks: {
        postBoot: function (game) {
            game.canvas.style.width = '90%';
            game.canvas.style.height = '90%';
        }
    },
    physics: {
        default: 'arcade'
    },
    backgroundColor: '#eee',
    parent: 'game-container'
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image(ball_name, '/images/ball.png');
    this.load.image(paddle_name, '/images/paddle.png');
    this.load.image(brick_name, '/images/brick.png');
}

let isAlive = life => life > 0;
let alivePlayersCount = players => {
    let count = 0;
    for (player of players) {
        if (isAlive(player.life)) {
            count += 1;
        }
    }
    return count;
};

let getLeaderboard = players => {
    let sorted = players.sort(function(first, second) {
        return second.score - first.score;
    });

    let position = 1;
    sorted[0].leaderboardPosition = position;
    for (var i = 1; i < PLAYERS_NUMBER; i += 1) {
        if (sorted[i].score !== sorted[i - 1].score) {
            position += 1;
        }
        sorted[i].leaderboardPosition = position;
    }

    return sorted;
};

function isGameOver() {
    if (alivePlayersCount(players) <= 1) {
        stopGame();
        gameOver();
    }
}

let getPaddlePostition = i => i % 2
        ? {
            x: PADDING,
            y: HEIGHT / 2,
            name: paddle_name
        }
        : {
            x: WIDTH - PADDING,
            y: HEIGHT / 2,
            name: paddle_name
        };

function initBricks(game) {
    bricks = [];
    const N = 10;
    const M = 10;
    for (var i = 0; i < N; i += 1) {
        for (var j = 0; j < M; j += 1) {
            let position = M * i + j;
            bricks[position] = game.physics.add.sprite(undefined, undefined, brick_name);

            let startX = ( WIDTH - bricks[position].width * N - SHIFT * (N - 1) ) / 2;
            let startY = ( HEIGHT - bricks[position].height * M - SHIFT * (M -1) ) / 2;

            bricks[position].body.immovable = true;
            bricks[position].setPosition(
                startX + i * (bricks[position].width + SHIFT),
                startY + j * (bricks[position].height + SHIFT)
            );

            game.physics.add.collider(ball, bricks[position], collisionBallBrick);
        }
    }
}

function initPlayers(game) {
    for (var i = 0; i < PLAYERS_NUMBER; i += 1) {
        let paddle = getPaddlePostition(i);

        if (!players[i]) {
            players[i] = {};
        }

        players[i].speed = 0;
        players[i].score = 0;
        players[i].life = MAX_PLAYER_LIFE;

        if (!players[i].paddle) {
            players[i].paddle = game.physics.add.sprite(paddle.x, paddle.y, paddle.name);
            players[i].paddle.body.immovable = true;
            players[i].paddle.setCollideWorldBounds(true);

            game.physics.add.collider(ball, players[i].paddle, collisionBallPlayer);
        }

        players[i].paddle.setPosition(paddle.x, paddle.y);
    }
}

function create() {
    this.scene.pause();
    // Init ball
    ball = this.physics.add.sprite(undefined, undefined, ball_name);
    ball.setBounce(1);
    ball.setCollideWorldBounds(true);
    ball.body.onWorldBounds = true;
    ball.setPosition(
        100,
        100
    );

    // Setup ball collisions with the walls
    this.physics.world.on("worldbounds", function (body, up, down, left, right) {
        if (left) {
            players[PLAYER_LEFT].life -= 1;

            // the ball goes to the opponent side
            ball.setVelocity(-BALL_SPEED, BALL_SPEED);
            ball.setPosition(WIDTH - PADDING - 25, HEIGHT / 2);
            lastBallHitBy = PLAYER_RIGHT;

            //stopGame();
            isGameOver();
        }
        if (right) {
            players[PLAYER_RIGHT].life -= 1;

            // the ball goes to the opponent side
            ball.setVelocity(BALL_SPEED, BALL_SPEED);
            ball.setPosition(PADDING + 25, HEIGHT / 2);
            lastBallHitBy = PLAYER_LEFT;

            //stopGame();
            isGameOver();
        }
    });
}

function update() {
    if (restart) {
        //reset main data in case of restart
        ball.setVelocity(BALL_SPEED, -BALL_SPEED);
        ball.setPosition(PADDING, HEIGHT / 2);

        initPlayers(this);
        initBricks(this);

        restart = false;
    }

    updatePlayersLife();
    updatePlayersScore();
}

function collisionBallPlayer(ball, playerPaddle) {
    if (playerPaddle.position === players[PLAYER_LEFT].paddle.position) {
        lastBallHitBy = PLAYER_LEFT;
    } else if (playerPaddle.position === players[PLAYER_RIGHT].paddle.position) {
        lastBallHitBy = PLAYER_RIGHT;
    }
}

function collisionBallBrick(ball, brick) {
    brick.destroy();

    if (lastBallHitBy >= 0) {
        players[lastBallHitBy].score += 1;
    }
}

function startGame() {
    restart = true;

    game.scene.resume('default');
}

function stopGame() {
    game.scene.pause('default');
}
