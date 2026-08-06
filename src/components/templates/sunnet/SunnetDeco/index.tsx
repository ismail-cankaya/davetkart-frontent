import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Sunburst, GoldSheen } from '../../shared/effects';
import { DecoHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetDeco — "Art Deco Gala": törensel görkem. Simetrik kademeli çerçeve ve altın yelpaze, sünnet düğününün ihtişamına birebir oturur.
 */
const SUNNET_DECO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#0a0a08]',
  page: 'text-[#e6dfcd]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-[#d9b45c]/22',
  heading: 'text-[#f9f3e2]',
  body: 'text-[#948b7b]',
  accent: 'text-[#d9b45c]',
  accentBg: 'bg-[#d9b45c]',
  accentSoft: 'bg-[#d9b45c]/12',
  input:
    'w-full bg-white/[0.06] border border-[#d9b45c]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#f9f3e2] placeholder:text-[#948b7b] focus:outline-none focus:border-[#d9b45c]/60 focus:ring-2 focus:ring-[#d9b45c]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#d9b45c] to-[#f0d79a] hover:brightness-110 text-[#15110a] shadow-lg shadow-[#d9b45c]/20',
  buttonGhost:
    'border border-[#d9b45c]/25 text-[#e6dfcd] hover:bg-[#d9b45c]/10 hover:border-[#d9b45c]/45',
  divider: 'bg-[#d9b45c]/22',
  timelineLine: 'from-[#d9b45c] via-[#d9b45c]/35 to-transparent'
};

export function SunnetDeco({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_DECO_THEME}
      renderHero={(props) => <DecoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #1c1810 0%, #0e0c08 55%, #060504 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <Sunburst color="217,180,92" rays={48} opacity={0.22} x={50} y={38} />
              <GoldSheen color="240,215,154" opacity={0.14} duration={9} />
            </>
          }
          parallax={9}
          grain={0.032}
          fadeTo="#0a0a08"
        />
      )}
    />
  );
}
