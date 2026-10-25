/**
 * Uç sözleşmesi denetimi — `npm run verify:endpoints`
 *
 * Her servisin **hangi yola, hangi yöntemle ve hangi gövdeyle** gittiğini
 * sınar. Gerçek `axios` instance'ı kullanılır; yalnızca taşıma katmanı
 * (adapter) değiştirilir, yani `api.ts`'in interceptor'ları ve baseURL'i
 * dahil her şey yolun üzerindedir.
 *
 * 🔴 Bu denetim neden var: yanlış bir uç **derleme hatası vermez**. Frontend
 * aylarca `POST /media/upload`'a gitti ve kimse fark etmedi, çünkü o akış elle
 * denenene kadar 404 görünmez. Tip denetimi yolun doğruluğunu göremez — bir
 * dizgi her zaman bir dizgidir.
 */
import { api } from '../src/services/api';
import { mediaService } from '../src/services/media';
import { rsvpService } from '../src/services/rsvps';
import { sendContactMessage } from '../src/services/contact';
import { invitationService } from '../src/services/invitations';
import { paymentService } from '../src/services/payments';
import { pricingService } from '../src/services/pricing';
import { assistantService } from '../src/services/assistant';
import { authService } from '../src/services/auth';
import { accountService } from '../src/services/account';
import { INITIAL_INVITATION } from '../src/data';
import type { RsvpCreatePayload } from '../src/types';

interface RecordedCall {
  method: string;
  url: string;
  data: unknown;
  /** Taşıma katmanına ulaşan Content-Type (axios dönüşümlerinden SONRA). */
  contentType: string;
}

let recorded: RecordedCall | null = null;
let failures = 0;

function fail(message: string): void {
  failures += 1;
  console.error(`  ✗ ${message}`);
}

/** Ağa çıkmadan isteği yakalayan taşıma katmanı. */
function mockAdapter(response: unknown) {
  return async (config: Record<string, unknown>) => {
    const headers = config.headers as { getContentType?: () => unknown } | undefined;
    recorded = {
      method: String(config.method ?? '').toUpperCase(),
      url: String(config.url ?? ''),
      data: config.data,
      contentType: String(headers?.getContentType?.() ?? ''),
    };
    return { data: response, status: 200, statusText: 'OK', headers: {}, config };
  };
}

/** FormData ise alanlarını düz nesneye çevirir; değilse JSON gövdeyi çözer. */
function bodyOf(data: unknown): Record<string, unknown> {
  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    const out: Record<string, unknown> = {};
    for (const [key, value] of data.entries()) {
      out[key] = value instanceof File ? `<File ${value.name}>` : value;
    }
    return out;
  }
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return (data ?? {}) as Record<string, unknown>;
}

async function check(
  label: string,
  expected: { method: string; url: string },
  response: unknown,
  run: () => Promise<unknown>,
): Promise<Record<string, unknown>> {
  recorded = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api.defaults as any).adapter = mockAdapter(response);

  try {
    await run();
  } catch (error) {
    fail(`${label} → çağrı hata verdi: ${(error as Error).message}`);
    return {};
  }

  const call = recorded as RecordedCall | null;
  if (!call) {
    fail(`${label} → hiç istek yapılmadı`);
    return {};
  }

  if (call.method !== expected.method || call.url !== expected.url) {
    fail(`${label} → ${call.method} ${call.url} (beklenen: ${expected.method} ${expected.url})`);
  } else {
    console.log(`  ✓ ${label}: ${call.method} ${call.url}`);
  }

  return bodyOf(call.data);
}

/** Gövdede bir alanın beklenen değerle bulunduğunu doğrular. */
function expectField(label: string, body: Record<string, unknown>, field: string, value?: unknown): void {
  if (!(field in body)) {
    fail(`${label} → gövdede '${field}' yok`);
    return;
  }
  if (value !== undefined && body[field] !== value) {
    fail(`${label} → '${field}' = ${JSON.stringify(body[field])} (beklenen: ${JSON.stringify(value)})`);
  }
}

