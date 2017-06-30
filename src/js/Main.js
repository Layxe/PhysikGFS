/** GFS Physik Schwingungen und Wellen
 * ==============================================
 * @author Alexander Niedermayer - 26.06.2017
 * @version 0.1 Alpha
 * @description Anwendung zur hoffentlich flüssigen Simulation
 *              von verschiedenen physikalischen Phänomenen im
 *              Zusammenhang mit Wellen
 *
 */

// ### Globale Einstellungen ######################################## //

const RESOLUTION = 2;

// ### Variablen #################################################### //

var oldTime = 0;
var FPS     = 0;


// ### Display ###################################################### //

/**
 * Statisches Display
 * @param element canvas element
 * @constructor
 */

function StDisplay(element) {

  this.element = element;
  this.ctx     = element.getContext('2d');

}

/**
 * Initialisierungsfunktion
 * ------------------------------------------
 * Passe das Display den Rahmenbedingungen an
 * und starte die Animationsschleife
 */

StDisplay.prototype.init = function init() {

  var wrapper = document.getElementById('display-wrapper');

  this.width  = wrapper.clientWidth;
  this.height = wrapper.clientHeight;

  this.element.setAttribute("width", this.width.toString());
  this.element.setAttribute("height", this.height.toString());

};

/**
 * Zeichne einen Punkt
 * @param point
 * @param amplitude Amplitude der Welle
 * @param color Farbe des Punktes
 */

StDisplay.prototype.drawPoint = function drawPoint(point, amplitude, color) {

  var x = point.x;
  var y = 250+Math.sin(point.angle) * amplitude;

  this.ctx.fillStyle = color;
  this.ctx.fillRect(x,y, 1, 1);

  this.ctx.lineTo(x,y);


};

/**
 * Zeichne eine Welle, die aus sich aus mehreren Wellen zusammensetzt
 * @param waves
 * @param color
 */

StDisplay.prototype.drawCombinedWave = function drawCombinedWave(waves, color) {

  this.ctx.beginPath();
  this.ctx.strokeStyle = color;

  for(var k = 0; k < Display.getPoints(); k++) {

    var still = false;
    var x = k*RESOLUTION;
    var y = 0;

    for(var i = 0; i < waves.length; i++) {

      y += Math.sin(waves[i].points[k].angle) * waves[i].amplitude;

      if(waves[i].points[k].still) {
        still = true;
      }

    }

    y += 250;

    // Falls nicht alle Punkte sich überlappen soll nicht gezeichnet werden
    if(still) {
      continue;
    }

    this.ctx.fillStyle = color;
    this.ctx.fillRect(x,y, 1, 1);

    this.ctx.lineTo(x,y);

  }

  this.ctx.stroke();
  this.ctx.closePath();

};

StDisplay.prototype.drawInterface = function drawInterface() {

  this.ctx.beginPath();
  this.ctx.moveTo(0,250);
  this.ctx.lineTo(Display.width, 250);
  this.ctx.strokeStyle = 'black';
  this.ctx.lineWidth = 2;
  this.ctx.stroke();

};

StDisplay.prototype.getPoints = function getPoints() {

  return Math.round(Display.width / RESOLUTION);

};

const Display = new StDisplay(document.getElementById('display'));

// ### Welt ######################################################### //

/**
 * Welt, die die Punkte beinhaltet
 * @constructor
 */

function StWorld() {

  this.waves = [];

}

/**
 * Zeichne alle Punkte, die in der Welt existieren
 */

StWorld.prototype.drawWaves = function drawWaves() {

  for(var i = 0; i < this.waves.length; i++) {

    this.waves[i].draw();

  }

};

/**
 * Erstelle eine neue Welle
 * @param c Ausbreitungsgeschwindigkeit
 * @param frequency Frequenz
 * @param amplitude Amplitude
 * @param index Speicherort
 */

StWorld.prototype.createWave = function createWave(c,frequency,amplitude) {

  var wave = new Wave(c,frequency,amplitude);
  World.waves.push(wave);
  return wave;

};

StWorld.prototype.createCombinedWave = function createCombinedWave(waves) {

  var cw = new CombinedWave(waves);
  World.waves.push(cw);
  return cw;

};

/**
 * Animiere alle Wellen
 */

StWorld.prototype.simulate = function simulate() {

  for(var i = 0; i < this.waves.length; i++) {

    if(this.waves[i] instanceof Wave)
        World.waves[i].simulate();

  }

};

