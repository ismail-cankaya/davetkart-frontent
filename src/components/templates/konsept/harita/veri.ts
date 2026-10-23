import type { Invitation } from '../../../../types';
import { hasTimelineEventContent } from '../../../../utils/timelineEvents';
import { displayText } from '../../utils';
import { eventDateParts } from '../../shared/eventDate';
import type { DurakSimgeAdi } from './simgeler';

/** Adları kişi kişi ayırır (`&`); boşlar atılır. Ortak yardımcı (utils/names, K10). */
export { splitPeople as kisiler } from '../../../../utils/names';

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

/**
 * Duvar saatini parçalarına ayırır. Saat dilimine çevrilmez: davetiye
 * etkinliğin kendi saatini yazar. Tarih yoksa ya da okunamıyorsa hepsi boş.
 * Ortak ayrıştırıcıya bağlı (shared/eventDate §3, K10); davranış aynı.
 */
export function haritaTarihi(date: string | null | undefined): HaritaTarihi {
  const { day, weekday, time } = eventDateParts(date);
  return { gun: day, haftaGunu: weekday, saat: time };
}

/**
 * Durak başlığından piktogram. Eşleşme yoksa `null` — durak sıra numarasıyla
 * çizilir. Sözcükler Türkçe küçük harfe çevrilip aranır; SIRA önemlidir, ilk
 * eşleşen kazanır: "Nişan" iki halka, "Yüzük takma" yüzük; "Kahve ikramı"
 * kahve (kadehten önce), "Tatlı ikramı" tatlı.
 */
export type SimgeSozlugu = [DurakSimgeAdi, string[]][];

const SIMGE_SOZLUGU: SimgeSozlugu = [
  ['pasta', ['pasta']],
  ['halka', ['nişan', 'nisan', 'söz ']],
  ['yuzuk', ['nikâh', 'nikah', 'tören', 'toren', 'yüzük', 'yüzüğ', 'evlilik', 'imza']],
  ['kurdele', ['kurdele']],
  ['kahve', ['kahve']],
  ['cay', [' çay']],
  ['tatli', ['tatlı', 'tatli', 'baklava', 'lokum', 'çikolata']],
  ['yemek', ['yemek', 'yemeğ', 'ziyafet', 'menü', 'sofra', 'kahvaltı', 'öğle']],
  ['kadeh', ['karşılama', 'kokteyl', 'hoş geldin', 'ikram', 'içecek']],
  ['muzik', ['dans', 'müzik', 'eğlence', 'kutlama', 'parti', 'konser', 'sahne', 'halay', ' dj ']],
  ['kamera', ['fotoğraf', 'fotograf', 'çekim']],
  // Doğum günü (2026-10-23). Sonda: önceki sözcüklerle çakışmaz. "Oyun" müzikten
  // sonradır: "Eğlence ve oyun havaları" müzik simgesini alır.
  ['hediye', ['hediye']],
  ['zar', ['oyun', 'hazine av', 'saklambaç', 'yarışma']]
];

/**
 * Bir kategorinin ya da preset'in sözlüğü genel sözlükten ÖNCE aranır:
 * çocuk doğum gününde "Karşılama" kadeh değil balondur (`ek`).
 */
export function durakSimgesi(baslik: string, ek: SimgeSozlugu = []): DurakSimgeAdi | null {
  const metin = ` ${baslik.toLocaleLowerCase('tr')} `;
  for (const [simge, sozcukler] of [...ek, ...SIMGE_SOZLUGU]) {
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
export function lejantKur(invitation: Invitation, enCok = 3, sozluk: SimgeSozlugu = []): LejantVerisi {
  const adimlar = invitation.showTimeline ? (invitation.timelineEvents ?? []).filter(hasTimelineEventContent) : [];
  const duraklar: Durak[] = adimlar.slice(0, enCok).map((adim, i) => {
    const ad = displayText(adim.title) || displayText(adim.description);
    return { anahtar: adim.localKey, sira: i + 1, saat: displayText(adim.time), ad, simge: durakSimgesi(ad, sozluk) };
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
