import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Iridescent, Halo } from '../../shared/effects';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaKrom — "Likit Krom" kına yorumu: gül altını / bakır iridesan metal.
 *
 * Krom üçlüsünün sıcak ucu. hue-rotate ile aynı iridesan katman bakır–gül
 * tayfına çekiliyor; düğün (lila-mavi) ve nişan (buzul mavisi) yorumlarıyla
 * yan yana konduğunda üçü de anında ayırt ediliyor.
 */
const KINA_KROM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#100809]',
  page: 'text-[#eedfda]',
  surface: 'bg-white/[0.07] backdrop-blur-2xl backdrop-saturate-150',
  border: 'border-white/16',
  heading:
    'text-transparent bg-clip-text bg-gradient-to-br from-[#fff2e8] via-[#f0b9a0] to-[#d98fa8]',
  body: 'text-[#a98d88]',
  accent: 'text-[#f0b9a0]',
  accentBg: 'bg-[#f0b9a0]',
  accentSoft: 'bg-[#f0b9a0]/12',
  input:
    'w-full bg-white/[0.07] border border-white/16 rounded-xl px-3.5 py-2.5 text-sm text-[#f6e8e2] placeholder:text-[#8f7671] focus:outline-none focus:border-[#f0b9a0]/60 focus:ring-2 focus:ring-[#f0b9a0]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#ffeadd] via-[#f0b9a0] to-[#d98fa8] hover:brightness-110 text-[#190c0d] shadow-lg shadow-[#f0b9a0]/20',
  buttonGhost:
    'border border-white/18 text-[#eedfda] hover:bg-white/[0.08] hover:border-white/32',
  divider: 'bg-white/14',
  timelineLine: 'from-[#f0b9a0] via-[#d98fa8]/50 to-transparent'
};

export function KinaKrom({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_KROM_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(150deg, #2b1418 0%, #170a0c 55%, #0c0607 100%)"
          scrim={{ from: 'both', strength: 0.42 }}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              <Iridescent
                opacity={0.32}
                duration={16}
                className="mix-blend-soft-light [filter:hue-rotate(310deg)_saturate(1.15)]"
              />
              <Halo color="240,185,160" size={62} x={50} y={40} opacity={0.22} duration={10} />
            </>
          }
          particles={[
            {
              preset: 'streaks',
              colors: ['#f0b9a0', '#d98fa8', '#ffd9c0'],
              blend: 'screen',
              density: 0.7,
              speed: 0.6,
              opacity: 0.3,
              depth: 0.5,
              seed: 125
            },
            {
              preset: 'stardust',
              colors: ['#ffffff', '#f0b9a0'],
              blend: 'screen',
              density: 0.5,
              speed: 0.4,
              opacity: 0.55,
              pointerStrength: 1.5,
              depth: 1,
              seed: 126
            }
          ]}
          grain={0.03}
          fadeTo="#100809"
        />
      )}
    />
  );
}
