import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { TerrazzoHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanTerrazzo — "Terrazzo" yorumu: soğuk maviyi ve gül tonlarını taş zemine seren yorum. */
const NISAN_TERRAZZO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f3f5f8]',
  page: 'text-[#767e8c]',
  surface: 'bg-[#fdfeff]/85 backdrop-blur-sm',
  border: 'border-[#dfe4ec]',
  heading: 'text-[#232833]',
  body: 'text-[#767e8c]',
  accent: 'text-[#5b7db1]',
  accentBg: 'bg-[#5b7db1]',
  accentSoft: 'bg-[#5b7db1]/12',
  input: 'w-full bg-[#fdfeff] border border-[#dfe4ec] rounded-2xl px-4 py-2.5 text-sm text-[#232833] placeholder:text-[#767e8c] focus:outline-none focus:border-[#5b7db1] focus:ring-2 focus:ring-[#5b7db1]/20 transition-all duration-300',
  buttonPrimary: 'bg-[#232833] hover:brightness-125 text-[#f3f5f8] rounded-full shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#dfe4ec] text-[#232833] hover:bg-[#5b7db1]/10 hover:border-[#5b7db1]/50 rounded-full',
  divider: 'bg-[#dfe4ec]',
  timelineLine: 'from-[#5b7db1] via-[#5b7db1]/40 to-transparent',
};

export function NisanTerrazzo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_TERRAZZO_THEME}
      renderHero={(props) => (
        <TerrazzoHero
          {...props}
          chips={['#5b7db1', '#c9a2c8', '#9aa7bd', '#e2d9d0', '#232833']}
          slab="#f3f5f8"
          seed={31}
        />
      )}
    />
  );
}
