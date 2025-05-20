let canvas;
let world;
let keyboard = new Keyboard();
let startScreen;
let gameStarted = false;

function init() {
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

setInterval(() => {
    if (gameStarted) {  // Prüft, ob das Spiel gestartet wurde
        this.x -= this.speed; // Bewegung nur, wenn das Spiel läuft
    }
}, 1000 / 60);



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


