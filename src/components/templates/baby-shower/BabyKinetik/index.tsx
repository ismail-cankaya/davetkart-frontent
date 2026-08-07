import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { KinetikHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * BabyKinetik — "Kinetik Tipografi" baby shower yorumu: kireç beyazı zemin, nane vurgu.
 */
const BABY_KINETIK_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f8f4]',
  page: 'text-[#4c554e]',
  surface: 'bg-white/85 backdrop-blur-sm',
  border: 'border-[#e0e6de]',
  heading: 'text-[#26302a]',
  body: 'text-[#828c85]',
  accent: 'text-[#3fb894]',
  accentBg: 'bg-[#3fb894]',
  accentSoft: 'bg-[#3fb894]/14',
  input:
    'w-full bg-white border border-[#e0e6de] rounded-lg px-3.5 py-2.5 text-sm text-[#4c554e] placeholder:text-[#828c85] focus:outline-none focus:border-[#3fb894] focus:ring-2 focus:ring-[#3fb894]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#26302a] hover:bg-[#3c483f] text-[#f6f8f4] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d6ddd3] text-[#5b645d] hover:bg-[#ecf0e9] hover:border-[#b2bcb0]',
  divider: 'bg-[#e0e6de]',
  timelineLine: 'from-[#3fb894] via-[#b2ddcb]/60 to-transparent'
};

export function BabyKinetik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_KINETIK_THEME}
      renderHero={(props) => <KinetikHero {...props} topWord="BABY SHOWER" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbfcfa 0%, #f1f4ef 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.02}
          fadeTo="#f6f8f4"
        />
      )}
    />
  );
}
