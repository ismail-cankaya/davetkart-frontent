/**
 * Plan kuralları denetimi — `npm run verify:plans` (Faz 18 · OPS-01 · K147)
 *
 * "Hangi planda ne var" kuralını backend UYGULAR (`config/davetkart.php`), arayüz
 * GÖSTERİR. Arayüzdeki üç kopya, backend sözleşmesinin kopyasıyla
 * (`src/contracts/plan-rules.json`) karşılaştırılır:
 *
 *  (a) `data.ts` → `minimumTier`              ↔ `presetTiers` (iki yönde)
 *  (b) `SUBSCRIPTION_PLANS` özellik matrisi   ↔ `moduleTiers`, `rsvpLimits`, `whiteLabelTier`
 *  (c) `getRequiredTier()` ve `TIER_RANK`     ↔ sözleşmeden hesaplanan beklenen plan
 *
 * 🔴 Kırmızıysa farkı bir tarafa "uydurma": hangi şablonun hangi planda olduğu bir
 * fiyat kararıdır ve backend'de verilir. Ayrıntı: docs/rehber/scripts/verify-plan-rules.md
 */
import { DERIVED_MODULES, MODULE_FIELDS, PLAN_RULES } from '../src/contracts/planRules';
import { INITIAL_INVITATION, SUBSCRIPTION_PLANS } from '../src/data';
import { TEMPLATE_PRESETS } from '../src/templateCatalog';
import { TIER_RANK, getRequiredTier } from '../src/stores/useSubscriptionStore';
import { isSubscriptionTier } from '../src/types';
import type { Invitation, SubscriptionPlan } from '../src/types';

const { tierOrder, rsvpLimits, moduleTiers, presetTiers, whiteLabelTier } = PLAN_RULES;

let failures = 0;

function ok(label: string): void {
  console.log(`  ✓ ${label}`);
}

function fail(label: string): void {
  failures += 1;
  console.error(`  ✗ ${label}`);
}

function section(title: string): void {
  console.log(`\n${title}`);
}

/** Bir bölüm kendi içinde temiz geçtiyse tek satır özet yazar. */
function summarize(before: number, label: string): void {
  if (failures === before) ok(label);
}

/** Sözleşmedeki sıra: en düşük plan 0. Bilinmeyen plan -1. */
const rank = (tier: string): number => tierOrder.indexOf(tier);
const lowestTier = tierOrder[0];
const covers = (plan: string, required: string): boolean => rank(plan) >= rank(required);
const sorted = (values: readonly string[]): string[] => [...values].sort();
const same = (left: readonly string[], right: readonly string[]): boolean =>
  JSON.stringify(left) === JSON.stringify(right);

// ------------------------------------------------- 0. sözleşme ve plan sırası

function verifyContractAndTierOrder(): void {
  section('Sözleşme ve plan sırası');
  const before = failures;

  for (const tier of tierOrder) {
    if (!isSubscriptionTier(tier)) fail(`sözleşmedeki "${tier}" planını arayüz tanımıyor (types.ts → SubscriptionTier)`);
  }

  const referenced: Array<[string, string]> = [
    ...Object.entries(moduleTiers).map(([name, tier]): [string, string] => [`moduleTiers.${name}`, tier]),
    ...Object.entries(presetTiers).map(([name, tier]): [string, string] => [`presetTiers.${name}`, tier]),
    ['whiteLabelTier', whiteLabelTier]
  ];
  for (const [where, tier] of referenced) {
    if (rank(tier) === -1) fail(`${where} = "${tier}" plan sırasında (tierOrder) yok`);
  }

  if (!same(sorted(Object.keys(rsvpLimits)), sorted(tierOrder))) {
    fail(`rsvpLimits planları [${Object.keys(rsvpLimits)}] ≠ tierOrder [${tierOrder}]`);
  }

  // TIER_RANK'in mutlak sayıları değil, verdiği SIRA sözleşmeyle aynı olmalı.
  const frontendOrder = Object.keys(TIER_RANK).sort(
    (a, b) => TIER_RANK[a as keyof typeof TIER_RANK] - TIER_RANK[b as keyof typeof TIER_RANK]
  );
  if (!same(frontendOrder, tierOrder)) {
    fail(`TIER_RANK sırası [${frontendOrder}] ≠ sözleşme [${tierOrder}]`);
  }

  const cardIds = SUBSCRIPTION_PLANS.map((plan) => plan.id);
  if (!same(sorted(cardIds), sorted(tierOrder))) {
    fail(`fiyat kartları [${cardIds}] ≠ sözleşmedeki planlar [${tierOrder}]`);
  }

  summarize(before, `${tierOrder.length} plan, sıra aynı: ${tierOrder.join(' < ')}`);
}

