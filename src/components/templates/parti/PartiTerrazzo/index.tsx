import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { TerrazzoHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** PartiTerrazzo — "Terrazzo" yorumu: gece zeminine neon çakıllar döşeyen yorum. */
const PARTI_TERRAZZO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#131018]',
  page: 'text-[#928a9c]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f6f2f8]',
  body: 'text-[#928a9c]',
  accent: 'text-[#ff5f8f]',
  accentBg: 'bg-[#ff5f8f]',
  accentSoft: 'bg-[#ff5f8f]/12',
  input: 'w-full bg-white/[0.06] border border-white/12 rounded-2xl px-4 py-2.5 text-sm text-[#f6f2f8] placeholder:text-[#928a9c] focus:outline-none focus:border-[#ff5f8f] focus:ring-2 focus:ring-[#ff5f8f]/20 transition-all duration-300',
  buttonPrimary: 'bg-[#f6f2f8] hover:brightness-125 text-[#131018] rounded-full shadow-lg shadow-black/10',
  buttonGhost: 'border border-white/12 text-[#f6f2f8] hover:bg-[#ff5f8f]/10 hover:border-[#ff5f8f]/50 rounded-full',
  divider: 'bg-white/12',
  timelineLine: 'from-[#ff5f8f] via-[#ff5f8f]/40 to-transparent',
};

export function PartiTerrazzo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_TERRAZZO_THEME}
      renderHero={(props) => (
        <TerrazzoHero
          {...props}
          chips={['#ff5f8f', '#8b5cf6', '#22d3ee', '#facc15', '#f6f2f8']}
          slab="#131018"
          seed={83}
        />
      )}
    />
  );
}
