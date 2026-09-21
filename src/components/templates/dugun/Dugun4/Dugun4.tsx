import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';
import backgroundWash from './assets/dugun4-background.png';
import floralArch from './assets/dugun4.png';
import { ease } from '../../../../utils/motion';

/**
 * Dugun4 — "Pembe Kemer" teması: pembe suluboya zemin ve çiçekli kemer
 * sahnesine uygun toz pembe zemin, gül ahşabı başlıklar ve gül vurguları.
 */
const DUGUN4_THEME: SectionTheme = {
  id: 'stone',
  base: 'theme-cormorant bg-[#fdf4f5]',
  page: 'text-[#5c3140]',
  surface: 'bg-white/75 backdrop-blur-md',
  border: 'border-[#f2dde2]',
  heading: 'text-[#5c3140]',
  body: 'text-[#9b7280]',
  accent: 'text-[#c26d85]',
  accentBg: 'bg-[#c26d85]',
  accentSoft: 'bg-[#c26d85]/10',
  input:
    'w-full bg-white/80 border border-[#f2dde2] rounded-lg px-3.5 py-2.5 text-sm text-[#5c3140] placeholder:text-[#d3a9b4] focus:outline-none focus:border-[#c26d85] focus:ring-2 focus:ring-[#c26d85]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#a54d68] hover:bg-[#b95d79] text-white shadow-lg shadow-[#a54d68]/20',
  buttonGhost:
    'border border-[#e6c4cd] text-[#8e5468] hover:bg-[#f9e9ed] hover:border-[#d6a4b1]',
  divider: 'bg-[#f2dde2]',
  timelineLine: 'from-[#c26d85] via-[#dfa8b8]/60 to-transparent'
};

/**
 * Suluboya zemin hero'yu sıfıra sıfır kaplar; kemer görseli de object-cover
 * ile dikeyde/yatayda tam kaplar (üstte boşluk kalmaz, gerekirse kenarlardan
 * kırpılır — sütunlar zaten kenarlarda olduğundan kayıp dekoratiftir).
 * Yoğun çiçek dokusunun üzerinde metin okunabilsin diye görseller ile içerik
 * arasına yukarıdan aşağıya yumuşayan yarı saydam bir perde serilir; metin
 * kutusu böylece kemer açıklığına sıkışmak zorunda kalmadan genişler.
 */
export function Dugun4({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN4_THEME}
      summaryDensity="compact"
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
          {/* Okunabilirlik perdesi: üst/alt uçlarda güçlü, ortada hafif —
              çiçek dokusu görünür kalırken metin kontrastı garanti edilir. */}
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-white/80 via-white/40 to-white/85" />
        </div>
      )}
    />
  );
}
