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
export let mainCircle
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
  //World.createWave(2,0.01,50);
  //World.createWave(1,0.1,50)

  let combinedWave = World.createCombinedWave([]);
  combinedWave.color = 'green'

  World.createWave(1,0.005,100)

  // Erstelle ein neues Zeigermodell
  mainCircle = new Circle(document.getElementById('clock-display'), null)
  mainCircle.setWaves([World.waves[1]])
  mainCircle.toggle()

  // Starte die Animationsschleife
  loop()

  // Starte die erste Welle
  World.waves[1].start()
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

  mainCircle.draw(50 / RESOLUTION)

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
