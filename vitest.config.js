import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.js'],
    passWithNoTests: true,
    reporters: [
      'default',
      ['vitest-html-reporter', { outputFile: './reports/test-report.html' }]
    ]
  }
});
