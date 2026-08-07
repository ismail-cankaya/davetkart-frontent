import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { SuluboyaHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaSuluboya — "Suluboya" kına yorumu: kızıl, kehribar ve zümrüt lekeler. */
const KINA_SULUBOYA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fbf6ee]',
  page: 'text-[#544539]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#e8dcc8]',
  heading: 'text-[#2b1e18]',
  body: 'text-[#8c7f6e]',
  accent: 'text-[#b8434f]',
  accentBg: 'bg-[#b8434f]',
  accentSoft: 'bg-[#b8434f]/12',
  input:
    'w-full bg-white border border-[#e8dcc8] rounded-lg px-3.5 py-2.5 text-sm text-[#544539] placeholder:text-[#8c7f6e] focus:outline-none focus:border-[#b8434f] focus:ring-2 focus:ring-[#b8434f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2b1e18] hover:bg-[#453227] text-[#fbf6ee] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e0d2ba] text-[#655847] hover:bg-[#f4ecdf] hover:border-[#c4b294]',
  divider: 'bg-[#e8dcc8]',
  timelineLine: 'from-[#b8434f] via-[#e0a05c]/60 to-transparent'
};

export function KinaSuluboya({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_SULUBOYA_THEME}
      renderHero={(props) => (
        <SuluboyaHero {...props} washes={['#c4404f', '#e0a05c', '#2f7a6a']} seed={19} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fefaf3 0%, #f6efe3 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.026}
          fadeTo="#fbf6ee"
        />
      )}
    />
  );
}
