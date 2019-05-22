import fs from 'fs'
import path from 'path'
import Po from 'pofile'
import _ from 'lodash'

export class PotObject {

  constructor(id, msg = '', ctx = '') {
    this.id = id
    this.msg = msg
    this.ctx = ctx
  }

  toString() {
    return `msgctxt "${PotObject.escapeString(this.ctx)}"
msgid "${PotObject.escapeString(this.id)}"
msgstr "${PotObject.escapeString(this.msg)}"`
  }
}

PotObject.escapeString = (str) => (""+str).replace(/"/g, '\\"')

export class PotAdapter {

  constructor(log, basePath) {
    this.log = log
    this.basePath = basePath

    this.params = {
      dest: '.',
      prefix: '',
      suffix: '.pot'
    }
  }

  init(params) {
    this.params = _.defaults(params, this.params)

    try {
      this.log.debug('Init PodAdapter', this.params.dest, this.params.prefix, this.params.suffix)
    } catch(e) {}
  }

  persist(translations) {
    var catalog = new Po()

    catalog.headers = {
      'Content-Type': 'text/plain; charset=UTF-8',
      'Content-Transfer-Encoding': '8bit',
      'Project-Id-Version': ''
    }

    _.forEach(translations.getFlatTranslations(), (value, msg) => {
      catalog.items.push(new PotObject(msg, value))
    })

    catalog.items.sort(function(a, b) {
      return a.id.toLowerCase().localeCompare(b.id.toLowerCase())
    })

    var fullPath = path.resolve(this.basePath, this.params.dest, this.params.prefix + this.params.suffix)
    fs.writeFileSync(fullPath, catalog.toString())
  }

}