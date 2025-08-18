document.addEventListener("DOMContentLoaded", () => {
    const homeScreen = document.getElementById("home-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resumeBtn = document.getElementById("homeResumeBtn");
    const restartBtn = document.getElementById("homeRestartBtn");

    // Resume quiz
    if (resumeBtn) {
        resumeBtn.addEventListener("click", () => {
            homeScreen.style.display = "none";
            quizScreen.style.display = "block";
            localStorage.setItem("resumeMode", "true");
            window.dispatchEvent(new Event("startQuiz"));
        });
    }

    // Restart quiz
    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            localStorage.clear();
            homeScreen.style.display = "none";
            quizScreen.style.display = "block";
            localStorage.setItem("resumeMode", "false");
            window.dispatchEvent(new Event("startQuiz"));
        });
    }
});
