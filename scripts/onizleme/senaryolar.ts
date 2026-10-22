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

/** Kategoriye uygun dört adımlı program: `saat · başlık · açıklama`. Durak simgeleri gibi başlığa bakan parçalar bununla denenir. */
const PROGRAMLAR: Record<string, [string, string, string][]> = {
  dugun: [
    ['17:00', 'Karşılama', 'Misafirlerimizi bahçede karşılıyoruz.'],
    ['19:00', 'Tören', 'Günün en özel anına birlikte tanıklık edelim.'],
    ['20:30', 'Akşam yemeği', 'Özenle hazırlanan menü eşliğinde.'],
    ['22:00', 'Kutlama', 'Gece boyu müzik ve dans.']
  ],
  nisan: [
    ['18:00', 'Karşılama', 'Ailelerimizle birlikte sizi kapıda karşılıyoruz.'],
    ['18:30', 'Söz ve yüzük takma', 'Büyüklerimizin huzurunda sözümüzü veriyoruz.'],
    ['19:30', 'Kahve ve tatlı ikramı', 'Türk kahvesi ve ev yapımı tatlılar.'],
    ['20:30', 'Akşam yemeği', 'Sofrayı birlikte paylaşalım.']
  ],
  kina: [
    ['19:00', 'Karşılama', 'Gelinin evinde misafirlerimizi ağırlıyoruz.'],
    ['20:00', 'Gelin alma', 'Türküler eşliğinde gelinimiz aramıza katılıyor.'],
    ['21:00', 'Kına yakma', 'Avuçlara kına, gönüllere dua.'],
    ['22:00', 'Eğlence', 'Halaylar ve oyun havaları.']
  ],
  sunnet: [
    ['11:00', 'Karşılama', 'Bahçede misafirlerimizi karşılıyoruz.'],
    ['12:00', 'Mevlit', 'Küçük beyimiz için dualarımızı birlikte okuyalım.'],
    ['13:00', 'Öğle yemeği', 'Geleneksel sünnet sofrası.'],
    ['15:00', 'Çocuk şenliği', 'Sihirbaz, pamuk şeker ve oyunlar.']
  ],
  'dogum-gunu': [
    ['15:00', 'Karşılama', 'Balonlar şişti, kapı açık.'],
    ['15:30', 'Oyunlar', 'Saklambaçtan hazine avına.'],
    ['17:00', 'Pasta kesimi', 'Mumları birlikte üfleyelim.'],
    ['18:00', 'Hediye açılışı', 'Sürprizler paketlerinden çıkıyor.']
  ],
  mezuniyet: [
    ['10:00', 'Mezuniyet töreni', 'Diplomalar sahnede veriliyor.'],
    ['12:00', 'Kep atma', 'Hep birlikte, aynı anda.'],
    ['13:00', 'Fotoğraf çekimi', 'Ailelerimizle kampüste.'],
    ['19:00', 'Mezuniyet yemeği', 'Yeni başlangıçlara kadeh kaldıralım.']
  ],
  'baby-shower': [
    ['14:00', 'Karşılama', 'Pastel balonlar ve limonata.'],
    ['14:30', 'Oyunlar', 'Bebek tahmin oyunu ve dilek kartları.'],
    ['15:30', 'Pasta ve ikram', 'Tatlı bir mola.'],
    ['16:30', 'Hediye açılışı', 'Minik kıyafetler, büyük sevinçler.']
  ],
  parti: [
    ['20:00', 'Kapılar açılıyor', 'Erken gelen ilk içeceği kapar.'],
    ['21:00', 'Kokteyl', 'İmza kokteyller ve atıştırmalıklar.'],
    ['22:00', 'DJ performansı', 'Pist açılıyor.'],
    ['00:00', 'Gece yarısı sürprizi', 'Saat on ikide ışıklara dikkat.']
  ],
  kurumsal: [
    ['09:00', 'Kayıt ve kahve', 'Yaka kartlarınızı girişten alabilirsiniz.'],
    ['10:00', 'Açılış konuşması', 'Yılın değerlendirmesi ve hedefler.'],
    ['11:00', 'Panel', 'İş ortaklarımızla yeni dönem.'],
    ['13:00', 'Öğle yemeği', 'Teras katında.']
  ]
};

const program = (kategori: string): TimelineEvent[] =>
  (PROGRAMLAR[kategori] ?? PROGRAMLAR.dugun).map(([time, title, description], i) => ({
    id: null,
    localKey: `oz-${i + 1}`,
    time,
    title,
    description
  }));

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
  /** Adresten tek tek ezilen alanlar; senaryonun üstüne uygulanır. */
  ezme?: Ezme;
}

/**
 * `ad=`, `tarih=`, `mekan=`, `baslik=`, `altmetin=`: verilen alan senaryonun değerini ezer, boş değer
 * alanı boşaltır (tek ad, boş tarih, silinmiş başlık). `harita=0` harita bağlantısını kaldırır.
 */
export interface Ezme {
  ad?: string;
  tarih?: string;
  mekan?: string;
  baslik?: string;
  altmetin?: string;
  harita?: false;
}

/**
 * Önizlemenin davetiyesi. Sihirbazın yaptığı gibi başlık kategorinin önerisinden gelir;
 * kişisel alanlar senaryoya göre dolar ya da boş kalır.
 */
export function senaryoKur({ kategori, senaryo, zarf, kapat, ezme }: SenaryoGirdisi): Invitation {
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
      timelineEvents: program(kategori),
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

  if (ezme?.ad !== undefined) davet = { ...davet, names: ezme.ad };
  if (ezme?.tarih !== undefined) davet = { ...davet, date: ezme.tarih, rsvpDeadline: ezme.tarih ? lcvSonGun(ezme.tarih) : '' };
  if (ezme?.mekan !== undefined) davet = { ...davet, venue: ezme.mekan };
  if (ezme?.baslik !== undefined) davet = { ...davet, title: ezme.baslik };
  if (ezme?.altmetin !== undefined) davet = { ...davet, subtitle: ezme.altmetin };
  if (ezme?.harita === false) davet = { ...davet, mapUrl: '' };
  return davet;
}
