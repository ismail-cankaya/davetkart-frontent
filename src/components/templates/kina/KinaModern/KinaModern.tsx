import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { Grain } from '../../shared/effects';
import { ease } from '../../../../utils/motion';
import { KINA_MODERN } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { KinaHero } from '../parts/KinaHero';
import { DAMGA_AL, KinaDamga } from '../parts/KinaDamga';
import { TemplateProps } from '../../types';

/**
 * KinaModern — "Kına Turuncusu": zemin kınanın kendisi. Köşeden taşan dev
 * krem leke, kahve mürekkep halkası ve sola yaslı iri adlarla afiş düzeni.
 */
export function KinaModern({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_MODERN}
      renderHero={(props) => <KinaHero {...props} align="start" damga={DAMGA_AL} flame="#fff1d6" />}
      renderHeroBackground={({ revealed }) => (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #f29c64 0%, #ec8f57 48%, #e27d43 100%)' }}
        >
          <motion.div
            className="absolute -top-[16%] -right-[46%] w-[118%] @md:w-[62%] @md:-right-[14%] aspect-square"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={revealed ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
            transition={{ duration: 1.6, ease: ease.out }}
          >
            <KinaDamga colors={['#fff8ef', '#fdeadb', '#f6d3b4']} className="w-full h-full" />
          </motion.div>
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="absolute -bottom-[14%] -left-[30%] w-[86%] @md:w-[40%] @md:-left-[10%] aspect-square"
          >
            <circle cx="50" cy="50" r="46" fill="none" stroke="#260a04" strokeOpacity="0.28" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#260a04" strokeOpacity="0.16" strokeWidth="0.5" strokeDasharray="1 2.4" />
          </svg>
          <Grain opacity={0.05} />
        </div>
      )}
    />
  );
}
