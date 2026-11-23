/**
 * verify:fonts (SEC-12): fonts are self-hosted. Fails when the build output
 * mentions Google Fonts, when a family the code asks for has no local
 * @font-face, or when an @font-face points at a missing file.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const GOOGLE = /fonts\.(googleapis|gstatic)\.com/;
const SYSTEM = new Set(['Georgia', 'Times New Roman', 'Arial Narrow']);
const CSS_FILES = ['src/styles/fonts.css', 'public/fonts/templates.css'];
let failures = 0;

function check(ok: boolean, label: string, detail = ''): void {
  console.log(`  ${ok ? '✓' : '✗'} ${label}${ok || !detail ? '' : `: ${detail}`}`);
  if (!ok) failures++;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

console.log('Build çıktısı (dist/)');
const dist = path.join(ROOT, 'dist');
check(existsSync(dist), 'dist/ var (önce npm run build)');
if (existsSync(dist)) {
  const hits = walk(dist)
    .filter((f) => /\.(js|css|html)$/.test(f))
    .filter((f) => GOOGLE.test(readFileSync(f, 'utf8')))
    .map((f) => path.relative(ROOT, f));
  check(hits.length === 0, "Google Fonts'a başvuru yok", hits.join(', '));
}

console.log('Kaynak');
const sources = walk(path.join(ROOT, 'src')).filter((f) => /\.(tsx?|css)$/.test(f));
const srcHits = sources.filter((f) => GOOGLE.test(readFileSync(f, 'utf8'))).map((f) => path.relative(ROOT, f));
check(srcHits.length === 0, "src/ altında Google Fonts adresi yok", srcHits.join(', '));

console.log('@font-face tanımları');
const declared = new Set<string>();
for (const rel of CSS_FILES) {
  const css = readFileSync(path.join(ROOT, rel), 'utf8');
  for (const m of css.matchAll(/font-family:\s*'([^']+)'/g)) declared.add(m[1]);
  const missing = [...css.matchAll(/url\('(\/fonts\/[^']+)'\)/g)]
    .map((m) => m[1])
    .filter((u) => !existsSync(path.join(ROOT, 'public', u)));
  check(missing.length === 0, `${rel}: her url public/ altında var`, missing.join(', '));
}
const licenseless = readdirSync(path.join(ROOT, 'public/fonts'))
  .filter((d) => statSync(path.join(ROOT, 'public/fonts', d)).isDirectory())
  .filter((d) => !existsSync(path.join(ROOT, 'public/fonts', d, 'LICENSE')));
check(licenseless.length === 0, 'her font klasöründe LICENSE var', licenseless.join(', '));

// Families the code asks for: css2 queries in templates, paper's handwriting map, quoted names in stacks.
const wanted = new Set<string>(['Inter', 'Playfair Display', 'Cormorant Garamond']);
const templateFiles = sources.filter((f) => f.includes(`${path.sep}templates${path.sep}`));
for (const f of templateFiles) {
  const text = readFileSync(f, 'utf8');
  const queries = [
    ...[...text.matchAll(/const FONTS? = '([^']+)'/g)].map((m) => m[1]),
    ...[...text.matchAll(/useTemplateFont\('([^']+)'\)/g)].map((m) => m[1]),
  ];
  for (const q of queries) for (const part of q.split('&family=')) wanted.add(part.split(':')[0].replace(/\+/g, ' '));
  if (f.endsWith('fontlar.ts')) {
    for (const m of text.matchAll(/aile: '([^']+)'/g)) wanted.add(m[1]);
    for (const m of text.matchAll(/"([A-Z][A-Za-z0-9 ]+)"/g)) if (!SYSTEM.has(m[1])) wanted.add(m[1]);
  }
}
const undeclared = [...wanted].filter((f) => !declared.has(f)).sort();
check(undeclared.length === 0, `istenen ${wanted.size} ailenin hepsi yerel (${declared.size} tanımlı)`, undeclared.join(', '));

if (failures) {
  console.error(`✗ verify:fonts: ${failures} hata`);
  process.exit(1);
}
console.log('✓ Fontlar kendi alan adımızdan: build çıktısında Google yok, istenen her aile yerel.');
