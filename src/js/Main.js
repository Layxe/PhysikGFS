/** GFS Physik Schwingungen und Wellen
 * ==============================================
 * @author Alexander Niedermayer - 26.06.2017
 * @version 0.1 Alpha
 * @description Anwendung zur hoffentlich flüssigen Simulation
 *              von verschiedenen physikalischen Phänomenen im
 *              Zusammenhang mit Wellen
 *
 */

// Globale Einstellungen
// ##################################################################################################################### //

var RESOLUTION = 6;

// Variablen 
// ##################################################################################################################### //

// ~~~ FPS Zähler ~~~ //
var oldTime = 0;
var FPS     = 0;

// Display
// ##################################################################################################################### //

/**
 * Display
 * --------------------------
 * Objekt, welches für die grundlegende Interaktion
 * mit der Zeichenoberfläche zuständig ist
 * @param element canvas element
 * @constructor
 */

var Display = {

  element: document.getElementById('display'),
  ctx:     document.getElementById('display').getContext('2d')

};

/**
 * Initialisierungsfunktion
 * ------------------------------------------
 * Passe das Display den Rahmenbedingungen an
 */

Display.init = function init() {

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

Display.drawPoint = function drawPoint(point, amplitude, color) {

  var x = point.x;
  var y = 250+Math.sin(point.angle) * amplitude;

  this.ctx.fillStyle = color;
  this.ctx.fillRect(x,y, 1, 1);

  this.ctx.lineTo(x,y);


};

/**
 * Zeichne einen Punkt der auf einer Welle liegt.
 * Wird zum Hervorheben verwendet
 * @param point
 * @param amplitude
 * @param color
 * @param radius
 */

Display.drawPointOnWave = function drawPointOnWave(point,amplitude,color,radius) {

  var x = point.x;
  var y = 250+Math.sin(point.angle) * amplitude;

  this.ctx.fillStyle = color;
  this.ctx.beginPath();
  this.ctx.arc(x,y,radius,0, 2*Math.PI);
  this.ctx.fillStyle = 'black';
  this.ctx.fill();

};

Display.drawSimplePoint = function drawSimplePoint(x,y,color,radius) {

  this.ctx.fillStyle = color;
  this.ctx.beginPath();
  this.ctx.arc(x,y,radius,0, 2*Math.PI);
  this.ctx.fillStyle = 'black';
  this.ctx.fill();

};

/**
 * Zeichne eine Welle, die aus sich aus mehreren Wellen zusammensetzt
 * @param waves
 * @param color
 */

Display.drawCombinedWave = function drawCombinedWave(waves, color) {

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

/**
 * Zeichne wichtige Element wie beispielsweise die X und Y Achse
 */

Display.drawInterface = function drawInterface() {

  var y = 2;

  this.ctx.fillStyle = 'black';
  this.ctx.strokeStyle = 'black';
  this.ctx.lineWidth = 2;
  this.ctx.font = '20px Arial';

  // X-Achse
  this.ctx.beginPath();
  this.ctx.moveTo(0,250);
  this.ctx.lineTo(Display.width, 250);
  this.ctx.stroke();
  // Y-Achse
  this.ctx.beginPath();
  for(var i = 50; i <= 500; i+=100) {
    this.ctx.moveTo(0, i);
    this.ctx.lineTo(15,i);

    this.ctx.fillText(y.toString(),0,i-10);
    y--;
  }
  this.ctx.stroke();

};

Display.getPoints = function getPoints() {

  return Math.round(Display.width / RESOLUTION);

};

// Welt
// ##################################################################################################################### //

/** Welt
 * ---------------------------
 * In der Welt werden alle Wellen gespeichert
 * um eine möglichst übersichtliche Referenz
 * zu erhalten
 * @constructor
 */

var World = {

  waves: []

};

/**
 * Zeichne alle Punkte, die in der Welt existieren
 */

World.drawWaves = function drawWaves() {

  for(var i = 0; i < this.waves.length; i++) {

    this.waves[i].draw();

  }

};

/**
 * Erstelle eine neue Welle
 * @param c Ausbreitungsgeschwindigkeit
 * @param frequency Frequenz
 * @param amplitude Amplitude
 */

World.createWave = function createWave(c,frequency,amplitude) {

  var wave = new Wave(c,frequency,amplitude);
  this.waves.push(wave);
  return wave;

};

/**
 * Erstelle eine neue Welle, die aus der Überlagerung
 * von mehreren Wellen ensteht
 * @param waves
 * @returns {CombinedWave}
 */

World.createCombinedWave = function createCombinedWave(waves) {

  var cw = new CombinedWave(waves);
  this.waves.push(cw);
  return cw;

};

/**
 * Animiere alle Wellen
 */

World.simulate = function simulate() {

  for(var i = 0; i < this.waves.length; i++) {

    if(this.waves[i] instanceof Wave)
        this.waves[i].simulate();

  }

};

// Welle
// ##################################################################################################################### //

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


  this.init();

}

Wave.prototype.init = function init() {

  this.points = new Array(Display.getPoints());

  for(var i = 0; i < Display.getPoints(); i++) {

    this.points[i] = new Point(i*RESOLUTION, 0);

  }


};

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

    // Bestimme den Punkt abhängig von der Richtung
    if(this.reverse) {

      point = this.points[this.points.length - (i+1)];

    } else {

      point = this.points[i];

    }


    point.angle = 0; // Setze den Winkel zurück, falls die Welle neugestartet wird

    var T = 1 / this.frequency;
    var lambda = this.c * T;

    if (this.time * this.c >= i) {
      point.setAngle((2 * Math.PI * (this.time / T - (i*RESOLUTION) / lambda)) + this.phi); // Berechne den Winkel des Zeigers
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

Point.prototype.setAngle = function addAngle(angle) {

  //var flooredAngle = Math.floor(angle / (2*Math.PI));
  //angle            = angle - flooredAngle;
  this.angle       = angle;

};

// Kombinierte Welle
// ##################################################################################################################### //

function CombinedWave(waves) {

  this.waves = waves;
  this.color = 'green';
  this.running = true;

}

CombinedWave.prototype.draw = function draw() {

  Display.drawCombinedWave(this.waves, this.color);

};

// Zeigermodell
// ##################################################################################################################### //

/**
 * Erstelle ein neues Zeigermodell
 * @param element Zeichencanvas
 * @param waves   Welle(n), die dargestellt werden
 * @constructor
 */

function Circle(element, waves) {

  this.waves        = waves;
  this.element      = element;
  this.ctx          = this.element.getContext('2d');
  this.visible      = true;
  this.gesAmplitude = 0;
  this.showAngle    = true;

}

/**
 * Setze die dargestellten Wellen
 * @param waves {Array}
 */

Circle.prototype.setWaves = function setWaves(waves) {
  this.waves = waves;
};

Circle.prototype.toggle = function toggle() {

  if(this.visible) {
    this.element.style.display = 'none';
    Display.element.style.left = '0';
  } else {
    this.element.style.display = 'block';
    Display.element.style.left = '500px';
  }

  this.visible = !this.visible;

};

/**
 * Zeichne den Kreis, welche den Punkt
 * pointIndex verwendet
 * @param pointIndex Zu zeichnender Index des Punktes
 */

Circle.prototype.draw = function draw(pointIndex) {

  if(this.visible && this.waves != null) {

    var gesY         = 0;
    var gesAmplitude = 0;
    var marginLeft;
    var x;
    var y;

    this.ctx.clearRect(0,0,500,500);


    for(var i = 0; i < this.waves.length; i++) {
      gesAmplitude += this.waves[i].amplitude;
    }

    if(this.gesAmplitude != gesAmplitude) {

      this.gesAmplitude = gesAmplitude;
      console.log(gesAmplitude - 500);
      this.element.style.left = (gesAmplitude - 250) + 'px';

    }


    marginLeft = 490 - gesAmplitude;

    x = marginLeft;
    y = 250;

    this.ctx.lineWidth = 3;

    for(var i = 0; i < this.waves.length; i++) {

      var wave  = this.waves[i];
      var point = wave.points[pointIndex];
      var angle = point.angle;

      var newX = -Math.cos(angle)*wave.amplitude+marginLeft;
      var newY = Math.sin(angle)*wave.amplitude+250;

      this.ctx.beginPath();
      this.ctx.strokeStyle = wave.color;

      if(this.showAngle) {

        this.ctx.beginPath();
        this.ctx.arc(x,y,wave.amplitude / 2, angle, 0, true);
        this.ctx.stroke();

      }

      // Zeichne den Pfeil
      if(i != 0) {
        drawArrow(this.ctx,x,y,newX-marginLeft+x,newY-250+y); // Anschließende Pfeile
      } else {
        drawArrow(this.ctx, x,y, newX, newY); // Erster Pfeil
      }

      this.ctx.stroke();

      x = newX;
      y = newY;

      // Hebe den Punkt hervor
      Display.drawPointOnWave(point, wave.amplitude, wave.color, 5);

      gesY += newY;


    }


    // Zeichne den Kreis
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'black';

    this.ctx.beginPath();
    this.ctx.arc(490-gesAmplitude, 250, gesAmplitude+3, 0, 2*Math.PI);
    this.ctx.stroke();


  }

};

// Nützliche Funktionen 
// ##################################################################################################################### //

/**
 * Zeichne einen Pfeil auf einem JSCanvas
 * @author Titus Cieslewski http://stuff.titus-c.ch/arrow.html
 * @param context
 * @param fromx
 * @param fromy
 * @param tox
 * @param toy
 */

function drawArrow(context, fromx, fromy, tox, toy){
  var headlen = 10;   // length of head in pixels
  var angle = Math.atan2(toy-fromy,tox-fromx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
  context.moveTo(tox, toy);
  context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
}

function resetEverything() {

  for(var i = 0; i < 3; i++) {

    World.waves[i].restart();

  }

}

// Programmablauf 
// ##################################################################################################################### //

/**
 * Programmloop
 * -----------------------
 * Sorge dafür, dass die Wellen falls gewollt animiert
 * und gezeichnet werden
 */

function loop() {

  Display.ctx.clearRect(0,0,Display.width,Display.height);

  World.drawWaves();  // Zeichne die erstellten Wellen
  World.simulate();   // Aktualisiere die Wellen

  Display.drawInterface(); // Zeichne das Koordinatensystem und weitere
                           // Elemente

  circle.draw(50);

  // ~~~ Messe die Bilder pro Sekunde ~~~ //
  FPS++;
  if(new Date().getTime() > oldTime + 200) {

    FPS = FPS * 5;

    document.getElementById('info-log').innerHTML = 'FPS: ' + FPS;

    FPS = 0;
    oldTime = new Date().getTime();

  }

  window.requestAnimationFrame(loop);

}

var PerformanceAnalyzer = {
  performanceScore: 0
};

PerformanceAnalyzer.checkPerformance = function checkPerformance() {

  var a = 0;

  for(var i = 0; i < 50000; i++) {
    a += Math.random()*2;
  }

};

PerformanceAnalyzer.execute = function execute() {

  for(var i = 0; i < 10; i++) {

    var time = new Date().getTime();
    PerformanceAnalyzer.checkPerformance();
    PerformanceAnalyzer.performanceScore += new Date().getTime() - time;
  }

  RESOLUTION = Math.round(PerformanceAnalyzer.performanceScore / 15);

};

PerformanceAnalyzer.execute();

Display.init();

World.createWave(1,0.005,100);
//World.createWave(2,0.01,50);

//World.createCombinedWave([World.waves[0], World.waves[1]]);

var circle = new Circle(document.getElementById('clock-display'));

circle.setWaves([World.waves[0]]);

loop();

World.waves[0].start();
//World.waves[1].start();
//World.waves[1].color = 'red';

World.waves[0].phi = 3.14;

