import type { Invitation } from '../../../../types';
import { hasTimelineEventContent } from '../../../../utils/timelineEvents';
import { displayText, formatCalendarDay, formatDateStr } from '../../utils';
import type { DurakSimgeAdi } from './simgeler';

/**
 * Haritanın veriden kurulan her parçası burada hesaplanır; bileşenler
 * yalnızca çizer. Veride olmayan hiçbir şey üretilmez: boş alan boş döner
 * ve onu çizecek satır hiç çizilmez.
 */

export interface HaritaTarihi {
  /** "12 Şubat 2027" */
  gun: string;
  /** "Cuma" */
  haftaGunu: string;
  /** "19:00"; saat girilmemişse boş. */
  saat: string;
}

const DUVAR_SAATI = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/;

/**
 * Duvar saatini parçalarına ayırır. Saat dilimine çevrilmez: davetiye
 * etkinliğin kendi saatini yazar. Tarih yoksa ya da okunamıyorsa hepsi boş.
 */
export function haritaTarihi(date: string | null | undefined): HaritaTarihi {
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

/** Adları kişi kişi ayırır (`&`); boşlar atılır. */
export function kisiler(names: string | null | undefined): string[] {
  return displayText(names)
    .split('&')
    .map((ad) => ad.trim())
    .filter(Boolean);
}

/**
 * Durak başlığından piktogram. Eşleşme yoksa `null` — durak sıra numarasıyla
 * çizilir. Sözcükler Türkçe küçük harfe çevrilip aranır; ilk eşleşen kazanır.
 */
const SIMGE_SOZLUGU: [DurakSimgeAdi, string[]][] = [
  ['pasta', ['pasta']],
  ['yuzuk', ['nikâh', 'nikah', 'tören', 'toren', 'yüzük', 'evlilik', 'söz ', 'imza']],
  ['yemek', ['yemek', 'yemeğ', 'ziyafet', 'menü', 'sofra', 'kahvaltı', 'öğle']],
  ['kadeh', ['karşılama', 'kokteyl', 'hoş geldin', 'ikram', 'içecek']],
  ['muzik', ['dans', 'müzik', 'eğlence', 'kutlama', 'parti', 'konser', 'sahne', 'halay', ' dj ']]
];

export function durakSimgesi(baslik: string): DurakSimgeAdi | null {
  const metin = ` ${baslik.toLocaleLowerCase('tr')} `;
  for (const [simge, sozcukler] of SIMGE_SOZLUGU) {
    if (sozcukler.some((s) => metin.includes(s))) return simge;
  }
  return null;
}

export interface Durak {
  anahtar: string;
  /** 1'den başlar; simgesi olmayan durak bununla çizilir. */
  sira: number;
  saat: string;
  ad: string;
  simge: DurakSimgeAdi | null;
}

export interface LejantVerisi {
  /** Program açıksa ilk en çok `enCok` dolu adım. */
  duraklar: Durak[];
  /** Lejanta sığmayan dolu adım sayısı ("+1 durak daha"). */
  kalan: number;
  /** Program yoksa lejantın tarih satırı: "Cuma, 12 Şubat 2027 · 19:00". */
  tarihSatiri: string;
  mekan: string;
  /** Lejantta gösterilecek hiçbir satır yok mu? */
  bos: boolean;
}

/**
 * Lejant: açık program adımları (en çok üç) + mekân. Program kapalıysa ya da
 * boşsa tarih ve mekân; ikisi de yoksa lejant boştur ve çizilmez.
 */
export function lejantKur(invitation: Invitation, enCok = 3): LejantVerisi {
  const adimlar = invitation.showTimeline ? (invitation.timelineEvents ?? []).filter(hasTimelineEventContent) : [];
  const duraklar: Durak[] = adimlar.slice(0, enCok).map((adim, i) => {
    const ad = displayText(adim.title) || displayText(adim.description);
    return { anahtar: adim.localKey, sira: i + 1, saat: displayText(adim.time), ad, simge: durakSimgesi(ad) };
  });

  const { gun, haftaGunu, saat } = haritaTarihi(invitation.date);
  const tarihSatiri = duraklar.length ? '' : [haftaGunu ? `${haftaGunu}, ${gun}` : gun, saat].filter(Boolean).join(' · ');
  const mekan = displayText(invitation.venue);

  return {
    duraklar,
    kalan: Math.max(0, adimlar.length - duraklar.length),
    tarihSatiri,
    mekan,
    bos: !duraklar.length && !tarihSatiri && !mekan
  };
}
