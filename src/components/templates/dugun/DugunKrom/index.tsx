import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Iridescent, Halo } from '../../shared/effects';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DugunKrom — "Likit Krom": iridesan metalik degrade, sıvı yansımalar.
 *
 * Başlık `bg-clip-text` ile degradeden kesilir; düz renk yerine metal
 * yüzeyin kendisi harflerin içinden geçer. Krom hissini tek başına bu
 * taşır — arka planı iridesan yapıp tipografiyi düz bırakmak, malzemeyi
 * "arkasında duran bir poster" gibi gösterirdi.
 */
const DUGUN_KROM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0a0b10]',
  page: 'text-[#dfe3ee]',
  surface: 'bg-white/[0.07] backdrop-blur-2xl backdrop-saturate-150',
  border: 'border-white/16',
  heading:
    'text-transparent bg-clip-text bg-gradient-to-br from-[#f2f6ff] via-[#c9b8f0] to-[#9fd6f5]',
  body: 'text-[#98a0b8]',
  accent: 'text-[#b9c8f5]',
  accentBg: 'bg-[#b9c8f5]',
  accentSoft: 'bg-[#b9c8f5]/12',
  input:
    'w-full bg-white/[0.07] border border-white/16 rounded-xl px-3.5 py-2.5 text-sm text-[#eaeef8] placeholder:text-[#7d859c] focus:outline-none focus:border-[#b9c8f5]/60 focus:ring-2 focus:ring-[#b9c8f5]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#dfe6ff] via-[#c9b8f0] to-[#9fd6f5] hover:brightness-110 text-[#0d1018] shadow-lg shadow-[#9fd6f5]/20',
  buttonGhost:
    'border border-white/18 text-[#dfe3ee] hover:bg-white/[0.08] hover:border-white/32',
  divider: 'bg-white/14',
  timelineLine: 'from-[#b9c8f5] via-[#c9b8f0]/50 to-transparent'
};

export function DugunKrom({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_KROM_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(150deg, #161a2b 0%, #0d1018 55%, #07080d 100%)"
          scrim={{ from: 'both', strength: 0.42 }}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              {/* soft-light: iridesan katman zemini boyamaz, üstünde parlar. */}
              <Iridescent opacity={0.34} duration={16} className="mix-blend-soft-light" />
              <Halo color="185,200,245" size={64} x={50} y={40} opacity={0.22} duration={10} />
            </>
          }
          particles={[
            {
              preset: 'streaks',
              colors: ['#b9c8f5', '#e0c3fc', '#9fd6f5'],
              blend: 'screen',
              density: 0.7,
              speed: 0.6,
              opacity: 0.3,
              depth: 0.5,
              seed: 105
            },
            {
              preset: 'stardust',
              colors: ['#ffffff', '#c9b8f0'],
              blend: 'screen',
              density: 0.5,
              speed: 0.4,
              opacity: 0.55,
              pointerStrength: 1.5,
              depth: 1,
              seed: 106
            }
          ]}
          grain={0.03}
          fadeTo="#0a0b10"
        />
      )}
    />
  );
}
