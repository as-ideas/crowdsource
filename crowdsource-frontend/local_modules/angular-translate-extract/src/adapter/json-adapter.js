/**
 * angular-translate-extractor
 * https://github.com/Boulangerie/angular-translate-extractor
 *
 * Copyright (c) 2015 "firehist" Benjamin Longearet, contributors
 * Licensed under the MIT license.
 *
 */

(function() {
  'use strict'

  var path = require('path')
  var fs = require('fs')
  var Utils = require('./../utils.js')
  var Translations = require('./../translations.js')

  var _log, _basePath, _utils


  function JsonAdapter(log, basePath) {
    _log = log
    _basePath = basePath
    _utils = new Utils.Utils({
      basePath: _basePath
    })
  }

  JsonAdapter.prototype.init = function(params) {
    this.dest = params.dest
    this.lang = params.lang
    this.prefix = params.prefix
    this.suffix = params.suffix || '.json'
    this.source = params.source
    this.defaultLang = params.defaultLang
    this.stringifyOptions = params.stringifyOptions
  }

  JsonAdapter.prototype.persist = function(_translation) {
    var lang = this.lang
    var dest = this.dest
    var prefix = this.prefix
    var suffix = this.suffix
    var source = this.source || ''
    var defaultLang = this.defaultLang || '.'
    var stringify_options = this.stringifyOptions || null

      // Build all output language files
    lang.forEach(function (lang) {

      var destFilename = path.resolve(_basePath, path.join(dest, prefix + lang + suffix)),
        filename = source,
        translations = {},
        json = {}

      // Test source filename
      if (filename === '' || !fs.statSync(filename)) {
        filename = destFilename
      }

      _log.info('Process ' + lang + ' : ' + filename)

      var isDefaultLang = (defaultLang === lang)
      try {
        // Test if filename exists
        fs.statSync(filename)
        _log.debug('File Exists. ' + destFilename)
        json = JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}))
      } catch (e) {
        _log.debug('Create file: ' + destFilename + (isDefaultLang ? ' (' + lang + ' is the default language)' : ''))
      }

      translations = _translation.getMergedTranslations(Translations.Translations.flatten(json), isDefaultLang)

      var stats = _translation.getStats()
      var statEmptyType = _translation.params.nullEmpty ? "null" : "empty"
      var statPercentage =  Math.round(stats[statEmptyType] / stats["total"] * 100)
      statPercentage = isNaN(statPercentage) ? 100 : statPercentage
      var statsString = "Statistics : " +
        statEmptyType + ": " + stats[statEmptyType] + " (" + statPercentage + "%)" +
        " / Updated: " + stats["updated"] +
        " / Deleted: " + stats["deleted"] +
        " / New: " + stats["new"]

      _log.info(statsString)

      // Write JSON file for lang
      fs.writeFileSync(path.resolve(_basePath, destFilename), _utils.customStringify(translations, stringify_options) + '\n')

    })
  }

  module.exports = JsonAdapter
}())
