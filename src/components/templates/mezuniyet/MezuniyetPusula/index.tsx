import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo, LightLeak, Ridges } from '../../shared/effects';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * MezuniyetPusula — Konsept 3, "Yolculuk ve Keşif": antika dünya haritası,
 * altın pusula ve merkezde ışık kapısına dönüşen bir ışık topu.
 *
 * Merkezdeki Halo bu şablonda dekoratif değil, anlatının kendisi: ışık
 * kapısı orada açılır. Bu yüzden nefes periyodu (duration) diğerlerinden
 * uzun tutuldu — kapı yanıp sönmüyor, genişliyor.
 */
const PUSULA_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#161208]',
  page: 'text-[#eae0c8]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-[#d9b45c]/22',
  heading: 'text-[#fbf3dd]',
  body: 'text-[#a8987c]',
  accent: 'text-[#d9b45c]',
  accentBg: 'bg-[#d9b45c]',
  accentSoft: 'bg-[#d9b45c]/10',
  input:
    'w-full bg-white/[0.06] border border-[#d9b45c]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#f4ecd8] placeholder:text-[#8d8168] focus:outline-none focus:border-[#d9b45c]/60 focus:ring-2 focus:ring-[#d9b45c]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#d9b45c] to-[#efd493] hover:from-[#e4c273] hover:to-[#f6e2ab] text-[#1c1509] shadow-lg shadow-[#d9b45c]/20',
  buttonGhost:
    'border border-[#d9b45c]/25 text-[#eae0c8] hover:bg-[#d9b45c]/10 hover:border-[#d9b45c]/45',
  divider: 'bg-[#d9b45c]/18',
  timelineLine: 'from-[#d9b45c] via-[#d9b45c]/40 to-transparent'
};

export function MezuniyetPusula({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={PUSULA_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 75% 60% at 50% 48%, #4a3a18 0%, #221a0c 55%, #100c05 100%)"
          scrim={{ from: 'both', strength: 0.42 }}
          vignette={{ strength: 0.6 }}
          atmosphere={
            <>
              {/* Keşfedilecek uzak diyarlar: çok soluk, çok alçak ufuk. */}
              <Ridges color="92,70,34" opacity={0.34} height={0.24} layers={3} roughness={0.7} seed={47} />
              {/* Işık kapısı: yavaş ve geniş nefes. Ufkun ÜSTÜNDE durur —
                  yolculuğun varış noktası ufkun ötesinde açılıyor. */}
              <Halo color="245,220,150" size={54} x={50} y={46} opacity={0.44} duration={13} />
              <LightLeak color="255,236,180" opacity={0.32} duration={16} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#d9b45c', '#f6e6b8', '#ffffff'],
              blend: 'screen',
              density: 0.85,
              speed: 0.55,
              opacity: 0.8,
              pointerStrength: 1.5,
              depth: 1,
              seed: 46
            },
            // Kapıdan dışarı sızan ışık çizgileri.
            {
              preset: 'streaks',
              colors: ['#f0d79a', '#d9b45c'],
              blend: 'screen',
              density: 0.5,
              speed: 0.5,
              opacity: 0.28,
              depth: 0.35,
              seed: 95
            }
          ]}
          fadeTo="#161208"
        />
      )}
    />
  );
}
