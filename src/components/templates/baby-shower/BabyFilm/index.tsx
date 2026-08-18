import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { FilmHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabyFilm — "Film Şeridi" baby shower yorumu: karesi karesine ilerleyen sekans. */
const BABY_FILM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0e1118]',
  page: 'text-[#dde3ea]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f0f4f8]',
  body: 'text-[#868e98]',
  accent: 'text-[#a8c8d8]',
  accentBg: 'bg-[#a8c8d8]',
  accentSoft: 'bg-[#a8c8d8]/12',
  input: 'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f0f4f8] placeholder:text-[#868e98] focus:outline-none focus:border-[#a8c8d8]/60 focus:ring-2 focus:ring-[#a8c8d8]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#a8c8d8] hover:brightness-110 text-[#0e1118] shadow-lg shadow-[#a8c8d8]/25',
  buttonGhost: 'border border-white/16 text-[#dde3ea] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#a8c8d8] via-[#a8c8d8]/40 to-transparent',
};

export function BabyFilm({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_FILM_THEME}
      renderHero={(props) => <FilmHero {...props} strip="#1a1f28" frame="#10141b" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #1a2130 0%, #0f131a 55%, #0e1118 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="168,200,216" size={56} x={50} y={40} opacity={0.14} duration={13} />}
          parallax={5}
          grain={0.03}
          fadeTo="#0e1118"
        />
      )}
    />
  );
}
