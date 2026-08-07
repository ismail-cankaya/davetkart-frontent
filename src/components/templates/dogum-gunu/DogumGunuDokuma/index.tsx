import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { DokumaHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuDokuma — "Dokuma" doğum günü yorumu: neşeli iplikler; mercan, turkuaz ve safran. */
const DOGUM_GUNU_DOKUMA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#faf4e8]',
  page: 'text-[#544a3c]',
  surface: 'bg-[#fdf9f0]/90',
  border: 'border-[#e8dcc4]',
  heading: 'text-[#2c2318]',
  body: 'text-[#8c8271]',
  accent: 'text-[#c0522f]',
  accentBg: 'bg-[#c0522f]',
  accentSoft: 'bg-[#c0522f]/12',
  input:
    'w-full bg-white border border-[#e8dcc4] rounded-lg px-3.5 py-2.5 text-sm text-[#544a3c] placeholder:text-[#8c8271] focus:outline-none focus:border-[#c0522f] focus:ring-2 focus:ring-[#c0522f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2c2318] hover:bg-[#463928] text-[#faf4e8] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#dfd2b6] text-[#645a48] hover:bg-[#f3ecdc] hover:border-[#c3b391]',
  divider: 'bg-[#e8dcc4]',
  timelineLine: 'from-[#c0522f] via-[#3f9fa8]/50 to-transparent'
};

export function DogumGunuDokuma({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_DOKUMA_THEME}
      renderHero={(props) => (
        <DokumaHero
          {...props}
          threads={['#e0603f', '#3f9fa8', '#e8b83f']}
          weave="#ab9878"
          stitch="#c0522f"
          seed={43}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fefaf1 0%, #f5eddd 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.028}
          fadeTo="#faf4e8"
        />
      )}
    />
  );
}
