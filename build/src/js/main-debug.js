(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mainCircle = undefined;

var _Display = require('./lib/Display.js');

var _Display2 = _interopRequireDefault(_Display);

var _World = require('./lib/World.js');

var _World2 = _interopRequireDefault(_World);

var _Wave = require('./lib/Wave.js');

var _Point = require('./lib/Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _PerformanceAnalyzer = require('./lib/PerformanceAnalyzer.js');

var _Circle = require('./lib/Circle.js');

var _UserInterface = require('./lib/UserInterface.js');

var _LongitudinalHandler = require('./lib/LongitudinalHandler.js');

var _LongitudinalHandler2 = _interopRequireDefault(_LongitudinalHandler);

var _Reflect = require('./lib/Reflect');

var _Reflect2 = _interopRequireDefault(_Reflect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// VARIABLEN
// #################################################################################################  //

var FPS = 0;
var mainCircle = exports.mainCircle = void 0;
var oldTime = 0;

// PROGRAMMSTART
// #################################################################################################  //

var initProgram = function initProgram() {

  // Analysiere die Leistung des verwendeten Systems
  _PerformanceAnalyzer.PerformanceAnalyzer.execute();

  // Initialisiere die Anzeigefläche der Wellen
  _Display2.default.init();
  // Initialisiere die statischen Bedienelemente
  _UserInterface.StaticInterface.init();
  // Initialisiere die Funktion eine Welle zu reflektieren
  _Reflect2.default.init();

  // Erstelle die kombinierte Welle und lege sie in Platz 0 ab
  var combinedWave = _World2.default.createCombinedWave([]);
  combinedWave.color = 'green';

  _World2.default.createWave(1, 0.005, 100);

  // Erstelle ein neues Zeigermodell
  exports.mainCircle = mainCircle = new _Circle.Circle(document.getElementById('clock-display'), null);
  mainCircle.setWaves([_World2.default.waves[1]]);
  mainCircle.toggle();
  _Circle.SmallCircleDisplay.init(_World2.default.waves[1]);

  // Starte die erste Welle
  _World2.default.waves[1].start();

  // Starte die Animationsschleife
  loop();
};

window.onload = function () {

  initProgram();
};

// PROGRAMMLOOP
// #################################################################################################  //

var loop = function loop() {

  _Display2.default.ctx.fillStyle = 'white';
  _Display2.default.ctx.fillRect(0, 0, _Display2.default.width, _Display2.default.height);

  _World2.default.simulate(); // Aktualisiere die Wellen
  _World2.default.drawWaves(); // Zeichne die erstellten Wellen

  _Display2.default.drawInterface(); // Zeichne das Koordinatensystem und weitere
  // Elemente

  _Reflect2.default.draw();

  mainCircle.draw(50 / _PerformanceAnalyzer.RESOLUTION); // Zeichne das große Zeigermodell

  _Circle.SmallCircleDisplay.draw();

  _PerformanceAnalyzer.PerformanceAnalyzer.update(); // Messe die Bilder pro Sekunde
  // und verbessere wenn nötig die Performance

  window.requestAnimationFrame(loop);
};

},{"./lib/Circle.js":2,"./lib/Display.js":3,"./lib/LongitudinalHandler.js":4,"./lib/PerformanceAnalyzer.js":5,"./lib/Point.js":6,"./lib/Reflect":7,"./lib/UserInterface.js":8,"./lib/Wave.js":10,"./lib/World.js":11}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SmallCircle = exports.SmallCircleDisplay = exports.Circle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = require('./Utils.js');

var _Display = require('./Display.js');

var _Display2 = _interopRequireDefault(_Display);

var _PerformanceAnalyzer = require('./PerformanceAnalyzer.js');

var _Point = require('./Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _LongitudinalHandler = require('./LongitudinalHandler.js');

var _LongitudinalHandler2 = _interopRequireDefault(_LongitudinalHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ZEIGERMODELL 
// #################################################################################################  //

var Circle = exports.Circle = function () {

  // KONSTRUKTOR 
  // ###############################################################################################  //

  function Circle(element, waves) {
    _classCallCheck(this, Circle);

    this.waves = waves;
    this.element = element;
    this.ctx = this.element.getContext('2d');
    this.visible = true;
    this.gesAmplitude = 0;
    this.showAngle = true;
  }

  // FUNKTIONEN 
  // ###############################################################################################  //

  /**
   * Setze die Wellen, welche angezeigt werden
   * 
   * @param {array} waves
   * @memberof Circle
   */

  _createClass(Circle, [{
    key: 'setWaves',
    value: function setWaves(waves) {
      this.waves = waves;
    }

    /**
     * Zeige / Verstecke das Zeigermodell
     * 
     * @memberof Circle
     */

  }, {
    key: 'toggle',
    value: function toggle() {

      if (this.visible) {
        this.element.style.display = 'none';
        _Display2.default.element.style.left = '0';
        _Display2.default.smallClockElement.style.left = '0';
      } else {

        if (_LongitudinalHandler2.default.running) return;

        this.element.style.display = 'block';
        _Display2.default.element.style.left = '500px';
        _Display2.default.smallClockElement.style.left = '500px';
      }

      this.visible = !this.visible;
    }

    /**
     * Zeichne das Zeigermodell
     * 
     * @param {number} pointIndex Verwendeter Punkt
     * @memberof Circle
     */

  }, {
    key: 'draw',
    value: function draw(_pointIndex) {

      var pointIndex = Math.round(_pointIndex);

      if (this.visible && this.waves != null) {

        var gesY = 0;
        var gesAmplitude = 0;
        var marginLeft;
        var x;
        var y;

        this.ctx.clearRect(0, 0, 500, 500);

        // Berechne die gesamte Amplitude
        for (var i = 0; i < this.waves.length; i++) {
          gesAmplitude += this.waves[i].amplitude;
        }

        // Berechne die neue Position des Canvas, falls sich
        // die maximale Amplitude ändert
        if (this.gesAmplitude != gesAmplitude) {

          this.gesAmplitude = gesAmplitude;
          this.element.style.left = gesAmplitude - 250 + 'px';
        }

        marginLeft = 490 - gesAmplitude;

        x = marginLeft;
        y = 250;

        this.ctx.lineWidth = 3;

        var offset = {
          x: 0,
          y: 0

          // Zeichne einen neuen Zeiger für jede Welle
        };for (var i = 0; i < this.waves.length; i++) {

          var wave = this.waves[i];
          var point = wave.points[pointIndex];
          var angle = point.angle;

          this.ctx.beginPath();
          this.ctx.strokeStyle = wave.color;

          // Erstelle eine Kreisform zum Anzeigen der aktuellen Zeigerposition
          if (this.showAngle && angle != wave.phi) {

            this.ctx.beginPath();

            var startAngle = 2 * Math.PI - wave.phi;
            var circleAngle = 2 * Math.PI - angle;

            this.ctx.arc(x, y, wave.amplitude / 2, startAngle, circleAngle, true);
            this.ctx.stroke();
          }

          offset.x = Math.cos(angle) * wave.amplitude;
          offset.y = -Math.sin(angle) * wave.amplitude;

          (0, _Utils.drawArrow)(this.ctx, x, y, x + offset.x, y + offset.y);

          this.ctx.stroke();

          x += offset.x;
          y += offset.y;

          // Hebe den Punkt hervor
          if (!_LongitudinalHandler2.default.running && wave.visible) _Display2.default.drawPointOnWave(point, wave.amplitude, wave.color, 5);

          gesY += offset.y;
        }

        // Zeichne den Kreis
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'black';

        this.ctx.beginPath();
        this.ctx.arc(490 - gesAmplitude, 250, gesAmplitude + 3, 0, 2 * Math.PI);
        this.ctx.stroke();
      }
    }
  }]);

  return Circle;
}();

// KLEINES ZEIGERMODELL 
// #################################################################################################  //


/**
 * Klasse zum Anzeigen vieler kleiner Zeigermodelle für
 * mehrere Punkte
 * @class SmallCircleDisplay
 */

var SmallCircleDisplay = exports.SmallCircleDisplay = function () {
  function SmallCircleDisplay() {
    _classCallCheck(this, SmallCircleDisplay);
  }

  _createClass(SmallCircleDisplay, null, [{
    key: 'init',


    // INITIALISIERUNG 
    // ###############################################################################################  //

    /**
     * Initialisiere das Modell mit der gegebenen Welle
     * @param {Wave} wave 
     */

    value: function init(wave) {

      SmallCircleDisplay.element = document.getElementById('small-clock-display');
      SmallCircleDisplay.circles = new Array();
      SmallCircleDisplay.wave = wave;
      SmallCircleDisplay.ctx = SmallCircleDisplay.element.getContext('2d');

      SmallCircleDisplay.visible = false;
      SmallCircleDisplay.element.style.display = 'none';

      var i = 0;

      for (var x = 50; x < parseInt(SmallCircleDisplay.element.getAttribute('width')); x += 90) {

        SmallCircleDisplay.circles[i] = new SmallCircle(x);
        i += 1;
      }
    }

    // FUNKTIONEN 
    // ###############################################################################################  //

    /**
     * Ändere die Welle
     * @param {Wave} wave 
     */

  }, {
    key: 'changeWave',
    value: function changeWave(wave) {

      SmallCircleDisplay.wave = wave;

      var i = 0;

      for (var x = 50; x < parseInt(SmallCircleDisplay.element.getAttribute('width')); x += 90) {

        SmallCircleDisplay.circles[i] = new SmallCircle(x);
        i += 1;
      }
    }

    /**
     * Zeige / Verstecke die Darstellung
     */

  }, {
    key: 'toggle',
    value: function toggle() {

      if (SmallCircleDisplay.visible) SmallCircleDisplay.element.style.display = 'none';else SmallCircleDisplay.element.style.display = 'block';

      SmallCircleDisplay.visible = !SmallCircleDisplay.visible;
    }

    /**
     * Zeichne die Zeigermodelle
     */

  }, {
    key: 'draw',
    value: function draw() {

      if (!SmallCircleDisplay.visible || !SmallCircleDisplay.wave.visible) return;

      SmallCircleDisplay.ctx.fillStyle = 'white';
      SmallCircleDisplay.ctx.fillRect(0, 0, 2000, 50);
      SmallCircleDisplay.ctx.lineWidth = 3;

      var wave = SmallCircleDisplay.wave;

      for (var i = 0; i < SmallCircleDisplay.circles.length; i++) {

        SmallCircleDisplay.ctx.strokeStyle = SmallCircleDisplay.wave.color;
        var dummyPoint = SmallCircleDisplay.circles[i].point;
        SmallCircleDisplay.circles[i].draw();

        if (!_LongitudinalHandler2.default.running) _Display2.default.drawPointOnWave(dummyPoint, wave.amplitude, 'black', 3);
      }
    }
  }]);

  return SmallCircleDisplay;
}();

/**
 * Kleines Zeigermodell
 */

var SmallCircle = exports.SmallCircle = function () {

  // KONSTRUKTOR 
  // ###############################################################################################  //

  /**
   * Erstelle ein neues Zeigermodell mit vorgegebenen x Wert
   * @param {number} x 
   */

  function SmallCircle(x) {
    _classCallCheck(this, SmallCircle);

    this.radius = 25;
    this.x = x;
    this.point = SmallCircleDisplay.wave.points[Math.round(this.x / _PerformanceAnalyzer.RESOLUTION)];
  }

  // FUNKTIONEN 
  // ###############################################################################################  //

  /**
   * Zeichne das Zeigermodell
   */

  _createClass(SmallCircle, [{
    key: 'draw',
    value: function draw() {

      var angle = this.point.angle;

      var direction = {
        x: Math.cos(angle) * 25,
        y: Math.sin(angle) * 25

        // Zeichne den Zeiger
      };SmallCircleDisplay.ctx.beginPath();
      SmallCircleDisplay.ctx.moveTo(this.x, 25);
      SmallCircleDisplay.ctx.lineTo(this.x + direction.x, 25 - direction.y);
      SmallCircleDisplay.ctx.stroke();

      // Zeichne den Strich nach oben
      SmallCircleDisplay.ctx.lineWidth = 1;
      SmallCircleDisplay.ctx.strokeStyle = 'black';
      SmallCircleDisplay.ctx.setLineDash([1, 10]);
      SmallCircleDisplay.ctx.beginPath();
      SmallCircleDisplay.ctx.moveTo(this.x, 5);
      SmallCircleDisplay.ctx.lineTo(this.x, 25);
      SmallCircleDisplay.ctx.stroke();
      SmallCircleDisplay.ctx.setLineDash([0]);
      SmallCircleDisplay.ctx.lineWidth = 3;

      _Display2.default.ctx.setLineDash([1, 10]);
      _Display2.default.ctx.beginPath();
      _Display2.default.ctx.moveTo(this.x, 50);
      _Display2.default.ctx.lineTo(this.x, 600);
      _Display2.default.ctx.stroke();
      _Display2.default.ctx.setLineDash([0]);

      if (SmallCircleDisplay.wave.transversal) return;

      var x = Math.cos(this.point.angle) * SmallCircleDisplay.wave.amplitude;
      var y = 250;

      _Display2.default.drawSimplePoint(this.point.x + x, y, 'red', 5);
    }
  }]);

  return SmallCircle;
}();

},{"./Display.js":3,"./LongitudinalHandler.js":4,"./PerformanceAnalyzer.js":5,"./Point.js":6,"./Utils.js":9}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PerformanceAnalyzer = require('./PerformanceAnalyzer.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Zeichenoberfläche für die Darstellung der Wellen
 * 
 * @export
 * @class Display
 */

var Display = function () {
  function Display() {
    _classCallCheck(this, Display);
  }

  _createClass(Display, null, [{
    key: 'init',


    // INITIALISIERUNG 
    // #############################################################################################  //

    /**
     * Aktualisiere die Breite sowie die Höhe der Zeichenoberfläche
     * 
     * @static
     * @memberof Display
     */

    value: function init() {

      var wrapper = document.getElementById('display-wrapper');

      Display.width = wrapper.clientWidth;
      Display.height = wrapper.clientHeight;

      Display.element = document.getElementById('display');
      Display.ctx = Display.element.getContext('2d');

      Display.smallClockElement = document.getElementById('small-clock-display');

      Display.element.setAttribute('width', Display.width.toString());
      Display.element.setAttribute('height', Display.height.toString());

      Display.smallClockElement.setAttribute('width', Display.width.toString());
      Display.smallClockElement.setAttribute('height', '50');
    }

    // FUNKTIONEN 
    // #############################################################################################  //

    /**
     * Zeichne einen Punkt einer longitudinalen Welle
     * 
     * @static
     * @param {any} point 
     * @param {any} amplitude 
     * @param {any} color 
     * @memberof Display
     */

  }, {
    key: 'drawLongitudinalPoint',
    value: function drawLongitudinalPoint(point, amplitude, color) {

      var x = point.x + Math.cos(point.angle) * amplitude;
      var y = 250;

      Display.ctx.fillStyle = color;

      Display.ctx.fillRect(x, y - 20, 1, 40);

      if (point.index % 25 == 0) Display.drawSimplePoint(x, 250, 'black', 5);

      //Display.ctx.fillRect(x,y,3,3)
    }

    /**
     * Zeichne einen Punkt einer Welle
     * 
     * @static
     * @param {Point} point 
     * @param {number} amplitude 
     * @param {string} color 
     * @memberof Display
     */

  }, {
    key: 'drawPoint',
    value: function drawPoint(point, amplitude, color) {

      var x = point.x;
      var y = 250 + -Math.sin(point.angle) * amplitude; // -sin weil das Koordinatensystem in y Richtung umgedreht ist

      Display.ctx.fillStyle = color;
      //Display.ctx.fillRect(x,y, 1, 1);

      Display.ctx.lineTo(x, y);
    }

    /**
     * Zeichne einen speziellen Punkt auf einer transversalen Welle
     * 
     * @static
     * @param {Point} point 
     * @param {number} amplitude 
     * @param {string} color 
     * @param {number} radius 
     * @memberof Display
     */

  }, {
    key: 'drawPointOnWave',
    value: function drawPointOnWave(point, amplitude, color, radius) {

      var x = point.x;
      var y = 250 + -Math.sin(point.angle) * amplitude;

      Display.ctx.fillStyle = color;
      Display.ctx.beginPath();
      Display.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      Display.ctx.fillStyle = 'black';
      Display.ctx.fill();
    }

    /**
     * Zeichne einen Punkt mit gegebenen x und y Koordinaten
     * 
     * @static
     * @param {number} x 
     * @param {number} y 
     * @param {string} color 
     * @param {number} radius 
     * @memberof Display
     */

  }, {
    key: 'drawSimplePoint',
    value: function drawSimplePoint(x, y, color, radius) {

      Display.ctx.fillStyle = color;
      Display.ctx.beginPath();
      Display.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      Display.ctx.fill();
    }

    /**
     * Zeichne eine Welle, welche aus mehreren Wellen besteht
     * 
     * @static
     * @param {array} waves 
     * @param {string} color 
     * @memberof Display
     */

  }, {
    key: 'drawCombinedWave',
    value: function drawCombinedWave(waves, color) {

      Display.ctx.beginPath();
      Display.ctx.strokeStyle = color;

      for (var k = 0; k < Display.getPoints(); k++) {

        var still = false;
        var x = k * _PerformanceAnalyzer.RESOLUTION;
        var y = 0;

        for (var i = 0; i < waves.length; i++) {

          y -= Math.sin(waves[i].points[k].angle) * waves[i].amplitude;

          if (waves[i].points[k].still) {
            still = true;
          }
        }

        y += 250;

        // Falls nicht alle Punkte sich überlappen soll nicht gezeichnet werden
        if (still) {
          continue;
        }

        Display.ctx.fillStyle = color;
        Display.ctx.lineTo(x, y);
      }

      Display.ctx.stroke();
      Display.ctx.closePath();
    }

    /**
     * Zeichne Hilfselemente wie z.B. die x und y Achse
     * 
     * @static
     * @memberof Display
     */

  }, {
    key: 'drawInterface',
    value: function drawInterface() {

      var y = 2;

      Display.ctx.fillStyle = 'black';
      Display.ctx.strokeStyle = 'black';
      Display.ctx.lineWidth = 2;
      Display.ctx.font = '20px Arial';

      // X-Achse
      Display.ctx.beginPath();
      Display.ctx.moveTo(0, 250);
      Display.ctx.lineTo(Display.width, 250);
      Display.ctx.stroke();
      // Y-Achse
      Display.ctx.beginPath();
      for (var i = 50; i <= 500; i += 100) {
        Display.ctx.moveTo(0, i);
        Display.ctx.lineTo(15, i);

        Display.ctx.fillText(y.toString(), 0, i - 10);
        y--;
      }

      Display.ctx.stroke();
    }

    /**
     * Erhalte die Anzahl an Punkten pro Welle
     * 
     * @static
     * @returns {number} Anzahl der Punkte
     * @memberof Display
     */

  }, {
    key: 'getPoints',
    value: function getPoints() {
      return Math.round(Display.width / _PerformanceAnalyzer.RESOLUTION);
    }
  }]);

  return Display;
}();

exports.default = Display;

},{"./PerformanceAnalyzer.js":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _World = require('./World.js');

var _World2 = _interopRequireDefault(_World);

var _Wave = require('./Wave.js');

var _Main = require('./../Main.js');

var _Reflect = require('./Reflect.js');

var _Reflect2 = _interopRequireDefault(_Reflect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Bearbeite die Umstellung des Programms zum Anzeigen einer longitudinalen Welle
 * 
 * @export
 * @class LongitudinalHandler
 */

var LongitudinalHandler = function () {
  function LongitudinalHandler() {
    _classCallCheck(this, LongitudinalHandler);
  }

  _createClass(LongitudinalHandler, null, [{
    key: 'init',


    /**
     * Initialisiere die longitudinale Welle
     * 
     * @static
     * @memberof LongitudinalHandler
     */

    value: function init() {

      LongitudinalHandler.running = true;

      if (_Main.mainCircle.visible) _Main.mainCircle.toggle();

      for (var i = 0; i < _World2.default.waves.length; i++) {

        if (_World2.default.waves[i] != undefined && _World2.default.waves[i] instanceof _Wave.Wave) _World2.default.waves[i].interface.deleteWave();
      }

      _World2.default.waves = [];

      var wave = _World2.default.createWave(1, 0.0025, 50);
      wave.transversal = false;
      wave.start();

      _Reflect2.default.mode = 0;
    }
  }]);

  return LongitudinalHandler;
}();

exports.default = LongitudinalHandler;

},{"./../Main.js":1,"./Reflect.js":7,"./Wave.js":10,"./World.js":11}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PerformanceAnalyzer = exports.RESOLUTION = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _World = require('./World.js');

var _World2 = _interopRequireDefault(_World);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Eine Welle besteht aus mehreren Punkte die abhängig von einander unterschiedliche
 * Werte zugewiesen bekommen. Die Anzahl der Punkte hängt von dieser Variable ab.
 * Dies bedeuetet, dass bei 1 jedes Pixel einen Punkt zugewiesen bekommt.
 * Bei 2 nur jedes zweite Pixel etc.
 */

var RESOLUTION = exports.RESOLUTION = 1;

/**
 * Analysiere die Leistung des Rechners und passe abhängig von der
 * Leistungsfähigkeit das Programm an.
 * Falls der Rechner nicht leistungsstark genug ist um die Welle in
 * aktzeptabler Zeit darzustellen wird die schärfe der Darstellung herunter
 * gedreht und somit der Rechenprozess vereinfacht
 * 
 * @export
 * @class PerformanceAnalyzer
 */

var PerformanceAnalyzer = exports.PerformanceAnalyzer = function () {
    function PerformanceAnalyzer() {
        _classCallCheck(this, PerformanceAnalyzer);
    }

    _createClass(PerformanceAnalyzer, null, [{
        key: '_checkPerformance',


        /**
         * Analyisiere die ungefähre Rechenleistung ( sehr primitiv )
         * 
         * @private
         * @static
         * @memberof PerformanceAnalyzer
         */

        value: function _checkPerformance() {

            var a = 0;

            for (var i = 0; i < 50000; i++) {

                a += Math.random() * 2;
            }
        }

        /**
         * Analysiere 10x die Rechenleistung und bilde den Mittelwert
         * 
         * @static
         * @memberof PerformanceAnalyzer
         */

    }, {
        key: 'execute',
        value: function execute() {

            // Initialisierung

            PerformanceAnalyzer.FPS = 0;
            PerformanceAnalyzer.oldTime = new Date().getTime();
            PerformanceAnalyzer.averageFPS = 60;

            // Messung der durchschnittlichen Leistung
            PerformanceAnalyzer.performanceScore = 0;

            for (var i = 0; i < 10; i++) {

                var time = new Date().getTime();
                PerformanceAnalyzer._checkPerformance();
                PerformanceAnalyzer.performanceScore += new Date().getTime() - time;
            }

            exports.RESOLUTION = RESOLUTION = Math.round(PerformanceAnalyzer.performanceScore / 15);

            if (RESOLUTION <= 0) {
                exports.RESOLUTION = RESOLUTION = 1;
            }
        }

        /**
         * Messe die Bilder pro Sekunde und passe das Programm dynamisch an,
         * falls ein Einbruch der Bildrate erkennbar wird
         * 
         * @static
         * @memberof PerformanceAnalyzer
         */

    }, {
        key: 'update',
        value: function update() {

            PerformanceAnalyzer.FPS += 1;

            if (new Date().getTime() > PerformanceAnalyzer.oldTime + 1000) {

                document.getElementById('info-log').innerHTML = 'FPS: ' + PerformanceAnalyzer.FPS + ' at ' + RESOLUTION;

                PerformanceAnalyzer.averageFPS = PerformanceAnalyzer.FPS;

                PerformanceAnalyzer.optimizeProgram();

                PerformanceAnalyzer.FPS = 0;
                PerformanceAnalyzer.oldTime = new Date().getTime();
            }
        }
    }, {
        key: 'optimizeProgram',
        value: function optimizeProgram() {

            if (PerformanceAnalyzer.averageFPS < 35 && RESOLUTION < 10) {

                exports.RESOLUTION = RESOLUTION += 1;
                _World2.default.reInit();
            } else if (PerformanceAnalyzer.averageFPS > 52 && RESOLUTION > 1) {

                exports.RESOLUTION = RESOLUTION -= 1;
                _World2.default.reInit();
            }
        }
    }]);

    return PerformanceAnalyzer;
}();

},{"./World.js":11}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Einfache Klasse um einen Punkt auf der Welle zu simulieren
 * 
 * @export
 * @class Point
 */

var Point = function () {

    // KONSTRUKTOR 
    // #############################################################################################  //

    /**
     * Erstelle eine neue Instanz eines Punktes
     * @param {number} x   x Koordinate 
     * @param {number} y   y Koordinate
     * @param {number} index  Speicherplatz der in der Reihung belegt wird  
     * @memberof Point
     */

    function Point(x, y, index) {
        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;
        this.angle = 0;
        this.index = index;

        this.still = true;
    }

    // FUNKTIONEN 
    // #############################################################################################  //

    /**
     * Vereinfache das aktuelle Bogenmaß
     * 4PI -> 2PI
     * 3PI -> 1.5PI
     * 
     * @memberof Point
     */

    _createClass(Point, [{
        key: "breakAngleDown",
        value: function breakAngleDown() {

            var debug = false;

            if (this.x == 0) {
                debug = true;
            }

            if (this.angle > 2 * Math.PI) {

                var correctFactor = Math.floor(this.angle / (2 * Math.PI));

                this.angle = this.angle - correctFactor * (2 * Math.PI);
            }
        }

        /**
         * Ändere den aktuellen Winkel des Punktes
         * 
         * @param {number} angle Bogenmaß
         * @memberof Point
         */

    }, {
        key: "setAngle",
        value: function setAngle(angle) {
            this.angle = angle;
            this.breakAngleDown();
        }
    }]);

    return Point;
}();

exports.default = Point;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Wave = require('./Wave.js');

var _World = require('./World.js');

var _World2 = _interopRequireDefault(_World);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Diese Klasse ist für die Umstellung zur globalen Reflexion transversaler
 * Wellen zuständig.
 * Ebenso werden auch die grafischen Elemente für die Reflexion bereit gestellt
 * 
 * @export
 * @class Reflect
 */

var Reflect = function () {
  function Reflect() {
    _classCallCheck(this, Reflect);
  }

  _createClass(Reflect, null, [{
    key: 'init',


    /**
     * Grundlegende Einstellung für die Reflexion
     * 
     * @static
     * @memberof Reflect
     */

    value: function init() {

      Reflect.vivisble = false;

      Reflect.element = document.getElementById('display');
      Reflect.ctx = Reflect.element.getContext('2d');

      Reflect.mode = 0; // 0 = nicht vorhanden, 1 = festes Ende, 2 = loses Ende
    }

    /**
     * Zeichne die grafischen Elemente wenn
     * benötigt
     * 
     * @static
     * @memberof Reflect
     */

  }, {
    key: 'draw',
    value: function draw() {

      if (Reflect.mode == 0) return;

      if (Reflect.mode == 1) Reflect.ctx.fillStyle = 'black';else Reflect.ctx.fillStyle = 'rgb(75,150,255)';
      Reflect.ctx.fillRect(parseInt(Reflect.element.getAttribute('width')) - 10, 0, 10, 500);
    }
  }]);

  return Reflect;
}();

exports.default = Reflect;

},{"./Wave.js":10,"./World.js":11}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StaticInterface = exports.UserInterface = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = require('./Utils.js');

var _World = require('./World.js');

var _World2 = _interopRequireDefault(_World);

var _PerformanceAnalyzer = require('./PerformanceAnalyzer.js');

var _Wave = require('./Wave.js');

var _Main = require('./../Main.js');

var _Circle = require('./Circle');

var _LongitudinalHandler = require('./LongitudinalHandler.js');

var _LongitudinalHandler2 = _interopRequireDefault(_LongitudinalHandler);

var _Reflect = require('./Reflect');

var _Reflect2 = _interopRequireDefault(_Reflect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CONTAINER = document.getElementById('container');

/**
 * Klasse zum grafischen bearbeiten verschiedener Eigenschaften einer Welle
 * 
 * @export
 * @class UserInterface
 */

var UserInterface = exports.UserInterface = function () {

    // KONSTRUKTOR 
    // ###############################################################################################  //

    /**
     * Erstelle eine neue Instanz eines UserInterfaces mit der gewünschten Wellen ID
     * @param {number} waveid index in World.waves
     * @memberof UserInterface
     */

    function UserInterface(waveid) {
        _classCallCheck(this, UserInterface);

        this.waveid = waveid;
        this.contentToggled = false;
        this.interferenz = false;
        this.intervals = [];

        this.wrapper = document.createElement('div');
        this.head = document.createElement('div');
        this.content = document.createElement('div');
        this.sliderContainer = document.createElement('div');

        this.init();
        this.update();
    }

    // INITIALISIERUNG 
    // ###############################################################################################  //

    /**
     * Füge die verschiedenen Elemente dem gesamten Element hinzu und editiere die Klassenattribute
     * der Elemente
     * 
     * @memberof UserInterface
     */

    _createClass(UserInterface, [{
        key: 'init',
        value: function init() {

            this.wrapper.setAttribute('class', 'wave');
            this.head.setAttribute('class', 'head');
            this.content.setAttribute('class', 'content');

            this.wrapper.appendChild(this.head);
            this.wrapper.appendChild(this.content);

            CONTAINER.appendChild(this.wrapper);
        }

        // FUNKTIONEN 
        // ###############################################################################################  //

        /**
         * Schließe den Bereich zum Editieren der Welle
         * 
         * @memberof UserInterface
         */

    }, {
        key: 'closeContent',
        value: function closeContent() {

            this.content.innerHTML = '';
        }

        /**
         * Öffne den Bereich zum Editieren der Welle
         * 
         * @memberof UserInterface
         */

    }, {
        key: 'openContent',
        value: function openContent() {

            var _interface = this;

            // BUTTON SETUP 
            // #############################################################################################  //

            var buttonContent = document.createElement('div');
            buttonContent.setAttribute('class', 'buttons');

            // Erstelle einen Knopf zum Ändern der Farbe
            var colorButton = (0, _Utils.generateIcon)('fa-paint-brush fa-3x');
            colorButton.setAttribute('title', 'Farbe ändern');
            colorButton.addEventListener('click', function () {

                var colorPicker = document.getElementById('color-picker');
                colorPicker.focus();
                colorPicker.value = _World2.default.waves[_interface.waveid].color;
                colorPicker.click();

                var __interface = _interface;

                colorPicker.onchange = function () {
                    _World2.default.waves[_interface.waveid].color = colorPicker.value;
                    __interface.update();
                };
            });

            buttonContent.appendChild(colorButton);

            // Erstelle einen Knopf zum Ändern der Ausbreitungsrichtung
            var reverseButton = (0, _Utils.generateIcon)('fa-arrow-left fa-3x');
            reverseButton.setAttribute('title', 'Ausbreitungsrichtung ändern');
            reverseButton.addEventListener('click', function () {
                _World2.default.waves[_interface.waveid].reverse = !_World2.default.waves[_interface.waveid].reverse;
            });

            buttonContent.appendChild(reverseButton);

            // Erstelle einen Knopf zum Anzeigen der Wellenlänge
            var waveLengthButton = (0, _Utils.generateIcon)('fa-arrows-h fa-3x');
            waveLengthButton.setAttribute('title', 'Wellenlänge anzeigen');
            waveLengthButton.addEventListener('click', function () {
                _World2.default.waves[_interface.waveid].showWaveLength = !_World2.default.waves[_interface.waveid].showWaveLength;
            });

            buttonContent.appendChild(waveLengthButton);

            this.content.appendChild(buttonContent);

            // RANGE SLIDER SETUP 
            // #############################################################################################  //

            this.addSlider('Amplitude', (0, _Utils.createSlider)(0, 2, 0.01, _World2.default.waves[this.waveid].amplitude / 100), 'amplitude');
            this.addSlider('Frequenz', (0, _Utils.createSlider)(0.001, 0.05, 0.00005, _World2.default.waves[this.waveid].frequency), 'frequency');
            this.addSlider('Ausbreitungsgeschwindigkeit', (0, _Utils.createSlider)(0, 15, 0.1, _World2.default.waves[this.waveid].c), 'c');
            this.addSlider('Phasenverschiebung', (0, _Utils.createSlider)(0, 720, 1, _World2.default.waves[this.waveid].phi / (2 * Math.PI / 360)), 'phi');
        }

        /**
         * Füge dem Kontent ein neues Input[type=range] Element hinzu
         * 
         * @param {string} title 
         * @param {element} slider 
         * @param {string} key 
         * @memberof UserInterface
         */

    }, {
        key: 'addSlider',
        value: function addSlider(title, slider, key) {

            var _interface = this;
            var wrapper = document.createElement('div');
            var output = document.createElement('output');

            slider.setAttribute('id', title + this.waveid);

            wrapper.setAttribute('class', 'slider-container');
            wrapper.innerHTML = '<h4> ' + title + ' </h4>';
            output.innerHTML = slider.getAttribute('value');

            wrapper.appendChild(slider);
            wrapper.appendChild(output);

            this.content.appendChild(wrapper);

            var oldValue = slider.value;

            var interval = setInterval(function () {

                var wave = _World2.default.waves[_interface.waveid];
                var value = slider.value;

                if (oldValue == value) return;

                oldValue = value;

                output.innerHTML = value;

                switch (key) {

                    case 'amplitude':
                        wave.amplitude = value * 100;
                        break;

                    case 'phi':
                        wave.setPhi(value * (2 * Math.PI / 360));
                        break;

                    default:
                        wave[key] = value;
                        break;

                }

                _interface.update();
            }, _PerformanceAnalyzer.RESOLUTION * 10);

            this.intervals.push(interval);
        }

        /**
         * Aktualisiere die Kopfzeile des Elements
         * 
         * @memberof UserInterface
         */

    }, {
        key: 'update',
        value: function update() {

            var _interface = this;

            // Erstelle die ersten Inhalte für die Kopfzeile
            var name = '<h1>Welle ' + this.waveid + '</h1>';
            var amplitude = (0, _Utils.getText)('Amplitude', _World2.default.waves[this.waveid].amplitude / 100);
            var frequency = (0, _Utils.getText)('Frequenz', _World2.default.waves[this.waveid].frequency);
            var speed = (0, _Utils.getText)('Ausbreitungsgeschw.', _World2.default.waves[this.waveid].c);

            // Erstelle die Symbole zum bearbeiten der Welle
            var iconEdit = document.createElement('i');
            iconEdit.setAttribute('class', 'fa fa-dashboard fa-2x');

            iconEdit.addEventListener('click', function () {
                _interface.onToggleSettings();
            });

            var iconClose = document.createElement('i');
            iconClose.setAttribute('class', 'fa fa-times-circle fa-2x');

            iconClose.addEventListener('click', function () {
                _interface.deleteWave();
            });

            this.head.style.borderLeft = '10px solid ' + _World2.default.waves[this.waveid].color;

            // Erstelle die Checkboxen für die Sichtbarkeit und Interferenz
            var interferenz = document.createElement('div');
            var checkBox = document.createElement('input');
            checkBox.setAttribute('type', 'checkbox');

            interferenz.innerHTML = '<span>Interferenz: </span>';
            interferenz.appendChild(checkBox);

            interferenz.style.borderLeft = '1px solid black';
            interferenz.style.paddingLeft = '30px';

            checkBox.checked = this.interferenz;

            checkBox.addEventListener('change', function () {

                var checked = checkBox.checked;

                if (checked) {
                    _World2.default.waves[0].addWave(_World2.default.waves[_interface.waveid]);
                } else {
                    _World2.default.waves[0].removeWave(_World2.default.waves[_interface.waveid]);
                }

                _interface.interferenz = checked;
            });

            var visible = document.createElement('div');
            var visibleCheckBox = document.createElement('input');
            visibleCheckBox.setAttribute('type', 'checkbox');

            visible.innerHTML = '<span class="fa fa-eye"></span> ';
            visible.appendChild(visibleCheckBox);

            visibleCheckBox.checked = _World2.default.waves[this.waveid].visible;

            visibleCheckBox.addEventListener('change', function () {

                var checked = visibleCheckBox.checked;

                _World2.default.waves[_interface.waveid].visible = checked;
            });

            // Füge die Elemente der Kopfzeile hinzu
            this.head.innerHTML = name + amplitude + frequency + speed;
            this.head.appendChild(interferenz);
            this.head.appendChild(visible);
            this.head.appendChild(iconClose);
            this.head.appendChild(iconEdit);
        }

        /**
         * Lösche die Welle
         * 
         * @memberof UserInterface
         */

    }, {
        key: 'deleteWave',
        value: function deleteWave() {

            for (var i = 0; i < this.intervals.length; i++) {
                clearInterval(this.intervals[i]);
            }

            var combinedWaves = [];

            for (var _i = 0; _i < _World2.default.waves[0].waves.length; _i++) {

                if (_World2.default.waves[0].waves[_i] == _World2.default.waves[this.waveid]) _World2.default.waves[0].removeWave(_World2.default.waves[this.waveid]);
            }

            delete _World2.default.waves[this.waveid];
            CONTAINER.removeChild(this.wrapper);
        }

        /**
         * Öffne / Schließe den Bereich zum Editieren der Welle
         * 
         * @memberof UserInterface
         */

    }, {
        key: 'onToggleSettings',
        value: function onToggleSettings() {

            if (this.contentToggled) {
                this.closeContent();
            } else {
                this.openContent();
            }

            this.contentToggled = !this.contentToggled;
        }
    }]);

    return UserInterface;
}();

// Farben für die Wellen


var colors = ['red', 'yellow', 'olive', 'blue', 'purple', 'chartreuse', 'lightblue', '#00ff98'];

var StaticInterface = exports.StaticInterface = function () {
    function StaticInterface() {
        _classCallCheck(this, StaticInterface);
    }

    _createClass(StaticInterface, null, [{
        key: 'init',
        value: function init() {

            StaticInterface.index = 0;
            StaticInterface.interfaces = [];

            StaticInterface.addWaveButton = document.getElementById('addwave-button');

            // Füge eine neue Welle hinzu
            StaticInterface.addWaveButton.addEventListener('click', function () {

                StaticInterface.index += 1;

                var wave = _World2.default.createWave(1, 0.005, 100);
                wave.color = (0, _Utils.generateColor)();
                wave.start();
                wave.interface.update();
            });

            var startStopButton = document.getElementById('start-stop-all');
            var editCircleButton = document.getElementById('edit-circle-button');
            var editCircleDialogue = document.getElementById('edit-circle');
            var waveSelect = document.getElementById('wave-select');
            var finishedButton = document.getElementById('circle-finished-button');
            var toggleButton = document.getElementById('circle-toggle-button');
            var startLongButton = document.getElementById('start-longitudinal');
            var reflectButton = document.getElementById('reflect');
            var reflectDialogue = document.getElementById('reflect-dialogue');
            var mainTime = document.getElementById('main-time');
            var reflectButtons = [document.getElementById('reflect-0'), document.getElementById('reflect-1'), document.getElementById('reflect-2')];

            var dialogueVisible = false;
            var wavesRunning = true;
            var reflectDialogueVisible = false;

            // Ändere die Weltzeit
            setInterval(function () {

                if (wavesRunning) {

                    for (var i = 0; i < _World2.default.waves.length; i++) {

                        if (_World2.default.waves[i] instanceof _Wave.Wave) {
                            mainTime.value = _World2.default.waves[i].time;
                            return;
                        }
                    }

                    return;
                }

                for (var _i2 = 0; _i2 < _World2.default.waves.length; _i2++) {

                    if (!(_World2.default.waves[_i2] instanceof _Wave.Wave)) continue;

                    _World2.default.waves[_i2].stop();
                    _World2.default.waves[_i2].setTime(mainTime.value);
                    startStopButton.firstChild.setAttribute('class', 'fa fa-play');
                }
            }, 10 * _PerformanceAnalyzer.RESOLUTION);

            mainTime.addEventListener('mousedown', function () {

                wavesRunning = false;
            });

            // Ändere die Reflexion

            var _loop = function _loop(i) {

                reflectButtons[i].addEventListener('click', function () {

                    _Reflect2.default.mode = i;

                    reflectDialogueVisible = false;
                    reflectDialogue.style.display = 'none';

                    switch (i) {

                        case 0:

                            for (var k = 0; k < _World2.default.waves.length; k++) {

                                _World2.default.waves[k].reflected = false;
                            }

                            break;

                        default:

                            for (var _k = 0; _k < _World2.default.waves.length; _k++) {

                                _World2.default.waves[_k].reflected = true;
                            }

                            break;

                    }
                });
            };

            for (var i = 0; i < reflectButtons.length; i++) {
                _loop(i);
            }

            reflectButton.addEventListener('click', function () {

                if (reflectDialogueVisible) {
                    reflectDialogue.style.display = 'none';
                } else {
                    editCircleDialogue.style.display = 'none';
                    reflectDialogue.style.display = 'block';
                    dialogueVisible = false;
                }

                reflectDialogueVisible = !reflectDialogueVisible;
            });

            startStopButton.addEventListener('click', function () {

                if (wavesRunning) {
                    startStopButton.firstChild.setAttribute('class', 'fa fa-play');
                    _World2.default.stopAllWaves();
                } else {
                    startStopButton.firstChild.setAttribute('class', 'fa fa-pause');
                    _World2.default.startAllWaves();
                }

                wavesRunning = !wavesRunning;
            });

            startLongButton.addEventListener('click', function () {

                if (!_LongitudinalHandler2.default.running) {

                    _LongitudinalHandler2.default.init();
                    startLongButton.innerHTML = 'Transversale Welle';
                    _Circle.SmallCircleDisplay.changeWave(_World2.default.waves[0]);
                    StaticInterface.addWaveButton.style.display = 'none';
                    reflectButton.style.display = 'none';
                } else location.reload();
            });

            toggleButton.addEventListener('click', function () {
                _Main.mainCircle.toggle();
                _Circle.SmallCircleDisplay.toggle();
            });

            finishedButton.addEventListener('click', function () {
                editCircleDialogue.style.display = 'none';
                dialogueVisible = false;
                StaticInterface.updateCircle();
            });

            waveSelect.addEventListener('change', function () {
                StaticInterface.updateCircle();
            });

            editCircleButton.addEventListener('click', function () {

                if (dialogueVisible) {

                    editCircleDialogue.style.display = 'none';
                } else {

                    reflectDialogue.style.display = 'none';
                    reflectDialogueVisible = false;
                    editCircleDialogue.style.display = 'block';

                    waveSelect.innerHTML = '';

                    for (var i = 0; i < _World2.default.waves.length; i++) {

                        var wave = _World2.default.waves[i];

                        if (wave != undefined) {

                            if (wave instanceof _Wave.Wave) waveSelect.innerHTML += '<option index="' + i + '">Welle ' + i + '</option>';
                        }
                    }

                    if (!_LongitudinalHandler2.default.running) waveSelect.innerHTML += '<option index="0">Kombinierte Welle</option>';
                }

                dialogueVisible = !dialogueVisible;
            });
        }
    }, {
        key: 'updateCircle',
        value: function updateCircle() {

            var waveSelect = document.getElementById('wave-select');

            var selectedIndex = waveSelect.selectedIndex;
            var element = waveSelect.options[selectedIndex];

            var waveIndex = element.getAttribute('index');
            var wave = _World2.default.waves[waveIndex];

            if (wave instanceof _Wave.Wave) {
                _Main.mainCircle.setWaves([wave]);
                _Circle.SmallCircleDisplay.changeWave(wave);
            } else {
                _Main.mainCircle.setWaves(wave.waves);
            }
        }
    }]);

    return StaticInterface;
}();

},{"./../Main.js":1,"./Circle":2,"./LongitudinalHandler.js":4,"./PerformanceAnalyzer.js":5,"./Reflect":7,"./Utils.js":9,"./Wave.js":10,"./World.js":11}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Zeichne einen Pfeil auf einem JSCanvas
 * @author Titus Cieslewski http://stuff.titus-c.ch/arrow.html
 * @param context
 * @param fromx
 * @param fromy
 * @param tox
 * @param toy
 */

var drawArrow = exports.drawArrow = function drawArrow(context, fromx, fromy, tox, toy) {
  var headlen = 10; // length of head in pixels
  var angle = Math.atan2(toy - fromy, tox - fromx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  context.moveTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
};

/**
 * Generiere ein neues DOM Element, welches ein font-awesome Icon darstellt
 * 
 * @param {*} classAttr 
 */

var generateIcon = exports.generateIcon = function generateIcon(classAttr) {

  var icon = document.createElement('i');
  icon.setAttribute('class', 'fa ' + classAttr);
  icon.setAttribute('aria-hidden', 'true');
  return icon;
};

/**
 * Erstelle ein neues Input[type=range] Element
 * 
 * @param {*} min Minimaler Wert
 * @param {*} max Maximaler Wert
 * @param {*} step 
 * @param {*} value 
 * @param {*} attribute 
 */

var createSlider = exports.createSlider = function createSlider(min, max, step, value, attribute) {
  var slider = document.createElement('input');
  slider.setAttribute('type', 'range');
  slider.setAttribute('min', min);
  slider.setAttribute('max', max);
  slider.setAttribute('step', step);
  slider.setAttribute('value', value);
  return slider;
};

/**
 * Erstelle einen neuen Labeltext
 *
 * @param {string} label 
 * @param {string} value 
 * @returns {string}
 */

var getText = exports.getText = function getText(label, value) {

  return '<div><span>' + label + ': </span>' + value + '</div>';
};

var generateColor = exports.generateColor = function generateColor() {

  var r = Math.round(Math.random() * 255);
  var g = Math.round(Math.random() * 255);
  var b = Math.round(Math.random() * 255);

  return 'rgb(' + r + ',' + g + ',' + b + ')';
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CombinedWave = exports.Wave = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Display = require('./Display.js');

var _Display2 = _interopRequireDefault(_Display);

var _PerformanceAnalyzer = require('./PerformanceAnalyzer.js');

var _Point = require('./Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _Reflect = require('./Reflect.js');

var _Reflect2 = _interopRequireDefault(_Reflect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Wave = function () {

  // KONSTRUKTOR 
  // ###############################################################################################  //

  /**
   * Erstelle ein neues Objekt vom Typ {Wave}
   * 
   * @param {number} c 
   * @param {number} frequency 
   * @param {number} amplitude 
   * @memberof Wave
   */

  function Wave(c, frequency, amplitude) {
    _classCallCheck(this, Wave);

    // Werte, welche die grundlegende Welle definieren
    this.c = c;
    this.frequency = frequency;
    this.amplitude = amplitude;

    this.phi = 0;
    this.time = 0;

    // Boolsche Variablen für verschiedene Eigenschaften
    this.reverse = false;
    this.running = false;
    this.visible = true;
    this.transversal = true;
    this.reflected = false;
    this.showWaveLength = false;

    // Variablen zur grafischen Darstellung
    this.color = 'orange';
    this.strokeWidth = 3;

    // Oberfläche zum Bearbeiten der Welle
    this.interface = null;

    this.init();
  }

  // INITIALISIERUNG 
  // ###############################################################################################  //

  /**
   * Weise der Welle eine Anzahl an Punkten zur Simulation zu
   * 
   * @memberof Wave
   */

  _createClass(Wave, [{
    key: 'init',
    value: function init() {

      // Erstelle eine neue Reihung für die Punkte
      this.points = new Array(_Display2.default.getPoints());

      // Fülle diese Reihung mit Punkten
      for (var i = 0; i < _Display2.default.getPoints(); i++) {

        this.points[i] = new _Point2.default(i * _PerformanceAnalyzer.RESOLUTION, 0, i);
      }
    }

    // FUNKTIONEN 
    // ###############################################################################################  //

    /**
     * Erstelle eine Kopie einer vorhandenen Welle
     * @param {Wave} wave 
     * @memberof Wave
     */

  }, {
    key: 'setPhi',


    /**
     * Ändere die Phasenverschiebung der Welle
     * 
     * @param {number} phi Wird in Bogenmaß angegeben 
     * @memberof Wave
     */

    value: function setPhi(phi) {

      this.phi = phi;

      for (var i = 0; i < this.points.length; i++) {

        this.points[i].setAngle(this.phi);
      }
    }

    /**
     * Starte die Welle
     * 
     * @memberof Wave
     */

  }, {
    key: 'start',
    value: function start() {
      this.running = true;
    }

    /**
     * Stoppe die Welle
     * 
     * @memberof Wave
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.running = false;
    }

    /**
     * Zeichne die Welle
     * 
     * @memberof Wave
     */

  }, {
    key: 'draw',
    value: function draw() {

      if (!this.visible) return;

      // Zeichne eine transversale Welle
      if (this.transversal) {

        _Display2.default.ctx.beginPath();
        // Grafische Einstellungen
        _Display2.default.ctx.lineWidth = this.strokeWidth;
        _Display2.default.ctx.strokeStyle = this.color;

        // Bilde aus den vielen Punkten einen Graphen
        for (var i = 0; i < _Display2.default.getPoints(); i++) {

          // Falls der Punkt nicht schwingt wird er auch nicht gezeichnet
          if (!this.points[i].still) {

            _Display2.default.drawPoint(this.points[i], this.amplitude, this.color);
          } else if (i > 0) {
            // Falls es sich bei dem Punkt um das Anfangsstück handelt, soll eine Linie bis zur 0 Achse gezogen werden
            if (!this.points[i - 1].still) {

              var fakePoint = new _Point2.default(this.points[i - 1].x + _PerformanceAnalyzer.RESOLUTION / 2);
              fakePoint.setAngle(this.phi);
              _Display2.default.drawPoint(fakePoint, this.amplitude, this.color);
            }
          }
        }

        _Display2.default.ctx.stroke();

        // Zeichne die Wellenlänge
        if (this.showWaveLength) {

          var startPoint = this.points[Math.round(50 / _PerformanceAnalyzer.RESOLUTION)];
          var waveLength = this.c / this.frequency;
          var y = 249 - Math.sin(startPoint.angle) * this.amplitude;

          _Display2.default.ctx.fillStyle = 'red';
          _Display2.default.ctx.fillRect(startPoint.x, y, waveLength, 3);
          _Display2.default.drawSimplePoint(startPoint.x, y, 'black', 5);
          _Display2.default.drawSimplePoint(startPoint.x + waveLength, y + 2, 'black', 5);
        }
      } else {

        // Zeichne eine longitudinale Welle
        for (var _i = 0; _i < _Display2.default.getPoints(); _i++) {

          var point = this.points[_i];

          var x = point.x + Math.sin(point.angle) * this.amplitude;

          _Display2.default.drawLongitudinalPoint(point, this.amplitude, this.color);
        }
      }

      // Reflektiere die Welle falls erfordert
      if (this.reflected && this.c * this.time > _Display2.default.width) {

        // Erstelle eine Kopie in die umgekehrte Richtung
        var newWave = Wave.copyWave(this);

        newWave.reflected = false;
        newWave.reverse = !this.reverse;

        if (_Reflect2.default.mode == 1) {
          newWave.setPhi(this.phi + 3.14);
        }

        newWave.setTime(this.time - _Display2.default.width / this.c);
        newWave.draw();

        new CombinedWave([this, newWave], 'green').draw();
      }
    }

    /**
     * Aktualisiere die Welle bis zu einem bestimmten Zeitpunkt
     * 
     * @param {number} time 
     * @memberof Wave
     */

  }, {
    key: 'setTime',
    value: function setTime(time) {

      this.time = time;

      for (var i = 0; i < this.points.length; i++) {

        var point = void 0;

        // Bestimme den Punkt abhängig von der Richtung
        if (this.reverse) {

          point = this.points[this.points.length - (i + 1)];
        } else {

          point = this.points[i];
        }

        point.setAngle(this.phi); // Setze den Winkel zurück, falls die Welle neugestartet wird

        var T = 1 / this.frequency;
        var lambda = this.c * T;

        // Überprüfe, ob die Welle den Punkt schon erreicht hat
        // Dies kommt nur bei transversalen Wellen zum Einsatz
        if (this.time * this.c >= i * _PerformanceAnalyzer.RESOLUTION || !this.transversal) {

          var angle = 2 * Math.PI * (this.time / T - i * _PerformanceAnalyzer.RESOLUTION / lambda) + this.phi;

          point.setAngle(angle); // Berechne den Winkel des Zeigers
          point.still = false;
        } else {

          point.still = true;
        }
      }
    }

    /**
     * Simuliere die Fortbewegung der Welle
     * 
     * @memberof Wave
     */

  }, {
    key: 'simulate',
    value: function simulate() {

      if (!this.running) return;

      this.setTime(this.time);
      this.time++;
    }

    /**
     * Setze die Zeit zu t = 0 zurück
     * 
     * @memberof Wave
     */

  }, {
    key: 'restart',
    value: function restart() {
      this.time = 0;
    }
  }], [{
    key: 'copyWave',
    value: function copyWave(wave) {

      var newWave = new Wave(wave.c, wave.frequency, wave.amplitude);
      newWave.reverse = wave.reverse;
      newWave.phi = wave.phi;
      newWave.time = wave.time;
      newWave.color = wave.color;

      return newWave;
    }
  }]);

  return Wave;
}();

// KOMBINIERTE WELLE 
// #################################################################################################  //

/**
 * Kombiniere mehrere Wellen zu einer um eine Inteferenz zu simulieren
 * 
 * @class CombinedWave
 */

var CombinedWave = function () {

  /**
   * Erstelle eine neue kombinierte Welle
   * 
   * @param {array} waves  
   * @param {string} color 
   * @memberof CombinedWave
   */

  function CombinedWave(waves, color) {
    _classCallCheck(this, CombinedWave);

    this.waves = waves;
    this.color = color;
    this.running = true;

    this.removeQueue = [];
  }

  _createClass(CombinedWave, [{
    key: 'draw',
    value: function draw() {
      if (this.waves.length > 0) _Display2.default.drawCombinedWave(this.waves, this.color);

      for (var i = 0; i < this.removeQueue.length; i++) {
        this.waves.splice(this.waves.indexOf(this.removeQueue[i]), 1);
      }

      this.removeQueue = [];
    }

    /**
     * Füge eine neue Welle hinzu
     * @param {Wave} wave 
     * @memberof CombinedWave
     */

  }, {
    key: 'addWave',
    value: function addWave(wave) {

      this.waves.push(wave);
    }

    /**
     * Lösche eine Welle
     * @param {Wave} wave 
     * @memberof CombinedWave
     */

  }, {
    key: 'removeWave',
    value: function removeWave(wave) {

      this.removeQueue.push(wave);
    }
  }]);

  return CombinedWave;
}();

exports.Wave = Wave;
exports.CombinedWave = CombinedWave;

},{"./Display.js":3,"./PerformanceAnalyzer.js":5,"./Point.js":6,"./Reflect.js":7}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Wave = require('./Wave.js');

var _Display = require('./Display.js');

var _Display2 = _interopRequireDefault(_Display);

var _UserInterface = require('./UserInterface.js');

var _Circle = require('./Circle');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Klasse zum bündeln der verschiedenen Wellen in einer Klasse
 * 
 * @class World
 */

var World = function () {
  function World() {
    _classCallCheck(this, World);
  }

  _createClass(World, null, [{
    key: 'drawWaves',


    /**
     * Zeichne alle in der Welt vorhandenen Wellen
     * 
     * @static
     * @memberof World
     */

    value: function drawWaves() {

      for (var i = 0; i < World.waves.length; i++) {

        if (World.waves[i] != undefined) World.waves[i].draw();
      }
    }

    /**
     * Erstelle eine neue Welle und füge sie der Welt hinzu
     * 
     * @static
     * @param {number} c Ausbreitungsgeschwindigkeit 
     * @param {number} frequency Frequenz
     * @param {number} amplitude Amplitude 
     * @returns {Wave} Erstellte Welle
     * @memberof World
     */

  }, {
    key: 'createWave',
    value: function createWave(c, frequency, amplitude) {

      var wave = new _Wave.Wave(c, frequency, amplitude);
      World.waves.push(wave);
      wave.interface = new _UserInterface.UserInterface(World.waves.length - 1);
      wave.interface.update();

      for (var i = 0; i < World.waves.length; i++) {

        if (World.waves[i] instanceof _Wave.Wave && World.waves[i] != wave) {

          wave.time = World.waves[i].time;
        }
      }

      return wave;
    }

    /**
     * Erstelle eine kombinierte, aus einer Inteferenz gebildeten Welle und füge sie der Szene hinzu
     * 
     * @static
     * @param {array} waves 
     * @returns {CombinedWave}
     * @memberof World
     */

  }, {
    key: 'createCombinedWave',
    value: function createCombinedWave(waves) {

      var cw = new _Wave.CombinedWave(waves);
      World.waves.push(cw);
      return cw;
    }

    /**
     * Simuliere die Fortbewegung der Welle, wird mit running == false für die Welle unterbrochen
     * 
     * @static
     * @memberof World
     */

  }, {
    key: 'simulate',
    value: function simulate() {

      for (var i = 0; i < World.waves.length; i++) {

        if (World.waves[i] instanceof _Wave.Wave) World.waves[i].simulate();
      }
    }

    /**
     * Starte die Simulation von vorne, falls sich die Genauigkeit der Darstellung ändert
     * 
     * @static
     * @memberof World
     */

  }, {
    key: 'reInit',
    value: function reInit() {

      for (var i = 0; i < World.waves.length; i++) {

        var wave = World.waves[i];

        if (wave != undefined && wave instanceof _Wave.Wave) wave.init();
      }

      _Circle.SmallCircleDisplay.changeWave(_Circle.SmallCircleDisplay.wave);
    }
  }, {
    key: 'stopAllWaves',
    value: function stopAllWaves() {

      for (var i = 0; i < World.waves.length; i++) {

        if (World.waves[i] instanceof _Wave.Wave) World.waves[i].stop();
      }
    }
  }, {
    key: 'startAllWaves',
    value: function startAllWaves() {

      for (var i = 0; i < World.waves.length; i++) {

        if (World.waves[i] instanceof _Wave.Wave) World.waves[i].start();
      }
    }
  }]);

  return World;
}();

World.waves = new Array();

exports.default = World;

},{"./Circle":2,"./Display.js":3,"./UserInterface.js":8,"./Wave.js":10}]},{},[1]);
