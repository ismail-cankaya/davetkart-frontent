import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { CiniHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalCini — "Çini" yorumu: iki tonlu, ölçülü bir çini: petrol mavisi ve pirinç. */
const KURUMSAL_CINI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f0f2f4]',
  page: 'text-[#5f6b78]',
  surface: 'bg-[#f6f7f8]/90 backdrop-blur-sm',
  border: 'border-[#20395c]/25',
  heading: 'text-[#172a45]',
  body: 'text-[#5f6b78]',
  accent: 'text-[#9f7432]',
  accentBg: 'bg-[#20395c]',
  accentSoft: 'bg-[#9f7432]/10',
  input: 'w-full bg-[#f6f7f8] border border-[#20395c]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#172a45] placeholder:text-[#5f6b78] focus:outline-none focus:border-[#9f7432] focus:ring-2 focus:ring-[#9f7432]/15 transition duration-300',
  buttonPrimary: 'bg-[#20395c] hover:brightness-125 text-[#f6f7f8] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#20395c]/40 text-[#172a45] hover:bg-[#20395c]/10 hover:border-[#20395c]/70 rounded-sm',
  divider: 'bg-[#20395c]/20',
  timelineLine: 'from-[#9f7432] via-[#20395c]/40 to-transparent',
};

export function KurumsalCini({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_CINI_THEME}
      renderHero={(props) => (
        <CiniHero
          {...props}
          glaze="#f6f7f8"
          cobalt="#20395c"
          turquoise="#5a93ab"
          coral="#b9893e"
          leaf="#4c6e7c"
          grout="#dfe3e7"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage base="#dfe3e7" scrim={false} vignette={false} parallax={0} grain={0.02} fadeTo="#f0f2f4" />
      )}
    />
  );
}
