class ThrowableObject extends MovableObject {

    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    isSplashed = false;
    throwDirection = 1; // 1 für rechts, -1 für links
    splashSound = new Audio('audio/tomato.mp3');

    constructor(x, y, otherDirection) { 
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);

        // Blickrichtung speichern
        if (otherDirection) { 
            this.throwDirection = -1;
        } else { 
            this.throwDirection = 1;
        }

        this.throw();
    }

    throw() {
        this.speedY = 30;
        this.applyGravity();
        setStoppableInterval(() => {
            if (!this.isSplashed) { 
                this.x += (10 * this.throwDirection); 
                this.animateLoop(this.IMAGES_ROTATION); 
            }
        }, 25);
    }

    splash() {
        this.isSplashed = true; 
        this.speedY = 0; // Vertikale Bewegung stoppen
        this.speed = 0; // Horizontale Bewegung stoppen 
        this.splashSound.play();
        this.animateOnce(this.IMAGES_SPLASH, 400, () => {
            this.isRemovable = true; 
        });
    }
}