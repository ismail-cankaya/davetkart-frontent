/**
 * SEC-11 (Faz 19.18, K231): silinen verinin yedeklerden de silindiği üst sınır (gün). K152: döküm 30 gün
 * + eski sürüm 7 gün (~37) + S3 kuralının günlük işleme gecikmesi; 40 yuvarlama payı. Gizlilik metni bunu kullanır.
 * Kılavuz: docs/rehber/src/legal/retention.md
 */
export const BACKUP_PURGE_DAYS = 40;
