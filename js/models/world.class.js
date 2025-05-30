class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];
    coins = [];
    statusBarCoins = new StatusBarCoins();
    StatusBarBottles = new StatusBarBottles();
    bottles = [];
    statusBarEndboss;
    endboss;

    // Sounds
    throwSound = new Audio('audio/throw.mp3');
    coinsSound = new Audio('audio/coin.mp3');
    bottlesSound = new Audio('audio/bottle.mp3');
    chickenSound = new Audio('audio/chicken.wav');
    endbossSound = new Audio('audio/babyChicken.wav');
    endbossKilledSound = new Audio('audio/endboss-killed.mp3');


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.addCoins();
        this.addBottles();
        this.setWorld();
        this.statusBarEndboss = new StatusBarEndboss();
        this.run();
        this.endboss = this.level.enemies.find(e => e instanceof Endboss); 
        if (this.endboss) {
            this.endboss.world = this; 
        }
        this.draw(); // Die Zeichenschleife starten
    }


    setWorld() {
        this.character.world = this; // Diese Welt dem Charakter zuweisen
    }

    addCoins() {
        this.coins.push(new Coins(800, 100)); // Position der coins x, y
        this.coins.push(new Coins(1500, 100));
        this.coins.push(new Coins(500, 100));
        this.coins.push(new Coins(1100, 100));
        this.coins.push(new Coins(700, 100));
        this.coins.push(new Coins(900, 100));
    }

    addBottles() {
        this.bottles.push(new Bottles(1100, 350));
        this.bottles.push(new Bottles(1650, 350));
        this.bottles.push(new Bottles(800, 350));
        this.bottles.push(new Bottles(650, 350));
        this.bottles.push(new Bottles(1000, 350));
    }

  
    run() {
        setStoppableInterval(() => {

            this.checkCollisions();
            this.checkThrowObjects();
            this.checkBottleCollisions();
            this.checkCoinCollisions(); 
            this.removeDeadEnemies(); 
            this.checkEndbossContact();
            this.checkBottleEndbossCollisions();
            if (this.endboss && this.endboss.hadFirstContact) {
                this.statusBarEndboss.setPercentage(this.endboss.energy);
            }
        }, 100);
    }

 
    checkEndbossContact() {
        if (this.endboss && !this.endboss.hadFirstContact) {
            const activationLine = 2000; 
            if (this.character.x + this.character.width > activationLine) {
                this.endboss.hadFirstContact = true;
            }
        }
    }

 
    showEndbossHealthBar() {
        if (this.endboss && this.endboss.hadFirstContact) {
            this.statusBarEndboss.draw(this.ctx); 
        }
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.StatusBarBottles.percentage > 0) {
            let bottleX;
            if (this.character.otherDirection) { // Wenn der Charakter nach links schaut
                bottleX = this.character.x - 40; // Startpunkt links vom Charakter
            } else { // Wenn der Charakter nach rechts schaut
                bottleX = this.character.x + 100; // Startpunkt rechts vom Charakter
            }

            let bottle = new ThrowableObject(bottleX, this.character.y + 100, this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.StatusBarBottles.setPercentage(Math.max(0, this.StatusBarBottles.percentage - 20)); // Reduziere die Flaschenanzahl
            this.throwSound.play(); // Sound abspielen wenn die Flasche geworfen wird
        }
    }

 
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {

            if (!this.character.isDead() && !enemy.isDead() && this.character.isColliding(enemy)) {

                if (this.character.speedY < 0 &&
                    (this.character.y + this.character.height - this.character.offset.bottom) < (enemy.y + enemy.height - enemy.offset.bottom)
                ) {
                    if (enemy instanceof Chicken || enemy instanceof BabyChicken) {
                        enemy.hit(); // Das Huhn stirbt
                        this.chickenSound.play();

                        this.character.jump(15); // Kleinerer Sprung als normal
                    }
                } else {

                    if (!this.character.isHurt()) {
                        this.character.hit();
                        this.statusBar.setPercentage(this.character.energy);
                    }
                }
            }
        });

        // Endboss Kollision und Angriff
        if (this.endboss && !this.character.isDead() && !this.endboss.isDead()) {
            if (this.character.isColliding(this.endboss) && this.endboss.currentAnimation === this.endboss.IMAGES_ATTACK) {
             
                if (!this.character.isHurt()) {
                    this.character.hit(); 
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        }
    }


    checkBottleEndbossCollisions() {
        if (this.endboss && !this.endboss.isDead()) {
            this.throwableObjects.forEach((bottle, bottleIndex) => {
                if (bottle.isColliding(this.endboss) && !bottle.isSplashed) { 
                    this.endboss.hitByBottle();
                    bottle.splash(); 
                    this.endbossSound.play();
                 
                }
            });
        }
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.isRemovable);
    }

 
    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.isRemovable);

        if (this.endboss && this.endboss.isRemovable && !this.level.enemies.includes(this.endboss)) {
            this.endboss = null;
            this.endbossKilledSound.play();
        }
    }


    checkCoinCollisions() {
        this.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.coins.splice(index, 1); // entfernt Coin aus dem Array
                this.statusBarCoins.setPercentage(this.statusBarCoins.percentage + 20);
                 this.coinsSound.play();
            }
        });
       
    }

  
    checkBottleCollisions() {
        this.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.bottles.splice(index, 1);
                this.StatusBarBottles.setPercentage(Math.min(100, this.StatusBarBottles.percentage + 20));
                this.bottlesSound.play();
            }
        })
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
        this.ctx.translate(this.camera_x, 0); 
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottles);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoins); 
        this.addToMap(this.StatusBarBottles);
        if (this.endboss && this.endboss.hadFirstContact) {
            this.addToMap(this.statusBarEndboss);
        }

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0); 

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });

    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

  
    addToMap(mo) {
        if (mo instanceof MovableObject && mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx); 

        if (mo instanceof MovableObject && mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save(); 
        this.ctx.translate(mo.width, 0); 
        this.ctx.scale(-1, 1); 
        mo.x = mo.x * -1; 
    }

   
    flipImageBack(mo) {
        mo.x = mo.x * -1; 
        this.ctx.restore(); 
    }


    handleEnemyCollision(enemy, index) {
        if (this.character.isAboveGround() && this.character.speedY < 0) {
            this.handleStompEnemy(enemy, index);
        } else if (!this.character.isAboveGround()) {
            let damage = (enemy instanceof Endboss) ? 20 : 10;
            this.character.hit(damage);
            this.healthbar.setPercentage(this.character.energy);

            if (enemy instanceof Endboss) {
                this.knockbackCharacter(this.character, enemy); 
            }
        }
    }

   
    knockbackCharacter(character, enemy) {
        const knockbackDistance = 50; 
        if (character.x < enemy.x) { 
            character.x -= knockbackDistance;
        } else {
            character.x += knockbackDistance;
        }
    }
}