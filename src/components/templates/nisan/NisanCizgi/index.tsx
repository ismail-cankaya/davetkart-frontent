import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HatHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * NisanCizgi — "Tek Çizgi" nişan yorumu: serin gri kağıt, zeytin hat.
 */
const NISAN_CIZGI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f7f9]',
  page: 'text-[#494e56]',
  surface: 'bg-white/85',
  border: 'border-[#dde0e5]',
  heading: 'text-[#1e2228]',
  body: 'text-[#7f858f]',
  accent: 'text-[#6b7a4f]',
  accentBg: 'bg-[#6b7a4f]',
  accentSoft: 'bg-[#6b7a4f]/10',
  input:
    'w-full bg-white border border-[#dde0e5] rounded-lg px-3.5 py-2.5 text-sm text-[#494e56] placeholder:text-[#7f858f] focus:outline-none focus:border-[#6b7a4f] focus:ring-2 focus:ring-[#6b7a4f]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#1e2228] hover:bg-[#343a43] text-[#f6f7f9] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d3d7dd] text-[#5a5f68] hover:bg-[#edeff2] hover:border-[#b0b6bf]',
  divider: 'bg-[#dde0e5]',
  timelineLine: 'from-[#6b7a4f] via-[#c0c9b0]/60 to-transparent'
};

export function NisanCizgi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_CIZGI_THEME}
      renderHero={(props) => <HatHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbfcfd 0%, #f1f3f6 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.016}
          fadeTo="#f6f7f9"
        />
      )}
    />
  );
}
