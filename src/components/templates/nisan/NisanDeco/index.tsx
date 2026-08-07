import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Sunburst, GoldSheen } from '../../shared/effects';
import { DecoHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * NisanDeco — "Art Deco Gala" nişan yorumu: gece mavisi onyx, şampanya altını.
 *
 * Düğün Deco'su sıcak siyah üzerine kurulur; nişanda zemin lacivere
 * çekildi — aynı geometri, daha serin ve daha genç bir gala.
 */
const NISAN_DECO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#080b16]',
  page: 'text-[#e2e3ea]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-[#dcc188]/22',
  heading: 'text-[#f7f2e6]',
  body: 'text-[#8b8e9d]',
  accent: 'text-[#dcc188]',
  accentBg: 'bg-[#dcc188]',
  accentSoft: 'bg-[#dcc188]/10',
  input:
    'w-full bg-white/[0.05] border border-[#dcc188]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#eeeaf0] placeholder:text-[#78798a] focus:outline-none focus:border-[#dcc188] focus:ring-2 focus:ring-[#dcc188]/20 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#dcc188] to-[#f2e2b8] hover:brightness-110 text-[#0d1120] shadow-lg shadow-[#dcc188]/20',
  buttonGhost:
    'border border-[#dcc188]/25 text-[#e2e3ea] hover:bg-[#dcc188]/10 hover:border-[#dcc188]/45',
  divider: 'bg-[#dcc188]/22',
  timelineLine: 'from-[#dcc188] via-[#6f7fa8]/40 to-transparent'
};

export function NisanDeco({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_DECO_THEME}
      renderHero={(props) => <DecoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #141b2e 0%, #0a0e1a 55%, #05070d 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <Sunburst color="220,193,136" rays={44} opacity={0.2} x={50} y={38} />
              <GoldSheen color="235,215,170" opacity={0.12} duration={10} />
            </>
          }
          parallax={9}
          grain={0.03}
          fadeTo="#080b16"
        />
      )}
    />
  );
}
