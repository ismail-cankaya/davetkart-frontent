import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { VitrayHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DugunVitray — "Vitray Işık" düğün yorumu: gül–şampanya–lila camlar, arkadan vuran öğle ışığı.
 *
 * Nikâh mekânının penceresinden süzülen ışık fikri; kemer ve gül pencere
 * kompozisyonun tamamını taşıdığı için ayrıca bir çerçeve süsü yok.
 */
const DUGUN_VITRAY_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0e0a12]',
  page: 'text-[#e4dbe4]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f8f0f4]',
  body: 'text-[#948a9c]',
  accent: 'text-[#dda3b6]',
  accentBg: 'bg-[#dda3b6]',
  accentSoft: 'bg-[#dda3b6]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f8f0f4] placeholder:text-[#948a9c] focus:outline-none focus:border-[#dda3b6]/60 focus:ring-2 focus:ring-[#dda3b6]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#dda3b6] to-[#e8c88a] hover:brightness-110 text-[#1a0f16] shadow-lg shadow-[#dda3b6]/20',
  buttonGhost:
    'border border-white/16 text-[#e4dbe4] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#dda3b6] via-[#e8c88a]/45 to-transparent'
};

export function DugunVitray({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_VITRAY_THEME}
      renderHero={(props) => (
        <VitrayHero {...props} glass={['#d98fa8', '#e8c88a', '#8f7fc4']} glow="#e8c88a" seed={31} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 28%, #241a2c 0%, #140e1a 55%, #0a070e 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              {/* Huzmeler pencerenin ardındaki ışığı odanın içine taşır. */}
              <GodRays color="232,200,138" angle={14} count={6} origin={50} opacity={0.28} duration={16} />
              <Halo color="221,163,182" size={58} x={50} y={30} opacity={0.2} duration={12} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', '#e8c88a'],
              blend: 'screen',
              density: 0.45,
              speed: 0.28,
              opacity: 0.45,
              pointerStrength: 1.1,
              depth: 1,
              seed: 331
            }
          ]}
          parallax={8}
          grain={0.03}
          fadeTo="#0e0a12"
        />
      )}
    />
  );
}
