class StatusBarEndboss extends DrawableObject {
   

     percentage = 100;

    constructor() {
        super();
        this.loadImages(ImageHub.statusbar.boss);
        this.x = 50; // Position der Statusleiste anpassen
        this.y = 50;   // Position der Statusleiste anpassen
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

     setPercentage(percentage) {
        this.percentage = percentage;
        let path = ImageHub.statusbar.boss[this.getIndexByPercentage()];
        this.img = this.imageCache[path];
    }
getIndexByPercentage() {
        if (this.percentage === 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }


}