// ------------------------------------------------- (a) premium şablonlar

function verifyPresets(): void {
  section('(a) Premium şablonlar: data.ts minimumTier ↔ presetTiers');
  const before = failures;

  // Yön 1: arayüz "premium" diyor → sunucu da uygulamalı. Tersi PARA kaybıdır (OPS-01).
  for (const preset of TEMPLATE_PRESETS) {
    if (preset.minimumTier === undefined) continue;

    const enforced = presetTiers[preset.id];
    if (enforced === undefined) {
      fail(`${preset.id}: arayüzde ${preset.minimumTier}+, sözleşmede YOK → sunucu her planda yayınlatır`);
    } else if (enforced !== preset.minimumTier) {
      fail(`${preset.id}: arayüzde ${preset.minimumTier}+, sözleşmede ${enforced}+`);
    }
  }

  // Yön 2: sunucu uyguluyor → arayüz de söylemeli. Tersi sürpriz 402'dir.
  for (const [id, enforced] of Object.entries(presetTiers)) {
    const preset = TEMPLATE_PRESETS.find((candidate) => candidate.id === id);
    if (preset === undefined) {
      fail(`${id}: sözleşmede ${enforced}+, data.ts'te böyle bir şablon yok`);
    } else if (preset.minimumTier === undefined) {
      fail(`${id}: sözleşmede ${enforced}+, data.ts'te minimumTier YOK → kullanıcı uyarısız 402 alır`);
    }
  }

  summarize(
    before,
    `${Object.keys(presetTiers).length} premium şablon iki tarafta aynı (toplam ${TEMPLATE_PRESETS.length} şablon)`
  );
}

// ------------------------------------------------- (b) fiyat kartı

/** Fiyat kartı satırı → o satırı açan backend kuralı. Etiket değişirse denetim durur. */
const MODULE_ROWS: ReadonlyArray<{ label: string; module: string }> = [
  { label: 'Geri sayım sayacı', module: 'show_timer' },
  { label: 'Zarf açılış animasyonu', module: 'show_envelope' },
  { label: 'Hikaye / Zaman çizelgesi', module: 'show_timeline' },
  { label: 'Fotoğraf galerisi', module: 'show_gallery' },
  { label: 'Hediye & IBAN modülü', module: 'show_gift' },
  { label: 'Metinleri özelleştirme', module: 'has_custom_texts' }
];
const WHITE_LABEL_ROW = 'Logosuz özel yayın';
/** LCV satırının etiketi plana göre değişir ("maksimum 100 kişi" / "Sınırsız"). */
const RSVP_ROW = /LCV/;
const RSVP_MODULE = 'show_rsvp';
const THEME_ROWS = { basic: 'Temel şablon koleksiyonu', premium: 'Premium tema koleksiyonu' };
/** Backend'de plan kuralı OLMAYAN satırlar: her planda açık olmalı. */
const UNGATED_ROWS: readonly string[] = ['Harita & Konum yönlendirmesi'];

function verifyRow(plan: SubscriptionPlan, label: string, source: string, minTier: string | undefined): void {
  const row = plan.features.find((feature) => feature.label === label);

  if (row === undefined) {
    fail(`${plan.name}: "${label}" satırı yok (etiket değiştiyse bu betikteki eşlemeyi güncelle)`);
    return;
  }
  if (minTier === undefined) {
    fail(`${plan.name}: "${label}" → ${source} sözleşmede yok`);
    return;
  }

  const expected = covers(plan.id, minTier);
  if (row.included !== expected) {
    fail(`${plan.name}: "${label}" included=${row.included}; sözleşme (${source} = ${minTier}) ${expected} diyor`);
  }
}

