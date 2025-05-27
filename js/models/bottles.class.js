class Bottles extends DrawableObject {
    offset = {
        top: 20,  
        bottom: 20,
        left: 20,
        right: 20
    };

    IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];
    
    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES); 

        let randomImage = this.IMAGES[Math.floor(Math.random() * this.IMAGES.length)];
        this.loadImage(randomImage);
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
    }
}