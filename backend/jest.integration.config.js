/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch:       ['**/tests/integration/**/*.test.js'],
  setupFiles:      ['./tests/integration/setup.js'],
  testTimeout:     15000,
  forceExit:       true,   // ferme le process même si la pool garde des connexions
  verbose:         true,
};
