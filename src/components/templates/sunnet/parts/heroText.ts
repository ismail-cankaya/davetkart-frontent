import { formatCalendarDay, formatDateStr } from '../../utils';

/** Sünnet adları: önce şehzade, sonra (varsa) aile. */
export interface SehzadeNames {
  prince: string;
  family: string;
}

/**
 * "Emir & Yılmaz Ailesi" → { prince: 'Emir', family: 'Yılmaz Ailesi' }.
 *
 * Sihirbazın iki alanı "Çocuğun Adı" ve "Aile Adı"dır; ikisi aynı boyda
 * dizilirse aile adı ikinci bir çocuk gibi okunur. Ad boşsa Summary'nin
 * yedek metni kullanılır.
 */
export function splitSehzadeNames(names: string): SehzadeNames {
  const value = names.trim();
  if (!value) return { prince: 'Davetlisiniz', family: '' };
  const [first, ...rest] = value.split(/\s+&\s+/);
  return { prince: first, family: rest.join(' & ') };
}

/** Tarih künyesi parçaları; tarih yoksa ya da ayrıştırılamıyorsa hepsi boş. */
export interface EventDateParts {
  weekday: string;
  day: string;
  time: string;
}

const WALL_CLOCK = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/;

/**
 * Duvar saatini "Cumartesi · 14 Kasım 2026 · 19:00" parçalarına ayırır.
 *
 * Tarih bir an değil duvar saatidir; parçalar metinden okunur, saat dilimine
 * çevrilmez. Biçim tanınmazsa `formatDateStr` çıktısı tek parça döner.
 */
export function eventDateParts(date: string): EventDateParts {
  const full = formatDateStr(date);
  if (!full) return { weekday: '', day: '', time: '' };

  const match = WALL_CLOCK.exec(date.trim());
  if (!match) return { weekday: '', day: full, time: '' };

  const calendar = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return {
    weekday: calendar.toLocaleDateString('tr-TR', { weekday: 'long' }),
    day: formatCalendarDay(date) ?? full,
    time: match[4] ? `${match[4]}:${match[5]}` : ''
  };
}
