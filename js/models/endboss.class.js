class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;
    speed = 1;
    energy = 100;





    currentAnimation = null;
    hadFirstContact = false;
    world;
    endbossX = 2500;
    movingRight = false;

    animationInterval = null;
    movementInterval = null;
    attackInterval = null;

    constructor() {
        super().loadImage('img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadImages(ImageHub.endBoss.IMAGES_WALKING);
        this.loadImages(ImageHub.endBoss.IMAGES_ALERT);
        this.loadImages(ImageHub.endBoss.IMAGES_ATTACK);
        this.loadImages(ImageHub.endBoss.IMAGES_HURT);
        this.loadImages(ImageHub.endBoss.IMAGES_DEAD);
        this.x = this.endbossX;
        this.applyGravity();
        this.startEndbossBehavior();
    }

    isDead() {
        return this.energy <= 0;
    }


   startEndbossBehavior() {
    this.animationInterval = setStoppableInterval(() => {

        if (this.isDead()) {
           
            this.animateOnce(ImageHub.endBoss.IMAGES_DEAD, 3000, () => {
                this.stopAllEndbossIntervals();

               
                setTimeout(() => {
                    showYouWinScreen();
                }, 500);
            });

        } else if (this.isHurt() && this.currentAnimation !== ImageHub.endBoss.IMAGES_HURT) {
            this.animateOnce(ImageHub.endBoss.IMAGES_HURT, 400);

            setTimeout(() => {
                if (this.currentAnimation === ImageHub.endBoss.IMAGES_HURT) {
                    this.currentAnimation = null;
                }
            }, 450);

        } else if (
            this.hadFirstContact &&
            (!this.currentAnimation ||
                this.currentAnimation === ImageHub.endBoss.IMAGES_WALKING ||
                this.currentAnimation === ImageHub.endBoss.IMAGES_ATTACK)
        ) {
            this.world.showEndbossHealthBar();
            const characterX = this.world.character.x;
            const attackRange = 300;

            if (Math.abs(characterX - this.x) < attackRange) {
                this.animateLoop(ImageHub.endBoss.IMAGES_ATTACK);
                if (this.attackInterval === null) {
                    this.attackInterval = setStoppableInterval(() => {
                        if (this.world.character.isColliding(this)) {
                            this.world.character.hit();
                            this.world.statusBar.setPercentage(this.world.character.energy);
                        }
                    }, 1000);
                }
            } else {
                if (this.attackInterval !== null) {
                    clearInterval(this.attackInterval);
                    this.attackInterval = null;
                }
                this.animateLoop(ImageHub.endBoss.IMAGES_WALKING);
            }

            if (!this.isAboveGround() && Math.random() < 0.02) {
                this.jump();
            }
        } else if (!this.hadFirstContact && this.currentAnimation === null) {
            this.animateLoop(ImageHub.endBoss.IMAGES_ALERT);
        }
    }, 1000 / 10);

    this.movementInterval = setStoppableInterval(() => {
        if (!this.isDead() && this.hadFirstContact) {
            if (this.movingRight) {
                this.x += this.speed;
                this.otherDirection = true;
                if (this.x > this.endbossX) {
                    this.movingRight = false;
                }
            } else {
                this.x -= this.speed;
                this.otherDirection = false;
                if (this.x < this.endbossX - 500) {
                    this.movingRight = true;
                }
            }
        }
    }, 1000 / 60);
}


    stopAllEndbossIntervals() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
        if (this.attackInterval) {
            clearInterval(this.attackInterval);
            this.attackInterval = null;
        }
    }

    hitByBottle() {
        this.energy -= 20;
        if (this.energy <= 0) {
            this.energy = 0;
           
        } else {
            this.lastHit = new Date().getTime();
        }
    }



    hit() {
        this.energy -= 20;
        if (this.energy <= 0) {
            this.energy = 0;
           
        } else {
            this.lastHit = new Date().getTime();
        }
    }

}