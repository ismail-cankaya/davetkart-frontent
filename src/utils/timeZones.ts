import { isValidTimeZone } from './eventTime';

/**
 * Seçilebilir IANA saat dilimleri.
 *
 * Liste `Intl.supportedValuesOf('timeZone')` ile **çalışma zamanında**
 * okunur: kendi listemizi paketlemek, tarayıcının tanıdığı kümeyle bir gün
 * ayrışacak ölü bir kopya üretirdi. Backend de değeri PHP'nin kayıtlı
 * listesine karşı doğruluyor (`timezone` kuralı), yani uydurma bir değer
 * veritabanına hiç ulaşmaz.
 */

/** Ortam numaralandırmayı desteklemezse kullanılan asgari küme. */
const FALLBACK_ZONES = [
  'Europe/Istanbul',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Europe/Amsterdam',
  'Europe/Zurich',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Dubai',
  'Asia/Baku',
  'UTC',
];

/** Türk kullanıcı kitlesinin en sık ihtiyaç duyacağı diller — listenin başında. */
const PINNED_ZONES = ['Europe/Istanbul', 'Europe/Berlin', 'Europe/London', 'Europe/Amsterdam'];

function allZones(): string[] {
  const enumerate = (Intl as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf;

  if (typeof enumerate !== 'function') return FALLBACK_ZONES;

  try {
    const zones = enumerate('timeZone');
    return zones.length > 0 ? zones : FALLBACK_ZONES;
  } catch {
    return FALLBACK_ZONES;
  }
}

/** Tarayıcının kendi saat dilimi — kullanıcı için makul bir ilk tahmin. */
export function browserTimeZone(): string {
  const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return isValidTimeZone(resolved) ? resolved : 'Europe/Istanbul';
}

/**
 * Seçicide gösterilecek sıralı liste: önce sabitlenenler ve kullanıcının
 * kendi saat dilimi, sonra kalanlar alfabetik.
 */
export function timeZoneOptions(): string[] {
  const zones = allZones();
  const known = new Set(zones);

  const head = [browserTimeZone(), ...PINNED_ZONES].filter(
    (zone, index, list) => known.has(zone) && list.indexOf(zone) === index
  );

  const rest = zones.filter((zone) => !head.includes(zone)).sort((a, b) => a.localeCompare(b));

  return [...head, ...rest];
}

/**
 * `Europe/Istanbul` → `Europe / Istanbul (UTC+03:00)`.
 *
 * Fark **bugünün** değeridir; yaz saati uygulayan bölgelerde yılın diğer
 * yarısında farklı olur. Etiket bir bilgi, bir söz değil.
 */
export function formatTimeZoneLabel(timeZone: string): string {
  const readable = timeZone.replace(/_/g, ' ').replace('/', ' / ');

  try {
    const offset = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
      .formatToParts(new Date())
      .find((part) => part.type === 'timeZoneName')?.value;

    return offset ? `${readable} (${offset})` : readable;
  } catch {
    return readable;
  }
}
