import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { VitrayHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DogumGunuVitray — "Vitray Işık" doğum günü yorumu: fuşya–turkuaz–sarı camlar.
 *
 * Katedral paleti yerine şeker rengi bir üçlü: aynı kurşun cam tekniği,
 * ciddiyeti bırakıp neşeye geçtiğinde ortaya çıkan sürüm.
 */
const DOGUM_GUNU_VITRAY_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#120a1c]',
  page: 'text-[#e6dcec]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f6f0fa]',
  body: 'text-[#98899f]',
  accent: 'text-[#48c9d8]',
  accentBg: 'bg-[#48c9d8]',
  accentSoft: 'bg-[#48c9d8]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f6f0fa] placeholder:text-[#98899f] focus:outline-none focus:border-[#48c9d8]/60 focus:ring-2 focus:ring-[#48c9d8]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#48c9d8] to-[#ff6fae] hover:brightness-110 text-[#12061a] shadow-lg shadow-[#48c9d8]/25',
  buttonGhost:
    'border border-white/16 text-[#e6dcec] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#48c9d8] via-[#ff6fae]/45 to-transparent'
};

export function DogumGunuVitray({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_VITRAY_THEME}
      renderHero={(props) => (
        <VitrayHero {...props} glass={['#ff6fae', '#48c9d8', '#ffd166']} glow="#48c9d8" seed={47} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 28%, #2c1440 0%, #170c22 55%, #0a050e 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              <GodRays color="72,201,216" angle={13} count={7} origin={50} opacity={0.26} duration={15} />
              <Halo color="255,111,174" size={58} x={50} y={30} opacity={0.22} duration={11} />
            </>
          }
          particles={[
            {
              preset: 'fairyDust',
              colors: ['#ffd166', '#48c9d8', '#ff6fae'],
              blend: 'screen',
              density: 0.5,
              speed: 0.35,
              opacity: 0.5,
              pointerStrength: 1.2,
              depth: 1,
              seed: 347
            }
          ]}
          parallax={8}
          grain={0.03}
          fadeTo="#120a1c"
        />
      )}
    />
  );
}
