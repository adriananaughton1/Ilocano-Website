// ============================================================
// VOCABULARY DATA
// This is the list of words the quiz asks about.
// Each item is an object with two properties: "ilocano" and "english".
// ============================================================
const vocabulary = [
  { ilocano: "Manong", english: "Older brother" },
  { ilocano: "Manang", english: "Older sister" },
  { ilocano: "Balay", english: "House" },
  { ilocano: "Aso", english: "Dog" },
  { ilocano: "Pusa", english: "Cat" },
  { ilocano: "Danum", english: "Water" },
  { ilocano: "Ikan", english: "Fish" },
  { ilocano: "Bado", english: "Clothes" },
  { ilocano: "Aldaw", english: "Day" },
  { ilocano: "Rabii", english: "Night" }
];

// ============================================================
// QUIZ STATE
// These variables track what is currently happening in the quiz.
// They change while the quiz is running, which is why they use "let".
// ============================================================

// The words for THIS attempt at the quiz, in shuffled order
let quizQuestions = [];

// Which question we are currently on (0 = first question)
let currentQuestionIndex = 0;

// How many questions the player has answered correctly so far
let score = 0;

// ============================================================
// ELEMENT REFERENCES
// These grab the HTML elements (from index.html) that we need
// to update or read from while the quiz runs.
// ============================================================
const quizArea = document.getElementById("quiz-area");
const scoreArea = document.getElementById("score-area");
const restartButton = document.getElementById("restart-btn");

// ============================================================
// FUNCTION: shuffleArray
// Takes an array and returns a NEW array with the same items
// in random order. The original array is not changed.
// ============================================================
function shuffleArray(originalArray) {
  // .slice() with no arguments makes a full copy of the array
  let shuffled = originalArray.slice();

  // Fisher-Yates shuffle: walk backwards through the array.
  // For each position, swap it with a random earlier (or equal) position.
  for (let i = shuffled.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));

    // Swap shuffled[i] and shuffled[randomIndex] using a temporary variable
    let temp = shuffled[i];
    shuffled[i] = shuffled[randomIndex];
    shuffled[randomIndex] = temp;
  }

  return shuffled;
}

// ============================================================
// FUNCTION: buildAnswerOptions
// Given the question we're about to ask, this builds a list of
// 4 possible answers (1 correct + 3 wrong), in random order.
// ============================================================
function buildAnswerOptions(correctQuestion) {
  // Step 1: Collect every vocabulary word EXCEPT the one being asked about
  let otherWords = [];
  for (let i = 0; i < vocabulary.length; i++) {
    let word = vocabulary[i];
    if (word.ilocano !== correctQuestion.ilocano) {
      otherWords.push(word);
    }
  }

  // Step 2: Shuffle those other words so we get different wrong answers each time
  let shuffledOtherWords = shuffleArray(otherWords);

  // Step 3: Take the English translations of the first 3 as our wrong answers
  let wrongAnswers = [];
  for (let i = 0; i < 3; i++) {
    wrongAnswers.push(shuffledOtherWords[i].english);
  }

  // Step 4: Combine the correct answer with the 3 wrong answers
  let allAnswers = [];
  allAnswers.push(correctQuestion.english);
  for (let i = 0; i < wrongAnswers.length; i++) {
    allAnswers.push(wrongAnswers[i]);
  }

  // Step 5: Shuffle the combined list so the correct answer isn't always first
  return shuffleArray(allAnswers);
}

// ============================================================
// FUNCTION: startQuiz
// Resets everything and begins a new quiz from question 1.
// Runs once when the page first loads, and again every time
// the "Restart Quiz" button is clicked.
// ============================================================
function startQuiz() {
  quizQuestions = shuffleArray(vocabulary);
  currentQuestionIndex = 0;
  score = 0;
  scoreArea.textContent = "";
  showQuestion();
}

// ============================================================
// FUNCTION: showQuestion
// Displays the current question and its 4 answer buttons.
// If there are no questions left, it shows the final score instead.
// ============================================================
function showQuestion() {
  // Have we gone past the last question? If so, the quiz is over.
  if (currentQuestionIndex >= quizQuestions.length) {
    showFinalScore();
    return;
  }

  let currentQuestion = quizQuestions[currentQuestionIndex];
  let answerOptions = buildAnswerOptions(currentQuestion);

  // Show the Ilocano word, plus an empty container for the answer buttons
  quizArea.innerHTML =
    "<p>What does \"<strong>" + currentQuestion.ilocano + "</strong>\" mean?</p>" +
    "<div id=\"options\"></div>";

  let optionsContainer = document.getElementById("options");

  // Create one button for each answer option
  for (let i = 0; i < answerOptions.length; i++) {
    let optionText = answerOptions[i];

    let button = document.createElement("button");
    button.textContent = optionText;

    // When the player clicks this button, check if it's the correct answer.
    // "currentQuestion" and "optionText" are remembered from this loop
    // thanks to how "let" works inside loops (each click uses its own copy).
    button.addEventListener("click", function () {
      checkAnswer(optionText, currentQuestion.english);
    });

    optionsContainer.appendChild(button);
  }
}

// ============================================================
// FUNCTION: checkAnswer
// Runs when the player clicks one of the answer buttons.
// Compares their answer to the correct one, updates the score,
// shows feedback, and then moves on to the next question.
// ============================================================
function checkAnswer(selectedAnswer, correctAnswer) {
  // Disable all answer buttons so the player can't click again
  // while the feedback message is showing
  let optionButtons = document.querySelectorAll("#options button");
  for (let i = 0; i < optionButtons.length; i++) {
    optionButtons[i].disabled = true;
  }

  let isCorrect = selectedAnswer === correctAnswer;

  if (isCorrect) {
    score = score + 1;
    scoreArea.textContent = "Correct! Score: " + score + " / " + quizQuestions.length;
  } else {
    scoreArea.textContent =
      "Incorrect. The correct answer was \"" + correctAnswer + "\". " +
      "Score: " + score + " / " + quizQuestions.length;
  }

  // Wait a little so the player has time to read the feedback,
  // then move on to the next question.
  setTimeout(function () {
    currentQuestionIndex = currentQuestionIndex + 1;
    showQuestion();
  }, 1200);
}

// ============================================================
// FUNCTION: showFinalScore
// Runs once all questions have been answered.
// Replaces the quiz area with a "complete" message and shows
// the player's total score.
// ============================================================
function showFinalScore() {
  quizArea.innerHTML = "<p>Quiz complete!</p>";
  scoreArea.textContent = "You got " + score + " / " + quizQuestions.length + " correct!";
}

// ============================================================
// STARTING EVERYTHING UP
// ============================================================

// When the "Restart Quiz" button is clicked, run startQuiz again
restartButton.addEventListener("click", startQuiz);

// Start the quiz as soon as the page loads
startQuiz();
