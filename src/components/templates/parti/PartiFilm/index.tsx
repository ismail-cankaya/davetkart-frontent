import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { FilmHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** PartiFilm — "Film Şeridi" parti yorumu: karesi karesine ilerleyen sekans. */
const PARTI_FILM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#08080a]',
  page: 'text-[#dcdcd8]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f2f2ef]',
  body: 'text-[#87877f]',
  accent: 'text-[#ff5f7a]',
  accentBg: 'bg-[#ff5f7a]',
  accentSoft: 'bg-[#ff5f7a]/12',
  input: 'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f2f2ef] placeholder:text-[#87877f] focus:outline-none focus:border-[#ff5f7a]/60 focus:ring-2 focus:ring-[#ff5f7a]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#ff5f7a] hover:brightness-110 text-[#08080a] shadow-lg shadow-[#ff5f7a]/25',
  buttonGhost: 'border border-white/16 text-[#dcdcd8] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#ff5f7a] via-[#ff5f7a]/40 to-transparent',
};

export function PartiFilm({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_FILM_THEME}
      renderHero={(props) => <FilmHero {...props} strip="#16161a" frame="#0b0b0d" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #17151a 0%, #09090b 55%, #08080a 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="255,95,122" size={56} x={50} y={40} opacity={0.14} duration={13} />}
          parallax={5}
          grain={0.03}
          fadeTo="#08080a"
        />
      )}
    />
  );
}
