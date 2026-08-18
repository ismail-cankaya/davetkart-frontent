import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { FilmHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunFilm — "Film Şeridi" düğün yorumu: karesi karesine ilerleyen sekans. */
const DUGUN_FILM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#100e0f]',
  page: 'text-[#e0d9d2]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f6f1e9]',
  body: 'text-[#918a82]',
  accent: 'text-[#d8b98a]',
  accentBg: 'bg-[#d8b98a]',
  accentSoft: 'bg-[#d8b98a]/12',
  input: 'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f6f1e9] placeholder:text-[#918a82] focus:outline-none focus:border-[#d8b98a]/60 focus:ring-2 focus:ring-[#d8b98a]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#d8b98a] hover:brightness-110 text-[#100e0f] shadow-lg shadow-[#d8b98a]/25',
  buttonGhost: 'border border-white/16 text-[#e0d9d2] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#d8b98a] via-[#d8b98a]/40 to-transparent',
};

export function DugunFilm({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_FILM_THEME}
      renderHero={(props) => <FilmHero {...props} strip="#1c1a19" frame="#131111" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #1d1a18 0%, #110f0e 55%, #100e0f 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="216,185,138" size={56} x={50} y={40} opacity={0.14} duration={13} />}
          parallax={5}
          grain={0.03}
          fadeTo="#100e0f"
        />
      )}
    />
  );
}
