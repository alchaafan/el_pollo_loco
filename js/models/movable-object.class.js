class MovableObject extends DrawableObject {

    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    animationFinishTime = 0;
    isRemovable = false;
    currentAnimation = null;


    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    GRAVITY_GROUND_Y = 440;


    applyGravity() {
         setStoppableInterval(() => { 
            if (!this.isDead()) {
                if (this.isAboveGround() || this.speedY > 0) {
                    this.y -= this.speedY;
                    this.speedY -= this.acceleration;
                } else {

                    this.y = this.GRAVITY_GROUND_Y - this.height;
                    this.speedY = 0;
                }
            } else if (this.isDead() && this.y < this.GRAVITY_GROUND_Y) {

                this.y += 5;
                this.speedY = 0;
                if (this.y >= this.GRAVITY_GROUND_Y) {
                    this.y = this.GRAVITY_GROUND_Y;
                }
            }
        }, 1000 / 25);
    }


    isAboveGround() {
        if (this instanceof ThrowableObject) { //throwable objekts soll always fall
            return true;
        } else {
            return this.y + this.height < this.GRAVITY_GROUND_Y;

        };
    }



    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Differenz in ms
        return timepassed < 500;
    }

    isDead() {
        return this.energy === 0;
    }



    playAnimation(images) {
        let path = images[this.currentImage];
        this.img = this.imageCache[path];
    }

     animateOnce(images, duration = 1000) {
        if (this.currentAnimation !== images) {
            this.currentAnimation = images;
            this.currentImage = 0;
            this.animationFinishTime = new Date().getTime() + duration;
        }

        this.playAnimation(images);

        if (new Date().getTime() < this.animationFinishTime) {
            if (images.length > 1 && this.currentImage < images.length - 1) {
                this.currentImage++;
            }
        } else {
            this.isRemovable = true;
            this.currentAnimation = null; 
            this.currentImage = images.length - 1; 
        }
    }

    animateLoop(images) {
        let i = this.currentImage % images.length;
        this.currentImage = i;
        this.playAnimation(images);
        this.currentImage++; 
    }


    moveRight() {
        console.log('Moving right')
    }

    moveLeft() {
        setStoppableInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60); 
    }

    jump() {
        this.speedY = 30;
    }
}