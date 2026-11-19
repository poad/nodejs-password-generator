/// <reference types="vitest" />
/// <reference types="vite/client" />

import solidPlugin from '@solidjs/vite-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupVitest.ts',
    // solid needs to be inline to work around
    // a resolution issue in vitest:
    deps: {
      optimizer: {
        client: {
          include: ['/solid-js/', '/@solidjs/web/'],
        },
      },
    },
    // if you have few tests, try commenting one
    // or both out to improve performance:
    isolate: false,
  },
  build: {
    target: 'esnext',
    // polyfillDynamicImport: false,
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
});
