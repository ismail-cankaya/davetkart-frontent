import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh, Halo } from '../../shared/effects';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaAurora — "Aurora Cam" kına yorumu: yakut, fuşya ve kehribar mesh'i.
 *
 * Kına gecesinin geleneksel bordo–altın paletini soyut mesh diline çevirir:
 * motif ve tül yerine saf renk kütlesi. Geleneksel şablonların yanında
 * duran modern alternatif.
 */
const KINA_AURORA_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#140610]',
  page: 'text-[#f0dde4]',
  surface: 'bg-white/[0.07] backdrop-blur-2xl backdrop-saturate-150',
  border: 'border-white/14',
  heading: 'text-[#fdf2f6]',
  body: 'text-[#b490a0]',
  accent: 'text-[#f0b775]',
  accentBg: 'bg-[#f0b775]',
  accentSoft: 'bg-[#f0b775]/12',
  input:
    'w-full bg-white/[0.07] border border-white/14 rounded-lg px-3.5 py-2.5 text-sm text-[#f8e9ef] placeholder:text-[#9c7a89] focus:outline-none focus:border-[#f0b775]/60 focus:ring-2 focus:ring-[#f0b775]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#f0b775] to-[#e0568c] hover:from-[#f4c68d] hover:to-[#e86d9c] text-[#1a0710] shadow-lg shadow-[#e0568c]/25',
  buttonGhost:
    'border border-white/16 text-[#f0dde4] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f0b775] via-[#e0568c]/50 to-transparent'
};

export function KinaAurora({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_AURORA_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 110% 90% at 50% 22%, #3a0c22 0%, #1b0713 55%, #0d0409 100%)"
          scrim={{ from: 'both', strength: 0.32 }}
          vignette={{ strength: 0.48 }}
          atmosphere={
            <>
              <AuroraMesh colors={['224,86,140', '240,183,117', '158,42,90']} opacity={0.62} duration={25} />
              <Halo color="240,183,117" size={60} x={50} y={40} opacity={0.24} duration={11} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#f0b775', '#ffffff', '#e0568c'],
              blend: 'screen',
              density: 0.7,
              speed: 0.45,
              opacity: 0.7,
              pointerStrength: 1.4,
              depth: 1,
              seed: 121
            }
          ]}
          grain={0.03}
          fadeTo="#140610"
        />
      )}
    />
  );
}
