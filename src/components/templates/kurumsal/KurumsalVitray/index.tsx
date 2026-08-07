import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { VitrayHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KurumsalVitray — "Vitray Işık" kurumsal yorumu: petrol–çelik–sis camları.
 *
 * Kurumsal sürümde palet üç adet birbirine yakın soğuk tondan kurulu:
 * renk kontrastı düşürüldüğü için pencere dekoratif değil MİMARİ okunuyor —
 * kurumsal davette istenen tam olarak bu ölçülü ton.
 */
const KURUMSAL_VITRAY_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#060a0e]',
  page: 'text-[#d7e0e2]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#eef4f5]',
  body: 'text-[#818e92]',
  accent: 'text-[#3f9e88]',
  accentBg: 'bg-[#3f9e88]',
  accentSoft: 'bg-[#3f9e88]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#eef4f5] placeholder:text-[#818e92] focus:outline-none focus:border-[#3f9e88]/60 focus:ring-2 focus:ring-[#3f9e88]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#3f9e88] to-[#3d7ea6] hover:brightness-110 text-[#04100e] shadow-lg shadow-[#3f9e88]/20',
  buttonGhost:
    'border border-white/16 text-[#d7e0e2] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#3f9e88] via-[#3d7ea6]/45 to-transparent'
};

export function KurumsalVitray({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_VITRAY_THEME}
      renderHero={(props) => (
        <VitrayHero {...props} glass={['#1f7a8c', '#3d7ea6', '#9fb8c9']} glow="#3d7ea6" seed={67} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 28%, #10222c 0%, #08131a 55%, #04080b 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <GodRays color="159,184,201" angle={12} count={6} origin={50} opacity={0.26} duration={18} />
              <Halo color="63,158,136" size={56} x={50} y={30} opacity={0.18} duration={13} />
            </>
          }
          particles={[
            {
              preset: 'haze',
              colors: ['#9fb8c9', '#3d7ea6'],
              blend: 'screen',
              density: 0.4,
              speed: 0.25,
              opacity: 0.35,
              depth: 0.6,
              seed: 367
            }
          ]}
          parallax={8}
          grain={0.028}
          fadeTo="#060a0e"
        />
      )}
    />
  );
}
