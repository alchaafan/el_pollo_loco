class Character extends MovableObject {
    height = 280;
    y = 160;
    speed = 10;

    offset = {
        top: 100, 
        bottom: 15,
        left: 30,
        right: 30
    };



    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'

    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'


    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'

    ];

    IMAGES_LONGIDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];


    world;
    lastActionTime = 0;



    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONGIDLE);
        this.applyGravity();
        this.animate();
        this.currentAnimation = null;
        this.lastActionTime = new Date().getTime();
    }

    animate() {

        //Intervall für Bewegung und Kamera
            setInterval(() => {
           
            if (!this.isDead()) {
                let moved = false;

                if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                    this.x += this.speed;
                    this.otherDirection = false;
                    moved = true;
                }
                if (this.world.keyboard.LEFT && this.x > 0) {
                    this.x -= this.speed;
                    this.otherDirection = true;
                    moved = true;
                }

                if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                    this.jump();
                    moved = true;
                }

                if (moved) {
                    this.lastActionTime = new Date().getTime();
                }
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            let nextAnimation = null;
            let timepassedSinceLastAction = new Date().getTime() - this.lastActionTime;

            if (this.isDead()) {
                nextAnimation = this.IMAGES_DEAD;
                this.speed = 0;
                this.speedY = 0;


            } else if (this.isHurt()) {
                nextAnimation = this.IMAGES_HURT;
                this.lastActionTime = new Date().getTime();

            } else if (this.isAboveGround()) {
                nextAnimation = this.IMAGES_JUMPING;
                this.lastActionTime = new Date().getTime();

            } else {


                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {

                    //walk animation
                    nextAnimation = this.IMAGES_WALKING;
                } else {
                    if (timepassedSinceLastAction > 15000) {
                        nextAnimation = this.IMAGES_LONGIDLE;
                    } else {
                        nextAnimation = this.IMAGES_IDLE;
                    }
                }


            }
            if (nextAnimation) {
                if (nextAnimation !== this.currentAnimation) {
                    this.currentImage = 0; // Index zurücksetzen für neue Animation
                    this.currentAnimation = nextAnimation;
                }

                // Hier entscheiden wir, ob die Animation einmalig oder in Schleife abgespielt wird
                if (this.currentAnimation === this.IMAGES_DEAD || this.currentAnimation === this.IMAGES_HURT) {
                    this.animateOnce(this.currentAnimation); // Einmalige Animation
                } else {
                    this.animateLoop(this.currentAnimation); // Schleifen-Animation
                }
            }
        }, 50);

    }


    jump() {
        this.speedY = 30;
    }
}