import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, FogDrift, Halo, Ridges, SunDisc } from '../../shared/effects';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KurumsalZirve — Konsept 3, "Zirve ve Liderlik": bulutların üzerine yükselen,
 * gün doğumuyla aydınlanan dağ zirveleri.
 *
 * Işık çizgileri (streaks) yukarı doğru ivmelenir ve zirve hattının
 * üzerinde yoğunlaşır — "yükseliş" teması dekoratif bir süs değil,
 * hareketin yönüyle anlatılıyor.
 */
const ZIRVE_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0a0f1a]',
  page: 'text-[#dfe5ef]',
  surface: 'bg-white/[0.06] backdrop-blur-xl',
  border: 'border-[#e0a860]/22',
  heading: 'text-[#f6f9ff]',
  body: 'text-[#8794a6]',
  accent: 'text-[#e8b06a]',
  accentBg: 'bg-[#e8b06a]',
  accentSoft: 'bg-[#e8b06a]/12',
  input:
    'w-full bg-white/[0.06] border border-[#e0a860]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#eef2f9] placeholder:text-[#74808f] focus:outline-none focus:border-[#e8b06a]/60 focus:ring-2 focus:ring-[#e8b06a]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#e8b06a] hover:bg-[#f0c184] text-[#1a1206] shadow-lg shadow-[#e8b06a]/22',
  buttonGhost:
    'border border-[#e0a860]/26 text-[#dfe5ef] hover:bg-[#e0a860]/10 hover:border-[#e0a860]/46',
  divider: 'bg-[#e0a860]/18',
  timelineLine: 'from-[#e8b06a] via-[#6f8bb0]/50 to-transparent'
};

export function KurumsalZirve({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={ZIRVE_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(to bottom, #2a3b58 0%, #6b5a52 42%, #16202f 78%, #0a0f1a 100%)"
          scrim={{ from: 'both', strength: 0.45 }}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              {/* Gün doğumu: yatık açı, tek yönden gelen güçlü ışık. */}
              <GodRays angle={20} origin={56} count={7} color="255,214,160" opacity={0.5} duration={20} />
              <Halo color="232,176,106" size={64} x={54} y={40} opacity={0.3} duration={11} />
              {/* Güneş sırtların ARKASINA konumlanır: hem "dağın ardından
                  doğuş" doğru okunur, hem de metnin arkasındaki parlak leke
                  kalkar — alt satırlar okunabilir kalır. */}
              <SunDisc color="255,196,120" size={6} x={58} y={60} opacity={0.85} />
              {/* Zirveler: 4 katman, yüksek roughness — sivri ve heybetli.
                  Bulut denizi zirvelerin ÜSTÜNE binerek onları yarı yarıya
                  örter; "bulutların üzerine yükselme" teması budur. */}
              <Ridges color="26,38,58" opacity={0.95} height={0.5} layers={4} roughness={1.35} seed={41} />
              <FogDrift color="220,230,245" opacity={0.6} duration={50} />
            </>
          }
          particles={[
            {
              preset: 'streaks',
              colors: ['#e8b06a', '#f2d5a8', '#9fc0e8'],
              blend: 'screen',
              density: 0.9,
              speed: 0.9,
              opacity: 0.42,
              depth: 1,
              seed: 18
            }
          ]}
          fadeTo="#0a0f1a"
        />
      )}
    />
  );
}
