import Display      from './Display.js'
import {RESOLUTION} from './PerformanceAnalyzer.js'
import Point        from './Point.js'
import Reflect      from './Reflect.js'

class Wave {

  // KONSTRUKTOR 
  // ###############################################################################################  //

  /**
   * Erstelle ein neues Objekt vom Typ {Wave}
   * 
   * @param {number} c 
   * @param {number} frequency 
   * @param {number} amplitude 
   * @memberof Wave
   */

  constructor(c,frequency,amplitude) {

    // Werte, welche die grundlegende Welle definieren
    this.c         = c
    this.frequency = frequency
    this.amplitude = amplitude

    this.phi  = 0
    this.time = 0

    // Boolsche Variablen für verschiedene Eigenschaften
    this.reverse        = false
    this.running        = false
    this.visible        = true
    this.transversal    = true
    this.reflected      = false
    this.showWaveLength = false

    // Variablen zur grafischen Darstellung
    this.color       = 'orange'
    this.strokeWidth = 3

    // Oberfläche zum Bearbeiten der Welle
    this.interface = null;

    this.init()

  }

  // INITIALISIERUNG 
  // ###############################################################################################  //

  /**
   * Weise der Welle eine Anzahl an Punkten zur Simulation zu
   * 
   * @memberof Wave
   */

  init() {

    // Erstelle eine neue Reihung für die Punkte
    this.points = new Array(Display.getPoints())

    // Fülle diese Reihung mit Punkten
    for(var i = 0; i < Display.getPoints(); i++) {

      this.points[i] = new Point(i*RESOLUTION, 0, i);

    }

  }

  // FUNKTIONEN 
  // ###############################################################################################  //

  /**
   * Erstelle eine Kopie einer vorhandenen Welle
   * @param {Wave} wave 
   * @memberof Wave
   */

  static copyWave(wave) {

    let newWave = new Wave(wave.c, wave.frequency, wave.amplitude)
    newWave.reverse = wave.reverse
    newWave.phi     = wave.phi
    newWave.time    = wave.time
    newWave.color   = wave.color

    return newWave

  }

  /**
   * Ändere die Phasenverschiebung der Welle
   * 
   * @param {number} phi Wird in Bogenmaß angegeben 
   * @memberof Wave
   */

  setPhi(phi) {

    this.phi = phi

    for(let i = 0; i < this.points.length; i++) {

      this.points[i].setAngle(this.phi)

    }

  }

  /**
   * Starte die Welle
   * 
   * @memberof Wave
   */

  start() {
    this.running = true
  }

  /**
   * Stoppe die Welle
   * 
   * @memberof Wave
   */

  stop() {
    this.running = false
  }

  /**
   * Zeichne die Welle
   * 
   * @memberof Wave
   */

