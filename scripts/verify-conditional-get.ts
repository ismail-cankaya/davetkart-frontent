/**
 * Koşullu okuma denetimi — `npm run verify:etag`
 *
 * 🔴 Bu optimizasyon **sessizce ölür**: çalışmadığında hiçbir şey kırılmaz,
 * yalnızca her istek tam gövde çeker. Bu yüzden davranışı açıkça sınanmalı.
 *
 * Dört soru:
 *
 * 1. İlk okuma `If-None-Match` **göndermez** (elde sürüm yok).
 * 2. İkinci okuma sunucudan gelen ETag'i **geri gönderir**.
 * 3. **304 hata sayılmaz** ve gövdesiz yanıt yerine önbellekteki değer döner.
 *    (axios varsayılanı 304'ü hata sayar — ayarlanmazsa her poll `catch`e düşer.)
 * 4. Yanıtta okunabilir ETag **yoksa** bir sonraki istek de koşulsuz gider;
 *    doğrulanamayacak bir sürüm elde tutulmaz.
 */
import { api } from '../src/services/api';
import { conditionalGet, invalidateConditionalCache } from '../src/services/conditionalGet';

interface RecordedRequest {
  ifNoneMatch: string | undefined;
}

let requests: RecordedRequest[] = [];
let failures = 0;

function fail(message: string): void {
  failures += 1;
  console.error(`  ✗ ${message}`);
}

function pass(message: string): void {
  console.log(`  ✓ ${message}`);
}

/** Sunucunun sırayla vereceği yanıtlar. */
type Programmed = { status: 200; body: unknown; etag?: string } | { status: 304 };

function installAdapter(script: Programmed[]): void {
  let index = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api.defaults as any).adapter = async (config: any) => {
    const headers = config.headers ?? {};
    requests.push({
      ifNoneMatch: headers['If-None-Match'] ?? headers['if-none-match'],
    });

    const step = script[Math.min(index, script.length - 1)];
    index += 1;

    const response =
      step.status === 304
        ? // Gerçek 304: gövde YOK.
          { data: '', status: 304, statusText: 'Not Modified', headers: {}, config }
        : {
            data: step.body,
            status: 200,
            statusText: 'OK',
            headers: step.etag ? { etag: step.etag } : {},
            config,
          };

    // 🔴 `validateStatus` BURADA uygulanmalı. Gerçek adapter'lar (xhr/http)
    // yanıtı `settle()` üzerinden geçirir ve durum kodu kabul edilmezse
    // hata fırlatır. Bunu taklit etmezsek denetim, `validateStatus`
    // tamamen kaldırılsa bile yeşil kalır — yani sınamak istediği tuzağı
    // hiç sınamamış olur.
    const validate = config.validateStatus as ((s: number) => boolean) | null | undefined;
    if (validate && !validate(response.status)) {
      const error = new Error(`Request failed with status code ${response.status}`) as Error & {
        isAxiosError: boolean;
        response: unknown;
      };
      error.isAxiosError = true;
      error.response = response;
      throw error;
    }

    return response;
  };
}

const URL = '/invitations/01J/rsvps';
const parse = (payload: unknown) => (payload as { data: string[] }).data;

async function main(): Promise<void> {
  console.log('\nKoşullu okuma');

  // --- 1 & 2 & 3: ETag döngüsü ---
  invalidateConditionalCache();
  requests = [];
  installAdapter([
    { status: 200, body: { data: ['a'] }, etag: '"v1"' },
    { status: 304 },
  ]);

  const first = await conditionalGet(URL, URL, parse);
  if (requests[0]?.ifNoneMatch !== undefined) {
    fail(`ilk istekte If-None-Match gönderildi: ${requests[0].ifNoneMatch}`);
  } else {
    pass('ilk okuma koşulsuz gidiyor');
  }

  let second: string[];
  try {
    second = await conditionalGet(URL, URL, parse);
  } catch (error) {
    // Tam olarak planın uyardığı tuzak: validateStatus ayarlanmazsa buraya düşer.
    fail(`304 hata olarak fırlatıldı — validateStatus eksik: ${(error as Error).message}`);
    process.exit(1);
  }

  if (requests[1]?.ifNoneMatch !== '"v1"') {
    fail(`ikinci istek ETag'i geri göndermedi: ${JSON.stringify(requests[1]?.ifNoneMatch)}`);
  } else {
    pass('ikinci okuma If-None-Match gönderiyor');
  }

  if (JSON.stringify(second) !== JSON.stringify(first)) {
    fail(`304 sonrası önbellekteki gövde dönmedi: ${JSON.stringify(second)}`);
  } else {
    pass('304 gövdesiz yanıt önbellekten karşılanıyor');
  }

  // --- 4: ETag okunamıyorsa sürüm saklanmaz ---
  // Üretimde `exposed_headers: ['ETag']` eksikse başlık çapraz kaynakta
  // HER ZAMAN undefined olur. O durumda eski bir sürümü elde tutmak,
  // doğrulanamayacak bir şeye güvenmek olurdu.
  invalidateConditionalCache();
  requests = [];
  installAdapter([
    { status: 200, body: { data: ['a'] } },
    { status: 200, body: { data: ['a', 'b'] } },
  ]);

  await conditionalGet(URL, URL, parse);
  const afterBlind = await conditionalGet(URL, URL, parse);

  if (requests[1]?.ifNoneMatch !== undefined) {
    fail('ETag okunamadığı hâlde If-None-Match gönderildi');
  } else {
    pass('okunabilir ETag yoksa istek koşulsuz gidiyor');
  }

  if (afterBlind.length !== 2) {
    fail(`ETag'siz ikinci okuma taze gövdeyi almadı: ${JSON.stringify(afterBlind)}`);
  } else {
    pass('ETag yokken taze gövde alınıyor');
  }

  if (failures > 0) {
    console.error(`\n${failures} sorun bulundu.`);
    process.exit(1);
  }

  console.log('\n✓ Koşullu okuma doğru: If-None-Match gidiyor, 304 hata değil, ETag yoksa sürüm saklanmıyor.');
}

void main();
