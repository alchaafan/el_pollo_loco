class Coins extends DrawableObject {

      offset = {
        top: 50,   
        bottom: 50, 
        left: 50,   
        right: 50   
    };


    constructor(x, y) {
        super();
        this.loadImage('img/8_coin/coin_1.png');
        this.x = x;
        this.y = y;
        this.width = 150; 
        this.height = 150;
    }
}