import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [
    mdx({ providerImportSource: fileURLToPath(new URL('./mdx-components.tsx', import.meta.url)) }),
    react(),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/unit/setup-navigation.tsx'],
    server: { deps: { inline: ['next-intl'] } },
    alias: [
      {
        find: /^.*\.(jpg|png|svg)$/,
        replacement: fileURLToPath(new URL('./tests/unit/__mocks__/image.ts', import.meta.url)),
      },
    ],
  },
});
