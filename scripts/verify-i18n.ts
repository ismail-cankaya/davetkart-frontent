/**
 * Gömülü Türkçe metin mandalı — `npm run verify:i18n` (Faz 19.20, FE-01, K221)
 *
 * Çekirdek `.tsx` dosyalarında (şablonlar hariç) `t()` dışında kalan Türkçe
 * metni sayar; sayı `scripts/i18n-baseline.json` ile dosya dosya eşit olmalı.
 * Artış: metni `t()`'ye taşı. Azalış: `npm run verify:i18n -- --update`.
 *
 * Ayrıntılı açıklama: docs/rehber/scripts/verify-i18n.md
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// npm betikleri paket kökünden koşar; derlenen dosya node_modules/.cache'te.
const ROOT = process.cwd();
const BASELINE = path.join(ROOT, 'scripts', 'i18n-baseline.json');
const TEMPLATES = 'src/components/templates/';

// Denetim ölçüsüyle (fe-d1-metrics.mjs §2b) aynı ifadeler.
const JSX_TEXT = />[^<>{}]*[şŞğĞıİçÇöÖüÜ][^<>{}]*</g;
const LITERAL = /['"`][^'"`\n]*[şŞğĞıİçÇöÖüÜ][^'"`\n]*['"`]/g;

interface Baseline {
  total: number;
  files: Record<string, number>;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

export function countEmbedded(source: string): number {
  const body = stripComments(source.replace(/\r\n/g, '\n'));
  return (body.match(JSX_TEXT) ?? []).length + (body.match(LITERAL) ?? []).length;
}

function measure(): Baseline {
  const files: Record<string, number> = {};
  let total = 0;
  const all = walk(path.join(ROOT, 'src'))
    .map(f => path.relative(ROOT, f).replace(/\\/g, '/'))
    .filter(f => f.endsWith('.tsx') && !f.startsWith(TEMPLATES))
    .sort();
  for (const f of all) {
    const n = countEmbedded(readFileSync(path.join(ROOT, f), 'utf8'));
    if (n > 0) {
      files[f] = n;
      total += n;
    }
  }
  return { total, files };
}

function main(): void {
  const now = measure();

  if (process.argv.includes('--update')) {
    writeFileSync(BASELINE, JSON.stringify(now, null, 2).replace(/\n/g, '\r\n') + '\r\n');
    console.log(`✓ Taban yazıldı: ${now.total} parça, ${Object.keys(now.files).length} dosya.`);
    return;
  }

  const base = JSON.parse(readFileSync(BASELINE, 'utf8')) as Baseline;
  const grew: string[] = [];
  const shrank: string[] = [];
  for (const f of new Set([...Object.keys(base.files), ...Object.keys(now.files)])) {
    const was = base.files[f] ?? 0;
    const is = now.files[f] ?? 0;
    if (is > was) grew.push(`  ✗ ${f}: ${was} → ${is} (metni t() ile çevir)`);
    if (is < was) shrank.push(`  ✗ ${f}: ${was} → ${is} (taban düşmeli)`);
  }

  if (grew.length || shrank.length) {
    for (const line of [...grew, ...shrank]) console.error(line);
    console.error(`\nGömülü Türkçe metin: taban ${base.total}, şimdi ${now.total}.`);
    if (shrank.length && !grew.length) console.error('Azaldı — tabanı düşür: npm run verify:i18n -- --update');
    process.exit(1);
  }

  console.log(`✓ Gömülü Türkçe metin tabanla aynı: ${now.total} parça, ${Object.keys(now.files).length} dosya (şablonlar hariç).`);
}

main();
