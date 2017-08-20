import World from './World.js'
import {Wave} from './Wave.js'

export default class LongitudinalHandler {

  static init() {

    for(let i = 0; i < World.waves.length; i++) {
      
      if(World.waves[i] != undefined && World.waves[i] instanceof Wave)
        World.waves[i].interface.deleteWave()

    }

    World.waves = []

    let wave = World.createWave(1,0.0025,50)
    wave.transversal = false
    wave.start()

  }

}