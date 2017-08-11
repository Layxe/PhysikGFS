import {Wave, CombinedWave} from './Wave.js'
import Display from './Display.js'

// WELT 
// #################################################################################################  //

class World {

  /**
   * Zeichne alle in der Welt vorhandenen Wellen
   * 
   * @static
   * @memberof World
   */

  static drawWaves() {

    for(var i = 0; i < World.waves.length; i++) {

      World.waves[i].draw();

    } 

  }

  /**
   * Erstelle eine neue Welle und füge sie der Welt hinzu
   * 
   * @static
   * @param {number} c Ausbreitungsgeschwindigkeit 
   * @param {number} frequency Frequenz
   * @param {number} amplitude Amplitude 
   * @returns {Wave} Erstellte Welle
   * @memberof World
   */

  static createWave(c,frequency,amplitude) {

    let wave = new Wave(c,frequency,amplitude);
    World.waves.push(wave);
    return wave; 

  }

  /**
   * Erstelle eine kombinierte, aus einer Inteferenz gebildeten Welle und füge sie der Szene hinzu
   * 
   * @static
   * @param {array} waves 
   * @returns {CombinedWave}
   * @memberof World
   */

  static createCombinedWave(waves) {

    let cw = new CombinedWave(waves);
    World.waves.push(cw);
    return cw;

  }

  /**
   * Simuliere die Fortbewegung der Welle, wird mit running == false für die Welle unterbrochen
   * 
   * @static
   * @memberof World
   */

  static simulate() {

      for(let i = 0; i < World.waves.length; i++) {

      if(World.waves[i] instanceof Wave)
        World.waves[i].simulate();

    }

  }

}

World.waves = new Array()

export default World