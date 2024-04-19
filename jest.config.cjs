// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: 'coverage',
  roots: ['src'],
  testMatch: ['**/?(*.)+(spec|test).+(js|mjs|cjs)'],
  transformIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.[m|c]?jsx?$': 'babel-jest',
  },
  coveragePathIgnorePatterns: [
    'spec.js',
    'test.js',
    'service-worker',
    'coverage',
    'dist',
    'node_modules',
  ],
  collectCoverageFrom: ['src/**/*.{js,jsx,cjs,mjs}'],
  coverageThreshold: {
    global: {
      lines: 10,
      statements: 10,
    },
  },
  // collectCoverage: true,
  moduleDirectories: ['node_modules'],
  // setupFilesAfterEnv: ['<rootDir>/jest.init.mjs'],
  testEnvironment: 'node',

  // verbose: true,
};