function verifyRsvpRow(plan: SubscriptionPlan): void {
  const rows = plan.features.filter((feature) => RSVP_ROW.test(feature.label));
  if (rows.length !== 1) {
    fail(`${plan.name}: tek bir LCV satırı bekleniyordu, ${rows.length} bulundu`);
    return;
  }

  const [row] = rows;
  const minTier = moduleTiers[RSVP_MODULE];
  if (minTier === undefined) {
    fail(`${plan.name}: "${row.label}" → moduleTiers.${RSVP_MODULE} sözleşmede yok`);
    return;
  }

  const expected = covers(plan.id, minTier);
  if (row.included !== expected) {
    fail(`${plan.name}: "${row.label}" included=${row.included}; sözleşme (moduleTiers.${RSVP_MODULE}) ${expected} diyor`);
  }

  // Satırdaki SAYI sözleşmedeki sınırla aynı olmalı; sınırsız planda sayı olmamalı.
  const limit = rsvpLimits[plan.id];
  const numbers = (row.label.match(/\d+/g) ?? []).map(Number);
  const matches =
    limit === null
      ? numbers.length === 0 && row.label.toLocaleLowerCase('tr').includes('sınırsız')
      : numbers.length === 1 && numbers[0] === limit;

  if (!matches) {
    fail(`${plan.name}: "${row.label}" ≠ sözleşmedeki LCV sınırı (${limit === null ? 'sınırsız' : limit})`);
  }
}

function verifyThemeRow(plan: SubscriptionPlan): void {
  const rows = plan.features.filter(
    (feature) => feature.label === THEME_ROWS.basic || feature.label === THEME_ROWS.premium
  );
  if (rows.length !== 1) {
    fail(`${plan.name}: tek bir şablon koleksiyonu satırı bekleniyordu, ${rows.length} bulundu`);
    return;
  }

  const premiumRanks = Object.values(presetTiers).map(rank);
  const planRank = rank(plan.id);
  // "Premium koleksiyon" ancak plan premium şablonların HEPSİNİ açıyorsa söylenebilir.
  const opensAll = premiumRanks.length > 0 && planRank >= Math.max(...premiumRanks);
  const opensNone = premiumRanks.length === 0 || planRank < Math.min(...premiumRanks);

  if (!opensAll && !opensNone) {
    fail(`${plan.name}: premium şablonların yalnızca bir kısmını açıyor; kart metni için karar gerek`);
    return;
  }

  const [row] = rows;
  const expected = opensAll ? THEME_ROWS.premium : THEME_ROWS.basic;
  if (row.label !== expected || !row.included) {
    fail(`${plan.name}: "${row.label}" (included=${row.included}); sözleşmeye göre "${expected}" olmalı`);
  }
}

function verifyFeatureMatrix(): void {
  section('(b) Fiyat kartı: SUBSCRIPTION_PLANS ↔ moduleTiers, rsvpLimits, whiteLabelTier');
  const before = failures;

  // Sözleşmedeki her modülün kartta bir satırı olmalı: yeni modül sessizce eklenemesin.
  const covered = new Set([...MODULE_ROWS.map((row) => row.module), RSVP_MODULE]);
  for (const module of Object.keys(moduleTiers)) {
    if (!covered.has(module)) fail(`sözleşmede yeni modül "${module}": fiyat kartında satırı, bu betikte eşlemesi yok`);
  }

  const known = new Set([
    ...MODULE_ROWS.map((row) => row.label),
    WHITE_LABEL_ROW,
    THEME_ROWS.basic,
    THEME_ROWS.premium,
    ...UNGATED_ROWS
  ]);

  for (const plan of SUBSCRIPTION_PLANS) {
    for (const row of MODULE_ROWS) {
      verifyRow(plan, row.label, `moduleTiers.${row.module}`, moduleTiers[row.module]);
    }
    verifyRow(plan, WHITE_LABEL_ROW, 'whiteLabelTier', whiteLabelTier);
    for (const label of UNGATED_ROWS) verifyRow(plan, label, 'kuralsız satır', lowestTier);
    verifyRsvpRow(plan);
    verifyThemeRow(plan);

    for (const feature of plan.features) {
      if (!known.has(feature.label) && !RSVP_ROW.test(feature.label)) {
        fail(`${plan.name}: tanınmayan satır "${feature.label}" (kuralı varsa eşle, yoksa UNGATED_ROWS'a ekle)`);
      }
    }
  }

  summarize(before, `${SUBSCRIPTION_PLANS.length} kartın bütün satırları sözleşmeyle aynı`);
}

