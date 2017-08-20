import {drawArrow} from './Utils.js'
import Display from './Display.js'

export  class Circle {

    constructor(element,waves) {

      this.waves = waves
      this.element = element
      this.ctx = this.element.getContext('2d')
      this.visible = true
      this.gesAmplitude = 0
      this.showAngle = true

    } 

    /**
     * Setze die Wellen, welche angezeigt werden
     * 
     * @param {array} waves
     * @memberof Circle
     */

    setWaves(waves) {
      this.waves = waves
    }

    /**
     * Zeige / Verstecke das Zeigermodell
     * 
     * @memberof Circle
     */

  toggle() {

    if(this.visible) {
      this.element.style.display = 'none';
      Display.element.style.left = '0';
      Display.smallClockElement.style.left = '0'
    } else {
      this.element.style.display = 'block';
      Display.element.style.left = '500px';
      Display.smallClockElement.style.left = '500px'
    }

    this.visible = !this.visible;

  }

  /**
   * Zeichne das Zeigermodell
   * 
   * @param {number} pointIndex Verwendeter Punkt
   * @memberof Circle
   */

  draw(pointIndex) {

    if(this.visible && this.waves != null) {

      var gesY         = 0;
      var gesAmplitude = 0;
      var marginLeft;
      var x;
      var y;

      this.ctx.clearRect(0,0,500,500);

      // Berechne die gesamte Amplitude
      for(var i = 0; i < this.waves.length; i++) {
        gesAmplitude += this.waves[i].amplitude;
      }

      // Berechne die neue Position des Canvas, falls sich
      // die maximale Amplitude ändert
      if(this.gesAmplitude != gesAmplitude) {

        this.gesAmplitude = gesAmplitude;
        this.element.style.left = (gesAmplitude - 250) + 'px';

      }


      marginLeft = 490 - gesAmplitude;

      x = marginLeft;
      y = 250;

      this.ctx.lineWidth = 3;

      // Zeichne einen neuen Zeiger für jede Welle
      for(var i = 0; i < this.waves.length; i++) {

        var wave  = this.waves[i];
        var point = wave.points[pointIndex];
        var angle = point.angle;

        var newX = Math.cos(angle)*wave.amplitude+marginLeft;
        var newY = -Math.sin(angle)*wave.amplitude+250;

        this.ctx.beginPath();
        this.ctx.strokeStyle = wave.color;

        // Erstelle eine Kreisform zum Anzeigen der aktuellen Zeigerposition
        if(this.showAngle && angle != wave.phi) {

          this.ctx.beginPath();

          var startAngle  = 2*Math.PI - wave.phi;
          var circleAngle = 2*Math.PI - angle;

          this.ctx.arc(x,y,wave.amplitude / 2, startAngle, circleAngle, true);
          this.ctx.stroke();

        }

        // Zeichne den Pfeil
        if(i != 0) {
          drawArrow(this.ctx,x,y,newX-marginLeft+x,newY-250+y); // Anschließende Pfeile
        } else {
          drawArrow(this.ctx, x,y, newX, newY); // Erster Pfeil
        }

        this.ctx.stroke();

        x = newX;
        y = newY;

        // Hebe den Punkt hervor
        Display.drawPointOnWave(point, wave.amplitude, wave.color, 5);

        gesY += newY;


      }


      // Zeichne den Kreis
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = 'black';

      this.ctx.beginPath();
      this.ctx.arc(490-gesAmplitude, 250, gesAmplitude+3, 0, 2*Math.PI);
      this.ctx.stroke();
    
    }

  }

}

export class SmallCircle {

  constructor() {
    this.element = document.getElementById('small-clock-display')
  }

}