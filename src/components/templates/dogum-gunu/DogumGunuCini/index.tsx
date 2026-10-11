import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { CiniHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuCini — "Çini" yorumu: neşeli bir çini: parlak kobalt, nane firuzesi, mandalina ve hardal. */
const DOGUM_GUNU_CINI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fdf6ea]',
  page: 'text-[#6c6a78]',
  surface: 'bg-[#fffaf1]/90 backdrop-blur-sm',
  border: 'border-[#2a50b5]/25',
  heading: 'text-[#1d2c66]',
  body: 'text-[#6c6a78]',
  accent: 'text-[#e2583a]',
  accentBg: 'bg-[#2a50b5]',
  accentSoft: 'bg-[#e2583a]/10',
  input: 'w-full bg-[#fffaf1] border border-[#2a50b5]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#1d2c66] placeholder:text-[#6c6a78] focus:outline-none focus:border-[#e2583a] focus:ring-2 focus:ring-[#e2583a]/15 transition duration-300',
  buttonPrimary: 'bg-[#2a50b5] hover:brightness-125 text-[#fffaf1] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#2a50b5]/40 text-[#1d2c66] hover:bg-[#2a50b5]/10 hover:border-[#2a50b5]/70 rounded-sm',
  divider: 'bg-[#2a50b5]/20',
  timelineLine: 'from-[#e2583a] via-[#2a50b5]/40 to-transparent',
};

export function DogumGunuCini({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_CINI_THEME}
      renderHero={(props) => (
        <CiniHero
          {...props}
          glaze="#fffaf1"
          cobalt="#2a50b5"
          turquoise="#23b0a0"
          coral="#ef6a4c"
          leaf="#e8a92e"
          grout="#f1e4cf"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage base="#f1e4cf" scrim={false} vignette={false} parallax={0} grain={0.02} fadeTo="#fdf6ea" />
      )}
    />
  );
}
