class StatusBarBottles extends DrawableObject {


    percentage = 0;

  constructor() {
        super();
        this.loadImages(ImageHub.statusbar.bottle);
        this.x = 450; // Position rechts oben
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0); // Coins starten bei 0%
    }

 setPercentage(percentage) {
        this.percentage = percentage;
        let path = ImageHub.statusbar.bottle[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

      resolveImageIndex() {
        if (this.percentage >= 100) {
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