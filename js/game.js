let canvas;
let world;
let keyboard;
let startScreen;
let gameStarted = false;
let gameOverScreen = new Image();
gameOverScreen.src = 'img/9_intro_outro_screens/game_over/game over.png';
gameOverSound = new Audio('audio/gameover.mp3');

let intervalIDS = []; 

function setStoppableInterval(fn, time) { 
    let id = setInterval(fn, time); 
    intervalIDS.push(id); 
} 

function stopGame() { 
    intervalIDS.forEach(clearInterval); 
    intervalIDS = []; 
    console.log("All intervals stopped!"); // Zur Überprüfung
}


function init() {
      keyboard = new Keyboard()
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);

}


//stellt sicher, dass das Spiel erst startet, wenn ich auf start klicke
function startGame() {
    gameStarted = true;
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    init();
}

function showGameOverScreen() {
    stopGame(); // Stop all game intervals
    document.getElementById('canvas').style.display = 'none'; // Hide the game canvas
    let gameOverDiv = document.getElementById('gameOverScreen'); // Get the div for game over screen
    if (!gameOverDiv) { // Create the div if it doesn't exist
        gameOverDiv = document.createElement('div');
        gameOverDiv.id = 'gameOverScreen';
        gameOverDiv.style.position = 'absolute';
        gameOverDiv.style.top = '0';
        gameOverDiv.style.left = '0';
        gameOverDiv.style.width = '100%';
        gameOverDiv.style.height = '100%';
        gameOverDiv.style.display = 'flex';
        gameOverDiv.style.justifyContent = 'center';
        gameOverDiv.style.alignItems = 'center';
        gameOverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; 
        document.body.appendChild(gameOverDiv);
    }
    gameOverDiv.innerHTML = `<img src="${gameOverScreen.src}" style="max-width: 100%; max-height: 100%;">`;
    gameOverDiv.style.display = 'flex'; 
    gameOverSound.play();
}


window.addEventListener('keydown', (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }


       if (e.keyCode == 38) {
        keyboard.UP = true;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }

     if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }

     if (e.keyCode == 68) {
        keyboard.D = true;
    }

});


window.addEventListener('keyup', (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }


       if (e.keyCode == 38) {
        keyboard.UP = false;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }

     if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }

     if (e.keyCode == 68) {
        keyboard.D = false;
    }

});