// ------------------------------------------------- (c) getRequiredTier

function invitationWith(modules: readonly string[], imageTheme: string): Invitation {
  const invitation: Invitation = { ...INITIAL_INVITATION, imageTheme };
  for (const [module, field] of Object.entries(MODULE_FIELDS)) {
    invitation[field] = modules.includes(module);
  }
  // Türetilen kolon (Faz 24, K305): değiştirilmiş bir metin varsa açık.
  invitation.textOverrides = modules.includes('has_custom_texts') ? { tr: { 'rsvp.submit': 'Geliyorum' } } : {};
  for (const [module, derived] of Object.entries(DERIVED_MODULES)) {
    if (derived(invitation) !== modules.includes(module)) throw new Error(`invitationWith: ${module} türetilemedi`);
  }
  return invitation;
}

/** Sözleşmeden hesaplanan beklenen plan: açık modüllerin ve şablonun en yükseği (backend TierResolver). */
function expectedTier(modules: readonly string[], imageTheme: string): string {
  return [...modules.map((module) => moduleTiers[module]), presetTiers[imageTheme] ?? lowestTier].reduce(
    (highest, tier) => (rank(tier) > rank(highest) ? tier : highest),
    lowestTier
  );
}

function subsets<T>(items: readonly T[]): T[][] {
  return items.reduce<T[][]>((all, item) => [...all, ...all.map((subset) => [...subset, item])], [[]]);
}

function verifyRequiredTier(): void {
  section('(c) getRequiredTier() ↔ sözleşme');
  const before = failures;

  const modules = Object.keys(moduleTiers);
  const mapped = [...Object.keys(MODULE_FIELDS), ...Object.keys(DERIVED_MODULES)];
  if (!same(sorted(mapped), sorted(modules))) {
    fail(`MODULE_FIELDS + DERIVED_MODULES [${sorted(mapped)}] ≠ sözleşmedeki modüller [${sorted(modules)}]`);
    return;
  }

  let cases = 0;
  const compare = (onModules: readonly string[], imageTheme: string): void => {
    cases += 1;
    const actual = getRequiredTier(invitationWith(onModules, imageTheme));
    const expected = expectedTier(onModules, imageTheme);
    if (actual !== expected) {
      fail(`modüller [${onModules.join(', ') || 'yok'}] + şablon ${imageTheme}: arayüz ${actual}, sözleşme ${expected}`);
    }
  };

  // Her şablon tek başına (modülsüz): rozetin ve hesabın aynı listeden çıktığını sınar.
  for (const preset of TEMPLATE_PRESETS) compare([], preset.id);

  // Modüllerin bütün birleşimleri × (düz şablon + her premium plandan bir örnek).
  const plain = TEMPLATE_PRESETS.find((preset) => presetTiers[preset.id] === undefined);
  const samples = new Map<string, string>();
  for (const [id, tier] of Object.entries(presetTiers)) if (!samples.has(tier)) samples.set(tier, id);

  for (const theme of [plain?.id ?? 'sozlesmede-olmayan-sablon', ...samples.values()]) {
    for (const onModules of subsets(modules)) compare(onModules, theme);
  }

  summarize(before, `${cases} durumda arayüzün hesabı sözleşmeyle aynı`);
}

// ------------------------------------------------- çalıştır

verifyContractAndTierOrder();
verifyPresets();
verifyFeatureMatrix();
verifyRequiredTier();

if (failures > 0) {
  console.error(
    `\n${failures} fark bulundu. Kural backend'de değişir (config/davetkart.php → php artisan plans:export),` +
      '\nsonra kopya yenilenir (src/contracts/plan-rules.json). Farkı elle "düzeltme": bu bir fiyat kararı.'
  );
  process.exit(1);
}

console.log('\n✓ Plan kuralları backend sözleşmesiyle aynı: premium şablonlar, fiyat kartı, gereken plan hesabı.');
