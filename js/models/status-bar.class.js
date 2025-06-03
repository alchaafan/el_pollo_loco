class StatusBar extends DrawableObject {


    percentage = 100;

    constructor() {
        super();
        this.loadImages(ImageHub.statusbar.health);
        this.x = 40;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);

    }

    //setPercentage(50);
    setPercentage(percentage) {
        this.percentage = percentage; //=> 0 ... 5
        let path = ImageHub.statusbar.health[this.resolveImageIndex()];
         this.img = this.imageCache[path];

    }

    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if(this.percentage > 40) {
            return 2;
        } else if(this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}