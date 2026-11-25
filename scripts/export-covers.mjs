/**
 * B-E4 (K235): şablon kapaklarını `dist/covers/<preset>.<uzantı>` sabit adıyla ve `dist/covers/index.json`
 * dizinini yazar; backend paylaşım önizlemesi (og:image) bu dizini okur. `npm run build`'in son adımı.
 * Ayrıntılı açıklama: docs/rehber/scripts/export-covers.md
 */
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const work = path.join(root, 'node_modules/.cache/export-covers');
const OG_TYPES = new Set(['.jpg', '.jpeg', '.png', '.webp']); // OG tarayıcıları SVG göstermez
const MAX_BYTES = 600 * 1024; // WhatsApp büyük görseli önizlemede göstermiyor

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('export-covers: dist/ yok — önce vite build.');
  process.exit(1);
}

fs.rmSync(work, { recursive: true, force: true });
await build({
  stdin: {
    contents: "import { TEMPLATE_PRESETS } from './src/templateCatalog'; module.exports = TEMPLATE_PRESETS.map((p) => [p.id, p.imageUrl]);",
    resolveDir: root,
    loader: 'ts',
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  packages: 'external',
  outdir: work,
  entryNames: 'catalog',
  assetNames: 'assets/[name]-[hash]',
  publicPath: '',
  loader: { '.png': 'file', '.jpg': 'file', '.jpeg': 'file', '.webp': 'file', '.svg': 'file' },
  define: { 'import.meta.env': JSON.stringify({ VITE_API_BASE_URL: '/api', BASE_URL: '/' }) },
  logLevel: 'error',
});

/** @type {[string, string][]} */
const presets = createRequire(import.meta.url)(path.join(work, 'catalog.js'));
const out = path.join(dist, 'covers');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const index = {};
const skipped = { none: 0, svg: 0, large: 0 };
for (const [id, url] of presets) {
  if (!url) { skipped.none++; continue; }
  // `/images/...` public klasöründen; içe aktarılan görsel esbuild'in kopyasından.
  const source = url.startsWith('/') ? path.join(root, 'public', url) : path.join(work, url);
  const ext = path.extname(source).toLowerCase();
  if (!OG_TYPES.has(ext)) { skipped.svg++; continue; }
  if (!/^[a-z0-9-]+$/.test(id) || !fs.existsSync(source)) {
    console.error(`export-covers: ${id} → ${url} bulunamadı`);
    process.exit(1);
  }
  if (fs.statSync(source).size > MAX_BYTES) { skipped.large++; continue; }
  fs.copyFileSync(source, path.join(out, `${id}${ext}`));
  index[id] = `/covers/${id}${ext}`;
}

fs.writeFileSync(path.join(out, 'index.json'), JSON.stringify(index));
const count = Object.keys(index).length;
console.log(`✓ export-covers: ${count} kapak dist/covers/ (kapaksız ${skipped.none}, SVG ${skipped.svg}, > 600 kB ${skipped.large})`);
if (count === 0) process.exit(1);
