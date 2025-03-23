const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartButton = document.getElementById('restartButton');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 1;
let dy = 0;
let score = 0;

let gameLoopInterval; // Store the game loop interval
let gameOver = false; // Add a game over flag

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'green';
    ctx.fillRect(snakePart.x * gridSize, snakePart.y * gridSize, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // **CRITICAL CHANGE: Check for solid border collision *before* updating snake position**
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        // Game over: Stop snake movement *immediately*
        gameOver = true; // Set the game over flag
        return; // Indicate game over
    }

    snake.unshift(head);

    const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (didEatFood) {
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
    };
    if (snake.some(part => part.x === food.x && part.y === food.y)) {
        generateFood();
    }
}

function clearCanvas() {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw solid borders
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function checkGameOver() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function gameLoop() {
    if (!gameOver) { // Only run if game is not over
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();

        if (gameOver) { // check again after moveSnake
            clearInterval(gameLoopInterval);
            gameOverScreen.style.display = 'block';
        }
    }
}


function startGame() {
    gameOver = false; // Reset game over flag
    gameLoopInterval = setInterval(gameLoop, 150); // Store the interval ID, changed to 150
}


function restartGame() {
    clearInterval(gameLoopInterval); // Clear any existing interval
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    generateFood();
    gameOverScreen.style.display = 'none'; // Hide game-over screen
    startGame(); // Start the game loop
}

generateFood();
startGame(); // Start the game.
document.addEventListener('keydown', changeDirection);
restartButton.addEventListener('click', restartGame);
