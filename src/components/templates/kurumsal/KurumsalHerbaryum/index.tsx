import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { HerbaryumHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalHerbaryum — "Herbaryum" yorumu: etkinliği kurum arşivinin bir
 * kaydı olarak sunan föy. Örnek bitki siyanotip gibi kobalt mürekkeple
 * basılır; föy kâğıt beyazı, bant platin.
 */
const KURUMSAL_HERBARYUM_THEME = kurumsalTheme({
  id: 'stone',
  base: 'bg-[#F1F1ED]',
  page: 'text-[#3E434B]',
  surface: 'bg-[#FCFCFA]/90 backdrop-blur-sm',
  border: 'border-[#101216]/12',
  heading: 'text-[#101216]',
  body: 'text-[#565B63]',
  accent: 'text-[#2B3FE0]',
  accentBg: 'bg-[#2B3FE0]',
  accentSoft: 'bg-[#2B3FE0]/10',
  input:
    'w-full bg-[#FCFCFA] border border-[#101216]/14 px-3.5 py-2.5 text-sm text-[#101216] placeholder:text-[#6B7079] focus:outline-none focus:border-[#2B3FE0] focus:ring-2 focus:ring-[#2B3FE0]/15 transition duration-300',
  buttonPrimary: 'bg-[#101216] hover:bg-[#2B3FE0] text-[#F1F1ED] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#101216]/18 text-[#101216] hover:bg-[#2B3FE0]/10 hover:border-[#2B3FE0]/40',
  divider: 'bg-[#101216]/12',
  timelineLine: 'from-[#2B3FE0] via-[#2B3FE0]/35 to-transparent'
});

export function KurumsalHerbaryum({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_HERBARYUM_THEME}
      renderHero={(props) => (
        <HerbaryumHero
          {...props}
          sheet="#F7F7F4"
          tape="rgba(197,203,211,0.6)"
          specimen="#2B3FE0"
          label="#FFFFFF"
          accession="No. 090"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #FAFAF8 0%, #ECECE7 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#F1F1ED"
        />
      )}
    />
  );
}
