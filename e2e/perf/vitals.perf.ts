import { mkdirSync, writeFileSync } from 'node:fs';
import { expect, test, type Browser } from '@playwright/test';
import { readPublished } from '../support/state';

/**
 * npm run perf (FE-53, K228): kısıtlı mobilde LCP / CLS, dört sayfa × 3 koşu, ortanca.
 * Koşullar denetimle aynı (AUD-2026-11-12 perf-measure.mjs): 390×844, CPU 4×, 1,6 Mbps / 750 kbps / 150 ms.
 * Laboratuvar ölçümü; sonuç perf-results/vitals.json'a yazılır, bütçe aşılırsa kırmızı.
 */
const BUDGET = { guestLcpMs: 3000, cls: 0.1 };
const RUNS = 3;

interface Sample {
  lcp: number;
  cls: number;
  fcp: number;
  tbt: number;
  lcpElement: string;
  shifts: string[];
  bytes: number;
}

const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

async function measure(browser: Browser, url: string): Promise<Sample> {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'tr-TR' });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  let bytes = 0;
  cdp.on('Network.loadingFinished', (e) => { bytes += e.encodedDataLength; });
  await page.addInitScript(() => {
    const describe = (n: Node | null | undefined) => {
      const el = n instanceof Element ? n : n?.parentElement;
      return el ? `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${String(el.className).split(' ').slice(0, 3).join('.')}` : '?';
    };
    const m = { lcp: 0, cls: 0, fcp: 0, tbt: 0, lcpElement: '', shifts: [] as string[] };
    (window as unknown as { __vitals: typeof m }).__vitals = m;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries() as (PerformanceEntry & { element?: Element })[]) { m.lcp = e.startTime; m.lcpElement = describe(e.element); }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean; sources?: { node?: Node }[] })[]) {
        if (e.hadRecentInput) continue;
        m.cls += e.value;
        if (e.value > 0.01) m.shifts.push(`${e.value.toFixed(3)} ${(e.sources ?? []).map((s) => describe(s.node)).join(' | ')}`);
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) m.tbt += Math.max(0, e.duration - 50); }).observe({ type: 'longtask', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') m.fcp = e.startTime; }).observe({ type: 'paint', buffered: true });
  });
  await page.goto(url, { waitUntil: 'load', timeout: 120_000 });
  await page.waitForTimeout(6_000);
  const m = await page.evaluate(() => (window as unknown as { __vitals: Omit<Sample, 'bytes'> }).__vitals);
  await context.close();
  return { ...m, bytes };
}

test('kısıtlı mobil: LCP ve CLS bütçesi', async ({ browser }) => {
  test.setTimeout(900_000);
  const { invitationId } = readPublished();
  const pages: [string, string][] = [['Ana sayfa', '/'], ['Misafir sayfası', `/invite/${invitationId}`], ['Giriş', '/login'], ['Fiyatlar', '/pricing']];
  const base = test.info().project.use.baseURL;
  const rows = [];
  for (const [name, path] of pages) {
    const runs: Sample[] = [];
    for (let i = 0; i < RUNS; i++) runs.push(await measure(browser, `${base}${path}`));
    const row = {
      page: name,
      lcp: Math.round(median(runs.map((r) => r.lcp))),
      cls: Number(median(runs.map((r) => r.cls)).toFixed(3)),
      fcp: Math.round(median(runs.map((r) => r.fcp))),
      tbt: Math.round(median(runs.map((r) => r.tbt))),
      kb: Math.round(median(runs.map((r) => r.bytes)) / 1024),
      lcpElement: runs[0].lcpElement,
      shifts: runs.flatMap((r) => r.shifts).slice(0, 6),
    };
    rows.push(row);
    console.log(`${name.padEnd(16)} LCP ${String(row.lcp).padStart(5)} ms · CLS ${row.cls} · FCP ${row.fcp} · TBT ${row.tbt} · ${row.kb} kB · LCP öğesi ${row.lcpElement}`);
    for (const s of row.shifts) console.log(`    kayma ${s}`);
  }
  mkdirSync('perf-results', { recursive: true });
  writeFileSync('perf-results/vitals.json', JSON.stringify({ ranAt: new Date().toISOString(), budget: BUDGET, conditions: '390x844, CPU 4x, 1.6 Mbps / 750 kbps / 150 ms; 3 koşu ortanca; gzip (scripts/perf/server.mjs)', rows }, null, 1));
  for (const row of rows) expect.soft(row.cls, `${row.page} CLS`).toBeLessThan(BUDGET.cls);
  expect.soft(rows[1].lcp, 'Misafir sayfası LCP').toBeLessThan(BUDGET.guestLcpMs);
});
