import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { TerrazzoHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetTerrazzo — "Terrazzo" yorumu: deniz yeşili çakılları altın kırıntılarla karıştıran yorum. */
const SUNNET_TERRAZZO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#eff6f7]',
  page: 'text-[#6b7f85]',
  surface: 'bg-[#fbfeff]/85 backdrop-blur-sm',
  border: 'border-[#d8e6e9]',
  heading: 'text-[#17262b]',
  body: 'text-[#6b7f85]',
  accent: 'text-[#2f7f8c]',
  accentBg: 'bg-[#2f7f8c]',
  accentSoft: 'bg-[#2f7f8c]/12',
  input: 'w-full bg-[#fbfeff] border border-[#d8e6e9] rounded-2xl px-4 py-2.5 text-sm text-[#17262b] placeholder:text-[#6b7f85] focus:outline-none focus:border-[#2f7f8c] focus:ring-2 focus:ring-[#2f7f8c]/20 transition-all duration-300',
  buttonPrimary: 'bg-[#17262b] hover:brightness-125 text-[#eff6f7] rounded-full shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#d8e6e9] text-[#17262b] hover:bg-[#2f7f8c]/10 hover:border-[#2f7f8c]/50 rounded-full',
  divider: 'bg-[#d8e6e9]',
  timelineLine: 'from-[#2f7f8c] via-[#2f7f8c]/40 to-transparent',
};

export function SunnetTerrazzo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_TERRAZZO_THEME}
      renderHero={(props) => (
        <TerrazzoHero
          {...props}
          chips={['#2f7f8c', '#7cc5c9', '#c9a227', '#dbe7e9', '#17262b']}
          slab="#eff6f7"
          seed={41}
        />
      )}
    />
  );
}
