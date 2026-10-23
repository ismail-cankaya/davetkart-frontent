import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useScroll } from 'motion/react';
import { HARITA_SURE } from './hareket';
import { haritaFontlari, haritaFontlariHazir } from './fontlar';
import { PERDE_DISARIDA, useHaritaBaglami } from './baglam';

/**
 * Harita kapaklarının (`HaritaKapak`, `IzKapak`) ortak zamanlaması. Kapak
 * kutuları ölçüp rotayı onlardan kurar; bunun için üç şey gerekir: fontların
 * gelişini beklemek, giriş penceresinin kapandığını bilmek ve kapağın alt
 * kenarını arkadaki sahneye (perde) bildirmek. Kılavuz: kapakOrtak.md.
 */

/** Sunucu çiziminde `useLayoutEffect` uyarı verir; orada `useEffect`. */
export const useOlcumEtkisi = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export const simdi = () => (typeof performance === 'undefined' ? 0 : performance.now());

/**
 * Kapağın giriş penceresi (`HARITA_SURE.ust`) kapandı mı? Kapandıktan sonra
 * doğan öğe (döndürme, yeniden kurulan plan) oynamaz, yerinde belirir.
 */
export function useGirisPenceresi(): boolean {
  const [bitti, setBitti] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setBitti(true), HARITA_SURE.ust * 1000);
    return () => window.clearTimeout(id);
  }, []);
  return bitti;
}

/**
 * Harita katmanı fontları bekler (en çok `fontBekleme`). `kayma`: katmanın
 * kapaktan kaç saniye sonra açıldığı — çizelge kalan pencereye sıkışır
 * (`useHaritaHareketi`'nin `olcek`'i), `esnek`'i aşarsa hiç oynamaz.
 */
export function useKatmanFontu(): { hazir: boolean; kayma: number } {
  const [t0] = useState(simdi);
  const [fontlar, setFontlar] = useState<{ hazir: boolean; kayma: number }>(() => ({ hazir: haritaFontlariHazir(), kayma: 0 }));
  useEffect(() => {
    if (fontlar.hazir) return;
    let bitti = false;
    const ac = () => {
      if (bitti) return;
      bitti = true;
      setFontlar({ hazir: true, kayma: (simdi() - t0) / 1000 });
    };
    const id = window.setTimeout(ac, HARITA_SURE.fontBekleme * 1000);
    haritaFontlari().then(ac);
    return () => {
      bitti = true;
      window.clearTimeout(id);
    };
  }, [fontlar.hazir, t0]);
  return fontlar;
}

/**
 * Kapağın alt kenarının ekrandaki yerini sahneye yazar: perde tam oradan
 * başlar (bkz. `baglam.ts`). `boy` değişince (kapak uzadı) yeniden yazar.
 */
export function useKapakAltiBildirimi(
  kokRef: React.RefObject<HTMLElement | null>,
  scrollContainer: React.RefObject<HTMLDivElement | null> | undefined,
  boy: number
): void {
  const baglam = useHaritaBaglami();
  const { scrollY } = useScroll({ container: scrollContainer });
  useEffect(() => {
    if (!baglam) return;
    const yaz = () => {
      const kok = kokRef.current;
      baglam.kapakAlti.set(Math.max(0, (kok ? kok.offsetTop + kok.offsetHeight : 0) - scrollY.get()));
    };
    yaz();
    const birak = scrollY.on('change', yaz);
    return () => {
      birak();
      baglam.kapakAlti.set(PERDE_DISARIDA);
    };
  }, [baglam, scrollY, boy, kokRef]);
}
