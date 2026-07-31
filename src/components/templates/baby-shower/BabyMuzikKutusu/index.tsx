import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo, LightLeak, Arches, SilkVeil } from '../../shared/effects';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * BabyMuzikKutusu — Konsept 2, "Nostaljik Müzik Kutusu": el yapımı ahşap
 * atlıkarıncanın yavaş dönüşü, etrafında süzülen yıldız tozu.
 *
 * Yıldız tozunun işaretçi çekimi (pointerStrength) burada en yüksek
 * değerinde: kullanıcı fareyi gezdirdiğinde toz müzik kutusunun etrafında
 * peşinden sürükleniyor. Konseptin "sihirli" hissini bu tek etkileşim taşıyor.
 */
const MUZIK_THEME: SectionTheme = {
  id: 'stone',
  base: 'theme-cormorant bg-[#f8f1ea]',
  page: 'text-[#6b584c]',
  surface: 'bg-white/78 backdrop-blur-md',
  border: 'border-[#ecdcc9]',
  heading: 'text-[#4c3d33]',
  body: 'text-[#9c8878]',
  accent: 'text-[#c98f6a]',
  accentBg: 'bg-[#c98f6a]',
  accentSoft: 'bg-[#c98f6a]/12',
  input:
    'w-full bg-white/88 border border-[#ecdcc9] rounded-lg px-3.5 py-2.5 text-sm text-[#6b584c] placeholder:text-[#bba895] focus:outline-none focus:border-[#c98f6a] focus:ring-2 focus:ring-[#c98f6a]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#a9704f] hover:bg-[#ba8161] text-[#fdf6ef] shadow-lg shadow-[#a9704f]/18',
  buttonGhost:
    'border border-[#e0cab2] text-[#87705f] hover:bg-[#f3e6d8] hover:border-[#ceb195]',
  divider: 'bg-[#ecdcc9]',
  timelineLine: 'from-[#c98f6a] via-[#e2c8ad]/60 to-transparent'
};

export function BabyMuzikKutusu({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={MUZIK_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 78% 65% at 50% 48%, #fbf3ea 0%, #f0e0cd 60%, #e3cdb4 100%)"
          scrim={{ from: 'both', strength: 0.38, tint: '255,252,246' }}
          vignette={{ strength: 0.24, tint: '130,95,70' }}
          atmosphere={
            <>
              <Halo color="255,232,200" size={70} x={50} y={44} opacity={0.52} duration={9} />
              {/* Atlıkarıncanın kubbeli tentesi: soğan kemer sırası, çok
                  düşük opaklıkta — ahşap oyuncağın silueti, mimarisi değil. */}
              <Arches color="150,106,74" opacity={0.22} count={7} pointed={false} seed={43} />
              {/* Tentenin kumaş dalgası. */}
              <SilkVeil color="214,164,120" opacity={0.3} duration={19} />
              <LightLeak color="255,240,220" opacity={0.32} duration={14} />
            </>
          }
          particles={[
            // İmleci en güçlü izleyen katman — konseptin etkileşim anı.
            {
              preset: 'stardust',
              colors: ['#c98f6a', '#e8c49a', '#fff3e0'],
              density: 1,
              speed: 0.5,
              opacity: 0.8,
              pointerStrength: 1.8,
              depth: 1,
              seed: 31
            }
          ]}
          grain={0.02}
          fadeTo="#f8f1ea"
        />
      )}
    />
  );
}
