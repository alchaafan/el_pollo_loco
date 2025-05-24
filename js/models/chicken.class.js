class Chicken extends MovableObject {
    y = 360;
    height = 70;
    width = 130;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

     IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 1000 + Math.random() * 500; //Zahl zwischen 200 und 700
        this.speed = 0.01 + Math.random() * 0.03;
        this.applyGravity();
        this.animate();
    }

    hit() {
        this.energy = 0;
    }


    animate() {
        
        setInterval(() => {
            if (gameStarted && !this.isDead()) { 
                this.moveLeft();
            }
        }, 1000 / 60); 

        
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD); // Zeige das tote Bild an
                 this.speed = 0;
            } else {
                this.animateLoop(this.IMAGES_WALKING); // Spiele die Laufanimation ab
            }
        }, 200); // Animationsgeschwindigkeit für Laufen
    }

}