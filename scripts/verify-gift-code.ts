/**
 * Hediye kodu akışı denetimi — `npm run verify:gift` (Faz 11)
 *
 * Ödeme sayfasının hediye kodu durumunu (`useCheckoutStore`) gerçek servis ve
 * gerçek axios örneğiyle sınar; yalnızca taşıma katmanı (adapter) taklittir.
 *
 * 🔴 Buradaki hataların hiçbiri ekranda hata gibi görünmez: önizlemesi
 * düşmüş bir kod sessizce checkout'a giderse kullanıcı indirimsiz fiyata
 * "Öde" demiş olur; geç gelen eski bir önizleme yeni planın toplamını ezer;
 * havaleye geçen kullanıcı ekranda indirim görür ama tam tutarı yatırır.
 */
import { api } from '../src/services/api';
import { useCheckoutStore } from '../src/stores/useCheckoutStore';
import type { CheckoutContext } from '../src/stores/useCheckoutStore';

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

interface Call {
  url: string;
  body: Record<string, unknown>;
}

type Reply = { status: number; data: unknown; delayMs?: number };

let calls: Call[] = [];

/** Sıradaki istekler için yanıtlar; URL'e göre seçilir. */
function serve(route: (url: string, body: Record<string, unknown>) => Reply): void {
  calls = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api.defaults as any).adapter = async (config: Record<string, unknown>) => {
    const url = String(config.url ?? '');
    const body = typeof config.data === 'string' ? (JSON.parse(config.data) as Record<string, unknown>) : {};
    calls.push({ url, body });

    const reply = route(url, body);
    if (reply.delayMs) await new Promise((resolve) => setTimeout(resolve, reply.delayMs));

    const response = { data: reply.data, status: reply.status, statusText: '', headers: {}, config };
    if (reply.status >= 400) {
      throw Object.assign(new Error(`HTTP ${reply.status}`), { isAxiosError: true, response, config });
    }
    return response;
  };
}

const preview = (tier: string, discountMinor: number, priceMinor = 39900) => ({
  data: {
    benefit: 'percent',
    tier,
    priceMinor,
    discountMinor,
    totalMinor: priceMinor - discountMinor,
    currency: 'TRY',
  },
});

const giftError = (code: string, params?: Record<string, unknown>) => ({
  status: 422,
  data: { error: { code, ...(params ? { params } : {}) } },
});

const order = (status: string) => ({ data: { orderId: '01J9', tier: 'gold', status, redirectUrl: '/odeme/basarili?order=01J9' } });

const CONTEXT: CheckoutContext = { tier: 'gold', invitationId: null };

const store = () => useCheckoutStore.getState();

