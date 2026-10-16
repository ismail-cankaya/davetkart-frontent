import { DEFAULT_INVITE_MESSAGES, EVENT_CATEGORIES, INITIAL_INVITATION, upcomingShowcaseDate } from '../../src/data';
import type { Invitation, TimelineEvent } from '../../src/types';

export type SenaryoAdi = 'dolu' | 'uzun' | 'bos' | 'kapali';
export const SENARYOLAR: readonly SenaryoAdi[] = ['dolu', 'uzun', 'bos', 'kapali'];

/** Tek tek kapatılabilen modüller (`kapat=timer,gift`). Zarf ayrıca `zarf=1` ile açılır. */
export type Modul = 'timer' | 'timeline' | 'gallery' | 'gift' | 'rsvp';
export const MODULLER: readonly Modul[] = ['timer', 'timeline', 'gallery', 'gift', 'rsvp'];

const MODUL_ALANI: Record<Modul, keyof Invitation> = {
  timer: 'showTimer',
  timeline: 'showTimeline',
  gallery: 'showGallery',
  gift: 'showGift',
  rsvp: 'showRSVP'
};

/** Preset kimliğinin öneki → kategori kimliği (`baby` öneki `baby-shower` kategorisidir). */
const ONEK_KATEGORI: Record<string, string> = {
  dugun: 'dugun',
  kina: 'kina',
  nisan: 'nisan',
  sunnet: 'sunnet',
  'dogum-gunu': 'dogum-gunu',
  mezuniyet: 'mezuniyet',
  baby: 'baby-shower',
  parti: 'parti',
  kurumsal: 'kurumsal'
};

/** `dogum-gunu-sergi-x` → `{ onek: 'dogum-gunu', kategori: 'dogum-gunu', kalan: 'sergi-x' }`. */
export function kimligiCoz(preset: string): { onek: string; kategori: string; kalan: string } | null {
  const onek = Object.keys(ONEK_KATEGORI)
    .sort((a, b) => b.length - a.length)
    .find((o) => preset === o || preset.startsWith(o + '-'));
  if (!onek) return null;
  const kalan = preset.slice(onek.length + 1).replace(/^shower-/, '');
  return { onek, kategori: ONEK_KATEGORI[onek], kalan };
}

/** İsim alanının kategoriye göre anlamı farklı; örnek de ona uyar (KONSEPT-ORTAK §4). */
const ADLAR: Record<string, { kisa: string; uzun: string }> = {
  ciftler: { kisa: 'Gülşen İrem & Mehmet Çağrı', uzun: 'Gülşen İrem Karaağaçlı & Mehmet Çağrı Yıldırımoğlu' },
  sunnet: { kisa: 'Ali Kerem & Yıldırımoğlu Ailesi', uzun: 'Mehmet Çağrı Ali Kerem & Karaağaçlı-Yıldırımoğlu Ailesi' },
  'dogum-gunu': { kisa: 'Gülşen İrem', uzun: 'Gülşen İrem Karaağaçlı & Mehmet Çağrı Yıldırımoğlu' },
  mezuniyet: { kisa: 'Mehmet Çağrı & Mimarlık Bölümü', uzun: 'Mehmet Çağrı Yıldırımoğlu & Şehir ve Bölge Planlama Bölümü' },
  'baby-shower': { kisa: 'Gülşen İrem & Ada', uzun: 'Gülşen İrem Karaağaçlı & Ayşegül Işıl' },
  kurumsal: { kisa: 'Karaağaçlı Yazılım & Bayi Buluşması', uzun: 'Karaağaçlı-Yıldırımoğlu Teknoloji A.Ş. & 2026 Yıllık Bayi ve İş Ortakları Buluşması' }
};

const adlar = (kategori: string) => ADLAR[kategori] ?? ADLAR.ciftler;

