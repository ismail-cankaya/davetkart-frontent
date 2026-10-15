import { useEffect, useState } from 'react';

/**
 * Kâğıt ailesinin yazıları. Seçim, Türkçe glif denetiminden geçenler
 * arasından yapıldı (docs/rehber/tasarim/KAGIT-KONSEPTI.md §3).
 *
 * 🔴 Fontlar `index.css`'teki genel `@import`'a eklenmedi: oraya eklenen her
 * aile ana sayfa ve panel dahil her sayfaya iner. Burada yalnızca kâğıt
 * şablonu açıldığında, yalnızca o şablonun kullandığı aile yüklenir.
 * Cormorant Garamond zaten genel olarak yüklü; tekrar istenmez.
 */

/** Adlarda kullanılan el yazıları. Gövdede ve küçük metinde KULLANILMAZ. */
export const EL_YAZILARI = {
  /** Resmî bakır gravür kaligrafisi. Yalnızca ≥ 28 px adlar. */
  pinyon: { aile: 'Pinyon Script', sorgu: 'Pinyon+Script', yigin: '"Pinyon Script", "Cormorant Garamond", Georgia, serif' },
  /** Fırça kaligrafisi; ince–kalın karşıtlığı yüksek, küçükte daha okunur. */
  'alex-brush': { aile: 'Alex Brush', sorgu: 'Alex+Brush', yigin: '"Alex Brush", "Cormorant Garamond", Georgia, serif' },
  /** Gündelik el yazısı (not kâğıdı, kraft). ≥ 20 px. */
  caveat: { aile: 'Caveat', sorgu: 'Caveat:wght@400..600', yigin: 'Caveat, "Cormorant Garamond", Georgia, serif' }
} as const;

export type ElYazisi = keyof typeof EL_YAZILARI;

/** Gövde: küçük boyda okunaklı, gerçek küçük büyük harfi (smcp) olan serif. */
export const GOVDE_YIGINI = '"EB Garamond", "Cormorant Garamond", Georgia, serif';
const GOVDE_SORGU = 'EB+Garamond:ital,wght@0,400..600;1,400..500';

/** Ara başlık: genel olarak zaten yüklü olan Cormorant Garamond. */
export const BASLIK_YIGINI = '"Cormorant Garamond", "EB Garamond", Georgia, serif';

function stilYukle(id: string, sorgu: string): void {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${sorgu}&display=swap`;
  document.head.appendChild(link);
}

/**
 * Şablonun fontlarını belgeye bir kez ekler. Etki içinde çalışır: sunucu
 * çiziminde (verify:render) hiçbir şey yapmaz ve ilk boyamayı bekletmez —
 * `display=swap` ile metin önce yedek fontla görünür.
 */
export function useKagitFontlari(el?: ElYazisi): void {
  useEffect(() => {
    stilYukle('kg-font-govde', GOVDE_SORGU);
    if (el) stilYukle(`kg-font-${el}`, EL_YAZILARI[el].sorgu);
  }, [el]);
}

/**
 * El yazısı hazır mı? Adlar yedek fonttan el yazısına geçerken satır
 * uzunluğu değişir; hero adları bunu bekleyerek gösterebilir. Sınır dolunca
 * (varsayılan 700 ms) yine `true` döner: yavaş ağda ad hiç gizli kalmaz.
 */
export function useElYazisiHazir(el: ElYazisi | undefined, sinirMs = 700): boolean {
  const [hazir, setHazir] = useState(!el);
  useEffect(() => {
    if (!el) return;
    let iptal = false;
    const bitir = () => !iptal && setHazir(true);
    const zaman = window.setTimeout(bitir, sinirMs);
    document.fonts.load(`32px "${EL_YAZILARI[el].aile}"`, 'ğşıİçöüÇÖŞĞÜ').then(bitir, bitir);
    return () => {
      iptal = true;
      window.clearTimeout(zaman);
    };
  }, [el, sinirMs]);
  return hazir;
}
