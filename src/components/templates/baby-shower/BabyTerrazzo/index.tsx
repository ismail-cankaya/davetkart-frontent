import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { TerrazzoHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabyTerrazzo — "Terrazzo" yorumu: en yumuşak pastelleri çakıl çakıl dağıtan yorum. */
const BABY_TERRAZZO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fbf7f2]',
  page: 'text-[#857e72]',
  surface: 'bg-[#fffefb]/85 backdrop-blur-sm',
  border: 'border-[#ece4d8]',
  heading: 'text-[#2a2722]',
  body: 'text-[#857e72]',
  accent: 'text-[#a8c8d8]',
  accentBg: 'bg-[#a8c8d8]',
  accentSoft: 'bg-[#a8c8d8]/12',
  input: 'w-full bg-[#fffefb] border border-[#ece4d8] rounded-2xl px-4 py-2.5 text-sm text-[#2a2722] placeholder:text-[#857e72] focus:outline-none focus:border-[#a8c8d8] focus:ring-2 focus:ring-[#a8c8d8]/20 transition-all duration-300',
  buttonPrimary: 'bg-[#2a2722] hover:brightness-125 text-[#fbf7f2] rounded-full shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#ece4d8] text-[#2a2722] hover:bg-[#a8c8d8]/10 hover:border-[#a8c8d8]/50 rounded-full',
  divider: 'bg-[#ece4d8]',
  timelineLine: 'from-[#a8c8d8] via-[#a8c8d8]/40 to-transparent',
};

export function BabyTerrazzo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_TERRAZZO_THEME}
      renderHero={(props) => (
        <TerrazzoHero
          {...props}
          chips={['#a8c8d8', '#f3c4c4', '#cfe0c8', '#f0e4d4', '#2a2722']}
          slab="#fbf7f2"
          seed={71}
        />
      )}
    />
  );
}
