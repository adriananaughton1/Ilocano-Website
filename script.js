// Get the category from the URL
const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get("category");


// =========================
// Helper Functions
// =========================

// Get vocabulary for the selected category
function getCategoryVocabulary(category) {

    // "all" means every vocabulary word
    if (category === "all") {
        return vocabulary;
    }

    // Otherwise, find words that contain the category
    return vocabulary.filter(function(word) {

        return word.categories &&
               word.categories.includes(category);

    });
}


// Convert a category ID into a readable title
function formatCategoryName(category) {

    if (category === "all") {
        return "All Vocabulary";
    }

    return category
        .replace(/-/g, " ")
        .replace(/\b\w/g, function(letter) {
            return letter.toUpperCase();
        });
}


// =========================
// Categories Page
// =========================

const categoryContainer =
    document.getElementById("category-container");

if (categoryContainer) {

    // Find every category used in vocabulary
    const categories = [];

    vocabulary.forEach(function(word) {

        if (!word.categories) {
            return;
        }

        word.categories.forEach(function(category) {

            if (!categories.includes(category)) {

                categories.push(category);

            }

        });

    });


    // Add "All Vocabulary"
    categories.unshift("all");


    // Create category cards
    categories.forEach(function(category) {

        const card =
            document.createElement("a");

        card.classList.add("activity-card");

        card.href = "#";

        card.dataset.category = category;


        // Category name
        const title =
            document.createElement("h3");

        title.textContent =
            formatCategoryName(category);


        // Category description
        const description =
            document.createElement("p");

        if (category === "all") {

            description.textContent =
                "Practice everything.";

        } else {

            const wordCount =
                vocabulary.filter(function(word) {

                    return word.categories &&
                           word.categories.includes(category);

                }).length;

            description.textContent =
                `${wordCount} vocabulary words.`;

        }


        card.appendChild(title);

        card.appendChild(description);

        categoryContainer.appendChild(card);


        // Click category
        card.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                categoryContainer.innerHTML = `

                    <h2>How would you like to practice?</h2>

                    <a class="activity-card"
                       href="flashcards.html?category=${category}">

                        <h3>Flashcards</h3>

                        <p>
                            Study with flashcards.
                        </p>

                    </a>

                    <a class="activity-card"
                       href="quiz.html?category=${category}">

                        <h3>Quiz</h3>

                        <p>
                            Test your knowledge.
                        </p>

                    </a>

                `;

            }
        );

    });

}


// =========================
// Flashcards Page
// =========================

const flashcardContainer =
    document.getElementById("flashcard-container");

if (flashcardContainer) {

    const cards =
        getCategoryVocabulary(selectedCategory);

    const categoryName =
        document.getElementById("category-name");

    const categoryTitle =
        document.getElementById("category-title");

    const flashcard =
        document.getElementById("flashcard");

    const wordElement =
        document.getElementById("flashcard-word");

    const answer =
        document.getElementById("flashcard-answer");

    const nextButton =
        document.getElementById("next-button");

    const previousButton =
        document.getElementById("previous-button");

    const cardNumber =
        document.getElementById("card-number");

    const totalCards =
        document.getElementById("total-cards");


    // Set category title
    const readableCategory =
        formatCategoryName(selectedCategory);

    categoryName.textContent =
        readableCategory;

    categoryTitle.textContent =
        readableCategory;


    // Handle empty categories
    if (cards.length === 0) {

        wordElement.textContent =
            "No vocabulary yet.";

        answer.textContent =
            "Add words to this category in vocabulary.js.";

        cardNumber.textContent = "0";
        totalCards.textContent = "0";

        nextButton.disabled = true;
        previousButton.disabled = true;

    } else {

        let currentCard = 0;


        // Show current card
        function showCard() {

            const card =
                cards[currentCard];

            wordElement.textContent =
                card.ilocano;

            answer.textContent =
                "Click to reveal";

            cardNumber.textContent =
                currentCard + 1;

            totalCards.textContent =
                cards.length;

        }


        // Show first card
        showCard();


        // Reveal answer
        flashcard.addEventListener("click", function() {

            answer.textContent =
                cards[currentCard].english;

        });


        // Next button
        nextButton.addEventListener("click", function() {

            if (currentCard < cards.length - 1) {

                currentCard++;

                showCard();

            }

        });


        // Previous button
        previousButton.addEventListener("click", function() {

            if (currentCard > 0) {

                currentCard--;

                showCard();

            }

        });

    }

}



// =========================
// Quiz Page
// =========================

const quizContainer =
    document.getElementById("quiz-question");


function shuffleArray(array) {
    return [...array].sort(function() {
        return Math.random() - 0.5;
    });
}


