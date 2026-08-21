import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { BlueprintHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalBlueprint — "Teknik Çizim" yorumu: etkinliği bir mühendislik paftası gibi sunan yorum. */
const KURUMSAL_BLUEPRINT_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0b1b26]',
  page: 'text-[#d6ecf7]/70',
  surface: 'bg-white/[0.04] backdrop-blur-sm',
  border: 'border-[#d6ecf7]/25',
  heading: 'text-[#d6ecf7]',
  body: 'text-[#d6ecf7]/60',
  accent: 'text-[#3fbfd8]',
  accentBg: 'bg-[#3fbfd8]',
  accentSoft: 'bg-[#3fbfd8]/12',
  input: 'w-full bg-white/[0.04] border border-[#d6ecf7]/30 rounded-none px-3.5 py-2.5 text-sm text-[#d6ecf7] placeholder:text-[#d6ecf7]/40 focus:outline-none focus:border-[#3fbfd8] focus:ring-1 focus:ring-[#3fbfd8]/30 transition-colors duration-200',
  buttonPrimary: 'bg-[#3fbfd8] hover:brightness-110 text-[#0b1b26] rounded-none font-bold uppercase tracking-[0.12em] shadow-lg shadow-black/25',
  buttonGhost: 'border border-[#d6ecf7]/35 text-[#d6ecf7] rounded-none uppercase tracking-[0.12em] hover:bg-[#d6ecf7]/10 hover:border-[#d6ecf7]/60',
  divider: 'bg-[#d6ecf7]/20',
  timelineLine: 'from-[#3fbfd8] via-[#3fbfd8]/40 to-transparent',
};

export function KurumsalBlueprint({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_BLUEPRINT_THEME}
      renderHero={(props) => (
        <BlueprintHero
          {...props}
          paper="#0b1b26"
          line="#d6ecf7"
          accent="#3fbfd8"
          sheetCode="KR-09"
        />
      )}
    />
  );
}
