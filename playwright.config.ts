import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:3100' },
  webServer: {
    command: 'pnpm build && pnpm start -p 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    // NEXT_PUBLIC_SITE_URL feeds `metadataBase`, which Next resolves every
    // relative canonical/hreflang URL against — without it those links point
    // at the production domain instead of this test server, breaking any e2e
    // flow (e.g. the hreflang-based language switcher) that navigates via
    // `<link rel="alternate">` hrefs.
    env: { FORMS_DRY_RUN: '1', NEXT_PUBLIC_SITE_URL: 'http://localhost:3100' },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
