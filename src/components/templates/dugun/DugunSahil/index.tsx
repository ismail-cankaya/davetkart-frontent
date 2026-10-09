import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { HeroStage, GodRays, LightLeak } from '../../shared/effects';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';

/**
 * Ufuk çizgisi karenin ~%57'sinde. Dikeyde merkeze alınırsa güneş kırpılır;
 * odak yukarı çekilerek ışık patlaması her iki kadrajda da korunur.
 */
const VIDEO = videoSet('dugun-sahil', { landscape: '50% 55%', portrait: '50% 48%' });

/**
 * DugunSahil — "Sinematik Sahil": gün batımında deniz, ufukta eriyen ışık.
 *
 * Videonun kendi altını ufukta kalır; üstüne binen her şey kategori
 * paletinden: inci-pembe ışık tozu, inci tipografi. Video koyu olduğu için
 * kontrast videonun kendi ışığından ve üst-alt scrim'den gelir.
 */
export function DugunSahil({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunSahil}
      // Altın gök videonun üst yarısını kaplar; açık renk metin bir gece tülü
      // panelin üstünde durur, gün batımı panelin çevresinde parlamaya devam eder.
      renderHero={(props) => (
        <KurdeleHero
          {...props}
          panelClassName="bg-[#171526]/70 backdrop-blur-md border border-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="linear-gradient(to bottom, #1d2247 0%, #6b4a63 38%, #e8a7a0 55%, #4a3f52 75%, #2b2436 100%)"
          // Metin ufuk çizgisinin parlak bandının önüne düşüyor; üst ve alt
          // koyulaştırılır, orta bant ayrıca hafif kısılır.
          scrim={[
            { from: 'both', strength: 0.55 },
            { from: 'center', strength: 0.35, tint: '23,21,38' }
          ]}
          vignette={{ strength: 0.48 }}
          atmosphere={
            <>
              {/* Huzmeler güneşin gerçek konumundan çıkar — ufkun merkezinden. */}
              <GodRays angle={4} origin={50} count={9} color="255,214,206" opacity={0.22} duration={16} />
              <LightLeak color="255,232,238" opacity={0.18} duration={15} />
            </>
          }
          particles={[
            // İnci-pembe ışık tozu: videonun ışığını taşıyan ana efekt.
            {
              preset: 'fairyDust',
              colors: ['#ffe3ec', '#f5c2cf', '#fff7f9'],
              blend: 'screen',
              density: 1.1,
              speed: 0.85,
              opacity: 0.85,
              depth: 1,
              seed: 11
            },
            // Uzak, çok yavaş ikinci katman — derinlik için parallax'ı düşük.
            {
              preset: 'fairyDust',
              colors: ['#f6f0fa'],
              blend: 'screen',
              density: 0.45,
              speed: 0.5,
              opacity: 0.5,
              depth: 0.35,
              seed: 27
            }
          ]}
          // Ufuk bandı: güneşin parladığı orta şerit yatay bir gece perdesiyle
          // kısılır; ufuk silinmez, panelin kenarında parlamaz.
          overlay={
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(23,21,38,0) 22%, rgba(23,21,38,0.45) 42%, rgba(23,21,38,0.45) 72%, rgba(23,21,38,0) 90%)'
              }}
            />
          }
          fadeTo="#171526"
        />
      )}
    />
  );
}
