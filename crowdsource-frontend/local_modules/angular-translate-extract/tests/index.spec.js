import {expect} from 'chai'
import path from 'path'
import fs from 'fs'
import {execSync} from 'child_process'
import AngularTranslateExtractor from './../src/index.js'
import _ from 'lodash'
import preset from './preset.conf.js'
import pkg from '../package.json'

describe('Extractor', () => {
	let extractor

	describe('Interface', () => {
		it('should expose the current version', () => {
			expect(AngularTranslateExtractor.VERSION).to.be.a('string')
			expect(AngularTranslateExtractor.VERSION).to.have.length.of.at.least(5)
			expect(AngularTranslateExtractor.VERSION).equal(pkg.version)
		})
		it('should expose the package name', () => {
			expect(AngularTranslateExtractor.NAME).to.be.a('string')
			expect(AngularTranslateExtractor.NAME).equal(pkg.name)
		})
		it('should expose an `extract` method', () => {
			expect(AngularTranslateExtractor.extract).to.be.a('function')
		})
	})

  describe('Preset', () => {
    let workingDir = path.resolve(__dirname, '..')
    let getContent = (name, tmpDirectory = 'tmp/', expectedDirectory = 'tests/expected/') => {
      let encoding = {"encoding": 'utf8'}
      let tmp = fs.readFileSync(path.resolve(workingDir, tmpDirectory + name), encoding)
      let expected = fs.readFileSync(path.resolve(workingDir, expectedDirectory + name), encoding)
      return {
        tmp: tmp,
        expected: expected
      }
    }

    before(() => {
      execSync( 'rm -rf ' + path.resolve(workingDir, 'tmp'))
      _.forEach(preset, (opt) => {
        AngularTranslateExtractor.extract(opt, {
          "basePath": workingDir,
          "log": false
        })
      })
    })

    after(() => {
      execSync( 'rm -rf ' + path.resolve(workingDir, 'tmp'))
    })

    it('should process to `default_options`', () => {
      let {tmp, expected} = getContent('00_fr_FR.json')
      expect(tmp).equals(expected)
    })

    it('should process to `default_exists_i18n`', () => {
      let {tmp, expected} = getContent('01_fr_FR.json')
      expect(tmp).equals(expected)
    })

    it('should process to `default_deleted_i18n`', () => {
      let {tmp, expected} = getContent('02_fr_FR.json')
      expect(tmp).equals(expected)
    })

    it('should process to `interpolation_bracket`', () => {
      let {tmp, expected} = getContent('03_fr_FR.json')
      expect(tmp).equals(expected)
    })

    it('should process to `default_language`', () => {
      let {tmp, expected} = getContent('04_fr_FR.json')
      expect(tmp).equals(expected)
      let {tmpUS, expectedUS} = getContent('04_en_US.json')
      expect(tmpUS).equals(expectedUS)
    })

    it('should process to `json_extract`', () => {
      let {tmp, expected} = getContent('05_en_US.json')
      expect(tmp).equals(expected)
    })

    it('should process to `sub_namespace`', () => {
      let {tmp, expected} = getContent('06_fr_FR.json')
      expect(tmp).equals(expected)
    })

    it('should process to `sub_namespace_default_language`', () => {
      let {tmp, expected} = getContent('07_fr_FR.json')
      expect(tmp).equals(expected)
      let {tmpUS, expectedUS} = getContent('07_en_US.json')
      expect(tmpUS).equals(expectedUS)
    })

    it('should process to `sub_namespace_default_language_source`', () => {
      let {tmp, expected} = getContent('08_fr_FR.json')
      expect(tmp).equals(expected)
    })

    it('should process to `consistent_stringify`', () => {
      let {tmp, expected} = getContent('09_A_fr_FR.json')
      expect(tmp).equals(expected)
    })

    it('should process to `consistent_stringify_options`', () => {
      let {tmp, expected} = getContent('09_B_fr_FR.json')
      expect(tmp).equals(expected)
    })

    it('should process to `extra_regexs`', () => {
      let {tmp, expected} = getContent('10_fr_FR.json')
      expect(tmp).equals(expected)
    })

    it('should process to `extra_regexs_object`', () => {
      let {tmp, expected} = getContent('10_1_fr_FR.json')
      expect(tmp).equals(expected)
    })

    it('should process to `keep_translation_links`', () => {
      let {tmp, expected} = getContent('11_en_US.json', 'tests/existing/')
      expect(tmp).equals(expected)
    })

    it('should process to `key_as_text`', () => {
      let {tmp, expected} = getContent('12_en_US.json')
      expect(tmp).equals(expected)
    })

    it('should process to `ternary_keys`', () => {
      let {tmp, expected} = getContent('13_fr_FR.json')
      expect(tmp).equals(expected)
    })

    it('should process to `extract_to_pot`', () => {
      let {tmp, expected} = getContent('template.pot')
      expect(tmp).equals(expected)
    })

  })

})