/**
 * 🔴 Yükleme gövdesi GERÇEK bir FormData olmalı ve dosyayı taşımalı.
 *
 * `expectField(..., 'file')` bunu yakalayamıyordu: istemci geneline sabit bir
 * JSON Content-Type yazıldığında axios FormData'yı JSON'a çevirir ve gövde
 * `{"kind":"gallery","file":{}}` olur — `file` anahtarı VARDIR ama dosya yoktur.
 * Galeri ve LCV fotoğraf yüklemeleri bu yüzden hiç çalışmadı.
 */
function expectMultipartFile(label: string, fileName: string): void {
  const call = recorded as RecordedCall | null;

  if (!call || !(call.data instanceof FormData)) {
    fail(`${label} → gövde FormData değil (${typeof call?.data}); dosya JSON'a çevrilmiş olabilir`);
    return;
  }

  const entry = call.data.get('file');
  if (!(entry instanceof File) || entry.name !== fileName) {
    fail(`${label} → 'file' alanı dosyayı taşımıyor`);
    return;
  }

  if (call.contentType.includes('application/json')) {
    fail(`${label} → Content-Type JSON: ${call.contentType}`);
    return;
  }

  console.log(`  ✓ ${label}: gövde multipart, dosya taşınıyor`);
}

const INVITATION_ID = '01J000000000000000000000';
const MEDIA = { data: { id: '01J111111111111111111111', url: 'https://cdn.example/x.jpg' } };

