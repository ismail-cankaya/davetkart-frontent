import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { KinetikHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * NisanKinetik — "Kinetik Tipografi" nişan yorumu: pudra zemin, gül kurusu vurgu.
 */
const NISAN_KINETIK_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7f0f2]',
  page: 'text-[#544750]',
  surface: 'bg-white/85 backdrop-blur-sm',
  border: 'border-[#e8dce0]',
  heading: 'text-[#2a1f26]',
  body: 'text-[#8b7d84]',
  accent: 'text-[#b0798f]',
  accentBg: 'bg-[#b0798f]',
  accentSoft: 'bg-[#b0798f]/12',
  input:
    'w-full bg-white border border-[#e8dce0] rounded-lg px-3.5 py-2.5 text-sm text-[#544750] placeholder:text-[#8b7d84] focus:outline-none focus:border-[#b0798f] focus:ring-2 focus:ring-[#b0798f]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#2a1f26] hover:bg-[#41333b] text-[#f7f0f2] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#e0d2d7] text-[#655761] hover:bg-[#f0e6ea] hover:border-[#c7b2ba]',
  divider: 'bg-[#e8dce0]',
  timelineLine: 'from-[#b0798f] via-[#dcc3cc]/60 to-transparent'
};

export function NisanKinetik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_KINETIK_THEME}
      renderHero={(props) => <KinetikHero {...props} topWord="NİŞAN" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbf6f7 0%, #f2eaed 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#f7f0f2"
        />
      )}
    />
  );
}
