// B-D14 (npm run a11y:envelopes): zarf ipucunun ("Mühre dokunarak açın") kontrastı bütün şablonlarda, 390 px. IDS=a,b ile alt küme.
const path = require('node:path');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const FRONT = path.resolve(__dirname, '../..');
const OUT = path.join(FRONT, 'node_modules/.cache/onizleme');
// Ayrıntılı açıklama: docs/rehber/scripts/onizleme.md §B-D14
const req = (m) => require(path.join(FRONT, 'node_modules', m));
const { chromium } = req('playwright');
const AxeBuilder = req('@axe-core/playwright').default;

const colors = fs.readFileSync(path.join(FRONT, 'src/templatePresetColors.ts'), 'utf8');
const ids = process.env.IDS ? process.env.IDS.split(',') : [...colors.matchAll(/^  "([a-z0-9-]+)":/gm)].map((m) => m[1]);
const PORT = 5174;
const LOG = path.join(OUT, 'envelope-contrast.jsonl');
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(LOG, '');

async function measure(context, id) {
  const page = await context.newPage();
  let row = { id, status: 'ok', ratio: null, detail: '' };
  try {
    await page.goto(`http://127.0.0.1:${PORT}/onizleme.html?preset=${id}&senaryo=dolu&zarf=1&yol=renderer`, { waitUntil: 'load', timeout: 30_000 });
    await page.locator('[data-onizleme="hazir"], [data-onizleme="hata"]').first().waitFor({ state: 'attached', timeout: 45_000 });
    if (await page.locator('[data-onizleme="hata"]').count()) throw new Error('onizleme: hata');
    const hint = page.getByText(/dokunarak/i).first();
    if (!(await hint.waitFor({ state: 'visible', timeout: 5000 }).then(() => true, () => false))) {
      row.status = 'ipucu-yok';
    } else {
      await page.waitForTimeout(2500); // kartın 1.1 s'lik girişi bitsin (opaklık ölçümü bozmasın)
      await hint.evaluate((el) => el.setAttribute('data-bd14', '1'));
      const r = await new AxeBuilder({ page }).include('[data-bd14]').withRules(['color-contrast']).analyze();
      const v = r.violations.flatMap((x) => x.nodes);
      const inc = r.incomplete.flatMap((x) => x.nodes);
      const data = (v[0] ?? inc[0])?.any[0]?.data;
      row = { ...row, status: v.length ? 'IHLAL' : inc.length ? 'belirsiz' : 'ok', ratio: data?.contrastRatio ?? null, detail: data ? `${data.fgColor} / ${data.bgColor}` : '' };
    }
  } catch (e) {
    row = { ...row, status: 'hata', detail: String(e.message).split('\n')[0].slice(0, 120) };
  } finally {
    await page.close().catch(() => {});
  }
  fs.appendFileSync(LOG, JSON.stringify(row) + '\n');
  return row;
}

(async () => {
  const server = spawn(process.execPath, [path.join(FRONT, 'node_modules/vite/bin/vite.js'), 'preview', '--outDir', 'node_modules/.cache/onizleme/dist', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], { cwd: FRONT, env: { ...process.env, DISABLE_HMR: 'true' } });
  await new Promise((r) => setTimeout(r, 6000));
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'tr-TR', reducedMotion: 'reduce' });
  const rows = [];
  const queue = [...ids];
  try {
    await Promise.all([0, 1, 2].map(async () => {
      while (queue.length) rows.push(await measure(context, queue.shift()));
    }));
  } finally {
    await browser.close().catch(() => {});
    server.kill();
  }
  const by = (s) => rows.filter((r) => r.status === s);
  console.log(`toplam ${rows.length} · ok ${by('ok').length} · IHLAL ${by('IHLAL').length} · belirsiz ${by('belirsiz').length} · ipucu-yok ${by('ipucu-yok').length} · hata ${by('hata').length}`);
  for (const r of [...by('IHLAL'), ...by('belirsiz'), ...by('hata')].slice(0, 60)) console.log(`${r.status} ${r.id} ${r.ratio ?? ''} ${r.detail}`);
  process.exit(by('IHLAL').length || by('hata').length ? 1 : 0);
})();
