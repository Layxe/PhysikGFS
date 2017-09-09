import {Wave} from './Wave.js'
import World  from './World.js'

export default class Reflect {

  static init() {

    Reflect.vivisble = false

    Reflect.element = document.getElementById('display')
    Reflect.ctx     = Reflect.element.getContext('2d')

    Reflect.mode    = 0 // 0 = nicht vorhanden, 1 = festes Ende, 2 = loses Ende

  }

  static draw() {

    if(Reflect.mode == 0)
      return

    if(Reflect.mode == 1)
      Reflect.ctx.fillStyle = 'black'
    else
      Reflect.ctx.fillStyle = 'rgb(75,150,255)'
    Reflect.ctx.fillRect(parseInt(Reflect.element.getAttribute('width'))-10, 0, 10, 500)

  }

  static toggle() {


  }

}