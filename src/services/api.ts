import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

/**
 * Backend'e çıkan tek HTTP istemcisi.
 *
 * Her özellik servisi (davetiyeler, LCV'ler, asistan proxy'si…) bu instance
 * üzerinden geçer; böylece token enjeksiyonu ve oturum düşürme tek yerde
 * durur. Asistan istekleri de buradan gider — Google GenAI çağrısını backend
 * yapar, gizli anahtarlar frontend'e hiç inmez.
 *
 * 🔴 Backend bir **modüler monolittir**, mikroservis ağ geçidi değil; ve
 * kimlik **Laravel Sanctum kişisel erişim token'ı** taşır, JWT değil. Bu
 * docblock ikisini de yanlış söylüyordu (B4: kodda karşılığı olmayan
 * açıklama, açıklama değildir).
 *
 * Zaman aşımı 15 sn'de sabittir: backend'in en kötü durumu ~12.6 sn'ye göre
 * ayarlandı (K78). Uzatmak sorunu gizler, çözmez.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

/**
 * Üretim yapılandırmasının en sessiz iki hatası burada yakalanır.
 *
 * 🔴 Sondaki `/`: axios taban adresi yol parçalarıyla birleştirir ve
 * `https://api.ornek.com/api//invitations` üretir. Bazı sunucular bunu
 * normalleştirir, bazıları 404 döner — yani hata **ortama göre** ortaya
 * çıkar, ki bu en kötü hata türüdür.
 *
 * 🔴 Çapraz kaynak: taban adres mutlaksa (`https://…`) istekler CORS'a
 * tabidir ve backend'in `CORS_ALLOWED_ORIGINS` ayarının bu sayfanın
 * origin'iyle eşleşmesi gerekir. Eşleşmezse tarayıcı isteği engeller ve
 * uygulama bunu ağ hatası olarak görür — gerçek sebep yalnızca konsolda
 * durur.
 */
function assertApiBaseUrl(baseUrl: string): void {
  if (!import.meta.env.DEV) return;

  if (baseUrl.length > 1 && baseUrl.endsWith('/')) {
    console.warn(
      `[api] VITE_API_BASE_URL sonunda '/' var: "${baseUrl}". ` +
        'Bu, çift eğik çizgili adresler üretir; sondaki eğik çizgiyi kaldırın.',
    );
  }

  if (/^https?:\/\//i.test(baseUrl)) {
    try {
      const apiOrigin = new URL(baseUrl).origin;
      if (apiOrigin !== window.location.origin) {
        console.info(
          `[api] Çapraz kaynak yapılandırma: sayfa ${window.location.origin}, API ${apiOrigin}. ` +
            `Backend'in CORS_ALLOWED_ORIGINS ayarı "${window.location.origin}" içermeli ` +
            "(sonda '/' YOK) ve ETag okunabilmesi için exposed_headers: ['ETag'] tanımlı olmalı.",
        );
      }
    } catch {
      console.warn(`[api] VITE_API_BASE_URL çözümlenemedi: "${baseUrl}".`);
    }
  }
}

assertApiBaseUrl(BASE_URL);

/**
 * 🔴 İstemci geneline `Content-Type` YAZILMAZ.
 *
 * axios düz nesne gövdelerine `application/json`'ı zaten kendisi koyar. Sabit
 * bir JSON başlığı ise `transformRequest`'te FormData'yı da JSON'a çevirir
 * (`JSON.stringify(formDataToJSON(data))`): dosya `{}` olur, sunucu
 * `file required` ile 422 döner. Galeri ve LCV fotoğraf yüklemesi bu satır
 * yüzünden HİÇ çalışmıyordu. Gövdesiz isteklerde başlığı adaptör kaldırır;
 * FormData'da tarayıcı multipart sınırını kendisi yazar.
 */
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000
});

// Aktif oturumun Sanctum token'ını her giden isteğe iliştir.
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Laravel API Resources wrap payloads in a `{ data: ... }` envelope; plain
 * controller responses don't. Feature services normalize through this helper
 * so both shapes are accepted.
 */
export function unwrapEnvelope(payload: unknown): unknown {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }
  return payload;
}

/**
 * Doğrulama ihlali: alan başına **kural adı**, hazır metin değil (K20/K21).
 * Metni frontend üretir — bkz. `utils/toDisplayError.ts`.
 *
 * ```json
 * { "guestCount": [{ "rule": "max", "params": { "max": 10 } }] }
 * ```
 */
export interface ApiFieldViolation {
  /** Laravel kural adı, snake_case: `required`, `max`, `date_format`… */
  rule: string;
  /** Adlandırılmış kural parametreleri; kural parametresizse anahtar gelmez. */
  params?: Record<string, unknown>;
}

/** Backend hata zarfı: `{ error: { code, fields?, params? } }` — K20. */
interface ApiErrorEnvelope {
  error?: {
    code?: string;
    params?: Record<string, unknown>;
    fields?: Record<string, ApiFieldViolation[]>;
  };
}

function envelopeOf(error: unknown): ApiErrorEnvelope['error'] {
  if (!axios.isAxiosError(error)) return undefined;
  return (error.response?.data as ApiErrorEnvelope | undefined)?.error;
}

/**
 * Backend'in döndürdüğü hata kodu (`INVALID_CREDENTIALS`, `RATE_LIMITED`…).
 * Ağ hatası, timeout veya beklenmeyen gövdede `null` döner.
 *
 * Akış denetimi için bu üç yardımcıyı kullanın (*"hangi ekranı açmalıyım?"*);
 * kullanıcıya metin göstermek için `toDisplayError()` kullanın.
 */
export function apiErrorCode(error: unknown): string | null {
  return envelopeOf(error)?.code ?? null;
}

/** Hata koduna eşlik eden beyaz listelenmiş parametreler (ör. `retryAfter`). */
export function apiErrorParams(error: unknown): Record<string, unknown> {
  return envelopeOf(error)?.params ?? {};
}

/**
 * `VALIDATION_FAILED` zarfındaki alan ihlalleri. Backend bunu **yalnızca**
 * doğrulama hatalarında gönderir (H6); diğer kodlarda boş nesne döner.
 */
export function apiErrorFields(error: unknown): Record<string, ApiFieldViolation[]> {
  return envelopeOf(error)?.fields ?? {};
}

/**
 * İstek backend'e hiç ulaşamadı mı (bağlantı kopuk, DNS, timeout, CORS)?
 *
 * 🔴 Bir HTTP yanıtının yokluğu ile hatalı bir HTTP yanıtı aynı şey değildir:
 * ilkinde gösterilecek bir kod yoktur, ikincisinde vardır. `toDisplayError()`
 * ayrımı buradan yapar.
 */
export function isNetworkError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response === undefined;
}

/**
 * 🔴 Bir 401 İKİ farklı olayı anlatır ve ikisine aynı tepki verilemez:
 *
 *   UNAUTHENTICATED      → token yok / geçersiz / iptal edilmiş  → oturumu düşür
 *   INVALID_CREDENTIALS  → girilen e-posta veya parola yanlış    → FORMDA KAL
 *
 * Ayrım yapılmazsa kullanıcı yanlış parola girdiğinde `logout()` tetiklenir;
 * giriş sayfası yeniden kurulur ve kullanıcının yazdıkları kaybolur.
 */
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      (error as AxiosError).response?.status === 401 &&
      apiErrorCode(error) !== 'INVALID_CREDENTIALS'
    ) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
