import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PostaHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabyPosta — "Posta Damgası" baby shower yorumu: yollanmış, damgalanmış ve ulaşmış davet. */
const BABY_POSTA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fbf9f4]',
  page: 'text-[#54514a]',
  surface: 'bg-[#fefdfa]/85 backdrop-blur-sm',
  border: 'border-[#e7e3d8]',
  heading: 'text-[#2a2822]',
  body: 'text-[#8a867c]',
  accent: 'text-[#8fa8b8]',
  accentBg: 'bg-[#8fa8b8]',
  accentSoft: 'bg-[#8fa8b8]/12',
  input: 'w-full bg-white border border-[#e7e3d8] rounded-lg px-3.5 py-2.5 text-sm text-[#54514a] placeholder:text-[#8a867c] focus:outline-none focus:border-[#8fa8b8] focus:ring-2 focus:ring-[#8fa8b8]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2a2822] hover:brightness-125 text-[#fbf9f4] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e7e3d8] text-[#54514a] hover:bg-[#fbf9f4] hover:border-[#8fa8b8]/40',
  divider: 'bg-[#e7e3d8]',
  timelineLine: 'from-[#8fa8b8] via-[#8fa8b8]/40 to-transparent',
};

export function BabyPosta({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_POSTA_THEME}
      renderHero={(props) => (
        <PostaHero
          {...props}
          stripe={['#e8a0a8', '#8fb8d8']}
          stamp="#d8c88f"
          postmark="#7f9fb8"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fffefb 0%, #f6f3ec 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#fbf9f4"
        />
      )}
    />
  );
}
