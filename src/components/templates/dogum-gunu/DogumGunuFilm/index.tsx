import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { FilmHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuFilm — "Film Şeridi" doğum günü yorumu: karesi karesine ilerleyen sekans. */
const DOGUM_GUNU_FILM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#110e14]',
  page: 'text-[#e4dee6]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f8f2f6]',
  body: 'text-[#8f8a94]',
  accent: 'text-[#f5a0c8]',
  accentBg: 'bg-[#f5a0c8]',
  accentSoft: 'bg-[#f5a0c8]/12',
  input: 'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f8f2f6] placeholder:text-[#8f8a94] focus:outline-none focus:border-[#f5a0c8]/60 focus:ring-2 focus:ring-[#f5a0c8]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#f5a0c8] hover:brightness-110 text-[#110e14] shadow-lg shadow-[#f5a0c8]/25',
  buttonGhost: 'border border-white/16 text-[#e4dee6] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f5a0c8] via-[#f5a0c8]/40 to-transparent',
};

export function DogumGunuFilm({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_FILM_THEME}
      renderHero={(props) => <FilmHero {...props} strip="#1d1922" frame="#131017" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #1f1a26 0%, #120f16 55%, #110e14 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="245,160,200" size={56} x={50} y={40} opacity={0.14} duration={13} />}
          parallax={5}
          grain={0.03}
          fadeTo="#110e14"
        />
      )}
    />
  );
}
