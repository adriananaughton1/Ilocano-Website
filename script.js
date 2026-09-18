//categories page
const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get("category");

const categoryContainer = document.getElementById("category-container");

if (categoryContainer) {
    const categoryCards = document.querySelectorAll(".activity-card");

    categoryCards.forEach(function(card) {
        card.addEventListener("click", function() {
            const selectedCategory = card.dataset.category;

            categoryContainer.innerHTML = `
                <h2>How would you like to practice?</h2>
                <a class="activity-card" href="flashcards.html?category=${selectedCategory}">
                    Flashcards
                </a>
                <a class="activity-card" href="quiz.html?category=${selectedCategory}">
                    Quiz
                </a>
            `;
        });
    });
}

//flashcards page
const flashcardContainer = document.getElementById("flashcard-container");

if (flashcardContainer) {
    const cards = vocabulary[selectedCategory];

    let currentCard = 0;

    const flashcard = document.getElementById("flashcard");
    const answer = document.getElementById("flashcard-answer");
    const nextButton = document.getElementById("next-button");

    flashcard.addEventListener("click", function() {
        answer.textContent = cards[currentCard].english;
    });

    nextButton.addEventListener("click", function() {
        currentCard++;

        const card = cards[currentCard];

        document.getElementById("flashcard-word").textContent = card.ilocano;
        document.getElementById("flashcard-answer").textContent = "Click to reveal";
    });
}

//quiz page

