/**
 * B-E5: `src/templatePresetColors.ts`'i katalogdan üretir (misafir sayfası kataloğu indirmesin diye).
 * Çalıştır: `npm run gen:preset-colors`. `verify-render` ikisinin eşit kaldığını denetler.
 * Ayrıntılı açıklama: docs/rehber/src/templatePresetColors.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { TEMPLATE_PRESETS } from '../src/templateCatalog';

const lines = TEMPLATE_PRESETS.map((p) => `  ${JSON.stringify(p.id)}: ${JSON.stringify(p.primaryColor)},`);
const source = [
  '// ÜRETİLDİ — elle düzenleme: `npm run gen:preset-colors` (kaynak: src/templateCatalog.ts). B-E5.',
  '// Ayrıntılı açıklama: docs/rehber/src/templatePresetColors.md',
  '',
  '/** Şablon kimliği → katalog zemin rengi; misafir sayfası kataloğun tamamını indirmeden kullanır. */',
  'export const PRESET_PRIMARY_COLORS: Readonly<Record<string, string>> = {',
  ...lines,
  '};',
  '',
  '/** Katalogda olmayan kimlik bu şablona düşer (kataloğun ilk şablonu). */',
  `export const DEFAULT_PRESET_ID = ${JSON.stringify(TEMPLATE_PRESETS[0].id)};`,
  '',
].join('\r\n');

fs.writeFileSync(path.join(process.cwd(), 'src/templatePresetColors.ts'), source);
console.log(`✓ src/templatePresetColors.ts: ${TEMPLATE_PRESETS.length} şablon`);
