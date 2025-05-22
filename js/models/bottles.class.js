class Bottles extends DrawableObject {

    IMAGES = [
        '',
        ''
    ];
    constructor(x, y) {
        super();
        this.loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;

    }
}