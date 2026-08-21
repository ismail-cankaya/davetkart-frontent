import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { BlueprintHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetBlueprint — "Teknik Çizim" yorumu: törenin akışını mühendislik sayfasına kotlayan yorum. */
const SUNNET_BLUEPRINT_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#06232a]',
  page: 'text-[#cdf0f5]/70',
  surface: 'bg-white/[0.04] backdrop-blur-sm',
  border: 'border-[#cdf0f5]/25',
  heading: 'text-[#cdf0f5]',
  body: 'text-[#cdf0f5]/60',
  accent: 'text-[#ffd166]',
  accentBg: 'bg-[#ffd166]',
  accentSoft: 'bg-[#ffd166]/12',
  input: 'w-full bg-white/[0.04] border border-[#cdf0f5]/30 rounded-none px-3.5 py-2.5 text-sm text-[#cdf0f5] placeholder:text-[#cdf0f5]/40 focus:outline-none focus:border-[#ffd166] focus:ring-1 focus:ring-[#ffd166]/30 transition-colors duration-200',
  buttonPrimary: 'bg-[#ffd166] hover:brightness-110 text-[#06232a] rounded-none font-bold uppercase tracking-[0.12em] shadow-lg shadow-black/25',
  buttonGhost: 'border border-[#cdf0f5]/35 text-[#cdf0f5] rounded-none uppercase tracking-[0.12em] hover:bg-[#cdf0f5]/10 hover:border-[#cdf0f5]/60',
  divider: 'bg-[#cdf0f5]/20',
  timelineLine: 'from-[#ffd166] via-[#ffd166]/40 to-transparent',
};

export function SunnetBlueprint({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_BLUEPRINT_THEME}
      renderHero={(props) => (
        <BlueprintHero
          {...props}
          paper="#06232a"
          line="#cdf0f5"
          accent="#ffd166"
          sheetCode="SN-04"
        />
      )}
    />
  );
}
