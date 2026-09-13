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
