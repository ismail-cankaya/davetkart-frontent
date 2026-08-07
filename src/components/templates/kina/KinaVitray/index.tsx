import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { VitrayHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaVitray — "Vitray Işık" kına yorumu: kızıl–kehribar–erguvan camlar, mum ışığı sıcaklığı.
 *
 * Kına gecesinin renk hafızası (kırmızı örtü, altın işleme) camın içine
 * taşındı; ışık bu kez gündüz değil, akşam mum ışığı sıcaklığında.
 */
const KINA_VITRAY_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#120609]',
  page: 'text-[#ecdcdc]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#fbeef0]',
  body: 'text-[#9c8288]',
  accent: 'text-[#d1587f]',
  accentBg: 'bg-[#d1587f]',
  accentSoft: 'bg-[#d1587f]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#fbeef0] placeholder:text-[#9c8288] focus:outline-none focus:border-[#d1587f]/60 focus:ring-2 focus:ring-[#d1587f]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#d1587f] to-[#e0a75c] hover:brightness-110 text-[#1c0a10] shadow-lg shadow-[#d1587f]/20',
  buttonGhost:
    'border border-white/16 text-[#ecdcdc] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#d1587f] via-[#e0a75c]/45 to-transparent'
};

export function KinaVitray({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_VITRAY_THEME}
      renderHero={(props) => (
        <VitrayHero {...props} glass={['#c2354f', '#e0a75c', '#8a2352']} glow="#e0a75c" seed={37} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 28%, #33101a 0%, #1b0810 55%, #0c0407 100%)"
          scrim={false}
          vignette={{ strength: 0.58 }}
          atmosphere={
            <>
              <GodRays color="224,167,92" angle={16} count={6} origin={50} opacity={0.3} duration={15} />
              <Halo color="209,88,127" size={58} x={50} y={30} opacity={0.22} duration={11} />
            </>
          }
          particles={[
            {
              preset: 'embers',
              colors: ['#e0a75c', '#d1587f'],
              blend: 'screen',
              density: 0.4,
              speed: 0.3,
              opacity: 0.4,
              depth: 1,
              seed: 337
            }
          ]}
          parallax={8}
          grain={0.032}
          fadeTo="#120609"
        />
      )}
    />
  );
}
