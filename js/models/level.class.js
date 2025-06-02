class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 2200;
       coins; // Neu
    bottles; // Neu

    constructor(enemies, clouds, backgroundObjects, coins, bottles) { // Parameter hinzufügen
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins; // Zuweisung
        this.bottles = bottles; // Zuweisung
    }
}