import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { TerrazzoHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuTerrazzo — "Terrazzo" yorumu: turuncudan pembeye tüm kutlama renklerini tek zemine saçan yorum. */
const DOGUM_GUNU_TERRAZZO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fff7ef]',
  page: 'text-[#8a7a68]',
  surface: 'bg-[#fffdf8]/85 backdrop-blur-sm',
  border: 'border-[#f2e3d2]',
  heading: 'text-[#2a2018]',
  body: 'text-[#8a7a68]',
  accent: 'text-[#ff6b35]',
  accentBg: 'bg-[#ff6b35]',
  accentSoft: 'bg-[#ff6b35]/12',
  input: 'w-full bg-[#fffdf8] border border-[#f2e3d2] rounded-2xl px-4 py-2.5 text-sm text-[#2a2018] placeholder:text-[#8a7a68] focus:outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/20 transition-all duration-300',
  buttonPrimary: 'bg-[#2a2018] hover:brightness-125 text-[#fff7ef] rounded-full shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#f2e3d2] text-[#2a2018] hover:bg-[#ff6b35]/10 hover:border-[#ff6b35]/50 rounded-full',
  divider: 'bg-[#f2e3d2]',
  timelineLine: 'from-[#ff6b35] via-[#ff6b35]/40 to-transparent',
};

export function DogumGunuTerrazzo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_TERRAZZO_THEME}
      renderHero={(props) => (
        <TerrazzoHero
          {...props}
          chips={['#ff6b35', '#ffb703', '#e85d9e', '#8ac4d0', '#2a2018']}
          slab="#fff7ef"
          seed={53}
        />
      )}
    />
  );
}
