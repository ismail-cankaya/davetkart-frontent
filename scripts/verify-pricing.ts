/**
 * Fiyat kataloğu denetimi — `npm run verify:pricing` (Faz 13)
 *
 * 🔴 Faz 13'ün kuralı: **frontend'de fiyat yok.** Bu betik üç şeyi sınar:
 *
 * 1. **Kaynak taraması:** `src/` altında elle yazılmış bir paket fiyatı
 *    (`price: 399`, `₺549` …) kalmış mı? Kalırsa backend'in fiyatıyla bir gün
 *    ayrışır; ekranda bir sayı, kartta başka bir sayı görünür.
 * 2. **Katalog deposu (`usePricingStore`):** misafir `/public/plans`,
 *    oturumlu kullanıcı `/pricing` okur; kimlik değişince katalog yenilenir;
 *    geç gelen eski yanıt yenisini ezmez; hata "uydurma fiyat" üretmez.
 * 3. **Yöntem hâli (`paymentMethodsMode`)** ve kampanya bitişinin gösterimi.
 *
 * Gerçek axios örneği kullanılır; yalnızca taşıma katmanı (adapter) taklittir.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { api } from '../src/services/api';
import { useAuthStore } from '../src/stores/useAuthStore';
import { GUEST, planPriceOf, usePricingStore } from '../src/stores/usePricingStore';
import { paymentMethodsMode } from '../src/utils/paymentMethods';
import { formatPromotionEnd } from '../src/components/payment/PlanPriceTag';
import { SUBSCRIPTION_PLANS } from '../src/data';

let failures = 0;

function check(label: string, actual: unknown, expected: unknown): void {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    console.log(`  ✓ ${label}`);
    return;
  }
  failures += 1;
  console.error(`  ✗ ${label}\n      beklenen: ${e}\n      gelen:    ${a}`);
}

// ------------------------------------------------------------- 1. tarama

/** Yorum satırları atlanır: belgelerde "399 ₺" gibi örnekler serbest. */
const FORBIDDEN: { label: string; pattern: RegExp }[] = [
  { label: 'elle yazılmış fiyat alanı', pattern: /\b(price|firstInvitationPrice)\s*:\s*\d/ },
  { label: 'elle yazılmış ₺ tutarı', pattern: /₺\s?\d{2,}/ },
  { label: 'katalogdan fiyat çarpımı', pattern: /\.price\s*\*\s*100/ },
];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return name === 'locales' ? [] : sourceFiles(full);
    return /\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

function isComment(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('{/*');
}

function scanSources(): void {
  console.log('\nKaynak taraması: src/ altında fiyat yok');
  // Betik node_modules/.cache altına derlenir; kök npm'in çalıştığı dizin.
  const root = path.resolve(process.cwd(), 'src');
  const offenders: string[] = [];

  for (const file of sourceFiles(root)) {
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, index) => {
        if (isComment(line)) return;
        for (const { label, pattern } of FORBIDDEN) {
          if (pattern.test(line)) offenders.push(`${path.relative(root, file)}:${index + 1} — ${label}`);
        }
      });
  }

  check('elle yazılmış fiyat bulunmadı', offenders, []);
  check('SUBSCRIPTION_PLANS fiyat taşımıyor', SUBSCRIPTION_PLANS.some((plan) => 'price' in plan), false);
}

// ------------------------------------------------------------- 2. depo

type Reply = { status: number; data: unknown; delayMs?: number };
let calls: string[] = [];

function serve(route: (url: string) => Reply): void {
  calls = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api.defaults as any).adapter = async (config: Record<string, unknown>) => {
    const url = String(config.url ?? '');
    calls.push(url);
    const reply = route(url);
    if (reply.delayMs) await new Promise((resolve) => setTimeout(resolve, reply.delayMs));
    const response = { data: reply.data, status: reply.status, statusText: '', headers: {}, config };
    if (reply.status >= 400) {
      throw Object.assign(new Error(`HTTP ${reply.status}`), { isAxiosError: true, response, config });
    }
    return response;
  };
}

const plan = (tier: string, priceMinor: number, discountMinor = 0, kind: string | null = null) => ({
  tier,
  priceMinor,
  promotion: kind ? { kind, percent: Math.round((discountMinor / priceMinor) * 100), discountMinor, endsAt: null } : null,
  discountMinor,
  totalMinor: priceMinor - discountMinor,
});

