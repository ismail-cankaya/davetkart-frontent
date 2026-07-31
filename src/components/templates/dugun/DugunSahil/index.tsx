import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, LightLeak } from '../../shared/effects';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * Ufuk çizgisi karenin ~%57'sinde. Dikeyde merkeze alınırsa güneş kırpılır;
 * odak yukarı çekilerek altın patlama her iki kadrajda da korunur.
 */
const VIDEO = videoSet('dugun-sahil', { landscape: '50% 55%', portrait: '50% 48%' });

/**
 * DugunSahil — Konsept 1, "Sinematik Sahil": gün batımında deniz, ufukta
 * eriyen altın, üstte süzülen ışık tozu.
 *
 * Palet doğrudan videodan türetildi: gökyüzünün mürdüm laciverti zemin,
 * ufuk çizgisinin sıcak altını vurgu. Video koyu olduğu için tipografi
 * açık — kontrast videonun kendi ışığından geliyor, scrim'i zorlamıyoruz.
 */
const SAHIL_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#171526]',
  page: 'text-[#e4dbd2]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/10',
  heading: 'text-[#fbf2e4]',
  body: 'text-[#a99a92]',
  accent: 'text-[#f0b46a]',
  accentBg: 'bg-[#f0b46a]',
  accentSoft: 'bg-[#f0b46a]/10',
  input:
    'w-full bg-white/[0.06] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#f3e9dc] placeholder:text-[#847668] focus:outline-none focus:border-[#f0b46a]/50 focus:ring-2 focus:ring-[#f0b46a]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#f0b46a] hover:bg-[#f6c384] text-[#2a1d13] shadow-lg shadow-[#f0b46a]/20',
  buttonGhost:
    'border border-white/15 text-[#e4dbd2] hover:bg-white/5 hover:border-white/25',
  divider: 'bg-white/10',
  timelineLine: 'from-[#f0b46a] via-[#f0b46a]/40 to-transparent'
};

export function DugunSahil({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={SAHIL_THEME}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="linear-gradient(to bottom, #1d2247 0%, #6b4a63 38%, #f0b46a 55%, #4a3f52 75%, #2b2436 100%)"
          // Metin ufuk çizgisinin parlak bandının önüne düşüyor; üst ve alt
          // koyulaştırılıp orta bant korunuyor.
          scrim={{ from: 'both', strength: 0.5 }}
          vignette={{ strength: 0.48 }}
          atmosphere={
            <>
              {/* Huzmeler güneşin gerçek konumundan çıkar — ufkun merkezinden. */}
              <GodRays angle={4} origin={50} count={9} color="255,209,142" opacity={0.4} duration={16} />
              <LightLeak color="255,226,178" opacity={0.35} duration={15} />
            </>
          }
          particles={[
            // Altın ışık tozu: videonun ışığını taşıyan ana efekt.
            {
              preset: 'fairyDust',
              colors: ['#ffd79a', '#f0b46a', '#fff1d6'],
              blend: 'screen',
              density: 1.1,
              speed: 0.85,
              opacity: 0.9,
              depth: 1,
              seed: 11
            },
            // Uzak, çok yavaş ikinci katman — derinlik için parallax'ı düşük.
            {
              preset: 'fairyDust',
              colors: ['#fff4e0'],
              blend: 'screen',
              density: 0.45,
              speed: 0.5,
              opacity: 0.5,
              depth: 0.35,
              seed: 27
            }
          ]}
          fadeTo="#171526"
        />
      )}
    />
  );
}
