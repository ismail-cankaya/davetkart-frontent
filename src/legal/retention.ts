/**
 * SEC-11 (Faz 19.18, K231): silinen verinin yedeklerden de silindiği üst sınır (gün). K152: döküm 30 gün
 * + eski sürüm 7 gün (~37) + S3 kuralının günlük işleme gecikmesi; 40 yuvarlama payı. Gizlilik metni bunu kullanır.
 * Kılavuz: docs/rehber/src/legal/retention.md
 */
export const BACKUP_PURGE_DAYS = 40;

/** K98 (FE-52, 19.19): misafir verisi (LCV + misafir dosyaları) etkinlik tarihinden bu kadar ay sonra silinir (`data:purge`). */
export const GUEST_DATA_MONTHS_AFTER_EVENT = 6;

/** K257 (B-E8): tarihsiz davetiyede misafir verisi yayın (yoksa oluşturma) tarihinden bu kadar ay sonra silinir. */
export const UNDATED_GUEST_DATA_MONTHS = 12;
