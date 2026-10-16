import { NISAN_FLAVOR } from '../flavors';
import type { TemplateFlavor } from '../../shared/flavor';
import { displayText, formatCalendarDay, formatDateStr } from '../../utils';

/**
 * Nişanın kâğıt preset'lerinin (Söz Mektubu, Gül Kurusu, Söz Senedi) ortak
 * parçaları.
 *
 * Kategori deseni (halkalar) kapatılır: masa zaten dokulu kâğıttır, üstüne
 * desen binince kâğıt hissi bozulur (KAGIT-KONSEPTI §6).
 */
export const NISAN_KAGIT_FLAVOR: TemplateFlavor = { ...NISAN_FLAVOR, BackgroundPattern: undefined };

export interface KagitTarih {
  /** "14 Kasım 2026" */
  gun: string;
  /** "Cumartesi" */
  haftaGunu: string;
  /** "19:00"; saat girilmemişse boş. */
  saat: string;
}

const DUVAR_SAATI = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/;

/**
 * Duvar saatini kartın satırlarına ayırır. Saat dilimine çevrilmez: davetiye
 * etkinliğin kendi saatini yazar. Tarih yoksa ya da okunamıyorsa üç alan da
 * boştur ve kart o satırları hiç çizmez.
 */
export function kagitTarih(date: string | null | undefined): KagitTarih {
  const tam = formatDateStr(date);
  if (!tam || !date) return { gun: '', haftaGunu: '', saat: '' };
  const m = DUVAR_SAATI.exec(date.trim());
  if (!m) return { gun: tam, haftaGunu: '', saat: '' };
  const takvim = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return {
    gun: formatCalendarDay(date) ?? tam,
    haftaGunu: takvim.toLocaleDateString('tr-TR', { weekday: 'long' }),
    saat: m[4] ? `${m[4]}:${m[5]}` : ''
  };
}

/** Adları kişi kişi ayırır (`&`); boşlar atılır. Hiç ad yoksa boş dizi. */
export function kisiler(names: string | null | undefined): string[] {
  return displayText(names)
    .split('&')
    .map((ad) => ad.trim())
    .filter(Boolean);
}
