// Take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  packageManager: 'npm',
  commandRunner: {
    command:
      'node -r ts-node/register node_modules/mocha/bin/mocha src/**/*.spec.ts',
  },
  coverageAnalysis: 'perTest',
  concurrency: 2,
  mutate: ['src/**/*.ts', '!src/**/*.spec.ts'],
  reporters: ['clear-text', 'dots'],
  tsconfigFile: 'tsconfig.json',
};
