/*
  This relies on a hacked version of linter-styleint to give output
  in Atom in .vue files.

  To make it work, go to installed packages, find 'linter-styleint',
  click on 'Show Code'.

  Open 'lib/index.js' and find where this.baseScopes is defined
  (line 63 currently).

  Add the following items to that array:

    'source.css.embedded.html',
    'source.scss.embedded.html',
    'source.css.scss.embedded.html',
    'source.less.embedded.html',
    'source.css.less.embedded.html',
    'source.css.postcss.embedded.html',
    'source.css.postcss.sugarss.embedded.html'

  Quit and restart Atom. Stylelinting *should* be working in .vue
  files.
*/

module.exports = {
  plugins: [
    'stylelint-scss',
    'stylelint-order',
  ],
  processors: ['@mapbox/stylelint-processor-arbitrary-tags'],
  rules: {
    'no-missing-end-of-source-newline': 2,
    indentation: 2,
    'number-leading-zero': 'never',
    'string-quotes': 'double',
    'selector-max-id': 0,
    'selector-list-comma-newline-after': 'always',
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment'],
      },
    ],
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
      },
    ],
    'block-opening-brace-space-before': 'always',
    'declaration-colon-space-after': 'always',
    'declaration-colon-space-before': 'never',
    'declaration-block-single-line-max-declarations': 1,
    'declaration-property-value-blacklist': {
      '/^border/': ['none'],
    },
    'at-rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment'],
        except: ['first-nested'],
      },
    ],
    'max-nesting-depth': 2,
    'scss/dollar-variable-pattern': '^_?[a-z]+[\\w-]*$',
    'scss/at-extend-no-missing-placeholder': true,
    'order/order': [
      'declarations',
      {
        type: 'at-rule',
      },
      {
        type: 'at-rule',
        hasBlock: true,
      },
      'rules',
    ],
  },
};
