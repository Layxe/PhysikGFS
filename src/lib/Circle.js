import {drawArrow}         from './Utils.js'
import Display             from './Display.js'
import {RESOLUTION}        from './PerformanceAnalyzer.js'
import Point               from './Point.js'
import LongitudinalHandler from './LongitudinalHandler.js'

// ZEIGERMODELL 
// #################################################################################################  //

export  class Circle {

  // KONSTRUKTOR 
  // ###############################################################################################  //

  constructor(element,waves) {

    this.waves = waves
    this.element = element
    this.ctx = this.element.getContext('2d')
    this.visible = true
    this.gesAmplitude = 0
    this.showAngle = true

  } 

  // FUNKTIONEN 
  // ###############################################################################################  //

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

      if(LongitudinalHandler.running)
        return

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

  draw(_pointIndex) {

    let pointIndex = Math.round(_pointIndex)

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

      let offset = {
        x: 0,
        y: 0
      }

      // Zeichne einen neuen Zeiger für jede Welle
      for(var i = 0; i < this.waves.length; i++) {

        var wave  = this.waves[i];
        var point = wave.points[pointIndex];
        var angle = point.angle;

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

        offset.x = Math.cos(angle)*wave.amplitude
        offset.y = -Math.sin(angle)*wave.amplitude

        drawArrow(this.ctx,x,y,x+offset.x, y+offset.y)

        this.ctx.stroke();

        x += offset.x
        y += offset.y

        // Hebe den Punkt hervor
        if(!LongitudinalHandler.running && wave.visible)
          Display.drawPointOnWave(point, wave.amplitude, wave.color, 5);

        gesY += offset.y;

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

// KLEINES ZEIGERMODELL 
// #################################################################################################  //


/**
 * Klasse zum Anzeigen vieler kleiner Zeigermodelle für
 * mehrere Punkte
 * @class SmallCircleDisplay
 */

export class SmallCircleDisplay {

  // INITIALISIERUNG 
  // ###############################################################################################  //

  /**
   * Initialisiere das Modell mit der gegebenen Welle
   * @param {Wave} wave 
   */

  static init(wave) {

    SmallCircleDisplay.element = document.getElementById('small-clock-display')
    SmallCircleDisplay.circles = new Array()
    SmallCircleDisplay.wave    = wave
    SmallCircleDisplay.ctx     = SmallCircleDisplay.element.getContext('2d')

    SmallCircleDisplay.visible = false
    SmallCircleDisplay.element.style.display = 'none'

    let i = 0

    for(let x = 50; x < parseInt(SmallCircleDisplay.element.getAttribute('width')); x += 90) {

      SmallCircleDisplay.circles[i] = new SmallCircle(x)
      i += 1

    }
  
  }

  // FUNKTIONEN 
  // ###############################################################################################  //

  /**
   * Ändere die Welle
   * @param {Wave} wave 
   */
  static changeWave(wave) {

    SmallCircleDisplay.wave    = wave

    let i = 0

    for(let x = 50; x < parseInt(SmallCircleDisplay.element.getAttribute('width')); x += 90) {

      SmallCircleDisplay.circles[i] = new SmallCircle(x)
      i += 1

    }
    
  }

  /**
   * Zeige / Verstecke die Darstellung
   */

  static toggle() {

    if(SmallCircleDisplay.visible)
      SmallCircleDisplay.element.style.display = 'none'
    else
      SmallCircleDisplay.element.style.display = 'block'

    SmallCircleDisplay.visible = !SmallCircleDisplay.visible

  }

  /**
   * Zeichne die Zeigermodelle
   */

  static draw() {

    if(!SmallCircleDisplay.visible || !SmallCircleDisplay.wave.visible)
      return

    SmallCircleDisplay.ctx.fillStyle = 'white'
    SmallCircleDisplay.ctx.fillRect(0,0,2000,50)
    SmallCircleDisplay.ctx.strokeStyle = SmallCircleDisplay.wave.color
    SmallCircleDisplay.ctx.lineWidth = 3

    let wave       = SmallCircleDisplay.wave

    for(let i = 0; i < SmallCircleDisplay.circles.length; i++) {

      let dummyPoint = SmallCircleDisplay.circles[i].point
      SmallCircleDisplay.circles[i].draw()
      
      if(!LongitudinalHandler.running)
        Display.drawPointOnWave(dummyPoint,wave.amplitude,'black',3)

    }

  }

}

/**
 * Kleines Zeigermodell
 */

export class SmallCircle {

  // KONSTRUKTOR 
  // ###############################################################################################  //

  /**
   * Erstelle ein neues Zeigermodell mit vorgegebenen x Wert
   * @param {number} x 
   */

  constructor(x) {

    this.radius = 25
    this.x      = x
    this.point  = SmallCircleDisplay.wave.points[Math.round(this.x / RESOLUTION)]

  }

  // FUNKTIONEN 
  // ###############################################################################################  //

  /**
   * Zeichne das Zeigermodell
   */

  draw() {

    let angle = this.point.angle

    let direction = {
      x: Math.cos(angle)*25,
      y: Math.sin(angle)*25
    }

    SmallCircleDisplay.ctx.beginPath()
    SmallCircleDisplay.ctx.moveTo(this.x, 25)
    SmallCircleDisplay.ctx.lineTo(this.x+direction.x, 25-direction.y)
    SmallCircleDisplay.ctx.stroke()

  }

}