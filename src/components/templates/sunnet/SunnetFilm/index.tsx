import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { FilmHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetFilm — "Film Şeridi" sünnet yorumu: karesi karesine ilerleyen sekans. */
const SUNNET_FILM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#071019]',
  page: 'text-[#d8e2ea]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#eaf2f8]',
  body: 'text-[#82909a]',
  accent: 'text-[#5fb8a8]',
  accentBg: 'bg-[#5fb8a8]',
  accentSoft: 'bg-[#5fb8a8]/12',
  input: 'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#eaf2f8] placeholder:text-[#82909a] focus:outline-none focus:border-[#5fb8a8]/60 focus:ring-2 focus:ring-[#5fb8a8]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#5fb8a8] hover:brightness-110 text-[#071019] shadow-lg shadow-[#5fb8a8]/25',
  buttonGhost: 'border border-white/16 text-[#d8e2ea] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#5fb8a8] via-[#5fb8a8]/40 to-transparent',
};

export function SunnetFilm({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_FILM_THEME}
      renderHero={(props) => <FilmHero {...props} strip="#0f1e2a" frame="#09131c" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #10222f 0%, #08121b 55%, #071019 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="95,184,168" size={56} x={50} y={40} opacity={0.14} duration={13} />}
          parallax={5}
          grain={0.03}
          fadeTo="#071019"
        />
      )}
    />
  );
}
