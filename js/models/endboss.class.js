class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;
    speed = 5;
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
    attackInterval = 0;


    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = this.endbossX;
        this.applyGravity();
        this.animate();
    }


    animate() {
        setStoppableInterval(() => { //
            if (this.isDead()) { //
                this.animateOnce(this.IMAGES_DEAD); //
                clearInterval(this.attackInterval); // Den Angriffsintervall stoppen, wenn tot
            } else if (this.isHurt()) { //
                this.animateOnce(this.IMAGES_HURT); //
            } else if (this.hadFirstContact) { //
                this.world.showEndbossHealthBar(); //

                const characterX = this.world.character.x;
                const attackRange = 300;
                const jumpProbability = 0.02; // 2% Chance zu springen pro Animationsframe

                // Bewegung vor und zurück
                if (this.movingRight) { //
                    this.x += this.speed; //
                    this.otherDirection = true; //
                    if (this.x > this.endbossX) { //
                        this.movingRight = false; //
                    }
                } else { //
                    this.x -= this.speed; //
                    this.otherDirection = false; //
                    if (this.x < this.endbossX - 500) { //
                        this.movingRight = true; //
                    }
                }

                // Angriffslogik
                if (Math.abs(characterX - this.x) < attackRange) {
                    this.animateLoop(this.IMAGES_ATTACK); //
                    if (!this.attackInterval) {
                        this.attackInterval = setStoppableInterval(() => { //
                            console.log('Endboss greift an!');
                           // Hier können Sie Logik hinzufügen, um dem Charakter Schaden zuzufügen
                          
                            if (this.world.character.isColliding(this)) {
                                this.world.character.hit();
                                this.world.statusBar.setPercentage(this.world.character.energy);
                            }
                        }, 1000); // Angreift alle 1 Sekunde
                    }
                } else {
                    clearInterval(this.attackInterval); // Angriffsintervall stoppen
                    this.attackInterval = null;
                    this.animateLoop(this.IMAGES_WALKING); //
                }

                // Springlogik (zufällig, wenn nicht in der Luft)
                if (!this.isAboveGround() && Math.random() < jumpProbability) { //
                    this.jump(); //
                }

            } else {
                this.animateLoop(this.IMAGES_ALERT); //
            }
        }, 1000 / 10);
    }

    hit() {
        this.energy -= 20; // Mehr Schaden bei Treffern
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

}