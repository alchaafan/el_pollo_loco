class Chicken extends MovableObject {
   
    y = 360;
    height = 70;
    width = 130;
   
//#region contructor
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(ImageHub.chicken.IMAGES_WALKING);
        this.loadImages(ImageHub.chicken.IMAGES_DEAD);
        this.x = 1000 + Math.random() * 500; //Zahl zwischen 200 und 700
        this.speed = 0.01 + Math.random() * 0.03;
        this.applyGravity();
        this.animate();
    }
    //#region 


//#region methods
    hit() {
        this.energy = 0;
        this.speed = 0; // Huhn stoppt sich zu bewegen, sobald es getroffen wird
        this.currentImage = 0;
        this.animationFinishTime = 0;
    }

    animate() {
        // Intervall für die Bewegung des Huhns 
        setStoppableInterval(() => {
            if (gameStarted && !this.isDead()) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setStoppableInterval(() => {
            if (this.isDead()) {
                this.animateOnce(ImageHub.chicken.IMAGES_DEAD, 1000); // Spiele die Sterbeanimation für 1 Sekunde ab
            } else {
                this.animateLoop(ImageHub.chicken.IMAGES_WALKING);
            }
        }, 200); // Animationsgeschwindigkeit für Laufen
    }
//#region 
}