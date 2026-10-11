import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { CiniHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** MezuniyetCini — "Çini" yorumu: gece mavisi ve eski altın; ağırbaşlı bir tören çinisi. */
const MEZUNIYET_CINI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f2f0e9]',
  page: 'text-[#5f6372]',
  surface: 'bg-[#f7f6f1]/90 backdrop-blur-sm',
  border: 'border-[#1b2b55]/25',
  heading: 'text-[#141f40]',
  body: 'text-[#5f6372]',
  accent: 'text-[#9c7425]',
  accentBg: 'bg-[#1b2b55]',
  accentSoft: 'bg-[#9c7425]/10',
  input: 'w-full bg-[#f7f6f1] border border-[#1b2b55]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#141f40] placeholder:text-[#5f6372] focus:outline-none focus:border-[#9c7425] focus:ring-2 focus:ring-[#9c7425]/15 transition duration-300',
  buttonPrimary: 'bg-[#1b2b55] hover:brightness-125 text-[#f7f6f1] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#1b2b55]/40 text-[#141f40] hover:bg-[#1b2b55]/10 hover:border-[#1b2b55]/70 rounded-sm',
  divider: 'bg-[#1b2b55]/20',
  timelineLine: 'from-[#9c7425] via-[#1b2b55]/40 to-transparent',
};

export function MezuniyetCini({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_CINI_THEME}
      renderHero={(props) => (
        <CiniHero
          {...props}
          glaze="#f7f6f1"
          cobalt="#1b2b55"
          turquoise="#2d7f8e"
          coral="#b98a2f"
          leaf="#3e6b52"
          grout="#e2ddd0"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage base="#e2ddd0" scrim={false} vignette={false} parallax={0} grain={0.02} fadeTo="#f2f0e9" />
      )}
    />
  );
}
