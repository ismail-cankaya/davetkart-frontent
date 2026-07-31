import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { RisoHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DogumGunuRiso — "Risograph Poster": düz spot renkler, tram dokusu, kayık baskı. Degrade yok.
 */
const DOGUM_GUNU_RISO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7f2e7]',
  page: 'text-[#3a3330]',
  surface: 'bg-white/85',
  border: 'border-[#1c1917]/15',
  heading: 'text-[#1c1917]',
  body: 'text-[#6d635d]',
  accent: 'text-[#ff3d7f]',
  accentBg: 'bg-[#ff3d7f]',
  accentSoft: 'bg-[#2f6df0]/25',
  input:
    'w-full bg-white/85 border border-[#1c1917]/15 rounded-lg px-3.5 py-2.5 text-sm text-[#3a3330] placeholder:text-[#9c918a] focus:outline-none focus:border-[#ff3d7f] focus:ring-2 focus:ring-[#ff3d7f]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#1c1917] hover:bg-[#3a3330] text-[#f7f2e7] shadow-none',
  buttonGhost:
    'border-2 border-[#1c1917] text-[#1c1917] hover:bg-[#1c1917] hover:text-[#f7f2e7]',
  divider: 'bg-[#1c1917]/15',
  timelineLine: 'from-[#ff3d7f] via-[#2f6df0]/50 to-transparent'
};

export function DogumGunuRiso({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_RISO_THEME}
      renderHero={(props) => <RisoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #faf6ec 0%, #f3ecdd 100%)"
          scrim={false}
          vignette={false}
          parallax={5}
          grain={0.03}
          fadeTo="#f7f2e7"
        />
      )}
    />
  );
}
