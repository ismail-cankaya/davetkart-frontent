import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { RisoHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * PartiRiso — "Risograph Poster": konser afişi enerjisi — düz mürekkep, tram, kayık baskı.
 */
const PARTI_RISO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7f3e9]',
  page: 'text-[#39332c]',
  surface: 'bg-white/85',
  border: 'border-[#1a1712]/15',
  heading: 'text-[#1a1712]',
  body: 'text-[#6b645b]',
  accent: 'text-[#e0453f]',
  accentBg: 'bg-[#e0453f]',
  accentSoft: 'bg-[#1f6feb]/25',
  input:
    'w-full bg-white border border-[#1a1712]/15 rounded-lg px-3.5 py-2.5 text-sm text-[#39332c] placeholder:text-[#6b645b] focus:outline-none focus:border-[#e0453f] focus:ring-2 focus:ring-[#e0453f]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#1a1712] hover:bg-[#39332c] text-[#f7f3e9] shadow-none',
  buttonGhost:
    'border-2 border-[#1a1712] text-[#1a1712] hover:bg-[#1a1712] hover:text-[#f7f3e9]',
  divider: 'bg-[#1a1712]/15',
  timelineLine: 'from-[#e0453f] via-[#1f6feb]/50 to-transparent'
};

export function PartiRiso({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_RISO_THEME}
      renderHero={(props) => <RisoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbf7ed 0%, #f2ecdf 100%)"
          scrim={false}
          vignette={false}
          parallax={5}
          grain={0.03}
          fadeTo="#f7f3e9"
        />
      )}
    />
  );
}
