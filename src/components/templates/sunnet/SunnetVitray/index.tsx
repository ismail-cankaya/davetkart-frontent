import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { VitrayHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetVitray — "Vitray Işık" sünnet yorumu: zümrüt–altın–çini mavisi camlar.
 *
 * Üçlü palet doğrudan çini geleneğinden alındı; kemer formu zaten aynı
 * mimarinin dili olduğu için kategoriyle en doğal örtüşen sürüm bu.
 */
const SUNNET_VITRAY_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#050e1a]',
  page: 'text-[#d8e4e0]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#eef6f2]',
  body: 'text-[#83938f]',
  accent: 'text-[#3fa88f]',
  accentBg: 'bg-[#3fa88f]',
  accentSoft: 'bg-[#3fa88f]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#eef6f2] placeholder:text-[#83938f] focus:outline-none focus:border-[#3fa88f]/60 focus:ring-2 focus:ring-[#3fa88f]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#3fa88f] to-[#e2b558] hover:brightness-110 text-[#04140f] shadow-lg shadow-[#3fa88f]/20',
  buttonGhost:
    'border border-white/16 text-[#d8e4e0] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#3fa88f] via-[#e2b558]/45 to-transparent'
};

export function SunnetVitray({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_VITRAY_THEME}
      renderHero={(props) => (
        <VitrayHero {...props} glass={['#1f7a6a', '#e2b558', '#2b5fa8']} glow="#e2b558" seed={43} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 28%, #0f2c3a 0%, #081826 55%, #040a10 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <GodRays color="226,181,88" angle={15} count={6} origin={50} opacity={0.28} duration={16} />
              <Halo color="63,168,143" size={58} x={50} y={30} opacity={0.2} duration={12} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', '#e2b558'],
              blend: 'screen',
              density: 0.45,
              speed: 0.28,
              opacity: 0.45,
              pointerStrength: 1.1,
              depth: 1,
              seed: 343
            }
          ]}
          parallax={8}
          grain={0.03}
          fadeTo="#050e1a"
        />
      )}
    />
  );
}
