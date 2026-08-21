import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { TerrazzoHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** MezuniyetTerrazzo — "Terrazzo" yorumu: bordo ve altın kırıntılarını akademik krem taşa gömen yorum. */
const MEZUNIYET_TERRAZZO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5f2ea]',
  page: 'text-[#7d766a]',
  surface: 'bg-[#fffdf7]/85 backdrop-blur-sm',
  border: 'border-[#e6dfcd]',
  heading: 'text-[#24211a]',
  body: 'text-[#7d766a]',
  accent: 'text-[#7a2f39]',
  accentBg: 'bg-[#7a2f39]',
  accentSoft: 'bg-[#7a2f39]/12',
  input: 'w-full bg-[#fffdf7] border border-[#e6dfcd] rounded-2xl px-4 py-2.5 text-sm text-[#24211a] placeholder:text-[#7d766a] focus:outline-none focus:border-[#7a2f39] focus:ring-2 focus:ring-[#7a2f39]/20 transition-all duration-300',
  buttonPrimary: 'bg-[#24211a] hover:brightness-125 text-[#f5f2ea] rounded-full shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e6dfcd] text-[#24211a] hover:bg-[#7a2f39]/10 hover:border-[#7a2f39]/50 rounded-full',
  divider: 'bg-[#e6dfcd]',
  timelineLine: 'from-[#7a2f39] via-[#7a2f39]/40 to-transparent',
};

export function MezuniyetTerrazzo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_TERRAZZO_THEME}
      renderHero={(props) => (
        <TerrazzoHero
          {...props}
          chips={['#7a2f39', '#c9a227', '#3c4a3e', '#ded4bf', '#24211a']}
          slab="#f5f2ea"
          seed={67}
        />
      )}
    />
  );
}
