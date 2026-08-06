import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Iridescent, Halo } from '../../shared/effects';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * PartiKrom — "Likit Krom": iridesan metal tipografi. Partinin görsel enerjisini degradeyle değil YÜZEYLE kurar.
 */
const PARTI_KROM_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0a0714]',
  page: 'text-[#e6dff2]',
  surface: 'bg-white/[0.06] backdrop-blur-xl',
  border: 'border-white/12',
  heading: 'text-transparent bg-clip-text bg-gradient-to-br from-[#fdf4ff] via-[#e0a8fc] to-[#8ab6f5]',
  body: 'text-[#9a90b0]',
  accent: 'text-[#c084fc]',
  accentBg: 'bg-[#c084fc]',
  accentSoft: 'bg-[#c084fc]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#faf7ff] placeholder:text-[#9a90b0] focus:outline-none focus:border-[#c084fc]/60 focus:ring-2 focus:ring-[#c084fc]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#f0d4ff] via-[#c084fc] to-[#8ab6f5] hover:brightness-110 text-[#12081c] shadow-lg shadow-[#c084fc]/22',
  buttonGhost:
    'border border-white/16 text-[#e6dff2] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#c084fc] via-[#8ab6f5]/50 to-transparent'
};

export function PartiKrom({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_KROM_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(150deg, #241338 0%, #120a1e 55%, #08040e 100%)"
          scrim={{ from: 'both', strength: 0.42 }}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              <Iridescent opacity={0.3} duration={16} className="mix-blend-soft-light [filter:hue-rotate(280deg)]" />
              <Halo color="192,132,252" size={62} x={50} y={40} opacity={0.22} duration={10} />
            </>
          }
          particles={[
            {
              preset: 'streaks',
              colors: ['#c084fc', '#8ab6f5', '#f0d4ff'],
              blend: 'screen',
              density: 0.7,
              speed: 0.6,
              opacity: 0.3,
              depth: 0.5,
              seed: 201
            },
            {
              preset: 'stardust',
              colors: ['#ffffff', '#e0a8fc'],
              blend: 'screen',
              density: 0.7,
              speed: 0.45,
              opacity: 0.7,
              pointerStrength: 1.4,
              depth: 1,
              seed: 202
            }
          ]}
          parallax={9}
          grain={0.03}
          fadeTo="#0a0714"
        />
      )}
    />
  );
}
