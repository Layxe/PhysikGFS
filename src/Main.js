import Display                             from './lib/Display.js'
import World                               from './lib/World.js'
import {Wave, CombinedWave}                from './lib/Wave.js'
import Point                               from './lib/Point.js'
import {PerformanceAnalyzer, RESOLUTION}   from './lib/PerformanceAnalyzer.js'
import Circle                              from './lib/Circle.js'
import {UserInterface, StaticInterface}    from './lib/UserInterface.js'

// VARIABLEN 
// #################################################################################################  //

let FPS = 0
let circle
let oldTime = 0

// PROGRAMMSTART 
// #################################################################################################  //

let initProgram = () => {

  // Analysiere die Leistung des verwendeten Systems
  PerformanceAnalyzer.execute()

  // Initialisiere die Anzeigefläche der Wellen
  Display.init()
  // Initialisiere die statischen Bedienelemente
  StaticInterface.init()

  // Erstelle eine Anfangswelle
  World.createWave(1,0.005,100)
  //World.createWave(2,0.01,50);
  //World.createWave(1,0.1,50)

  //World.createCombinedWave([World.waves[0], World.waves[1]]);

  // Erstelle ein neues Zeigermodell
  circle = new Circle(document.getElementById('clock-display'), null)
  circle.setWaves([World.waves[0]])

  // Starte die Animationsschleife
  loop()

  // Starte die erste Welle
  World.waves[0].start()
  //World.waves[1].start();
  //World.waves[1].color = 'red';

}

window.onload = () => {

  initProgram()

}

// PROGRAMMLOOP 
// #################################################################################################  //

let loop = () => {

  Display.ctx.fillStyle = 'white'
  Display.ctx.fillRect(0,0,Display.width,Display.height)

  World.simulate()   // Aktualisiere die Wellen
  World.drawWaves()  // Zeichne die erstellten Wellen

  Display.drawInterface()  // Zeichne das Koordinatensystem und weitere
                           // Elemente

  circle.draw(50)

  // ~~~ Messe die Bilder pro Sekunde ~~~ //
  FPS++

  if(new Date().getTime() > oldTime + 1000) {

    FPS = FPS + 1

    document.getElementById('info-log').innerHTML = `FPS: ${FPS} at ${RESOLUTION}`

    FPS = 0
    oldTime = new Date().getTime()

  }

  window.requestAnimationFrame(loop)

}
