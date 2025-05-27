class BabyChicken extends MovableObject {
    height =75;
    width = 75;
    y = 350;
    speed = 0.5;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ]

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ]

    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    constructor() {
         super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 1200 + Math.random() * 500; //Zufällige Startposition
        this.animate();
        this.applyGravity();
    }

     hit() {
        this.energy = 0;
        this.speed = 0; // Huhn stoppt sich zu bewegen, sobald es getroffen wird
        this.currentImage = 0;
        this.animationFinishTime = 0;
    }

    animate() {
        setStoppableInterval(() => {
            if (!this.isDead()) {
                this.x -= this.speed;
            }
        }, 1000 / 60);

        setStoppableInterval(() => {
            if (this.isDead()) {
                this.animateOnce(this.IMAGES_DEAD);
                this.isRemovable = true;
            } else {
                this.animateLoop(this.IMAGES_WALKING);
            }
        }, 150); // Animationsgeschwindigkeit
    }
}
