'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Display = function () {
        function Display() {
                _classCallCheck(this, Display);
        }

        _createClass(Display, null, [{
                key: 'init',
                value: function init() {

                        var wrapper = document.getElementById('display-wrapper');

                        this.width = wrapper.clientWidth;
                        this.height = wrapper.clientHeight;

                        this.element = document.getElementById('display');
                        this.ctx = this.element.msGetInputContext('2d');

                        this.element.setAttribute('width', this.width.toString());
                        this.element.setAttribute('height', this.height.toString());
                }
        }]);

        return Display;
}();

exports.default = Display;