import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HatHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetCizgi — "Tek Çizgi" sünnet yorumu: açık gök kağıdı, bordo hat.
 */
const SUNNET_CIZGI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f2f6f9]',
  page: 'text-[#454e59]',
  surface: 'bg-white/85',
  border: 'border-[#d9e2e9]',
  heading: 'text-[#17202b]',
  body: 'text-[#7b848f]',
  accent: 'text-[#8c3b4a]',
  accentBg: 'bg-[#8c3b4a]',
  accentSoft: 'bg-[#8c3b4a]/10',
  input:
    'w-full bg-white border border-[#d9e2e9] rounded-lg px-3.5 py-2.5 text-sm text-[#454e59] placeholder:text-[#7b848f] focus:outline-none focus:border-[#8c3b4a] focus:ring-2 focus:ring-[#8c3b4a]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#17202b] hover:bg-[#2c3743] text-[#f2f6f9] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#cdd8e1] text-[#555f6a] hover:bg-[#e9eff4] hover:border-[#aab6c1]',
  divider: 'bg-[#d9e2e9]',
  timelineLine: 'from-[#8c3b4a] via-[#d3b2b7]/60 to-transparent'
};

export function SunnetCizgi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_CIZGI_THEME}
      renderHero={(props) => <HatHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fafcfe 0%, #edf2f7 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.016}
          fadeTo="#f2f6f9"
        />
      )}
    />
  );
}
