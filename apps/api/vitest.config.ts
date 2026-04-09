import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    globals: true,
    hookTimeout: 30_000,
    include: ['test/**/*.spec.ts'],
    setupFiles: ['./test/setup-env.ts'],
    testTimeout: 30_000,
  },
});
