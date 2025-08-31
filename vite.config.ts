import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: (() => {
    const repo = process.env.GITHUB_REPOSITORY?.split('/')?.[1];
    return repo ? `/${repo}/` : '/'
  })(),
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html', 'json-summary'],
      reportsDirectory: 'coverage',
      thresholds: {
        lines: 75,
        functions: 75,
        branches: 75,
        statements: 75,
      },
      exclude: [
        'node_modules/',
        'dist/',
        'public/',
        '.vscode/',
        '.github/',
        '**/vite-env.d.ts',
        'vite.config.ts',
        '.pnp.*',
        '.yarn/',
        'coverage/',
        '*.d.ts',
        '**/*.spec.ts',
        '**/*.test.ts',
        '*.json',
        '**/*.svg',
      ],
    },
  },
})
