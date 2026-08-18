import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PostaHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanPosta — "Posta Damgası" nişan yorumu: yollanmış, damgalanmış ve ulaşmış davet. */
const NISAN_POSTA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f7f9]',
  page: 'text-[#4c525a]',
  surface: 'bg-[#fbfcfd]/85 backdrop-blur-sm',
  border: 'border-[#e2e5ea]',
  heading: 'text-[#22262e]',
  body: 'text-[#828892]',
  accent: 'text-[#4f6f9f]',
  accentBg: 'bg-[#4f6f9f]',
  accentSoft: 'bg-[#4f6f9f]/12',
  input: 'w-full bg-white border border-[#e2e5ea] rounded-lg px-3.5 py-2.5 text-sm text-[#4c525a] placeholder:text-[#828892] focus:outline-none focus:border-[#4f6f9f] focus:ring-2 focus:ring-[#4f6f9f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#22262e] hover:brightness-125 text-[#f6f7f9] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e2e5ea] text-[#4c525a] hover:bg-[#f6f7f9] hover:border-[#4f6f9f]/40',
  divider: 'bg-[#e2e5ea]',
  timelineLine: 'from-[#4f6f9f] via-[#4f6f9f]/40 to-transparent',
};

export function NisanPosta({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_POSTA_THEME}
      renderHero={(props) => (
        <PostaHero
          {...props}
          stripe={['#b8323f', '#1f4e8c']}
          stamp="#a8c0d8"
          postmark="#2f4f7a"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fcfdfe 0%, #f1f3f6 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f6f7f9"
        />
      )}
    />
  );
}
