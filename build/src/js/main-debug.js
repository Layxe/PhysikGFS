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

  // Erstelle die kombinierte Welle und lege sie in Platz 0 ab
  var combinedWave = _World2.default.createCombinedWave([]);
  combinedWave.color = 'green';

  _World2.default.createWave(1, 0.005, 100);

  // Erstelle ein neues Zeigermodell
  exports.mainCircle = mainCircle = new _Circle.Circle(document.getElementById('clock-display'), null);
  mainCircle.setWaves([_World2.default.waves[1]]);
  mainCircle.toggle();

  // Starte die Animationsschleife
  loop();

  // Starte die erste Welle
  _World2.default.waves[1].start();
  //World.waves[1].start();
  //World.waves[1].color = 'red';

  document.getElementById('start-longitudinal').addEventListener('click', function () {
    _LongitudinalHandler2.default.init();
  });
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

  mainCircle.draw(50 / _PerformanceAnalyzer.RESOLUTION);

  // ~~~ Messe die Bilder pro Sekunde ~~~ //
  FPS++;

  if (new Date().getTime() > oldTime + 1000) {

    FPS = FPS + 1;

    document.getElementById('info-log').innerHTML = 'FPS: ' + FPS + ' at ' + _PerformanceAnalyzer.RESOLUTION;

    FPS = 0;
    oldTime = new Date().getTime();
  }

  window.requestAnimationFrame(loop);
};

},{"./lib/Circle.js":2,"./lib/Display.js":3,"./lib/LongitudinalHandler.js":4,"./lib/PerformanceAnalyzer.js":5,"./lib/Point.js":6,"./lib/UserInterface.js":7,"./lib/Wave.js":9,"./lib/World.js":10}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SmallCircle = exports.Circle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = require('./Utils.js');

var _Display = require('./Display.js');

