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
    endboss = this.level.enemies.find(e => e instanceof Endboss);


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.addCoins();
        this.addBottles();
        this.draw();
        this.setWorld();
        this.run();

    }

    setWorld() {
        this.character.world = this;
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
            this.checkCoinCollisions(); //Prüft, ob der Charakter Coins berührt.
            this.removeDeadEnemies(); // Füge diese Methode hinzu, um tote Hühner zu entfernen
            this.checkEndbossContact();
        }, 100);
    }

    checkEndbossContact() {
        if(this.endboss && !this.endboss.hadFirstContact) {
            const contactDistance = 500;
            if(this.character.x + this.character.width > this.endboss.x - contactDistance) {
                this.endboss.hadFirstContact = true;
                console.log('Endboss hat den ersten Kontakt'); // Später für Soundabspielen
            }
        }
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.StatusBarBottles.percentage > 0) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.StatusBarBottles.setPercentage(Math.max(0, this.StatusBarBottles.percentage - 20));//Flaschenzahl reduzieren
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
    }

    // Neue Methode zum Entfernen von toten Feinden
    removeDeadEnemies() {
        // Filtere alle Feinde heraus, die als entfernbar markiert sind
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.isRemovable);
    }


    checkCoinCollisions() {
        this.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.coins.splice(index, 1); // entfernt Coin aus dem Array
                this.statusBarCoins.setPercentage(this.statusBarCoins.percentage + 20);
            }
        });
    }

    checkBottleCollisions() {
        this.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.bottles.splice(index, 1);
                this.StatusBarBottles.setPercentage(Math.min(100, this.StatusBarBottles.percentage + 20));
            }
        })
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottles);// coins zum Spiel hinzufügen
        this.ctx.translate(-this.camera_x, 0);
        // -------------- Space for fixed objects -------------
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoins); // Coins Statusbar zeichnen
        this.addToMap(this.StatusBarBottles);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);

        //draw() wird immer wieder aufgerufen
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
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);


        if (mo.otherDirection) {
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
}