import { NISAN_FLAVOR } from '../flavors';
import type { TemplateFlavor } from '../../shared/flavor';
import { eventDateParts } from '../../shared/eventDate';

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

/**
 * Duvar saatini kartın satırlarına ayırır (ortak `eventDateParts`). Tarih yoksa
 * ya da okunamıyorsa üç alan da boştur ve kart o satırları hiç çizmez.
 */
export function kagitTarih(date: string | null | undefined): KagitTarih {
  const { day, weekday, time } = eventDateParts(date);
  return { gun: day, haftaGunu: weekday, saat: time };
}

/** Adları kişi kişi ayırır (`&`); boşlar atılır. Hiç ad yoksa boş dizi. */
export { splitPeople as kisiler } from '../../../../utils/names';
