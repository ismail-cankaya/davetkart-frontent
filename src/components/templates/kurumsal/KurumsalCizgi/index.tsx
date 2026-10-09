import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { HatHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { KurumsalFrame } from '../parts/KurumsalFrame';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalCizgi — "Tek Çizgi" kurumsal yorumu: kâğıt beyazı, kobalt hat.
 *
 * Kurumsal davetin en ölçülü sürümü: tek çizgi, tek sinyal, geniş boşluk.
 * Kadrajın kesim işaretleri çizginin "ölçülmüş" olduğunu söyler.
 */
const KURUMSAL_CIZGI_THEME = kurumsalTheme({
  id: 'stone',
  base: 'bg-[#F4F4F1]',
  page: 'text-[#3E434B]',
  surface: 'bg-white/85',
  border: 'border-[#101216]/12',
  heading: 'text-[#101216]',
  body: 'text-[#565B63]',
  accent: 'text-[#2B3FE0]',
  accentBg: 'bg-[#2B3FE0]',
  accentSoft: 'bg-[#2B3FE0]/10',
  input:
    'w-full bg-white border border-[#101216]/14 px-3.5 py-2.5 text-sm text-[#101216] placeholder:text-[#6B7079] focus:outline-none focus:border-[#2B3FE0] focus:ring-2 focus:ring-[#2B3FE0]/18 transition duration-300',
  buttonPrimary: 'bg-[#101216] hover:bg-[#2B3FE0] text-[#F4F4F1] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#101216]/18 text-[#101216] hover:bg-[#E4E4DE] hover:border-[#101216]/30',
  divider: 'bg-[#101216]/12',
  timelineLine: 'from-[#2B3FE0] via-[#8F9CFF]/50 to-transparent'
});

export function KurumsalCizgi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_CIZGI_THEME}
      renderHero={(props) => <HatHero {...props} drawDuration={2.2} />}
      renderHeroBackground={({ revealed }) => (
        <HeroStage
          base="linear-gradient(180deg, #FAFAF8 0%, #EEEEEA 100%)"
          scrim={false}
          vignette={false}
          overlay={<KurumsalFrame color="rgba(16,18,22,0.24)" revealed={revealed} />}
          parallax={4}
          grain={0.016}
          fadeTo="#F4F4F1"
        />
      )}
    />
  );
}
