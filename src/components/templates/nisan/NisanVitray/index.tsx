import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { VitrayHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * NisanVitray — "Vitray Işık" nişan yorumu: menekşe–lila–buz mavisi camlar, serin sabah ışığı.
 */
const NISAN_VITRAY_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0a0d1a]',
  page: 'text-[#dcdcec]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f2f2ff]',
  body: 'text-[#8b8ba3]',
  accent: 'text-[#c9b6f2]',
  accentBg: 'bg-[#c9b6f2]',
  accentSoft: 'bg-[#c9b6f2]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f2f2ff] placeholder:text-[#8b8ba3] focus:outline-none focus:border-[#c9b6f2]/60 focus:ring-2 focus:ring-[#c9b6f2]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#c9b6f2] to-[#6fb6e8] hover:brightness-110 text-[#0d1020] shadow-lg shadow-[#c9b6f2]/20',
  buttonGhost:
    'border border-white/16 text-[#dcdcec] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#c9b6f2] via-[#6fb6e8]/45 to-transparent'
};

export function NisanVitray({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_VITRAY_THEME}
      renderHero={(props) => (
        <VitrayHero {...props} glass={['#7c6cf0', '#c9b6f2', '#6fb6e8']} glow="#c9b6f2" seed={41} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 28%, #1c2244 0%, #101428 55%, #07090f 100%)"
          scrim={false}
          vignette={{ strength: 0.52 }}
          atmosphere={
            <>
              <GodRays color="201,182,242" angle={12} count={7} origin={50} opacity={0.26} duration={17} />
              <Halo color="111,182,232" size={58} x={50} y={30} opacity={0.2} duration={12} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', '#c9b6f2', '#6fb6e8'],
              blend: 'screen',
              density: 0.45,
              speed: 0.28,
              opacity: 0.45,
              pointerStrength: 1.1,
              depth: 1,
              seed: 341
            }
          ]}
          parallax={8}
          grain={0.03}
          fadeTo="#0a0d1a"
        />
      )}
    />
  );
}
