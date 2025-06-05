class Character extends MovableObject {
    //#region attributes
    height = 280;
    y = 160;
    speed = 10;

    offset = {
        top: 100,
        bottom: 15,
        left: 30,
        right: 30
    };

    world;
    lastActionTime = 0;
    jumpSound = new Audio('audio/jump.mp3');
    hurtSound = new Audio('audio/hurt.mp3');
    deadSound = new Audio('audio/dead.mp3');
    walkSound = new Audio('audio/walk.mp3');
    snoreSound = new Audio('audio/snore.mp3');
  //#region 

  //#region constructor
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(ImageHub.Character.IMAGES_WALKING);
        this.loadImages(ImageHub.Character.IMAGES_JUMPING);
        this.loadImages(ImageHub.Character.IMAGES_DEAD);
        this.loadImages(ImageHub.Character.IMAGES_HURT);
        this.loadImages(ImageHub.Character.IMAGES_IDLE);
        this.loadImages(ImageHub.Character.IMAGES_LONGIDLE);
        this.applyGravity();
        this.animate();
        // this.gameStopped() = false;
        this.currentAnimation = null;
        this.lastActionTime = new Date().getTime();
    }
    //#region 

    //#region mothods
    animate() {

        //Intervall für Bewegung und Kamera
        setStoppableInterval(() => {

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

        setStoppableInterval(() => {
            let nextAnimation = null;
            let timepassedSinceLastAction = new Date().getTime() - this.lastActionTime;

            if (this.isDead()) {
                nextAnimation = ImageHub.Character.IMAGES_DEAD;
                this.speed = 0;
                this.speedY = 0;
                this.deadSound.play();


            } else if (this.isHurt()) {
                nextAnimation = ImageHub.Character.IMAGES_HURT;
                this.lastActionTime = new Date().getTime();
                this.hurtSound.play();

            } else if (this.isAboveGround()) {
                nextAnimation = ImageHub.Character.IMAGES_JUMPING;
                this.lastActionTime = new Date().getTime();

            } else {


                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {

                    //walk animation
                    nextAnimation = ImageHub.Character.IMAGES_WALKING;
                    this.walkSound.play();
                } else {
                    if (timepassedSinceLastAction > 15000) {
                        nextAnimation = ImageHub.Character.IMAGES_LONGIDLE;
                        this.snoreSound.play();
                        this.snoreSound.volume = 0.1;
                        
                    } else {
                        nextAnimation = ImageHub.Character.IMAGES_IDLE;
                    }
                }


            }
            if (nextAnimation) {
                if (nextAnimation !== this.currentAnimation) {
                    this.currentImage = 0; // Index zurücksetzen für neue Animation
                    this.currentAnimation = nextAnimation;
                }

               
                if (this.currentAnimation === ImageHub.Character.IMAGES_DEAD || this.currentAnimation === ImageHub.Character.IMAGES_HURT) {
                    this.animateOnce(this.currentAnimation);
                } else {
                    this.animateLoop(this.currentAnimation);
                }
            }
        }, 50);

    }


    jump() {
        this.speedY = 30;
        this.jumpSound.play();
    }
    //#region 
}