/**
 * verify:bundle (FE-10): paket bütçesi. `dist/` üzerinde ölçer:
 * - ilk yükleme = `index.html`'in giriş betiği + statik içe aktardığı parçalar,
 * - misafir sayfası = ilk yükleme + `InvitePage` parçası ve statik bağımlılıkları.
 * Ayrıca her şablon tembel kalmalı: kategori barrel'ları `TemplateRenderer`'a statik giremez
 * ve barrel'daki her şablonun `THEME_PRESETS`'te tembel girdisi olmalı.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
/** Ham (sıkıştırılmamış) bayt. Gerekçe ve ölçümler: docs/rehber/scripts/verify-bundle.md. */
const BUDGET = { initial: 720_000, guest: 900_000 };
const CATEGORIES = ['dugun', 'kina', 'nisan', 'sunnet', 'dogum-gunu', 'mezuniyet', 'baby-shower', 'parti', 'kurumsal'];
let failures = 0;

function check(ok: boolean, label: string, detail = ''): void {
  console.log(`  ${ok ? '✓' : '✗'} ${label}${ok || !detail ? '' : `: ${detail}`}`);
  if (!ok) failures++;
}

const kb = (n: number) => `${(n / 1000).toFixed(1)} kB`;

/** Bir parçanın statik içe aktardığı parçalar (dinamik `import(` hariç), özyinelemeli. */
function closure(start: string[], seen = new Set<string>()): Set<string> {
  for (const file of start) {
    if (seen.has(file)) continue;
    seen.add(file);
    const code = readFileSync(path.join(DIST, file), 'utf8');
    const deps = [...code.matchAll(/(?:^|[;}\s])import\s*(?:[\w${}\s,*]+from\s*)?["']\.\/([\w.-]+\.js)["']/g)]
      .map((m) => `assets/${m[1]}`);
    closure(deps, seen);
  }
  return seen;
}

function measure(files: Set<string>): { raw: number; gzip: number } {
  let raw = 0;
  let gzip = 0;
  for (const f of files) {
    const buf = readFileSync(path.join(DIST, f));
    raw += buf.length;
    gzip += gzipSync(buf).length;
  }
  return { raw, gzip };
}

console.log('Paket bütçesi (dist/)');
check(existsSync(path.join(DIST, 'index.html')), 'dist/index.html var (önce npm run build)');
if (existsSync(path.join(DIST, 'index.html'))) {
  const html = readFileSync(path.join(DIST, 'index.html'), 'utf8');
  const entry = html.match(/<script type="module"[^>]*src="\/(assets\/[^"]+\.js)"/)?.[1];
  check(Boolean(entry), 'giriş betiği bulundu');
  if (entry) {
    const initial = closure([entry]);
    const i = measure(initial);
    check(i.raw <= BUDGET.initial, `ilk yükleme ${kb(i.raw)} (gzip ${kb(i.gzip)}, ${initial.size} dosya) ≤ ${kb(BUDGET.initial)}`);

    const invite = readdirSync(path.join(DIST, 'assets')).find((f) => /^InvitePage-[\w-]+\.js$/.test(f));
    check(Boolean(invite), 'InvitePage parçası ayrı');
    if (invite) {
      const guest = closure([`assets/${invite}`], new Set(initial));
      const g = measure(guest);
      check(g.raw <= BUDGET.guest, `misafir sayfası (şablon hariç) ${kb(g.raw)} (gzip ${kb(g.gzip)}) ≤ ${kb(BUDGET.guest)}`);
    }
  }
}

console.log('Şablonlar tembel');
const renderer = readFileSync(path.join(ROOT, 'src/components/templates/TemplateRenderer.tsx'), 'utf8');
const staticBarrels = CATEGORIES.filter((c) => new RegExp(`^import[^;]*from '\\./${c}(/[^']*)?';`, 'm').test(renderer));
check(staticBarrels.length === 0, "TemplateRenderer kategori barrel'ını statik içe aktarmıyor", staticBarrels.join(', '));
const mapped = new Set([...renderer.matchAll(/import\('\.\/([a-z-]+\/[A-Za-z0-9]+)'\)/g)].map((m) => m[1]));
const unmapped: string[] = [];
let total = 0;
for (const c of CATEGORIES) {
  const barrel = readFileSync(path.join(ROOT, `src/components/templates/${c}/index.ts`), 'utf8');
  for (const m of barrel.matchAll(/export \{ \w+ \} from '\.\/(\w+)'/g)) {
    total++;
    if (!mapped.has(`${c}/${m[1]}`)) unmapped.push(`${c}/${m[1]}`);
  }
}
check(unmapped.length === 0, `barrel'lardaki ${total} şablonun hepsi THEME_PRESETS'te tembel`, unmapped.join(', '));

if (failures) {
  console.error(`✗ verify:bundle: ${failures} hata`);
  process.exit(1);
}
console.log('✓ Paket bütçesi içinde; şablonlar kendi parçalarında.');
