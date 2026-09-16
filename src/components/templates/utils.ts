export const formatDateStr = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

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
