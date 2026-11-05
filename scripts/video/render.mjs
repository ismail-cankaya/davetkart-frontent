#!/usr/bin/env node
/**
 * Kodla üretilen şablon videolarının ortak çalıştırıcısı.
 *
 *   node scripts/video/render.mjs <sablon-id> [seçenekler]
 *
 *   --clip <ad>          scripts/video/<id>/<ad>.scene.ts (varsayılan: scene.ts)
 *   --variant <v>        desktop | mobile | all (varsayılan: all)
 *   --workers <n>        paralel tarayıcı sayısı (varsayılan: 2; SwiftShader zaten çok
 *                        iş parçacıklı, fazlası kazandırmaz)
 *   --stills <t,t,...>   yalnızca bu anların PNG'sini üret (sahne geliştirme)
 *   --sheet              kodlamadan sonra baş/orta/son/döngü birleşimi temas sayfası
 *   --keep               kare klasörünü silme
 *   --out <dizin>        ara dosyalar için kök (varsayılan: node_modules/.cache/video)
 *
 * Akış: sahne esbuild ile tek dosyaya paketlenir → her işçi kendi Chromium'unu
 * (SwiftShader WebGL) açar ve kendi kare aralığını `render(t)` + PNG olarak
 * yazar → ffmpeg H.264 mp4 + VP9 webm üretir → poster, tarayıcının JPEG
 * kodlayıcısıyla bütçeye sığana dek kalite düşürülerek kaydedilir.
 *
 * Sahne yalnızca `t`'ye bağlı olduğundan çıktı her çalıştırmada aynıdır.
 */
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const SIZES = { desktop: [1920, 1080], mobile: [1080, 1920] };
/** Bayt bütçeleri: rehberdeki sınırlar. */
const BUDGET = { desktop: 1.8 * 1024 * 1024, mobile: 900 * 1024, poster: 60 * 1024 };

function parseArgs(argv) {
  const args = { id: argv[0], clip: null, variant: 'all', workers: 2, stills: null, sheet: false, keep: false, out: null };
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--clip') args.clip = argv[++i];
    else if (a === '--variant') args.variant = argv[++i];
    else if (a === '--workers') args.workers = Number(argv[++i]);
    else if (a === '--stills') args.stills = argv[++i].split(',').map(Number);
    else if (a === '--sheet') args.sheet = true;
    else if (a === '--keep') args.keep = true;
    else if (a === '--out') args.out = argv[++i];
    else throw new Error(`Bilinmeyen seçenek: ${a}`);
  }
  if (!args.id) throw new Error('Kullanım: node scripts/video/render.mjs <sablon-id> [--clip ad] [--variant desktop|mobile|all] [--stills 0,1.5]');
  return args;
}

function loadPlaywright() {
  try {
    return require('playwright');
  } catch {
    return require('playwright-core');
  }
}

function ffmpegBin() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  const probe = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  if (probe.status === 0) return 'ffmpeg';
  try {
    // İsteğe bağlı yedek: `npm i -D ffmpeg-static`.
    return require('ffmpeg-static');
  } catch {
    throw new Error('ffmpeg bulunamadı: PATH\'e kurun ya da `npm i -D ffmpeg-static`.');
  }
}

async function bundleScene(id, clip, outDir) {
  const sceneFile = path.join(ROOT, 'scripts/video', id, clip ? `${clip}.scene.ts` : 'scene.ts');
  if (!fs.existsSync(sceneFile)) throw new Error(`Sahne yok: ${path.relative(ROOT, sceneFile)}`);
  const outfile = path.join(outDir, 'scene.js');
  await build({
    stdin: {
      contents: `import scene from ${JSON.stringify(sceneFile)}; window.__sceneDef = scene;`,
      resolveDir: ROOT,
      loader: 'ts'
    },
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'es2022',
    outfile,
    logLevel: 'error'
  });
  return fs.readFileSync(outfile, 'utf8');
}

const LAUNCH_ARGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-vsync'];

