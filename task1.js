const MIN_VALUE = 1;
const MAX_VALUE = 100;
const INITIAL_LIVES = 3;

let lives = INITIAL_LIVES;
let score = 0;
let bestStreak = 0;
let currentNumber = getRandomNumber();
let nextNumber = getRandomNumber();

const currentNumEl = document.getElementById('current-number');
const livesEl = document.getElementById('lives');
const scoreEl = document.getElementById('score');
const bestStreakEl = document.getElementById('best-streak');
const messageEl = document.getElementById('message');
const higherBtn = document.getElementById('higher-btn');
const lowerBtn = document.getElementById('lower-btn');
const restartBtn = document.getElementById('restart-btn');

function getRandomNumber() {
  return Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE;
}

function updateUI() {
  currentNumEl.textContent = currentNumber;
  livesEl.textContent = lives;
  scoreEl.textContent = score;
  bestStreakEl.textContent = bestStreak;
}

function makeGuess(userChoice) {
  if (lives <= 0) return;

  let isCorrect = false;
  if (userChoice === 'higher' && nextNumber >= currentNumber) {
    isCorrect = true;
  } else if (userChoice === 'lower' && nextNumber <= currentNumber) {
    isCorrect = true;
  }

  if (isCorrect) {
    score++;
    if (score > bestStreak) {
      bestStreak = score;
    }
    messageEl.textContent = `Correct! Last number was: ${nextNumber}.`;
    messageEl.style.color = '#16a34a';
  } else {
    lives--;
    score = 0;
    messageEl.textContent = `Wrong! The number was: ${nextNumber}. You lost a life.`;
    messageEl.style.color = '#dc2626';
  }

  currentNumber = nextNumber;
  nextNumber = getRandomNumber();
  updateUI();

  if (lives === 0) {
    messageEl.textContent = `Game over! Best record: ${bestStreak}`;
    messageEl.style.color = '#dc2626';
    higherBtn.disabled = true;
    lowerBtn.disabled = true;
    restartBtn.textContent = 'Play Again';
  }
}

function restartGame() {
  lives = INITIAL_LIVES;
  score = 0;
  currentNumber = getRandomNumber();
  nextNumber = getRandomNumber();
  messageEl.textContent = 'New game started. Make your guess!';
  messageEl.style.color = '#475569';
  higherBtn.disabled = false;
  lowerBtn.disabled = false;
  restartBtn.textContent = 'Restart Game';
  updateUI();
}

higherBtn.addEventListener('click', () => makeGuess('higher'));
lowerBtn.addEventListener('click', () => makeGuess('lower'));
restartBtn.addEventListener('click', restartGame);

updateUI();
