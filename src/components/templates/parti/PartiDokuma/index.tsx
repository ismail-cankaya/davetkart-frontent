import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { DokumaHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * PartiDokuma — "Dokuma" parti yorumu: KOYU kilim.
 *
 * Dokumanın tek gece sürümü: aynı örgü, siyah çözgü üzerine parlak iplik.
 * Kilimin gece yarısı hali.
 */
const PARTI_DOKUMA_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#150f14]',
  page: 'text-[#e2dad8]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f6f0ee]',
  body: 'text-[#948a88]',
  accent: 'text-[#3fc0b8]',
  accentBg: 'bg-[#3fc0b8]',
  accentSoft: 'bg-[#3fc0b8]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f6f0ee] placeholder:text-[#948a88] focus:outline-none focus:border-[#3fc0b8]/60 focus:ring-2 focus:ring-[#3fc0b8]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#3fc0b8] hover:bg-[#5fd0c9] text-[#04140f] shadow-lg shadow-[#3fc0b8]/25',
  buttonGhost: 'border border-white/16 text-[#e2dad8] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#3fc0b8] via-[#e0455f]/45 to-transparent'
};

export function PartiDokuma({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_DOKUMA_THEME}
      renderHero={(props) => (
        <DokumaHero
          {...props}
          threads={['#e0455f', '#3fc0b8', '#f0b83f']}
          weave="#6f5f5a"
          stitch="#3fc0b8"
          seed={71}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #221720 0%, #150f14 55%, #0a070a 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          parallax={5}
          grain={0.03}
          fadeTo="#150f14"
        />
      )}
    />
  );
}
