/**
 * Hata kodu → kullanıcıya gösterilecek metin (K20'nin frontend yarısı).
 *
 * Backend tasarım gereği **metin döndürmez**, yalnızca kod döndürür:
 *
 * ```json
 * { "error": { "code": "PAYWALL_TIER_INSUFFICIENT",
 *              "params": { "requiredTier": "elit" } } }
 * ```
 *
 * Bu bir eksiklik değil, bir sorumluluk ayrımıdır: backend *ne olduğunu*
 * bilir, frontend *nasıl anlatılacağını*. Çeviri bu yüzden burada yaşar.
 *
 * 🔴 Bu modül yalnızca **metin** üretir, **akış** kararı vermez. "Hangi ekranı
 * açmalıyım?" sorusunun yanıtı `apiErrorCode()` ile koda bakılarak verilir —
 * iki ayrı 402 (`PAYMENT_REQUIRED` vs `PAYWALL_TIER_INSUFFICIENT`) aynı metni
 * paylaşsaydı bile farklı ekranlar açmalıdır.
 */
import i18n from '../i18n';
import {
  apiErrorCode,
  apiErrorFields,
  apiErrorParams,
  isNetworkError,
  type ApiFieldViolation,
} from '../services/api';
import { errorCodeMeta, isErrorCode, type ErrorCode } from '../contracts/errorCodes';
import { MediaTooLargeError } from '../services/media';

const NS = 'errors';

/** i18next anahtar ayırıcısı `.` olduğu için alan yolları `/` ile yazılır. */
const SEGMENT = '/';

/** Saniye cinsinden süreyi okunur bir ifadeye çevirir: "45 saniye", "3 saat". */
function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '';

  if (seconds < 60) {
    return i18n.t('duration.seconds', { ns: NS, count: Math.ceil(seconds) });
  }
  if (seconds < 3_600) {
    return i18n.t('duration.minutes', { ns: NS, count: Math.ceil(seconds / 60) });
  }
  return i18n.t('duration.hours', { ns: NS, count: Math.ceil(seconds / 3_600) });
}

/**
 * Ham parametreleri metne gömülmeye hazır hâle getirir.
 *
 * İki değer ham hâliyle gösterilemez: `retryAfter` bir saniye sayısıdır
 * (günlük kotada 80.000'i bulur) ve `requiredTier` bir sistem değeridir
 * (`elit`), kullanıcıya gösterilecek bir etiket değil.
 */
function presentParams(params: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...params };

  if (typeof out.retryAfter === 'number') {
    out.retryAfter = formatDuration(out.retryAfter);
  }
  if (typeof out.requiredTier === 'string') {
    out.requiredTier = i18n.t(`tiers.${out.requiredTier}`, {
      ns: NS,
      defaultValue: out.requiredTier,
    });
  }

  return out;
}

/**
 * Bir kod için denenecek anahtar zinciri.
 *
 * 🔴 Sözleşmedeki `params` **beyaz listedir, garanti değil**: aynı kod bazen
 * parametreyle bazen parametresiz gelir. `MEDIA_QUOTA_EXCEEDED` sahibe `limit`
 * gönderir, misafire göndermez (H9); `FILE_TOO_LARGE` ise bugün hiç parametre
 * taşımaz. Bu yüzden ayrıntılı metin ancak **tüm** parametreler eldeyken
 * seçilir — aksi hâlde ekranda ham `{{limit}}` kalırdı.
 */
function messageKeys(code: ErrorCode, params: Record<string, unknown>): string[] {
  const expected = errorCodeMeta(code)?.params ?? [];
  const complete =
    expected.length > 0 &&
    expected.every(name => params[name] !== undefined && params[name] !== null);

  const keys = [`codes.${code}.base`, `codes.${code}`, 'unknown'];
  return complete ? [`codes.${code}.detailed`, ...keys] : keys;
}

/** Alan yolunu arama adaylarına böler: tam yol, dizinsiz joker, son parça. */
function fieldKeyCandidates(field: string): string[] {
  const parts = field.split('.');
  const exact = parts.join(SEGMENT);
  const wildcard = parts.map(p => (/^\d+$/.test(p) ? '*' : p)).join(SEGMENT);
  const leaf = parts.filter(p => !/^\d+$/.test(p)).pop() ?? field;

  return [...new Set([exact, wildcard, leaf])];
}

