import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { VitrayHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { KurumsalFrame } from '../parts/KurumsalFrame';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalVitray — "Vitray Işık" kurumsal yorumu: kobalt, kobalt ışığı ve
 * platin camlar; atriyum penceresi.
 *
 * Palet tek sinyalin üç tonundan kurulu: renk kontrastı düşük tutulduğu için
 * pencere dekoratif değil MİMARİ okunur — kurumsal davetin ölçülü tonu.
 */
const KURUMSAL_VITRAY_THEME = kurumsalTheme({
  id: 'midnight',
  base: 'bg-[#090B12]',
  page: 'text-[#D9DCE4]',
  surface: 'bg-[#12151F]/85 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#F3F4F1]',
  body: 'text-[#A0A6B3]',
  accent: 'text-[#8F9CFF]',
  accentBg: 'bg-[#8F9CFF]',
  accentSoft: 'bg-[#8F9CFF]/12',
  input:
    'w-full bg-white/[0.05] border border-white/14 px-3.5 py-2.5 text-sm text-[#F3F4F1] placeholder:text-[#8A90A0] focus:outline-none focus:border-[#8F9CFF] focus:ring-2 focus:ring-[#8F9CFF]/20 transition duration-300',
  buttonPrimary: 'bg-gradient-to-r from-[#8F9CFF] to-[#C5CBD3] hover:brightness-110 text-[#090B12] shadow-[0_12px_30px_-14px_rgba(143,156,255,0.55)]',
  buttonGhost: 'border border-white/16 text-[#D9DCE4] hover:bg-white/[0.06] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#8F9CFF] via-[#2B3FE0]/45 to-transparent'
});

export function KurumsalVitray({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_VITRAY_THEME}
      renderHero={(props) => (
        <VitrayHero {...props} glass={['#2B3FE0', '#8F9CFF', '#C5CBD3']} glow="#2B3FE0" seed={67} />
      )}
      renderHeroBackground={({ revealed }) => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 28%, #141A33 0%, #0B0E1A 55%, #05060A 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <GodRays color="197,203,211" angle={12} count={6} origin={50} opacity={0.22} duration={18} />
              <Halo color="43,63,224" size={56} x={50} y={30} opacity={0.22} duration={13} />
            </>
          }
          particles={[
            {
              preset: 'haze',
              colors: ['#C5CBD3', '#2B3FE0'],
              blend: 'screen',
              density: 0.4,
              speed: 0.25,
              opacity: 0.32,
              depth: 0.6,
              seed: 367
            }
          ]}
          overlay={<KurumsalFrame color="rgba(243,244,241,0.22)" revealed={revealed} ruler={false} />}
          parallax={8}
          grain={0.028}
          fadeTo="#090B12"
        />
      )}
    />
  );
}
