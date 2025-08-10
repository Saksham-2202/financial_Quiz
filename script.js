let questions = [];

const questionElement = document.getElementById("questions");
const answerButtons = document.getElementById("answer-button");
const nextButton = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");

let currentQuestionIndex = 0;
let score = 0;

// Fetch financial fraud questions from API
async function fetchQuestions() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/Saksham-2202/quiz-api/refs/heads/main/questions.json");
    let data = await res.json();

    // Shuffle with Fisher–Yates
    for (let i = data.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }

    // Pick first 10
    questions = data.slice(0, 10);

    startQuiz();
  } catch (err) {
    console.error("Failed to load questions:", err);
    questionElement.innerText = "Error loading questions.";
  }
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  progressBar.style.width = "0%"; // Reset progress
  nextButton.innerHTML = "Next";
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = `${questionNo}. ${currentQuestion.question}`;

  currentQuestion.answer.forEach(answer => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });
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
    selectedBtn.classList.add("correct");
    score++;
    updateProgress(); // ✅ Progress only on correct answer
  } else {
    selectedBtn.classList.add("incorrect");
  }

  Array.from(answerButtons.children).forEach(button => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });

  nextButton.style.display = "block";
}

function showScore() {
  resetState();
  let percentage = Math.round((score / questions.length) * 100); // ✅ Show percentage
  questionElement.innerHTML = `🎉 You scored ${percentage}% (${score} out of ${questions.length})!`;
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

function updateProgress() {
  let progressPercent = (score / questions.length) * 100; // ✅ Progress by correct answers
  progressBar.style.width = `${progressPercent}%`;

  // Progress percentage (based only on correct answers)
    let progressPercents = (score / questions.length) * 100;
    progressBar.style.width = `${progressPercents}%`;

    // Color changes from light green (#90EE90) to dark green (#006400)
    // We'll interpolate between the two colors
    let startColor = { r: 152, g: 251, b: 152 }; // Pale green (#98FB98)
    let endColor   = { r: 0,   g: 255, b: 0   };// Dark green

    let ratio = score / questions.length;
    let r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
    let g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
    let b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);

    progressBar.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}



nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

// Start by fetching questions from API
fetchQuestions();
