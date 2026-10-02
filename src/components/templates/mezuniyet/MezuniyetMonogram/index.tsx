import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { MonogramHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** MezuniyetMonogram — "Varak Monogram" yorumu: kırık beyaz kart, altın varak ve lacivert boyalı kenar. */
const MEZUNIYET_MONOGRAM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#eceef2]',
  page: 'text-[#626a7a]',
  surface: 'bg-[#f8f6ef]/90 backdrop-blur-sm',
  border: 'border-[#b8913e]/25',
  heading: 'text-[#16234a]',
  body: 'text-[#626a7a]',
  accent: 'text-[#9c7425]',
  accentBg: 'bg-[#16234a]',
  accentSoft: 'bg-[#9c7425]/10',
  input: 'w-full bg-[#f8f6ef] border border-[#b8913e]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#16234a] placeholder:text-[#626a7a] focus:outline-none focus:border-[#9c7425] focus:ring-2 focus:ring-[#9c7425]/15 transition duration-300',
  buttonPrimary: 'bg-[#16234a] hover:brightness-125 text-[#f5f1e6] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#b8913e]/40 text-[#16234a] hover:bg-[#b8913e]/10 hover:border-[#b8913e]/70 rounded-sm',
  divider: 'bg-[#b8913e]/20',
  timelineLine: 'from-[#9c7425] via-[#b8913e]/40 to-transparent',
};

export function MezuniyetMonogram({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_MONOGRAM_THEME}
      renderHero={(props) => (
        <MonogramHero {...props} paper="#f8f6ef" edge="#1b2b55" foil={['#8a6a2a', '#c9a456', '#f6e7b4']} stock="light" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(120% 80% at 50% 30%, #eef0f3 0%, #dfe3ea 100%)"
          scrim={false}
          vignette={{ strength: 0.18 }}
          parallax={0}
          grain={0.025}
          fadeTo="#eceef2"
        />
      )}
    />
  );
}
