import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { RisoHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * BabyRiso — "Risograph Poster" baby shower yorumu: nane ve mercan mürekkep, krem kağıt.
 */
const BABY_RISO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f4ee]',
  page: 'text-[#3b3a35]',
  surface: 'bg-white/85',
  border: 'border-[#1b1a17]/15',
  heading: 'text-[#1b1a17]',
  body: 'text-[#6b6a63]',
  accent: 'text-[#ff6b5a]',
  accentBg: 'bg-[#ff6b5a]',
  accentSoft: 'bg-[#3fbf9f]/25',
  input:
    'w-full bg-white/85 border border-[#1b1a17]/15 rounded-lg px-3.5 py-2.5 text-sm text-[#3b3a35] placeholder:text-[#9a998f] focus:outline-none focus:border-[#ff6b5a] focus:ring-2 focus:ring-[#ff6b5a]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#1b1a17] hover:bg-[#3b3a35] text-[#f6f4ee] shadow-none',
  buttonGhost:
    'border-2 border-[#1b1a17] text-[#1b1a17] hover:bg-[#1b1a17] hover:text-[#f6f4ee]',
  divider: 'bg-[#1b1a17]/15',
  timelineLine: 'from-[#ff6b5a] via-[#3fbf9f]/50 to-transparent'
};

export function BabyRiso({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_RISO_THEME}
      renderHero={(props) => <RisoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #f9f8f2 0%, #f1efe6 100%)"
          scrim={false}
          vignette={false}
          parallax={5}
          grain={0.03}
          fadeTo="#f6f4ee"
        />
      )}
    />
  );
}
