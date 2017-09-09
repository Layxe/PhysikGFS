import World from './World.js'
import {Wave} from './Wave.js'
import {mainCircle} from './../Main.js'
import Reflect      from './Reflect.js'

export default class LongitudinalHandler {

  static init() {

    LongitudinalHandler.running = true

    if(mainCircle.visible)
      mainCircle.toggle()

    for(let i = 0; i < World.waves.length; i++) {
      
      if(World.waves[i] != undefined && World.waves[i] instanceof Wave)
        World.waves[i].interface.deleteWave()

    }

    World.waves = []

    let wave = World.createWave(1,0.0025,50)
    wave.transversal = false
    wave.start()

    Reflect.mode = 0
    
  }

}