'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _log2 = require('log');

var _log3 = _interopRequireDefault(_log2);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _utils2 = require('./utils.js');

var _translations = require('./translations.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extractor; /**
                * angular-translate-extractor
                * https://github.com/Boulangerie/angular-translate-extractor
                *
                * Copyright (c) 2015 "firehist" Benjamin Longearet, contributors
                * Licensed under the MIT license.
                *l
                */

(function () {
  var _basePath, _log, _utils;

  var Extractor = function Extractor(data, option) {
    this.data = data;

    // Grab NODE_ENV to set debug flag!
    var debug = process.env.NODE_ENV === 'debug';
    _log = new _log3.default(option.log || (debug ? 'debug' : 'info'));
    _basePath = option ? option.basePath || __dirname : __dirname;
    _utils = new _utils2.Utils({
      basePath: _basePath
    });

    // Check lang parameter
    if (!_lodash2.default.isArray(this.data.lang) || !this.data.lang.length) {
      throw new Error('lang parameter is required.');
    }

    // Declare all var from configuration
    var files = _utils.expand(this.data.src),
        dest = _utils.getRealPath(this.data.dest || '.'),
        jsonSrc = _utils.expand(this.data.jsonSrc || []),
        jsonSrcName = _lodash2.default.union(this.data.jsonSrcName || [], ['label']),
        interpolation = this.data.interpolation || { startDelimiter: '{{', endDelimiter: '}}' },
        source = _utils.getRealPath(this.data.source),
        defaultLang = this.data.defaultLang,
        nullEmpty = this.data.nullEmpty || false,
        namespace = this.data.namespace || false,
        prefix = this.data.prefix || '',
        safeMode = this.data.safeMode ? true : false,
        suffix = this.data.suffix,
        customRegex = _lodash2.default.isArray(this.data.customRegex) || _lodash2.default.isObject(this.data.customRegex) ? this.data.customRegex : [],
        stringify_options = this.data.stringifyOptions || null,
        results = {},
        keyAsText = this.data.keyAsText || false,
        adapter = this.data.adapter || 'json';

    // Extract regex strings from content and feed results object
    var _extractTranslation = function _extractTranslation(regexName, regex, content, results) {
      var r;
      _log.debug("---------------------------------------------------------------------------------------------------");
      _log.debug('Process extraction with regex : "' + regexName + '"');
      _log.debug(regex);
      regex.lastIndex = 0;
      while ((r = regex.exec(content)) !== null) {

        // Result expected [STRING, KEY, SOME_REGEX_STUF]
        // Except for plural hack [STRING, KEY, ARRAY_IN_STRING]
        if (r.length >= 2) {
          var translationKey, evalString;
          var translationDefaultValue = "";

          switch (regexName) {
            case 'HtmlDirectiveSimpleQuote':
            case 'HtmlDirectiveDoubleQuote':
            case 'HtmlDirectiveAttrSimpleQuote':
            case 'HtmlDirectiveSimpleQuoteEscaped':
            case 'HtmlDirectiveAttrDoubleQuote':
              translationKey = r[1].trim();
              translationDefaultValue = (r[2] || "").trim();
              break;
            case 'HtmlDirectivePluralFirst':
              if (!r.length > 2) {
                return;
              }
              var tmp = r[1];
              r[1] = r[2];
              r[2] = tmp;
            case 'HtmlDirectivePluralLast':
              evalString = eval(r[2]);
              if (_lodash2.default.isArray(evalString) && evalString.length >= 2) {
                translationDefaultValue = "{NB, plural, one{" + evalString[0] + "} other{" + evalString[1] + "}" + (evalString[2] ? ' ' + evalString[2] : '') + "}";
              }
              translationKey = r[1].trim();
              break;
            default:
              translationKey = r[1].trim();
          }

          // Avoid empty translation
          if (translationKey === "") {
            return;
          }

          switch (regexName) {
            case "commentSimpleQuote":
            case "HtmlFilterSimpleQuote":
            case "JavascriptServiceSimpleQuote":
            case "JavascriptServiceInstantSimpleQuote":
            case "JavascriptFilterSimpleQuote":
            case "HtmlNgBindHtml":
              translationKey = translationKey.replace(/\\\'/g, "'");
              break;
            case "commentDoubleQuote":
            case "HtmlFilterDoubleQuote":
            case "JavascriptServiceDoubleQuote":
            case "JavascriptServiceInstantDoubleQuote":
            case "JavascriptFilterDoubleQuote":
              translationKey = translationKey.replace(/\\\"/g, '"');
              break;
            case "JavascriptServiceArraySimpleQuote":
            case "JavascriptServiceArrayDoubleQuote":
              var key;

              if (regexName === "JavascriptServiceArraySimpleQuote") {
                key = translationKey.replace(/'/g, '');
              } else {
                key = translationKey.replace(/"/g, '');
              }
              key = key.replace(/[\][]/g, '');
              key = key.split(',');

              key.forEach(function (item) {
                item = item.replace(/\\\"/g, '"').trim();
                if (item !== '') {
                  results[item] = translationDefaultValue;
                }
              });
              break;
          }

          // Check for customRegex
          if (_lodash2.default.isObject(customRegex) && !_lodash2.default.isArray(customRegex) && customRegex.hasOwnProperty(regexName)) {
            if (_lodash2.default.isFunction(customRegex[regexName])) {
              translationKey = customRegex[regexName](translationKey) || translationKey;
            }
          }

          // Store the translationKey with the value into results
          var defaultValueByTranslationKey = function defaultValueByTranslationKey(translationKey, translationDefaultValue) {
            if (regexName !== "JavascriptServiceArraySimpleQuote" && regexName !== "JavascriptServiceArrayDoubleQuote") {
              if (keyAsText === true && translationDefaultValue.length === 0) {
                results[translationKey] = translationKey;
              } else {
                results[translationKey] = translationDefaultValue;
              }
            }
          };

          // Ternary operation
          var ternaryKeys = _utils.extractTernaryKey(translationKey, interpolation);
          if (ternaryKeys) {
            _lodash2.default.forEach(ternaryKeys, function (v) {
              defaultValueByTranslationKey(v);
            });
          } else {
            defaultValueByTranslationKey(translationKey, translationDefaultValue);
          }
        }
      }
    };

    // Regexs that will be executed on files
    var regexs = {
      commentSimpleQuote: '\\/\\*\\s*i18nextract\\s*\\*\\/\'((?:\\\\.|[^\'\\\\])*)\'',
      commentDoubleQuote: '\\/\\*\\s*i18nextract\\s*\\*\\/"((?:\\\\.|[^"\\\\])*)"',
      HtmlFilterSimpleQuote: _utils.escapeRegExp(interpolation.startDelimiter) + '\\s*(?:::)?\'((?:\\\\.|[^\'\\\\])*)\'\\s*\\|\\s*translate(:.*?)?\\s*' + _utils.escapeRegExp(interpolation.endDelimiter),
      HtmlFilterDoubleQuote: _utils.escapeRegExp(interpolation.startDelimiter) + '\\s*(?:::)?"((?:\\\\.|[^"\\\\\])*)"\\s*\\|\\s*translate(:.*?)?\\s*' + _utils.escapeRegExp(interpolation.endDelimiter),
      HtmlFilterTernary: _utils.escapeRegExp(interpolation.startDelimiter) + '\\s*(?:::)?([^?]*\\?[^:]*:[^|}]*)\\s*\\|\\s*translate(:.*?)?\\s*' + _utils.escapeRegExp(interpolation.endDelimiter),
      HtmlDirective: '<(?:[^>"]|"(?:[^"]|\\/")*")*\\stranslate(?:>|\\s[^>]*>)([^<]*)',
      HtmlDirectiveSimpleQuote: '<(?:[^>"]|"(?:[^"]|\\/")*")*\\stranslate=\'([^\']*)\'[^>]*>([^<]*)',
      HtmlDirectiveSimpleQuoteEscaped: '<(?:[^>"]|"(?:[^"]|\\/")*")*\\stranslate=[\\\\]?\'([^\']*)\'[^>]*>([^<]*)',
      HtmlDirectiveDoubleQuote: '<(?:[^>"]|"(?:[^"]|\\/")*")*\\stranslate="([^"]*)"[^>]*>([^<]*)',
      HtmlDirectiveAttrSimpleQuote: '<(?:[^>"]|"(?:[^"]|\\/")*")*\\stranslate-attr-[\\w]+=\'([^\']*)\'[^>]*>([^<]*)',
      HtmlDirectiveAttrDoubleQuote: '<(?:[^>"]|"(?:[^"]|\\/")*")*\\stranslate-attr-[\\w]+="([^"]*)"[^>]*>([^<]*)',
      HtmlDirectivePluralLast: 'translate="((?:\\\\.|[^"\\\\])*)".*angular-plural-extract="((?:\\\\.|[^"\\\\])*)"',
      HtmlDirectivePluralFirst: 'angular-plural-extract="((?:\\\\.|[^"\\\\])*)".*translate="((?:\\\\.|[^"\\\\])*)"',
      HtmlNgBindHtml: 'ng-bind-html="\\s*\'((?:\\\\.|[^\'\\\\])*)\'\\s*\\|\\s*translate(:.*?)?\\s*"',
      HtmlNgBindHtmlTernary: 'ng-bind-html="\\s*([^?]*?[^:]*:[^|}]*)\\s*\\|\\s*translate(:.*?)?\\s*"',
      JavascriptServiceSimpleQuote: '\\$translate\\(\\s*\'((?:\\\\.|[^\'\\\\])*)\'[^\\)]*\\)',
      JavascriptServiceDoubleQuote: '\\$translate\\(\\s*"((?:\\\\.|[^"\\\\])*)"[^\\)]*\\)',
      JavascriptServiceArraySimpleQuote: '\\$translate\\((?:\\s*(\\[\\s*(?:(?:\'(?:(?:\\.|[^.*\'\\\\])*)\')\\s*,*\\s*)+\\s*\\])\\s*)\\)',
      JavascriptServiceArrayDoubleQuote: '\\$translate\\((?:\\s*(\\[\\s*(?:(?:"(?:(?:\\.|[^.*\'\\\\])*)")\\s*,*\\s*)+\\s*\\])\\s*)\\)',
      JavascriptServiceInstantSimpleQuote: '\\$translate\\.instant\\(\\s*\'((?:\\\\.|[^\'\\\\])*)\'[^\\)]*\\)',
      JavascriptServiceInstantDoubleQuote: '\\$translate\\.instant\\(\\s*"((?:\\\\.|[^"\\\\])*)"[^\\)]*\\)',
      JavascriptFilterSimpleQuote: '\\$filter\\(\\s*\'translate\'\\s*\\)\\s*\\(\\s*\'((?:\\\\.|[^\'\\\\])*)\'[^\\)]*\\)',
      JavascriptFilterDoubleQuote: '\\$filter\\(\\s*"translate"\\s*\\)\\s*\\(\\s*"((?:\\\\.|[^"\\\\\])*)"[^\\)]*\\)'

      // Build dynamic regex from custom regex Object/Array
    };_lodash2.default.forEach(customRegex, function (regex, key) {
      if (_lodash2.default.isObject(customRegex) && !_lodash2.default.isArray(customRegex)) {
        regexs[key] = key;
      } else {
        regexs['others_' + key] = regex;
      }
    });

    /**
     * Recurse an object to retrieve as an array all the value of named parameters
     * INPUT: {"myLevel1": [{"val": "myVal1", "label": "MyLabel1"}, {"val": "myVal2", "label": "MyLabel2"}], "myLevel12": {"new": {"label": "myLabel3é}}}
     * OUTPUT: ["MyLabel1", "MyLabel2", "MyLabel3"]
     * @param data
     * @returns {Array}
     * @private
     */
    var _recurseObject = function _recurseObject(data) {
      var currentArray = new Array();
      if (_lodash2.default.isObject(data) || _lodash2.default.isArray(data['attr'])) {
        for (var attr in data) {
          if (_lodash2.default.isString(data[attr]) && _lodash2.default.indexOf(jsonSrcName, attr) !== -1) {
            currentArray.push(data[attr]);
          } else if (_lodash2.default.isObject(data[attr]) || _lodash2.default.isArray(data['attr'])) {
            var recurse = _recurseObject(data[attr]);
            currentArray = _lodash2.default.union(currentArray, recurse);
          }
        }
      }
      return currentArray;
    };

    /**
     * Recurse feed translation object (utility for namespace)
     * INPUT: {"NS1": {"NS2": {"VAL1": "", "VAL2": ""} } }
     * OUTPUT: {"NS1": {"NS2": {"VAL1": "NS1.NS2.VAL1", "VAL2": "NS1.NS2.VAL2"} } }
     * @param {Object} data
     * @param {string?} path
     * @private
     */
    var _recurseFeedDefaultNamespace = function _recurseFeedDefaultNamespace(data, path) {
      var path = path || '';
      if (_lodash2.default.isObject(data)) {
        for (var key in data) {
          if (_lodash2.default.isObject(data)) {
            data[key] = _recurseFeedDefaultNamespace(data[key], path != '' ? path + '.' + key : key);
          }
        }
        return data;
      } else {
        if (data == null && data == "") {
          // return default data if empty/null
          return path;
        } else {

          return data;
        }
      }
    };

    /**
     * Start extraction of translations
     */

    // Check directory exist
    try {
      _fs2.default.statSync(dest);
    } catch (e) {
      _fs2.default.mkdirSync(dest);
    }

    // Parse all files to extract translations with defined regex
    files.forEach(function (file) {

      _log.debug("Process file: " + file);
      var content = _fs2.default.readFileSync(file, { encoding: 'utf8' }),
          _regex;
      // Execute all regex defined at the top of this file
      for (var i in regexs) {
        _regex = new RegExp(regexs[i], "gi");
        switch (i) {
          // Case filter HTML simple/double quoted
          case "HtmlFilterSimpleQuote":
          case "HtmlFilterDoubleQuote":
          case "HtmlDirective":
          case "HtmlDirectivePluralLast":
          case "HtmlDirectivePluralFirst":
          case "JavascriptFilterSimpleQuote":
          case "JavascriptFilterDoubleQuote":
            // Match all occurences
            var matches = content.match(_regex);
            if (_lodash2.default.isArray(matches) && matches.length) {
              // Through each matches, we'll execute regex to get translation key
              for (var index in matches) {
                if (matches[index] !== "") {
                  _extractTranslation(i, _regex, matches[index], results);
                }
              }
            }
            break;
          // Others regex
          default:
            _extractTranslation(i, _regex, content, results);

        }
      }
    });

    // Parse all extra files to extra
    jsonSrc.forEach(function (file) {
      _log.debug("Process extra file: " + file);
      var content = JSON.parse(_fs2.default.readFileSync(file, { encoding: 'utf8' }));
      var recurseData = _recurseObject(content);
      for (var i in recurseData) {
        if (_lodash2.default.isString(recurseData[i])) {
          results[recurseData[i].trim()] = '';
        }
      }
    });

    // Create translation object
    var _translation = new _translations.Translations({
      "safeMode": safeMode,
      "tree": namespace,
      "nullEmpty": nullEmpty
    }, results);

    // Prepare some params to pass to the adapter
    var params = {
      lang: this.data.lang,
      dest: dest,
      prefix: prefix,
      suffix: suffix,
      source: source,
      defaultLang: defaultLang,
      stringifyOptions: stringify_options
    };

    switch (adapter) {
      case 'pot':
        var PotAdapter = require('./adapter/pot-adapter.js');
        var toPot = new PotAdapter.PotAdapter(_log, _basePath);
        toPot.init(params);
        _translation.persist(toPot);
        break;
      default:
        var JsonAdapter = require('./adapter/json-adapter.js');
        var toJson = new JsonAdapter(_log, _basePath);
        toJson.init(params);
        _translation.persist(toJson);
    }
  };

  module.exports = {
    VERSION: _package2.default.version,
    NAME: _package2.default.name,
    extract: Extractor
  };
})();