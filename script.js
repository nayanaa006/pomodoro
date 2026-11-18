
// 1. Timer durations (in seconds)
const durations = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
};

// 2. Application variables
let currentMode = "focus";
let timeLeft = durations.focus;
let completedSessions = 0;
let timerInterval = null;
let isRunning = false;

// 3. Get HTML elements
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const countDisplay = document.getElementById("count");
const statusDisplay = document.getElementById("status");
const sessionLabel = document.getElementById("session-label");

// 4. Display timer
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// 5. Change timer mode
function selectMode(mode) {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;

    currentMode = mode;
    timeLeft = durations[mode];

    const labels = {
        focus: "Focus Time",
        short: "Short Break",
        long: "Long Break"
    };

    sessionLabel.textContent = labels[mode];
    startButton.textContent = "Start";
    statusDisplay.textContent = "Ready when you are!";

    document.querySelectorAll(".mode").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.mode === mode
        );
    });

    updateDisplay();
}

// 6. Sound notification
function playSound() {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.connect(gain);
    gain.connect(audio.destination);

    oscillator.frequency.value = 800;
    gain.gain.value = 0.15;

    oscillator.start();
    oscillator.stop(audio.currentTime + 0.4);

    oscillator.onended = () => audio.close();
}

// 7. Handle completed sessions
function finishSession() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;

    playSound();

    if (currentMode === "focus") {
        completedSessions++;
        countDisplay.textContent = completedSessions;

        if (completedSessions % 4 === 0) {
            selectMode("long");
        } else {
            selectMode("short");
        }

        statusDisplay.textContent =
            "Focus session complete! Time for a break.";

    } else {
        selectMode("focus");
        statusDisplay.textContent =
            "Break complete! Back to focus.";
    }

    startTimer();
}

// 8. Start countdown
function startTimer() {
    if (isRunning) return;

    isRunning = true;
    startButton.textContent = "Pause";

    statusDisplay.textContent =
        currentMode === "focus"
            ? "Stay focused!"
            : "Enjoy your break!";

    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            timeLeft = 0;
            updateDisplay();
            finishSession();
        }
    }, 1000);
}

// 9. Pause countdown
function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;

    startButton.textContent = "Resume";
    statusDisplay.textContent = "Timer paused.";
}

// 10. Button functionality
startButton.addEventListener("click", () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetButton.addEventListener("click", () => {
    selectMode(currentMode);
});

// 11. Mode selection
document.querySelectorAll(".mode").forEach(button => {
    button.addEventListener("click", () => {
        selectMode(button.dataset.mode);
    });
});

// 12. Initial display
updateDisplay();
