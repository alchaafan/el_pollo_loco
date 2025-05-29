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


     constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.addCoins();
        this.addBottles();
        //this.draw();
        this.setWorld();
        this.statusBarEndboss = new StatusBarEndboss();
        this.run();
        this.endboss = this.level.enemies.find(e => e instanceof Endboss); //
        if (this.endboss) {
            this.endboss.world = this; //
        }
        this.draw();

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
            this.checkBottleEndbossCollisions(); 

            // Aktualisiere die Endboss-Statusleiste
           if (this.endboss && this.endboss.hadFirstContact) {
                this.statusBarEndboss.setPercentage(this.endboss.energy);
            }
        }, 100);
    }

     checkEndbossContact() {
        if (this.endboss && !this.endboss.hadFirstContact) {
            // Definiere die Linie, bei der der Endboss aktiv wird
            const activationLine = 2000; // Beispiel: X-Koordinate 2000
            if (this.character.x + this.character.width > activationLine) {
                this.endboss.hadFirstContact = true;
               
            }
        }
    }

    // Eine Methode, um die Endboss-Lebensleiste anzuzeigen
    showEndbossHealthBar() {
        if (this.endboss && this.endboss.hadFirstContact) {
            this.statusBarEndboss.draw(this.ctx); // Zeichne die Statusleiste
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

        // Endboss Kollision und Angriff
        if (this.endboss && !this.character.isDead() && !this.endboss.isDead()) {
            if (this.character.isColliding(this.endboss) && this.endboss.currentAnimation === this.endboss.IMAGES_ATTACK) {
                // Sie könnten eine Abklingzeit für Endboss-Angriffe oder einen bestimmten Punkt in der Animation wünschen
                if (!this.character.isHurt()) {
                    this.character.hit(); // Oder eine spezifische 'endbossHit'-Methode
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        }
    }

    checkBottleEndbossCollisions() {
        if (this.endboss && !this.endboss.isDead()) {
            this.throwableObjects.forEach((bottle, bottleIndex) => {
                if (bottle.isColliding(this.endboss)) {
                    this.endboss.hitByBottle();
                    this.throwableObjects.splice(bottleIndex, 1);
                    // Die StatusBar des Endbosses wird bereits in der `run()` Methode aktualisiert.
                    // Du könntest sie hier auch explizit setzen, aber es ist nicht unbedingt nötig,
                    // da `run` sehr schnell darauf reagiert.
                    // this.statusBarEndboss.setPercentage(this.endboss.energy);
                }
            });
        }
    }

    // Neue Methode zum Entfernen von toten Feinden
      removeDeadEnemies() {
        // Filtere alle Feinde heraus, die als entfernbar markiert sind
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.isRemovable);

        // Überprüfe explizit, ob der Endboss entfernt wurde und setze seine Referenz auf null
        // Dies ist wichtig, da this.endboss eine direkte Referenz ist und nicht automatisch gelöscht wird.
        if (this.endboss && this.endboss.isRemovable && !this.level.enemies.includes(this.endboss)) {
             this.endboss = null;
            
        }
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
        //this.addToMap(this.statusBarEndboss);
        this.addToMap(this.StatusBarBottles);
         if (this.endboss && this.endboss.hadFirstContact) {
             this.addToMap(this.statusBarEndboss);
        }
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
    // Nur Spiegellogik anwenden, wenn das Objekt eine MovableObject-Instanz ist und otherDirection hat
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
        if (this.character.isAboveGround() && this.character.speedY < 0) { // Pepe springt von oben auf den Gegner
            this.handleStompEnemy(enemy, index);
        } else if (!this.character.isAboveGround()) { // Pepe kollidiert seitlich oder von unten mit dem Gegner
            let damage = (enemy instanceof Endboss) ? 20 : 10;
            this.character.hit(damage);
            this.healthbar.setPercentage(this.character.energy);

            // NEUE LOGIK: Wenn der Endboss getroffen wird, stoßen wir Pepe zurück
            if (enemy instanceof Endboss) {
                this.knockbackCharacter(this.character, enemy); // Hier rufen wir die neue Funktion auf
            }
        }
    }

     knockbackCharacter(character, enemy) {
        const knockbackDistance = 50; // Sie können diesen Wert anpassen
        if (character.x < enemy.x) { // Pepe ist links vom Gegner
            character.x -= knockbackDistance;
        } else { // Pepe ist rechts vom Gegner
            character.x += knockbackDistance;
        }
    }
}