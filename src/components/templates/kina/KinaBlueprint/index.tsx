import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { BlueprintHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaBlueprint — "Teknik Çizim" yorumu: kına gecesini bordo mürekkeple çizilmiş bir pafta olarak sunan yorum. */
const KINA_BLUEPRINT_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#2a1020]',
  page: 'text-[#ffd9e6]/70',
  surface: 'bg-white/[0.04] backdrop-blur-sm',
  border: 'border-[#ffd9e6]/25',
  heading: 'text-[#ffd9e6]',
  body: 'text-[#ffd9e6]/60',
  accent: 'text-[#ff9f68]',
  accentBg: 'bg-[#ff9f68]',
  accentSoft: 'bg-[#ff9f68]/12',
  input: 'w-full bg-white/[0.04] border border-[#ffd9e6]/30 rounded-none px-3.5 py-2.5 text-sm text-[#ffd9e6] placeholder:text-[#ffd9e6]/40 focus:outline-none focus:border-[#ff9f68] focus:ring-1 focus:ring-[#ff9f68]/30 transition-colors duration-200',
  buttonPrimary: 'bg-[#ff9f68] hover:brightness-110 text-[#2a1020] rounded-none font-bold uppercase tracking-[0.12em] shadow-lg shadow-black/25',
  buttonGhost: 'border border-[#ffd9e6]/35 text-[#ffd9e6] rounded-none uppercase tracking-[0.12em] hover:bg-[#ffd9e6]/10 hover:border-[#ffd9e6]/60',
  divider: 'bg-[#ffd9e6]/20',
  timelineLine: 'from-[#ff9f68] via-[#ff9f68]/40 to-transparent',
};

export function KinaBlueprint({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_BLUEPRINT_THEME}
      renderHero={(props) => (
        <BlueprintHero
          {...props}
          paper="#2a1020"
          line="#ffd9e6"
          accent="#ff9f68"
          sheetCode="KN-02"
        />
      )}
    />
  );
}
