const path = require('path');

module.exports = {
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  env: {
    browser: true,
    mocha: true,
  },
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "babel-eslint",
    "sourceType": "module",
    "allowImportExportEverywhere": false,
  },
  globals: {
    process: false,
    APP_TITLE: false,
  },
  plugins: [
    'chai-friendly',
  ],
  rules: {
    'no-unused-expressions': 0,
    'chai-friendly/no-unused-expressions': [
      2,
      { allowTaggedTemplates: true },
    ],
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],
  },
  settings: {
    'import/extensions': [
      'js',
      'vue',
    ],
    'import/resolver': {
      webpack: {
        config: path.resolve('./webpack.config.js'),
      },
    },
  },
};
