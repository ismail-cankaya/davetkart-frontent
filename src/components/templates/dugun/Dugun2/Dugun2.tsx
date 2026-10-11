import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';
import topGarland from './assets/dugun2-top.png';
import bottomGarland from './assets/dugun2-buttom.png';
import { ease } from '../../../../utils/motion';

/**
 * Dugun2 — "Pastel Buket": krem gül ve okaliptüs girlandları; kategorinin
 * botanik kolu olarak vurgu şakayık değil mersin yeşili.
 *
 * Üst/alt girlandlar hero ekranını dikeyde çerçeveler; ölçüler kapsayıcıya
 * göre yüzdeliktir ve masaüstünde max-w-3xl sarmalayıcıyla sınırlanır.
 * Hero'nun dikey padding'i girland yüksekliği kadar açılır ki kurdele
 * düğümü ve sayaç yaprakların altına girmesin.
 */
export function Dugun2({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.Dugun2}
      renderHero={(props) => <KurdeleHero {...props} />}
      heroContentClassName="pt-14 pb-12 @md:pt-24 @md:pb-20"
      renderHeroBackground={({ revealed }) => (
        <div className="relative h-full w-full max-w-3xl mx-auto">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[72%] max-w-[430px]">
            <motion.img
              src={topGarland}
              alt=""
              draggable={false}
              initial={{ opacity: 0, y: -24 }}
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
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
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 1.5, ease: ease.out, delay: 0.4 }}
              className="w-full h-auto mix-blend-multiply select-none"
            />
          </div>
        </div>
      )}
    />
  );
}
