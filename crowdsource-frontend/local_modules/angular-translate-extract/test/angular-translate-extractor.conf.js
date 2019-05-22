/**
 * This file carry set of config for extractor and testing!
 *
 * Use path from the repository root path.
 */
module.exports = {

  // Provide fr_FR language
  default_options: {
    prefix:   '00_',
    suffix:   '.json',
    src:      [ 'test/fixtures/index.html', 'test/fixtures/index_key_as_text.html', 'test/fixtures/index_namespace.html', 'test/fixtures/index_namespace_consistent_output.html', 'test/fixtures/*.js', '!test/fixtures/links.js', '!test/fixtures/index_key_as_text.html'  ],
    lang:     ['fr_FR'],
    dest:     'tmp'
  },

  default_exists_i18n : {
    prefix:   '01_',
    suffix:   '.json',
    nullEmpty: true,
    src:      [ 'test/fixtures/index.html', 'test/fixtures/index_key_as_text.html', 'test/fixtures/index_namespace.html', 'test/fixtures/index_namespace_consistent_output.html', 'test/fixtures/*.js', '!test/fixtures/links.js', '!test/fixtures/index_key_as_text.html'  ],
    lang:     ['fr_FR'],
    dest:     'tmp',
    source:   'test/fixtures/default_exists_i18n.json' // Use to generate different output file
  },

  default_deleted_i18n : {
    prefix:   '02_',
    suffix:   '.json',
    src:      [ 'test/fixtures/index.html', 'test/fixtures/index_key_as_text.html', 'test/fixtures/index_namespace.html', 'test/fixtures/index_namespace_consistent_output.html', 'test/fixtures/*.js', '!test/fixtures/links.js', '!test/fixtures/index_key_as_text.html'  ],
    lang:     ['fr_FR'],
    dest:     'tmp',
    source:   'test/fixtures/default_deleted_i18n.json' // Use to generate different output file
  },

  interpolation_bracket: {
    prefix:   '03_',
    suffix:   '.json',
    interpolation: {
      startDelimiter: '[[',
      endDelimiter: ']]'
    },
    src:      [ 'test/fixtures/index.html', 'test/fixtures/index_key_as_text.html', 'test/fixtures/index_namespace.html', 'test/fixtures/index_namespace_consistent_output.html', 'test/fixtures/*.js', '!test/fixtures/links.js', '!test/fixtures/index_key_as_text.html'  ],
    lang:     ['fr_FR'],
    dest:     'tmp'
  },

  default_language: {
    prefix:   '04_',
    suffix:   '.json',
    src:      [ 'test/fixtures/index.html', 'test/fixtures/index_key_as_text.html', 'test/fixtures/index_namespace.html', 'test/fixtures/index_namespace_consistent_output.html', 'test/fixtures/*.js', '!test/fixtures/links.js', '!test/fixtures/index_key_as_text.html'  ],
    lang:     ['fr_FR', 'en_US'],
    dest:     'tmp',
    defaultLang: 'en_US'
  },

  json_extract: {
    prefix:   '05_',
    suffix:   '.json',
    src:      [ 'test/fixtures/index.html', 'test/fixtures/index_key_as_text.html', 'test/fixtures/index_namespace.html', 'test/fixtures/index_namespace_consistent_output.html', 'test/fixtures/*.js', '!test/fixtures/links.js', '!test/fixtures/index_key_as_text.html'  ],
    jsonSrc:  [ 'test/fixtures/*.json' ],
    jsonSrcName: ['label'],
    lang:     ['en_US'],
    dest:     'tmp',
    defaultLang: 'en_US'
  },

  sub_namespace: {
    prefix:   '06_',
    suffix:   '.json',
    src:      [ 'test/fixtures/index_namespace.html' ],
    lang:     ['fr_FR'],
    namespace: true,
    dest:     'tmp'
  },

  /**
   * Test case: Feed
   */
  sub_namespace_default_language: {
    prefix:   '07_',
    suffix:   '.json',
    src:      [ 'test/fixtures/index_namespace.html' ],
    lang:     ['fr_FR', 'en_US'],
    defaultLang: 'fr_FR',
    nullEmpty: true,
    namespace: true,
    dest:     'tmp'
  },

  /**
   * Test case: Feed
   */
  sub_namespace_default_language_source: {
    prefix:   '08_',
    suffix:   '.json',
    src:      [ 'test/fixtures/index_namespace.html' ],
    lang:     ['fr_FR'],
    defaultLang: 'fr_FR',
    safeMode: true,
    nullEmpty: true,
    namespace: true,
    dest:     'tmp',
    source:   'test/fixtures/default_exists_i18n_namespace.json' // Use to generate different output file
  },

  /**
   * Test case: Use consistent output to be able to merge easily
   */
  consistent_stringify: {
    prefix:   '09_A_',
    suffix:   '.json',
    src:      [ 'test/fixtures/index_namespace_consistent_output.html' ],
    lang:     ['fr_FR'],
    defaultLang: 'fr_FR',
    safeMode: true,
    nullEmpty: true,
    namespace: true,
    stringifyOptions: true,
    dest:     'tmp',
    source:   'test/fixtures/default_exists_i18n_namespace.json' // Use to generate different output file
  },

  /**
   * Test case: Use consistent output with options
   */
  consistent_stringify_options: {
    prefix:   '09_B_',
    suffix:   '.json',
    src:      [ 'test/fixtures/index_namespace_consistent_output.html' ],
    lang:     ['fr_FR'],
    defaultLang: 'fr_FR',
    safeMode: true,
    nullEmpty: true,
    namespace: true,
    stringifyOptions: {
      space: '  '
    },
    dest:     'tmp',
    source:   'test/fixtures/default_exists_i18n_namespace.json' // Use to generate different output file
  },

  /**
   * Test case: Use consistent output with options
   */
  extra_regexs: {
    prefix:   '10_',
    suffix:   '.json',
    src:      [ 'test/fixtures/index.html', 'test/fixtures/index_key_as_text.html', 'test/fixtures/index_namespace.html', 'test/fixtures/index_namespace_consistent_output.html', 'test/fixtures/*.js', '!test/fixtures/links.js', '!test/fixtures/index_key_as_text.html'  ],
    lang:     ['fr_FR'],
    customRegex: [
      'tt-default="\'((?:\\\\.|[^\'\\\\])*)\'\\|translate"'
    ],
    dest:     'tmp'
  },

  /**
   * Test case: Use consistent output with options
   */
  extra_regexs_object: {
    prefix:   '10_1_',
    suffix:   '.json',
    src:      [ 'test/fixtures/index.html', 'test/fixtures/index_key_as_text.html', 'test/fixtures/index_namespace.html', 'test/fixtures/index_namespace_consistent_output.html', 'test/fixtures/*.js', '!test/fixtures/links.js', '!test/fixtures/index_key_as_text.html'  ],
    lang:     ['fr_FR'],
    customRegex: {
      'translate_function\\(\\s*\'((?:\\\\.|[^\'\\\\])*)\'[^\\)]*\\)': function (translationKey) {
        return translationKey.replace(/\\\'/g, "'");
      },
      'translate_function\\(\\s*"((?:\\\\.|[^"\\\\])*)"[^\\)]*\\)': function (translationKey) {
        return translationKey.replace(/\\\"/g, '"');
      }
    },
    dest:     'tmp'
  },

  /**
   * Test case: Preserve translation links
   */
  keep_translation_links: {
    prefix:    '11_',
    suffix:    '.json',
    src:       [ 'test/fixtures/links.js' ],
    lang:      ['en_US'],
    dest:      'test/existing',
    namespace: true
  },

  /**
   * Test case: Allow text as keys
   */
  key_as_text: {
    prefix:   '12_',
    suffix:   '.json',
    src: ['test/fixtures/index_key_as_text.html'],
    lang: ['en_US'],
    dest: 'tmp',
    keyAsText: true
  },

  /**
   * Test case: Allow text as keys
   */
  ternary_keys: {
    prefix:   '13_',
    suffix:   '.json',
    src: ['test/fixtures/index_ternary_keys.html'],
    lang: ['fr_FR'],
    dest: 'tmp',
    customRegex: {
      'translate_function\\(\\s*([^?]*?[^:]*:[^|}]*)[^\\)]*\\)': function (translationKey) {
        return translationKey.replace(/\\\'/g, "'");
      }
    }
  },

  /**
   * Test case: POT adapter
   */
  extract_to_pot: {
    adapter:  'pot',
    prefix:   'template',
    src:      [ 'test/fixtures/index.html', 'test/fixtures/index_key_as_text.html', 'test/fixtures/index_namespace.html', 'test/fixtures/index_namespace_consistent_output.html', 'test/fixtures/*.js', '!test/fixtures/links.js', '!test/fixtures/index_key_as_text.html'  ],
    lang:     [ '' ],
    dest:     'tmp'
  }
};