import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { DokumaHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalDokuma — "Dokuma" kurumsal yorumu: keten kartvizit dokusu; petrol, kum ve haki iplikler. */
const KURUMSAL_DOKUMA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f3ef]',
  page: 'text-[#4b4e50]',
  surface: 'bg-[#faf9f6]/90',
  border: 'border-[#dedcd4]',
  heading: 'text-[#22262a]',
  body: 'text-[#7e8184]',
  accent: 'text-[#2f5f6f]',
  accentBg: 'bg-[#2f5f6f]',
  accentSoft: 'bg-[#2f5f6f]/12',
  input:
    'w-full bg-white border border-[#dedcd4] rounded-lg px-3.5 py-2.5 text-sm text-[#4b4e50] placeholder:text-[#7e8184] focus:outline-none focus:border-[#2f5f6f] focus:ring-2 focus:ring-[#2f5f6f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#22262a] hover:bg-[#383d42] text-[#f4f3ef] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#d3d1c8] text-[#5a5d60] hover:bg-[#eceae4] hover:border-[#b0aea3]',
  divider: 'bg-[#dedcd4]',
  timelineLine: 'from-[#2f5f6f] via-[#8f7f5f]/50 to-transparent'
};

export function KurumsalDokuma({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_DOKUMA_THEME}
      renderHero={(props) => (
        <DokumaHero
          {...props}
          threads={['#2f4f5f', '#8f7f5f', '#5f6f5f']}
          weave="#9a9a90"
          stitch="#2f5f6f"
          seed={83}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fafaf7 0%, #efeee9 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.026}
          fadeTo="#f4f3ef"
        />
      )}
    />
  );
}
