/** GFS Physik Schwingungen und Wellen
 * ==============================================
 * @author Alexander Niedermayer - 26.06.2017
 * @version 0.1 Alpha
 * @description Anwendung zur hoffentlich flüssigen Simulation
 *              von verschiedenen physikalischen Phänomenen im
 *              Zusammenhang mit Wellen
 *
 */

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

StDisplay.prototype.drawPoint = function drawPoint(point) {

  this.ctx.fillStyle = 'black';
  this.ctx.fillRect(point.x,250+Math.sin(point.angle)*250, 1, 1);

};

const Display = new StDisplay(document.getElementById('display'));


/**
 *
 * @constructor
 */

function StWorld() {

  this.points = new Array(3);

  for(var i = 0; i < 3; i++) {
    this.points[i] = new Array(Display.width / 2);

    for(var k = 0; k < this.points[i].length; k++) {

      this.points[i][k] = new Point(k*2, 0);

    }

  }

}

StWorld.prototype.loopPoints = function loopPoints(arrayIndex,callback) {

  for(var i = 0; i < this.points[arrayIndex].length; i++) {

    callback(this.points[arrayIndex][i]);

  }

};

StWorld.prototype.drawPoints = function drawPoints() {

  for(var i = 0; i < 3; i++) {

    for(var k = 0; k < this.points[i].length; k++) {

      Display.drawPoint(this.points[i][k]);

    }

  }

};

function Point(x,y) {

  this.x = x;
  this.y = y;
  this.angle = 0;

}

Point.prototype.increase = function increase(value) {

  this.angle += value;
  if(this.angle >= 360) {
    this.angle = this.angle - 360;
  }

};

var oldTime = 0;
var FPS     = 0;

function loop() {

  Display.ctx.clearRect(0,0,Display.width,Display.height);
  World.drawPoints();

  World.loopPoints(0, function(point) {
    point.increase(.05);
  });

  // FPS Zähler
  FPS++;
  if(new Date().getTime() > oldTime + 1000) {

    console.log(FPS);
    FPS = 0;
    oldTime = new Date().getTime();

  }


  window.requestAnimationFrame(loop);
}

Display.init();

const World = new StWorld();

loop();
