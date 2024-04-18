// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: 'coverage',
  roots: ['src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js|mjs|cjs)',
  ],
  transformIgnorePatterns: ['/node_modules/'],
  // transform: {
  //   '^.+\\.[c|m]?[t|j]sx?$': 'babel-jest',
  // },
  // snapshotResolver: '<rootDir>/snapshotResolver.cjs',
  coveragePathIgnorePatterns: [
    'spec.js',
    'test.js',
    'service-worker',
    'coverage',
    'cypress',
    'cypress-coverage',
    'dist',
    'node_modules',
  ],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
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
