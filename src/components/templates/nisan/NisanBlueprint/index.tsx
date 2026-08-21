import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { BlueprintHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanBlueprint — "Teknik Çizim" yorumu: nişanı gece mavisi bir teknik çizime dönüştüren yorum. */
const NISAN_BLUEPRINT_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0f1c33]',
  page: 'text-[#dae7ff]/70',
  surface: 'bg-white/[0.04] backdrop-blur-sm',
  border: 'border-[#dae7ff]/25',
  heading: 'text-[#dae7ff]',
  body: 'text-[#dae7ff]/60',
  accent: 'text-[#ffc9de]',
  accentBg: 'bg-[#ffc9de]',
  accentSoft: 'bg-[#ffc9de]/12',
  input: 'w-full bg-white/[0.04] border border-[#dae7ff]/30 rounded-none px-3.5 py-2.5 text-sm text-[#dae7ff] placeholder:text-[#dae7ff]/40 focus:outline-none focus:border-[#ffc9de] focus:ring-1 focus:ring-[#ffc9de]/30 transition-colors duration-200',
  buttonPrimary: 'bg-[#ffc9de] hover:brightness-110 text-[#0f1c33] rounded-none font-bold uppercase tracking-[0.12em] shadow-lg shadow-black/25',
  buttonGhost: 'border border-[#dae7ff]/35 text-[#dae7ff] rounded-none uppercase tracking-[0.12em] hover:bg-[#dae7ff]/10 hover:border-[#dae7ff]/60',
  divider: 'bg-[#dae7ff]/20',
  timelineLine: 'from-[#ffc9de] via-[#ffc9de]/40 to-transparent',
};

export function NisanBlueprint({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_BLUEPRINT_THEME}
      renderHero={(props) => (
        <BlueprintHero
          {...props}
          paper="#0f1c33"
          line="#dae7ff"
          accent="#ffc9de"
          sheetCode="NS-03"
        />
      )}
    />
  );
}
