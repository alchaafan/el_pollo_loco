class Chicken extends MovableObject {
    y = 360;
    height = 70;
    width = 130;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];


    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);

        this.x = 1000 + Math.random() * 500; //Zahl zwischen 200 und 700
        this.speed = 0.04 + Math.random() * 0.5;

        this.animate();
    }


    animate() {

        //die Hühnchen bewegen sich, erst wenn das Spiel startet
        setInterval(() => {
            if (gameStarted) {
                this.moveLeft();

                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

}