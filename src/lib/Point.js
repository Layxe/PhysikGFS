export default class Point {

    constructor(x,y) {
        this.x = x
        this.y = y
        this.angle = 0

        this.still = true

    }

    breakAngleDown() {

        var debug = false;

        if(this.x == 0) {
            debug = true;
        }

        if(this.angle > 2 * Math.PI) {

            var correctFactor = Math.floor(this.angle / (2 * Math.PI));

            this.angle = this.angle - (correctFactor * (2*Math.PI));

        }

    }

    setAngle(angle) {
        this.angle = angle
        this.breakAngleDown()
    }

}