async function openPage(browser, code, variant) {
  const [width, height] = SIZES[variant];
  const page = await browser.newPage({ viewport: { width: 64, height: 64 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error(`[sayfa] ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') console.error(`[konsol] ${m.text()}`);
  });
  await page.setContent('<!doctype html><html><body style="margin:0;background:#000"></body></html>');
  await page.addScriptTag({ content: code });
  const meta = await page.evaluate(
    async ({ width, height, variant }) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      document.body.appendChild(canvas);
      const def = window.__sceneDef;
      window.__canvas = canvas;
      window.__renderer = await def.setup({ canvas, width, height, variant });
      return { duration: def.duration, fps: def.fps, loop: def.loop, scrub: Boolean(def.scrub), poster: def.poster, posterMobile: def.posterMobile, crf: def.crf };
    },
    { width, height, variant }
  );
  return { page, meta };
}

/**
 * Ara kareler JPEG q0.95: PNG kodlaması kare başına ~100 ms daha pahalı ve
 * fark x264/VP9'un kendi kaybının altında kalıyor. Durağanlar PNG.
 */
async function renderFrame(page, t, type = 'image/jpeg') {
  const dataUrl = await page.evaluate(({ t, type }) => {
    window.__renderer.render(t);
    return window.__canvas.toDataURL(type, 0.95);
  }, { t, type });
  return Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
}

async function renderVariant({ chromium, code, variant, args, workDir }) {
  const framesDir = path.join(workDir, variant);
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  // Sahne meta verisi için ilk işçi; diğerleri aynı kodu açar.
  const first = await chromium.launch({ args: LAUNCH_ARGS });
  const { page: firstPage, meta } = await openPage(first, code, variant);
  const total = Math.round(meta.duration * meta.fps);

  if (args.stills) {
    for (const t of args.stills) {
      const png = await renderFrame(firstPage, t, 'image/png');
      const file = path.join(workDir, `still-${variant}-${String(t).replace('.', '_')}.png`);
      fs.writeFileSync(file, png);
      console.log(`  ${file}`);
    }
    await first.close();
    return { meta, framesDir: null, total };
  }

  const workers = Math.max(1, Math.min(args.workers, total));
  const chunk = Math.ceil(total / workers);
  const started = Date.now();
  let done = 0;

  const runWorker = async (w) => {
    const browser = w === 0 ? first : await chromium.launch({ args: LAUNCH_ARGS });
    const page = w === 0 ? firstPage : (await openPage(browser, code, variant)).page;
    const from = w * chunk;
    const to = Math.min(total, from + chunk);
    for (let i = from; i < to; i++) {
      const png = await renderFrame(page, i / meta.fps);
      fs.writeFileSync(path.join(framesDir, `f${String(i).padStart(5, '0')}.jpg`), png);
      done++;
      if (done % 25 === 0) {
        const s = (Date.now() - started) / 1000;
        process.stdout.write(`\r  ${variant}: ${done}/${total} kare · ${(s / done).toFixed(2)} sn/kare   `);
      }
    }
    await browser.close();
  };
  await Promise.all(Array.from({ length: workers }, (_, w) => runWorker(w)));
  process.stdout.write(`\r  ${variant}: ${total}/${total} kare · ${((Date.now() - started) / 1000).toFixed(0)} sn\n`);
  return { meta, framesDir, total };
}

function run(bin, argv) {
  const r = spawnSync(bin, argv, { stdio: ['ignore', 'ignore', 'pipe'] });
  if (r.status !== 0) throw new Error(`ffmpeg hatası:\n${r.stderr.toString().slice(-2000)}`);
}

function encode({ ffmpeg, meta, framesDir, variant, outBase }) {
  const input = ['-y', '-framerate', String(meta.fps), '-i', path.join(framesDir, 'f%05d.jpg')];
  // Kaydırmaya bağlı videoda saniyede bir anahtar kare ve B-kare yok: arama en çok fps−1
  // kare çözer (telefonda donanım çözücüyle birkaç ms). 6 ve 12'lik GOP mobil bütçede
  // CRF'i 44'e itti (blok); 1 sn'lik GOP kaliteyi geri kazandırır.
  const SCRUB_GOP = String(meta.fps);
  const gop = meta.scrub ? ['-g', SCRUB_GOP, '-keyint_min', SCRUB_GOP, '-sc_threshold', '0', '-bf', '0'] : ['-g', String(meta.fps * 2)];
  const budget = BUDGET[variant];

  let crf = meta.crf ?? (variant === 'desktop' ? 22 : 23);
  let size = Infinity;
  for (let attempt = 0; attempt < 8 && size > budget; attempt++) {
    run(ffmpeg, [...input, '-c:v', 'libx264', '-preset', 'slow', '-tune', 'film', '-crf', String(crf), '-pix_fmt', 'yuv420p',
      '-profile:v', 'high', '-level', '4.1', ...gop, '-movflags', '+faststart', '-an', `${outBase}.mp4`]);
    size = fs.statSync(`${outBase}.mp4`).size;
    // +6 CRF ≈ yarı bit oranı: aşım oranından sıçrama payını hesapla.
    if (size > budget) crf = Math.min(51, crf + Math.max(1, Math.ceil(6 * Math.log2(size / budget))));
  }
  const mp4 = { crf, size };

  let vcrf = (meta.crf ?? 22) + 12;
  let vsize = Infinity;
  for (let attempt = 0; attempt < 6 && vsize > budget && vcrf <= 63; attempt++) {
    run(ffmpeg, [...input, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(vcrf), '-deadline', 'good', '-cpu-used', '2',
      '-row-mt', '1', '-pix_fmt', 'yuv420p', ...(meta.scrub ? ['-g', SCRUB_GOP] : ['-g', String(meta.fps * 2)]), '-an', `${outBase}.webm`]);
    vsize = fs.statSync(`${outBase}.webm`).size;
    if (vsize > budget) {
      if (vcrf === 63) break; // VP9 üst sınırı: webm yedek kaynak, bütçeyi biraz aşabilir
      vcrf = Math.min(63, vcrf + Math.max(2, Math.ceil(8 * Math.log2(vsize / budget))));
    }
  }
  return { mp4, webm: { crf: vcrf, size: vsize } };
}

/** Poster: tarayıcının JPEG kodlayıcısı, bütçeye sığan en yüksek kalite. */
async function writePoster({ chromium, framePng, file }) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const b64 = framePng.toString('base64');
  const result = await page.evaluate(async ({ b64, budget }) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${b64}`;
    await img.decode();
    const encode = (w, q) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = Math.round((img.height * w) / img.width);
      const g = c.getContext('2d');
      g.imageSmoothingQuality = 'high';
      g.drawImage(img, 0, 0, c.width, c.height);
      return c.toDataURL('image/jpeg', q);
    };
    const bytes = (u) => Math.floor(((u.length - u.indexOf(',') - 1) * 3) / 4);
    for (const w of [img.width, Math.round(img.width * 0.8), Math.round(img.width * 0.66)]) {
      for (let q = 0.86; q >= 0.5; q -= 0.04) {
        const u = encode(w, q);
        if (bytes(u) <= budget) return { url: u, q, w };
      }
    }
    return { url: encode(Math.round(img.width * 0.5), 0.5), q: 0.5, w: Math.round(img.width * 0.5) };
  }, { b64, budget: BUDGET.poster });
  await browser.close();
  fs.writeFileSync(file, Buffer.from(result.url.slice(result.url.indexOf(',') + 1), 'base64'));
  return { q: Number(result.q.toFixed(2)), width: result.w, size: fs.statSync(file).size };
}

function contactSheet({ ffmpeg, framesDir, total, file, loop }) {
  const picks = [0, Math.floor(total * 0.25), Math.floor(total * 0.5), Math.floor(total * 0.75), total - 1];
  if (loop) picks.push(0); // son kare ve ilk kare yan yana: döngü birleşimi
  const inputs = picks.flatMap((i) => ['-i', path.join(framesDir, `f${String(i).padStart(5, '0')}.jpg`)]);
  const scaled = picks.map((_, i) => `[${i}:v]scale=480:-2[s${i}]`).join(';');
  const stack = picks.map((_, i) => `[s${i}]`).join('') + `hstack=inputs=${picks.length}`;
  run(ffmpeg, ['-y', ...inputs, '-filter_complex', `${scaled};${stack}`, '-frames:v', '1', file]);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { chromium } = loadPlaywright();
  const ffmpeg = args.stills ? null : ffmpegBin();
  const clipName = args.clip ? `${args.id}-${args.clip}` : args.id;
  const workDir = path.join(args.out ?? path.join(ROOT, 'node_modules/.cache/video'), clipName);
  fs.mkdirSync(workDir, { recursive: true });
  const code = await bundleScene(args.id, args.clip, workDir);
  const outDir = path.join(ROOT, 'public/videos/templates', args.id);
  fs.mkdirSync(outDir, { recursive: true });

  const variants = args.variant === 'all' ? ['desktop', 'mobile'] : [args.variant];
  const report = [];
  for (const variant of variants) {
    console.log(`▶ ${clipName} · ${variant}`);
    const { meta, framesDir, total } = await renderVariant({ chromium, code, variant, args, workDir });
    if (!framesDir) continue;

    const outBase = path.join(outDir, `${clipName}-${variant}`);
    const enc = encode({ ffmpeg, meta, framesDir, variant, outBase });
    const posterT = variant === 'mobile' && meta.posterMobile != null ? meta.posterMobile : meta.poster;
    const posterIndex = Math.min(total - 1, Math.round(posterT * meta.fps));
    const poster = await writePoster({
      chromium,
      framePng: fs.readFileSync(path.join(framesDir, `f${String(posterIndex).padStart(5, '0')}.jpg`)),
      file: `${outBase}-poster.jpg`
    });
    if (args.sheet) {
      const sheet = path.join(workDir, `sheet-${variant}.png`);
      contactSheet({ ffmpeg, framesDir, total, file: sheet, loop: meta.loop });
      console.log(`  temas sayfası: ${sheet}`);
    }
    if (!args.keep) fs.rmSync(framesDir, { recursive: true, force: true });
    const kb = (n) => `${Math.round(n / 1024)} KB`;
    const line = `${clipName}-${variant}: mp4 ${kb(enc.mp4.size)} (crf ${enc.mp4.crf}) · webm ${kb(enc.webm.size)} (crf ${enc.webm.crf}) · poster ${kb(poster.size)} (q ${poster.q}, ${poster.width}px)`;
    console.log(`  ${line}`);
    report.push(line);
  }
  if (report.length) fs.appendFileSync(path.join(workDir, 'rapor.txt'), report.join('\n') + '\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
