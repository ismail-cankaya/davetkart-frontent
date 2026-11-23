import { useEffect, useState } from 'react';
import { loadTemplateFonts } from '../../../../utils/templateFonts';

/**
 * Sergi'nin iki ailesi: Instrument Serif (duvar yazısı, adlar) ve Instrument
 * Sans (etiket, gövde, düğme). Türkçe glif denetimi:
 * docs/rehber/tasarim/SERGI-KONSEPTI.md §3.
 *
 * Genel `index.css` `@import`'una eklenmez; yalnızca sergi şablonu açılınca,
 * yerel `/fonts/templates.css` ile yüklenir (SEC-12).
 */
export const BASLIK_YIGINI = '"Instrument Serif", "Cormorant Garamond", Georgia, serif';
export const GOVDE_YIGINI = '"Instrument Sans", Inter, ui-sans-serif, system-ui, sans-serif';

/** Fontları belgeye bir kez ekler; sunucu çiziminde hiçbir şey yapmaz. */
export function useSergiFontlari(): void {
  useEffect(() => {
    void loadTemplateFonts();
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
