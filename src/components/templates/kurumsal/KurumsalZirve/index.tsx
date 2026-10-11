import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, GodRays, FogDrift, Halo, Ridges, SunDisc } from '../../shared/effects';
import { KURUMSAL_FLAVOR } from '../flavors';
import { KurumsalHero } from '../parts/KurumsalHero';
import { KurumsalFrame } from '../parts/KurumsalFrame';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalZirve — "Zirve ve Liderlik": kobalt şafakta bulut denizinin
 * üzerine yükselen sırtlar; künye sahnenin ekseninde.
 *
 * Işık çizgileri yukarı ivmelenir — "yükseliş" süs değil, hareketin yönü.
 * Şafak bilerek soğuk: sıcak altın gün doğumu kategorinin değil, düğün
 * ailesinin dili. Vurgu platin.
 */
const ZIRVE_THEME = kurumsalTheme({
  id: 'midnight',
  base: 'bg-[#0C1018]',
  page: 'text-[#DCE0E7]',
  surface: 'bg-[#141925]/85 backdrop-blur-xl',
  border: 'border-white/12',
  heading: 'text-[#F3F4F1]',
  body: 'text-[#BCC2CC]',
  accent: 'text-[#C5CBD3]',
  accentBg: 'bg-[#C5CBD3]',
  accentSoft: 'bg-[#C5CBD3]/12',
  input:
    'w-full bg-white/[0.05] border border-white/14 px-3.5 py-2.5 text-sm text-[#F3F4F1] placeholder:text-[#8B929E] focus:outline-none focus:border-[#C5CBD3] focus:ring-2 focus:ring-[#C5CBD3]/20 transition duration-300',
  buttonPrimary: 'bg-[#E6E9EE] hover:bg-white text-[#0C1018] shadow-[0_12px_30px_-14px_rgba(197,203,211,0.5)]',
  buttonGhost: 'border border-white/16 text-[#DCE0E7] hover:bg-white/[0.06] hover:border-white/30',
  divider: 'bg-white/14',
  timelineLine: 'from-[#C5CBD3] via-[#8F9CFF]/40 to-transparent'
});

export function KurumsalZirve({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={ZIRVE_THEME}
      renderHero={(props) => <KurumsalHero {...props} align="center" />}
      renderHeroBackground={({ revealed }) => (
        <HeroStage
          base="linear-gradient(to bottom, #182345 0%, #2E3754 38%, #1A2133 74%, #0C1018 100%)"
          scrim={{ from: 'both', strength: 0.46 }}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              <GodRays angle={18} origin={54} count={7} color="226,232,255" opacity={0.26} duration={20} />
              <Halo color="143,156,255" size={64} x={54} y={42} opacity={0.24} duration={11} />
              {/* Güneş sırtların ARKASINDA: metnin ardında parlak leke kalmaz. */}
              <SunDisc color="255,236,214" size={5} x={57} y={60} opacity={0.7} />
              <Ridges color="18,24,38" opacity={0.95} height={0.5} layers={4} roughness={1.35} seed={41} />
              <FogDrift color="214,222,240" opacity={0.5} duration={50} />
            </>
          }
          particles={[
            {
              preset: 'streaks',
              colors: ['#C5CBD3', '#8F9CFF', '#F3F4F1'],
              blend: 'screen',
              density: 0.8,
              speed: 0.8,
              opacity: 0.36,
              depth: 1,
              seed: 18
            }
          ]}
          overlay={<KurumsalFrame color="rgba(243,244,241,0.26)" revealed={revealed} />}
          fadeTo="#0C1018"
        />
      )}
    />
  );
}
