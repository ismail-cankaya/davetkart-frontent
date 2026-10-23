import React from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';

/**
 * Sayfa başları (`renderBackdrop`): açık bir kitabın iki sayfasının üst
 * kenarı gibi — solda kitabın adı (adlar, italik), sağda bölümün adı
 * (aralıklı büyük harf). Yalnızca geniş ekranda (kap ≥ 64 rem): orada metin
 * sütunu ortadadır ve iki yandaki boşluk sayfa kenarıdır; dar ekranda
 * bölümlerin üstüne binerdi.
 *
 * Kapak (hero) ekrandan çıkarken belirir: iç kapakta ve bez kapakta sayfa başı
 * olmaz. Bilgi tekrarıdır, `aria-hidden`.
 */
interface SayfaBasiProps {
  heroExit: MotionValue<number>;
  /** Sol sayfa başı — kullanıcının yazdığı biçimde (harf büyüklüğü değişmez). */
  sol: string;
  /** Sağ sayfa başı — şablonun kendi metni; büyük harfe çevrilir. */
  sag: string;
}

export function SayfaBasi({ heroExit, sol, sag }: SayfaBasiProps) {
  const opacity = useTransform(heroExit, [0.6, 1], [0, 1]);
  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="absolute inset-x-0 top-0 hidden items-baseline justify-between gap-8 px-12 pt-7 text-[#5E5446] @5xl:flex"
    >
      <span className="max-w-[15rem] text-[13px] italic leading-snug [text-wrap:balance]">{sol}</span>
      <span className="text-[11px] uppercase tracking-[0.3em]">{sag}</span>
    </motion.div>
  );
}
