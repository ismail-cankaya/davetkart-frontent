import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';
import topGarland from './assets/dugun2-top.png';
import bottomGarland from './assets/dugun2-buttom.png';
import { ease } from '../../../../utils/motion';

/**
 * Dugun2 — "Pastel Buket" teması: krem gül ve okaliptüs girlandlarına uygun
 * fildişi zemin, adaçayı yeşili vurgular ve sıcak toprak tonlu metinler.
 */
const DUGUN2_THEME: SectionTheme = {
  id: 'stone',
  base: 'theme-cormorant bg-[#fbfaf5]',
  page: 'text-[#45483c]',
  surface: 'bg-white/70 backdrop-blur-md',
  border: 'border-[#e4e5d8]',
  heading: 'text-[#3c4034]',
  body: 'text-[#84887a]',
  accent: 'text-[#7d8b6a]',
  accentBg: 'bg-[#7d8b6a]',
  accentSoft: 'bg-[#7d8b6a]/10',
  input:
    'w-full bg-white/80 border border-[#e4e5d8] rounded-lg px-3.5 py-2.5 text-sm text-[#45483c] placeholder:text-[#adb0a0] focus:outline-none focus:border-[#7d8b6a] focus:ring-2 focus:ring-[#7d8b6a]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#4a5540] hover:bg-[#5d6a50] text-[#f7f6ee] shadow-lg shadow-[#4a5540]/15',
  buttonGhost:
    'border border-[#cdd0bd] text-[#606453] hover:bg-[#f1f1e6] hover:border-[#b4b8a1]',
  divider: 'bg-[#e4e5d8]',
  timelineLine: 'from-[#7d8b6a] via-[#aeb798]/60 to-transparent'
};

/**
 * Üst/alt girlandlar hero (Summary) ekranını dikeyde çerçeveler; ölçüler
 * kapsayıcıya göre yüzdeliktir ve masaüstünde max-w-3xl sarmalayıcıyla
 * sınırlanır — süsler tarayıcının uç kenarlarına kaçmaz.
 */
export function Dugun2({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN2_THEME}
      renderHeroBackground={() => (
        <div className="relative h-full w-full max-w-3xl mx-auto">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[72%] max-w-[430px]">
            <motion.img
              src={topGarland}
              alt=""
              draggable={false}
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: ease.out, delay: 0.4 }}
              className="w-full h-auto mix-blend-multiply select-none"
            />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[72%] max-w-[430px]">
            <motion.img
              src={bottomGarland}
              alt=""
              draggable={false}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: ease.out, delay: 0.4 }}
              className="w-full h-auto mix-blend-multiply select-none"
            />
          </div>
        </div>
      )}
    />
  );
}
