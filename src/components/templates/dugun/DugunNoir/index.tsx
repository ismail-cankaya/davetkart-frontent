import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { NoirHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DugunNoir — "Noir Minimal": neredeyse siyah zemin, dev serif başlık,
 * şampanya altını saç teli çizgiler.
 *
 * Efekt bütçesi bilinçli olarak en düşük: tek bir sönük hale ve çok seyrek
 * altın toz. Sessiz lüksün mantığı budur — her eklenen öğe başlığın
 * ağırlığından çalar. Parçacık yoğunluğu 0.3, diğer şablonların üçte biri.
 */
const DUGUN_NOIR_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#070707]',
  page: 'text-[#d6d2ca]',
  surface: 'bg-white/[0.035] backdrop-blur-md',
  border: 'border-[#c9a961]/16',
  heading: 'text-[#f4f1ea]',
  body: 'text-[#8a857c]',
  accent: 'text-[#c9a961]',
  accentBg: 'bg-[#c9a961]',
  accentSoft: 'bg-[#c9a961]/10',
  input:
    'w-full bg-white/[0.035] border border-[#c9a961]/16 rounded-none px-3.5 py-2.5 text-sm text-[#ece8e0] placeholder:text-[#75706a] focus:outline-none focus:border-[#c9a961]/55 focus:ring-0 transition-all duration-300',
  // Köşesiz (rounded-none) butonlar: İsviçre tipografisinin sert geometrisi.
  buttonPrimary:
    'rounded-none bg-[#c9a961] hover:bg-[#d8ba76] text-[#0b0a07] shadow-none',
  buttonGhost:
    'rounded-none border border-[#c9a961]/22 text-[#d6d2ca] hover:bg-[#c9a961]/8 hover:border-[#c9a961]/40',
  divider: 'bg-[#c9a961]/18',
  timelineLine: 'from-[#c9a961] via-[#c9a961]/30 to-transparent'
};

export function DugunNoir({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_NOIR_THEME}
      renderHero={(props) => <NoirHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 42%, #131211 0%, #0a0a09 55%, #050505 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="201,169,97" size={54} x={50} y={42} opacity={0.14} duration={14} />}
          particles={[
            {
              preset: 'fairyDust',
              colors: ['#c9a961', '#e6d5a8'],
              blend: 'screen',
              density: 0.3,
              speed: 0.35,
              opacity: 0.42,
              pointerStrength: 0.6,
              depth: 1,
              seed: 103
            }
          ]}
          parallax={8}
          grain={0.038}
          fadeTo="#070707"
        />
      )}
    />
  );
}
