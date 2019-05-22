'use strict'

var grunt = require('grunt')
var _ = require('lodash')
var path = require('path')
var Utils = require('../lib/utils.js')
var stringify = require('json-stable-stringify')
var expand = require('glob-expand')

exports.utils = {

  setUp: function (callback) {
    this._basePath = __dirname
    this.utils = new Utils({
      basePath: __dirname
    })

    this.JSONObject = {
      "MY.KEY.INDEX": "VALUE"
    }

    callback()
  },

  /****************************************************************************
   * utils.customStringify tests
   ***************************************************************************/
  customStringify_nooptions: function(test) {
    test.expect(1)
    test.equal(this.utils.customStringify(this.JSONObject), JSON.stringify(this.JSONObject, null , 4))
    test.done()
  },
  customStringify_defaultoptions: function(test) {
    test.expect(1)
    var defaultOptions = {
      space: '    ',
      cmp: function (a, b) {
        var lower = function (a) {
          return a.toLowerCase()
        }
        return lower(a.key) < lower(b.key) ? -1 : 1
      }
    }
    test.equal(this.utils.customStringify(this.JSONObject, true), stringify(this.JSONObject, defaultOptions))
    test.done()
  },
  customStringify_customoptions: function(test) {
    test.expect(1)
    var customOptions = {
      space: '  ',
      cmp: function (a, b) {
        var lower = function (a) {
          return a.toLowerCase()
        }
        return lower(a.key) < lower(b.key) ? -1 : 1
      }
    }
    test.equal(this.utils.customStringify(this.JSONObject, customOptions), stringify(this.JSONObject, customOptions))
    test.done()
  },

  /****************************************************************************
   * utils.getRealPath tests
   ***************************************************************************/
  getRealPath_noerror: function(test) {
    test.expect(1)
    var filepath = 'my.file'
    test.equal(this.utils.getRealPath(filepath), require('path').join(this._basePath, filepath))
    test.done()
  },
  getRealPath_error: function(test) {
    test.expect(1)
    var filepath = true
    test.equal(this.utils.getRealPath(filepath), filepath)
    test.done()
  },

  /****************************************************************************
   * utils.expand tests
   ***************************************************************************/
  expand_noerror: function(test) {
    test.expect(1)
    var filepattern = '**/*_test.js'
    test.equal(this.utils.expand(filepattern).length, expand({cwd: this._basePath}, filepattern).length)
    test.done()
  },

  /****************************************************************************
   * utils.escapeRegExp tests
   ***************************************************************************/
  escapeRegExp_noerror: function(test) {
    test.expect(1)
    var strSource = 'Bonjour tous le monde! -[]{}()*+?.\\|$'
    var strResult = 'Bonjour tous le monde! \\-\\[\\]\\{\\}\\(\\)\\*\\+\\?\\.\\\\\\\|\\$'
    test.equal(this.utils.escapeRegExp(strSource), strResult)
    test.done()
  },

  /****************************************************************************
   * utils.extractTernaryKey tests
   ***************************************************************************/
  extractTernaryKey_simpleQuote: function(test) {
    test.expect(3)
    var strSource = "myVar ? 'fi\\'rst':'second'"
    var strResult = ["fi\\'rst", "second"]
    var extract = this.utils.extractTernaryKey(strSource, {
      startDelimiter: '{{',
      endDelimiter: '}}'
    })
    test.equal(extract.length, 2)
    test.equal(extract[0], strResult[0])
    test.equal(extract[1], strResult[1])
    test.done()
  },
  extractTernaryKey_doubleQuote: function(test) {
    test.expect(3)
    var strSource = 'myVar?"fi\\"rst": "second"'
    var strResult = ['fi\\"rst', 'second']
    var extract = this.utils.extractTernaryKey(strSource, {
      startDelimiter: '{{',
      endDelimiter: '}}'
    })
    test.equal(extract.length, 2)
    test.equal(extract[0], strResult[0])
    test.equal(extract[1], strResult[1])
    test.done()
  },
  extractTernaryKey_withAngularDelimiters: function(test) {
    test.expect(3)
    var strSource = '{{myVar?"fi\\"rst" :"second"}}'
    var strResult = ['fi\\"rst', 'second']
    var extract = this.utils.extractTernaryKey(strSource, {
      startDelimiter: '{{',
      endDelimiter: '}}'
    })
    test.equal(extract.length, 2)
    test.equal(extract[0], strResult[0])
    test.equal(extract[1], strResult[1])
    test.done()
  },
  extractTernaryKey_withAngularTranslate: function(test) {
    test.expect(3)
    var strSource = 'myVar?"fi\\"rst":"second" | translate'
    var strResult = ['fi\\"rst', 'second']
    var extract = this.utils.extractTernaryKey(strSource, {
      startDelimiter: '{{',
      endDelimiter: '}}'
    })
    test.equal(extract.length, 2)
    test.equal(extract[0], strResult[0])
    test.equal(extract[1], strResult[1])
    test.done()
  }



}
