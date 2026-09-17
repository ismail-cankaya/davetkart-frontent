import { hasText } from '../../utils/text';

/**
 * Davetiye tarihini okunur metne çevirir: "12 Eylül 2026 19:00".
 *
 * 🔴 Tarih artık boş doğar (kullanıcı seçmeden sahte tarih yok). Boş, yalnızca
 * boşluk ya da ayrıştırılamayan değerde BOŞ METİN döner — "Invalid Date"
 * yazmaz, istisna fırlatmaz. Çağıranlar `''` gördüğünde tarih kabını hiç
 * çizmez.
 */
export const formatDateStr = (dateStr: string | null | undefined): string => {
  if (!hasText(dateStr)) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * İsteğe bağlı bir metin alanının çizilecek hâli; girilmemişse `''`.
 *
 * Önizleme misafir ucundan gelen veriyi de çizdiği için `null`/`undefined`
 * kabul eder. Şablonlar `''` gördüğünde alanın kabını (etiket, ikon, ayırıcı)
 * hiç çizmez — boş bir "Mekân" satırı, girilmemiş bilgiyi var gibi gösterir.
 */
export const displayText = (value: string | null | undefined): string => value?.trim() ?? '';

/**
 * `yyyy-MM-dd` biçimindeki bir takvim gününü okunur tarihe çevirir.
 *
 * 🔴 `new Date('2026-11-10')` bu metni **UTC gece yarısı** sayar; UTC'nin
 * batısındaki bir misafir (New York, São Paulo) son tarihi "9 Kasım" görürdü.
 * Takvim gününün saat dilimi yoktur — parçalar yerel tarih olarak kurulur.
 *
 * @returns Biçimlenmiş tarih, ya da metin ayrıştırılamıyorsa `null`.
 */
export const formatCalendarDay = (value: string): string | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return null;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
};
