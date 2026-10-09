import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { DokumaHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { KurumsalFrame } from '../parts/KurumsalFrame';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalDokuma — "Dokuma" kurumsal yorumu: kartvizit kumaşı. Kobalt,
 * grafit ve platin iplikler; atkı beton grisi.
 */
const KURUMSAL_DOKUMA_THEME = kurumsalTheme({
  id: 'stone',
  base: 'bg-[#F1F1ED]',
  page: 'text-[#3E434B]',
  surface: 'bg-[#FAFAF8]/90',
  border: 'border-[#101216]/12',
  heading: 'text-[#101216]',
  body: 'text-[#565B63]',
  accent: 'text-[#2B3FE0]',
  accentBg: 'bg-[#2B3FE0]',
  accentSoft: 'bg-[#2B3FE0]/10',
  input:
    'w-full bg-white border border-[#101216]/14 px-3.5 py-2.5 text-sm text-[#101216] placeholder:text-[#6B7079] focus:outline-none focus:border-[#2B3FE0] focus:ring-2 focus:ring-[#2B3FE0]/18 transition duration-300',
  buttonPrimary: 'bg-[#101216] hover:bg-[#2B3FE0] text-[#F1F1ED] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#101216]/18 text-[#101216] hover:bg-[#E4E4DE] hover:border-[#101216]/30',
  divider: 'bg-[#101216]/12',
  timelineLine: 'from-[#2B3FE0] via-[#C5CBD3]/60 to-transparent'
});

export function KurumsalDokuma({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_DOKUMA_THEME}
      renderHero={(props) => (
        <DokumaHero {...props} threads={['#2B3FE0', '#3E434B', '#AEB4BD']} weave="#A3A6A0" stitch="#2B3FE0" seed={83} />
      )}
      renderHeroBackground={({ revealed }) => (
        <HeroStage
          base="linear-gradient(180deg, #F8F8F5 0%, #ECECE7 100%)"
          scrim={false}
          vignette={false}
          overlay={<KurumsalFrame color="rgba(16,18,22,0.24)" revealed={revealed} ruler={false} />}
          parallax={4}
          grain={0.026}
          fadeTo="#F1F1ED"
        />
      )}
    />
  );
}
