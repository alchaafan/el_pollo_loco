let canvas;
let world;
let keyboard;
let startScreen;
let gameStarted = false;
let gamePaused = false;

let savedCharacterX = 0;
let savedCharacterY = 0;

let savedCharacterState = {};
let savedCameraX = 0;
let savedEnemiesState = [];




let gameOverScreen = new Image();
let youWinScreen = new Image();
youWinScreen.src = 'img/You won, you lost/YouWinA.png';
gameOverScreen.src = 'img/9_intro_outro_screens/game_over/game over.png';
gameOverSound = new Audio('audio/gameover.mp3');
youWinSound = new Audio('audio/win.mp3');

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
    stopGame();
    document.getElementById('canvas').style.display = 'none';

    let gameOverDiv = document.getElementById('gameOverScreen');

    if (!gameOverDiv) {
        gameOverDiv = document.createElement('div');
        gameOverDiv.id = 'gameOverScreen';
        gameOverDiv.style.position = 'absolute';
        gameOverDiv.style.top = '0';
        gameOverDiv.style.left = '0';
        gameOverDiv.style.width = '100%';
        gameOverDiv.style.height = '100%';
        gameOverDiv.style.display = 'flex';
        gameOverDiv.style.flexDirection = 'column';
        gameOverDiv.style.justifyContent = 'center';
        gameOverDiv.style.alignItems = 'center';
        gameOverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        document.body.appendChild(gameOverDiv);
    }

    gameOverDiv.innerHTML = `
        <img src="${gameOverScreen.src}" style="max-width: 100%; max-height: 70%;">
        <div class="button-container">
            <button id="homeBtn" class="home-button">Home</button>
            <button id="restartBtn" class="restart-button">Play Again</button>
        </div>
    `;

    gameOverDiv.style.display = 'flex';
    gameOverSound.play();

    // Event Listener
    document.getElementById('homeBtn').addEventListener('click', () => {
        location.reload(); // Seite neu laden = alles neu starten
    });

   document.getElementById('restartBtn').addEventListener('click', () => {
    // Musik stoppen und zurücksetzen
    gameOverSound.pause();
    gameOverSound.currentTime = 0;

    document.getElementById('gameOverScreen').remove(); // GameOverScreen ausblenden
    gameStarted = false;
    init();
    startGame(); // Spiel frisch starten
});

}



function showYouWinScreen() {
    stopGame(); // Alle Spielintervalle stoppen
    document.getElementById('canvas').style.display = 'none'; // Canvas ausblenden
    let youWinDiv = document.getElementById('youWinScreen');

    if (!youWinDiv) {
        youWinDiv = document.createElement('div');
        youWinDiv.id = 'youWinScreen';
        youWinDiv.style.position = 'absolute';
        youWinDiv.style.top = '0';
        youWinDiv.style.left = '0';
        youWinDiv.style.width = '100%';
        youWinDiv.style.height = '100%';
        youWinDiv.style.display = 'flex';
        youWinDiv.style.flexDirection = 'column';
        youWinDiv.style.justifyContent = 'center';
        youWinDiv.style.alignItems = 'center';
        youWinDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        document.body.appendChild(youWinDiv);
    }

    youWinDiv.innerHTML = `
    <img src="${youWinScreen.src}" style="max-width: 100%; max-height: 70%;">
    <div class="button-container">
        <button id="homeBtn" class="home-button">Home</button>
        <button id="restartBtn" class="restart-button">play again</button>
    </div>
`;


    youWinDiv.style.display = 'flex';
    youWinSound.play();

    // ⏪ Event Listener zum Neustarten
    document.getElementById('homeBtn').addEventListener('click', () => {
        location.reload(); // Seite neu laden = Spiel neu starten
    });

    document.getElementById('restartBtn').addEventListener('click', () => {
        document.getElementById('youWinScreen').remove(); // You-Win-Screen ausblenden
        gameStarted = false;
        init();
        startGame(); // Spiel frisch starten
    });

}

function togglePause() {
    const btn = document.getElementById('pauseResumeBtn');

    if (!gamePaused) {
        pauseGame();
        btn.innerText = '⏸ Pause';
    } else {
        resumeGame();
        btn.innerText = '⏸ Pause';
    }
}


function pauseGame() {
    stopGame(); // Stoppe alle Intervalls
    gamePaused = true;

    // ⏸ Charakter-Zustand speichern
    if (world && world.character) {
        savedCharacterState = {
            x: world.character.x,
            y: world.character.y,
            speedY: world.character.speedY,
            otherDirection: world.character.otherDirection,
            energy: world.character.energy,
            currentImage: world.character.currentImage,
            currentAnimation: world.character.currentAnimation
        };
    }

    // ⏸ Kamera speichern
    if (world) {
        savedCameraX = world.camera_x;
    }

    // ⏸ Gegner-Zustand speichern
    if (world && world.level && world.level.enemies) {
        savedEnemiesState = world.level.enemies.map(enemy => ({
            type: enemy.constructor.name,  // z. B. "Chicken"
            x: enemy.x,
            y: enemy.y,
            energy: enemy.energy,
            otherDirection: enemy.otherDirection,
            isDead: enemy.isDead()
        }));
    }

    // ⏸ Overlay anzeigen
    document.getElementById('pauseOverlay').style.display = 'flex';

    // Button-Text ändern, falls du das nicht in togglePause machst
    const btn = document.getElementById('pauseResumeBtn');
    if (btn) btn.innerText = '▶ Fortsetzen';

    console.log("Spiel pausiert.");
}




function resumeGame() {
    if (gameStarted && gamePaused) {
        gamePaused = false;

        // Neue Welt erzeugen
        world = new World(canvas, keyboard);

        // 🔁 Charakter-Zustand wiederherstellen
        if (world && world.character && savedCharacterState) {
            const char = world.character;

            char.x = savedCharacterState.x;
            char.y = savedCharacterState.y;
            char.speedY = savedCharacterState.speedY;
            char.otherDirection = savedCharacterState.otherDirection;
            char.energy = savedCharacterState.energy;
            char.currentImage = savedCharacterState.currentImage;
            char.currentAnimation = savedCharacterState.currentAnimation;

            world.statusBar.setPercentage(char.energy);
        }

        // 🔁 Kamera-Position wiederherstellen
        world.camera_x = savedCameraX;

        // 🔁 Gegner-Zustand wiederherstellen
        if (world.level && world.level.enemies && savedEnemiesState.length > 0) {
            world.level.enemies.forEach((enemy, index) => {
                const saved = savedEnemiesState[index];
                if (saved) {
                    enemy.x = saved.x;
                    enemy.y = saved.y;
                    enemy.energy = saved.energy;
                    enemy.otherDirection = saved.otherDirection;

                    if (saved.isDead) {
                        enemy.energy = 0; // Gegner bleibt tot
                    }
                }
            });
        }

        // Overlay ausblenden
        document.getElementById('pauseOverlay').style.display = 'none';

        // Button-Text zurücksetzen
        const btn = document.getElementById('pauseResumeBtn');
        if (btn) btn.innerText = '⏸ Pause';

        console.log("Spiel fortgesetzt.");
    }
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