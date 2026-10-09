import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';
import backgroundWash from './assets/dugun4-background.png';
import floralArch from './assets/dugun4.png';
import { ease } from '../../../../utils/motion';

/**
 * Dugun4 — "Pembe Kemer": pembe suluboya zemin ve çiçekli kemer; metin
 * kemerin açıklığında, `compact` kurdele hero ile durur.
 *
 * Suluboya zemin hero'yu sıfıra sıfır kaplar; kemer görseli de object-cover
 * ile dikeyde/yatayda tam kaplar. Yoğun çiçek dokusunun üzerinde metin
 * okunabilsin diye görseller ile içerik arasına yukarıdan aşağıya yumuşayan
 * yarı saydam bir perde serilir.
 */
export function Dugun4({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.Dugun4}
      renderHero={(props) => <KurdeleHero {...props} density="compact" />}
      heroContentClassName="mx-auto w-full max-w-md"
      renderHeroBackground={({ revealed }) => (
        <div className="absolute inset-0">
          <img
            src={backgroundWash}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover z-0 select-none"
          />
          {/* Kemer, masaüstünde viewport'a yayılmasın diye içerik kolonuna
              (max-w-3xl) hizalanır; dar ekranlarda kolonu tamamen doldurur. */}
          <div className="absolute inset-0 max-w-3xl mx-auto z-10">
            <motion.img
              src={floralArch}
              alt=""
              draggable={false}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
              transition={{ duration: 1.8, ease: ease.out, delay: 0.2 }}
              className="w-full h-full object-cover object-bottom mix-blend-multiply select-none"
            />
          </div>
          {/* Okunabilirlik perdesi: üst/alt uçlarda güçlü, ortada hafif. */}
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-white/80 via-white/45 to-white/85" />
        </div>
      )}
    />
  );
}
