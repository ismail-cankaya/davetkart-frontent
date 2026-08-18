import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PostaHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalPosta — "Posta Damgası" kurumsal yorumu: yollanmış, damgalanmış ve ulaşmış davet. */
const KURUMSAL_POSTA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5f6f7]',
  page: 'text-[#4a4f53]',
  surface: 'bg-[#fbfcfc]/85 backdrop-blur-sm',
  border: 'border-[#e0e4e6]',
  heading: 'text-[#1c2124]',
  body: 'text-[#7e858a]',
  accent: 'text-[#2f6f8c]',
  accentBg: 'bg-[#2f6f8c]',
  accentSoft: 'bg-[#2f6f8c]/12',
  input: 'w-full bg-white border border-[#e0e4e6] rounded-lg px-3.5 py-2.5 text-sm text-[#4a4f53] placeholder:text-[#7e858a] focus:outline-none focus:border-[#2f6f8c] focus:ring-2 focus:ring-[#2f6f8c]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#1c2124] hover:brightness-125 text-[#f5f6f7] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e0e4e6] text-[#4a4f53] hover:bg-[#f5f6f7] hover:border-[#2f6f8c]/40',
  divider: 'bg-[#e0e4e6]',
  timelineLine: 'from-[#2f6f8c] via-[#2f6f8c]/40 to-transparent',
};

export function KurumsalPosta({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_POSTA_THEME}
      renderHero={(props) => (
        <PostaHero
          {...props}
          stripe={['#1f5f8c', '#4f8f7f']}
          stamp="#a8c0c8"
          postmark="#1f5f8c"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fcfdfd 0%, #f0f2f3 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f5f6f7"
        />
      )}
    />
  );
}