const PROGRAM: TimelineEvent[] = [
  { id: null, localKey: 'oz-1', time: '17:00', title: 'Karşılama', description: 'Misafirlerimizi bahçede karşılıyoruz.' },
  { id: null, localKey: 'oz-2', time: '19:00', title: 'Tören', description: 'Günün en özel anına birlikte tanıklık edelim.' },
  { id: null, localKey: 'oz-3', time: '20:30', title: 'Akşam yemeği', description: 'Özenle hazırlanan menü eşliğinde.' },
  { id: null, localKey: 'oz-4', time: '22:00', title: 'Kutlama', description: 'Gece boyu müzik ve dans.' }
];

/** Depodaki herkese açık görseller; galeri boş kalmasın diye. */
const GALERI = ['/images/emerald-640.webp', '/images/corporate-640.webp', '/images/moda-gece.svg'].map((url) => ({ id: null, url }));

/** Etkinlikten bir hafta önce, `yyyy-MM-dd`. */
function lcvSonGun(tarih: string): string {
  const [y, m, d] = tarih.slice(0, 10).split('-').map(Number);
  const gun = new Date(y, m - 1, d - 7);
  const pad = (v: number) => String(v).padStart(2, '0');
  return `${gun.getFullYear()}-${pad(gun.getMonth() + 1)}-${pad(gun.getDate())}`;
}

export interface SenaryoGirdisi {
  kategori: string;
  senaryo: SenaryoAdi;
  /** `true` → zarf modülü açık (giriş kapısı görünür). */
  zarf: boolean;
  /** Ayrıca kapatılacak modüller. */
  kapat: Modul[];
}

/**
 * Önizlemenin davetiyesi. Sihirbazın yaptığı gibi başlık kategorinin önerisinden gelir;
 * kişisel alanlar senaryoya göre dolar ya da boş kalır.
 */
export function senaryoKur({ kategori, senaryo, zarf, kapat }: SenaryoGirdisi): Invitation {
  const kat = EVENT_CATEGORIES.find((c) => c.id === kategori);
  const tarih = upcomingShowcaseDate();
  const temel: Invitation = {
    ...INITIAL_INVITATION,
    categoryId: kategori,
    title: kat?.suggestedTitle ?? INITIAL_INVITATION.title,
    subtitle: DEFAULT_INVITE_MESSAGES[0]
  };

  let davet: Invitation;
  if (senaryo === 'bos') {
    davet = temel;
  } else {
    const uzun = senaryo === 'uzun';
    davet = {
      ...temel,
      names: uzun ? adlar(kategori).uzun : adlar(kategori).kisa,
      date: tarih,
      venue: uzun ? 'Çırağan Sarayı Kempinski İstanbul Balo Salonu, Çırağan Cd. No:32, Beşiktaş/İstanbul' : 'Çırağan Sarayı, Beşiktaş',
      mapUrl: 'https://maps.google.com/?q=Ciragan+Sarayi',
      title: uzun ? 'HAYATIMIZIN EN ANLAMLI, EN UZUN VE EN SEVİNÇLİ GÜNÜNE DAVETLİSİNİZ' : temel.title,
      subtitle: uzun
        ? 'Işıl bir Ağustos akşamından Şubat’a uzanan hikâyemizin bu yeni sayfasında sizleri de aramızda görmekten onur ve mutluluk duyarız.'
        : temel.subtitle,
      showTimer: true,
      showTimeline: true,
      showGallery: true,
      showGift: true,
      showRSVP: true,
      timelineEvents: PROGRAM,
      galleryImages: GALERI,
      bankName: 'Örnek Bankası',
      accountHolder: uzun ? adlar(kategori).uzun : adlar(kategori).kisa,
      iban: 'TR000000000000000000000000',
      rsvpDeadline: lcvSonGun(tarih)
    };
    if (senaryo === 'kapali') {
      davet = { ...davet, showTimer: false, showTimeline: false, showGallery: false, showGift: false, showRSVP: false };
    }
  }

  davet = { ...davet, showEnvelope: zarf };
  for (const modul of kapat) davet = { ...davet, [MODUL_ALANI[modul]]: false };
  return davet;
}
