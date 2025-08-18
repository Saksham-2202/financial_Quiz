const homeProgressText = document.getElementById("quiz-home-progress");
const homeResumeBtn = document.getElementById("quiz-home-resume");
const homeRestartBtn = document.getElementById("quiz-home-restart");

let savedLevel = localStorage.getItem("quizLevel");
let savedQuestionNumber = localStorage.getItem("quizQuestionNumber");

if (savedLevel && savedQuestionNumber) {
    homeProgressText.textContent = `You last stopped at Level ${savedLevel}, Question ${savedQuestionNumber}`;
    homeResumeBtn.disabled = false;
} else {
    homeProgressText.textContent = "No saved progress found. Start a new quiz!";
    homeResumeBtn.disabled = true;
}

homeResumeBtn.addEventListener("click", () => {
    location.href = "ques.html";
});

homeRestartBtn.addEventListener("click", () => {
    localStorage.clear();
    location.href = "ques.html";
});
