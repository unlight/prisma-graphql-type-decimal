// Take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  concurrency: 2,
  coverageAnalysis: 'perTest',
  mutate: ['src/**/*.ts', '!src/**/*.spec.ts'],
  packageManager: 'npm',
  plugins: ['@stryker-mutator/vitest-runner'],
  // reporters: ['clear-text', 'progress', 'dashboard', 'html'],
  reporters: ['clear-text', 'dots'],
  testRunner: 'vitest',
  tsconfigFile: 'tsconfig.json',
};
