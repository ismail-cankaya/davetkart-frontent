import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PostaHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** PartiPosta — "Posta Damgası" parti yorumu: yollanmış, damgalanmış ve ulaşmış davet. */
const PARTI_POSTA_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0b0a0c]',
  page: 'text-[#dcd8de]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f4f2f6]',
  body: 'text-[#8a8590]',
  accent: 'text-[#ff5f8f]',
  accentBg: 'bg-[#ff5f8f]',
  accentSoft: 'bg-[#ff5f8f]/12',
  input: 'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f4f2f6] placeholder:text-[#8a8590] focus:outline-none focus:border-[#ff5f8f]/60 focus:ring-2 focus:ring-[#ff5f8f]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#ff5f8f] hover:brightness-110 text-[#0b0a0c] shadow-lg shadow-[#ff5f8f]/25',
  buttonGhost: 'border border-white/16 text-[#dcd8de] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#ff5f8f] via-[#ff5f8f]/40 to-transparent',
};

export function PartiPosta({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_POSTA_THEME}
      renderHero={(props) => (
        <PostaHero
          {...props}
          stripe={['#ff3d6f', '#3fc0ff']}
          stamp="#f0e050"
          postmark="#a8b0ff"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #191520 0%, #0a090c 55%, #0b0a0c 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          parallax={5}
          grain={0.03}
          fadeTo="#0b0a0c"
        />
      )}
    />
  );
}
