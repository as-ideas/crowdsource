import {expect} from 'chai'
import fs from 'fs'
import path from 'path'
import {PotObject, PotAdapter} from './../src/adapter/pot-adapter'

describe('adapter: pot-adapter', () => {
  let potAdapter, potObject

  describe('Interfaces', () => {
    it('should provide a PotAdapter method', () => {
      expect(PotAdapter).to.be.a('function')
    })
    it('should provide a PotObject method', () => {
      expect(PotObject).to.be.a('function')
    })
  })

  describe('PotObject', () => {
    let _id = 'my-id', _msg = 'my-msg', _ctx = 'my-ctx'
    beforeEach(() => {
      potObject = new PotObject(_id, _msg, _ctx)
    })
    it('should feed id, msg, ctx into instances if given', () => {
      expect(potObject.id).equals(_id)
      expect(potObject.msg).equals(_msg)
      expect(potObject.ctx).equals(_ctx)
    })
    it('should feed default empty msg & ctx if not givne', () => {
      let potObject = new PotObject(_id)
      expect(potObject.msg).equals('')
      expect(potObject.ctx).equals('')
    })
    it('should output po string with id, msg, ctx', () => {
      let result = potObject.toString()
      let expectation = `msgctxt "${_ctx}"
msgid "${_id}"
msgstr "${_msg}"`
      expect(result.split('\n')).to.eql(expectation.split('\n'))
    })
  })

  describe('PotAdapter', () => {
    let _log = console, _basePath = __dirname
    beforeEach(() => {
      potAdapter = new PotAdapter(_log, _basePath)
    })
    it('should init PotAdapter variables log, basePath, params', () => {
      expect(potAdapter.log).to.be.defined
      expect(potAdapter.log).to.be.a('object')
      expect(potAdapter.log).equals(_log)

      expect(potAdapter.basePath).to.be.defined
      expect(potAdapter.basePath).to.be.a('string')
      expect(potAdapter.basePath).equals(_basePath)

      expect(potAdapter.params).to.be.defined
      expect(potAdapter.params).to.be.a('object')
      expect(potAdapter.params).to.deep.equal({
        "dest": '.',
        "prefix": '',
        "suffix": '.pot'
      })
    })
    it('should init params', () => {
      let paramsOne = {
        dest: '.',
        prefix: '---',
        suffix: '.poteuh'
      }
      let paramsTwo = {
        prefix: '---',
        suffix: '.poteuh'
      }
      potAdapter.init(paramsOne)
      expect(potAdapter.params).to.deep.equal(paramsOne)

      potAdapter.init(paramsTwo)
      expect(potAdapter.params).to.deep.equal(paramsOne)
    })
    it('should write the pot file', () => {
      // Need to mock quickly Translations
      var fakeTranslations = {
        getFlatTranslations: () => {
          return {
            "MY.TRANSLATION": 'MY.TRANSLATION',
            "MY.OTHER_TRANSLATION": 'Hello!'
          }
        }
      }
      potAdapter.persist(fakeTranslations)
      let filepath = path.resolve(_basePath, potAdapter.params.dest, potAdapter.params.prefix + potAdapter.params.suffix)
      let result
      try {
        result = fs.readFileSync(filepath, {
          encoding: 'utf8'
        })
      } catch (e) {
        expect('File doesn\'t exist!').to.be.true
      }
      expect(result).equals(`msgid ""
msgstr ""
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Project-Id-Version: \\n"

msgctxt ""
msgid "MY.OTHER_TRANSLATION"
msgstr "Hello!"

msgctxt ""
msgid "MY.TRANSLATION"
msgstr "MY.TRANSLATION"
`)

      fs.unlinkSync(filepath)

    })
  })
})