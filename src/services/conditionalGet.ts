import { api } from './api';

/**
 * `If-None-Match` ile koşullu okuma — backend'in `SetEtag` katmanının
 * frontend yarısı (K46).
 *
 * Backend iki uçta ETag üretiyor ve gövde değişmediyse **304** dönüyor.
 * Frontend bugüne kadar `If-None-Match` hiç göndermedi; yani her istek tam
 * gövdeyi çekiyordu. LCV paneli 15 saniyede bir yenilendiğinde bu, her
 * poll'de tüm listenin yeniden indirilmesi demek.
 *
 * 🔴 **İki tuzak:**
 *
 * 1. **axios 304'ü hata sayar.** Varsayılan `validateStatus` yalnızca 2xx'i
 *    başarı kabul eder; ayarlanmazsa her 304 `catch` bloğuna düşer ve
 *    optimizasyon, "sürekli hata veren bir uç" gibi görünür.
 *
 * 2. **Üretimde `ETag` okunamayabilir.** ETag, CORS'un güvenli liste
 *    başlıklarından **değildir**: backend `config/cors.php` içinde
 *    `exposed_headers: ['ETag']` demezse `headers.etag` çapraz kaynakta
 *    **her zaman `undefined`** olur. O zaman kod çalışmaya devam eder, sadece
 *    hiçbir zaman 304 alamaz — yani optimizasyon **sessizce ölür**. Aşağıdaki
 *    geliştirme uyarısı bu sessizliği bozmak için var.
 */
interface CacheEntry {
  etag: string;
  value: unknown;
}

const cache = new Map<string, CacheEntry>();

/** Aynı uyarıyı her istekte tekrarlamamak için. */
const warned = new Set<string>();

function warnMissingEtag(cacheKey: string): void {
  if (!import.meta.env.DEV || warned.has(cacheKey)) return;
  warned.add(cacheKey);

  console.warn(
    `[conditionalGet] ${cacheKey}: yanıtta okunabilir bir ETag yok. ` +
      'Aynı kaynaktan (vite proxy) çalışıyorsanız backend ETag üretmiyor olabilir; ' +
      'çapraz kaynakta ise backend `config/cors.php` içinde ' +
      "`exposed_headers: ['ETag']` eksiktir. Koşullu okuma devre dışı kalır.",
  );
}

/**
 * Bir uçtan koşullu okuma yapar.
 *
 * Elde bir sürüm varsa `If-None-Match` gönderilir; sunucu 304 dönerse
 * **gövde yoktur** ve önbellekteki değer aynen döndürülür.
 *
 * @param url       İstek yolu.
 * @param cacheKey  Sürümün saklanacağı anahtar — genelde url'in kendisi.
 * @param parse     Ham gövdeyi alan tipine çeviren doğrulayıcı.
 */
export async function conditionalGet<T>(
  url: string,
  cacheKey: string,
  parse: (payload: unknown) => T,
): Promise<T> {
  const cached = cache.get(cacheKey);

  const response = await api.get<unknown>(url, {
    headers: cached ? { 'If-None-Match': cached.etag } : {},
    // 🔴 304 bir HATA DEĞİLDİR: "elindeki sürüm hâlâ geçerli" demektir.
    validateStatus: (status) => status === 200 || status === 304,
  });

  if (response.status === 304) {
    if (!cached) {
      // Ulaşılamaz olmalı: `If-None-Match` yalnızca elde sürüm varken gider.
      throw new Error(`304 received without a cached body for ${cacheKey}`);
    }
    return cached.value as T;
  }

  const value = parse(response.data);
  const etag = response.headers.etag;

  if (typeof etag === 'string' && etag.length > 0) {
    cache.set(cacheKey, { etag, value });
  } else {
    // Sürüm saklanamıyorsa bir sonraki istek de koşulsuz gider. Eski bir
    // sürümü elde tutmak yanlış olurdu: onu doğrulayacak anahtar yok.
    cache.delete(cacheKey);
    warnMissingEtag(cacheKey);
  }

  return value;
}

/**
 * Saklanan sürümü düşürür.
 *
 * Oturum kapandığında ya da kapsam değiştiğinde çağrılır: bir sonraki okuma
 * tam gövde çeksin. Anahtar verilmezse tüm önbellek temizlenir.
 */
export function invalidateConditionalCache(cacheKey?: string): void {
  if (cacheKey === undefined) {
    cache.clear();
    return;
  }
  cache.delete(cacheKey);
}
