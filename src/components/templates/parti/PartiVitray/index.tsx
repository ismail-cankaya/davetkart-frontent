import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { VitrayHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * PartiVitray — "Vitray Işık" parti yorumu: neon katedral. Fuşya–siyan–mor camlar.
 *
 * Aynı kurşun cam geometrisi, kilise paleti yerine kulüp ışığı: camlar
 * gün ışığıyla değil neonla arkadan yandığında ortaya çıkan sürüm.
 */
const PARTI_VITRAY_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#07040f]',
  page: 'text-[#e2dcee]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f2f0fa]',
  body: 'text-[#8b849c]',
  accent: 'text-[#22d3ee]',
  accentBg: 'bg-[#22d3ee]',
  accentSoft: 'bg-[#22d3ee]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f2f0fa] placeholder:text-[#8b849c] focus:outline-none focus:border-[#22d3ee]/60 focus:ring-2 focus:ring-[#22d3ee]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#22d3ee] to-[#ff3d81] hover:brightness-110 text-[#07040f] shadow-lg shadow-[#22d3ee]/25',
  buttonGhost:
    'border border-white/16 text-[#e2dcee] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#22d3ee] via-[#a855f7]/45 to-transparent'
};

export function PartiVitray({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_VITRAY_THEME}
      renderHero={(props) => (
        <VitrayHero {...props} glass={['#ff3d81', '#22d3ee', '#a855f7']} glow="#22d3ee" seed={61} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 28%, #1d0b3a 0%, #0f0620 55%, #05030b 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <GodRays color="34,211,238" angle={14} count={7} origin={50} opacity={0.3} duration={13} />
              <Halo color="255,61,129" size={58} x={50} y={30} opacity={0.24} duration={10} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#22d3ee', '#ff3d81', '#a855f7'],
              blend: 'screen',
              density: 0.55,
              speed: 0.4,
              opacity: 0.5,
              pointerStrength: 1.4,
              depth: 1,
              seed: 361
            }
          ]}
          parallax={9}
          grain={0.03}
          fadeTo="#07040f"
        />
      )}
    />
  );
}
