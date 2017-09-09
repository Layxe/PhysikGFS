/**
 * Einfache Klasse um einen Punkt auf der Welle zu simulieren
 * 
 * @export
 * @class Point
 */

export default class Point {

    // KONSTRUKTOR 
    // #############################################################################################  //

    /**
     * Erstelle eine neue Instanz eines Punktes
     * @param {number} x   x Koordinate 
     * @param {number} y   y Koordinate
     * @param {number} index  Speicherplatz der in der Reihung belegt wird  
     * @memberof Point
     */

    constructor(x,y,index) {
        this.x = x
        this.y = y
        this.angle = 0
        this.index = index

        this.still = true

    }

    // FUNKTIONEN 
    // #############################################################################################  //

    /**
     * Vereinfache das aktuelle Bogenmaß
     * 4PI -> 2PI
     * 3PI -> 1.5PI
     * 
     * @memberof Point
     */

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

    /**
     * Ändere den aktuellen Winkel des Punktes
     * 
     * @param {number} angle Bogenmaß
     * @memberof Point
     */

    setAngle(angle) {
        this.angle = angle
        this.breakAngleDown()
    }

}