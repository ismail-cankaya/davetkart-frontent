import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { SuluboyaHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalSuluboya — "Suluboya" kurumsal yorumu: çelik mavisi, adaçayı ve kum lekeleri; ölçülü. */
const KURUMSAL_SULUBOYA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7f8f9]',
  page: 'text-[#474c52]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#dfe3e6]',
  heading: 'text-[#1a1f24]',
  body: 'text-[#7c8288]',
  accent: 'text-[#4f7f9f]',
  accentBg: 'bg-[#4f7f9f]',
  accentSoft: 'bg-[#4f7f9f]/12',
  input:
    'w-full bg-white border border-[#dfe3e6] rounded-lg px-3.5 py-2.5 text-sm text-[#474c52] placeholder:text-[#7c8288] focus:outline-none focus:border-[#4f7f9f] focus:ring-2 focus:ring-[#4f7f9f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#1a1f24] hover:bg-[#30363d] text-[#f7f8f9] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#d4d9dd] text-[#575c62] hover:bg-[#edeff1] hover:border-[#b0b6bb]',
  divider: 'bg-[#dfe3e6]',
  timelineLine: 'from-[#4f7f9f] via-[#a8c0b8]/60 to-transparent'
};

export function KurumsalSuluboya({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_SULUBOYA_THEME}
      renderHero={(props) => (
        <SuluboyaHero {...props} washes={['#8fb0c8', '#a8c0b8', '#c8c0a8']} seed={83} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdfdfe 0%, #f2f4f5 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#f7f8f9"
        />
      )}
    />
  );
}
