import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { BlueprintHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabyBlueprint — "Teknik Çizim" yorumu: bekleyişi milimetrik bir plana döken yumuşak siyanotip. */
const BABY_BLUEPRINT_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0d2430]',
  page: 'text-[#d8f0f7]/70',
  surface: 'bg-white/[0.04] backdrop-blur-sm',
  border: 'border-[#d8f0f7]/25',
  heading: 'text-[#d8f0f7]',
  body: 'text-[#d8f0f7]/60',
  accent: 'text-[#ffd3d3]',
  accentBg: 'bg-[#ffd3d3]',
  accentSoft: 'bg-[#ffd3d3]/12',
  input: 'w-full bg-white/[0.04] border border-[#d8f0f7]/30 rounded-none px-3.5 py-2.5 text-sm text-[#d8f0f7] placeholder:text-[#d8f0f7]/40 focus:outline-none focus:border-[#ffd3d3] focus:ring-1 focus:ring-[#ffd3d3]/30 transition-colors duration-200',
  buttonPrimary: 'bg-[#ffd3d3] hover:brightness-110 text-[#0d2430] rounded-none font-bold uppercase tracking-[0.12em] shadow-lg shadow-black/25',
  buttonGhost: 'border border-[#d8f0f7]/35 text-[#d8f0f7] rounded-none uppercase tracking-[0.12em] hover:bg-[#d8f0f7]/10 hover:border-[#d8f0f7]/60',
  divider: 'bg-[#d8f0f7]/20',
  timelineLine: 'from-[#ffd3d3] via-[#ffd3d3]/40 to-transparent',
};

export function BabyBlueprint({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_BLUEPRINT_THEME}
      renderHero={(props) => (
        <BlueprintHero
          {...props}
          paper="#0d2430"
          line="#d8f0f7"
          accent="#ffd3d3"
          sheetCode="BB-07"
        />
      )}
    />
  );
}
