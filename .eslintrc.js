module.export = {
  env: {
    es2023: true,
    'shared-node-browser': true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'eslint-plugin-import',
    'plugin:sonarjs/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jest/recommended',
  ],
  plugins: ['jest', 'import'],

  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    allowImportExportEverywhere: true,
    project: true,
  },

  settings: {
    'import/resolver': {
      typescript: false,
      node: true,
    },
  },

  rules: {
    'prettier/prettier': [
      'warn',
      {},
      {
        usePrettierrc: true,
      },
    ],
    'import/first': ['error'],
    'import/newline-after-import': ['error'],
    'import/order': [
      'error',
      {
        distinctGroup: true,
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'type',
        ],
      },
    ],

    'sonarjs/cognitive-complexity': ['error', 10],
    complexity: ['error', 12],
    'max-statements': ['error', 30],
    'max-params': ['error', 4],
    'max-nested-callbacks': ['error', 3],
    'max-lines-per-function': [
      'error',
      { max: 120, skipBlankLines: true, skipComments: true },
    ],
    'max-lines': ['error', 400],
    'max-len': ['error', 80],
    'max-depth': ['error', 3],
  },
};
