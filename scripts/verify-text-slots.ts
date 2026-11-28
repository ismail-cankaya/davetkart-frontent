/**
 * Davetiye metinleri denetimi — `npm run verify:text-slots` (Faz 24, K301–K304)
 *
 *  1. Sözleşme ↔ varsayılanlar: `text-slots.json`'daki anahtarlar `tr.json`'daki düzenlenebilir anahtarların
 *     ta kendisi; her varsayılan `maxLength`'e sığar, tek satırlıda satır sonu yok, yer tutucu bir kez geçer.
 *  2. Kod ↔ varsayılanlar: şablonların okuduğu her anahtar (`<InvText k>`, `t()`, `fixed()`) var.
 *  3. Kapsamlar: koddaki her `textScopes`/`kapsam` adı `tr.json`'da var, `tr.json`'da sahipsiz kapsam yok.
 *  4. Güvenlik: şablonlarda `dangerouslySetInnerHTML` yok; flavor'a metin alanı geri dönmedi.
 *  5. Tavan: koda gömülü kalan metin sayısı dosya başına `scripts/text-slots/baseline.json`'u aşmaz.
 *  6. Backend kopyası (kardeş depo varsa): `contracts/text-slots.json` birebir aynı.
 *  7. Editör mantığı (Faz 25): yazma/silme, doğrulama, kategori anahtarları, geri al sınırı, Elit sorusu.
 *
 * Ayrıntı: docs/rehber/scripts/verify-text-slots.md
 */
import fs from 'node:fs';
import path from 'node:path';
import tr from '../src/invitationText/locales/tr.json';
import { TEXT_SLOTS } from '../src/contracts/textSlots';
import type { InvitationTextBundle } from '../src/invitationText/types';
import { countByFile, scanHardcodedTexts } from './text-slots/scan';
import baseline from './text-slots/baseline.json';
import {
  HISTORY_LIMIT,
  categoryScopedKeys,
  pushHistory,
  redoHistory,
  textProblem,
  undoHistory,
  withText,
  withoutText,
  type History
} from '../src/invitationText/overrides';
import { hasCustomTexts } from '../src/invitationText/hasCustomTexts';
import type { TextOverrides } from '../src/invitationText/types';

const bundle = tr as InvitationTextBundle;
const ROOT = process.cwd();
const TEMPLATES = path.join(ROOT, 'src/components/templates');
let failures = 0;

const ok = (label: string): void => console.log(`  ✓ ${label}`);
const fail = (label: string): void => {
  failures += 1;
  console.error(`  ✗ ${label}`);
};
const section = (title: string): void => console.log(`\n${title}`);
const sample = (items: string[]): string => items.slice(0, 6).join(', ') + (items.length > 6 ? ` … (+${items.length - 6})` : '');

function filesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) out.push(...filesUnder(full));
    else if (/\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

const editable = new Map<string, string[]>();
const collect = (texts: Record<string, string>): void => {
  for (const [key, text] of Object.entries(texts)) editable.set(key, [...(editable.get(key) ?? []), text]);
};
collect(bundle.shared);
Object.values(bundle.categories).forEach(collect);
Object.values(bundle.scopes).forEach(collect);

// ——— 1 ———
section('Sözleşme ↔ varsayılan metinler');
{
  const before = failures;
  const contractKeys = Object.keys(TEXT_SLOTS.slots).sort();
  const bundleKeys = [...editable.keys()].sort();
  const missing = bundleKeys.filter((k) => !TEXT_SLOTS.slots[k]);
  const extra = contractKeys.filter((k) => !editable.has(k));
  if (missing.length) fail(`sözleşmede olmayan anahtar: ${sample(missing)} → npm run text-slots:export`);
  if (extra.length) fail(`varsayılanı olmayan sözleşme anahtarı: ${sample(extra)}`);
  const fixedClash = Object.keys(bundle.fixed).filter((k) => editable.has(k));
  if (fixedClash.length) fail(`hem düzenlenebilir hem sabit: ${sample(fixedClash)}`);

  const tooLong: string[] = [];
  const newline: string[] = [];
  const placeholder: string[] = [];
  for (const [key, texts] of editable) {
    const slot = TEXT_SLOTS.slots[key];
    if (!slot) continue;
    for (const text of texts) {
      if ([...text].length > slot.maxLength) tooLong.push(`${key} (${[...text].length}>${slot.maxLength})`);
      if (!slot.multiline && /\n/.test(text)) newline.push(key);
      for (const name of slot.placeholders ?? []) {
        if (text.split(`{${name}}`).length !== 2) placeholder.push(`${key} {${name}}`);
      }
    }
  }
  if (tooLong.length) fail(`varsayılanı sınırı aşıyor: ${sample(tooLong)}`);
  if (newline.length) fail(`tek satırlık anahtarda satır sonu: ${sample(newline)}`);
  if (placeholder.length) fail(`yer tutucu tam bir kez geçmiyor: ${sample(placeholder)}`);
  if (TEXT_SLOTS.locales.join() !== 'tr') fail(`v2.0'da yalnızca tr: ${TEXT_SLOTS.locales.join(', ')}`);
  if (failures === before) ok(`${contractKeys.length} anahtar, hepsinin varsayılanı sınırında`);
}

// ——— 2, 3, 4 ———
const sources = [...filesUnder(TEMPLATES), ...filesUnder(path.join(ROOT, 'src/invitationText'))].map((f) => ({
  file: path.relative(ROOT, f),
  text: fs.readFileSync(f, 'utf8')
}));

section('Kod ↔ varsayılan metinler');
{
  const before = failures;
  const used = new Set<string>();
  const KEY = /^[a-z]+\.[A-Za-z0-9.-]+$/;
  for (const { text } of sources) {
    for (const m of text.matchAll(/\bk="([^"]+)"/g)) used.add(m[1]);
    for (const m of text.matchAll(/\bk=\{([^}]*)\}/g)) for (const s of m[1].matchAll(/'([^']+)'/g)) used.add(s[1]);
    for (const m of text.matchAll(/\b(?:t|fixed)\('([^']+)'\)/g)) used.add(m[1]);
  }
  const unknown = [...used].filter((k) => KEY.test(k) && !editable.has(k) && !(k in bundle.fixed));
  if (unknown.length) fail(`kodun okuduğu ama tr.json'da olmayan anahtar: ${sample(unknown)}`);
  if (failures === before) ok(`koddaki ${used.size} anahtarın hepsi tanımlı`);
}

section('Kapsamlar');
{
  const before = failures;
  const referenced = new Set<string>(['kitap', 'sergi']);
  for (const { text } of sources) {
    for (const m of text.matchAll(/textScopes: \['([\w-]+)'/g)) referenced.add(m[1]);
    for (const m of text.matchAll(/kapsam: '([\w-]+)'/g)) referenced.add(m[1]);
  }
  const unknown = [...referenced].filter((s) => !bundle.scopes[s]);
  const orphan = Object.keys(bundle.scopes).filter((s) => !referenced.has(s));
  if (unknown.length) fail(`tr.json'da olmayan kapsam: ${sample(unknown)}`);
  if (orphan.length) fail(`kodda kullanılmayan kapsam: ${sample(orphan)}`);
  if (failures === before) ok(`${referenced.size} kapsamın hepsi tanımlı, sahipsiz kapsam yok`);
}

section('Güvenlik ve geri dönüş');
{
  const before = failures;
  const html = sources.filter((s) => s.text.includes('dangerouslySetInnerHTML')).map((s) => s.file);
  if (html.length) fail(`şablonda dangerouslySetInnerHTML: ${sample(html)}`);
  const flavorText = sources
    .filter((s) => /\b(?:tagline|envelopeLabel|giftNote)\s*:\s*['"`]|\b(?:headings|eyebrows)\s*:\s*\{/.test(s.text))
    .map((s) => s.file);
  if (flavorText.length) fail(`flavor'a metin alanı geri döndü (tr.json'a taşı): ${sample(flavorText)}`);
  if (failures === before) ok('HTML enjeksiyonu yok, flavor metin taşımıyor');
}

// ——— 5 ———
section('Gömülü metin tavanı');
{
  const before = failures;
  const now = countByFile(scanHardcodedTexts(TEMPLATES));
  const allowed = (baseline as { total: number; files: Record<string, number> }).files;
  const grew = Object.entries(now)
    .filter(([file, n]) => n > (allowed[file] ?? 0))
    .map(([file, n]) => `${file} (${allowed[file] ?? 0} → ${n})`);
  if (grew.length) fail(`yeni gömülü metin (tr.json'a taşı): ${sample(grew)}`);
  const total = Object.values(now).reduce((a, b) => a + b, 0);
  const cap = (baseline as { total: number }).total;
  if (failures === before) {
    ok(`gömülü metin ${total} ≤ tavan ${cap}` + (total < cap ? ' (tavan indirilebilir: npm run text-slots:baseline)' : ''));
  }
}

// ——— 7 ——— (Faz 25)
section('Editör mantığı');
{
  const before = failures;
  const base: TextOverrides = { tr: { 'gift.note': 'Not' } };
  const set = withText(base, 'tr', 'rsvp.submit', '  Geliyorum  ', 'Katılımımı Bildir');
  if (set.tr?.['rsvp.submit'] !== 'Geliyorum') fail('withText kırpmıyor ya da yazmıyor');
  if (set.tr?.['gift.note'] !== 'Not') fail('withText başka metni siliyor');
  if (withText(set, 'tr', 'rsvp.submit', 'Katılımımı Bildir', 'Katılımımı Bildir').tr?.['rsvp.submit'] !== undefined) {
    fail('varsayılana eşit metin saklanıyor (K303: saklanmamalı)');
  }
  if (withText(base, 'tr', 'rsvp.submit', 'a\nb', undefined).tr?.['rsvp.submit'] !== 'a b') fail('tek satırlıkta satır sonu kalıyor');
  if (withoutText(set, 'tr', 'rsvp.submit').tr?.['rsvp.submit'] !== undefined) fail('withoutText silmiyor');
  if (textProblem('rsvp.submit', 'x'.repeat(500)) !== 'tooLong') fail('sınır aşımı yakalanmıyor');
  if (textProblem('rsvp.submit', '   ') !== 'empty') fail('boş metin yakalanmıyor');
  if (textProblem('rsvp.deadline', 'tarih yok') !== 'placeholder') fail('eksik {date} yakalanmıyor');
  if (textProblem('rsvp.deadline', '{date} kadar') !== null) fail('geçerli {date} reddediliyor');
  const scoped = categoryScopedKeys({ tr: { 'hero.tagline': 'x', 'rsvp.submit': 'y' } }, 'tr');
  if (scoped.join() !== 'hero.tagline') fail(`kategori anahtarları yanlış: ${scoped.join()}`);
  let history: History<number> = { past: [], future: [] };
  for (let i = 0; i < HISTORY_LIMIT + 10; i++) history = pushHistory(history, i);
  if (history.past.length !== HISTORY_LIMIT) fail(`geri al geçmişi ${HISTORY_LIMIT}'i aşıyor`);
  const undone = undoHistory(history, 999);
  const redone = undone && redoHistory(undone.history, undone.value);
  if (!undone || !redone || redone.value !== 999) fail('geri al / yinele dönmüyor');
  if (!hasCustomTexts({ textOverrides: { tr: { 'x.y': 'z' } } }) || hasCustomTexts({ textOverrides: { tr: {} } })) {
    fail('hasCustomTexts boş grubu sayıyor ya da doluyu saymıyor');
  }
  if (failures === before) ok('metin yazma/silme, doğrulama, kategori anahtarları, geçmiş sınırı ve Elit sorusu doğru');
}

// ——— 6 ———
section('Backend kopyası');
{
  const sibling = path.resolve(ROOT, '../davetkart-backend-php-laravel/contracts/text-slots.json');
  if (!fs.existsSync(sibling)) {
    console.log('  – kardeş backend deposu yok; eşitlik backend testinde (TextSlotsContractTest) sınanır');
  } else {
    const ours = fs.readFileSync(path.join(ROOT, 'src/contracts/text-slots.json'), 'utf8');
    const theirs = fs.readFileSync(sibling, 'utf8');
    if (ours === theirs) ok('backend contracts/text-slots.json birebir aynı');
    else fail('backend contracts/text-slots.json farklı → aynen kopyala');
  }
}

if (failures > 0) {
  console.error(`\n✗ ${failures} sorun.`);
  process.exit(1);
}
console.log('\n✓ Davetiye metinleri sözleşmeyle, kodla ve backend kopyasıyla tutarlı.');
