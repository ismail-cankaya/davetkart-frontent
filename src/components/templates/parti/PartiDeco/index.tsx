import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Sunburst, GoldSheen } from '../../shared/effects';
import { DecoHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * PartiDeco — "Art Deco Gala": siyah zeminde altın yelpaze, kademeli çerçeve, mutlak simetri.
 */
const PARTI_DECO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#0a0908]',
  page: 'text-[#e4dcc8]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-[#d4af5f]/22',
  heading: 'text-[#f8f0d8]',
  body: 'text-[#94897a]',
  accent: 'text-[#d4af5f]',
  accentBg: 'bg-[#d4af5f]',
  accentSoft: 'bg-[#d4af5f]/10',
  input:
    'w-full bg-white/[0.05] border border-[#d4af5f]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#f2e9d4] placeholder:text-[#7d7365] focus:outline-none focus:border-[#d4af5f] focus:ring-2 focus:ring-[#d4af5f]/20 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#d4af5f] to-[#eed79b] hover:brightness-110 text-[#14110a] shadow-lg shadow-[#d4af5f]/20',
  buttonGhost:
    'border border-[#d4af5f]/25 text-[#e4dcc8] hover:bg-[#d4af5f]/10 hover:border-[#d4af5f]/45',
  divider: 'bg-[#d4af5f]/22',
  timelineLine: 'from-[#d4af5f] via-[#d4af5f]/35 to-transparent'
};

export function PartiDeco({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_DECO_THEME}
      renderHero={(props) => <DecoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #1b1710 0%, #0d0b08 55%, #060505 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              {/* Dev yelpaze kadrajın merkezinden açılır; DecoHero kendi
                  küçük madalyonunu bunun üstüne bindirir. */}
              <Sunburst color="212,175,95" rays={48} opacity={0.24} x={50} y={38} />
              <GoldSheen color="238,215,155" opacity={0.14} duration={9} />
            </>
          }
          parallax={9}
          grain={0.032}
          fadeTo="#0a0908"
        />
      )}
    />
  );
}
