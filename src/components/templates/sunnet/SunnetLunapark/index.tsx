import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo, LightLeak, Spires } from '../../shared/effects';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetLunapark — Konsept 3, "Eğlenceli Lunapark": rengarenk dönen dönme
 * dolap ve atlıkarınca, aşağıdan yükselen konfeti ve baloncuklar.
 *
 * Konfeti burada TERS yönde kullanılmıyor — motorun konfetisi düşer, çünkü
 * lunapark ışıkları zaten yukarı doğru hareket eder; iki yönün çakışması
 * kadrajı okunmaz hale getirirdi. Yükselen hareketi kabarcıklar taşıyor.
 */
const LUNAPARK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0d0a1c]',
  page: 'text-[#e6e0f4]',
  surface: 'bg-white/[0.07] backdrop-blur-md',
  border: 'border-[#7c6bd6]/25',
  heading: 'text-[#fbf7ff]',
  body: 'text-[#9a91b8]',
  accent: 'text-[#ffb547]',
  accentBg: 'bg-[#ffb547]',
  accentSoft: 'bg-[#ffb547]/12',
  input:
    'w-full bg-white/[0.07] border border-[#7c6bd6]/25 rounded-lg px-3.5 py-2.5 text-sm text-[#efeafc] placeholder:text-[#837aa0] focus:outline-none focus:border-[#ffb547]/60 focus:ring-2 focus:ring-[#ffb547]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#ffb547] hover:bg-[#ffc468] text-[#241505] shadow-lg shadow-[#ffb547]/25',
  buttonGhost:
    'border border-[#7c6bd6]/30 text-[#e6e0f4] hover:bg-[#7c6bd6]/12 hover:border-[#7c6bd6]/50',
  divider: 'bg-[#7c6bd6]/20',
  timelineLine: 'from-[#ffb547] via-[#7c6bd6]/50 to-transparent'
};

export function SunnetLunapark({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={LUNAPARK_THEME}
      renderHeroBackground={() => (
        <HeroStage
          // İki katman: altta lunaparkın ışık kubbesi (sıcak turuncu),
          // üstte gece moru. Silueti okunur kılan şey arkasındaki bu parlak
          // bant — koyu siluet koyu zeminde kaybolurdu.
          base="radial-gradient(ellipse 70% 34% at 50% 96%, rgba(255,150,60,0.55) 0%, rgba(255,120,40,0) 72%), radial-gradient(ellipse 90% 75% at 50% 32%, #33236e 0%, #180f3a 55%, #0b0820 100%)"
          scrim={{ from: 'both', strength: 0.46 }}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              <Halo color="255,181,71" size={72} x={50} y={36} opacity={0.32} duration={6} />
              {/* Lunapark silueti: konik çadır ve kule çatıları. Ortadakiler
                  daha yüksek (dönme dolap), kenarlar alçalıyor. */}
              <Spires color="9,6,22" opacity={0.95} height={0.5} count={9} roofs="cone" seed={53} />
              <LightLeak color="255,190,120" opacity={0.35} duration={9} />
            </>
          }
          particles={[
            // Aşağıdan yükselen renkli baloncuklar.
            {
              preset: 'bubbles',
              colors: ['#ffb547', '#ff6f91', '#57d2f0', '#b98cff'],
              density: 1.1,
              speed: 0.95,
              opacity: 0.75,
              depth: 1,
              seed: 13
            },
            // Üstten dökülen altın konfeti — kutlama katmanı.
            {
              preset: 'confetti',
              colors: ['#ffd166', '#ffb547', '#fff3cd'],
              density: 0.7,
              speed: 0.9,
              opacity: 0.8,
              depth: 0.7,
              seed: 66
            }
          ]}
          fadeTo="#0d0a1c"
        />
      )}
    />
  );
}
