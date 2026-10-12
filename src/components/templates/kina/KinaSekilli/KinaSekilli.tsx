import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { GoldSheen } from '../../shared/effects';
import { ease } from '../../../../utils/motion';
import { KINA_SEKILLI } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { KinaHero } from '../parts/KinaHero';
import { BindalliDal, BindalliKose } from '../parts/BindalliDal';
import { DAMGA_KINA } from '../parts/KinaDamga';
import { TemplateProps } from '../../types';

/** Köşe yerleşimi: sol üst çizimi aynalanarak dört köşeye. */
const CORNERS = [
  { at: 'top-2 left-2 @md:top-4 @md:left-4', flip: 'none' },
  { at: 'top-2 right-2 @md:top-4 @md:right-4', flip: 'scaleX(-1)' },
  { at: 'bottom-2 left-2 @md:bottom-4 @md:left-4', flip: 'scaleY(-1)' },
  { at: 'bottom-2 right-2 @md:bottom-4 @md:right-4', flip: 'scale(-1,-1)' }
] as const;

/**
 * KinaSekilli — "Bindallı": vişne kadife üstüne sırmayla işlenmiş dört köşe
 * sarmaşığı, çift çerçeve ve tepede lale dalı — gelinin kına kaftanı.
 */
export function KinaSekilli({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_SEKILLI}
      renderHero={(props) => <KinaHero {...props} damga={DAMGA_KINA} flame="#ffd27f" className="pt-24 pb-28" />}
      renderHeroBackground={({ revealed }) => (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ background: 'radial-gradient(120% 75% at 50% 38%, #5a1426 0%, #3a0b17 58%, #22060d 100%)' }}
        >
          {/* Kadife tüyü: ışığa dönük yan açık, öbürü gölgede. */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(125deg, rgba(255,214,200,0.07) 0%, rgba(255,214,200,0) 38%, rgba(0,0,0,0.2) 100%)' }}
          />
          <GoldSheen color="240,200,130" opacity={0.08} duration={11} />
          <div className="absolute inset-3 @md:inset-5 rounded-[6px] border border-[#d8a24a]/40" />
          <div className="absolute inset-[19px] @md:inset-[29px] rounded-[4px] border border-[#d8a24a]/18" />
          {CORNERS.map((corner, i) => (
            <motion.div
              key={corner.at}
              className={`absolute ${corner.at} w-24 @md:w-36`}
              initial={{ opacity: 0 }}
              animate={{ opacity: revealed ? 0.85 : 0 }}
              transition={{ duration: 1.4, ease: ease.out, delay: 0.15 * i }}
            >
              <BindalliKose className="block w-full h-auto text-[#d8a24a]" style={{ transform: corner.flip }} />
            </motion.div>
          ))}
          <BindalliDal className="absolute top-[26px] @md:top-[38px] left-1/2 -translate-x-1/2 w-32 @md:w-44 h-auto text-[#d8a24a]/70" />
        </div>
      )}
    />
  );
}