async function main(): Promise<void> {
  const file = new File(['x'], 'foto.jpg', { type: 'image/jpeg' });

  console.log('\nMedya uçları');

  const ownerBody = await check(
    'sahip yüklemesi',
    { method: 'POST', url: `/invitations/${INVITATION_ID}/media` },
    MEDIA,
    () => mediaService.uploadForOwner(INVITATION_ID, file),
  );
  // `kind` zorunludur: boyut ve MIME sınırı türe göre değişir, sunucu
  // dosyayı doğrulamadan önce türü bilmek zorunda.
  expectField('sahip yüklemesi', ownerBody, 'kind', 'gallery');
  expectField('sahip yüklemesi', ownerBody, 'file');
  expectMultipartFile('sahip yüklemesi', file.name);

  const guestBody = await check(
    'misafir yüklemesi',
    { method: 'POST', url: `/public/invitations/${INVITATION_ID}/media` },
    MEDIA,
    () => mediaService.uploadAsGuest(INVITATION_ID, file, 'rsvp_photo'),
  );
  expectField('misafir yüklemesi', guestBody, 'kind', 'rsvp_photo');
  expectMultipartFile('misafir yüklemesi', file.name);

  // 🔴 Yanıt `id` taşımalı: LCV medyayı kimlikle bağlar, URL'yle değil.
  const uploaded = await mediaService.uploadForOwner(INVITATION_ID, file);
  if (!uploaded.id) fail('yükleme yanıtındaki `id` düştü — LCV\'ye medya bağlanamaz');

  await check(
    'galeri silme (sahip)',
    { method: 'DELETE', url: `/invitations/${INVITATION_ID}/media/${MEDIA.data.id}` },
    {},
    () => mediaService.removeForOwner(INVITATION_ID, MEDIA.data.id),
  );

  console.log('\nLCV uçları');

  await check(
    'liste (sahip)',
    { method: 'GET', url: `/invitations/${INVITATION_ID}/rsvps` },
    { data: [] },
    () => rsvpService.list(INVITATION_ID),
  );

  const payload: RsvpCreatePayload = {
    guestName: 'Can Doğan',
    guestCount: 2,
    status: 'attending',
    menuPreference: 'Et Menü',
    message: null,
    photoMediaId: MEDIA.data.id,
    videoMediaId: null,
    website: '',
  };

  const rsvpBody = await check(
    'gönderim (misafir)',
    { method: 'POST', url: `/public/invitations/${INVITATION_ID}/rsvps` },
    { data: { id: '01J2', guestName: 'Can Doğan', guestCount: 2, menuPreference: '', status: 'attending', createdAt: '2026-09-13T10:00:00+00:00' } },
    () => rsvpService.create(INVITATION_ID, payload),
  );

  // 🔴 Ağda İngilizce gider. Türkçe bir değer sızarsa backend 422 döner.
  expectField('gönderim', rsvpBody, 'status', 'attending');
  // 🔴 Tuzak gövdede OLMAK ZORUNDA: alan gitmezse savunma kurulmamıştır (B9).
  expectField('gönderim', rsvpBody, 'website', '');
  expectField('gönderim', rsvpBody, 'photoMediaId', MEDIA.data.id);

  // Faz 10 (FE 10.18 · K101): aynı misafir yanıtını düzenleme koduyla günceller.
  const rsvpUpdateBody = await check(
    'güncelleme (misafir)',
    { method: 'PUT', url: `/public/invitations/${INVITATION_ID}/rsvps/01J2` },
    { data: { id: '01J2', guestName: 'Can Doğan', guestCount: 1, menuPreference: '', status: 'attending', createdAt: '2026-09-13T10:00:00+00:00', editCode: 'kod-1' } },
    () => rsvpService.update(INVITATION_ID, { rsvpId: '01J2', editCode: 'kod-1' }, { ...payload, guestCount: 1 }),
  );
  expectField('güncelleme', rsvpUpdateBody, 'editCode', 'kod-1');
  expectField('güncelleme', rsvpUpdateBody, 'guestCount', 1);
  // Tuzak bu uçta yok: kodu bilmeyen gelemez, alanı göndermek anlamsız.
  if ('website' in rsvpUpdateBody) fail('güncelleme → tuzak alanı (website) gövdede');

  await check(
    'silme (sahip)',
    { method: 'DELETE', url: '/rsvps/01J2' },
    {},
    () => rsvpService.remove('01J2'),
  );

  console.log('\nYayınlama ve ödeme uçları');

  const publishedRecord = {
    data: {
      id: INVITATION_ID,
      status: 'published',
      updatedAt: '2026-09-13T10:00:00+00:00',
      invitation: { timelineEvents: [] },
    },
  };

  await check(
    'yayınlama',
    { method: 'POST', url: `/invitations/${INVITATION_ID}/publish` },
    publishedRecord,
    () => invitationService.publish(INVITATION_ID),
  );

  const updateBody = await check(
    'davetiye kaydı',
    { method: 'PUT', url: `/invitations/${INVITATION_ID}` },
    publishedRecord,
    () =>
      invitationService.update(INVITATION_ID, {
        ...INITIAL_INVITATION,
        galleryImages: [{ id: MEDIA.data.id, url: MEDIA.data.url }],
      }),
  );

  // 🔴 Galeri kayıt gövdesine GİRMEZ: üyeliğini ve sırasını sunucu tutar
  // (yükleme sona ekler, silme ayrı uç). Gönderilseydi otomatik kaydetme ile
  // yükleme yarışında yeni fotoğraf ezilirdi.
  const invitationBody = (updateBody.invitation ?? {}) as Record<string, unknown>;
  if ('galleryImages' in invitationBody) {
    fail('davetiye kaydı → gövdede galleryImages var; galeri sunucunundur');
  }

  // Sabit JSON başlığı kaldırıldı; düz nesne gövdelerinde axios onu kendisi koymalı.
  const updateCall = recorded as RecordedCall | null;
  if (!updateCall?.contentType.includes('application/json')) {
    fail(`davetiye kaydı → Content-Type JSON değil: ${updateCall?.contentType}`);
  }

  const invoiceBody = await check(
    'checkout (davetiye)',
    { method: 'POST', url: `/invitations/${INVITATION_ID}/checkout` },
    { data: { orderId: '01J3', tier: 'gold', status: 'pending', redirectUrl: 'https://pay.example/x' } },
    () => paymentService.checkoutForInvitation(INVITATION_ID, 'gold'),
  );
  expectField('checkout (davetiye)', invoiceBody, 'tier', 'gold');

  // 🔴 Fiyat gövdeye KONULMAZ: backend onu config'ten okur (M6). Göndermek,
  // istemcinin kendi fiyatını yazabildiği bir sözleşme anlamına gelirdi.
  for (const forbidden of ['price', 'amount', 'amountMinor', 'currency']) {
    if (forbidden in invoiceBody) {
      fail(`checkout → gövdede '${forbidden}' var; fiyat istemciden GÖNDERİLMEZ`);
    }
  }

  const accountBody = await check(
    'checkout (hesap paketi)',
    { method: 'POST', url: '/payments/checkout' },
    { data: { orderId: '01J4', tier: 'elit', status: 'pending' } },
    () => paymentService.checkoutForAccount('elit'),
  );
  expectField('checkout (hesap paketi)', accountBody, 'tier', 'elit');

  // 🔴 `status` PENDING doğar. 'paid' varsayan bir istemci kullanıcıya
  // "ödendi" deyip hemen ardından yayınlamada 402 gösterirdi.
  const pending = await paymentService.checkoutForAccount('gold');
  if (pending.status !== 'pending') {
    fail(`checkout yanıtındaki status '${pending.status}' okundu; sözleşme 'pending' der`);
  }

  // 🔴 `redirectUrl` opsiyoneldir: yoksa anahtar HİÇ GELMEZ (C7).
  if ('redirectUrl' in pending && pending.redirectUrl === null) {
    fail('redirectUrl null olarak okundu; yokluğu `undefined` ile temsil edilmeli');
  }

  // Faz 11: hediye kodu. Kod gövdeye girer, indirim ve tutar GİRMEZ.
  console.log('\nHediye kodu (Faz 11)');

  const codedBody = await check(
    'checkout + hediye kodu',
    { method: 'POST', url: `/invitations/${INVITATION_ID}/checkout` },
    { data: { orderId: '01J6', tier: 'gold', status: 'paid', redirectUrl: '/odeme/basarili?order=01J6', discountMinor: 39900 } },
    () => paymentService.checkoutForInvitation(INVITATION_ID, 'gold', '  DUGUN2026 '),
  );
  expectField('checkout + hediye kodu', codedBody, 'giftCode', 'DUGUN2026');
  for (const forbidden of ['discount', 'discountMinor', 'amount', 'amountMinor', 'price', 'totalMinor']) {
    if (forbidden in codedBody) {
      fail(`checkout + hediye kodu → gövdede '${forbidden}' var; indirim istemciden GÖNDERİLMEZ`);
    }
  }

  // Boş kod alanı: anahtar hiç gitmez (kodsuz ödeme ile aynı gövde).
  const blankBody = await check(
    'checkout + boş kod',
    { method: 'POST', url: '/payments/checkout' },
    { data: { orderId: '01J7', tier: 'gold', status: 'pending' } },
    () => paymentService.checkoutForAccount('gold', '   '),
  );
  if ('giftCode' in blankBody) {
    fail('checkout + boş kod → gövdede giftCode var; boş kod hiç gönderilmemeli');
  }

  // Faz 13: önizleme bir PlanPrice + kodun alanları.
  const PREVIEW = {
    benefit: 'percent',
    tier: 'gold',
    priceMinor: 39900,
    promotion: null,
    discountMinor: 9975,
    totalMinor: 29925,
    giftDiscountMinor: 9975,
    currency: 'TRY',
  };
  const previewBody = await check(
    'hediye kodu önizleme',
    { method: 'POST', url: '/gift-codes/preview' },
    { data: PREVIEW },
    () => paymentService.previewGiftCode(' dugun-2026 ', 'gold'),
  );
  expectField('hediye kodu önizleme', previewBody, 'code', 'dugun-2026');
  expectField('hediye kodu önizleme', previewBody, 'tier', 'gold');

  const preview = await paymentService.previewGiftCode('X', 'gold');
  if (preview.totalMinor !== 29925 || preview.discountMinor !== 9975) {
    fail(`önizleme yanıtı yanlış okundu: ${JSON.stringify(preview)}`);
  }

  // Kuruş alanı TL sanılırsa (ya da float gelirse) yanıt reddedilmeli.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api.defaults as any).adapter = mockAdapter({ data: { ...PREVIEW, totalMinor: 299.25 } });
  try {
    await paymentService.previewGiftCode('X', 'gold');
    fail('önizleme: kesirli totalMinor kabul edildi; kuruş alanları tam sayıdır');
  } catch {
    console.log('  ✓ önizleme: kesirli kuruş alanı reddediliyor');
  }

  // Faz 13: döküm tutarsızsa (liste − indirim ≠ toplam) yanıt reddedilmeli.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api.defaults as any).adapter = mockAdapter({ data: { ...PREVIEW, totalMinor: 9900 } });
  try {
    await paymentService.previewGiftCode('X', 'gold');
    fail('önizleme: tutarsız döküm kabul edildi');
  } catch {
    console.log('  ✓ önizleme: tutarsız döküm reddediliyor');
  }

  console.log('\nFiyat kataloğu uçları (Faz 13)');

  const CATALOG = {
    currency: 'TRY',
    personalized: false,
    firstPublishPercent: 60,
    plans: [
      { tier: 'standart', priceMinor: 24900, promotion: null, discountMinor: 0, totalMinor: 24900 },
      {
        tier: 'gold',
        priceMinor: 39900,
        promotion: { kind: 'campaign', percent: 20, discountMinor: 7980, endsAt: '2027-01-07T20:59:59+00:00' },
        discountMinor: 7980,
        totalMinor: 31920,
      },
      { tier: 'elit', priceMinor: 54900, promotion: null, discountMinor: 0, totalMinor: 54900 },
    ],
    paymentMethods: ['gift_code', 'wallet'],
    bankTransfer: null,
  };

  await check('fiyat kataloğu (misafir)', { method: 'GET', url: '/public/plans' }, { data: CATALOG }, () =>
    pricingService.publicCatalog(),
  );
  await check('fiyat kataloğu (oturumlu)', { method: 'GET', url: '/pricing' }, { data: { ...CATALOG, personalized: true } }, () =>
    pricingService.myCatalog(),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api.defaults as any).adapter = mockAdapter({ data: CATALOG });
  const catalog = await pricingService.publicCatalog();
  if (catalog.plans[1]?.totalMinor !== 31920) {
    fail(`katalog yanlış okundu: ${JSON.stringify(catalog.plans[1])}`);
  }
  // Tanınmayan yöntem ('wallet') düğme olarak çizilemez: listeden düşmeli.
  if (JSON.stringify(catalog.paymentMethods) !== JSON.stringify(['gift_code'])) {
    fail(`bilinmeyen yöntem süzülmedi: ${JSON.stringify(catalog.paymentMethods)}`);
  } else {
    console.log('  ✓ katalog: bilinmeyen ödeme yöntemi süzülüyor');
  }

  for (const [label, broken] of [
    ['kesirli fiyat', { ...CATALOG, plans: [{ ...CATALOG.plans[0], priceMinor: 249.9, totalMinor: 249.9 }] }],
    ['tutarsız döküm', { ...CATALOG, plans: [{ ...CATALOG.plans[1], totalMinor: 39900 }] }],
    ['boş plan listesi', { ...CATALOG, plans: [] }],
  ] as const) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (api.defaults as any).adapter = mockAdapter({ data: broken });
    try {
      await pricingService.publicCatalog();
      fail(`katalog: ${label} kabul edildi`);
    } catch {
      console.log(`  ✓ katalog: ${label} reddediliyor`);
    }
  }

  console.log('\nSipariş okuma uçları (Faz 10)');

  const ORDER = {
    orderId: '01j5',
    tier: 'gold',
    status: 'pending',
    invitationId: INVITATION_ID,
    createdAt: '2026-09-30T14:02:11+00:00',
    paidAt: null,
  };

  await check(
    'sipariş (tek)',
    { method: 'GET', url: '/orders/01j5' },
    { data: ORDER },
    () => paymentService.getOrder('01j5'),
  );

  // Zarf açılmalı ve `paidAt: null` KORUNMALI: "henüz ödenmedi" bilgisi (N4).
  const order = await paymentService.getOrder('01j5');
  if (order.orderId !== '01j5' || order.paidAt !== null || !('paidAt' in order)) {
    fail(`sipariş zarftan doğru çıkarılamadı: ${JSON.stringify(order)}`);
  }

  // 🔴 Kimlik sorgu dizesinden (`?order=`) geliyor: yola kodlanmadan yazılsaydı
  // `../auth/me` gibi bir değer başka bir uca giderdi.
  await check(
    'sipariş (kodlanmış kimlik)',
    { method: 'GET', url: '/orders/..%2Fauth%2Fme' },
    { data: ORDER },
    () => paymentService.getOrder('../auth/me'),
  );

  await check(
    'siparişlerim',
    { method: 'GET', url: '/orders' },
    { data: [ORDER] },
    () => paymentService.listOrders(),
  );

  console.log('\nAsistan ucu');

  const assistantBody = await check(
    'asistan sohbeti',
    { method: 'POST', url: '/assistant/chat' },
    { data: { reply: 'Merhaba!' } },
    () => assistantService.chat('Şablon önerir misin?'),
  );
  expectField('asistan sohbeti', assistantBody, 'message', 'Şablon önerir misin?');

  // 🔴 Zarf korunur: `{ data: { reply } }`. Zarfsız okumak yanıtı
  // `undefined` yapardı ve sohbet sessizce boş baloncuk gösterirdi.
  const reply = await assistantService.chat('test');
  if (reply !== 'Merhaba!') {
    fail(`asistan yanıtı zarftan çıkarılamadı: ${JSON.stringify(reply)}`);
  }

  console.log('\nİletişim ucu');

  const contactBody = await check(
    'iletişim',
    { method: 'POST', url: '/public/contact' },
    {},
    () =>
      sendContactMessage({
        name: 'Can Doğan',
        email: 'can@example.com',
        subject: 'general',
        message: 'Merhaba',
        website: '',
      }),
  );
  expectField('iletişim', contactBody, 'website', '');

  console.log('\nŞifre sıfırlama uçları (Faz 10)');

  const forgotBody = await check(
    'sıfırlama bağlantısı',
    { method: 'POST', url: '/auth/forgot-password' },
    '',
    () => authService.requestPasswordReset('ayse@example.com'),
  );
  expectField('sıfırlama bağlantısı', forgotBody, 'email', 'ayse@example.com');

  // Üç alan da backend ResetPasswordRequest'in adlarıyla: `token` maildeki
  // bağlantıdan, `email` onunla eşleşmesi gereken adres.
  const resetBody = await check(
    'yeni şifre',
    { method: 'POST', url: '/auth/reset-password' },
    '',
    () => authService.resetPassword({ token: 'tok-1', email: 'ayse@example.com', password: 'yeni-sifre-1' }),
  );
  expectField('yeni şifre', resetBody, 'token', 'tok-1');
  expectField('yeni şifre', resetBody, 'email', 'ayse@example.com');
  expectField('yeni şifre', resetBody, 'password', 'yeni-sifre-1');

  console.log('\nHesap silme ucu (Faz 10)');

  // 🔴 Parola GÖVDEDE gitmeli. axios'ta `delete(url, x)`in ikinci argümanı
  // config'tir; `{ password }` doğrudan verilseydi gövde boş giderdi ve
  // backend her denemeye "Parola zorunludur" derdi.
  const deleteBody = await check(
    'hesap silme',
    { method: 'DELETE', url: '/auth/me' },
    '',
    () => authService.deleteAccount('mevcut-sifre'),
  );
  expectField('hesap silme', deleteBody, 'password', 'mevcut-sifre');

  console.log('\nHesap ayarları uçları (Faz 14)');

  await check(
    'planlarım',
    { method: 'GET', url: '/account/entitlements' },
    { data: { tiers: [], totalAvailable: 0, rights: [] } },
    () => accountService.getEntitlements(),
  );

  const refundBody = await check(
    'hakkı iptal et',
    { method: 'POST', url: '/orders/01jabc/refund-request' },
    '',
    () => accountService.requestRefund('01jabc', 'Düğün ertelendi'),
  );
  expectField('hakkı iptal et', refundBody, 'reason', 'Düğün ertelendi');

  await check(
    'iptal talebini geri çek',
    { method: 'DELETE', url: '/orders/01jabc/refund-request' },
    '',
    () => accountService.withdrawRefund('01jabc'),
  );

  const profileBody = await check(
    'profil',
    { method: 'PATCH', url: '/auth/me' },
    { data: { id: '1', firstName: 'Ayşe', lastName: 'Yılmaz', email: 'ayse@example.com' } },
    () => accountService.updateProfile({ firstName: 'Ayşe', lastName: 'Yılmaz' }),
  );
  expectField('profil', profileBody, 'firstName', 'Ayşe');
  expectField('profil', profileBody, 'lastName', 'Yılmaz');

  const passwordBody = await check(
    'parola değiştir',
    { method: 'PUT', url: '/auth/password' },
    '',
    () => accountService.changePassword({ currentPassword: 'eski-sifre', password: 'yeni-sifre-1' }),
  );
  expectField('parola değiştir', passwordBody, 'currentPassword', 'eski-sifre');
  expectField('parola değiştir', passwordBody, 'password', 'yeni-sifre-1');

  const emailBody = await check(
    'e-posta değişikliği',
    { method: 'POST', url: '/auth/email-change' },
    '',
    () => accountService.requestEmailChange({ email: 'yeni@example.com', currentPassword: 'sifre' }),
  );
  expectField('e-posta değişikliği', emailBody, 'email', 'yeni@example.com');
  expectField('e-posta değişikliği', emailBody, 'currentPassword', 'sifre');

  // 🔴 Sorgu AYNEN gider: imza kodlamayı kapsıyor (%2B boşluğa dönmemeli).
  const signedQuery = '?email=yeni%2Bdavet%40example.com&expires=1&old=ab&user=7&signature=cd';
  await check(
    'e-posta onayı',
    { method: 'POST', url: `/public/email-change/confirm${signedQuery}` },
    '',
    () => accountService.confirmEmailChange(signedQuery),
  );

  await check('oturumlar', { method: 'GET', url: '/auth/sessions' }, { data: [] }, () => accountService.listSessions());
  await check('oturumu kapat', { method: 'DELETE', url: '/auth/sessions/42' }, '', () => accountService.revokeSession('42'));
  await check('diğer oturumları kapat', { method: 'DELETE', url: '/auth/sessions' }, '', () => accountService.revokeOtherSessions());

  if (failures > 0) {
    console.error(`\n${failures} sorun bulundu.`);
    process.exit(1);
  }

  console.log('\n✓ Tüm uçlar backend sözleşmesiyle eşleşiyor.');
}

void main();
