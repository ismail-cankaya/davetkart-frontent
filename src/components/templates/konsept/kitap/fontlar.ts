import { useEffect, useState } from 'react';

/**
 * Kitap konseptinin iki ailesi (font denetimi: KITAP-KONSEPTI §3).
 *
 * 🔴 Genel `index.css` `@import`'una eklenmez: oradaki her aile ana sayfa ve
 * panel dahil her sayfaya iner. Burada yalnızca kitap şablonu açıldığında,
 * iki aile tek `<link>` ile istenir.
 */

/** Kapak başlığı, bölüm başlığı, başharf. Yalnızca ≥ 32 px. */
export const BASLIK_YIGINI = '"Libre Caslon Display", "Libre Caslon Text", Georgia, serif';

/** Gövde, adlar (iç sayfa), italik, etiketler. */
export const METIN_YIGINI = '"Libre Caslon Text", Georgia, serif';

const BAGLANTI_ID = 'kt-font';
const ADRES =
  'https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&display=swap';

/** Stil dosyasının yüklenmesi; ikinci şablon aynı sözü bekler. */
let stilYuklendi: Promise<void> | null = null;

function stilEkle(): Promise<void> {
  if (stilYuklendi) return stilYuklendi;
  stilYuklendi = new Promise<void>((coz) => {
    const var_ = document.getElementById(BAGLANTI_ID) as HTMLLinkElement | null;
    if (var_) {
      coz();
      return;
    }
    const link = document.createElement('link');
    link.id = BAGLANTI_ID;
    link.rel = 'stylesheet';
    link.href = ADRES;
    link.onload = () => coz();
    link.onerror = () => coz();
    document.head.appendChild(link);
  });
  return stilYuklendi;
}

/**
 * Fontları belgeye bir kez ekler. Etki içinde çalışır: sunucu çiziminde
 * (verify:render) hiçbir şey yapmaz; `display=swap` ile metin önce yedek
 * fontla görünür.
 */
export function useKitapFontlari(): void {
  useEffect(() => {
    void stilEkle();
  }, []);
}

/**
 * Başlık fontu hazır mı? Adlar Georgia'dan Caslon Display'e geçerken satır
 * boyu değişir; hero girişini buna bağlamak kaymayı gizler. Sınır dolunca
 * (varsayılan 400 ms) yine `true` döner — 0.5 s'lik girişle birlikte içerik
 * 1 s'yi geçmeden görünür.
 */
export function useBaslikFontuHazir(sinirMs = 400): boolean {
  const [hazir, setHazir] = useState(false);
  useEffect(() => {
    let iptal = false;
    const bitir = () => !iptal && setHazir(true);
    const zaman = window.setTimeout(bitir, sinirMs);
    stilEkle()
      .then(() => document.fonts.load('40px "Libre Caslon Display"', 'ĞŞİığşçöü&'))
      .then(bitir, bitir);
    return () => {
      iptal = true;
      window.clearTimeout(zaman);
    };
  }, [sinirMs]);
  return hazir;
}
