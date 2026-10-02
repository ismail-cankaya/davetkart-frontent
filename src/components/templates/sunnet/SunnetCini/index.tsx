import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { CiniHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetCini — "Çini" yorumu: şehzade laciverti ve altın, firuze sır üzerinde. */
const SUNNET_CINI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f1f6f9]',
  page: 'text-[#5a6b80]',
  surface: 'bg-[#f7fafc]/90 backdrop-blur-sm',
  border: 'border-[#14306c]/25',
  heading: 'text-[#0f2350]',
  body: 'text-[#5a6b80]',
  accent: 'text-[#b8861a]',
  accentBg: 'bg-[#14306c]',
  accentSoft: 'bg-[#b8861a]/10',
  input: 'w-full bg-[#f7fafc] border border-[#14306c]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#0f2350] placeholder:text-[#5a6b80] focus:outline-none focus:border-[#b8861a] focus:ring-2 focus:ring-[#b8861a]/15 transition duration-300',
  buttonPrimary: 'bg-[#14306c] hover:brightness-125 text-[#f7fafc] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#14306c]/40 text-[#0f2350] hover:bg-[#14306c]/10 hover:border-[#14306c]/70 rounded-sm',
  divider: 'bg-[#14306c]/20',
  timelineLine: 'from-[#b8861a] via-[#14306c]/40 to-transparent',
};

export function SunnetCini({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_CINI_THEME}
      renderHero={(props) => (
        <CiniHero
          {...props}
          glaze="#f7fafc"
          cobalt="#14306c"
          turquoise="#1d9fb4"
          coral="#d29c1e"
          leaf="#2c7a68"
          grout="#dbe5ec"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage base="#dbe5ec" scrim={false} vignette={false} parallax={0} grain={0.02} fadeTo="#f1f6f9" />
      )}
    />
  );
}
