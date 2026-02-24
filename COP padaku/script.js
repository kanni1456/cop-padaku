const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ui = document.getElementById("ui");
const startBtn = document.getElementById("startBtn");
const highScoreText = document.getElementById("highScore");

canvas.width = 400;
canvas.height = 600;

let highScore = localStorage.getItem("highScore") || 0;
highScoreText.innerText = "High Score: " + highScore;

// Load assets
const bg = new Image(); bg.src = "assets/bg.png";
const playerImg = new Image(); playerImg.src = "assets/player.png";
const pipeImg = new Image(); pipeImg.src = "assets/pipe.png";

const jumpSound = new Audio("assets/jump.mp3");
const hitSound = new Audio("assets/hit.mp3");
const scoreSound = new Audio("assets/score.mp3");

let player, pipes, frame, score, speed, gameRunning;

function resetGame() {
  player = {
    x: 80,
    y: 200,
    width: 40,
    height: 40,
    gravity: 0.6,
    lift: -10,
    velocity: 0
  };

  pipes = [];
  frame = 0;
  score = 0;
  speed = 2;
  gameRunning = true;
}

function startGame() {
  ui.style.display = "none";
  canvas.style.display = "block";
  resetGame();
  requestAnimationFrame(loop);
}

startBtn.addEventListener("click", startGame);

document.addEventListener("keydown", () => {
  if (gameRunning) {
    player.velocity = player.lift;
    jumpSound.play();
  }
});

document.addEventListener("click", () => {
  if (gameRunning) {
    player.velocity = player.lift;
    jumpSound.play();
  }
});

function loop() {
  if (!gameRunning) return;

  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Player physics
  player.velocity += player.gravity;
  player.y += player.velocity;

  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Pipe generation
  if (frame % 90 === 0) {
    let gap = 150;
    let topHeight = Math.random() * 250 + 50;

    pipes.push({
      x: canvas.width,
      top: topHeight,
      bottom: canvas.height - topHeight - gap,
      passed: false
    });
  }

  pipes.forEach((pipe) => {
    pipe.x -= speed;

    ctx.drawImage(pipeImg, pipe.x, 0, 60, pipe.top);
    ctx.drawImage(pipeImg, pipe.x, canvas.height - pipe.bottom, 60, pipe.bottom);

    // Collision
    if (
      player.x < pipe.x + 60 &&
      player.x + player.width > pipe.x &&
      (player.y < pipe.top ||
        player.y + player.height > canvas.height - pipe.bottom)
    ) {
      endGame();
    }

    // Score update
    if (!pipe.passed && pipe.x + 60 < player.x) {
      score++;
      pipe.passed = true;
      scoreSound.play();
      speed += 0.1; // Increase difficulty gradually
    }
  });

  // Ground collision
  if (player.y + player.height > canvas.height || player.y < 0) {
    endGame();
  }

  // Score display
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 20, 50);

  frame++;
  requestAnimationFrame(loop);
}

function endGame() {
  hitSound.play();
  gameRunning = false;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  canvas.style.display = "none";
  ui.style.display = "block";
  highScoreText.innerText = "High Score: " + highScore;
  startBtn.innerText = "Restart Game";
}