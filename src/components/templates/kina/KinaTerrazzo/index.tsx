import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { TerrazzoHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaTerrazzo — "Terrazzo" yorumu: kına gecesinin sıcak toprak tonlarını mozaik çakıllara dağıtan yorum. */
const KINA_TERRAZZO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fbf3e6]',
  page: 'text-[#857260]',
  surface: 'bg-[#fffcf5]/85 backdrop-blur-sm',
  border: 'border-[#ecdcc4]',
  heading: 'text-[#2c1d16]',
  body: 'text-[#857260]',
  accent: 'text-[#c1272d]',
  accentBg: 'bg-[#c1272d]',
  accentSoft: 'bg-[#c1272d]/12',
  input: 'w-full bg-[#fffcf5] border border-[#ecdcc4] rounded-2xl px-4 py-2.5 text-sm text-[#2c1d16] placeholder:text-[#857260] focus:outline-none focus:border-[#c1272d] focus:ring-2 focus:ring-[#c1272d]/20 transition-all duration-300',
  buttonPrimary: 'bg-[#2c1d16] hover:brightness-125 text-[#fbf3e6] rounded-full shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#ecdcc4] text-[#2c1d16] hover:bg-[#c1272d]/10 hover:border-[#c1272d]/50 rounded-full',
  divider: 'bg-[#ecdcc4]',
  timelineLine: 'from-[#c1272d] via-[#c1272d]/40 to-transparent',
};

export function KinaTerrazzo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_TERRAZZO_THEME}
      renderHero={(props) => (
        <TerrazzoHero
          {...props}
          chips={['#c1272d', '#e08d2f', '#7a5230', '#e9d3a8', '#2c1d16']}
          slab="#fbf3e6"
          seed={23}
        />
      )}
    />
  );
}
