import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { CiniHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** PartiCini — "Çini" yorumu: gece çinisi: lacivert sır üzerinde altın hat, neon mercan ve firuze. */
const PARTI_CINI_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0d1429]',
  page: 'text-[#a3a9bf]',
  surface: 'bg-[#141e3d]/90 backdrop-blur-sm',
  border: 'border-[#e3b54f]/25',
  heading: 'text-[#f3ecd9]',
  body: 'text-[#a3a9bf]',
  accent: 'text-[#ff5f7d]',
  accentBg: 'bg-[#e3b54f]',
  accentSoft: 'bg-[#ff5f7d]/10',
  input: 'w-full bg-[#141e3d] border border-[#e3b54f]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#f3ecd9] placeholder:text-[#a3a9bf] focus:outline-none focus:border-[#ff5f7d] focus:ring-2 focus:ring-[#ff5f7d]/15 transition duration-300',
  buttonPrimary: 'bg-[#e3b54f] hover:brightness-110 text-[#0d1429] rounded-sm shadow-lg shadow-black/30',
  buttonGhost: 'border border-[#e3b54f]/40 text-[#f3ecd9] hover:bg-[#e3b54f]/10 hover:border-[#e3b54f]/70 rounded-sm',
  divider: 'bg-[#e3b54f]/20',
  timelineLine: 'from-[#ff5f7d] via-[#e3b54f]/40 to-transparent',
};

export function PartiCini({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_CINI_THEME}
      renderHero={(props) => (
        <CiniHero
          {...props}
          glaze="#111a35"
          cobalt="#e3b54f"
          turquoise="#35c4cb"
          coral="#ff5f7d"
          leaf="#4fb383"
          grout="#0a1024"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage base="#0a1024" scrim={false} vignette={false} parallax={0} grain={0.02} fadeTo="#0d1429" />
      )}
    />
  );
}
