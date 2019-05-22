/**
 * grunt-angular-translate
 * https://github.com/firehist/grunt-angular-translate
 *
 * Copyright (c) 2013 "firehist" Benjamin Longearet, contributors
 * Licensed under the MIT license.
 *
 * @example

  var results = FLATTEN_TRANSLATIONS_OBJECT
  var translation = new Translations({
    "safeMode": true,
    "tree": true,
    "nullEmpty": true
  }, results)

  console.log(translation.toString())
  console.log(translation.getDefaultTranslations())

  console.log(translation.getMergedTranslations({
    "SUB": "My first txt",
    "SUB.NAMESPACE.VAL 1": "Okay val 1!",
    "SUB.NAMESPACE.VAL 33": "Okay val 1!",
    "SUB.NAMESPACE.VAL 44": "Okay val 1!"
  }))
  console.log(translation.getStats())

 */

import _ from 'lodash'
import lodashDeep from 'lodash-deep'
import flat from 'flat'
_.mixin(lodashDeep)

/**
 * Create an instance of Translations with params and translations (OPT)
 * @param {Object} params Allow tree, safeMode & nullEmpty
 * @param {Object} translations
 * @constructor
 */
export class Translations {

  constructor(params = {}, translations = {}) {
    /** @type {Object} Store current translations source */
    this._translations = {}
    /** @type {Object} Store current stats for latest merge request */
    this._stats = {}
    /** @type {Object} Set default parameters */
    this.params = _.defaults(params, Translations.defaultParams)
    // Set translations if given as parameter
    this
      .setTranslations(translations)
      .initStats()
  }

  /**
   * Format empty translation by using config about nullEmpty (null or "")
   * @returns {Object}
   */
  getFlatTranslations(translations = this._translations) {
    if (this.params.nullEmpty) {
      return flat.flatten(_.deepMapValues(translations, (translation) => {
        return translation === "" ? null : translation
      }))
    }
    return _.cloneDeep(flat.flatten(translations))
  }

  /**
   * Feed translation object values with the related key value
   * @param {Object?} obj The flat translations value or the key if not valid
   * @returns {Object}
   */
  getDefaultTranslations(translations = this.getFlatTranslations()) {
    return _.deepMapValues(translations, (value, path) => {
      return Translations.isValidTranslation(value) ? value : path.join('.')
    })
  }

  /**
   * Return a translations formated as a tree or in as a flat object
   * @returns {Object}
   */
  getTranslations() {
    let _isolatedTranslations = this.getFlatTranslations()
    return this.params.tree ? flat.unflatten(_isolatedTranslations) : flat.flatten(_isolatedTranslations)
  }

  /**
   * Set translation object to work on
   * @param {Object} translations
   * @return {Translations}
   */
  setTranslations(translations) {
    if (_.isUndefined(translations) || !_.isPlainObject(translations)) {
      throw new Error('Translations should be a plain Object')
    }
    this._translations = translations
    return this
  }

  /**
   * Compute merged translations from extracted translations and given obj
   * It can feed result if useDefault is true
   * @param {Object?} obj Old translation object
   * @param {Boolean?} useDefault
   * @returns {boolean}
   */
  getMergedTranslations(obj = {}, useDefault = false) {
    var returnTranslations = {}
    var translations = this.getFlatTranslations()
    var emptyTranslation = this.params.nullEmpty ? null : ""

    // Ensure that obj is a Plain Object
    if (_.isUndefined(obj) || !_.isPlainObject(obj)) {
      obj = {}
    }

    // Get all linked translations
    // https://angular-translate.github.io/docs/#/guide/02_getting-started
    _.forEach(_.filter(obj, (v) => v && v.indexOf('@:') === 0), (translationKey) => {
      let virtual = translationKey.substr(2)
      // Add translations if not exists!
      if (!Translations.isValidTranslation(translations[virtual])) {
        translations[virtual] = obj[virtual]
      }
    })

    // Case safeMode: Dont delete unused value if true
    if (this.params.safeMode) {
      returnTranslations = _.extend(translations, obj)
      _.forEach(returnTranslations, (v, k) => {
        if (Translations.isValidTranslation(v)) {
          returnTranslations[k] = v
        } else {
          returnTranslations[k] = ""
        }
      })
    } else {
      // Parse all stored translation to build output
      _.forEach(translations, (translationValue, translationKey) => {
        if (Translations.isValidTranslation(obj[translationKey])) {       // Get from obj translations
          returnTranslations[translationKey] = obj[translationKey]
        } else if (Translations.isValidTranslation(translationValue)) {   // Get from extracted translations
          returnTranslations[translationKey] = translationValue
        } else {                                                          // Feed empty translation (null or "")
          returnTranslations[translationKey] = ""
        }
      })
    }

    if (!!useDefault) {
      returnTranslations = this.getDefaultTranslations(returnTranslations)
    }

    if (this.params.nullEmpty) {
      returnTranslations = this.getFlatTranslations(returnTranslations)
    }

    this.computeStats(obj, translations, returnTranslations)

    // Case namespace (tree representation)
    if (this.params.tree) {
      // We need to remove parent NS
      returnTranslations = flat.unflatten(Translations.cleanParents(returnTranslations))
    }

    return returnTranslations
  }

