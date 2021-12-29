const canvas = document.getElementById("pong");
const newGame = document.getElementById("newGame");
const pause = document.getElementById("pause");

const ctx = canvas.getContext('2d');
const context = newGame.getContext('2d');
const contextPause = pause.getContext('2d');

canvas.style.display = 'none';
newGame.style.display = 'unset';
pause.style.display = 'none';

context.fillStyle = 'black';
context.fillRect(0, 0, 600, 400);
context.fillStyle = "#FFF";
context.font = "45px fantasy";
context.fillText("New game", 210, 200);
contextPause.fillStyle = 'black';
contextPause.fillRect(0, 0, 600, 400);
contextPause.fillStyle = "#FFF";
contextPause.font = "45px fantasy";
contextPause.fillText("Pause", 245, 200);

let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();
let winScore = 5;

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

function keydownHandler(evt) {
    if (evt.keyCode == '32' && canvas.style.display == 'unset') {
        pause.style.display = 'unset';
        canvas.style.display = 'none';
        newGame.style.display = 'none';
    }
    else if (evt.keyCode == '32' && pause.style.display == 'unset') {
        pause.style.display = 'none';
        canvas.style.display = 'unset';
        newGame.style.display = 'none';
    }
}

$('#newGame').click(function (e) {
    preX = e.pageX - this.offsetLeft;
    preY = e.pageY - this.offsetTop;
    if (preX >= 210 && preX <= 390 && preY >= 160 && preY <= 210) {
        canvas.style.display = 'unset';
        pause.style.display = 'none';
        newGame.style.display = 'none';
        user.score = 0;
        com.score = 0;
    }
});

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "WHITE"
}

const user = {
    x: 0,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "WHITE"
}

const com = {
    x: canvas.width - 10,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "WHITE"
}

const net = {
    x: (canvas.width - 2) / 2,
    y: 0,
    height: 10,
    width: 2,
    color: "WHITE"
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}

// when COM or USER scores, we reset the ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// draw the net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw text
function drawText(text, x, y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// update function, the function that does all calculations
function update() {
    if (ball.x - ball.radius < 0) {
        com.score++;
        comScore.play();
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        userScore.play();
        resetBall();
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    com.y += ((ball.y - (com.y + com.height / 2))) * 0.1;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
        wall.play();
    }

    let player = (ball.x + ball.radius < canvas.width / 2) ? user : com;

    if (collision(ball, player)) {
        hit.play();
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);

        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI / 4) * collidePoint;

        // change the X and Y velocity direction
        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.1;
    }
}

// render function, the function that does al the drawing
function render() {
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    drawText(user.score, canvas.width / 4, canvas.height / 5);
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5);
    drawNet();
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function homeCom() {
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    drawText(user.score, canvas.width / 4, canvas.height / 5);
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5);
    drawText("Com Win", 1.17 * canvas.width / 4, 3 * canvas.height / 5);
}

function homeUser() {
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    drawText(user.score, canvas.width / 4, canvas.height / 5);
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5);
    drawText("You Win", 1.13 * canvas.width / 4, 3 * canvas.height / 5);
}

function stop(loop) {
    clearInterval(loop);
}

function game() {
    if (com.score >= winScore) {
        //homeCom();
        canvas.style.display = 'none';
        pause.style.display = 'none';
        newGame.style.display = 'unset';
    }
    else if (user.score >= winScore) {
        //homeUser();
        canvas.style.display = 'none';
        pause.style.display = 'none';
        newGame.style.display = 'unset';
    }
    else if (canvas.style.display != 'none'){
        render();
        update();
    }
}
let framePerSecond = 50;

let loop = setInterval(game, 1000 / framePerSecond);