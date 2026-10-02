import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { CiniHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaCini — "Çini" yorumu: kına kırmızısı ve safran; kobaltın yerini bordo alır, laleler mercanla açar. */
const KINA_CINI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f8efe4]',
  page: 'text-[#806561]',
  surface: 'bg-[#fcf5ec]/90 backdrop-blur-sm',
  border: 'border-[#7a1c2a]/25',
  heading: 'text-[#4a1019]',
  body: 'text-[#806561]',
  accent: 'text-[#b23a2a]',
  accentBg: 'bg-[#7a1c2a]',
  accentSoft: 'bg-[#b23a2a]/10',
  input: 'w-full bg-[#fcf5ec] border border-[#7a1c2a]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#4a1019] placeholder:text-[#806561] focus:outline-none focus:border-[#b23a2a] focus:ring-2 focus:ring-[#b23a2a]/15 transition duration-300',
  buttonPrimary: 'bg-[#7a1c2a] hover:brightness-125 text-[#fcf5ec] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#7a1c2a]/40 text-[#4a1019] hover:bg-[#7a1c2a]/10 hover:border-[#7a1c2a]/70 rounded-sm',
  divider: 'bg-[#7a1c2a]/20',
  timelineLine: 'from-[#b23a2a] via-[#7a1c2a]/40 to-transparent',
};

export function KinaCini({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_CINI_THEME}
      renderHero={(props) => (
        <CiniHero
          {...props}
          glaze="#fcf5ec"
          cobalt="#7a1c2a"
          turquoise="#c08a2e"
          coral="#d4492f"
          leaf="#3f6b3a"
          grout="#ead9c6"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage base="#ead9c6" scrim={false} vignette={false} parallax={0} grain={0.02} fadeTo="#f8efe4" />
      )}
    />
  );
}
