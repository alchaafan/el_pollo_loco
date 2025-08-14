

class ThrowableObject extends MovableObject {



    isSplashed = false;
    throwDirection = 1; // 1 für rechts, -1 für links
    splashSound = new Audio('audio/tomato.mp3');

    //#region constructor
    constructor(x, y, otherDirection) { 
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.loadImages(ImageHub.salsa.rotation);
        this.loadImages(ImageHub.salsa.splash);

        // Blickrichtung speichern
        if (otherDirection) { 
            this.throwDirection = -1;
        } else { 
            this.throwDirection = 1;
        }

        this.throw();
    }
    //#region 

    //#region methods
    throw() {
        this.speedY = 30;
        this.applyGravity();
        setStoppableInterval(() => {
            if (!this.isSplashed) { 
                this.x += (10 * this.throwDirection); 
                this.animateLoop(ImageHub.salsa.rotation); 
            }
        }, 25);
    }

    splash() {
        this.isSplashed = true; 
        this.speedY = 0; // Vertikale Bewegung stoppen
        this.speed = 0; // Horizontale Bewegung stoppen 
         this.splashSound.volume = isMuted ? 0 : 1;
        this.splashSound.play();
        this.animateOnce(ImageHub.salsa.splash, 400, () => {
            this.isRemovable = true; 
        });
    }
    //#endregion
}