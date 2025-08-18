const questionElement = document.getElementById("questions");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const quizLevelDisplay = document.getElementById("quizLevel");
const quizCard = document.getElementById("quiz-card");
const quizbox = document.querySelector(".app");


if (questionElement && answerButtons && nextButton && progressBar && quizLevelDisplay && quizCard) {
    let allQuestions = [];
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let currentLevel = 1;
    const totalLevels = 3;
    const questionsPerLevel = 10;
    const totalQuestions = totalLevels * questionsPerLevel;
    let totalAnswered = 0;

    let resumeMode = localStorage.getItem("resumeMode") === "true";

    async function fetchQuestions() {
        try {
            const res = await fetch("https://raw.githubusercontent.com/Saksham-2202/quiz-api/refs/heads/main/questions.json");
            let data = await res.json();

            // Shuffle
            for (let i = data.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [data[i], data[j]] = [data[j], data[i]];
            }
            allQuestions = data;

            if (resumeMode) {
                currentLevel = parseInt(localStorage.getItem("quizLevel")) || 1;
                currentQuestionIndex = parseInt(localStorage.getItem("quizQuestionIndex")) || 0;
                totalAnswered = parseInt(localStorage.getItem("totalAnswered")) || 0;
                score = parseInt(localStorage.getItem("quizScore")) || 0;
            }

            loadLevel(currentLevel);
            startQuiz();
        } catch (err) {
            console.error("Failed to load questions:", err);
            questionElement.innerText = "Error loading questions.";
        }
    }

    function loadLevel(level) {
        const startIndex = (level - 1) * questionsPerLevel;
        questions = allQuestions.slice(startIndex, startIndex + questionsPerLevel);
        quizLevelDisplay.textContent = level;

        if (level === 1) quizbox.style.background = "linear-gradient(to bottom, #fafafaff, #87eafbff, #1a9eb6ff)";
        else if (level === 2) quizbox.style.background = "linear-gradient(to bottom, #f1f4e8ff, #eced88ff, #cfd156ff)";
        else if (level === 3) quizbox.style.background = "linear-gradient(to bottom, #fbebebff, #eaacacff, #ca6060ff)";
    }

    function startQuiz() {
        if (!resumeMode) {
            score = 0;
            totalAnswered = 0;
            currentLevel = 1;
            currentQuestionIndex = 0;
            resetProgressBar();
        } else {
            updateProgressBar();
        }
        nextButton.innerHTML = "Next";
        showQuestion();
    }

    function showQuestion() {
        resetState();
        let currentQuestion = questions[currentQuestionIndex];
        questionElement.innerHTML = `Level ${currentLevel} - Q${currentQuestionIndex + 1}: ${currentQuestion.question}`;

        currentQuestion.answer.forEach(answer => {
            const button = document.createElement("button");
            button.innerHTML = answer.text;
            button.classList.add("btn");
            if (answer.correct) button.dataset.correct = answer.correct;
            button.addEventListener("click", selectAnswer);
            answerButtons.appendChild(button);
        });

        saveProgress();
    }

    function resetState() {
        nextButton.style.display = "none";
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === "true";

        if (isCorrect) {
            score++;
            totalAnswered++;
            selectedBtn.classList.add("correct");
            updateProgressBar();
        } else {
            selectedBtn.classList.add("incorrect");
        }

        Array.from(answerButtons.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            }
            button.disabled = true;
        });

        saveProgress();
        nextButton.style.display = "block";
    }
    
    let gameFinished = false;

    function handleNextButton() {
        if (gameFinished) {
            document.getElementById("quiz-screen").style.display = "none";
            document.getElementById("home-screen").style.display = "block";
            gameFinished = false; // reset
            return;
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            if (currentLevel < totalLevels) {
                currentLevel++;
                loadLevel(currentLevel);
                currentQuestionIndex = 0;
                showQuestion();
            } else {
                showScore();
            }
        }
    }

    function showScore() {
        resetState();
        let percentage = Math.round((score / totalQuestions) * 100);
        questionElement.innerHTML = `🎉 You completed all levels! Total Score: ${percentage}% (${score} / ${totalQuestions})`;
        nextButton.innerHTML = "Go to Home";
        nextButton.style.display = "block";
        localStorage.clear();
        gameFinished = true; // ✅ signal end of quiz
    }

    function updateProgressBar() {
        let progressPercent = (totalAnswered / totalQuestions) * 100;
        progressBar.style.width = `${progressPercent}%`;
        progressBar.style.backgroundColor = "#4CAF50";
    }

    function resetProgressBar() {
        progressBar.style.width = "0%";
    }

    function saveProgress() {
        localStorage.setItem("quizLevel", currentLevel);
        localStorage.setItem("quizQuestionIndex", currentQuestionIndex);
        localStorage.setItem("quizQuestionNumber", currentQuestionIndex + 1);
        localStorage.setItem("totalAnswered", totalAnswered);
        localStorage.setItem("quizScore", score);
    }

    nextButton.addEventListener("click", () => {
        handleNextButton();
    });

    // ✅ Listen for startQuiz event
    window.addEventListener("startQuiz", () => {
        resumeMode = localStorage.getItem("resumeMode") === "true";

        // 🔥 FIX: When restarting, always reset values
        if (!resumeMode) {
            score = 0;
            totalAnswered = 0;
            currentLevel = 1;
            currentQuestionIndex = 0;
            resetProgressBar();
        }

        fetchQuestions();
    });
}
