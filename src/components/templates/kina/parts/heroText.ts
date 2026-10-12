import { formatCalendarDay, formatDateStr } from '../../utils';

/** Hero'nun isim satırları: iki kişi ise ayrı satırlar, değilse tek satır. */
export type KinaNames = { first: string; second: string };

/**
 * "Ayşe & Ali" → { first: 'Ayşe', second: 'Ali' }; tek isimde `second` boş,
 * hiç isim yoksa `first` yedek metindir ("Davetlisiniz").
 */
export function splitKinaNames(names: string | null | undefined): KinaNames {
  const text = names?.trim() ?? '';
  const at = text.indexOf('&');
  if (at > 0) {
    const first = text.slice(0, at).trim();
    const second = text.slice(at + 1).trim();
    if (first && second) return { first, second };
  }
  const single = text.replace(/^&\s*|\s*&$/g, '').trim();
  return { first: single || 'Davetlisiniz', second: '' };
}

/** Tarih künyesi: gün adı · takvim günü · saat; tarih yoksa hepsi boş. */
export interface KinaDateParts {
  weekday: string;
  day: string;
  time: string;
}

const WALL_CLOCK = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/;

/**
 * Duvar saatini parçalara ayırır. Saat dilimine çevrilmez: parçalar metinden
 * okunur; biçim tanınmazsa `formatDateStr` çıktısı tek parça döner.
 */
export function kinaDateParts(date: string | null | undefined): KinaDateParts {
  const full = formatDateStr(date);
  if (!full || !date) return { weekday: '', day: '', time: '' };

  const match = WALL_CLOCK.exec(date.trim());
  if (!match) return { weekday: '', day: full, time: '' };

  const calendar = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return {
    weekday: calendar.toLocaleDateString('tr-TR', { weekday: 'long' }),
    day: formatCalendarDay(date) ?? full,
    time: match[4] ? `${match[4]}:${match[5]}` : ''
  };
}
