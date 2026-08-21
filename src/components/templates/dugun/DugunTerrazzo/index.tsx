import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { TerrazzoHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunTerrazzo — "Terrazzo" yorumu: dokusunu bir desenden değil çakılların dağılımından alan yorum. */
const DUGUN_TERRAZZO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f2ec]',
  page: 'text-[#7d766a]',
  surface: 'bg-[#fffdf9]/85 backdrop-blur-sm',
  border: 'border-[#e6ded0]',
  heading: 'text-[#2b2620]',
  body: 'text-[#7d766a]',
  accent: 'text-[#c9a227]',
  accentBg: 'bg-[#c9a227]',
  accentSoft: 'bg-[#c9a227]/12',
  input: 'w-full bg-[#fffdf9] border border-[#e6ded0] rounded-2xl px-4 py-2.5 text-sm text-[#2b2620] placeholder:text-[#7d766a] focus:outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/20 transition-all duration-300',
  buttonPrimary: 'bg-[#2b2620] hover:brightness-125 text-[#f6f2ec] rounded-full shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e6ded0] text-[#2b2620] hover:bg-[#c9a227]/10 hover:border-[#c9a227]/50 rounded-full',
  divider: 'bg-[#e6ded0]',
  timelineLine: 'from-[#c9a227] via-[#c9a227]/40 to-transparent',
};

export function DugunTerrazzo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_TERRAZZO_THEME}
      renderHero={(props) => (
        <TerrazzoHero
          {...props}
          chips={['#c9a227', '#b04a5a', '#7d8c74', '#ded3c2', '#2b2620']}
          slab="#f6f2ec"
          seed={11}
        />
      )}
    />
  );
}
