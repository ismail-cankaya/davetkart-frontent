import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { KURUMSAL_FLAVOR } from '../flavors';
import { KurumsalHero } from '../parts/KurumsalHero';
import { KurumsalFrame } from '../parts/KurumsalFrame';
import { RegistrationGrid } from '../parts/RegistrationGrid';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalNetwork — "Dinamik Ağ": grafit zeminde kobalt düğümler; künye
 * sola yaslı, ağ ağırlığını sağ üstte toplar.
 *
 * Bağlantı çizgileri canvas'ta, düğümler arası mesafeye göre saydamlıkla
 * çizilir; işaretçi düğümleri kendine çeker. Altta kayıt artısı ızgarası
 * ağın üzerinde durduğu koordinat düzlemidir.
 */
const NETWORK_THEME = kurumsalTheme({
  id: 'midnight',
  base: 'bg-[#0B0D12]',
  page: 'text-[#DADDE3]',
  surface: 'bg-[#13161D]/85 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#F3F4F1]',
  body: 'text-[#A2A8B0]',
  accent: 'text-[#8F9CFF]',
  accentBg: 'bg-[#8F9CFF]',
  accentSoft: 'bg-[#8F9CFF]/12',
  input:
    'w-full bg-white/[0.05] border border-white/14 px-3.5 py-2.5 text-sm text-[#F3F4F1] placeholder:text-[#8A9099] focus:outline-none focus:border-[#8F9CFF] focus:ring-2 focus:ring-[#8F9CFF]/20 transition duration-300',
  buttonPrimary: 'bg-[#8F9CFF] hover:bg-[#A9B3FF] text-[#0B0D12] shadow-[0_12px_30px_-14px_rgba(143,156,255,0.6)]',
  buttonGhost: 'border border-white/16 text-[#DADDE3] hover:bg-white/[0.06] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#8F9CFF] via-[#8F9CFF]/35 to-transparent'
});

export function KurumsalNetwork({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={NETWORK_THEME}
      renderHero={(props) => <KurumsalHero {...props} align="start" />}
      renderHeroBackground={({ revealed }) => (
        <HeroStage
          base="radial-gradient(ellipse 90% 75% at 72% 28%, #161D3D 0%, #0C0F1A 52%, #08090D 100%)"
          scrim={{ from: 'both', strength: 0.32 }}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              <RegistrationGrid
                color="rgba(143,156,255,0.32)"
                mask="radial-gradient(ellipse 70% 60% at 66% 36%, black 15%, transparent 100%)"
              />
              <Halo color="43,63,224" size={72} x={74} y={30} opacity={0.36} duration={10} />
            </>
          }
          particles={[
            {
              preset: 'network',
              colors: ['#8F9CFF', '#F3F4F1', '#2B3FE0'],
              blend: 'screen',
              density: 0.9,
              speed: 0.7,
              opacity: 0.8,
              pointerStrength: 1.2,
              depth: 1,
              seed: 2
            }
          ]}
          overlay={<KurumsalFrame color="rgba(243,244,241,0.3)" revealed={revealed} />}
          parallax={10}
          fadeTo="#0B0D12"
        />
      )}
    />
  );
}
