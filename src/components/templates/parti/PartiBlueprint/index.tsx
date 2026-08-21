import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { BlueprintHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** PartiBlueprint — "Teknik Çizim" yorumu: geceyi asit yeşili çizgilerle kotlayan teknik plan. */
const PARTI_BLUEPRINT_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0a0a12]',
  page: 'text-[#d9ffe8]/70',
  surface: 'bg-white/[0.04] backdrop-blur-sm',
  border: 'border-[#d9ffe8]/25',
  heading: 'text-[#d9ffe8]',
  body: 'text-[#d9ffe8]/60',
  accent: 'text-[#d6ff3d]',
  accentBg: 'bg-[#d6ff3d]',
  accentSoft: 'bg-[#d6ff3d]/12',
  input: 'w-full bg-white/[0.04] border border-[#d9ffe8]/30 rounded-none px-3.5 py-2.5 text-sm text-[#d9ffe8] placeholder:text-[#d9ffe8]/40 focus:outline-none focus:border-[#d6ff3d] focus:ring-1 focus:ring-[#d6ff3d]/30 transition-colors duration-200',
  buttonPrimary: 'bg-[#d6ff3d] hover:brightness-110 text-[#0a0a12] rounded-none font-bold uppercase tracking-[0.12em] shadow-lg shadow-black/25',
  buttonGhost: 'border border-[#d9ffe8]/35 text-[#d9ffe8] rounded-none uppercase tracking-[0.12em] hover:bg-[#d9ffe8]/10 hover:border-[#d9ffe8]/60',
  divider: 'bg-[#d9ffe8]/20',
  timelineLine: 'from-[#d6ff3d] via-[#d6ff3d]/40 to-transparent',
};

export function PartiBlueprint({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_BLUEPRINT_THEME}
      renderHero={(props) => (
        <BlueprintHero
          {...props}
          paper="#0a0a12"
          line="#d9ffe8"
          accent="#d6ff3d"
          sheetCode="PT-08"
        />
      )}
    />
  );
}