var _Display2 = _interopRequireDefault(_Display);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Circle = exports.Circle = function () {
  function Circle(element, waves) {
    _classCallCheck(this, Circle);

    this.waves = waves;
    this.element = element;
    this.ctx = this.element.getContext('2d');
    this.visible = true;
    this.gesAmplitude = 0;
    this.showAngle = true;
  }

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
    value: function draw(pointIndex) {

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

        // Zeichne einen neuen Zeiger für jede Welle
        for (var i = 0; i < this.waves.length; i++) {

          var wave = this.waves[i];
          var point = wave.points[pointIndex];
          var angle = point.angle;

          var newX = Math.cos(angle) * wave.amplitude + marginLeft;
          var newY = -Math.sin(angle) * wave.amplitude + 250;

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

          // Zeichne den Pfeil
          if (i != 0) {
            (0, _Utils.drawArrow)(this.ctx, x, y, newX - marginLeft + x, newY - 250 + y); // Anschließende Pfeile
          } else {
            (0, _Utils.drawArrow)(this.ctx, x, y, newX, newY); // Erster Pfeil
          }

          this.ctx.stroke();

          x = newX;
          y = newY;

          // Hebe den Punkt hervor
          _Display2.default.drawPointOnWave(point, wave.amplitude, wave.color, 5);

          gesY += newY;
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

var SmallCircle = exports.SmallCircle = function SmallCircle() {
  _classCallCheck(this, SmallCircle);

  this.element = document.getElementById('small-clock-display');
};

},{"./Display.js":3,"./Utils.js":8}],3:[function(require,module,exports){
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

            var x = point.x - Math.cos(point.angle) * amplitude;
            var y = 250 + -Math.sin(point.angle) * amplitude; // -sin weil das Koordinatensystem in y Richtung umgedreht ist

            y = 250;

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
         * Zeichne einen speziellen Punkt auf einer Welle
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
            Display.ctx.fillStyle = 'black';
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LongitudinalHandler = function () {
    function LongitudinalHandler() {
        _classCallCheck(this, LongitudinalHandler);
    }

    _createClass(LongitudinalHandler, null, [{
        key: 'init',
        value: function init() {

            for (var i = 0; i < _World2.default.waves.length; i++) {

                if (_World2.default.waves[i] != undefined && _World2.default.waves[i] instanceof _Wave.Wave) _World2.default.waves[i].interface.deleteWave();
            }

            _World2.default.waves = [];

            var wave = _World2.default.createWave(1, 0.005, 50);
            wave.transversal = false;
            wave.start();
        }
    }]);

    return LongitudinalHandler;
}();

exports.default = LongitudinalHandler;

},{"./Wave.js":9,"./World.js":10}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RESOLUTION = exports.RESOLUTION = 1;

var PerformanceAnalyzer = exports.PerformanceAnalyzer = function () {
        function PerformanceAnalyzer() {
                _classCallCheck(this, PerformanceAnalyzer);
        }

        _createClass(PerformanceAnalyzer, null, [{
                key: "_checkPerformance",
                value: function _checkPerformance() {

                        var a = 0;

                        for (var i = 0; i < 50000; i++) {

                                a += Math.random() * 2;
                        }
                }
        }, {
                key: "execute",
                value: function execute() {

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
        }]);

        return PerformanceAnalyzer;
}();

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function () {
    function Point(x, y, index) {
        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;
        this.angle = 0;
        this.index = index;

        this.still = true;
    }

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
exports.StaticInterface = exports.UserInterface = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _World = require('./World.js');

var _World2 = _interopRequireDefault(_World);

var _Utils = require('./Utils.js');

var _PerformanceAnalyzer = require('./PerformanceAnalyzer.js');

var _Wave = require('./Wave.js');

var _Main = require('./../Main.js');

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

            var playButton = (0, _Utils.generateIcon)('fa-play fa-3x');
            playButton.addEventListener('click', function () {
                _World2.default.waves[_interface.waveid].start();
            });

            buttonContent.appendChild(playButton);

            var stopButton = (0, _Utils.generateIcon)('fa-pause fa-3x');
            stopButton.addEventListener('click', function () {
                _World2.default.waves[_interface.waveid].stop();
            });

            buttonContent.appendChild(stopButton);

            var colorButton = (0, _Utils.generateIcon)('fa-paint-brush fa-3x');
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

            var reverseButton = (0, _Utils.generateIcon)('fa-arrow-left fa-3x');
            reverseButton.addEventListener('click', function () {
                _World2.default.waves[_interface.waveid].reverse = !_World2.default.waves[_interface.waveid].reverse;
            });

            buttonContent.appendChild(reverseButton);

            var resetButton = (0, _Utils.generateIcon)('fa-stop fa-3x');
            resetButton.addEventListener('click', function () {
                _World2.default.waves[_interface.waveid].restart();
                _World2.default.waves[_interface.waveid].setTime(0);
            });

            buttonContent.appendChild(resetButton);

            this.content.appendChild(buttonContent);

            // RANGE SLIDER SETUP 
            // #############################################################################################  //

            this.addSlider('Amplitude', (0, _Utils.createSlider)(0, 2, 0.01, _World2.default.waves[this.waveid].amplitude / 100), 'amplitude');
            this.addSlider('Frequenz', (0, _Utils.createSlider)(0.001, 0.05, 0.00005, _World2.default.waves[this.waveid].frequency), 'frequency');
            this.addSlider('Ausbreitungsgeschwindigkeit', (0, _Utils.createSlider)(0, 15, 0.1, _World2.default.waves[this.waveid].c), 'c');
            this.addSlider('Phasenverschiebung', (0, _Utils.createSlider)(0, 360, 1, _World2.default.waves[this.waveid].phi / (2 * Math.PI / 360)), 'phi');
            this.addSlider('Zeit', (0, _Utils.createSlider)(0, 1500, 1, _World2.default.waves[this.waveid].time), 'time');
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

            if (key == 'time') slider.addEventListener('mousedown', function () {
                _World2.default.waves[_interface.waveid].stop();
            });

            var interval = setInterval(function () {

                var wave = _World2.default.waves[_interface.waveid];
                var value = slider.value;

                if (key == 'time' && wave.running) {
                    var time = wave.time;
                    output.innerHTML = time;
                    slider.value = time;
                    return;
                }

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

                    case 'time':
                        wave.setTime(value);
                        break;

                    default:
                        wave[key] = value;
                        break;

                }

                _interface.update();
                wave.setTime(wave.time);
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
            StaticInterface.addWaveButton.addEventListener('click', function () {

                StaticInterface.index += 1;

                var wave = _World2.default.createWave(1, 0.005, 100);

                console.log(_World2.default.waves);

                try {
                    wave.color = colors[StaticInterface.index - 1];
                } catch (e) {
                    wave.color = 'orange';
                } finally {
                    wave.start();
                    wave.interface.update();
                }
            });

            var editCircleButton = document.getElementById('edit-circle-button');
            var editCircleDialogue = document.getElementById('edit-circle');
            var waveSelect = document.getElementById('wave-select');
            var finishedButton = document.getElementById('circle-finished-button');
            var toggleButton = document.getElementById('circle-toggle-button');

            var dialogueVisible = false;

            toggleButton.addEventListener('click', function () {
                _Main.mainCircle.toggle();
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

                    editCircleDialogue.style.display = 'block';
                    waveSelect.innerHTML = '';

                    for (var i = 0; i < _World2.default.waves.length; i++) {

                        var wave = _World2.default.waves[i];

                        if (wave != undefined) {

                            if (wave instanceof _Wave.Wave) waveSelect.innerHTML += '<option index="' + i + '">Welle ' + i + '</option>';
                        }
                    }

                    waveSelect.innerHTML += '<option index="0">Kombinierte Welle</option>';
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

            console.log(_World2.default.waves);

            if (wave instanceof _Wave.Wave) _Main.mainCircle.setWaves([wave]);else _Main.mainCircle.setWaves(wave.waves);
        }
    }]);

    return StaticInterface;
}();

},{"./../Main.js":1,"./PerformanceAnalyzer.js":5,"./Utils.js":8,"./Wave.js":9,"./World.js":10}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

    this.c = c;
    this.frequency = frequency;
    this.amplitude = amplitude;

    this.time = 0;
    this.phi = 0;

    this.reverse = false;
    this.running = false;
    this.visible = true;
    this.transversal = true;

    this.color = 'orange';
    this.strokeWidth = 3;

    this.highlightedPoints = [];

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
     * Ändere die Phasenverschiebung der Welle
     * 
     * @param {number} phi Wird in Bogenmaß angegeben 
     * @memberof Wave
     */

  }, {
    key: 'setPhi',
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
      } else {

        for (var _i = 0; _i < _Display2.default.getPoints(); _i++) {

          var point = this.points[_i];

          var x = point.x + Math.sin(point.angle) * this.amplitude;

          //if(!this.points[i].still) {


          _Display2.default.drawLongitudinalPoint(point, this.amplitude, this.color);

          //}
        }
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
  }, {
    key: 'addWave',
    value: function addWave(wave) {

      this.waves.push(wave);
    }
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

},{"./Display.js":3,"./PerformanceAnalyzer.js":5,"./Point.js":6}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Wave = require('./Wave.js');

var _Display = require('./Display.js');

var _Display2 = _interopRequireDefault(_Display);

var _UserInterface = require('./UserInterface.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// WELT 
// #################################################################################################  //

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
      console.log(World.waves);
      wave.interface = new _UserInterface.UserInterface(World.waves.length - 1);
      wave.interface.update();
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
  }]);

  return World;
}();

World.waves = new Array();

exports.default = World;

},{"./Display.js":3,"./UserInterface.js":7,"./Wave.js":9}]},{},[1]);
