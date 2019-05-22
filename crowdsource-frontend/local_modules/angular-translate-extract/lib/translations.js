'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Translations = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodashDeep = require('lodash-deep');

var _lodashDeep2 = _interopRequireDefault(_lodashDeep);

var _flat = require('flat');

var _flat2 = _interopRequireDefault(_flat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_lodash2.default.mixin(_lodashDeep2.default);

/**
 * Create an instance of Translations with params and translations (OPT)
 * @param {Object} params Allow tree, safeMode & nullEmpty
 * @param {Object} translations
 * @constructor
 */

var Translations = exports.Translations = function () {
  function Translations() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var translations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Translations);

    /** @type {Object} Store current translations source */
    this._translations = {};
    /** @type {Object} Store current stats for latest merge request */
    this._stats = {};
    /** @type {Object} Set default parameters */
    this.params = _lodash2.default.defaults(params, Translations.defaultParams);
    // Set translations if given as parameter
    this.setTranslations(translations).initStats();
  }

  /**
   * Format empty translation by using config about nullEmpty (null or "")
   * @returns {Object}
   */


  _createClass(Translations, [{
    key: 'getFlatTranslations',
    value: function getFlatTranslations() {
      var translations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._translations;

      if (this.params.nullEmpty) {
        return _flat2.default.flatten(_lodash2.default.deepMapValues(translations, function (translation) {
          return translation === "" ? null : translation;
        }));
      }
      return _lodash2.default.cloneDeep(_flat2.default.flatten(translations));
    }

    /**
     * Feed translation object values with the related key value
     * @param {Object?} obj The flat translations value or the key if not valid
     * @returns {Object}
     */

  }, {
    key: 'getDefaultTranslations',
    value: function getDefaultTranslations() {
      var translations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getFlatTranslations();

      return _lodash2.default.deepMapValues(translations, function (value, path) {
        return Translations.isValidTranslation(value) ? value : path.join('.');
      });
    }

    /**
     * Return a translations formated as a tree or in as a flat object
     * @returns {Object}
     */

  }, {
    key: 'getTranslations',
    value: function getTranslations() {
      var _isolatedTranslations = this.getFlatTranslations();
      return this.params.tree ? _flat2.default.unflatten(_isolatedTranslations) : _flat2.default.flatten(_isolatedTranslations);
    }

    /**
     * Set translation object to work on
     * @param {Object} translations
     * @return {Translations}
     */

  }, {
    key: 'setTranslations',
    value: function setTranslations(translations) {
      if (_lodash2.default.isUndefined(translations) || !_lodash2.default.isPlainObject(translations)) {
        throw new Error('Translations should be a plain Object');
      }
      this._translations = translations;
      return this;
    }

    /**
     * Compute merged translations from extracted translations and given obj
     * It can feed result if useDefault is true
     * @param {Object?} obj Old translation object
     * @param {Boolean?} useDefault
     * @returns {boolean}
     */

  }, {
    key: 'getMergedTranslations',
    value: function getMergedTranslations() {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var useDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var returnTranslations = {};
      var translations = this.getFlatTranslations();
      var emptyTranslation = this.params.nullEmpty ? null : "";

      // Ensure that obj is a Plain Object
      if (_lodash2.default.isUndefined(obj) || !_lodash2.default.isPlainObject(obj)) {
        obj = {};
      }

      // Get all linked translations
      // https://angular-translate.github.io/docs/#/guide/02_getting-started
      _lodash2.default.forEach(_lodash2.default.filter(obj, function (v) {
        return v && v.indexOf('@:') === 0;
      }), function (translationKey) {
        var virtual = translationKey.substr(2);
        // Add translations if not exists!
        if (!Translations.isValidTranslation(translations[virtual])) {
          translations[virtual] = obj[virtual];
        }
      });

      // Case safeMode: Dont delete unused value if true
      if (this.params.safeMode) {
        returnTranslations = _lodash2.default.extend(translations, obj);
        _lodash2.default.forEach(returnTranslations, function (v, k) {
          if (Translations.isValidTranslation(v)) {
            returnTranslations[k] = v;
          } else {
            returnTranslations[k] = "";
          }
        });
      } else {
        // Parse all stored translation to build output
        _lodash2.default.forEach(translations, function (translationValue, translationKey) {
          if (Translations.isValidTranslation(obj[translationKey])) {
            // Get from obj translations
            returnTranslations[translationKey] = obj[translationKey];
          } else if (Translations.isValidTranslation(translationValue)) {
            // Get from extracted translations
            returnTranslations[translationKey] = translationValue;
          } else {
            // Feed empty translation (null or "")
            returnTranslations[translationKey] = "";
          }
        });
      }

      if (!!useDefault) {
        returnTranslations = this.getDefaultTranslations(returnTranslations);
      }

      if (this.params.nullEmpty) {
        returnTranslations = this.getFlatTranslations(returnTranslations);
      }

      this.computeStats(obj, translations, returnTranslations);

      // Case namespace (tree representation)
      if (this.params.tree) {
        // We need to remove parent NS
        returnTranslations = _flat2.default.unflatten(Translations.cleanParents(returnTranslations));
      }

      return returnTranslations;
    }

    /**
     * Initialize statistics object with 0 value
     */

  }, {
    key: 'initStats',
    value: function initStats() {
      var _this = this;

      this._stats = {};
      _lodash2.default.forEach(Translations.availableStats, function (val) {
        _this._stats[val] = 0;
      });
      return this;
    }

    /**
     * Getter for stats object
     * @returns {Object}
     */

  }, {
    key: 'getStats',
    value: function getStats() {
      return this._stats;
    }

    /**
     * Compute statistics from old, new and merged translations results
     * @param {Object} oldVal Flat translations source
     * @param {Object} newVal Flat translations new
     * @param {Object} mergedVal Flat translations from source
     * @returns {Object}
     */

  }, {
    key: 'computeStats',
    value: function computeStats(oldVal, newVal, mergedVal) {
      this.initStats();
      var self = this;
      var _numFromNew = 0;
      // Compute deleted and updated stats
      _lodash2.default.forEach(oldVal, function (v, k) {
        if (_lodash2.default.isUndefined(newVal[k])) {
          // If not in new array, deleted
          self.incStat("deleted");
        } else {
          // If in new array
          _numFromNew++;
          if (v !== newVal[k]) {
            // If updated value
            self.incStat("updated");
          }
        }
      });
      // Compute new stat
      this.setStat("new", _lodash2.default.keys(newVal).length - _numFromNew);
      // Compute empty/null stats
      _lodash2.default.forEach(mergedVal, function (v, k) {
        self.incStat("total");
        if (_lodash2.default.isNull(v)) {
          self.incStat("null");
        } else if (v === "") {
          self.incStat("empty");
        }
      });
      return this.getStats();
    }

    /**
     * Check if type statistic is available
     * @param {String} type Statistic name
     * @returns {boolean}
     */

  }, {
    key: 'existStats',
    value: function existStats(type) {
      return _lodash2.default.indexOf(Translations.availableStats, type) !== -1;
    }

    /**
     * Set num for type statistic
     * @param {String} type Statistic name
     * @param {Number} num Number to set
     */

  }, {
    key: 'setStat',
    value: function setStat(type, num) {
      if (this.existStats(type)) {
        this._stats[type] = num;
      }
      return this;
    }

    /**
     * Increment type statistic by one
     * @param {String} type Statistic name
     */

  }, {
    key: 'incStat',
    value: function incStat(type) {
      if (this.existStats(type)) {
        this._stats[type]++;
      }
      return this;
    }

    /**
     * Call the adapter to persist to disk
     * @param {Function} adapter Function to call
     */

  }, {
    key: 'persist',
    value: function persist(adapter) {
      adapter.persist(this);
      return this;
    }
  }]);

  return Translations;
}();

