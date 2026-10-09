import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TulVeil } from '../parts/TulVeil';
import { TemplateProps } from '../../types';
import { ease } from '../../../../utils/motion';

/**
 * DugunSade — "Zarif Sadelik": kategorinin en yalın hâli. Tül beyazı zemin,
 * kadrajı kenarlardan saran puantiyeli tül ve iki ince inci çerçeve.
 *
 * TemplateRenderer bilinmeyen bir şablon kimliğinde bu şablona düşer.
 */
export function DugunSade({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunSade}
      renderHero={(props) => <KurdeleHero {...props} />}
      renderHeroBackground={({ revealed }) => (
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 85% 65% at 50% 40%, #ffffff 0%, #f8f6f9 55%, #efebf2 100%)' }}
        >
          <TulVeil tone="light" />
          <motion.div
            aria-hidden="true"
            className="absolute inset-3 @sm:inset-5 rounded-[1.75rem] border border-[#d9d2df]"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.985 }}
            transition={{ duration: 1.6, ease: ease.out, delay: 0.2 }}
          >
            <span className="absolute inset-1.5 rounded-[1.4rem] border border-[#e9e4ed]" />
          </motion.div>
        </div>
      )}
    />
  );
}
