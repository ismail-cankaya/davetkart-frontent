import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, AuroraMesh, Halo } from '../../shared/effects';
import { KURUMSAL_FLAVOR } from '../flavors';
import { KurumsalHero } from '../parts/KurumsalHero';
import { KurumsalFrame } from '../parts/KurumsalFrame';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalAurora — "Aurora Cam" kurumsal yorumu: lansman gecesi. Kobalt ve
 * platin ışık perdesi, künye sahnenin ekseninde.
 *
 * Diğer kategorilerin aurorası mor–pembe; burada palet tek sinyalin
 * tonlarından kurulu, ışık süs değil sahne aydınlatması gibi okunur.
 */
const KURUMSAL_AURORA_THEME = kurumsalTheme({
  id: 'midnight',
  base: 'bg-[#08090F]',
  page: 'text-[#DADCE6]',
  surface: 'bg-[#11131E]/85 backdrop-blur-xl',
  border: 'border-white/12',
  heading: 'text-[#F3F4F1]',
  body: 'text-[#B4B9C9]',
  accent: 'text-[#8F9CFF]',
  accentBg: 'bg-[#8F9CFF]',
  accentSoft: 'bg-[#8F9CFF]/12',
  input:
    'w-full bg-white/[0.05] border border-white/14 px-3.5 py-2.5 text-sm text-[#F3F4F1] placeholder:text-[#8A8FA2] focus:outline-none focus:border-[#8F9CFF] focus:ring-2 focus:ring-[#8F9CFF]/20 transition duration-300',
  buttonPrimary: 'bg-gradient-to-r from-[#8F9CFF] to-[#C5CBD3] hover:brightness-110 text-[#08090F] shadow-[0_12px_30px_-14px_rgba(143,156,255,0.6)]',
  buttonGhost: 'border border-white/16 text-[#DADCE6] hover:bg-white/[0.06] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#8F9CFF] via-[#C5CBD3]/40 to-transparent'
});

export function KurumsalAurora({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_AURORA_THEME}
      renderHero={(props) => <KurumsalHero {...props} align="center" />}
      renderHeroBackground={({ revealed }) => (
        <HeroStage
          base="radial-gradient(ellipse 110% 90% at 50% 18%, #161C48 0%, #0B0D20 55%, #06070D 100%)"
          scrim={{ from: 'both', strength: 0.32 }}
          vignette={{ strength: 0.45 }}
          atmosphere={
            <>
              <AuroraMesh colors={['43,63,224', '143,156,255', '197,203,211']} opacity={0.38} duration={26} />
              <Halo color="143,156,255" size={60} x={50} y={36} opacity={0.22} duration={11} />
            </>
          }
          particles={[
            {
              preset: 'stardust',
              colors: ['#F3F4F1', '#8F9CFF', '#C5CBD3'],
              blend: 'screen',
              density: 0.55,
              speed: 0.4,
              opacity: 0.6,
              pointerStrength: 1.2,
              depth: 1,
              seed: 311
            }
          ]}
          overlay={<KurumsalFrame color="rgba(243,244,241,0.26)" revealed={revealed} />}
          parallax={7}
          grain={0.03}
          fadeTo="#08090F"
        />
      )}
    />
  );
}
