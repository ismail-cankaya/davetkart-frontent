import { eventDateParts } from '../../shared/eventDate';
import { displayText } from '../../utils';

/**
 * Etiket dilinin metin yardımcıları. Davetiyenin alanlarını müze etiketinin
 * satırlarına ayırır; veride olmayan hiçbir şeyi (yıl, saat, mekân) uydurmaz.
 * Ayrıştırma ortaktır (`eventDateParts`, `splitPeople`); etiketin dili kitte.
 */

export interface EtiketTarihi {
  /** "14 Kasım 2026"; tarih yoksa boş. */
  gun: string;
  /** "14 Kasım" — yıl olmadan. */
  kisa: string;
  /** "2026" */
  yil: string;
  /** "19.00" (Türkçe saat ayracı); saat yoksa boş. */
  saat: string;
}

const BOS: EtiketTarihi = { gun: '', kisa: '', yil: '', saat: '' };

/**
 * Duvar saatini etiket parçalarına ayırır. Saat dilimine çevrilmez:
 * davetiye etkinliğin kendi saatini yazar. Okunamayan değer boş döner.
 * Etiket yalnızca `yyyy-MM-dd…` yazar: başka biçimde ortak yardımcı tam metni
 * (girilmemiş "00:00" saatiyle) verirdi.
 */
export function etiketTarihi(date: string | null | undefined): EtiketTarihi {
  const deger = displayText(date);
  if (!/^\d{4}-\d{2}-\d{2}/.test(deger)) return BOS;
  const { day, dayMonth, year, hour, minute } = eventDateParts(deger);
  return { gun: day, kisa: dayMonth, yil: year, saat: hour ? `${hour}.${minute}` : '' };
}

/** "14 Kasım 2026, 19.00" — etiketin tarih satırı; parçası olmayan atlanır. */
export function tarihSatiri(t: EtiketTarihi): string {
  return [t.gun, t.saat].filter(Boolean).join(', ');
}

/** Adları kişi kişi ayırır (`&`); boşlar atılır. */
export { splitPeople as kisiler } from '../../../../utils/names';
