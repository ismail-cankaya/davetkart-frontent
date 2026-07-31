import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Sunburst, GoldSheen } from '../../shared/effects';
import { DecoHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DugunDeco — "Art Deco Gala" düğün yorumu: onyx zemin, şampanya altını, 1920 zarafeti.
 */
const DUGUN_DECO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#0b0a09]',
  page: 'text-[#e8e0d2]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-[#c9a961]/22',
  heading: 'text-[#faf3e6]',
  body: 'text-[#968c7d]',
  accent: 'text-[#c9a961]',
  accentBg: 'bg-[#c9a961]',
  accentSoft: 'bg-[#c9a961]/10',
  input:
    'w-full bg-white/[0.05] border border-[#c9a961]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#f4ecdd] placeholder:text-[#7f7566] focus:outline-none focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#c9a961] to-[#e6d3a0] hover:brightness-110 text-[#15120c] shadow-lg shadow-[#c9a961]/20',
  buttonGhost:
    'border border-[#c9a961]/25 text-[#e8e0d2] hover:bg-[#c9a961]/10 hover:border-[#c9a961]/45',
  divider: 'bg-[#c9a961]/22',
  timelineLine: 'from-[#c9a961] via-[#c9a961]/35 to-transparent'
};

export function DugunDeco({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_DECO_THEME}
      renderHero={(props) => <DecoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #1d1913 0%, #0e0c0a 55%, #070606 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              {/* Dev yelpaze kadrajın merkezinden açılır; DecoHero kendi
                  küçük madalyonunu bunun üstüne bindirir. */}
              <Sunburst color="201,169,97" rays={48} opacity={0.22} x={50} y={38} />
              <GoldSheen color="230,211,160" opacity={0.14} duration={9} />
            </>
          }
          parallax={9}
          grain={0.032}
          fadeTo="#0b0a09"
        />
      )}
    />
  );
}
