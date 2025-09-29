var width = 5;
var height = 6;

var row = 0;
var column = 0;

var gameOver = false;
let wordList = [];
let word = "";
let gameReady = false;
let stats = {
  points: 0,
  highscore: 0,
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  currentStreak: 0,
  longestStreak: 0
};

window.onload = function(){

  // Load stats from localStorage if available
  if(localStorage.getItem("scuffdleStats")) {
    stats = JSON.parse(localStorage.getItem("scuffdleStats"));
  }

// Call once at load
  // localStorage.removeItem("scuffdleStats"); /*reset stats*/
  updateStatsUI();
  initializeBoard();  // only creates board
  setupListeners();   // attach key listener once
  setupKeyboardClicks();

    document.getElementById("restart-btn").addEventListener("click", () => {
    restart(); // your existing restart function
    document.getElementById("restart-btn").style.display = "none"; // hide button again
  });

    document.getElementById("continue-btn").addEventListener("click", () => {
    continueGame(); // same behavior as restart
    document.getElementById("continue-btn").style.display = "none"; // hide after use
  });
  
    const hamburger = document.getElementById("hamburger");
    const dropdown = document.getElementById("dropdown");

    hamburger.addEventListener("click", () => {
    dropdown.classList.toggle("show");
    hamburger.classList.toggle("active");
  });

    const quitBtn = document.querySelector("#dropdown .dropdown-item:last-child"); // selects "Quit"
    quitBtn.addEventListener("click", () => {
        window.location.href = "index.html"; // redirect to menu
    });

    const statsToggle = document.getElementById("bar-chart");
    const statsMenu = document.getElementById("stats-dropdown");

    statsToggle.addEventListener("click", () => {
    statsMenu.classList.toggle("show");
    statsToggle.classList.toggle("active");
  });

}
//Board
function initializeBoard() {
  let board = document.getElementById("board");
  board.innerHTML = ""; // clear previous tiles
  for(let r = 0; r < height; r++) {
    for(let c = 0; c < width; c++) {
      let tile = document.createElement("span"); 
      tile.id = r + "-" + c;
      tile.classList.add("tile"); 
      tile.innerText = "";
      board.appendChild(tile);
    }
  } 
  
  updatePulse();
  fetch("words.txt")
  .then(response => response.text())
  .then(text => {
    wordList = text.split(/\r?\n/); // split lines into array
    word = getRandomWord();
    gameReady = true; 
    
    // pick a random word 
  });

function getRandomWord() {
  let index = Math.floor(Math.random() * wordList.length);
  return wordList[index]; 
}
  
}
function setupKeyboardClicks() {
  document.querySelectorAll(".key").forEach(key => {
    key.addEventListener("click", () => {
      const letter = key.innerText;

      if (letter === "Enter") {
        document.dispatchEvent(new KeyboardEvent("keyup", { code: "Enter" }));
      } else if (letter === "⌫") {
        document.dispatchEvent(new KeyboardEvent("keyup", { code: "Backspace" }));
      } else {
        document.dispatchEvent(new KeyboardEvent("keyup", { code: "Key" + letter }));
      }
    });
  });
}
function setupListeners() {
  document.addEventListener("keyup", (e) => {
    if(gameOver) return;

    if (e.code.startsWith("Key")) { 
      if (column < width) {
        let currentTile = document.getElementById(row + "-" + column);
        if (currentTile.innerText === "") {
          let letter = e.code.replace("Key", "");
          currentTile.innerText = letter;
          column += 1;
          updatePulse();
        }
      }
    }
    else if(e.code === "Backspace") { 
      if (column > 0) {
        column -= 1;
        let currentTile = document.getElementById(row + "-" + column);
        currentTile.innerText = "";
        updatePulse();
      }
    }
    else if(e.code === "Enter") {
      if(!gameReady) return;
      if (column === width) {
        if(row === 0) {
      stats.gamesPlayed += 1;
      updateStatsUI();
      saveStats();
    }
        let guess = "";
        for (let c = 0; c < width; c++) {
          let tile = document.getElementById(row + "-" + c);
          guess += tile.innerText.toUpperCase();
        }
// --- VALID WORD CHECK ---
      if (!wordList.includes(guess)) {
        showMessage("Invalid Word!", 1000,"white");
        return; 
      }
        // Color tiles
        for (let c = 0; c < width; c++) {
          let tile = document.getElementById(row + "-" + c);
          tile.classList.remove("correct","present","absent");
          let letter = tile.innerText;
          if (word[c] === letter) tile.classList.add("correct");
          else if (word.includes(letter)) tile.classList.add("present");
          else tile.classList.add("absent");
        }

        updateKeyboard(guess);

        // Win check
        if(guess === word) {
          gameOver = true;
          endGame(true);
          return;
        }

        // Move to next row
        row += 1;
        column = 0;
        updatePulse();
        // Lose check
        if(row === height) {
          gameOver = true;
          endGame(false);
        }
      }
    }
  });
}

