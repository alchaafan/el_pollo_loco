class Coins extends DrawableObject {
    constructor(x, y) {
        super();
        this.loadImage('img/8_coin/coin_1.png');
        this.x = x;
        this.y = y;
        this.width = 150; // Größe festlegen
        this.height = 150;
    }
}