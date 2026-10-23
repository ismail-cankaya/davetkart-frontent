import { eventDateParts } from '../../shared/eventDate';
import { displayText } from '../../utils';

/**
 * Kitabın tarih ve ad yardımcıları. Ayrıştırma ortaktır (K10):
 * tarih `shared/eventDate.ts` → `eventDateParts`, adlar `utils/names.ts` →
 * `splitPeople`. Burada yalnızca kitabın dili kalır (`tamTarih`).
 */
export { splitPeople as kisiler } from '../../../../utils/names';

export interface KitapTarihi {
  /** "13 Şubat 2027" */
  gun: string;
  /** "Cumartesi" */
  haftaGunu: string;
  /** "19:00"; saat girilmemişse boş. */
  saat: string;
}

/**
 * Duvar saatini satırlarına ayırır (`eventDateParts`). Saat dilimine
 * çevrilmez: davetiye etkinliğin kendi saatini yazar (utils/eventTime.ts).
 * Tarih yoksa ya da okunamıyorsa alanlar boştur ve sayfa o satırı hiç çizmez.
 *
 * Değer önce kırpılır: ortak ayrıştırıcı baştaki/sondaki boşlukla gelen
 * duvar saatini okuyamıyor (`new Date(' 2027-02-19T09:05 ')`), eski kit
 * okuyordu. Eski uygulamayla karşılaştırma: tarih.md.
 */
export function kitapTarihi(date: string | null | undefined): KitapTarihi {
  const { day, weekday, time } = eventDateParts(displayText(date));
  return { gun: day, haftaGunu: weekday, saat: time };
}

/** "Cumartesi, 13 Şubat 2027 · 19:00" — boş parçalar atılır. */
export function tamTarih(t: KitapTarihi): string {
  const gun = t.haftaGunu && t.gun ? `${t.haftaGunu}, ${t.gun}` : t.gun;
  return [gun, t.saat].filter(Boolean).join(' · ');
}