function showMessage(text, duration = null) {
  const msg = document.getElementById("message");
  msg.innerText = text;

  if(duration){
    setTimeout(() => {
      msg.innerText = "";}, duration
    )
  }
}

function restart() {
  row = 0;
  column = 0;
  gameOver = false;
  const msg = document.getElementById("message");
  msg.innerText = "";
  msg.style.color = "#fff"; // reset to default
  document.getElementById("answer").innerText = "";

  stats.points = 0;
  updateStatsUI();
  initializeBoard();

  const keyElements = document.querySelectorAll(".key");
    keyElements.forEach(key => {
        key.style.backgroundColor = "#666"; // default color
    });

    updatePulse();
}

function continueGame() {
  row = 0;
  column = 0;
  gameOver = false;
  const msg = document.getElementById("message");
  msg.innerText = "";
  msg.style.color = "#fff"; // reset to default

  initializeBoard();

  const keyElements = document.querySelectorAll(".key");
    keyElements.forEach(key => {
        key.style.backgroundColor = "#666"; // default color
    });

    updatePulse();
}
//Change the color of the keys in the keyboard ig (present/absent/unavailable)
function updateKeyboard(guess) {
  for (let c = 0; c < guess.length; c++) {
    const letter = guess[c];
    const keyElements = document.querySelectorAll(".key");
    keyElements.forEach(key => {
      if (key.innerText.toUpperCase() === letter.toUpperCase()) {
        // Determine color
        if (word[c] === letter) {
          key.style.backgroundColor = "rgb(9, 143, 9)";   // correct
        } else if(word.includes(letter))
        {
          key.style.backgroundColor = "rgb(195, 167, 9)";
        }
        else {
          key.style.backgroundColor = "rgb(35,34,34)";          // absent
        }
      }
    });
  }
}

function endGame(win) {
  gameOver = true;
  const restartBtn = document.getElementById("restart-btn");
  const continueBtn = document.getElementById("continue-btn");

  const msg = document.getElementById("message");

  if(win) {
    stats.wins += 1;

    // Calculate points: 5 for win + 1 for each remaining row
    let remainingRows = height - row; 
    stats.points += 5 + remainingRows;

    if(stats.points > stats.highscore){
    stats.highscore = stats.points;
    }   

    stats.currentStreak += 1;
    if(stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }

    msg.style.color = "rgb(0,255,0)";
    showMessage("You Did It!");

    continueBtn.style.display = "block";
    restartBtn.style.display = "none";
  } else {
    stats.losses += 1;
    stats.currentStreak = 0; // reset streak
    msg.style.color = "red";
    showMessage("Game Over!");
    document.getElementById("answer").innerText = word;

    restartBtn.style.display = "block";
    continueBtn.style.display = "none";
  }

  // Update UI and save stats
  updateStatsUI();
  saveStats();
}
function updateStatsUI() {
  document.getElementById("points").innerText = `Points: ${stats.points}`;
  document.getElementById("highscore").innerText = `Highscore: ${stats.highscore}`;
  document.getElementById("games-played").innerText = `Games Played: ${stats.gamesPlayed}`;
  document.getElementById("wins").innerText = `Wins: ${stats.wins}`;
  document.getElementById("losses").innerText = `Losses: ${stats.losses}`;
  document.getElementById("current-streak").innerText = `Current Streak: ${stats.currentStreak}`;
  document.getElementById("longest-streak").innerText = `Longest Streak: ${stats.longestStreak}`;
}

function saveStats() {
  localStorage.setItem("scuffdleStats", JSON.stringify(stats));
}

function updatePulse() {
  // Remove pulse from all tiles first
  document.querySelectorAll(".tile").forEach(tile => tile.classList.remove("pulse"));

  if (!gameOver && row < height && column < width) {
    const nextTile = document.getElementById(`${row}-${column}`);
    if (nextTile && nextTile.innerText === "") {
      nextTile.classList.add("pulse");
    }
  }
}

