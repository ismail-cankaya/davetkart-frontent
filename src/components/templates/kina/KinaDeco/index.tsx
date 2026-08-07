import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Sunburst, GoldSheen } from '../../shared/effects';
import { DecoHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaDeco — "Art Deco Gala" kına yorumu: bordo-onyx zemin, eski altın yelpaze.
 *
 * Deco'nun geometrisi kına gecesinin geleneksel altın işlemesiyle aynı
 * dili konuşur; zemin siyah yerine bordoya çekilerek kategori kimliği
 * korunuyor.
 */
const KINA_DECO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#120609]',
  page: 'text-[#e9dcd0]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-[#cf9f4e]/22',
  heading: 'text-[#fbf1e2]',
  body: 'text-[#9d8578]',
  accent: 'text-[#cf9f4e]',
  accentBg: 'bg-[#cf9f4e]',
  accentSoft: 'bg-[#cf9f4e]/10',
  input:
    'w-full bg-white/[0.05] border border-[#cf9f4e]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#f4e8dc] placeholder:text-[#8a7466] focus:outline-none focus:border-[#cf9f4e] focus:ring-2 focus:ring-[#cf9f4e]/20 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#cf9f4e] to-[#ecd5a2] hover:brightness-110 text-[#1a0b0d] shadow-lg shadow-[#cf9f4e]/20',
  buttonGhost:
    'border border-[#cf9f4e]/25 text-[#e9dcd0] hover:bg-[#cf9f4e]/10 hover:border-[#cf9f4e]/45',
  divider: 'bg-[#cf9f4e]/22',
  timelineLine: 'from-[#cf9f4e] via-[#9c2436]/45 to-transparent'
};

export function KinaDeco({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_DECO_THEME}
      renderHero={(props) => <DecoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #2a0d14 0%, #150609 55%, #0a0406 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <Sunburst color="207,159,78" rays={44} opacity={0.2} x={50} y={38} />
              <GoldSheen color="240,214,160" opacity={0.14} duration={9} />
            </>
          }
          parallax={9}
          grain={0.032}
          fadeTo="#120609"
        />
      )}
    />
  );
}
