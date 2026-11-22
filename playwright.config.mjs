import { defineConfig } from '@playwright/test';

// Browser-level assertions for the generated component site. The suite drives the built
// site through the preview server, so it exercises the same artifacts that ship. It uses
// the installed Chrome channel instead of downloading a Playwright browser: locally that
// is Google Chrome, and the ubuntu CI image provides it too. No browser binaries are
// added to the repository or the cache.
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.mjs',
  outputDir: 'output/test-results-interaction',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 5_000 },
  reporter: process.env.CI ? 'line' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4510',
    channel: 'chrome',
    headless: true,
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    locale: 'zh-CN',
    permissions: ['clipboard-read', 'clipboard-write'],
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },
  webServer: {
    command: 'npm run preview --workspace @radish-ui/docs',
    url: 'http://127.0.0.1:4510',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
