import { displayText, formatCalendarDay } from '../../utils';

export interface KitapTarihi {
  /** "13 Şubat 2027" */
  gun: string;
  /** "Cumartesi" */
  haftaGunu: string;
  /** "19:00"; saat girilmemişse boş. */
  saat: string;
}

const BOS: KitapTarihi = { gun: '', haftaGunu: '', saat: '' };
const DUVAR_SAATI = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/;

/**
 * Duvar saatini satırlarına ayırır. Saat dilimine çevrilmez: davetiye
 * etkinliğin kendi saatini yazar (utils/eventTime.ts). Tarih yoksa ya da
 * okunamıyorsa alanlar boştur ve sayfa o satırı hiç çizmez.
 */
export function kitapTarihi(date: string | null | undefined): KitapTarihi {
  const m = DUVAR_SAATI.exec(displayText(date));
  if (!m) return BOS;
  const takvim = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(takvim.getTime())) return BOS;
  return {
    gun: formatCalendarDay(m[0]) ?? '',
    haftaGunu: takvim.toLocaleDateString('tr-TR', { weekday: 'long' }),
    saat: m[4] ? `${m[4]}:${m[5]}` : ''
  };
}

/** "Cumartesi, 13 Şubat 2027 · 19:00" — boş parçalar atılır. */
export function tamTarih(t: KitapTarihi): string {
  const gun = t.haftaGunu && t.gun ? `${t.haftaGunu}, ${t.gun}` : t.gun;
  return [gun, t.saat].filter(Boolean).join(' · ');
}

/** Adları kişi kişi ayırır (`&`); boşlar atılır. Hiç ad yoksa boş dizi. */
export function kisiler(names: string | null | undefined): string[] {
  return displayText(names)
    .split('&')
    .map((ad) => ad.trim())
    .filter(Boolean);
}
