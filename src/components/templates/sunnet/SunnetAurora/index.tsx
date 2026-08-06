import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh, Halo } from '../../shared/effects';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetAurora — "Aurora Cam": şehzade mavisi mesh üzerinde cam yüzeyler. Geleneksel altın yerine modern ferahlık.
 */
const SUNNET_AURORA_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#070d1c]',
  page: 'text-[#dde5f2]',
  surface: 'bg-white/[0.06] backdrop-blur-xl',
  border: 'border-white/12',
  heading: 'text-[#f4f8ff]',
  body: 'text-[#8b98ad]',
  accent: 'text-[#5fb8e8]',
  accentBg: 'bg-[#5fb8e8]',
  accentSoft: 'bg-[#5fb8e8]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f4f8ff] placeholder:text-[#8b98ad] focus:outline-none focus:border-[#5fb8e8]/60 focus:ring-2 focus:ring-[#5fb8e8]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#5fb8e8] to-[#7d8ff0] hover:brightness-110 text-[#07131f] shadow-lg shadow-[#5fb8e8]/25',
  buttonGhost:
    'border border-white/16 text-[#dde5f2] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#5fb8e8] via-[#7d8ff0]/50 to-transparent'
};

export function SunnetAurora({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_AURORA_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 110% 90% at 50% 22%, #0f2140 0%, #0a1424 55%, #06090f 100%)"
          scrim={{ from: 'both', strength: 0.3 }}
          vignette={{ strength: 0.45 }}
          atmosphere={
            <>
              <AuroraMesh colors={['95,184,232', '125,143,240', '160,200,240']} opacity={0.6} duration={26} />
              <Halo color="95,184,232" size={62} x={50} y={40} opacity={0.24} duration={11} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', '#5fb8e8', '#7d8ff0'],
              blend: 'screen',
              density: 0.7,
              speed: 0.45,
              opacity: 0.7,
              pointerStrength: 1.4,
              depth: 1,
              seed: 211
            }
          ]}
          parallax={7}
          grain={0.03}
          fadeTo="#070d1c"
        />
      )}
    />
  );
}
