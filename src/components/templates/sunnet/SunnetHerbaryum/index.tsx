import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HerbaryumHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetHerbaryum — "Herbaryum" yorumu: töreni yeşil mürekkeple kayda geçiren yorum. */
const SUNNET_HERBARYUM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f1f5f1]',
  page: 'text-[#74827b]',
  surface: 'bg-[#fdfffd]/85 backdrop-blur-sm',
  border: 'border-[#4f7a6a]/25',
  heading: 'text-[#202b26]',
  body: 'text-[#74827b]',
  accent: 'text-[#2f7f8c]',
  accentBg: 'bg-[#2f7f8c]',
  accentSoft: 'bg-[#2f7f8c]/10',
  input: 'w-full bg-[#fdfffd] border border-[#4f7a6a]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#202b26] placeholder:text-[#74827b] focus:outline-none focus:border-[#2f7f8c] focus:ring-2 focus:ring-[#2f7f8c]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#202b26] hover:brightness-125 text-[#f1f5f1] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#4f7a6a]/35 text-[#202b26] hover:bg-[#4f7a6a]/10 hover:border-[#4f7a6a]/60 rounded-sm',
  divider: 'bg-[#4f7a6a]/20',
  timelineLine: 'from-[#2f7f8c] via-[#2f7f8c]/40 to-transparent',
};

export function SunnetHerbaryum({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_HERBARYUM_THEME}
      renderHero={(props) => (
        <HerbaryumHero
          {...props}
          sheet="#f1f5f1"
          tape="rgba(190,210,200,0.5)"
          specimen="#4f7a6a"
          label="#fdfffd"
          accession="No. 033"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fafdfa 0%, #f1f5f1 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#f1f5f1"
        />
      )}
    />
  );
}
