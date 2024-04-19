module.exports = {
  env: {
    es2023: true,
    'shared-node-browser': true,
    'jest/globals': true,
  },
  extends: [
    'eslint-config-airbnb-base',
    'eslint:recommended',
    'plugin:sonarjs/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2023,
    project: false,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'],
      },
      typescript: false,
    },
  },
  plugins: ['jest'],
  rules: {
    'no-plusplus': 'off',
    'import/extensions': 'off',
    'no-console': 'off',
    'prettier/prettier': [
      'warn',
      {},
      {
        usePrettierrc: true,
      },
    ],
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
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
  },
  // "overrides": [
  //   {
  //     "files": [],
  //     "rules": {
  //     }
  //   }
  // ]
};
