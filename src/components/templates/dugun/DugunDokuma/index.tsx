import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { DokumaHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunDokuma — "Dokuma" düğün yorumu: keten zemin; kiremit, zümrüt ve altın iplikler. */
const DUGUN_DOKUMA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7f1e6]',
  page: 'text-[#544a3d]',
  surface: 'bg-[#fbf7ef]/90',
  border: 'border-[#e2d6bf]',
  heading: 'text-[#2b2118]',
  body: 'text-[#8b8071]',
  accent: 'text-[#9c6b3f]',
  accentBg: 'bg-[#9c6b3f]',
  accentSoft: 'bg-[#9c6b3f]/12',
  input:
    'w-full bg-white border border-[#e2d6bf] rounded-lg px-3.5 py-2.5 text-sm text-[#544a3d] placeholder:text-[#8b8071] focus:outline-none focus:border-[#9c6b3f] focus:ring-2 focus:ring-[#9c6b3f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2b2118] hover:bg-[#453626] text-[#f7f1e6] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#dacdb2] text-[#63594a] hover:bg-[#f0e8d9] hover:border-[#bfae8e]',
  divider: 'bg-[#e2d6bf]',
  timelineLine: 'from-[#9c6b3f] via-[#2f6f6a]/50 to-transparent'
};

export function DugunDokuma({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_DOKUMA_THEME}
      renderHero={(props) => (
        <DokumaHero
          {...props}
          threads={['#b8433f', '#2f6f6a', '#d8a838']}
          weave="#a89474"
          stitch="#9c6b3f"
          seed={5}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbf6ec 0%, #f3ebdc 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.03}
          fadeTo="#f7f1e6"
        />
      )}
    />
  );
}
