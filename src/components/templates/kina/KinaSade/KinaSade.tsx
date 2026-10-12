import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { ease } from '../../../../utils/motion';
import { KINA_SADE } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { KinaHero } from '../parts/KinaHero';
import { KinaDamga } from '../parts/KinaDamga';
import { BindalliKose } from '../parts/BindalliDal';
import { TemplateProps } from '../../types';

/**
 * KinaSade — "Avuç İçi": şeftali kâğıt üstünde köşeden taşan iki soluk kına
 * lekesi ve iki bindallı köşesi. Kategorinin en sakin, açık şablonu.
 */
export function KinaSade({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_SADE}
      renderHero={(props) => <KinaHero {...props} />}
      renderHeroBackground={({ revealed }) => (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ background: 'radial-gradient(120% 80% at 50% 32%, #fcf4ec 0%, #f8ebdf 55%, #efd8c4 100%)' }}
        >
          {/* Lekeler zarf açılınca ortadan yayılır: kına "yakılır". */}
          <motion.div
            className="absolute -top-[10%] -right-[30%] w-[86%] @md:w-[48%] @md:-right-[12%] aspect-square opacity-[0.13]"
            initial={{ scale: 0.55, opacity: 0 }}
            animate={revealed ? { scale: 1, opacity: 0.13 } : { scale: 0.55, opacity: 0 }}
            transition={{ duration: 1.8, ease: ease.out }}
          >
            <KinaDamga className="w-full h-full" />
          </motion.div>
          <motion.div
            className="absolute -bottom-[9%] -left-[18%] w-[46%] @md:w-[24%] aspect-square opacity-[0.11]"
            initial={{ scale: 0.55, opacity: 0 }}
            animate={revealed ? { scale: 1, opacity: 0.11 } : { scale: 0.55, opacity: 0 }}
            transition={{ duration: 1.8, ease: ease.out, delay: 0.3 }}
          >
            <KinaDamga className="w-full h-full" />
          </motion.div>
          <BindalliKose className="absolute top-3 left-3 w-24 @md:w-36 h-auto text-[#c4581d]/55" />
          <BindalliKose className="absolute bottom-3 right-3 w-24 @md:w-36 h-auto rotate-180 text-[#c4581d]/55" />
        </div>
      )}
    />
  );
}
