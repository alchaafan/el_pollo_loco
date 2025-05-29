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
        this.setWorld();
        this.statusBarEndboss = new StatusBarEndboss();
        this.run();
        this.endboss = this.level.enemies.find(e => e instanceof Endboss); // Den Endboss im Level finden
        if (this.endboss) {
            this.endboss.world = this; // Diese Welt dem Endboss zuweisen
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

    /**
     * Hauptspielschleife, überprüft Kollisionen und aktualisiert den Spielstatus.
     */
    run() {
        setStoppableInterval(() => {

            this.checkCollisions();
            this.checkThrowObjects();
            this.checkBottleCollisions();
            this.checkCoinCollisions(); // Prüft, ob der Charakter Coins berührt.
            this.removeDeadEnemies(); // Füge diese Methode hinzu, um tote Hühner zu entfernen
            this.checkEndbossContact();
            this.checkBottleEndbossCollisions();

            // Aktualisiere die Endboss-Statusleiste
            if (this.endboss && this.endboss.hadFirstContact) {
                this.statusBarEndboss.setPercentage(this.endboss.energy);
            }
        }, 100);
    }

    /**
     * Überprüft, ob der Charakter den ersten Kontakt mit dem Endboss hatte.
     */
    checkEndbossContact() {
        if (this.endboss && !this.endboss.hadFirstContact) {
            // Definiere die Linie, bei der der Endboss aktiv wird
            const activationLine = 2000; // Beispiel: X-Koordinate 2000
            if (this.character.x + this.character.width > activationLine) {
                this.endboss.hadFirstContact = true;
            }
        }
    }

    /**
     * Zeigt die Lebensleiste des Endbosses an, wenn Kontakt hergestellt wurde.
     */
    showEndbossHealthBar() {
        if (this.endboss && this.endboss.hadFirstContact) {
            this.statusBarEndboss.draw(this.ctx); // Zeichne die Statusleiste
        }
    }

    /**
     * Handhabt das Werfen von Objekten (Flaschen), wenn die Taste 'D' gedrückt wird.
     */
    checkThrowObjects() {
        if (this.keyboard.D && this.StatusBarBottles.percentage > 0) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.StatusBarBottles.setPercentage(Math.max(0, this.StatusBarBottles.percentage - 20)); // Flaschenzahl reduzieren
        }
    }

    /**
     * Überprüft Kollisionen zwischen dem Charakter und Feinden.
     */
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

    /**
     * Überprüft Kollisionen zwischen geworfenen Flaschen und dem Endboss.
     */
    checkBottleEndbossCollisions() {
        if (this.endboss && !this.endboss.isDead()) {
            this.throwableObjects.forEach((bottle, bottleIndex) => {
                if (bottle.isColliding(this.endboss) && !bottle.isSplashed) { // Überprüfen, ob die Flasche nicht bereits gespritzt ist
                    this.endboss.hitByBottle();
                    bottle.splash(); // Spritzanimation abspielen
                    // Die StatusBar des Endbosses wird bereits in der `run()` Methode aktualisiert.
                    // Du könntest sie hier auch explizit setzen, aber es ist nicht unbedingt nötig,
                    // da `run` sehr schnell darauf reagiert.
                    // this.statusBarEndboss.setPercentage(this.endboss.energy);
                }
            });
        }
        // Flaschen herausfiltern, die gespritzt sind und zur Entfernung markiert wurden
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.isRemovable);
    }

    /**
     * Entfernt tote Feinde aus dem Level.
     */
    removeDeadEnemies() {
        // Filtere alle Feinde heraus, die als entfernbar markiert sind
        this.level.enemies = this.level.enemies.filter(enemy => !enemy.isRemovable);

        // Überprüfe explizit, ob der Endboss entfernt wurde und setze seine Referenz auf null
        // Dies ist wichtig, da this.endboss eine direkte Referenz ist und nicht automatisch gelöscht wird.
        if (this.endboss && this.endboss.isRemovable && !this.level.enemies.includes(this.endboss)) {
            this.endboss = null;
        }
    }


    /**
     * Überprüft Kollisionen zwischen dem Charakter und Münzen.
     */
    checkCoinCollisions() {
        this.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.coins.splice(index, 1); // entfernt Coin aus dem Array
                this.statusBarCoins.setPercentage(this.statusBarCoins.percentage + 20);
            }
        });
    }

    /**
     * Überprüft Kollisionen zwischen dem Charakter und Flaschen.
     */
    checkBottleCollisions() {
        this.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.bottles.splice(index, 1);
                this.StatusBarBottles.setPercentage(Math.min(100, this.StatusBarBottles.percentage + 20));
            }
        })
    }


    /**
     * Zeichnet alle Spielobjekte auf den Canvas.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Den Canvas leeren
        this.ctx.translate(this.camera_x, 0); // Kamera-Translation anwenden

        // Hintergrundobjekte, Charakter, Münzen und Flaschen hinzufügen
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottles);

        this.ctx.translate(-this.camera_x, 0); // Kamera-Translation für feste Objekte zurücksetzen

        // Feste Objekte (Statusleisten) hinzufügen
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoins); // Münz-Statusleiste zeichnen
        this.addToMap(this.StatusBarBottles);
        if (this.endboss && this.endboss.hadFirstContact) {
            this.addToMap(this.statusBarEndboss); // Endboss-Statusleiste zeichnen, wenn Kontakt hergestellt wurde
        }

        this.ctx.translate(this.camera_x, 0); // Kamera-Translation erneut anwenden

        // Wolken, Feinde und werfbare Objekte hinzufügen
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0); // Kamera-Translation zurücksetzen



        //draw() wird immer wieder aufgerufen
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });

    }

    /**
     * Fügt ein Array von Objekten zur Karte hinzu.
     * @param {Array<MovableObject>} objects - Das Array der hinzuzufügenden Objekte.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Fügt ein einzelnes bewegliches Objekt zur Karte hinzu und handhabt bei Bedarf das Spiegeln des Bildes.
     * @param {MovableObject} mo - Das hinzuzufügende bewegliche Objekt.
     */
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

    /**
     * Spiegelt das Bild eines beweglichen Objekts horizontal.
     * @param {MovableObject} mo - Das zu spiegelnde bewegliche Objekt.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Stellt das Bild eines beweglichen Objekts nach dem Spiegeln wieder her.
     * @param {MovableObject} mo - Das wiederherzustellende bewegliche Objekt.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Handhabt Kollisionen zwischen dem Charakter und Feinden.
     * @param {Enemy} enemy - Der an der Kollision beteiligte Feind.
     * @param {number} index - Der Index des Feindes im Feind-Array.
     */
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

    /**
     * Stößt den Charakter nach einer Kollision mit einem Feind zurück.
     * @param {Character} character - Das Charakterobjekt.
     * @param {Enemy} enemy - Das Feindobjekt.
     */
    knockbackCharacter(character, enemy) {
        const knockbackDistance = 50; 
        if (character.x < enemy.x) { 
            character.x -= knockbackDistance;
        } else { 
            character.x += knockbackDistance;
        }
    }
}
