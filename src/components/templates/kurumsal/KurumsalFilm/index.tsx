import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { FilmHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalFilm — "Film Şeridi" kurumsal yorumu: karesi karesine ilerleyen sekans. */
const KURUMSAL_FILM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0a0d10]',
  page: 'text-[#d8dee1]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#eef2f4]',
  body: 'text-[#828b90]',
  accent: 'text-[#5fb0c8]',
  accentBg: 'bg-[#5fb0c8]',
  accentSoft: 'bg-[#5fb0c8]/12',
  input: 'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#eef2f4] placeholder:text-[#828b90] focus:outline-none focus:border-[#5fb0c8]/60 focus:ring-2 focus:ring-[#5fb0c8]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#5fb0c8] hover:brightness-110 text-[#0a0d10] shadow-lg shadow-[#5fb0c8]/25',
  buttonGhost: 'border border-white/16 text-[#d8dee1] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#5fb0c8] via-[#5fb0c8]/40 to-transparent',
};

export function KurumsalFilm({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_FILM_THEME}
      renderHero={(props) => <FilmHero {...props} strip="#161b1f" frame="#0c1013" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #151c21 0%, #0b0e11 55%, #0a0d10 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="95,176,200" size={56} x={50} y={40} opacity={0.14} duration={13} />}
          parallax={5}
          grain={0.03}
          fadeTo="#0a0d10"
        />
      )}
    />
  );
}