/**
 * Available metrics for stats
 * @type {string[]}
 */


Translations.availableStats = ["updated", "deleted", "new", "null", "empty", "total"];

/**
 * Default params
 * @type {Object}
 */
Translations.defaultParams = {
  "tree": false,
  "safeMode": false,
  "nullEmpty": false

  /**
   * Wrap of flat.flatten method
   * @type {Function}
   */
};Translations.flatten = _flat2.default.flatten;
/**
 * Wrap of flat.unflatten method
 * @type {Function}
 */
Translations.unflatten = _flat2.default.unflatten;

/**
 * Helper to know if key is a valid translation or an empty one
 * @param key
 * @returns {boolean}
 * @private
 */
Translations.isValidTranslation = function (key) {
  return _lodash2.default.isString(key) && key !== "";
};

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
Translations.cleanParents = function (obj) {
  var keys = _lodash2.default.sortBy(_lodash2.default.keys(obj));
  var keepKeys = [];
  _lodash2.default.forEach(keys, function (v) {
    keepKeys.push(v);
    var splitted = v.split('.');
    for (var i = 1; i < splitted.length; i++) {
      var splittedNS = _lodash2.default.reduce(splitted.slice(0, i), function (m, v, k, l) {
        return k < splitted.length - 1 ? m + '.' + v : m;
      });
      _lodash2.default.remove(keepKeys, function (v) {
        return v === splittedNS;
      });
    }
  });
  // Build cleaned object
  var cleanedObject = {};
  _lodash2.default.forEach(obj, function (v, k) {
    if (_lodash2.default.indexOf(keepKeys, k) !== -1) {
      cleanedObject[k] = v;
    }
  });
  return cleanedObject;
};