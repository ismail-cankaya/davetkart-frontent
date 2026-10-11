import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';
import leftOrnament from './assets/dugun1-left.png';
import rightOrnament from './assets/dugun1-right.png';
import { ease } from '../../../../utils/motion';

/**
 * Dugun1 — "Zarif Çerçeve": suluboya buket kolonları arasında kurdele hero.
 *
 * Sol/sağ buket kolonları hero'nun dikey kenarlarını boydan boya kaplar
 * (h-full + object-contain: esneyip uzamazlar). Genişlikleri kök @container
 * ölçüsüne göre kademelenir: dar ekranda ince birer kenar aksanına inerler
 * (%14), genişledikçe %28'e kadar açılırlar; metin konteynerinin yatay
 * padding'i her kademede süs genişliğiyle eşleşir ki yazılar süslerin
 * üzerine binmesin. Dar kolon yüzünden hero `compact` yoğunluktadır.
 */
export function Dugun1({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.Dugun1}
      renderHero={(props) => <KurdeleHero {...props} density="compact" />}
      heroContentClassName="mx-auto max-w-4xl px-[15%] @xl:px-[22%] @3xl:px-[25%]"
      renderHeroBackground={({ revealed }) => (
        <div className="relative h-full w-full max-w-4xl mx-auto">
          <motion.img
            src={leftOrnament}
            alt=""
            draggable={false}
            initial={{ opacity: 0, x: -28 }}
            animate={revealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }}
            transition={{ duration: 1.5, ease: ease.out, delay: 0.4 }}
            className="absolute left-0 top-0 h-full w-auto max-w-[14%] @xl:max-w-[21%] @3xl:max-w-[28%] object-contain object-left z-10 mix-blend-multiply select-none"
          />
          <motion.img
            src={rightOrnament}
            alt=""
            draggable={false}
            initial={{ opacity: 0, x: 28 }}
            animate={revealed ? { opacity: 1, x: 0 } : { opacity: 0, x: 28 }}
            transition={{ duration: 1.5, ease: ease.out, delay: 0.4 }}
            className="absolute right-0 top-0 h-full w-auto max-w-[14%] @xl:max-w-[21%] @3xl:max-w-[28%] object-contain object-right z-10 mix-blend-multiply select-none"
          />
        </div>
      )}
    />
  );
}
