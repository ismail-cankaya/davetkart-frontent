import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { BrutalHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalBrutal — "Brutal" yorumu: kurumsal davetin cilasını alıp ızgaraya ve tipografiye indirgeyen yorum. */
const KURUMSAL_BRUTAL_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#eef1f3]',
  page: 'text-[#5e6a72]',
  surface: 'bg-[#fdfefe]',
  border: 'border-[#0a0f13]/20',
  heading: 'text-[#0a0f13]',
  body: 'text-[#5e6a72]',
  accent: 'text-[#1668c4]',
  accentBg: 'bg-[#1668c4]',
  accentSoft: 'bg-[#1668c4]/12',
  input: 'w-full bg-[#fdfefe] border-2 border-[#0a0f13] rounded-none px-3.5 py-2.5 text-sm text-[#0a0f13] placeholder:text-[#5e6a72] focus:outline-none focus:border-[#1668c4] focus:ring-0 transition-colors duration-200',
  buttonPrimary: 'bg-[#1668c4] hover:brightness-110 text-[#eef5ff] border-2 border-[#0a0f13] rounded-none font-black uppercase tracking-wide shadow-[4px_4px_0_0_#0a0f13]',
  buttonGhost: 'bg-[#fdfefe] border-2 border-[#0a0f13] text-[#0a0f13] rounded-none font-black uppercase tracking-wide hover:bg-[#17b877] hover:text-[#0a0f13]',
  divider: 'bg-[#0a0f13]/20',
  timelineLine: 'from-[#1668c4] via-[#1668c4]/40 to-transparent',
};

export function KurumsalBrutal({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_BRUTAL_THEME}
      renderHero={(props) => (
        <BrutalHero
          {...props}
          ink="#0a0f13"
          accent="#1668c4"
          accent2="#17b877"
          onAccent="#eef5ff"
          onAccent2="#0a0f13"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="#eef1f3"
          scrim={false}
          vignette={false}
          parallax={0}
          grain={0.018}
          fadeTo="#eef1f3"
        />
      )}
    />
  );
}
