import {RESOLUTION} from './PerformanceAnalyzer.js'

/**
 * Zeichenoberfläche für die Darstellung der Wellen
 * 
 * @export
 * @class Display
 */

class Display {

    // INITIALISIERUNG 
    // #############################################################################################  //

    /**
     * Aktualisiere die Breite sowie die Höhe der Zeichenoberfläche
     * 
     * @static
     * @memberof Display
     */

    static init() {

        let wrapper = document.getElementById('display-wrapper')

        Display.width = wrapper.clientWidth
        Display.height = wrapper.clientHeight

        Display.element = document.getElementById('display')
        Display.ctx     = Display.element.getContext('2d')

        Display.smallClockElement = document.getElementById('small-clock-display')

        Display.element.setAttribute('width', Display.width.toString())
        Display.element.setAttribute('height', Display.height.toString())

        Display.smallClockElement.setAttribute('width', Display.width.toString());
        Display.smallClockElement.setAttribute('height', '50')

    }

    // FUNKTIONEN 
    // #############################################################################################  //

    /**
     * Zeichne einen Punkt einer longitudinalen Welle
     * 
     * @static
     * @param {any} point 
     * @param {any} amplitude 
     * @param {any} color 
     * @memberof Display
     */

    static drawLongitudinalPoint(point, amplitude, color) {

      let x = point.x + Math.cos(point.angle) * amplitude;
      let y = 250;

      Display.ctx.fillStyle = color;

      Display.ctx.fillRect(x,y-20,1,40)

      if(point.index % 25 == 0)
        Display.drawSimplePoint(x,250,'black',5)



      //Display.ctx.fillRect(x,y,3,3)
    }

    /**
     * Zeichne einen Punkt einer Welle
     * 
     * @static
     * @param {Point} point 
     * @param {number} amplitude 
     * @param {string} color 
     * @memberof Display
     */

    static drawPoint(point, amplitude, color) {

      var x = point.x;
      var y = 250+(-Math.sin(point.angle) * amplitude); // -sin weil das Koordinatensystem in y Richtung umgedreht ist

      Display.ctx.fillStyle = color;
      //Display.ctx.fillRect(x,y, 1, 1);

      Display.ctx.lineTo(x,y);

  }

  /**
   * Zeichne einen speziellen Punkt auf einer transversalen Welle
   * 
   * @static
   * @param {Point} point 
   * @param {number} amplitude 
   * @param {string} color 
   * @param {number} radius 
   * @memberof Display
   */

  static drawPointOnWave(point,amplitude,color,radius) {

    var x = point.x;
    var y = 250+(-Math.sin(point.angle) * amplitude);

    Display.ctx.fillStyle = color;
    Display.ctx.beginPath();
    Display.ctx.arc(x,y,radius,0, 2*Math.PI);
    Display.ctx.fillStyle = 'black';
    Display.ctx.fill();

  }

  /**
   * Zeichne einen Punkt mit gegebenen x und y Koordinaten
   * 
   * @static
   * @param {number} x 
   * @param {number} y 
   * @param {string} color 
   * @param {number} radius 
   * @memberof Display
   */

  static drawSimplePoint(x,y,color,radius) {

    Display.ctx.fillStyle = color;
    Display.ctx.beginPath();
    Display.ctx.arc(x,y,radius,0, 2*Math.PI);
    Display.ctx.fill();

  }

  /**
   * Zeichne eine Welle, welche aus mehreren Wellen besteht
   * 
   * @static
   * @param {array} waves 
   * @param {string} color 
   * @memberof Display
   */
  
static drawCombinedWave(waves,color) {
    
    Display.ctx.beginPath();
    Display.ctx.strokeStyle = color;

    for(var k = 0; k < Display.getPoints(); k++) {

      var still = false;
      var x = k*RESOLUTION;
      var y = 0;

      for(var i = 0; i < waves.length; i++) {

        y -= Math.sin(waves[i].points[k].angle) * waves[i].amplitude;

        if(waves[i].points[k].still) {
          still = true;
        }

      }

      y += 250;

      // Falls nicht alle Punkte sich überlappen soll nicht gezeichnet werden
      if(still) {
        continue;
      }

      Display.ctx.fillStyle = color;
      Display.ctx.lineTo(x,y);

    }

    Display.ctx.stroke();
    Display.ctx.closePath();
    
  }

  /**
   * Zeichne Hilfselemente wie z.B. die x und y Achse
   * 
   * @static
   * @memberof Display
   */

  static drawInterface() {

    var y = 2;

    Display.ctx.fillStyle = 'black';
    Display.ctx.strokeStyle = 'black';
    Display.ctx.lineWidth = 2;
    Display.ctx.font = '20px Arial';

    // X-Achse
    Display.ctx.beginPath();
    Display.ctx.moveTo(0,250);
    Display.ctx.lineTo(Display.width, 250);
    Display.ctx.stroke();
    // Y-Achse
    Display.ctx.beginPath();
    for(var i = 50; i <= 500; i+=100) {
      Display.ctx.moveTo(0, i);
      Display.ctx.lineTo(15,i);

      Display.ctx.fillText(y.toString(),0,i-10);
      y--;
    }

    Display.ctx.stroke();
 
  }

  /**
   * Erhalte die Anzahl an Punkten pro Welle
   * 
   * @static
   * @returns {number} Anzahl der Punkte
   * @memberof Display
   */

  static getPoints() {
    return Math.round(Display.width / RESOLUTION)
  }

} 

export default Display;