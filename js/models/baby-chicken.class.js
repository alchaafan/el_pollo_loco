class BabyChicken extends MovableObject {
    height =75;
    width = 75;
    y = 350;
    speed = 0.5;

  

    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    constructor() {
         super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(ImageHub.babyChicken.IMAGES_WALKING);
        this.loadImages(ImageHub.babyChicken.IMAGES_DEAD);
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
                this.animateOnce(ImageHub.babyChicken.IMAGES_DEAD);
                this.isRemovable = true;
            } else {
                this.animateLoop(ImageHub.babyChicken.IMAGES_WALKING);
            }
        }, 150); // Animationsgeschwindigkeit
    }
}
