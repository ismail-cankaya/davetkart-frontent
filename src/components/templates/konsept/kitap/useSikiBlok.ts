import { useLayoutEffect, type RefObject } from 'react';

/**
 * Sola yaslı bir paragrafı en uzun satırının genişliğine daraltır; ortalı bir
 * sütunda blok böylece gerçekten ortada durur.
 *
 * Neden: CSS `fit-content` kaydırılmış metni en uzun satıra göre sarmaz —
 * kutu `max-width`'te kalır, satırların sağında boşluk birikir ve sola yaslı
 * blok ortalı başlıkların altında sola kayar (1280 px'te ~45 px). Ölçüm
 * çizimden önce yapılır (`useLayoutEffect`); sunucu çiziminde ve ölçümden
 * önce kutu `w-fit` + `max-width` ile kalır.
 *
 * Yeniden ölçer: metin değişince, kabın GENİŞLİĞİ değişince (yükseklik
 * değişimi döngü kurardı) ve bir font yüklenince (`display=swap` sonrası
 * satır uzunluğu değişir).
 */
export function useSikiBlok(ref: RefObject<HTMLElement | null>, metin: string): void {
  useLayoutEffect(() => {
    const el = ref.current;
    const ust = el?.parentElement;
    if (!el || !ust || typeof ResizeObserver === 'undefined') return;

    const olc = () => {
      el.style.width = '';
      const kutu = el.getBoundingClientRect();
      const aralik = document.createRange();
      aralik.selectNodeContents(el);
      let sag = kutu.left;
      for (const r of aralik.getClientRects()) if (r.width > 0) sag = Math.max(sag, r.right);
      // Giriş hareketi ölçek taşıyabilir (0.98 → 1): ekran pikseli CSS pikseline çevrilir.
      const olcek = el.offsetWidth ? kutu.width / el.offsetWidth : 1;
      const gen = Math.ceil((sag - kutu.left) / olcek) + 1;
      if (gen > 1 && gen < el.offsetWidth - 1) el.style.width = `${gen}px`;
    };

    olc();
    let sonGenislik = ust.clientWidth;
    const gozlem = new ResizeObserver(() => {
      if (ust.clientWidth === sonGenislik) return;
      sonGenislik = ust.clientWidth;
      olc();
    });
    gozlem.observe(ust);
    const fontlar = document.fonts;
    fontlar?.addEventListener?.('loadingdone', olc);
    return () => {
      gozlem.disconnect();
      fontlar?.removeEventListener?.('loadingdone', olc);
      el.style.width = '';
    };
  }, [ref, metin]);
}