if (quizContainer) {

    const allCards =
        getCategoryVocabulary(selectedCategory);

    const categoryName =
        document.getElementById("category-name");

    const categoryTitle =
        document.getElementById("category-title");

    const questionNumber =
        document.getElementById("question-number");

    const question =
        document.getElementById("quiz-question");

    const answerContainer =
        document.getElementById("answer-container");

    const feedback =
        document.getElementById("quiz-feedback");

    const nextButton =
        document.getElementById("next-question-button");

    const quizLengthContainer =
        document.getElementById("quiz-length-container");

    const quizContent =
        document.getElementById("quiz-content");

    const lengthButtons =
        document.querySelectorAll(".quiz-length-button");

    const longQuizCount =
        document.getElementById("long-quiz-count");


    // =========================
    // Set Category Title
    // =========================

    const readableCategory =
        formatCategoryName(selectedCategory);

    categoryName.textContent =
        readableCategory;

    categoryTitle.textContent =
        readableCategory;


    // Show actual number for Long quiz

    longQuizCount.textContent =
        `${allCards.length} questions`;


    // =========================
    // Handle Empty Categories
    // =========================

    if (allCards.length === 0) {

        quizLengthContainer.innerHTML =
            "<p>No vocabulary yet.</p>";

    } else {


        // =========================
        // Quiz Variables
        // =========================

        let cards = [];

        let currentQuestion = 0;

        let score = 0;


        // =========================
        // Start Quiz
        // =========================

        function startQuiz(length) {

            // Shuffle all available questions

            const shuffledCards =
                shuffleArray(allCards);


            // Determine quiz length

            if (length === "all") {

                cards = shuffledCards;

            } else {

                cards =
                    shuffledCards.slice(
                        0,
                        Math.min(
                            Number(length),
                            shuffledCards.length
                        )
                    );

            }


            currentQuestion = 0;

            score = 0;


            // Hide length selection

            quizLengthContainer.style.display =
                "none";


            // Show quiz

            quizContent.style.display =
                "block";

            nextButton.style.display =
                "inline-block";


            showQuestion();

        }


        // =========================
        // Show Question
        // =========================

        function showQuestion() {

            const card =
                cards[currentQuestion];


            questionNumber.textContent =
                `Question ${currentQuestion + 1} / ${cards.length}`;


            question.textContent =
                `What does "${card.ilocano}" mean?`;


            feedback.textContent = "";

            answerContainer.innerHTML = "";


            // Correct answer

            const correctAnswer =
                card.english;


            // =========================
            // Create Answer Choices
            // =========================

            const choices =
                [correctAnswer];


            // Get possible wrong answers

            const wrongAnswers =
                cards.filter(function(word) {

                    return word.english !== correctAnswer;

                });


            // Shuffle wrong answers

            const shuffledWrongAnswers =
                shuffleArray(wrongAnswers);


            // Add wrong answers until we have 4

            for (
                let i = 0;
                i < shuffledWrongAnswers.length &&
                choices.length < 4;
                i++
            ) {

                choices.push(
                    shuffledWrongAnswers[i].english
                );

            }


            // Shuffle all choices

            const shuffledChoices =
                shuffleArray(choices);


            // =========================
            // Create Buttons
            // =========================

            shuffledChoices.forEach(function(choice) {

                const button =
                    document.createElement("button");

                button.textContent =
                    choice;


                button.addEventListener(
                    "click",
                    function() {

                        // Disable all buttons

                        const answerButtons =
                            answerContainer.querySelectorAll(
                                "button"
                            );


                        answerButtons.forEach(
                            function(button) {

                                button.disabled = true;

                            }
                        );


                        // Check answer

                        if (choice === correctAnswer) {

                            button.classList.add(
                                "correct"
                            );

                            feedback.textContent =
                                "Correct!";

                            score++;

                        } else {

                            button.classList.add(
                                "incorrect"
                            );

                            feedback.textContent =
                                `Not quite. The correct answer is ${correctAnswer}.`;

                        }

                    }
                );


                answerContainer.appendChild(button);

            });

        }


        // =========================
        // Quiz Length Buttons
        // =========================

        lengthButtons.forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const length =
                        button.dataset.length;

                    startQuiz(length);

                }
            );

        });


        // =========================
        // Next Question
        // =========================

        nextButton.addEventListener(
            "click",
            function() {

                if (
                    currentQuestion <
                    cards.length - 1
                ) {

                    currentQuestion++;

                    showQuestion();

                } else {

                    questionNumber.textContent =
                        "Quiz Complete!";

                    question.textContent =
                        `You scored ${score} out of ${cards.length}.`;

                    answerContainer.innerHTML = "";

                    feedback.textContent = "";

                    nextButton.style.display =
                        "none";

                    document.getElementById(
                        "back-to-vocabulary-button"
                    ).style.display =
                        "inline-block";

                }

            }
        );

    }

}