  draw() {
    
    if(!this.visible)
      return

    // Zeichne eine transversale Welle
    if(this.transversal) {

      Display.ctx.beginPath()
      // Grafische Einstellungen
      Display.ctx.lineWidth = this.strokeWidth
      Display.ctx.strokeStyle = this.color

      // Bilde aus den vielen Punkten einen Graphen
      for(let i = 0; i < Display.getPoints(); i++) {

        // Falls der Punkt nicht schwingt wird er auch nicht gezeichnet
        if(!this.points[i].still) {

          Display.drawPoint(this.points[i], this.amplitude, this.color)

        } else if(i > 0) {
          // Falls es sich bei dem Punkt um das Anfangsstück handelt, soll eine Linie bis zur 0 Achse gezogen werden
          if(!this.points[i-1].still) {

            let fakePoint = new Point(this.points[i-1].x + RESOLUTION / 2)
            fakePoint.setAngle(this.phi)
            Display.drawPoint(fakePoint, this.amplitude, this.color)

          }

        }

      }

      Display.ctx.stroke()

      // Zeichne die Wellenlänge
      if(this.showWaveLength) {

        let startPoint = this.points[Math.round(50 / RESOLUTION)]
        let waveLength = this.c / this.frequency
        let y          = 249-Math.sin(startPoint.angle)*this.amplitude

        Display.ctx.fillStyle = 'red'
        Display.ctx.fillRect(startPoint.x, y, waveLength, 3)
        Display.drawSimplePoint(startPoint.x, y, 'black', 5)
        Display.drawSimplePoint(startPoint.x+waveLength, y+2, 'black', 5)

      }

    } else {

      // Zeichne eine longitudinale Welle
      for(let i = 0; i < Display.getPoints(); i++) {

        let point = this.points[i]

        let x = point.x + Math.sin(point.angle) * this.amplitude;

        Display.drawLongitudinalPoint(point, this.amplitude, this.color)

      }

    }

    // Reflektiere die Welle falls erfordert
    if(this.reflected && this.c * this.time > Display.width) {

      // Erstelle eine Kopie in die umgekehrte Richtung
      let newWave = Wave.copyWave(this)

      newWave.reflected = false
      newWave.reverse = !this.reverse

      if(Reflect.mode == 1) {
        newWave.setPhi(this.phi + 3.14)
      }


      newWave.setTime(this.time - Display.width / this.c)
      newWave.draw()

      new CombinedWave([this, newWave], 'green').draw()

    }

  }

  /**
   * Aktualisiere die Welle bis zu einem bestimmten Zeitpunkt
   * 
   * @param {number} time 
   * @memberof Wave
   */
  
  setTime(time) {

    this.time = time;

    for(let i = 0; i < this.points.length; i++) {

      let point;

      // Bestimme den Punkt abhängig von der Richtung
      if(this.reverse) {

        point = this.points[this.points.length - (i+1)];

      } else {

        point = this.points[i];

      }

      point.setAngle(this.phi); // Setze den Winkel zurück, falls die Welle neugestartet wird

      let T = 1 / this.frequency;
      let lambda = this.c * T;

      // Überprüfe, ob die Welle den Punkt schon erreicht hat
      // Dies kommt nur bei transversalen Wellen zum Einsatz
      if (this.time * this.c >= i*RESOLUTION || !this.transversal) {

        let angle = (2 * Math.PI * (this.time / T - (i*RESOLUTION) / lambda)) + this.phi;

        point.setAngle(angle); // Berechne den Winkel des Zeigers
        point.still = false;

      } else {
        
        point.still = true;

      }


    }

  }

  /**
   * Simuliere die Fortbewegung der Welle
   * 
   * @memberof Wave
   */

  simulate() {

    if(!this.running)
      return

    this.setTime(this.time)
    this.time++

  }

  /**
   * Setze die Zeit zu t = 0 zurück
   * 
   * @memberof Wave
   */

  restart() {
    this.time = 0
  }

}

// KOMBINIERTE WELLE 
// #################################################################################################  //

/**
 * Kombiniere mehrere Wellen zu einer um eine Inteferenz zu simulieren
 * 
 * @class CombinedWave
 */

class CombinedWave {

  /**
   * Erstelle eine neue kombinierte Welle
   * 
   * @param {array} waves  
   * @param {string} color 
   * @memberof CombinedWave
   */

  constructor(waves, color) {
    this.waves = waves
    this.color = color
    this.running = true

    this.removeQueue = []

  }

  draw() {
    if(this.waves.length > 0)
      Display.drawCombinedWave(this.waves, this.color)

    for(let i = 0; i < this.removeQueue.length; i++) {
      this.waves.splice(this.waves.indexOf(this.removeQueue[i]), 1)
    }

    this.removeQueue = []

  }

  /**
   * Füge eine neue Welle hinzu
   * @param {Wave} wave 
   * @memberof CombinedWave
   */

  addWave(wave) {

    this.waves.push(wave)

  }

  /**
   * Lösche eine Welle
   * @param {Wave} wave 
   * @memberof CombinedWave
   */

  removeWave(wave) {

    this.removeQueue.push(wave)

  }

}

export {Wave, CombinedWave}