// ### Welle ######################################################## //

/** Wellenobjekt
 * --------------------------
 * Wird mit World.createWave() erstellt
 * @param c         {number}
 * @param frequency {number}
 * @param amplitude {number}
 * @constructor
 */

function Wave(c,frequency,amplitude) {

  this.time = 0; // Relative Zeitphase der Welle
  this.c = c;
  this.frequency = frequency;
  this.amplitude = amplitude;
  this.phi = 3.14*2;

  this.reverse = false; // Läuft die Welle nach rechts
  this.running = false; // Wird die Welle fortlaufen simuliert

  this.color = 'orange';
  this.strokeWidth = 3;

  this.points = new Array(Display.getPoints());

  for(var i = 0; i < Display.getPoints(); i++) {

    this.points[i] = new Point(i*RESOLUTION, 0);

  }



}

/**
 * Starte die Welle
 */

Wave.prototype.start = function start() {

  this.running = true;

};

/**
 * Stoppe die Welle
 */

Wave.prototype.stop = function stop() {

  this.running = false;

};

/**
 * Zeichne alle Punkte, die die Welle beinhaltet
 */

Wave.prototype.draw = function draw() {

  Display.ctx.beginPath();
  Display.ctx.lineWidth = this.strokeWidth;
  Display.ctx.strokeStyle = this.color;

  for(var i = 0; i < Display.getPoints(); i++) {

    if(!this.points[i].still) // Falls der Punkt nicht schwingt, wird er auch nicht gezeichnet
      Display.drawPoint(this.points[i], this.amplitude, this.color);

  }

  Display.ctx.stroke()

};

/**
 * Setze die Zeit der Welle und aktualisiere die Position der Punkte
 * @param time {number}
 */

Wave.prototype.setTime = function setTime(time) {

  this.time = time;


  for(var i = 0; i < this.points.length; i++) {

    var point;

    if(this.reverse) {

      point = this.points[this.points.length - (i+1)];

    } else {

      point = this.points[i];

    }


    point.angle = 0; // Setze den Winkel zurück, falls die Welle neugestartet wird

    var T = 1 / this.frequency;
    var lambda = this.c * T;

    if (this.time * this.c >= i) {
      point.angle = (2 * Math.PI * (this.time / T - i / lambda)) + this.phi; // Berechne den Winkel des Zeigers
      point.still = false;
    } else {
      point.still = true;
    }


  }

};

/**
 * Simuliere die Fortbewegung der Welle indem die Zeit durchgehend
 * erhöht wird
 */

Wave.prototype.simulate = function simulate() {

  if(!this.running) {
    return;
  }

  this.setTime(this.time);
  this.time++;

};

/**
 * Versetze die Welle in Ursprungsposition
 */

Wave.prototype.restart = function restart() {

  this.time = 0;

};

/**
 * Erstelle einen Punkt
 * @param x
 * @param y
 * @constructor
 */

function Point(x,y) {

  this.x = x;
  this.y = y;
  this.angle = 0;

  this.still = true;

}

// ### Kombinierte Welle ############################################ //

function CombinedWave(waves) {

  this.waves = waves;
  this.color = 'green';
  this.running = true;

}

CombinedWave.prototype.draw = function draw() {

  Display.drawCombinedWave(this.waves, this.color);

};

// ### Nützliche Funktionen ######################################### //

function resetEverything() {

  for(var i = 0; i < 3; i++) {

    World.waves[i].restart();

  }

}

// ### Programmablauf ############################################### //

/**
 * Programmloop
 * -----------------------
 * Sorge dafür, dass die Wellen falls gewollt animiert
 * und gezeichnet werden
 */

function loop() {

  Display.ctx.clearRect(0,0,Display.width,Display.height);

  World.drawWaves();  // Zeichne die Punkte der Wellen
  World.simulate();   // Aktualisiere die Wellen

  Display.drawInterface();

  // ~~~ Messe die Bilder pro Sekunde ~~~ //
  FPS++;
  if(new Date().getTime() > oldTime + 1000) {

    FPS = 0;
    oldTime = new Date().getTime();

  }

  window.requestAnimationFrame(loop);

}

Display.init();

const World = new StWorld();

World.createWave(2,0.005,100);
World.createWave(1,0.005,100);
World.waves[1].reverse = true;

World.createCombinedWave([World.waves[0], World.waves[1]]);

loop();

World.waves[0].start();
World.waves[1].start();
