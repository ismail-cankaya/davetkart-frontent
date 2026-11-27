/**
 * Metin sözleşmesini üretir — `npm run text-slots:export` (Faz 24, K301).
 *
 * `tr.json`'daki düzenlenebilir anahtarlardan (shared + categories + scopes; `fixed` hariç)
 * `src/contracts/text-slots.json`'ı yazar. Var olan anahtarın `maxLength`/`multiline` değeri
 * korunur (elle ayarlanabilir); yeni anahtara en uzun varsayılandan bir değer önerilir.
 * Çıktı backend'e aynen kopyalanır: `davetkart-backend-php-laravel/contracts/text-slots.json`.
 */
import fs from 'node:fs';
import path from 'node:path';
import tr from '../../src/invitationText/locales/tr.json';
import current from '../../src/contracts/text-slots.json';
import type { TextSlot, TextSlotContract } from '../../src/contracts/textSlots';
import type { InvitationTextBundle } from '../../src/invitationText/types';

const bundle = tr as InvitationTextBundle;
const previous = current as TextSlotContract;
const PLACEHOLDER = /\{([a-z]+)\}/g;

interface Seen {
  longest: number;
  levels: Set<'shared' | 'category' | 'template'>;
  placeholders: Set<string>;
}

const seen = new Map<string, Seen>();
function add(key: string, text: string, level: 'shared' | 'category' | 'template'): void {
  const entry = seen.get(key) ?? { longest: 0, levels: new Set(), placeholders: new Set() };
  entry.longest = Math.max(entry.longest, [...text].length);
  entry.levels.add(level);
  for (const match of text.matchAll(PLACEHOLDER)) entry.placeholders.add(match[1]);
  seen.set(key, entry);
}

for (const [key, text] of Object.entries(bundle.shared)) add(key, text, 'shared');
for (const texts of Object.values(bundle.categories)) for (const [key, text] of Object.entries(texts)) add(key, text, 'category');
for (const texts of Object.values(bundle.scopes)) for (const [key, text] of Object.entries(texts)) add(key, text, 'template');

const slots: Record<string, TextSlot> = {};
for (const key of [...seen.keys()].sort()) {
  const entry = seen.get(key)!;
  const old = previous.slots[key];
  const scope = entry.levels.has('category') ? 'category' : entry.levels.has('shared') ? 'shared' : 'template';
  const suggested = Math.min(320, Math.max(24, Math.ceil((entry.longest * 1.6) / 8) * 8));
  const slot: TextSlot = {
    group: key.split('.')[0],
    scope,
    maxLength: Math.max(old?.maxLength ?? suggested, entry.longest),
    multiline: old?.multiline ?? entry.longest > 60,
    ...(entry.placeholders.size > 0 ? { placeholders: [...entry.placeholders].sort() } : {})
  };
  slots[key] = slot;
}

const next: TextSlotContract = { version: previous.version, locales: previous.locales, maxOverrides: previous.maxOverrides, slots };
const file = path.resolve(process.cwd(), 'src/contracts/text-slots.json');
fs.writeFileSync(file, JSON.stringify(next, null, 4) + '\n');
console.log(`${Object.keys(slots).length} anahtar → ${path.relative(process.cwd(), file)}`);
console.log('Backend kopyası: davetkart-backend-php-laravel/contracts/text-slots.json (aynen kopyala)');
