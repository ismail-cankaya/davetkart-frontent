import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { NoirHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaNoir — "Noir Minimal" kına yorumu: siyah zemin, yakut kırmızısı vurgu.
 *
 * Üç noir şablonu metaliyle ayrışır: düğün altın, nişan platin, kına yakut.
 * Kına'nın kırmızısı burada dolgu olarak değil yalnızca çizgi ve vurgu
 * rengi olarak kullanılıyor — sessiz lükste renk, alan kaplayarak değil
 * işaret ederek çalışır.
 */
const KINA_NOIR_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#080405]',
  page: 'text-[#d8cccf]',
  surface: 'bg-white/[0.035] backdrop-blur-md',
  border: 'border-[#c0392f]/18',
  heading: 'text-[#f5eff0]',
  body: 'text-[#8b7d80]',
  accent: 'text-[#d9564f]',
  accentBg: 'bg-[#d9564f]',
  accentSoft: 'bg-[#d9564f]/10',
  input:
    'w-full bg-white/[0.035] border border-[#c0392f]/18 rounded-none px-3.5 py-2.5 text-sm text-[#ece2e4] placeholder:text-[#77696c] focus:outline-none focus:border-[#d9564f]/55 focus:ring-0 transition-all duration-300',
  buttonPrimary:
    'rounded-none bg-[#b3323f] hover:bg-[#c64450] text-[#fdf2f3] shadow-none',
  buttonGhost:
    'rounded-none border border-[#c0392f]/25 text-[#d8cccf] hover:bg-[#c0392f]/10 hover:border-[#c0392f]/45',
  divider: 'bg-[#c0392f]/20',
  timelineLine: 'from-[#d9564f] via-[#d9564f]/30 to-transparent'
};

export function KinaNoir({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_NOIR_THEME}
      renderHero={(props) => <NoirHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 42%, #1a0a0b 0%, #0b0506 55%, #050303 100%)"
          scrim={false}
          vignette={{ strength: 0.52 }}
          atmosphere={<Halo color="217,86,79" size={52} x={50} y={42} opacity={0.15} duration={13} />}
          particles={[
            {
              preset: 'embers',
              colors: ['#d9564f', '#f0a06a'],
              blend: 'screen',
              density: 0.3,
              speed: 0.4,
              opacity: 0.45,
              pointerStrength: 0.6,
              depth: 1,
              seed: 123
            }
          ]}
          parallax={8}
          grain={0.038}
          fadeTo="#080405"
        />
      )}
    />
  );
}
