// Get references to necessary elements
const gameBoard = document.getElementById("game-board");
const timerElement = document.getElementById("timer");
const flipCountElement = document.getElementById("flip-count");
const flipMatchCountElement = document.getElementById("flip-match-count");
const refreshButton = document.getElementById("refresh-game");
const winMessage = document.querySelector(".win-message");

// Load sound effects
const backroundSound = new Audio("./flip.mp3"); // Sound for backround
const flipSound = new Audio("./multi-pop-1-188165.mp3"); // Sound for flipping cards
const matchSound = new Audio("./SCNB3LA-winning.mp3"); // Sound for card matches
const mismatchSound = new Audio("./beep-03.wav"); // Sound for card mismatches
const stopSound = new Audio("./end.mp3"); // Sound when the game stops

backroundSound.play(); // Play
backroundSound.autoplay = true;
backroundSound.loop = true;
backroundSound.volume = 0.5;

const cardImages = [
  "./plaApple.jpeg",
  "./plaBlueberry.jpeg",
  "./pladryfruits.jpg",
  "./plaKiwi Fruit.jpeg",
  "./plaMango.jpeg",
  "./plaOrange.jpeg",
  "./plaGuava.jpeg",
  "./plaWatermelon.jpeg",
];

// Generate the image array with each image appearing twice
const allImages = [];
cardImages.forEach((image) => {
  allImages.push(image, image); // Each image appears twice
});

// Shuffle the images array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

shuffleArray(allImages);

let flippedCards = [];
let flipCount = 0;
let flipMatchCount = 0;
let timer = 30;
let timerInterval;

// Set the initial state of the game
function initGame() {

    backroundSound.play(); // Play
    backroundSound.autoplay = true;
    backroundSound.loop = true;
    backroundSound.volume = 0.5;

  // Clear the board and reset variables
  const cards = gameBoard.getElementsByClassName("card");
  Array.from(cards).forEach((card, index) => {
    card.classList.remove("flipped");
    card.style.backgroundImage = "url('./image.png')"; // Reset to blank image
    card.setAttribute("data-image", allImages[index]); // Assign the image
  });

  flipCount = 0;
  flipMatchCount = 0;
  timer = 30;

  flipCountElement.textContent = flipCount;
  flipMatchCountElement.textContent = flipMatchCount;
  timerElement.textContent = timer;

  //   winMessage.classList.add("hidden");

  // Reset the timer interval
  clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

  gameBoard.addEventListener("click", handleCardClick);
}

// Function to update the timer
function updateTimer() {
  if (timer > 0) {
    timer = timer - 1;
    timerElement.textContent = timer;
  } else {
    stopGame(); // If timer reaches zero, stop the game
  }
}

// Function to stop the game
function stopGame() {

  clearInterval(timerInterval);
  gameBoard.removeEventListener("click", handleCardClick);
  stopSound.play(); // Play the stopping sound

  // Make sure all sounds are stopped
  flipSound.pause();
  flipSound.currentTime = 0;
  matchSound.pause();
  matchSound.currentTime = 0;
  mismatchSound.pause();
  mismatchSound.currentTime = 0;

  // Prevent card clicking
  const cards = gameBoard.getElementsByClassName("card");
  Array.from(cards).forEach((card) => {
    card.style.cursor = "default";
  });
}

// Card click handler
function handleCardClick(event) {
  const target = event.target;
  if (
    target.classList.contains("card") &&
    !target.classList.contains("flipped")
  ) {
    // Flip the card and add to flippedCards array
    target.classList.add("flipped");
    target.style.backgroundImage = `url('${target.getAttribute(
      "data-image"
    )}')`;

    // Play flip sound
    flipSound.play();

    flippedCards.push(target);

    if (flippedCards.length === 2) {
      flipCount++;
      flipCountElement.textContent = flipCount;

      // Check if the two cards have the same image
      const isMatch = flippedCards.every(
        (card) =>
          card.getAttribute("data-image") ===
          flippedCards[0].getAttribute("data-image")
      );

      if (isMatch) {
        flipMatchCount++;
        flipMatchCountElement.textContent = flipMatchCount;

        // Play match sound and animation
        matchSound.play();

        if (flipMatchCount === cardImages.length) {
          // All matches are found
          stopGame(); // Game is won, stop the game
        }

        flippedCards = [];
      } else {
        // Hide cards if they don't match
        setTimeout(() => {
          flippedCards.forEach((card) => {
            card.classList.remove("flipped");
            card.style.backgroundImage = "url('./image.png')";
          });
          mismatchSound.play();
          flippedCards = [];
        }, 1000); // Hide cards after 1 second if they don't match
      }
    }
  }
}

// Refresh game button click handler
refreshButton.addEventListener("click", initGame);

// Initialize the game on load
initGame();
