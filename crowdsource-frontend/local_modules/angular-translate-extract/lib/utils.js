'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Utils = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _globExpand = require('glob-expand');

var _globExpand2 = _interopRequireDefault(_globExpand);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsonStableStringify = require('json-stable-stringify');

var _jsonStableStringify2 = _interopRequireDefault(_jsonStableStringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = exports.Utils = function () {
  function Utils(options) {
    _classCallCheck(this, Utils);

    this.basePath = options && options[Utils.BASE_PATH_NAME] || __dirname;
  }

  /**
   * Stringify a JSON object
   * 1/ If no options, use JSON.stringify
   * 2/ If options, use json-stable-stringify
   * @param {Object} val
   * @param {Object?} options
   * @returns {*}
   */


  _createClass(Utils, [{
    key: 'customStringify',
    value: function customStringify(value, options) {
      if (options) {
        return (0, _jsonStableStringify2.default)(value, _lodash2.default.isObject(options) ? options : {
          space: '    ',
          cmp: function cmp(a, b) {
            var lower = function lower(a) {
              return a.toLowerCase();
            };
            return lower(a.key) < lower(b.key) ? -1 : 1;
          }
        });
      }
      return JSON.stringify(value, null, 4);
    }

    /**
     * Build the absolute path by concat basePath and given relativ path
     * @param {String} givenPath
     * @returns {*}
     */

  }, {
    key: 'getRealPath',
    value: function getRealPath(givenPath) {
      try {
        return _path2.default.join(this.basePath, givenPath);
      } catch (e) {}
      return givenPath;
    }

    /**
     * Wrap glob-expand package with this.basePath
     * @param {String} pattern
     * @returns {*}
     */

  }, {
    key: 'expand',
    value: function expand(pattern) {
      return (0, _globExpand2.default)({
        cwd: this.basePath
      }, pattern);
    }

    /**
     * Escape characters into given str
     * @param str
     * @returns {void|string|XML}
     */

  }, {
    key: 'escapeRegExp',
    value: function escapeRegExp(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    /**
     * Extract different part from a ternary operation
     * eg: myVar ? 'myFirst result' : 'mySecond result'
     * @param {String} str
     * @param {Object} interpolation {startDelimiter, endDelimiter)
     * @returns {*}
     */

  }, {
    key: 'extractTernaryKey',
    value: function extractTernaryKey(str, interpolation) {
      var delimiterRegexp = new RegExp('(' + this.escapeRegExp(interpolation.startDelimiter) + ')|(' + this.escapeRegExp(interpolation.endDelimiter) + ')', 'g');
      var ternarySimpleQuoteRegexp = new RegExp('([^?]*)\\?(?:\\s*\'((?:\\\\.|[^\'\\\\])*)\'\\s*):\\s*\'((?:\\\\.|[^\'\\\\])*)\'\\s*');
      var ternaryDoubleQuoteRegexp = new RegExp('([^?]*)\\?(?:\\s*"((?:\\\\.|[^"\\\\])*)"\\s*):\\s*"((?:\\\\.|[^"\\\\])*)"\\s*');

      var cleanKey = str.replace(delimiterRegexp, '');
      var match = cleanKey.match(ternaryDoubleQuoteRegexp);
      if (!match) {
        match = cleanKey.match(ternarySimpleQuoteRegexp);
      }

      if (match && match.length > 3) {
        return [match[2], match[3]];
      }
      return null;
    }
  }]);

  return Utils;
}();

Utils.BASE_PATH_NAME = "basePath";