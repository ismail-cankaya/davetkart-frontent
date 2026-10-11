import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { CiniHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunCini — "Çini" yorumu: klasik İznik paleti; kobalt, firuze ve mercan kırmızısı beyaz sır üzerinde. */
const DUGUN_CINI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f3ea]',
  page: 'text-[#56607a]',
  surface: 'bg-[#fbf9f3]/90 backdrop-blur-sm',
  border: 'border-[#1d3f8f]/25',
  heading: 'text-[#13244f]',
  body: 'text-[#56607a]',
  accent: 'text-[#c8412f]',
  accentBg: 'bg-[#1d3f8f]',
  accentSoft: 'bg-[#c8412f]/10',
  input: 'w-full bg-[#fbf9f3] border border-[#1d3f8f]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#13244f] placeholder:text-[#56607a] focus:outline-none focus:border-[#c8412f] focus:ring-2 focus:ring-[#c8412f]/15 transition duration-300',
  buttonPrimary: 'bg-[#1d3f8f] hover:brightness-125 text-[#fbf9f3] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#1d3f8f]/40 text-[#13244f] hover:bg-[#1d3f8f]/10 hover:border-[#1d3f8f]/70 rounded-sm',
  divider: 'bg-[#1d3f8f]/20',
  timelineLine: 'from-[#c8412f] via-[#1d3f8f]/40 to-transparent',
};

export function DugunCini({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_CINI_THEME}
      renderHero={(props) => (
        <CiniHero
          {...props}
          glaze="#fbf9f3"
          cobalt="#1d3f8f"
          turquoise="#1f9aa5"
          coral="#c8412f"
          leaf="#3d7a4a"
          grout="#e4ddcc"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage base="#e4ddcc" scrim={false} vignette={false} parallax={0} grain={0.02} fadeTo="#f6f3ea" />
      )}
    />
  );
}
