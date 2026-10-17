import { useEffect, useState } from 'react';

/**
 * Sergi'nin iki ailesi: Instrument Serif (duvar yazısı, adlar) ve Instrument
 * Sans (etiket, gövde, düğme). Türkçe glif denetimi:
 * docs/rehber/tasarim/SERGI-KONSEPTI.md §3.
 *
 * Genel `index.css` `@import`'una eklenmez; yalnızca sergi şablonu açılınca,
 * tek `<link>` ile yüklenir.
 */
export const BASLIK_YIGINI = '"Instrument Serif", "Cormorant Garamond", Georgia, serif';
export const GOVDE_YIGINI = '"Instrument Sans", Inter, ui-sans-serif, system-ui, sans-serif';

const KIMLIK = 'sg-fontlar';
const SORGU = 'family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400..700';

/** Fontları belgeye bir kez ekler; sunucu çiziminde hiçbir şey yapmaz. */
export function useSergiFontlari(): void {
  useEffect(() => {
    if (document.getElementById(KIMLIK)) return;
    const link = document.createElement('link');
    link.id = KIMLIK;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${SORGU}&display=swap`;
    document.head.appendChild(link);
  }, []);
}

/**
 * Duvar yazısının fontu hazır mı? Instrument Serif yedeğinden dar olduğu için
 * font gelince satır kırılımı değişir; büyük adlar bunu bekleyerek belirir.
 * Sınır dolunca yine `true` döner: yavaş ağda ad gizli kalmaz.
 */
export function useDuvarYazisiHazir(sinirMs = 400): boolean {
  const [hazir, setHazir] = useState(false);
  useEffect(() => {
    let iptal = false;
    const bitir = () => !iptal && setHazir(true);
    const zaman = window.setTimeout(bitir, sinirMs);
    if (document.fonts?.load) document.fonts.load('italic 48px "Instrument Serif"', 'ğşıİçöüÇÖŞĞÜ&').then(bitir, bitir);
    else bitir();
    return () => {
      iptal = true;
      window.clearTimeout(zaman);
    };
  }, [sinirMs]);
  return hazir;
}
