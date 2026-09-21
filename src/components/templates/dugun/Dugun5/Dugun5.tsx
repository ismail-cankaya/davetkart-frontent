import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';
import backgroundSky from './assets/dugun5-background.png';
import bottomMeadow from './assets/dugun5-bottom.png';
import { ease } from '../../../../utils/motion';

/**
 * Dugun5 — "Bahar Bahçesi" teması: bulutlu pastel gök ve çiçek çayırına uygun
 * açık adaçayı zemin, çam yeşili başlıklar ve pudra pembesi vurgular.
 */
const DUGUN5_THEME: SectionTheme = {
  id: 'stone',
  base: 'theme-cormorant bg-[#f4f7f0]',
  page: 'text-[#42513f]',
  surface: 'bg-white/70 backdrop-blur-md',
  border: 'border-[#dfe6d9]',
  heading: 'text-[#39503f]',
  body: 'text-[#78877a]',
  accent: 'text-[#bb7f8d]',
  accentBg: 'bg-[#bb7f8d]',
  accentSoft: 'bg-[#bb7f8d]/10',
  input:
    'w-full bg-white/80 border border-[#dfe6d9] rounded-lg px-3.5 py-2.5 text-sm text-[#42513f] placeholder:text-[#a9b5a3] focus:outline-none focus:border-[#7fa08a] focus:ring-2 focus:ring-[#7fa08a]/20 transition duration-300',
  buttonPrimary:
    'bg-[#3d5245] hover:bg-[#4c6555] text-[#f2f5ee] shadow-lg shadow-[#3d5245]/15',
  buttonGhost:
    'border border-[#c3cfbc] text-[#556353] hover:bg-[#ebf0e5] hover:border-[#a8b8a0]',
  divider: 'bg-[#dfe6d9]',
  timelineLine: 'from-[#7fa08a] via-[#a9c0ae]/60 to-transparent'
};

/**
 * Gök görseli hero'yu tamamen kaplar; çiçek çayırı alt kenara oturur.
 * Çayır yüksekliği hero'nun %42'siyle sınırlanır ve object-cover ile alt
 * kenardan hizalanır — metin alanına taşmaz, çiçek bandı daima görünür.
 */
export function Dugun5({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN5_THEME}
      renderHeroBackground={({ revealed }) => (
        <div className="absolute inset-0">
          <img
            src={backgroundSky}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover select-none"
          />
          <div className="relative h-full w-full max-w-4xl mx-auto">
            <motion.img
              src={bottomMeadow}
              alt=""
              draggable={false}
              initial={{ opacity: 0, y: 36 }}
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
              transition={{ duration: 1.6, ease: ease.out, delay: 0.3 }}
              className="absolute bottom-0 left-0 w-full h-[42%] object-cover object-bottom mix-blend-multiply select-none"
            />
          </div>
        </div>
      )}
    />
  );
}
