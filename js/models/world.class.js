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
        this.bottles.push (new Bottles(1100, 350));
        this.bottles.push (new Bottles(1650, 350));
        this.bottles.push (new Bottles(800, 350));
        this.bottles.push (new Bottles(650, 350));
         this.bottles.push (new Bottles(1000, 350));
    }

    run() {
        setInterval(() => {

            this.checkCollisions();
            this.checkThrowObjects();
            this.checkBottleCollisions();
            this.checkCoinCollisions(); //Prüft, ob der Charakter Coins berührt. 
        }, 200);
    }

    checkThrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);

            }
        })
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
            if(this.character.isColliding(bottle)) {
                this.coins.splice(index, 1);
                this.StatusBarBottles.setPercentage(this.StatusBarBottles.percentage + 20);
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
        mo.drawFrame(this.ctx);


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