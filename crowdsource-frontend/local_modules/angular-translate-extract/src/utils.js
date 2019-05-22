import _ from 'lodash'
import expand from 'glob-expand'
import path from 'path'
import stringify from 'json-stable-stringify'

export class Utils {

  constructor(options) {
    this.basePath = (options && options[Utils.BASE_PATH_NAME]) || __dirname
  }

  /**
   * Stringify a JSON object
   * 1/ If no options, use JSON.stringify
   * 2/ If options, use json-stable-stringify
   * @param {Object} val
   * @param {Object?} options
   * @returns {*}
   */
  customStringify(value, options) {
    if (options) {
      return stringify(value, _.isObject(options) ? options : {
        space: '    ',
        cmp: function (a, b) {
          var lower = function (a) {
            return a.toLowerCase()
          }
          return lower(a.key) < lower(b.key) ? -1 : 1
        }
      })
    }
    return JSON.stringify(value, null, 4)
  }

  /**
   * Build the absolute path by concat basePath and given relativ path
   * @param {String} givenPath
   * @returns {*}
   */
  getRealPath(givenPath) {
    try {
      return path.join(this.basePath, givenPath)
    } catch(e) {}
    return givenPath
  }

  /**
   * Wrap glob-expand package with this.basePath
   * @param {String} pattern
   * @returns {*}
   */
  expand(pattern) {
    return expand({
      cwd: this.basePath
    }, pattern)
  }

  /**
   * Escape characters into given str
   * @param str
   * @returns {void|string|XML}
   */
  escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
  }

  /**
   * Extract different part from a ternary operation
   * eg: myVar ? 'myFirst result' : 'mySecond result'
   * @param {String} str
   * @param {Object} interpolation {startDelimiter, endDelimiter)
   * @returns {*}
   */
  extractTernaryKey(str, interpolation) {
    var delimiterRegexp = new RegExp('(' + this.escapeRegExp(interpolation.startDelimiter) + ')|(' + this.escapeRegExp(interpolation.endDelimiter) + ')', 'g')
    var ternarySimpleQuoteRegexp = new RegExp('([^?]*)\\?(?:\\s*\'((?:\\\\.|[^\'\\\\])*)\'\\s*):\\s*\'((?:\\\\.|[^\'\\\\])*)\'\\s*')
    var ternaryDoubleQuoteRegexp = new RegExp('([^?]*)\\?(?:\\s*"((?:\\\\.|[^"\\\\])*)"\\s*):\\s*"((?:\\\\.|[^"\\\\])*)"\\s*')

    var cleanKey = str.replace(delimiterRegexp, '')
    var match = cleanKey.match(ternaryDoubleQuoteRegexp)
    if (!match) {
      match = cleanKey.match(ternarySimpleQuoteRegexp)
    }

    if (match && match.length > 3) {
      return [match[2], match[3]]
    }
    return null
  }
}

Utils.BASE_PATH_NAME = "basePath"