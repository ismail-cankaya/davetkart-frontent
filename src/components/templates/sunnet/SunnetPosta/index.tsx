import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PostaHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetPosta — "Posta Damgası" sünnet yorumu: yollanmış, damgalanmış ve ulaşmış davet. */
const SUNNET_POSTA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f7f9]',
  page: 'text-[#48525a]',
  surface: 'bg-[#fafcfd]/85 backdrop-blur-sm',
  border: 'border-[#dde5ea]',
  heading: 'text-[#1d2730]',
  body: 'text-[#7d8790]',
  accent: 'text-[#2f7f8c]',
  accentBg: 'bg-[#2f7f8c]',
  accentSoft: 'bg-[#2f7f8c]/12',
  input: 'w-full bg-white border border-[#dde5ea] rounded-lg px-3.5 py-2.5 text-sm text-[#48525a] placeholder:text-[#7d8790] focus:outline-none focus:border-[#2f7f8c] focus:ring-2 focus:ring-[#2f7f8c]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#1d2730] hover:brightness-125 text-[#f4f7f9] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#dde5ea] text-[#48525a] hover:bg-[#f4f7f9] hover:border-[#2f7f8c]/40',
  divider: 'bg-[#dde5ea]',
  timelineLine: 'from-[#2f7f8c] via-[#2f7f8c]/40 to-transparent',
};

export function SunnetPosta({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_POSTA_THEME}
      renderHero={(props) => (
        <PostaHero
          {...props}
          stripe={['#1f5f8c', '#c47a2f']}
          stamp="#7fb8a8"
          postmark="#1f4e6b"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbfdfe 0%, #eff4f7 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f4f7f9"
        />
      )}
    />
  );
}
