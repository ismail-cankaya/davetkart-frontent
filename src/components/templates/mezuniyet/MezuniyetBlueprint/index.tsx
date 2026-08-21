import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { BlueprintHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** MezuniyetBlueprint — "Teknik Çizim" yorumu: akademik ciddiyetin en doğal karşılığı olan teknik çizim. */
const MEZUNIYET_BLUEPRINT_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#101a2e]',
  page: 'text-[#dfe7f5]/70',
  surface: 'bg-white/[0.04] backdrop-blur-sm',
  border: 'border-[#dfe7f5]/25',
  heading: 'text-[#dfe7f5]',
  body: 'text-[#dfe7f5]/60',
  accent: 'text-[#d9b44a]',
  accentBg: 'bg-[#d9b44a]',
  accentSoft: 'bg-[#d9b44a]/12',
  input: 'w-full bg-white/[0.04] border border-[#dfe7f5]/30 rounded-none px-3.5 py-2.5 text-sm text-[#dfe7f5] placeholder:text-[#dfe7f5]/40 focus:outline-none focus:border-[#d9b44a] focus:ring-1 focus:ring-[#d9b44a]/30 transition-colors duration-200',
  buttonPrimary: 'bg-[#d9b44a] hover:brightness-110 text-[#101a2e] rounded-none font-bold uppercase tracking-[0.12em] shadow-lg shadow-black/25',
  buttonGhost: 'border border-[#dfe7f5]/35 text-[#dfe7f5] rounded-none uppercase tracking-[0.12em] hover:bg-[#dfe7f5]/10 hover:border-[#dfe7f5]/60',
  divider: 'bg-[#dfe7f5]/20',
  timelineLine: 'from-[#d9b44a] via-[#d9b44a]/40 to-transparent',
};

export function MezuniyetBlueprint({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_BLUEPRINT_THEME}
      renderHero={(props) => (
        <BlueprintHero
          {...props}
          paper="#101a2e"
          line="#dfe7f5"
          accent="#d9b44a"
          sheetCode="MZ-06"
        />
      )}
    />
  );
}
