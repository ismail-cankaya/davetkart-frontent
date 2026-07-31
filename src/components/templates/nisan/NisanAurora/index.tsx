import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh, Halo } from '../../shared/effects';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * NisanAurora — "Aurora Cam" nişan yorumu.
 *
 * Düğünün gül–menekşe üçlüsünden ayrışması için palet soğuk tarafa çekildi:
 * safir, turkuaz ve buzlu lila. Nişan "başlangıç" temasıdır; sıcak romantik
 * ton yerine berrak ve ferah bir üçlü daha doğru okunuyor.
 */
const NISAN_AURORA_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#080d16]',
  page: 'text-[#dfe6f2]',
  surface: 'bg-white/[0.07] backdrop-blur-2xl backdrop-saturate-150',
  border: 'border-white/14',
  heading: 'text-[#f5f9ff]',
  body: 'text-[#93a1ba]',
  accent: 'text-[#7fd8e8]',
  accentBg: 'bg-[#7fd8e8]',
  accentSoft: 'bg-[#7fd8e8]/12',
  input:
    'w-full bg-white/[0.07] border border-white/14 rounded-lg px-3.5 py-2.5 text-sm text-[#eaf1fb] placeholder:text-[#7c8aa3] focus:outline-none focus:border-[#7fd8e8]/60 focus:ring-2 focus:ring-[#7fd8e8]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#7fd8e8] to-[#8ba7f0] hover:from-[#95e0ed] hover:to-[#9db6f4] text-[#08131c] shadow-lg shadow-[#7fd8e8]/25',
  buttonGhost:
    'border border-white/16 text-[#dfe6f2] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#7fd8e8] via-[#8ba7f0]/50 to-transparent'
};

export function NisanAurora({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_AURORA_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 110% 90% at 50% 22%, #0f2036 0%, #0a1220 55%, #06090f 100%)"
          scrim={{ from: 'both', strength: 0.3 }}
          vignette={{ strength: 0.45 }}
          atmosphere={
            <>
              <AuroraMesh colors={['127,216,232', '139,167,240', '186,164,240']} opacity={0.6} duration={26} />
              <Halo color="127,216,232" size={60} x={50} y={40} opacity={0.22} duration={12} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', '#7fd8e8', '#baa4f0'],
              blend: 'screen',
              density: 0.7,
              speed: 0.45,
              opacity: 0.7,
              pointerStrength: 1.4,
              depth: 1,
              seed: 111
            }
          ]}
          grain={0.03}
          fadeTo="#080d16"
        />
      )}
    />
  );
}
