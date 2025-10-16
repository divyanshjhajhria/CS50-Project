const bird = document.getElementById('bird');
const pipeTop = document.getElementById('pipe-top');
const pipeBottom = document.getElementById('pipe-bottom');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const startButton = document.getElementById('startButton');

let birdY = 300;
let pipeX = 400;
let score = 0;
let highScore = 0;
let gameState = 'start';
const birdSpeed = 50;
const pipeSpeed = 2;
let gameInterval;
let pipeGap = 200;
let pipeHeight = 0;

function moveBird(direction) {
    if (gameState !== 'play') return;
    if (direction === 'up' && birdY > 0) {
        birdY -= birdSpeed;
    } else if (direction === 'down' && birdY < 570) {
        birdY += birdSpeed;
    }
    bird.style.top = birdY + 'px';
}

function randomPipeHeight() {
    return Math.floor(Math.random() * (400 - pipeGap)) + 50;
}

function movePipes() {
    if (gameState !== 'play') return;
    pipeX -= pipeSpeed;
    if (pipeX < -50) {
        pipeX = 400;
        pipeHeight = randomPipeHeight();
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = `High Score: ${highScore}`;
            updateHighScore(highScore);
        }
    }

    pipeTop.style.height = pipeHeight + 'px';
    pipeBottom.style.height = (700 - pipeHeight - pipeGap) + 'px';

    pipeTop.style.right = (400 - pipeX) + 'px';
    pipeBottom.style.right = (400 - pipeX) + 'px';

    if (
        100 + 30 > pipeX && 100 < pipeX + 50 &&
        (birdY < pipeHeight || birdY + 30 > pipeHeight + pipeGap)
    ) {
        gameState = 'over';
        clearInterval(gameInterval);
        startButton.style.display = 'block';
    }
}

function updateHighScore(score) {
    document.getElementById('score-input').value = score;
    document.getElementById('score-form').submit();
}

function getHighScore() {
    fetch('/get_score')
        .then(response => response.json())
        .then(data => {
            highScore = data.high_score;
            highScoreDisplay.textContent = `High Score: ${highScore}`;
        });
}

function startGame() {
    if (gameState === 'start' || gameState === 'over') {
        birdY = 300;
        pipeX = 400;
        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        bird.style.top = birdY + 'px';
        pipeTop.style.right = '0px';
        pipeBottom.style.right = '0px';
        pipeHeight = randomPipeHeight();
        gameState = 'play';
        startButton.style.display = 'none';
        gameInterval = setInterval(movePipes, 20);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp') {
        moveBird('up');
    } else if (e.code === 'ArrowDown') {
        moveBird('down');
    }
});

startButton.addEventListener('click', startGame);

getHighScore();