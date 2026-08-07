import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { SuluboyaHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetSuluboya — "Suluboya" sünnet yorumu: gök mavisi, deniz yeşili ve altın lekeler. */
const SUNNET_SULUBOYA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f9fb]',
  page: 'text-[#48525c]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#dde5ec]',
  heading: 'text-[#1c2630]',
  body: 'text-[#7d8792]',
  accent: 'text-[#3f7fa8]',
  accentBg: 'bg-[#3f7fa8]',
  accentSoft: 'bg-[#3f7fa8]/12',
  input:
    'w-full bg-white border border-[#dde5ec] rounded-lg px-3.5 py-2.5 text-sm text-[#48525c] placeholder:text-[#7d8792] focus:outline-none focus:border-[#3f7fa8] focus:ring-2 focus:ring-[#3f7fa8]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#1c2630] hover:bg-[#323e4a] text-[#f6f9fb] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#d2dce5] text-[#58626c] hover:bg-[#ecf2f6] hover:border-[#aeb9c4]',
  divider: 'bg-[#dde5ec]',
  timelineLine: 'from-[#3f7fa8] via-[#8fc4b8]/60 to-transparent'
};

export function SunnetSuluboya({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_SULUBOYA_THEME}
      renderHero={(props) => (
        <SuluboyaHero {...props} washes={['#7fa8d8', '#8fc4b8', '#e0c07f']} seed={31} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fcfeff 0%, #f1f6f9 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#f6f9fb"
        />
      )}
    />
  );
}
