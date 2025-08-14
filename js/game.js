let canvas;
let world;
let keyboard;
let startScreen;
let gameStarted = false;
let gamePaused = false;
let isMuted = true;

let gameOverSound = new Audio('audio/gameover.mp3');
let youWinSound = new Audio('audio/win.mp3');
let backgroundSound = new Audio('audio/background.mp3');
backgroundSound.volume = 0.1
let introSound;
let intervalIDS = [];

function setStoppableInterval(fn, time) {
    let id = setInterval(() => {
        if (!gamePaused) fn();
    }, time);
    intervalIDS.push(id);
    return id;
}

function stopGame() {
    intervalIDS.forEach(clearInterval);
    intervalIDS = [];
}

function init() {
    keyboard = new Keyboard();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

function startGame() {
    gameStarted = true;
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    document.querySelector('.control-buttons').style.display = 'flex';
    if (introSound) {
        introSound.pause();
        introSound.currentTime = 0;
    }
    backgroundSound.volume = isMuted ? 0 : 0.2;
    backgroundSound.play();
    init()
    updateCharacterSoundMuteStatus();
}

function toggleMute() {
    const muteButtonStart = document.getElementById('muteButtonStart');
    const muteButtonGame = document.getElementById('muteButtonGame');

    if (isMuted) {

        if (gameStarted) {
            if (backgroundSound) backgroundSound.volume = 0.2;
        } else {
            if (introSound) {
                introSound.volume = 0.1;
                introSound.play().catch(error => console.log("Abspiel-Fehler:", error));
            }
        }
        muteButtonStart.src = './img/volume.png';
        muteButtonGame.src = './img/volume.png';
        muteButtonStart.alt = muteButtonGame.alt = 'Mute';
        isMuted = false;
    } else {
        // Stummschalten
        if (backgroundSound) backgroundSound.volume = 0;
        if (introSound) introSound.volume = 0;
        muteButtonStart.src = './img/mute.png';
        muteButtonGame.src = './img/mute.png';
        muteButtonStart.alt = muteButtonGame.alt = 'Unmute';
        isMuted = true;
    }
    updateCharacterSoundMuteStatus();
}

function updateCharacterSoundMuteStatus() {
    if (world && world.character) {
        world.character.jumpSound.volume = isMuted ? 0 : 1;
        world.character.hurtSound.volume = isMuted ? 0 : 1;
        world.character.deadSound.volume = isMuted ? 0 : 1;
        world.character.walkSound.volume = isMuted ? 0 : 1;
        world.character.snoreSound.volume = isMuted ? 0 : 1;
    }
}

function showGameOverScreen() {
    stopGame();
    backgroundSound.pause();
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'flex';
     this.gameOverSound.volume = isMuted ? 0 : 1;
    gameOverSound.play();
}

function showYouWinScreen() {
    stopGame();
    backgroundSound.pause();
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('youWinScreen').style.display = 'flex';
     this.youWinSound.volume = isMuted ? 0 : 1;
    youWinSound.play();
}

function togglePause() {
    const btn = document.getElementById('pauseResumeBtn');
    if (!gamePaused) {
        pauseGame();
        btn.innerText = '▶ Fortsetzen';
    } else {
        resumeGame();
        btn.innerText = '⏸ Pause';
    }
}

function pauseGame() {
    gamePaused = true;
    backgroundSound.pause();
    document.getElementById('pauseOverlay').style.display = "flex";

}

function resumeGame() {
    if (gameStarted && gamePaused) {
        gamePaused = false;
        backgroundSound.play();
        document.getElementById('pauseOverlay').style.display = "none";
    }
}

// function handleSoundPromptClick() {
//     introSound = new Audio('audio/intro.mp3');
//     introSound.volume = 0.1;
//     introSound.loop = true;
//     introSound.play()
//         .then(() => {
//             document.getElementById('soundPrompt').style.display = 'none';
//         })
// }

function initSoundPrompt() {
    introSound = new Audio('audio/intro.mp3');
    introSound.volume = 0; // Lautstärke auf 0 setzen
    introSound.loop = true;
}

function setupGameOverButtons() {
    document.getElementById('homeBtnGameOver').addEventListener('click', () => {
        location.reload();
    });

    document.getElementById('restartBtnGameOver').addEventListener('click', () => {
        gameOverSound.pause();
        gameOverSound.currentTime = 0;
        document.getElementById('gameOverScreen').style.display = 'none';
        gameStarted = false;
        init();
        startGame();
    });
}

function setupYouWinButtons() {
    document.getElementById('homeBtnYouWin').addEventListener('click', () => {
        location.reload();
    });

    document.getElementById('restartBtnYouWin').addEventListener('click', () => {
        youWinSound.pause();
        youWinSound.currentTime = 0;
        document.getElementById('youWinScreen').style.display = 'none';
        gameStarted = false;
        init();
        startGame();
    });
}

function initializeGameOnLoad() {
    initSoundPrompt();
    setupGameOverButtons();
    setupYouWinButtons();
    touchLeft();
    touchRight();
    touchJump();
    touchThrow();
    document.getElementById('muteButtonStart').src = isMuted ? './img/mute.png' : './img/volume.png';
    document.getElementById('muteButtonGame').src = isMuted ? './img/mute.png' : './img/volume.png';
}

function registerDOMContentLoadedListener() {
    document.addEventListener('DOMContentLoaded', initializeGameOnLoad);
}

//#region mobile

function touchLeft() {
    document.getElementById('leftBtn').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    }, { passive: false });
    document.getElementById('leftBtn').addEventListener('touchend', (e) => {
        keyboard.LEFT = false;
    });
}

function touchRight() {
    document.getElementById('rightBtn').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    }, { passive: false });
    document.getElementById('rightBtn').addEventListener('touchend', (e) => {
        keyboard.RIGHT = false;
    });
}

function touchJump() {
    document.getElementById('jumpBtn').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
    }, { passive: false });
    document.getElementById('jumpBtn').addEventListener('touchend', (e) => {
        keyboard.SPACE = false;
    });
}

function touchThrow() {
    document.getElementById('throwBtn').addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.D = true;
    }, { passive: false });
    document.getElementById('throwBtn').addEventListener('touchend', (e) => {
        keyboard.D = false;
    });
}

//#region 

registerDOMContentLoadedListener();

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

function openImpressum() {
    document.getElementById('impressumOverlay').classList.remove('d-none');
}

function closeImpressum() {
    document.getElementById('impressumOverlay').classList.add('d-none');
}