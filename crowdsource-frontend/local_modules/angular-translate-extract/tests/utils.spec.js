import path from 'path'
import {expect} from 'chai'
import {Utils} from './../src/utils.js'
import expand from 'glob-expand'
import stringify from 'json-stable-stringify'

describe('Utils', () => {
  let _basePath = __dirname
  let utils = new Utils({
    basePath: _basePath
  })
  let JSONObject = {
    "BB.KEY.INDEX": "VALUE",
    "AA.KEY.INDEX": "VALUE"
  }

  it('should get the utils.js dirname as basePath if no options', () => {
    let utils = new Utils()
    expect(utils.basePath).to.be.a('string')
    expect(utils.basePath).equals(path.dirname(path.resolve(_basePath, './../src/utils.js')))
  })


  describe('Interface', () => {
    // Tests exposed methods
    [
      'customStringify',
      'getRealPath',
      'expand',
      'escapeRegExp',
      'extractTernaryKey'
    ].forEach((method) => {
      it('should expose a ' + method + ' method', () => {
        expect(utils[method]).to.be.a('function')
      })
    })
  })

  describe('customStringify()', () => {
    it('should return a default JSON.stringify(value, null, 4) if no options', () => {
      var expected = JSON.stringify(JSONObject, null, 4)
      expect(utils.customStringify(JSONObject)).equals(expected)
      expect(utils.customStringify(JSONObject, null)).equals(expected)
      expect(utils.customStringify(JSONObject, undefined)).equals(expected)
    })
    it('should use default options if given options is not an object', () => {
      let defaultOptions = {
        space: '    ',
        cmp: function (a, b) {
          var lower = function (a) {
            return a.toLowerCase()
          }
          return lower(a.key) < lower(b.key) ? -1 : 1
        }
      }

      var values = [true, 1, 'string'].forEach((value) => {
        expect(utils.customStringify(JSONObject, value)).equals(utils.customStringify(JSONObject, defaultOptions))
      })
    })
    it('should take care of given options', () => {
      var customOptions = {
        space: '  ',
        cmp: function (a, b) {
          var lower = function (a) {
            return a.toLowerCase()
          }
          return lower(a.key) < lower(b.key) ? -1 : 1
        }
      }
      expect(utils.customStringify(JSONObject, customOptions)).equals(stringify(JSONObject, customOptions))
    })

  })

  describe('getRealPath()', () => {
    it('should return the absolute path', () => {
      let filename = 'my.file'
      expect(utils.getRealPath(filename)).equals(path.join(_basePath, filename))
    })
    it('should return the input if invalid filename', () => {
      let filename = true
      expect(utils.getRealPath(filename), filename)
    })
  })

  describe('expand()', () => {
    it('should return all files matching this pattern as an array<String>', () => {
      let filepattern = '**/*.spec.js'
      expect(utils.expand(filepattern).length, expand({cwd: _basePath}, filepattern).length)
    })
  })

  describe('escapeRegExp()', () => {
    it('should escape []{}*+?.\\^$ |', () => {
      var strSource = 'Bonjour tous le monde! -[]{}()*+?.\\|$'
      var strResult = 'Bonjour tous le monde! \\-\\[\\]\\{\\}\\(\\)\\*\\+\\?\\.\\\\\\\|\\$'
      expect(utils.escapeRegExp(strSource), strResult)
    })
  })

  describe('extractTernaryKey()', () => {
    it('should extract parts from ternary string (single quoted)', () => {
      let strSource = "myVar ? 'fi\\'rst':'second'"
      let strResult = ["fi\\'rst", "second"]
      let extract = utils.extractTernaryKey(strSource, {
        startDelimiter: '{{',
        endDelimiter: '}}'
      })
      expect(extract).to.be.a('array')
      expect(extract).to.have.lengthOf(2)
      expect(extract).to.have.members(strResult)
    })
    it('should extract parts from ternary string (double quoted)', () => {
      let strSource = 'myVar?"fi\\"rst": "second"'
      let strResult = ['fi\\"rst', 'second']
      let extract = utils.extractTernaryKey(strSource, {
        startDelimiter: '{{',
        endDelimiter: '}}'
      })
      expect(extract).to.be.a('array')
      expect(extract).to.have.lengthOf(2)
      expect(extract).to.have.members(strResult)
    })
    it('should extract parts from ternary string (no spaces, double quoted)', () => {
      let strSource = '{{myVar?"fi\\"rst" :"second"}}'
      let strResult = ['fi\\"rst', 'second']
      let extract = utils.extractTernaryKey(strSource, {
        startDelimiter: '{{',
        endDelimiter: '}}'
      })
      expect(extract).to.be.a('array')
      expect(extract).to.have.lengthOf(2)
      expect(extract).to.have.members(strResult)
    })
    it('should extract parts from ternary string (angular-translate)', () => {
      let strSource = 'myVar?"fi\\"rst":"second" | translate'
      let strResult = ['fi\\"rst', 'second']
      let extract = utils.extractTernaryKey(strSource, {
        startDelimiter: '{{',
        endDelimiter: '}}'
      })
      expect(extract).to.be.a('array')
      expect(extract).to.have.lengthOf(2)
      expect(extract).to.have.members(strResult)
    })

  })

})