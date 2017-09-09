import {Wave} from './Wave.js'
import World  from './World.js'

/**
 * Diese Klasse ist für die Umstellung zur globalen Reflexion transversaler
 * Wellen zuständig.
 * Ebenso werden auch die grafischen Elemente für die Reflexion bereit gestellt
 * 
 * @export
 * @class Reflect
 */

export default class Reflect {

  /**
   * Grundlegende Einstellung für die Reflexion
   * 
   * @static
   * @memberof Reflect
   */

  static init() {

    Reflect.vivisble = false

    Reflect.element = document.getElementById('display')
    Reflect.ctx     = Reflect.element.getContext('2d')

    Reflect.mode    = 0 // 0 = nicht vorhanden, 1 = festes Ende, 2 = loses Ende

  }

  /**
   * Zeichne die grafischen Elemente wenn
   * benötigt
   * 
   * @static
   * @memberof Reflect
   */

  static draw() {

    if(Reflect.mode == 0)
      return

    if(Reflect.mode == 1)
      Reflect.ctx.fillStyle = 'black'
    else
      Reflect.ctx.fillStyle = 'rgb(75,150,255)'
    Reflect.ctx.fillRect(parseInt(Reflect.element.getAttribute('width'))-10, 0, 10, 500)

  }

}