import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';
import backgroundSky from './assets/dugun5-background.png';
import bottomMeadow from './assets/dugun5-bottom.png';
import { ease } from '../../../../utils/motion';

/**
 * Dugun5 — "Bahar Bahçesi": pastel gök ve çiçek çayırı; mersin yeşili
 * mürekkep, çiçeklerin şakayığı vurgu.
 *
 * Çayır artık hero'nun yüzdesi değil sabit bir bant: hero içerikle uzadığında
 * yüzde bir çayır da uzar ve metnin altına girerdi. İçeriğin alt padding'i
 * bandın yüksekliğini aşar; tarih ve sayaç çiçeklerin üstünde değil göğün
 * içinde okunur.
 */
export function Dugun5({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.Dugun5}
      renderHero={(props) => <KurdeleHero {...props} density="compact" />}
      heroContentClassName="pb-44 @md:pb-60"
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
              className="absolute bottom-0 left-0 w-full h-48 @md:h-64 object-cover object-bottom mix-blend-multiply select-none"
            />
          </div>
        </div>
      )}
    />
  );
}
