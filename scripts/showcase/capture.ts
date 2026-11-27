/**
 * Ana sayfa vitrin sahnesinin telefon görselleri (Faz 23): şablonu `onizleme.html` ile 390 × 844, DPR 2'de çizer,
 * ilk üç ekranı alt alta ekler ve `public/showcase/<preset>.webp` (540 px genişlik) yazar.
 *
 *   npm run dev -- --port 3101
 *   npx tsx scripts/showcase/capture.ts --port 3101 [--preset dugun-fener,nisan-koi]
 *
 * Ayrıntılı açıklama: docs/rehber/scripts/showcase.md
 */
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { SHOWCASE_SLIDES } from '../../src/components/home/showcase/showcaseSlides';

const arg = (name: string, fallback: string): string => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

const PORT = arg('port', '3101');
const PRESETS = arg('preset', SHOWCASE_SLIDES.map((s) => s.presetId).join(',')).split(',');
const VIEWPORT = { width: 390, height: 844 };
const SCREENS = 3;
const OUT_WIDTH = 540;
const OUT_DIR = path.resolve('public/showcase');

// CHROME_PATH: Playwright'ın kendi tarayıcısı kurulu değilse (cek.ts ile aynı değişken).
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
fs.mkdirSync(OUT_DIR, { recursive: true });
for (const preset of PRESETS) {
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  await page.goto(`http://127.0.0.1:${PORT}/onizleme.html?preset=${preset}&senaryo=dolu&yol=renderer`);
  await page.waitForFunction(() => document.documentElement.dataset.onizleme === 'hazir', null, { timeout: 60_000 });
  await page.waitForTimeout(4000); // giriş animasyonları otursun
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'showcase-'));
  const frames: string[] = [];
  for (let i = 0; i < SCREENS; i++) {
    // Şablonlar kendi kaydırma kabında kayar (belge değil); ekranlar o kabın içinden alınır.
    await page.evaluate((top) => {
      const scroller = [...document.querySelectorAll<HTMLElement>('div')].find(
        (el) => /(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 10
      );
      if (scroller) scroller.scrollTop = top;
    }, i * VIEWPORT.height);
    await page.waitForTimeout(2500); // kaydırmayla açılan bölümler
    const file = path.join(tmp, `${i}.png`);
    await page.screenshot({ path: file });
    frames.push(file);
  }
  const out = path.join(OUT_DIR, `${preset}.webp`);
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error',
    ...frames.flatMap((f) => ['-i', f]),
    '-filter_complex', `vstack=inputs=${frames.length},scale=${OUT_WIDTH}:-1:flags=lanczos`,
    '-c:v', 'libwebp', '-quality', '72', '-compression_level', '6', out
  ]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`✓ ${preset} → ${path.relative(process.cwd(), out)} (${(fs.statSync(out).size / 1024).toFixed(1)} kB)`);
  await page.close();
}
await browser.close();
