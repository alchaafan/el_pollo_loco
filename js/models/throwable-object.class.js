class ThrowableObject extends MovableObject {

    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    isSplashed = false;
    throwDirection = 1; // 1 für rechts, -1 für links

    constructor(x, y, otherDirection) { // Neuer Parameter 'otherDirection'
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);

        // Blickrichtung speichern
        if (otherDirection) { // Wenn otherDirection true ist, schaut der Charakter nach links
            this.throwDirection = -1;
        } else { // Ansonsten schaut er nach rechts
            this.throwDirection = 1;
        }

        this.throw();
    }

    /**
     * Leitet die Wurfaktion der Flasche ein.
     * Wendet die Schwerkraft an und richtet die horizontale Bewegung und die Rotationsanimation ein.
     */
    throw() {
        this.speedY = 30; // Anfängliche Aufwärtsgeschwindigkeit für den Wurf
        this.applyGravity(); // Schwerkraft anwenden, damit die Flasche fällt

        // Intervall für horizontale Bewegung und Rotationsanimation
        setStoppableInterval(() => {
            if (!this.isSplashed) { // Nur bewegen und rotieren, wenn nicht gespritzt
                this.x += (10 * this.throwDirection); // Bewegung basierend auf Wurfrichtung
                this.animateLoop(this.IMAGES_ROTATION); // Rotationsanimation abspielen
            }
        }, 25);
    }

    /**
     * Löst die Spritzanimation aus und stoppt weitere Bewegung/Rotation.
     */
    splash() {
        this.isSplashed = true; // Als gespritzt markieren
        this.speedY = 0; // Vertikale Bewegung stoppen
        this.speed = 0; // Horizontale Bewegung stoppen (falls eine andere Geschwindigkeit eingestellt ist)
        // Die Spritzanimation einmal abspielen und dann zur Entfernung markieren
        this.animateOnce(this.IMAGES_SPLASH, 400, () => {
            this.isRemovable = true; // Die Flasche zur Entfernung markieren, nachdem die Spritzanimation beendet ist
        });
    }
}