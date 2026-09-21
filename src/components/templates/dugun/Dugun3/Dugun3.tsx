import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';
import topRightLily from './assets/dugun3-top-right.png';
import bottomBouquet from './assets/dugun3-bottom.png';
import { ease } from '../../../../utils/motion';

/**
 * Dugun3 — "Bordo Zambak" teması: dramatik bordo zambaklara uygun porselen
 * zemin, derin bordo vurgular ve sıcak vizon metinler.
 */
const DUGUN3_THEME: SectionTheme = {
  id: 'stone',
  base: 'theme-cormorant bg-[#faf6f3]',
  page: 'text-[#4b3a3e]',
  surface: 'bg-white/70 backdrop-blur-md',
  border: 'border-[#ecdfda]',
  heading: 'text-[#452430]',
  body: 'text-[#93797d]',
  accent: 'text-[#8a3b4d]',
  accentBg: 'bg-[#8a3b4d]',
  accentSoft: 'bg-[#8a3b4d]/10',
  input:
    'w-full bg-white/80 border border-[#ecdfda] rounded-lg px-3.5 py-2.5 text-sm text-[#4b3a3e] placeholder:text-[#c0a8ab] focus:outline-none focus:border-[#8a3b4d] focus:ring-2 focus:ring-[#8a3b4d]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#54263a] hover:bg-[#6b3049] text-[#faf3ef] shadow-lg shadow-[#54263a]/20',
  buttonGhost:
    'border border-[#dcc5c8] text-[#6e4a52] hover:bg-[#f4e9e7] hover:border-[#c9a7ac]',
  divider: 'bg-[#ecdfda]',
  timelineLine: 'from-[#8a3b4d] via-[#b98a94]/60 to-transparent'
};

/**
 * Asimetrik çerçeve: tek zambak sağ üst köşede, buket sol alt köşede —
 * ikisi de yalnızca hero (Summary) ekranında. Ölçüler kapsayıcıya göre
 * yüzdeliktir; masaüstünde max-w-4xl sarmalayıcıya yaslanırlar.
 */
export function Dugun3({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN3_THEME}
      renderHeroBackground={({ revealed }) => (
        <div className="relative h-full w-full max-w-4xl mx-auto">
          <div className="absolute top-0 right-0 w-[36%] max-w-[240px]">
            <motion.img
              src={topRightLily}
              alt=""
              draggable={false}
              initial={{ opacity: 0, x: 24, rotate: 6 }}
              animate={revealed ? { opacity: 1, x: 0, rotate: 0 } : { opacity: 0, x: 24, rotate: 6 }}
              transition={{ duration: 1.6, ease: ease.out, delay: 0.4 }}
              className="w-full h-auto mix-blend-multiply select-none"
            />
          </div>
          <div className="absolute bottom-0 left-0 w-[62%] max-w-[420px]">
            <motion.img
              src={bottomBouquet}
              alt=""
              draggable={false}
              initial={{ opacity: 0, y: 28 }}
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ duration: 1.6, ease: ease.out, delay: 0.55 }}
              className="w-full h-auto mix-blend-multiply select-none"
            />
          </div>
        </div>
      )}
    />
  );
}
