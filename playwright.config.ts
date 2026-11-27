import { defineConfig, devices } from '@playwright/test';

/**
 * Uçtan uca testler (Faz 19.22, TST-04, K224) — `npm run e2e`.
 * Gerçek backend (`davetkart_e2e`, sahte ödeme) + derlenmiş frontend (`vite preview`).
 * Ayrıntı: docs/rehber/playwright.config.md
 */
const BACKEND_PORT = Number(process.env.E2E_BACKEND_PORT ?? 8020);
const PREVIEW_PORT = Number(process.env.E2E_PREVIEW_PORT ?? 4180);
const BASE_URL = `http://127.0.0.1:${PREVIEW_PORT}`;

export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  expect: { timeout: 20_000 },
  // One database, one owner account shared by the dependent projects: run in order.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: BASE_URL,
    locale: 'tr-TR',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'publish', testMatch: /publish-with-gift-code\.spec\.ts/ },
    // Faz 23: ana sayfa vitrin sahnesi; backend'e ve yayına bağlı değil.
    { name: 'home', testMatch: /home-showcase\.spec\.ts/ },
    // All need the invitation (and owner session) the first journey published; a11y = FE-54 axe scan.
    { name: 'after-publish', testMatch: /(guest-rsvp|paywall-after-publish|a11y|editor-flush)\.spec\.ts/, dependencies: ['publish'] }
  ],
  webServer: [
    {
      // Resets davetkart_e2e, migrates, seeds the gift code, then serves.
      command: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/e2e/backend.ps1 -Port ${BACKEND_PORT} -PreviewOrigin ${BASE_URL}`,
      url: `http://127.0.0.1:${BACKEND_PORT}/up`,
      timeout: 240_000,
      reuseExistingServer: false,
      stdout: 'pipe'
    },
    {
      command: `npm run build && node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port ${PREVIEW_PORT} --strictPort`,
      url: BASE_URL,
      timeout: 240_000,
      reuseExistingServer: false,
      env: { DAVETKART_API_PROXY: `http://127.0.0.1:${BACKEND_PORT}` }
    }
  ]
});