const catalog = (personalized: boolean, goldDiscount = 0) => ({
  data: {
    currency: 'TRY',
    personalized,
    firstPublishPercent: 60,
    plans: [
      plan('standart', 24900),
      plan('gold', 39900, goldDiscount, goldDiscount > 0 ? 'first_publish' : null),
      plan('elit', 54900),
    ],
    paymentMethods: ['gift_code'],
    bankTransfer: null,
  },
});

const store = () => usePricingStore.getState();

function signIn(id: string | null): void {
  useAuthStore.setState(
    id === null
      ? { user: null, token: null, isAuthenticated: false }
      : {
          user: { id, firstName: 'Ayşe', lastName: 'Yılmaz', email: 'a@example.com' } as never,
          token: 't',
          isAuthenticated: true,
        },
  );
}

async function verifyStore(): Promise<void> {
  console.log('\nKatalog deposu');

  signIn(null);
  serve((url) => ({ status: 200, ...(url === '/public/plans' ? catalog(false) : catalog(true, 23940)) }));
  await store().load();
  check('misafir /public/plans okur', calls, ['/public/plans']);
  check('misafir kataloğu misafire ait', store().loadedFor, GUEST);
  check('misafirde Gold liste fiyatında', planPriceOf(store().catalog, 'gold')?.totalMinor, 39900);

  await store().load();
  check('aynı kimlikte ikinci istek atılmaz', calls, ['/public/plans']);

  await store().load({ force: true });
  check('force her zaman tazeler', calls, ['/public/plans', '/public/plans']);

  signIn('7');
  calls = [];
  await store().load();
  check('giriş yapınca /pricing okunur', calls, ['/pricing']);
  check('kullanıcı ilk yayın fiyatını görür', planPriceOf(store().catalog, 'gold')?.totalMinor, 15960);
  check('katalog kullanıcıya ait', store().loadedFor, '7');

  // Geç gelen eski yanıt: misafir isteği yavaş, kullanıcı arada giriş yapıyor.
  signIn(null);
  serve((url) => ({ status: 200, ...(url === '/public/plans' ? catalog(false) : catalog(true, 23940)), delayMs: url === '/public/plans' ? 30 : 0 }));
  const slowGuest = store().load();
  signIn('8');
  await store().load();
  await slowGuest;
  check('geç gelen misafir yanıtı kullanıcı kataloğunu ezmez', [store().loadedFor, planPriceOf(store().catalog, 'gold')?.totalMinor], ['8', 15960]);

  // Hata: katalog uydurulmaz, başka kimliğin kataloğu gösterilmez.
  signIn('9');
  serve(() => ({ status: 503, data: { error: { code: 'PROVIDER_UNAVAILABLE' } } }));
  await store().load();
  check('hata: durum error', store().status, 'error');
  check('hata: başka kimliğin kataloğu kalmaz', store().catalog, null);

  // Bozuk yanıt da bir hatadır (liste − indirim ≠ toplam).
  serve(() => ({ status: 200, data: { ...catalog(true).data, plans: [{ ...plan('gold', 39900), totalMinor: 100 }] } }));
  await store().load({ force: true });
  check('tutarsız döküm reddedilir', store().status, 'error');

  signIn(null);
}

// ------------------------------------------------------------- 3. yardımcılar

function verifyHelpers(): void {
  console.log('\nYöntem hâli');
  check('kart + havale', paymentMethodsMode(['card', 'bank_transfer', 'gift_code']), 'cardBank');
  check('yalnızca kart', paymentMethodsMode(['card', 'gift_code']), 'card');
  check('yalnızca havale', paymentMethodsMode(['bank_transfer']), 'bank');
  check('yalnızca hediye kodu (bugün)', paymentMethodsMode(['gift_code']), 'giftOnly');
  check('hiçbiri', paymentMethodsMode([]), 'none');

  console.log('\nKampanya bitişi');
  // Backend "7 Ocak'ın sonu, İstanbul" diye kurar: 20:59:59Z. UTC'de okunsa da 7 Ocak.
  check('Türkçe, işletme saatinde', formatPromotionEnd('2027-01-07T20:59:59+00:00', 'tr'), '7 Ocak');
  check('İngilizce', formatPromotionEnd('2027-01-07T20:59:59+00:00', 'en'), 'January 7');
}

async function main(): Promise<void> {
  scanSources();
  await verifyStore();
  verifyHelpers();

  if (failures > 0) {
    console.error(`\n${failures} sorun bulundu.`);
    process.exit(1);
  }

  console.log('\n✓ Fiyat kataloğu doğru: src/ fiyat taşımıyor, kimlik değişince katalog yenileniyor, eski yanıt yenisini ezmiyor.');
}

void main();
