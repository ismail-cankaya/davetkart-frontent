import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';
import leftOrnament from './assets/dugun1-left.png';
import rightOrnament from './assets/dugun1-right.png';
import { ease } from '../../../../utils/motion';

/**
 * Dugun1 — "Zarif Çerçeve" teması: görsellerdeki suluboya paletine göre
 * yumuşak krem zemin, vizon metinler, gül kurusu vurgu ve altın detaylar.
 */
const DUGUN1_THEME: SectionTheme = {
  id: 'stone',
  base: 'theme-cormorant bg-[#faf8f5]',
  page: 'text-[#4a3e3d]',
  surface: 'bg-white/70 backdrop-blur-md',
  border: 'border-[#e7ddd1]',
  heading: 'text-[#3f332e]',
  body: 'text-[#8a776b]',
  accent: 'text-[#a4646f]',
  accentBg: 'bg-[#a4646f]',
  accentSoft: 'bg-[#a4646f]/10',
  input:
    'w-full bg-white/80 border border-[#e7ddd1] rounded-lg px-3.5 py-2.5 text-sm text-[#4a3e3d] placeholder:text-[#b5a698] focus:outline-none focus:border-[#a4646f] focus:ring-2 focus:ring-[#a4646f]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#4a3e3d] hover:bg-[#5f504c] text-[#faf6f0] shadow-lg shadow-[#4a3e3d]/15',
  buttonGhost:
    'border border-[#d9cbbb] text-[#6d5c51] hover:bg-[#f3ece3] hover:border-[#c5b3a0]',
  divider: 'bg-[#e7ddd1]',
  timelineLine: 'from-[#b08d57] via-[#cbb9a4]/60 to-transparent'
};

/**
 * Sol/sağ buket kolonları hero'nun dikey kenarlarını boydan boya kaplar
 * (h-full + object-contain: esneyip uzamazlar). Genişlikleri kök @container
 * ölçüsüne göre kademelenir: dar ekranda ince birer kenar aksanına inerler
 * (%14), genişledikçe %28'e kadar açılırlar; metin konteynerinin yatay
 * padding'i her kademede süs genişliğiyle eşleşir ki yazılar süslerin
 * üzerine binmesin. Masaüstünde süsler viewport kenarına değil, ortalanmış
 * max-w-4xl sarmalayıcıya yaslanır.
 */
export function Dugun1({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN1_THEME}
      summaryDensity="compact"
      heroContentClassName="mx-auto max-w-4xl px-[15%] @xl:px-[22%] @3xl:px-[25%]"
      renderHeroBackground={() => (
        <div className="relative h-full w-full max-w-4xl mx-auto">
          <motion.img
            src={leftOrnament}
            alt=""
            draggable={false}
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: ease.out, delay: 0.4 }}
            className="absolute left-0 top-0 h-full w-auto max-w-[14%] @xl:max-w-[21%] @3xl:max-w-[28%] object-contain object-left z-10 mix-blend-multiply select-none"
          />
          <motion.img
            src={rightOrnament}
            alt=""
            draggable={false}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: ease.out, delay: 0.4 }}
            className="absolute right-0 top-0 h-full w-auto max-w-[14%] @xl:max-w-[21%] @3xl:max-w-[28%] object-contain object-right z-10 mix-blend-multiply select-none"
          />
        </div>
      )}
    />
  );
}
