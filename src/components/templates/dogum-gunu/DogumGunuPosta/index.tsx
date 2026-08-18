import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PostaHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuPosta — "Posta Damgası" doğum günü yorumu: yollanmış, damgalanmış ve ulaşmış davet. */
const DOGUM_GUNU_POSTA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fdf8f2]',
  page: 'text-[#534a3f]',
  surface: 'bg-[#fffcf7]/85 backdrop-blur-sm',
  border: 'border-[#ece0cf]',
  heading: 'text-[#2b2219]',
  body: 'text-[#8a8073]',
  accent: 'text-[#d9603f]',
  accentBg: 'bg-[#d9603f]',
  accentSoft: 'bg-[#d9603f]/12',
  input: 'w-full bg-white border border-[#ece0cf] rounded-lg px-3.5 py-2.5 text-sm text-[#534a3f] placeholder:text-[#8a8073] focus:outline-none focus:border-[#d9603f] focus:ring-2 focus:ring-[#d9603f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2b2219] hover:brightness-125 text-[#fdf8f2] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#ece0cf] text-[#534a3f] hover:bg-[#fdf8f2] hover:border-[#d9603f]/40',
  divider: 'bg-[#ece0cf]',
  timelineLine: 'from-[#d9603f] via-[#d9603f]/40 to-transparent',
};

export function DogumGunuPosta({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_POSTA_THEME}
      renderHero={(props) => (
        <PostaHero
          {...props}
          stripe={['#e0603f', '#3f9fa8']}
          stamp="#f5c04f"
          postmark="#c0522f"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fffdf9 0%, #f8f2e8 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#fdf8f2"
        />
      )}
    />
  );
}
