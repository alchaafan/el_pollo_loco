class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;
    speed = 1; // Diesen Wert kannst du hier anpassen, um die Grundgeschwindigkeit zu ändern.
    energy = 100;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ]

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    currentAnimation = null;
    hadFirstContact = false;
    world;
    endbossX = 2500;
    movingRight = false;

    // Speichere IDs der Intervalle, um sie sauber zu stoppen
    animationInterval = null;
    movementInterval = null;
    attackInterval = null;


    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = this.endbossX;
        this.applyGravity(); // Dies ruft setStoppableInterval für die Gravitation auf
        this.startEndbossBehavior(); // Eine neue Methode, die alle Endboss-Intervalle initialisiert
    }

    // Neue Methode, die alle primären Endboss-Intervalle startet
    startEndbossBehavior() {
        this.animationInterval = setStoppableInterval(() => {
            if (this.isDead()) {
                this.animateOnce(this.IMAGES_DEAD, 500); // Animation für Tod abspielen
                this.stopAllEndbossIntervals(); // Alle Intervalle stoppen, wenn er tot ist
                this.isRemovable = true; // Jetzt ist er entfernbar
            } else if (this.isHurt()) {
                this.animateOnce(this.IMAGES_HURT);
            } else if (this.hadFirstContact) {
                this.world.showEndbossHealthBar(); // Zeige Lebensleiste, wenn in Kontakt

                const characterX = this.world.character.x;
                const attackRange = 300;

                // Angriffslogik
                if (Math.abs(characterX - this.x) < attackRange) {
                    this.animateLoop(this.IMAGES_ATTACK);
                    if (this.attackInterval === null) { // Stelle sicher, dass nur ein Angriffsintervall läuft
                        this.attackInterval = setStoppableInterval(() => {
                          
                            if (this.world.character.isColliding(this)) {
                                this.world.character.hit();
                                this.world.statusBar.setPercentage(this.world.character.energy);
                            }
                        }, 1000);
                    }
                } else {
                    if (this.attackInterval !== null) { // Angriffsintervall stoppen, wenn nicht im Angriffsradius
                        clearInterval(this.attackInterval);
                        this.attackInterval = null;
                    }
                    this.animateLoop(this.IMAGES_WALKING); // Wenn nicht im Angriff, dann laufen
                }

                // Springlogik (zufällig, wenn nicht in der Luft)
                if (!this.isAboveGround() && Math.random() < 0.02) { // jumpProbability fest hier
                    this.jump();
                }

            } else {
                this.animateLoop(this.IMAGES_ALERT); // Alarm-Animation, wenn noch kein Kontakt
            }
        }, 1000 / 10); // Animations-Intervall für Bildwechsel (z.B. 10 FPS)


        // Starte das Bewegungsintervall nur einmal
        this.movementInterval = setStoppableInterval(() => {
            if (!this.isDead() && this.hadFirstContact) { // Bewege nur, wenn lebendig und in Kontakt
                if (this.movingRight) {
                    this.x += this.speed;
                    this.otherDirection = true;
                    if (this.x > this.endbossX) { // Begrenze die Bewegung nach rechts
                        this.movingRight = false;
                    }
                } else {
                    this.x -= this.speed;
                    this.otherDirection = false;
                    if (this.x < this.endbossX - 500) { // Begrenze die Bewegung nach links
                        this.movingRight = true;
                    }
                }
            }
        }, 1000 / 60); // Bewegungs-Intervall (z.B. 60 FPS für flüssige Bewegung)
    }

    // Hilfsmethode, um alle Intervalle des Endbosses zu stoppen
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


    hit() {
        this.energy -= 20; // Mehr Schaden bei Treffern (z.B. Draufspringen)
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    hitByBottle() {
        this.energy -= 20; // Flaschen verursachen Schaden (Beispiel: 20 Energiepunkte)
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
        
    }
}