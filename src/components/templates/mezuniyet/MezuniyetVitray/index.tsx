import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { VitrayHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * MezuniyetVitray — "Vitray Işık" mezuniyet yorumu: üniversite şapeli. Lacivert–altın–bordo camlar.
 *
 * Arma renkleri (lacivert gövde, altın yaldız, bordo şerit) doğrudan cam
 * paletine çevrildi; mezuniyetin tören tarafını taşıyan sürüm bu.
 */
const MEZUNIYET_VITRAY_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#080c18]',
  page: 'text-[#dbe1ec]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f0f3fa]',
  body: 'text-[#87909f]',
  accent: 'text-[#9fb8e8]',
  accentBg: 'bg-[#9fb8e8]',
  accentSoft: 'bg-[#9fb8e8]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f0f3fa] placeholder:text-[#87909f] focus:outline-none focus:border-[#9fb8e8]/60 focus:ring-2 focus:ring-[#9fb8e8]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#9fb8e8] to-[#d4af5f] hover:brightness-110 text-[#0a0f1c] shadow-lg shadow-[#9fb8e8]/20',
  buttonGhost:
    'border border-white/16 text-[#dbe1ec] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#9fb8e8] via-[#d4af5f]/45 to-transparent'
};

export function MezuniyetVitray({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_VITRAY_THEME}
      renderHero={(props) => (
        <VitrayHero {...props} glass={['#1e3a6e', '#d4af5f', '#8c2b3a']} glow="#d4af5f" seed={53} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 28%, #16224a 0%, #0c1226 55%, #05070f 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <GodRays color="212,175,95" angle={15} count={6} origin={50} opacity={0.3} duration={16} />
              <Halo color="159,184,232" size={58} x={50} y={30} opacity={0.2} duration={12} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#ffffff', '#d4af5f'],
              blend: 'screen',
              density: 0.45,
              speed: 0.28,
              opacity: 0.45,
              pointerStrength: 1.1,
              depth: 1,
              seed: 353
            }
          ]}
          parallax={8}
          grain={0.03}
          fadeTo="#080c18"
        />
      )}
    />
  );
}
