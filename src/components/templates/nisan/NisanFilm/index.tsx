import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { FilmHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanFilm — "Film Şeridi" nişan yorumu: karesi karesine ilerleyen sekans. */
const NISAN_FILM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0b0e13]',
  page: 'text-[#dadfe7]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#eef2f8]',
  body: 'text-[#868e9c]',
  accent: 'text-[#9fb8d8]',
  accentBg: 'bg-[#9fb8d8]',
  accentSoft: 'bg-[#9fb8d8]/12',
  input: 'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#eef2f8] placeholder:text-[#868e9c] focus:outline-none focus:border-[#9fb8d8]/60 focus:ring-2 focus:ring-[#9fb8d8]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#9fb8d8] hover:brightness-110 text-[#0b0e13] shadow-lg shadow-[#9fb8d8]/25',
  buttonGhost: 'border border-white/16 text-[#dadfe7] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#9fb8d8] via-[#9fb8d8]/40 to-transparent',
};

export function NisanFilm({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_FILM_THEME}
      renderHero={(props) => <FilmHero {...props} strip="#171b22" frame="#0d1116" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #171d26 0%, #0c1015 55%, #0b0e13 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="159,184,216" size={56} x={50} y={40} opacity={0.14} duration={13} />}
          parallax={5}
          grain={0.03}
          fadeTo="#0b0e13"
        />
      )}
    />
  );
}
