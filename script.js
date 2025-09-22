var width = 5;
var height = 6;

var row = 0;
var column = 0;
/*
var keyboardRow = 0;
var keyboardCol = 0;
var keyboardWidth = 10;
var keyboardHeight = 3;
*/

var gameOver = false;
let wordList = [];
let word = "";
let gameReady = false;

window.onload = function(){
  initializeBoard();  // only creates board
  setupListeners();   // attach key listener once
  setupKeyboardClicks();

  document.getElementById("restart-btn").addEventListener("click", () => {
    restart(); // your existing restart function
    document.getElementById("restart-btn").style.display = "none"; // hide button again
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

  fetch("words.txt")
  .then(response => response.text())
  .then(text => {
    wordList = text.split(/\r?\n/); // split lines into array
    word = getRandomWord();
    gameReady = true;       // pick a random word 
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
        }
      }
    }
    else if(e.code === "Backspace") { 
      if (column > 0) {
        column -= 1;
        let currentTile = document.getElementById(row + "-" + column);
        currentTile.innerText = "";
      }
    }
    else if(e.code === "Enter") {
      if(!gameReady) return;
      if (column === width) {
        let guess = "";
        for (let c = 0; c < width; c++) {
          let tile = document.getElementById(row + "-" + c);
          guess += tile.innerText.toUpperCase();
        }
// --- VALID WORD CHECK ---
      if (!wordList.includes(guess)) {
        showMessage("Invalid Word!", 1000);
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
          showMessage("You Did It!");
          endGame(true);
          return;
        }

        // Move to next row
        row += 1;
        column = 0;

        // Lose check
        if(row === height) {
          const msg = document.getElementById("message");
          msg.style.color = "red";
          showMessage("Game Over!");
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
  document.getElementById("answer").innerText = "";
  document.getElementById("message").innerText = "";
  initializeBoard();

  const keyElements = document.querySelectorAll(".key");
    keyElements.forEach(key => {
        key.style.backgroundColor = "#666"; // default color
    });
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
  restartBtn.style.display = "block"; 

  const msg = document.getElementById("message");

  if(win) {
    msg.style.color = "rgb(0,255,0)";
    showMessage("You Did It!");
  } else {
    msg.style.color = "red";
    showMessage("Game Over!");
    document.getElementById("answer").innerText = word; // show answer only when lost
  }
}