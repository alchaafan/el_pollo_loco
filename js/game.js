let canvas;
let world;
let keyboard;
let startScreen;
let gameStarted = false;
let gameOverScreen = new Image();
let youWinScreen = new Image();
youWinScreen.src = 'img/You won, you lost/YouWinA.png';
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


function showYouWinScreen() { //
    stopGame(); // Alle Spielintervalle stoppen
    document.getElementById('canvas').style.display = 'none'; // Verstecke das Spiel-Canvas
    let youWinDiv = document.getElementById('youWinScreen'); // Div für den "You Win"-Bildschirm holen
    if (!youWinDiv) { // Div erstellen, falls er nicht existiert
        youWinDiv = document.createElement('div'); //
        youWinDiv.id = 'youWinScreen'; //
        youWinDiv.style.position = 'absolute'; //
        youWinDiv.style.top = '0'; //
        youWinDiv.style.left = '0'; //
        youWinDiv.style.width = '100%'; //
        youWinDiv.style.height = '100%'; //
        youWinDiv.style.display = 'flex'; //
        youWinDiv.style.justifyContent = 'center'; //
        youWinDiv.style.alignItems = 'center'; //
        youWinDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; //
        document.body.appendChild(youWinDiv); //
    }
    youWinDiv.innerHTML = `<img src="${youWinScreen.src}" style="max-width: 100%; max-height: 100%;">`; //
    youWinDiv.style.display = 'flex'; //
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