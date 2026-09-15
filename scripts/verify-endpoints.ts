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
import { assistantService } from '../src/services/assistant';
import type { RsvpCreatePayload } from '../src/types';

interface RecordedCall {
  method: string;
  url: string;
  data: unknown;
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
    recorded = {
      method: String(config.method ?? '').toUpperCase(),
      url: String(config.url ?? ''),
      data: config.data,
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

  const guestBody = await check(
    'misafir yüklemesi',
    { method: 'POST', url: `/public/invitations/${INVITATION_ID}/media` },
    MEDIA,
    () => mediaService.uploadAsGuest(INVITATION_ID, file, 'rsvp_photo'),
  );
  expectField('misafir yüklemesi', guestBody, 'kind', 'rsvp_photo');

  // 🔴 Yanıt `id` taşımalı: LCV medyayı kimlikle bağlar, URL'yle değil.
  const uploaded = await mediaService.uploadForOwner(INVITATION_ID, file);
  if (!uploaded.id) fail('yükleme yanıtındaki `id` düştü — LCV\'ye medya bağlanamaz');

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

  if (failures > 0) {
    console.error(`\n${failures} sorun bulundu.`);
    process.exit(1);
  }

  console.log('\n✓ Tüm uçlar backend sözleşmesiyle eşleşiyor.');
}

void main();
