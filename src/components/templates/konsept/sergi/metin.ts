import { displayText, formatCalendarDay } from '../../utils';

/**
 * Etiket dilinin metin yardımcıları. Davetiyenin alanlarını müze etiketinin
 * satırlarına ayırır; veride olmayan hiçbir şeyi (yıl, saat, mekân) uydurmaz.
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

const DUVAR_SAATI = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/;
const BOS: EtiketTarihi = { gun: '', kisa: '', yil: '', saat: '' };

/**
 * Duvar saatini etiket parçalarına ayırır. Saat dilimine çevrilmez:
 * davetiye etkinliğin kendi saatini yazar. Okunamayan değer boş döner.
 */
export function etiketTarihi(date: string | null | undefined): EtiketTarihi {
  const m = DUVAR_SAATI.exec(displayText(date));
  if (!m) return BOS;
  const gun = formatCalendarDay(m[0]);
  if (!gun) return BOS;
  const takvim = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return {
    gun,
    kisa: takvim.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }),
    yil: m[1],
    saat: m[4] ? `${m[4]}.${m[5]}` : ''
  };
}

/** "14 Kasım 2026, 19.00" — etiketin tarih satırı; parçası olmayan atlanır. */
export function tarihSatiri(t: EtiketTarihi): string {
  return [t.gun, t.saat].filter(Boolean).join(', ');
}

/** Adları kişi kişi ayırır (`&`); boşlar atılır. */
export function kisiler(names: string | null | undefined): string[] {
  return displayText(names)
    .split('&')
    .map((ad) => ad.trim())
    .filter(Boolean);
}
