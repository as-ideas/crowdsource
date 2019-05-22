import path from 'path'
import sinon from 'sinon'
import _ from 'lodash'
import {expect} from 'chai'
import {Translations} from './../src/translations'
import flat from 'flat'

describe('Translations', () => {

  let translations
  beforeEach(() => {
    translations = new Translations()
  })

  describe('static methods', () => {
    it('should provide availableStats static variable', () => {
      expect(Translations.availableStats).to.be.a('array')
      expect(Translations.availableStats).to.have.members(["updated", "deleted", "new", "null", "empty", "total"])
    })
    it('should provide flatten method', () => {
      expect(Translations.flatten).to.be.a('function')
    })
    it('should provide unflatten method', () => {
      expect(Translations.unflatten).to.be.a('function')
    })

    describe('cleanParents()', () => {
      it('should provide a cleanParents method', () => {
        expect(Translations.cleanParents).to.be.a('function')
      })
      it('should remove parent namespace if child found', () => {
        let obj = {
          "NS": "My NS sentence",
          "NS.HEADER_LABEL": "My Header Label",
          "NS.HEADER_ICON": "My Header icon"
        }
        let result = Translations.cleanParents(obj)
        expect(result).to.not.have.property(["NS"])
      })
    })

    describe('isValidTranslation()', () => {
      it('should provide a isValidTranslation method', () => {
        expect(Translations.isValidTranslation).to.be.a('function')
      })
      it('should valid a translation (string && !empty)', () => {
        expect(Translations.isValidTranslation("valid")).to.be.true
        expect(Translations.isValidTranslation("")).to.be.false
        expect(Translations.isValidTranslation(null)).to.be.false
        expect(Translations.isValidTranslation(1)).to.be.false
        expect(Translations.isValidTranslation([])).to.be.false
        expect(Translations.isValidTranslation({})).to.be.false
        expect(Translations.isValidTranslation(undefined)).to.be.false
      })
    })

  })

  describe('constructor', () => {
    it('should set default value when no paramaters', () => {
      expect(translations._translations).to.deep.equal({})
      expect(translations.params).to.deep.equal(Translations.defaultParams)
    })
    it('should merge params with defaultParams', () => {
      let translations = new Translations({
        "tree": true,
        "test": false
      })
      expect(translations.params).to.deep.equal({
        "tree": true,
        "test": false,
        "safeMode": false,
        "nullEmpty": false
      }, Translations.defaultParams)
    })
    it('should call setTranslations with given translations', () => {
      let translations = new Translations(null, {
        "translation_key": "translation_value"
      })
      expect(translations._translations).to.deep.equal({
        "translation_key": "translation_value"
      })
      let spy = sinon.spy(translations, 'setTranslations')
      expect(spy).to.be.called
    })
    it('should init stats', () => {
      let translations = new Translations(null, {
        "translation_key": "translation_value"
      })
      let spy = sinon.spy(translations, 'initStats')
      expect(spy).to.be.called
    })
  })

  describe('getFlatTranslations()', () => {
    it('should return null instead of empty values if param.nullEmpty', () => {
      let translations = new Translations({
        "nullEmpty": true
      }, {
        "translation_key": "translation_value",
        "empty": "",
        "NS": {
          "empty": "",
          "null": null
        }
      })
      expect(translations.getFlatTranslations()).to.deep.equal({
        "translation_key": "translation_value",
        "empty": null,
        "NS.empty": null,
        "NS.null": null
      })
    })
    it('should transform given translation object', () => {
      translations.params.nullEmpty = true
      expect(translations.getFlatTranslations({
        "translation_key": "translation_value",
        "empty": "",
        "NS": {
          "empty": "",
          "null": null
        }
      })).to.deep.equal({
        "translation_key": "translation_value",
        "empty": null,
        "NS.empty": null,
        "NS.null": null
      })
    })
  })

  describe('getDefaultTranslations()', () => {
    it('should use instance translations if no parameter given', () => {
      let translations = new Translations(null, {
        "translation_key": "translation_value",
        "empty": "",
        "NS": {
          "test": ""
        }
      })
      expect(translations.getDefaultTranslations()).to.deep.equal({
        "translation_key": "translation_value",
        "empty": "empty",
        "NS.test": "NS.test"
      })
    })
    it('should use instance translations if no parameter given and take care of tree params', () => {
      let translations = new Translations(null, {
        "translation_key": "translation_value",
        "empty": "",
        "NS": {
          "test": ""
        }
      })
      expect(translations.getDefaultTranslations()).to.deep.equal({
        "translation_key": "translation_value",
        "empty": "empty",
        "NS.test": "NS.test"
      })
    })
    it('should use given translations', () => {
      let translations = new Translations(null, {
        "translation_key": "translation_value"
      })
      expect(translations.getDefaultTranslations({
        "empty": "",
        "NS": {
          "test": ""
        }
      })).to.deep.equal({
        "empty": "empty",
        "NS": {
          "test": "NS.test"
        }
      })
    })
  })

  describe('getTranslations()', () => {
    it('should call getFlatTranslations() method', () => {
      let spy = sinon.spy(translations, 'getFlatTranslations')
      translations.getTranslations()
      expect(spy).to.be.called
    })
    it('should return a flat translation object by default (params.tree = false)', () => {
      let translations = new Translations(null, {
        "NS": {
          "SNS1": "translation_value"
        }
      })
      let results = translations.getTranslations()
      expect(results).to.deep.equal({
        "NS.SNS1": "translation_value"
      })
    })
    it('should return a tree translation object (params.tree = true)', () => {
      let translations = new Translations({tree: true}, {
        "NS": {
          "SNS1": "translation_value"
        }
      })
      let results = translations.getTranslations()
      expect(results).to.deep.equal({
        "NS": {
          "SNS1": "translation_value"
        }
      })
    })
  })

  describe('setTranslations()', () => {
    it('should set translations if given parameter is a plain object', () => {
      translations.setTranslations({
        "NS.SNS1": "my value"
      })
      expect(translations._translations).to.deep.equal({
        "NS.SNS1": "my value"
      })
    })
    // Used 'cause I cannot be able to make .to.throw works :D
    // Feel free ;)
    let errorSetTranslations = (value) => {
      let error = true
      try {
        translations.setTranslations(value)
        error = false
      } catch(e) {}
      return error
    }
    it('should throw errorif no valid input', () => {
      expect(errorSetTranslations(true)).to.be.true
      expect(errorSetTranslations(undefined)).to.be.true
      expect(errorSetTranslations(1)).to.be.true
      expect(errorSetTranslations([])).to.be.true
      expect(errorSetTranslations("trolilol")).to.be.true

    })
    it('should doesn\'t update translation if error', () => {
      let translationsObject = {
        "NS.SNS1": "my value"
      }
      translations.setTranslations(translationsObject)
      errorSetTranslations(true)
      expect(translations.getTranslations()).to.deep.equal(translationsObject)
    })
  })

  describe('getMergedTranslations()', () => {
    it('should return merged translations (safeMode: false & useDefault:false)', () => {
      translations.setTranslations({
        "NS.SNS1": "my translations",
        "NS.SNS2": ""
      })
      let result = translations.getMergedTranslations({
        "NS.SNS1": "my new translations"
      }, false)
      expect(result).to.deep.equal({
        "NS.SNS1": "my new translations",
        "NS.SNS2": ""
      })
    })
    it('should take care about given link (@:)', () => {
      translations.setTranslations({
        "NS.SNS1": "my translations",
        "NS.SNS2": ""
      })
      let result = translations.getMergedTranslations({
        "COMMON.A_TRANSLATION": "my translation",
        "NS.SNS1": "@:COMMON.A_TRANSLATION",
        "NS.SNS2": "@:COMMON.B_TRANSLATION"
      }, false)
      expect(result).to.deep.equal({
        "COMMON.A_TRANSLATION": "my translation",
        "COMMON.B_TRANSLATION": "",
        "NS.SNS1": "@:COMMON.A_TRANSLATION",
        "NS.SNS2": "@:COMMON.B_TRANSLATION"
      })
    })
    it('should feed empty translations with default key as value', () => {
      translations.setTranslations({
        "NS.SNS1": "my translations",
        "NS.SNS2": ""
      })
      let result = translations.getMergedTranslations({
        "USELESS_TRANSLATION": "my translations",
        "COMMON.A_TRANSLATION": "my translation",
        "NS.SNS1": "@:COMMON.A_TRANSLATION",
        "NS.SNS2": "@:COMMON.B_TRANSLATION"
      }, true)
      expect(result).to.deep.equal({
        "COMMON.A_TRANSLATION": "my translation",
        "COMMON.B_TRANSLATION": "COMMON.B_TRANSLATION",
        "NS.SNS1": "@:COMMON.A_TRANSLATION",
        "NS.SNS2": "@:COMMON.B_TRANSLATION"
      })
    })
    it('should take care of nullEmpty', () => {
      translations.setTranslations({
        "NS.SNS1": "my translations",
        "NS.SNS2": ""
      })
      translations.params.nullEmpty = true;
      let result = translations.getMergedTranslations({
        "USELESS_TRANSLATION": "my translations",
        "COMMON.A_TRANSLATION": "my translation",
        "NS.SNS1": "@:COMMON.A_TRANSLATION",
        "NS.SNS2": "@:COMMON.B_TRANSLATION"
      }, false)
      expect(result).to.deep.equal({
        "COMMON.A_TRANSLATION": "my translation",
        "COMMON.B_TRANSLATION": null,
        "NS.SNS1": "@:COMMON.A_TRANSLATION",
        "NS.SNS2": "@:COMMON.B_TRANSLATION"
      })
    })
    it('should take care of safeMode', () => {
      translations.setTranslations({
        "USELESS_TRANSLATION": "my translations",
        "NS.SNS1": "my translations",
        "NS.SNS2": ""
      })
      translations.params.safeMode = true;
      let result = translations.getMergedTranslations({
        "COMMON.A_TRANSLATION": "my translation",
        "NS.SNS1": "@:COMMON.A_TRANSLATION",
        "NS.SNS2": "@:COMMON.B_TRANSLATION"
      }, false)
      expect(result).to.deep.equal({
        "COMMON.A_TRANSLATION": "my translation",
        "COMMON.B_TRANSLATION": "",
        "NS.SNS1": "@:COMMON.A_TRANSLATION",
        "NS.SNS2": "@:COMMON.B_TRANSLATION",
        "USELESS_TRANSLATION": "my translations"
      })
    })
    it('should take care of safeMode with useDefault', () => {
      translations.setTranslations({
        "USELESS_TRANSLATION": "my translations",
        "NS.SNS1": "my translations",
        "NS.SNS2": ""
      })
      translations.params.safeMode = true;
      let result = translations.getMergedTranslations({
        "COMMON.A_TRANSLATION": "my translation",
        "NS.SNS1": "@:COMMON.A_TRANSLATION",
        "NS.SNS2": "@:COMMON.B_TRANSLATION"
      }, true)
      expect(result).to.deep.equal({
        "COMMON.A_TRANSLATION": "my translation",
        "COMMON.B_TRANSLATION": "COMMON.B_TRANSLATION",
        "NS.SNS1": "@:COMMON.A_TRANSLATION",
        "NS.SNS2": "@:COMMON.B_TRANSLATION",
        "USELESS_TRANSLATION": "my translations"
      })
    })
    it('should call computeStats() method', () => {
      let spy = sinon.spy(translations, 'computeStats')
      translations.getMergedTranslations({})
      expect(spy).to.be.called
    })
    it('should take care about tree parameter', () => {
      translations.setTranslations({
        "USELESS_TRANSLATION": "my translations",
        "NS.SNS1": "my translations",
        "NS.SNS2": ""
      })
      translations.params.tree = true
      let result = translations.getMergedTranslations({
        "COMMON.A_TRANSLATION": "my translation",
        "NS.SNS1": "@:COMMON.A_TRANSLATION",
        "NS.SNS2": "@:COMMON.B_TRANSLATION"
      }, true)
      expect(result).to.deep.equal({
        "COMMON": {
          "A_TRANSLATION": "my translation",
          "B_TRANSLATION": "COMMON.B_TRANSLATION",
        },
        "NS": {
          "SNS1": "@:COMMON.A_TRANSLATION",
          "SNS2": "@:COMMON.B_TRANSLATION",
        },
        "USELESS_TRANSLATION": "my translations"
      })
    })
  })

  describe('initStats()', () => {
    it('should return stats object', () => {
      translations.initStats()
      let stats = translations.getStats()
      _.forEach(stats, stat => expect(stat).equals(0))
    })
    it('should return translation instance', () => {
      expect(translations.initStats()).equal(translations)
    })
  })

  describe('getStats()', () => {
    it('should return stats object', () => {
      let stats = translations.getStats()
      expect(stats).to.contain.all.keys(Translations.availableStats);
    })
  })

  describe('existStats()', () => {
    it('should valid if given stat is valid', () => {
      Translations.availableStats.forEach(stat => expect(translations.existStats(stat)).to.be.true)
    })
  })

  describe('setStat()', () => {
    it('should set num for each stats metrics', () => {
      Translations.availableStats.forEach(stat => {
        let random = Math.floor((Math.random() * 10) + 1)
        translations.setStat(stat, random)
        expect(translations.getStats()[stat]).equals(random)
      })
    })
  })

  describe('incStat()', () => {
    it('should inc num for each stats metrics', () => {
      Translations.availableStats.forEach(stat => {
        translations.incStat(stat)
        expect(translations.getStats()[stat]).equals(1)
      })
    })
  })

  describe('persist()', () => {
    it('should call the method persist with the current context on adapter', () => {
      let adapter = {
        persist: sinon.spy()
      }
      translations.persist(adapter)
      expect(adapter.persist).to.be.called;
    })
  })

  describe('computeStats()', () => {
    let defaultTranslations = {
      "first": "first",
      "second": "second",
      "third": "third"
    }
    it('should increment deleted stats', () => {
      translations.computeStats(defaultTranslations, {
        "myNewValue": "hey!"
      })
      expect(translations.getStats().deleted).equals(3)
    })
    it('should increment updated stats', () => {
      translations.computeStats(defaultTranslations, {
        "first": "hey!"
      })
      expect(translations.getStats().updated).equals(1)
    })
    it('should increment new stats', () => {
      translations.computeStats(defaultTranslations, {
        "new": "hey!"
      })
      expect(translations.getStats().new).equals(1)
    })
    it('should increment total stats', () => {
      translations.computeStats(defaultTranslations, {}, {
        "first": "first"
      })
      expect(translations.getStats().total).equals(1)
    })
    it('should increment null stats', () => {
      translations.computeStats(defaultTranslations, {}, {
        "first": null
      })
      expect(translations.getStats().null).equals(1)
    })
    it('should increment null stats', () => {
      translations.computeStats(defaultTranslations, {}, {
        "first": ""
      })
      expect(translations.getStats().empty).equals(1)
    })

    it('should increment all stats', () => {
      translations.computeStats(defaultTranslations, {
        "first": "hey!",
        "second": "hey!",
        "new": "mouarf"
      }, {
        "new": null,
        "first": "hey!",
        "second": "hey!",
        "empty": ""
      })
      expect(translations.getStats().total).equals(4)
      expect(translations.getStats().empty).equals(1)
      expect(translations.getStats().null).equals(1)
      expect(translations.getStats().updated).equals(2)
      expect(translations.getStats().deleted).equals(1)
      expect(translations.getStats().new).equals(1)
    })
  })

})