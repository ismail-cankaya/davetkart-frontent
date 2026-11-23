import { defineConfig } from '@playwright/test';
import base from './playwright.config';

/**
 * npm run perf (Faz 19.25, FE-53, K228): e2e ortamı + gzip'li üretim sunucusu (scripts/perf/server.mjs).
 * Önce `publish` yolculuğu misafir sayfası için davetiye yayınlar, sonra ölçüm. Ayrıntı: docs/rehber/playwright.perf.config.md
 */
const BACKEND_PORT = Number(process.env.E2E_BACKEND_PORT ?? 8020);
const PREVIEW_PORT = Number(process.env.E2E_PREVIEW_PORT ?? 4180);
const webServers = Array.isArray(base.webServer) ? base.webServer : [];

export default defineConfig({
  ...base,
  reporter: [['list']],
  projects: [
    { name: 'publish', testMatch: /publish-with-gift-code\.spec\.ts/ },
    { name: 'perf', testMatch: /\.perf\.ts$/, dependencies: ['publish'] }
  ],
  webServer: [
    webServers[0],
    {
      command: `npm run build && node scripts/perf/server.mjs --port ${PREVIEW_PORT} --backend ${BACKEND_PORT}`,
      url: `http://127.0.0.1:${PREVIEW_PORT}`,
      timeout: 240_000,
      reuseExistingServer: false
    }
  ]
});