async function main(): Promise<void> {
  console.log('\nUygula / kaldır');
  store().reset();
  serve(() => ({ status: 200, ...preview('gold', 19950) }));
  check('geçerli kod uygulanır', await store().applyGiftCode('  dugun2026 ', 'gold'), true);
  check('kod kırpılmış saklanır', store().giftCode, 'dugun2026');
  check('önizleme toplamı', store().giftPreview?.totalMinor, 19950);
  check('önizleme isteği gövdesi', calls[0]?.body, { code: 'dugun2026', tier: 'gold' });

  store().removeGiftCode();
  check('kaldırınca kod ve önizleme gider', [store().giftCode, store().giftPreview], [null, null]);

  console.log('\nHatalı kod');
  serve(() => giftError('GIFT_CODE_INVALID'));
  check('geçersiz kod uygulanmaz', await store().applyGiftCode('YOK', 'gold'), false);
  check('önizleme yok', store().giftPreview, null);
  check('hata metni alanda durur', typeof store().giftCodeError === 'string' && store().giftCodeError !== '', true);

  // 🔴 Önizlemesi olmayan kod checkout'a GİTMEZ.
  serve(() => ({ status: 201, ...order('pending') }));
  await store().startCardCheckout(CONTEXT);
  check('önizlemesiz kod gövdeye girmez', 'giftCode' in (calls[0]?.body ?? {}), false);

  console.log('\nCheckout');
  store().reset();
  serve((url) => (url.includes('preview') ? { status: 200, ...preview('gold', 39900) } : { status: 201, ...order('paid') }));
  await store().applyGiftCode('HEDIYEGOLD', 'gold');
  const result = await store().startCardCheckout(CONTEXT);
  check('geçerli kod gövdeye girer', calls[1]?.body, { tier: 'gold', giftCode: 'HEDIYEGOLD' });
  check('hediye siparişi paid döner', result?.status, 'paid');

  // Önizlemeden sonra kod tükendi: checkout 422 → önizleme düşer, sebep alana yazılır.
  store().reset();
  serve((url) => (url.includes('preview') ? { status: 200, ...preview('gold', 19950) } : giftError('GIFT_CODE_INVALID')));
  await store().applyGiftCode('SONHAK', 'gold');
  let threw = false;
  try {
    await store().startCardCheckout(CONTEXT);
  } catch {
    threw = true;
  }
  check('checkout hatası çağırana iletilir', threw, true);
  check('tükenen kodun önizlemesi düşer', store().giftPreview, null);
  check('sebep alana yazılır', store().giftCodeError !== null, true);
  check('işlem bayrağı iner', store().isProcessing, false);

  // Kod dışı hata (502) önizlemeyi silmez: kod hâlâ geçerli.
  store().reset();
  serve((url) => (url.includes('preview') ? { status: 200, ...preview('gold', 19950) } : { status: 502, data: { error: { code: 'PAYMENT_PROVIDER_ERROR' } } }));
  await store().applyGiftCode('DUGUN2026', 'gold');
  try {
    await store().startCardCheckout(CONTEXT);
  } catch {
    /* beklenen */
  }
  check('sağlayıcı hatası önizlemeyi silmez', store().giftPreview?.discountMinor, 19950);

  console.log('\nHavale');
  store().reset();
  store().selectMethod('bank_transfer');
  serve(() => ({ status: 200, ...preview('gold', 19950) }));
  await store().applyGiftCode('DUGUN2026', 'gold');
  check('kod uygulanınca karta geçilir', store().method, 'card');
  store().selectMethod('bank_transfer');
  check('kod varken havale seçilemez', store().method, 'card');
  store().removeGiftCode();
  store().selectMethod('bank_transfer');
  check('kod kaldırılınca havale açılır', store().method, 'bank_transfer');

  console.log('\nPlan değişimi ve yarış');
  store().reset();
  serve((_, body) => ({ status: 200, ...preview(String(body.tier), body.tier === 'elit' ? 27450 : 19950, body.tier === 'elit' ? 54900 : 39900) }));
  await store().applyGiftCode('DUGUN2026', 'gold');
  store().reset({ keepGiftCode: true });
  check('plan değişince kod kalır', store().giftCode, 'DUGUN2026');
  check('eski planın önizlemesi düşer', store().giftPreview, null);
  await store().refreshGiftCode('elit');
  check('yeni plan için yeniden hesaplanır', [store().giftPreview?.tier, store().giftPreview?.totalMinor], ['elit', 27450]);

  // Eski (yavaş) yanıt yenisinden sonra gelir: yalnızca son istek yazılır.
  store().reset();
  serve((_, body) => ({
    status: 200,
    ...preview(String(body.tier), 100),
    delayMs: body.tier === 'standart' ? 60 : 5,
  }));
  const slow = store().applyGiftCode('KOD', 'standart');
  const fast = store().applyGiftCode('KOD', 'gold');
  await Promise.all([slow, fast]);
  check('geç gelen eski önizleme yenisini ezmez', store().giftPreview?.tier, 'gold');

  // Kaldırıldıktan sonra dönen önizleme kodu geri getirmez.
  store().reset();
  serve(() => ({ status: 200, ...preview('gold', 100), delayMs: 20 }));
  const pending = store().applyGiftCode('KOD', 'gold');
  store().removeGiftCode();
  await pending;
  check('kaldırılan kod geri gelmez', [store().giftCode, store().giftPreview], [null, null]);

  store().reset();
  check('tam sıfırlama kodu da siler', store().giftCode, null);

  if (failures > 0) {
    console.error(`\n${failures} sorun bulundu.`);
    process.exit(1);
  }

  console.log('\n✓ Hediye kodu akışı doğru: önizlemesiz kod gitmez, tükenen kod düşer, havale kapanır, eski yanıt yenisini ezmez.');
}

void main();
