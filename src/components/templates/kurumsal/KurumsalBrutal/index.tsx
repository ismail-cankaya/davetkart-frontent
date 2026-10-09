import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { BrutalHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { RegistrationGrid } from '../parts/RegistrationGrid';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalBrutal — "Brutal" yorumu: kurumsal davetin cilasını alıp ızgaraya
 * ve tipografiye indirgeyen yorum. Kâğıt, grafit mürekkep, kobalt ve işaret
 * kırmızısı; köşe sıfır, gölge kayık.
 */
const KURUMSAL_BRUTAL_THEME = kurumsalTheme(
  {
    id: 'stone',
    base: 'bg-[#F1F1ED]',
    page: 'text-[#3E434B]',
    surface: 'bg-[#FCFCFA]',
    border: 'border-[#101216]/20',
    heading: 'text-[#101216]',
    body: 'text-[#565B63]',
    accent: 'text-[#2B3FE0]',
    accentBg: 'bg-[#2B3FE0]',
    accentSoft: 'bg-[#2B3FE0]/12',
    input:
      'w-full bg-[#FCFCFA] border-2 border-[#101216] px-3.5 py-2.5 text-sm text-[#101216] placeholder:text-[#565B63] focus:outline-none focus:border-[#2B3FE0] focus:ring-0 transition-colors duration-200',
    buttonPrimary: 'bg-[#2B3FE0] hover:brightness-110 text-white border-2 border-[#101216] font-black shadow-[4px_4px_0_0_#101216]',
    buttonGhost: 'bg-[#FCFCFA] border-2 border-[#101216] text-[#101216] font-black hover:bg-[#F0442A] hover:text-[#101216]',
    divider: 'bg-[#101216]/20',
    timelineLine: 'from-[#2B3FE0] via-[#2B3FE0]/40 to-transparent'
  },
  { edge: 'sert' }
);

export function KurumsalBrutal({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_BRUTAL_THEME}
      renderHero={(props) => (
        <BrutalHero {...props} ink="#101216" accent="#2B3FE0" accent2="#F0442A" onAccent="#FFFFFF" onAccent2="#101216" />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="#F1F1ED"
          scrim={false}
          vignette={false}
          atmosphere={<RegistrationGrid color="rgba(16,18,22,0.3)" mask="none" size={64} />}
          parallax={0}
          grain={0.018}
          fadeTo="#F1F1ED"
        />
      )}
    />
  );
}