  /**
   * Initialize statistics object with 0 value
   */
  initStats() {
    this._stats = {}
    _.forEach(Translations.availableStats, (val) => {
      this._stats[val] = 0
    })
    return this
  }

  /**
   * Getter for stats object
   * @returns {Object}
   */
  getStats() {
    return this._stats
  }

  /**
   * Compute statistics from old, new and merged translations results
   * @param {Object} oldVal Flat translations source
   * @param {Object} newVal Flat translations new
   * @param {Object} mergedVal Flat translations from source
   * @returns {Object}
   */
  computeStats(oldVal, newVal, mergedVal) {
    this.initStats()
    var self = this
    var _numFromNew = 0
    // Compute deleted and updated stats
    _.forEach(oldVal, function (v, k) {
      if (_.isUndefined(newVal[k])) {   // If not in new array, deleted
        self.incStat("deleted")
      } else {                          // If in new array
        _numFromNew++
        if (v !== newVal[k]) {             // If updated value
          self.incStat("updated")
        }
      }
    })
    // Compute new stat
    this.setStat("new", _.keys(newVal).length - _numFromNew)
    // Compute empty/null stats
    _.forEach(mergedVal, function (v, k) {
      self.incStat("total")
      if (_.isNull(v)) {
        self.incStat("null")
      } else if (v === "") {
        self.incStat("empty")
      }
    })
    return this.getStats()
  }

  /**
   * Check if type statistic is available
   * @param {String} type Statistic name
   * @returns {boolean}
   */
  existStats(type) {
    return _.indexOf(Translations.availableStats, type) !== -1
  }

  /**
   * Set num for type statistic
   * @param {String} type Statistic name
   * @param {Number} num Number to set
   */
  setStat(type, num) {
    if (this.existStats(type)) {
      this._stats[type] = num
    }
    return this
  }

  /**
   * Increment type statistic by one
   * @param {String} type Statistic name
   */
  incStat(type) {
    if (this.existStats(type)) {
      this._stats[type]++
    }
    return this
  }

  /**
   * Call the adapter to persist to disk
   * @param {Function} adapter Function to call
   */
  persist(adapter) {
    adapter.persist(this)
    return this
  }

}

/**
 * Available metrics for stats
 * @type {string[]}
 */
Translations.availableStats = ["updated", "deleted", "new", "null", "empty", "total"]

/**
 * Default params
 * @type {Object}
 */
Translations.defaultParams = {
  "tree": false,
  "safeMode": false,
  "nullEmpty": false
}

/**
 * Wrap of flat.flatten method
 * @type {Function}
 */
Translations.flatten = flat.flatten
/**
 * Wrap of flat.unflatten method
 * @type {Function}
 */
Translations.unflatten = flat.unflatten

/**
 * Helper to know if key is a valid translation or an empty one
 * @param key
 * @returns {boolean}
 * @private
 */
Translations.isValidTranslation = (key) => _.isString(key) && key !== ""

/**
 * Clean useless ROOT level for given obj
 * @param obj
 * @returns {{}}
 *
 * @example
 obj = {
      "NS": "My NS sentence",
      "NS.HEADER_LABEL": "My Header Label",
      "NS.HEADER_ICON": "My Header icon"
    }
 In a tree view, there are conflicts between NS as a string and NS as an
 object with HEADER_LABEL et HEADER_ICON as child
 return = {
      "NS.HEADER_LABEL": "My Header Label",
      "NS.HEADER_ICON": "My Header icon"
    }
 */
Translations.cleanParents = (obj) => {
  var keys = _.sortBy(_.keys(obj))
  var keepKeys = []
  _.forEach(keys, function (v) {
    keepKeys.push(v)
    var splitted = v.split('.')
    for (var i = 1; i < splitted.length; i++) {
      var splittedNS = _.reduce(splitted.slice(0, i), function (m, v, k, l) {
        return (k < splitted.length - 1) ? m + '.' + v : m
      })
      _.remove(keepKeys, function (v) {
        return v === splittedNS
      })
    }
  })
  // Build cleaned object
  var cleanedObject = {}
  _.forEach(obj, function (v, k) {
    if (_.indexOf(keepKeys, k) !== -1) {
      cleanedObject[k] = v
    }
  })
  return cleanedObject
}
