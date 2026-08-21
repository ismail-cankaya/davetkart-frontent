import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { BlueprintHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunBlueprint — "Teknik Çizim" yorumu: günü kotlanmış bir proje gibi çizen lacivert ozalit. */
const DUGUN_BLUEPRINT_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#10233f]',
  page: 'text-[#cfe3ff]/70',
  surface: 'bg-white/[0.04] backdrop-blur-sm',
  border: 'border-[#cfe3ff]/25',
  heading: 'text-[#cfe3ff]',
  body: 'text-[#cfe3ff]/60',
  accent: 'text-[#ffcf8a]',
  accentBg: 'bg-[#ffcf8a]',
  accentSoft: 'bg-[#ffcf8a]/12',
  input: 'w-full bg-white/[0.04] border border-[#cfe3ff]/30 rounded-none px-3.5 py-2.5 text-sm text-[#cfe3ff] placeholder:text-[#cfe3ff]/40 focus:outline-none focus:border-[#ffcf8a] focus:ring-1 focus:ring-[#ffcf8a]/30 transition-colors duration-200',
  buttonPrimary: 'bg-[#ffcf8a] hover:brightness-110 text-[#10233f] rounded-none font-bold uppercase tracking-[0.12em] shadow-lg shadow-black/25',
  buttonGhost: 'border border-[#cfe3ff]/35 text-[#cfe3ff] rounded-none uppercase tracking-[0.12em] hover:bg-[#cfe3ff]/10 hover:border-[#cfe3ff]/60',
  divider: 'bg-[#cfe3ff]/20',
  timelineLine: 'from-[#ffcf8a] via-[#ffcf8a]/40 to-transparent',
};

export function DugunBlueprint({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_BLUEPRINT_THEME}
      renderHero={(props) => (
        <BlueprintHero
          {...props}
          paper="#10233f"
          line="#cfe3ff"
          accent="#ffcf8a"
          sheetCode="DK-01"
        />
      )}
    />
  );
}
