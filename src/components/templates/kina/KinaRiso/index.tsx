import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { RisoHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaRiso — "Risograph Poster" kına yorumu: kum kağıdı, kına kızılı ve zümrüt turkuazı.
 *
 * Kızıl–turkuaz ikilisi Anadolu kına örtülerinin klasik zıtlığıdır; riso
 * baskı bu iki mürekkebi üst üste bindirdiğinde ortaya çıkan koyu ton
 * deseni el işi tarafında tutar.
 */
const KINA_RISO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f8f1e4]',
  page: 'text-[#3d3227]',
  surface: 'bg-white/85',
  border: 'border-[#1d1712]/15',
  heading: 'text-[#1d1712]',
  body: 'text-[#6f6355]',
  accent: 'text-[#e04b2e]',
  accentBg: 'bg-[#e04b2e]',
  accentSoft: 'bg-[#0f7a72]/25',
  input:
    'w-full bg-white border border-[#1d1712]/15 rounded-lg px-3.5 py-2.5 text-sm text-[#3d3227] placeholder:text-[#6f6355] focus:outline-none focus:border-[#e04b2e] focus:ring-2 focus:ring-[#e04b2e]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#1d1712] hover:bg-[#3d3227] text-[#f8f1e4] shadow-none',
  buttonGhost:
    'border-2 border-[#1d1712] text-[#1d1712] hover:bg-[#1d1712] hover:text-[#f8f1e4]',
  divider: 'bg-[#1d1712]/15',
  timelineLine: 'from-[#e04b2e] via-[#0f7a72]/50 to-transparent'
};

export function KinaRiso({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_RISO_THEME}
      renderHero={(props) => <RisoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fcf6ea 0%, #f2e9d8 100%)"
          scrim={false}
          vignette={false}
          parallax={5}
          grain={0.03}
          fadeTo="#f8f1e4"
        />
      )}
    />
  );
}
