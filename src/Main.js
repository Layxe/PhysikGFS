import Display                             from './lib/Display.js'
import World                               from './lib/World.js'
import {Wave, CombinedWave}                from './lib/Wave.js'
import Point                               from './lib/Point.js'
import {PerformanceAnalyzer, RESOLUTION}   from './lib/PerformanceAnalyzer.js'
import {Circle, SmallCircle}               from './lib/Circle.js'
import {UserInterface, StaticInterface}    from './lib/UserInterface.js'
import LongitudinalHandler                 from './lib/LongitudinalHandler.js'

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

  // Erstelle die kombinierte Welle und lege sie in Platz 0 ab
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

  document.getElementById('start-longitudinal').addEventListener('click', () => {
    LongitudinalHandler.init()
  });

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

  mainCircle.draw(50 / RESOLUTION) // Zeichne das große Zeigermodell

  PerformanceAnalyzer.update() // Messe die Bilder pro Sekunde
                               // und verbessere wenn nötig die Performance

  window.requestAnimationFrame(loop)

}
