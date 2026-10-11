import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { CiniHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabyCini — "Çini" yorumu: pastel sır: bebek mavisi, nane ve pudra pembe. */
const BABY_CINI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5f8fa]',
  page: 'text-[#6f7c8c]',
  surface: 'bg-[#fbfcfd]/90 backdrop-blur-sm',
  border: 'border-[#6a8cc4]/25',
  heading: 'text-[#34466b]',
  body: 'text-[#6f7c8c]',
  accent: 'text-[#d9828a]',
  accentBg: 'bg-[#4f6fa8]',
  accentSoft: 'bg-[#d9828a]/10',
  input: 'w-full bg-[#fbfcfd] border border-[#6a8cc4]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#34466b] placeholder:text-[#6f7c8c] focus:outline-none focus:border-[#d9828a] focus:ring-2 focus:ring-[#d9828a]/15 transition duration-300',
  buttonPrimary: 'bg-[#4f6fa8] hover:brightness-125 text-[#fbfcfd] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#6a8cc4]/40 text-[#34466b] hover:bg-[#6a8cc4]/10 hover:border-[#6a8cc4]/70 rounded-sm',
  divider: 'bg-[#6a8cc4]/20',
  timelineLine: 'from-[#d9828a] via-[#6a8cc4]/40 to-transparent',
};

export function BabyCini({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_CINI_THEME}
      renderHero={(props) => (
        <CiniHero
          {...props}
          glaze="#fbfcfd"
          cobalt="#6a8cc4"
          turquoise="#8cc8c2"
          coral="#eba0a0"
          leaf="#a3c294"
          grout="#e6edf2"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage base="#e6edf2" scrim={false} vignette={false} parallax={0} grain={0.02} fadeTo="#f5f8fa" />
      )}
    />
  );
}
