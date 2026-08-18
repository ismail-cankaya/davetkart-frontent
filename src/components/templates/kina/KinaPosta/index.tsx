import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PostaHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaPosta — "Posta Damgası" kına yorumu: yollanmış, damgalanmış ve ulaşmış davet. */
const KINA_POSTA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#faf3e8]',
  page: 'text-[#554738]',
  surface: 'bg-[#fef8ee]/85 backdrop-blur-sm',
  border: 'border-[#e8dbc6]',
  heading: 'text-[#2b1f16]',
  body: 'text-[#897d6c]',
  accent: 'text-[#b8434f]',
  accentBg: 'bg-[#b8434f]',
  accentSoft: 'bg-[#b8434f]/12',
  input: 'w-full bg-white border border-[#e8dbc6] rounded-lg px-3.5 py-2.5 text-sm text-[#554738] placeholder:text-[#897d6c] focus:outline-none focus:border-[#b8434f] focus:ring-2 focus:ring-[#b8434f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2b1f16] hover:brightness-125 text-[#faf3e8] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e8dbc6] text-[#554738] hover:bg-[#faf3e8] hover:border-[#b8434f]/40',
  divider: 'bg-[#e8dbc6]',
  timelineLine: 'from-[#b8434f] via-[#b8434f]/40 to-transparent',
};

export function KinaPosta({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_POSTA_THEME}
      renderHero={(props) => (
        <PostaHero
          {...props}
          stripe={['#c2354f', '#1f6f6a']}
          stamp="#e0a75c"
          postmark="#8a2352"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fefaf1 0%, #f4ecdd 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#faf3e8"
        />
      )}
    />
  );
}
