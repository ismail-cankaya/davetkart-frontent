import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PostaHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** MezuniyetPosta — "Posta Damgası" mezuniyet yorumu: yollanmış, damgalanmış ve ulaşmış davet. */
const MEZUNIYET_POSTA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f4ee]',
  page: 'text-[#4e4d45]',
  surface: 'bg-[#fbfaf6]/85 backdrop-blur-sm',
  border: 'border-[#e2e0d4]',
  heading: 'text-[#22221b]',
  body: 'text-[#807f75]',
  accent: 'text-[#7a2f39]',
  accentBg: 'bg-[#7a2f39]',
  accentSoft: 'bg-[#7a2f39]/12',
  input: 'w-full bg-white border border-[#e2e0d4] rounded-lg px-3.5 py-2.5 text-sm text-[#4e4d45] placeholder:text-[#807f75] focus:outline-none focus:border-[#7a2f39] focus:ring-2 focus:ring-[#7a2f39]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#22221b] hover:brightness-125 text-[#f6f4ee] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e2e0d4] text-[#4e4d45] hover:bg-[#f6f4ee] hover:border-[#7a2f39]/40',
  divider: 'bg-[#e2e0d4]',
  timelineLine: 'from-[#7a2f39] via-[#7a2f39]/40 to-transparent',
};

export function MezuniyetPosta({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_POSTA_THEME}
      renderHero={(props) => (
        <PostaHero
          {...props}
          stripe={['#7a2f39', '#1d3f76']}
          stamp="#d8c08f"
          postmark="#1d3f76"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fcfbf7 0%, #f1efe7 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f6f4ee"
        />
      )}
    />
  );
}
