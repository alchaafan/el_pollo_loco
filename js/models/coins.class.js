class Coins extends DrawableObject {

      offset = {
        top: 50,    // Oben
        bottom: 50, // Unten
        left: 50,   // Links
        right: 50   // Rechts
    };


    constructor(x, y) {
        super();
        this.loadImage('img/8_coin/coin_1.png');
        this.x = x;
        this.y = y;
        this.width = 150; // Größe festlegen
        this.height = 150;
    }
}