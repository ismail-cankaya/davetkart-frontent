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

/** Etki içinde çalışır: sunucu çiziminde hiçbir şey yapmaz, ilk boyamayı bekletmez. */
export function useHaritaFontlari(): void {
  useEffect(() => {
    if (document.getElementById(KIMLIK)) return;
    const link = document.createElement('link');
    link.id = KIMLIK;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${SORGU}`;
    document.head.appendChild(link);
  }, []);
}
