import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh, Halo } from '../../shared/effects';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DogumGunuAurora — "Aurora Cam": akışkan renk mesh'i üzerinde cam sayaç. Konfeti klişesine düşmeyen modern kutlama.
 */
const DOGUM_GUNU_AURORA_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#100716]',
  page: 'text-[#f0dff0]',
  surface: 'bg-white/[0.06] backdrop-blur-xl',
  border: 'border-white/12',
  heading: 'text-[#fdf5fd]',
  body: 'text-[#a891ab]',
  accent: 'text-[#ff7ac6]',
  accentBg: 'bg-[#ff7ac6]',
  accentSoft: 'bg-[#ff7ac6]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#fdf5fd] placeholder:text-[#a891ab] focus:outline-none focus:border-[#ff7ac6]/60 focus:ring-2 focus:ring-[#ff7ac6]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#ff7ac6] to-[#a78bfa] hover:brightness-110 text-[#1a0714] shadow-lg shadow-[#ff7ac6]/25',
  buttonGhost:
    'border border-white/16 text-[#f0dff0] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#ff7ac6] via-[#a78bfa]/50 to-transparent'
};

export function DogumGunuAurora({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_AURORA_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 110% 90% at 50% 22%, #2c1140 0%, #160920 55%, #0a0410 100%)"
          scrim={{ from: 'both', strength: 0.3 }}
          vignette={{ strength: 0.45 }}
          atmosphere={
            <>
              <AuroraMesh colors={['255,122,198', '167,139,250', '255,196,120']} opacity={0.6} duration={26} />
              <Halo color="255,122,198" size={62} x={50} y={40} opacity={0.24} duration={11} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', '#ff7ac6', '#ffc478'],
              blend: 'screen',
              density: 0.7,
              speed: 0.45,
              opacity: 0.7,
              pointerStrength: 1.4,
              depth: 1,
              seed: 221
            }
          ]}
          parallax={7}
          grain={0.03}
          fadeTo="#100716"
        />
      )}
    />
  );
}
