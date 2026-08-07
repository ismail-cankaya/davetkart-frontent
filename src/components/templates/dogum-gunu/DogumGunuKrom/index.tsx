import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Iridescent, Halo } from '../../shared/effects';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DogumGunuKrom — "Likit Krom" doğum günü yorumu: disko topu metali, fuşya–turkuaz iridesan.
 *
 * Başlık metalik degradeden kesilir; parti ışığı harflerin içinden geçtiği
 * için ayrıca bir neon çerçeveye gerek kalmaz.
 */
const DOGUM_GUNU_KROM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0c0714]',
  page: 'text-[#e8dcf0]',
  surface: 'bg-white/[0.07] backdrop-blur-2xl backdrop-saturate-150',
  border: 'border-white/16',
  heading:
    'text-transparent bg-clip-text bg-gradient-to-br from-[#fff2fb] via-[#ffb0e0] to-[#8fe6f0]',
  body: 'text-[#9a8fa8]',
  accent: 'text-[#ff9ad5]',
  accentBg: 'bg-[#ff9ad5]',
  accentSoft: 'bg-[#ff9ad5]/12',
  input:
    'w-full bg-white/[0.07] border border-white/16 rounded-xl px-3.5 py-2.5 text-sm text-[#f4e9fa] placeholder:text-[#8a7f98] focus:outline-none focus:border-[#ff9ad5]/60 focus:ring-2 focus:ring-[#ff9ad5]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#ffd6f0] via-[#ff9ad5] to-[#8fe6f0] hover:brightness-110 text-[#150a1c] shadow-lg shadow-[#ff9ad5]/25',
  buttonGhost:
    'border border-white/18 text-[#e8dcf0] hover:bg-white/[0.08] hover:border-white/32',
  divider: 'bg-white/14',
  timelineLine: 'from-[#ff9ad5] via-[#8fe6f0]/50 to-transparent'
};

export function DogumGunuKrom({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_KROM_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(150deg, #2a1140 0%, #150a22 55%, #09050e 100%)"
          scrim={{ from: 'both', strength: 0.4 }}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              <Iridescent opacity={0.38} duration={14} className="mix-blend-soft-light" />
              <Halo color="255,154,213" size={62} x={50} y={40} opacity={0.24} duration={9} />
            </>
          }
          particles={[
            {
              preset: 'streaks',
              colors: ['#ff9ad5', '#c9a6ff', '#8fe6f0'],
              blend: 'screen',
              density: 0.75,
              speed: 0.65,
              opacity: 0.32,
              depth: 0.5,
              seed: 151
            },
            {
              preset: 'stardust',
              colors: ['#ffffff', '#ff9ad5'],
              blend: 'screen',
              density: 0.55,
              speed: 0.45,
              opacity: 0.6,
              pointerStrength: 1.6,
              depth: 1,
              seed: 152
            }
          ]}
          grain={0.03}
          fadeTo="#0c0714"
        />
      )}
    />
  );
}
