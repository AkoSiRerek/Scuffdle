window.onload = function() {
    // ABOUT PANEL
    const aboutBtn = document.getElementById("about-btn");
    const aboutPanel = document.getElementById("about-panel");
    const closeAbout = document.getElementById("close-about");

    aboutBtn.addEventListener("click", () => {
        aboutPanel.classList.add("show");
    });

    closeAbout.addEventListener("click", () => {
        aboutPanel.classList.remove("show");
    });

    // HIGHSCORE PANEL
    const highscoreBtn = document.getElementById("highscore-btn");
    const highscorePanel = document.getElementById("highscore-panel");
    const highscoreText = document.getElementById("highscore-text");
    const closeHighscore = document.getElementById("close-highscore");

    highscoreBtn.addEventListener("click", () => {
        let stats = JSON.parse(localStorage.getItem("scuffdleStats"));
        let highscore = stats && stats.highscore ? stats.highscore : 0;
        highscoreText.innerText = `Your Highscore: ${highscore}`;
        highscorePanel.classList.add("show");
    });

    closeHighscore.addEventListener("click", () => {
        highscorePanel.classList.remove("show");
    });

    setInterval(spawnLetter, 300);
    
}

function spawnLetter() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letter = letters[Math.floor(Math.random() * letters.length)];

  const span = document.createElement("span");
  span.classList.add("falling-letter");
  span.innerText = letter;

  // Random horizontal position
  span.style.left = Math.random() * window.innerWidth + "px";

  // Random fall speed
  const duration = 4 + Math.random() * 6; // between 4–10 seconds
  span.style.animationDuration = duration + "s";

  span.style.color = getRandomBrightColor();

  document.body.appendChild(span);

  // Remove after animation
  setTimeout(() => { 
    span.remove();
  }, duration * 1000);

}

  // Function to generate a bright color
function getRandomBrightColor() {
  // HSL with high lightness

  if (Math.random() < 0.1) return "#ffffff";
  const hue = Math.floor(Math.random() * 360);    // any color
  const saturation = 70 + Math.random() * 30;     // 70–100%
  const lightness = 50 + Math.random() * 30;      // 50–80% bright
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

