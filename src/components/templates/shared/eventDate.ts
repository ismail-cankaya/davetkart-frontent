import { formatCalendarDay, formatDateStr } from '../utils';

/** Davetiye tarihinin satır satır parçaları; girilmeyen parça boş metindir. */
export interface EventDateParts {
  /** "14 Kasım 2026" */
  day: string;
  /** "14 Kasım" — yıl olmadan. */
  dayMonth: string;
  /** "2026" */
  year: string;
  /** "Cumartesi" */
  weekday: string;
  /** "19:00"; saat girilmemişse boş. */
  time: string;
  /** "19" */
  hour: string;
  /** "00" */
  minute: string;
}

const EMPTY: EventDateParts = { day: '', dayMonth: '', year: '', weekday: '', time: '', hour: '', minute: '' };
const WALL_CLOCK = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/;

/**
 * Duvar saatini parçalarına ayırır. Saat dilimine çevrilmez: davetiye
 * etkinliğin kendi saatini yazar (`utils/eventTime.ts`). Tarih yoksa bütün
 * parçalar boştur. `yyyy-MM-dd` biçimine uymayan ama okunabilen bir değerde
 * yalnızca `day` dolar (tam metin, `formatDateStr`).
 */
export function eventDateParts(date: string | null | undefined): EventDateParts {
  const full = formatDateStr(date);
  if (!full || !date) return EMPTY;
  const m = WALL_CLOCK.exec(date.trim());
  if (!m) return { ...EMPTY, day: full };
  const calendar = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return {
    day: formatCalendarDay(date) ?? full,
    dayMonth: calendar.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }),
    year: m[1],
    weekday: calendar.toLocaleDateString('tr-TR', { weekday: 'long' }),
    time: m[4] ? `${m[4]}:${m[5]}` : '',
    hour: m[4] ?? '',
    minute: m[5] ?? ''
  };
}
