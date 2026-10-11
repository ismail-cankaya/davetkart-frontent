import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';
import topRightLily from './assets/dugun3-top-right.png';
import bottomBouquet from './assets/dugun3-bottom.png';
import { ease } from '../../../../utils/motion';

/**
 * Dugun3 — "Bordo Zambak": dramatik zambakların koyu şakayığı, tül zemin.
 *
 * Asimetrik çerçeve: tek zambak sağ üst köşede, buket sol alt köşede —
 * ikisi de yalnızca hero ekranında. Ölçüler kapsayıcıya göre yüzdeliktir;
 * masaüstünde max-w-4xl sarmalayıcıya yaslanırlar.
 */
export function Dugun3({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.Dugun3}
      renderHero={(props) => <KurdeleHero {...props} />}
      heroContentClassName="pb-10 @md:pb-16"
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
