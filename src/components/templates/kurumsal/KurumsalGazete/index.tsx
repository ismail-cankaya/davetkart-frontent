import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { GazeteHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalGazete — "Gazete Manşeti" kurumsal yorumu: daveti bülten haberi
 * olarak duyuran dizgi. Serif manşet korunur (gazetenin kendi dili); tek
 * spot renk kobalt mürekkep.
 */
const KURUMSAL_GAZETE_THEME = kurumsalTheme(
  {
    id: 'stone',
    base: 'bg-[#F1F1ED]',
    page: 'text-[#3E434B]',
    surface: 'bg-[#FAFAF8]/90 backdrop-blur-sm',
    border: 'border-[#101216]/14',
    heading: 'text-[#101216]',
    body: 'text-[#565B63]',
    accent: 'text-[#2B3FE0]',
    accentBg: 'bg-[#2B3FE0]',
    accentSoft: 'bg-[#2B3FE0]/10',
    input:
      'w-full bg-white border border-[#101216]/14 px-3.5 py-2.5 text-sm text-[#101216] placeholder:text-[#6B7079] focus:outline-none focus:border-[#2B3FE0] focus:ring-2 focus:ring-[#2B3FE0]/18 transition duration-300',
    buttonPrimary: 'bg-[#101216] hover:bg-[#2B3FE0] text-[#F1F1ED] shadow-lg shadow-black/10',
    buttonGhost: 'border border-[#101216]/18 text-[#101216] hover:bg-[#E4E4DE] hover:border-[#2B3FE0]/40',
    divider: 'bg-[#101216]/14',
    timelineLine: 'from-[#2B3FE0] via-[#2B3FE0]/35 to-transparent'
  },
  { type: 'serif' }
);

export function KurumsalGazete({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_GAZETE_THEME}
      renderHero={(props) => <GazeteHero {...props} masthead="KURUMSAL BÜLTEN" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #F8F8F5 0%, #ECECE7 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#F1F1ED"
        />
      )}
    />
  );
}
