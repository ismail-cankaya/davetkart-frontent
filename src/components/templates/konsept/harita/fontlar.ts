import { useEffect } from 'react';

/**
 * Haritanın üç yazısı (font denetimi: docs/rehber/tasarim/font-denetimi/harita.png).
 * Genel `index.css`'e eklenmez; şablon açılınca tek `<link>` ile yüklenir.
 */
export const HARITA_YAZI = {
  /** Harita etiketleri, üst etiket, lejant başlığı. */
  etiket: '"Barlow Condensed", "Barlow Semi Condensed", "Arial Narrow", sans-serif',
  /** Gövde, lejant satırları, form, düğme. */
  govde: '"Barlow Semi Condensed", "Arial Narrow", system-ui, sans-serif',
  /** Kartuştaki adlar, su adları, bölüm başlıkları — yalnızca italik. */
  italik: 'Newsreader, Georgia, "Times New Roman", serif'
} as const;

const SORGU =
  'family=Barlow+Condensed:wght@400;600' +
  '&family=Barlow+Semi+Condensed:wght@400;500' +
  '&family=Newsreader:ital,opsz,wght@1,6..72,400..600' +
  '&display=swap';

const KIMLIK = 'hr-font';

/**
 * Kapağın kutularının boyunu belirleyen yüzler. `document.fonts.load` yalnızca
 * örnek metnin karakterlerini kapsayan alt kümeyi indirir; örnek Türkçe harfleri
 * içerir ki latin-ext alt kümesi de gelsin ("Gülşen İrem").
 */
const YUZLER = ['600 15px "Barlow Condensed"', '400 15px "Barlow Semi Condensed"', '500 15px "Barlow Semi Condensed"', 'italic 500 40px Newsreader'];
const ORNEK = 'Aa09 ÇçĞğİıÖöŞşÜü&';

let bitti = false;
let soz: Promise<void> | null = null;

function baglanti(): HTMLLinkElement {
  const mevcut = document.getElementById(KIMLIK);
  if (mevcut instanceof HTMLLinkElement) return mevcut;
  const link = document.createElement('link');
  link.id = KIMLIK;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${SORGU}`;
  document.head.appendChild(link);
  return link;
}

/**
 * Fontları yükler; stil sayfası VE kapağın yüzleri inince çözülür. Stil sayfası
 * gelmeden `document.fonts.load` eşleşen yüz bulamaz ve hemen döner — bu yüzden
 * önce bağlantının `load` olayı beklenir. Hata (çevrimdışı) da "bitti" sayılır:
 * bekleyen kapak yedek fontla çizer. Sunucuda hemen çözülür.
 */
export function haritaFontlari(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  if (soz) return soz;
  soz = new Promise<void>((coz) => {
    const son = () => {
      bitti = true;
      coz();
    };
    const link = baglanti();
    const yuzler = () => {
      if (!document.fonts?.load) return son();
      Promise.all(YUZLER.map((f) => document.fonts.load(f, ORNEK))).then(son, son);
    };
    if (link.sheet) yuzler();
    else {
      link.addEventListener('load', yuzler, { once: true });
      link.addEventListener('error', son, { once: true });
    }
  });
  return soz;
}

/** Fontlar bu sayfada daha önce yüklendi mi (ör. zarf açılırken)? Kapak o zaman beklemeden ölçer. */
export function haritaFontlariHazir(): boolean {
  return bitti;
}

/** Etki içinde çalışır: sunucu çiziminde hiçbir şey yapmaz, ilk boyamayı bekletmez. */
export function useHaritaFontlari(): void {
  useEffect(() => {
    void haritaFontlari();
  }, []);
}
