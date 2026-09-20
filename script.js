//categories page
// Get the category from the URL
const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get("category");


// =========================
// Categories page
// =========================

const categoryContainer = document.getElementById("category-container");

if (categoryContainer) {
    const categoryCards = document.querySelectorAll(".activity-card");

    categoryCards.forEach(function(card) {
        card.addEventListener("click", function() {
            const selectedCategory = card.dataset.category;

            categoryContainer.innerHTML = `
                <h2>How would you like to practice?</h2>

                <a class="activity-card" href="flashcards.html?category=${selectedCategory}">
                    <h3>Flashcards</h3>
                    <p>Study with flashcards.</p>
                </a>

                <a class="activity-card" href="quiz.html?category=${selectedCategory}">
                    <h3>Quiz</h3>
                    <p>Test your knowledge.</p>
                </a>
            `;
        });
    });
}


// =========================
// Flashcards page
// =========================

const flashcardContainer = document.getElementById("flashcard-container");

if (flashcardContainer) {

    const cards = vocabulary[selectedCategory];

    const categoryName = document.getElementById("category-name");
    const categoryTitle = document.getElementById("category-title");

    const categoryNames = {
        common: "Common Words",
        food: "Food & Drinks",
        family: "Family",
        travel: "Travel"
    };

    categoryName.textContent = categoryNames[selectedCategory];
    categoryTitle.textContent = categoryNames[selectedCategory];

    let currentCard = 0;

    const flashcard = document.getElementById("flashcard");
    const answer = document.getElementById("flashcard-answer");
    const nextButton = document.getElementById("next-button");
    const previousButton = document.getElementById("previous-button");
    const cardNumber = document.getElementById("card-number");
    const totalCards = document.getElementById("total-cards");

    // Show the first card
    document.getElementById("flashcard-word").textContent = cards[0].ilocano;

    // Show total number of cards
    totalCards.textContent = cards.length;

    // Reveal answer
    flashcard.addEventListener("click", function() {
        answer.textContent = cards[currentCard].english;
    });

    // Next button
    nextButton.addEventListener("click", function() {

        if (currentCard < cards.length - 1) {
            currentCard++;

            const card = cards[currentCard];

            document.getElementById("flashcard-word").textContent = card.ilocano;
            document.getElementById("flashcard-answer").textContent = "Click to reveal";
            cardNumber.textContent = currentCard + 1;
        }
    });

    // Previous button
    previousButton.addEventListener("click", function() {

        if (currentCard > 0) {
            currentCard--;

            const card = cards[currentCard];

            document.getElementById("flashcard-word").textContent = card.ilocano;
            document.getElementById("flashcard-answer").textContent = "Click to reveal";
            cardNumber.textContent = currentCard + 1;
        }
    });
}



// =========================
// Quiz page
// =========================

const quizContainer = document.getElementById("quiz-question");

if (quizContainer) {

    const cards = vocabulary[selectedCategory];

    const categoryName = document.getElementById("category-name");
    const categoryTitle = document.getElementById("category-title");

    const categoryNames = {
        common: "Common Words",
        food: "Food & Drinks",
        family: "Family",
        travel: "Travel"
    };

    categoryName.textContent = categoryNames[selectedCategory];
    categoryTitle.textContent = categoryNames[selectedCategory];

    let currentQuestion = 0;
    let score = 0;

    const questionNumber = document.getElementById("question-number");
    const question = document.getElementById("quiz-question");
    const answerContainer = document.getElementById("answer-container");
    const feedback = document.getElementById("quiz-feedback");
    const nextButton = document.getElementById("next-question-button");


    // Show a question
    function showQuestion() {

        const card = cards[currentQuestion];

        questionNumber.textContent =
            `Question ${currentQuestion + 1} / ${cards.length}`;

        question.textContent =
            `What does "${card.ilocano}" mean?`;

        feedback.textContent = "";

        answerContainer.innerHTML = "";


        // Create the correct answer
        const correctAnswer = card.english;


        // Create answer choices
        const choices = [correctAnswer];

        for (let i = 0; i < cards.length; i++) {

            if (
                cards[i].english !== correctAnswer &&
                choices.length < 4
            ) {
                choices.push(cards[i].english);
            }
        }


        // Create buttons
        choices.forEach(function(choice) {

            const button = document.createElement("button");

            button.textContent = choice;

     
        button.addEventListener("click", function() {

            // Disable all answer buttons
            const answerButtons = answerContainer.querySelectorAll("button");

            answerButtons.forEach(function(button) {
                button.disabled = true;
            });


            // Check the answer
            if (choice === correctAnswer) {

                button.classList.add("correct");

                feedback.textContent = "Correct!";
                score++;

            } else {

                button.classList.add("incorrect");

                feedback.textContent =
                    `Not quite. The correct answer is ${correctAnswer}.`;
            }

        });



            answerContainer.appendChild(button);
        });
    }


    // Start the quiz
    showQuestion();


    // Next question
    nextButton.addEventListener("click", function() {

        if (currentQuestion < cards.length - 1) {

            currentQuestion++;

            showQuestion();

        } else {

            questionNumber.textContent = "Quiz Complete!";

            question.textContent =
                `You scored ${score} out of ${cards.length}.`;

            answerContainer.innerHTML = "";

            feedback.textContent = "";

            nextButton.style.display = "none";
        }
    });
}



