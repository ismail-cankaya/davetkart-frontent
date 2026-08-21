import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { BlueprintHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuBlueprint — "Teknik Çizim" yorumu: partiyi mor ozalit üzerine çizilmiş bir plana çeviren yorum. */
const DOGUM_GUNU_BLUEPRINT_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#221033]',
  page: 'text-[#f0dcff]/70',
  surface: 'bg-white/[0.04] backdrop-blur-sm',
  border: 'border-[#f0dcff]/25',
  heading: 'text-[#f0dcff]',
  body: 'text-[#f0dcff]/60',
  accent: 'text-[#ffd166]',
  accentBg: 'bg-[#ffd166]',
  accentSoft: 'bg-[#ffd166]/12',
  input: 'w-full bg-white/[0.04] border border-[#f0dcff]/30 rounded-none px-3.5 py-2.5 text-sm text-[#f0dcff] placeholder:text-[#f0dcff]/40 focus:outline-none focus:border-[#ffd166] focus:ring-1 focus:ring-[#ffd166]/30 transition-colors duration-200',
  buttonPrimary: 'bg-[#ffd166] hover:brightness-110 text-[#221033] rounded-none font-bold uppercase tracking-[0.12em] shadow-lg shadow-black/25',
  buttonGhost: 'border border-[#f0dcff]/35 text-[#f0dcff] rounded-none uppercase tracking-[0.12em] hover:bg-[#f0dcff]/10 hover:border-[#f0dcff]/60',
  divider: 'bg-[#f0dcff]/20',
  timelineLine: 'from-[#ffd166] via-[#ffd166]/40 to-transparent',
};

export function DogumGunuBlueprint({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_BLUEPRINT_THEME}
      renderHero={(props) => (
        <BlueprintHero
          {...props}
          paper="#221033"
          line="#f0dcff"
          accent="#ffd166"
          sheetCode="DG-05"
        />
      )}
    />
  );
}
