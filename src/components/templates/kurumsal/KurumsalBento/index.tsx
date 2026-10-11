import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { BentoHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { KurumsalFrame } from '../parts/KurumsalFrame';
import { RegistrationGrid } from '../parts/RegistrationGrid';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalBento — "Bento Editorial": kurumsal davetin doğal dili. Kâğıt
 * zeminde 4 px köşeli hücreler, grotesk başlık, kobalt sinyal; program,
 * konum ve kayıt bilgisi hücre alanıyla hiyerarşiye giriyor.
 */
const KURUMSAL_BENTO_THEME = kurumsalTheme({
  id: 'stone',
  base: 'bg-[#F1F1ED]',
  page: 'text-[#3E434B]',
  surface: 'bg-white/90 backdrop-blur-sm',
  border: 'border-[#101216]/12',
  heading: 'text-[#101216]',
  body: 'text-[#565B63]',
  accent: 'text-[#2B3FE0]',
  accentBg: 'bg-[#2B3FE0]',
  accentSoft: 'bg-[#2B3FE0]/10',
  input:
    'w-full bg-white border border-[#101216]/14 px-3.5 py-2.5 text-sm text-[#101216] placeholder:text-[#6B7079] focus:outline-none focus:border-[#2B3FE0] focus:ring-2 focus:ring-[#2B3FE0]/18 transition duration-300',
  buttonPrimary: 'bg-[#2B3FE0] hover:bg-[#2233C2] text-white shadow-[0_12px_28px_-16px_rgba(43,63,224,0.7)]',
  buttonGhost: 'border border-[#101216]/18 text-[#101216] hover:bg-[#E4E4DE] hover:border-[#101216]/30',
  divider: 'bg-[#101216]/12',
  timelineLine: 'from-[#2B3FE0] via-[#8F9CFF]/50 to-transparent'
});

export function KurumsalBento({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_BENTO_THEME}
      renderHero={(props) => <BentoHero {...props} />}
      renderHeroBackground={({ revealed }) => (
        <HeroStage
          base="linear-gradient(160deg, #F7F7F4 0%, #F1F1ED 55%, #E6E6E0 100%)"
          scrim={false}
          vignette={false}
          atmosphere={<RegistrationGrid color="rgba(16,18,22,0.22)" />}
          overlay={<KurumsalFrame color="rgba(16,18,22,0.26)" revealed={revealed} />}
          parallax={5}
          grain={0.016}
          fadeTo="#F1F1ED"
        />
      )}
    />
  );
}
