import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GoldSheen, Halo, SilkVeil } from '../../shared/effects';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetMasallah — Konsept 1, "Geleneksel Şölen": altın sırmalı kırmızı
 * "Maşallah" kuşağı, üstten süzülen metalik mavi ve sedefli balonlar.
 *
 * Kuşağın kırmızısı ile balonların mavisi aynı yoğunlukta yarışırsa
 * kompozisyon dağılır. Çözüm: zemin ve tipografi kuşağın kırmızısına
 * bağlandı, mavi yalnızca parçacıklarda yaşıyor.
 */
const MASALLAH_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#180a0d]',
  page: 'text-[#f0dcd2]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-[#e0b662]/22',
  heading: 'text-[#fdf0dd]',
  body: 'text-[#b0928a]',
  accent: 'text-[#e0b662]',
  accentBg: 'bg-[#e0b662]',
  accentSoft: 'bg-[#e0b662]/10',
  input:
    'w-full bg-white/[0.06] border border-[#e0b662]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#f7e8da] placeholder:text-[#8f746c] focus:outline-none focus:border-[#e0b662]/60 focus:ring-2 focus:ring-[#e0b662]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#e0b662] to-[#f0d18d] hover:from-[#e9c477] hover:to-[#f7dea6] text-[#1d0f06] shadow-lg shadow-[#e0b662]/20',
  buttonGhost:
    'border border-[#e0b662]/25 text-[#f0dcd2] hover:bg-[#e0b662]/10 hover:border-[#e0b662]/45',
  divider: 'bg-[#e0b662]/18',
  timelineLine: 'from-[#e0b662] via-[#b4363f]/50 to-transparent'
};

export function SunnetMasallah({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={MASALLAH_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 85% 70% at 50% 40%, #4a1319 0%, #240d11 55%, #140709 100%)"
          scrim={{ from: 'both', strength: 0.44 }}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <Halo color="224,182,98" size={66} x={50} y={38} opacity={0.34} duration={9} />
              {/* Kuşağın kumaşı: kırmızı ipek dalgalanması. Kadrajın tamamını
                  kaplar ama düşük opaklıkta — kuşak metnin arkasında asılı
                  duruyor gibi okunsun, önüne geçmesin. */}
              <SilkVeil color="164,28,44" opacity={0.42} duration={15} />
              {/* Sırma işlemenin üzerinde gezen parlama. */}
              <GoldSheen color="255,224,150" opacity={0.22} duration={8} />
            </>
          }
          particles={[
            // Metalik mavi + sedefli beyaz balonlar: konseptin imzası.
            {
              preset: 'balloons',
              colors: ['#4f83c4', '#7fb2e0', '#f2ece0', '#2f5f9c'],
              density: 1,
              speed: 0.85,
              opacity: 0.9,
              depth: 1,
              seed: 8
            },
            // Sırmadan dökülen altın kıvılcım.
            {
              preset: 'fairyDust',
              colors: ['#e0b662', '#f6dfa8'],
              blend: 'screen',
              density: 0.7,
              speed: 0.7,
              opacity: 0.6,
              depth: 0.5,
              seed: 55
            }
          ]}
          fadeTo="#180a0d"
        />
      )}
    />
  );
}
