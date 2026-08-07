import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Iridescent, Halo } from '../../shared/effects';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetKrom — "Likit Krom" sünnet yorumu: gece mavisi metal, buz mavisi–turkuaz yansımalar.
 *
 * Başlık `bg-clip-text` ile metalik degradeden kesilir; şehzade mavisi
 * burada boya olarak değil, yüzeyden yansıyan ışık olarak davranır.
 */
const SUNNET_KROM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#080c16]',
  page: 'text-[#dce4f0]',
  surface: 'bg-white/[0.07] backdrop-blur-2xl backdrop-saturate-150',
  border: 'border-white/16',
  heading:
    'text-transparent bg-clip-text bg-gradient-to-br from-[#eef4ff] via-[#a9c8f0] to-[#7fe0e8]',
  body: 'text-[#8d97ac]',
  accent: 'text-[#8fd0ee]',
  accentBg: 'bg-[#8fd0ee]',
  accentSoft: 'bg-[#8fd0ee]/12',
  input:
    'w-full bg-white/[0.07] border border-white/16 rounded-xl px-3.5 py-2.5 text-sm text-[#e8eefa] placeholder:text-[#7b8398] focus:outline-none focus:border-[#8fd0ee]/60 focus:ring-2 focus:ring-[#8fd0ee]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#dcecff] via-[#a9c8f0] to-[#7fe0e8] hover:brightness-110 text-[#0a1018] shadow-lg shadow-[#7fe0e8]/20',
  buttonGhost:
    'border border-white/18 text-[#dce4f0] hover:bg-white/[0.08] hover:border-white/32',
  divider: 'bg-white/14',
  timelineLine: 'from-[#8fd0ee] via-[#a9c8f0]/50 to-transparent'
};

export function SunnetKrom({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_KROM_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(150deg, #142138 0%, #0b1220 55%, #06090f 100%)"
          scrim={{ from: 'both', strength: 0.42 }}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              <Iridescent opacity={0.32} duration={17} className="mix-blend-soft-light" />
              <Halo color="143,208,238" size={64} x={50} y={40} opacity={0.22} duration={10} />
            </>
          }
          particles={[
            {
              preset: 'streaks',
              colors: ['#8fd0ee', '#a9c8f0', '#7fe0e8'],
              blend: 'screen',
              density: 0.7,
              speed: 0.6,
              opacity: 0.3,
              depth: 0.5,
              seed: 141
            },
            {
              preset: 'stardust',
              colors: ['#ffffff', '#a9c8f0'],
              blend: 'screen',
              density: 0.5,
              speed: 0.4,
              opacity: 0.55,
              pointerStrength: 1.5,
              depth: 1,
              seed: 142
            }
          ]}
          grain={0.03}
          fadeTo="#080c16"
        />
      )}
    />
  );
}