/** Alan adının kullanıcıya gösterilen etiketi: `guestCount` → "Kişi sayısı". */
function fieldLabel(field: string): string {
  const candidates = fieldKeyCandidates(field);
  return i18n.t(
    candidates.map(c => `fields.${c}`),
    { ns: NS, defaultValue: candidates[candidates.length - 1] },
  );
}

/**
 * Tek bir kural ihlalini cümleye çevirir.
 *
 * `min` / `max` alanın **türüne** göre farklı şey anlatır; Laravel bu bilgiyi
 * yanıtta taşımaz. Doğrulanan alanların neredeyse tamamı metin olduğu için
 * varsayılan metin ("… en fazla 120 karakter") kabul edildi, sayısal olan
 * birkaç alan `validation.byField` altında ayrıca yazıldı.
 */
function violationMessage(field: string, violation: ApiFieldViolation): string {
  const keys = [
    ...fieldKeyCandidates(field).map(c => `validation.byField.${c}.${violation.rule}`),
    `validation.rules.${violation.rule}`,
    'validation.fallback',
  ];

  return i18n.t(keys, {
    ns: NS,
    field: fieldLabel(field),
    ...(violation.params ?? {}),
  });
}

/**
 * Kullanıcıya gösterilecek tek cümlelik hata metni.
 *
 * Üç durum ayrılır ve üçü farklı şey anlatır:
 * - İstek sunucuya **hiç ulaşmadı** → ağ metni (gösterilecek kod yok)
 * - Sunucu **bilinen bir kod** döndürdü → o kodun metni
 * - Sunucu tanınmayan bir şey döndürdü → genel metin
 */
export function toDisplayError(error: unknown): string {
  // 🔴 İstemcinin KENDİ kararı: dosya sunucuya hiç gönderilmedi (sıkıştırmadan
  // sonra bile sınırın üstünde kaldı). Sunucunun aynı durumda döndürdüğü kodun
  // metni kullanılıyor — kullanıcı için ikisi aynı olaydır ve iki ayrı cümle
  // yazmak sözlüğü bölerdi. `.detailed` seçilmiyor, çünkü `max` parametresi yok.
  if (error instanceof MediaTooLargeError) {
    return i18n.t(['codes.FILE_TOO_LARGE.base', 'codes.FILE_TOO_LARGE', 'unknown'], { ns: NS });
  }

  if (isNetworkError(error)) {
    return i18n.t('network', { ns: NS });
  }

  const code = apiErrorCode(error);
  if (!isErrorCode(code)) {
    return i18n.t('unknown', { ns: NS });
  }

  // Doğrulama hatasında genel cümle ("Formda düzeltilecek alanlar var")
  // tek bir alan hatalıysa gereksiz yere belirsizdir — somut olanı göster.
  if (code === 'VALIDATION_FAILED') {
    const entries = Object.entries(apiErrorFields(error));
    const [field, violations] = entries[0] ?? [];

    if (entries.length === 1 && field && violations?.[0]) {
      return violationMessage(field, violations[0]);
    }
  }

  return i18n.t(messageKeys(code, apiErrorParams(error)), {
    ns: NS,
    ...presentParams(apiErrorParams(error)),
  });
}

/**
 * Alan adı → o alanın ilk ihlaline ait metin. Form alanlarının altına
 * satır içi hata basmak için kullanılır; alan adları backend'e gönderildiği
 * hâliyle (camelCase) döner.
 *
 * `VALIDATION_FAILED` dışındaki hatalarda boş nesne verir (H6).
 */
export function toFieldErrors(error: unknown): Record<string, string> {
  const violations = apiErrorFields(error);
  const messages: Record<string, string> = {};

  for (const [field, list] of Object.entries(violations)) {
    const first = list[0];
    if (first) messages[field] = violationMessage(field, first);
  }

  return messages;
}

/**
 * Aynı isteği tekrar denemek anlamlı mı? (429 / 502 / 503 — sözleşmeden gelir.)
 * Ağ hatası da tekrarlanabilir sayılır: sunucu isteği hiç görmedi.
 */
export function isRetryableError(error: unknown): boolean {
  if (isNetworkError(error)) return true;
  return errorCodeMeta(apiErrorCode(error))?.retryable ?? false;
}

/** `Retry-After` saniyesi; hata bir bekleme süresi bildirmiyorsa `null`. */
export function retryAfterSeconds(error: unknown): number | null {
  const value = apiErrorParams(error).retryAfter;
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}
