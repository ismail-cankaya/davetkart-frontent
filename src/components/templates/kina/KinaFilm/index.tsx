import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { FilmHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaFilm — "Film Şeridi" kına yorumu: karesi karesine ilerleyen sekans. */
const KINA_FILM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#150a0b]',
  page: 'text-[#e7d7d3]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f9ece6]',
  body: 'text-[#9b8480]',
  accent: 'text-[#e0785f]',
  accentBg: 'bg-[#e0785f]',
  accentSoft: 'bg-[#e0785f]/12',
  input: 'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f9ece6] placeholder:text-[#9b8480] focus:outline-none focus:border-[#e0785f]/60 focus:ring-2 focus:ring-[#e0785f]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#e0785f] hover:brightness-110 text-[#150a0b] shadow-lg shadow-[#e0785f]/25',
  buttonGhost: 'border border-white/16 text-[#e7d7d3] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#e0785f] via-[#e0785f]/40 to-transparent',
};

export function KinaFilm({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_FILM_THEME}
      renderHero={(props) => <FilmHero {...props} strip="#241413" frame="#180c0d" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #281314 0%, #160b0c 55%, #150a0b 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="224,120,95" size={56} x={50} y={40} opacity={0.14} duration={13} />}
          parallax={5}
          grain={0.03}
          fadeTo="#150a0b"
        />
      )}
    />
  );
}
