import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { RisoHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * MezuniyetRiso — "Risograph Poster": kampüs afişi dili — iri tipografi, düz mürekkep, tram.
 */
const MEZUNIYET_RISO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f4ee]',
  page: 'text-[#37362f]',
  surface: 'bg-white/85',
  border: 'border-[#191814]/15',
  heading: 'text-[#191814]',
  body: 'text-[#67665e]',
  accent: 'text-[#d94f2b]',
  accentBg: 'bg-[#d94f2b]',
  accentSoft: 'bg-[#1b5e9c]/25',
  input:
    'w-full bg-white border border-[#191814]/15 rounded-lg px-3.5 py-2.5 text-sm text-[#37362f] placeholder:text-[#67665e] focus:outline-none focus:border-[#d94f2b] focus:ring-2 focus:ring-[#d94f2b]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#191814] hover:bg-[#37362f] text-[#f4f4ee] shadow-none',
  buttonGhost:
    'border-2 border-[#191814] text-[#191814] hover:bg-[#191814] hover:text-[#f4f4ee]',
  divider: 'bg-[#191814]/15',
  timelineLine: 'from-[#d94f2b] via-[#1b5e9c]/50 to-transparent'
};

export function MezuniyetRiso({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_RISO_THEME}
      renderHero={(props) => <RisoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #f8f8f2 0%, #efefe6 100%)"
          scrim={false}
          vignette={false}
          parallax={5}
          grain={0.03}
          fadeTo="#f4f4ee"
        />
      )}
    />
  );
}
