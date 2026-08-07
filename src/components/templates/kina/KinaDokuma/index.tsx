import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { DokumaHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaDokuma — "Dokuma" kına yorumu: kategorinin en yerli dili.
 *
 * Kına gecesinin görsel hafızası kumaştan gelir — örtü, bindallı, kilim.
 * Motifler bu yüzden çizilmiş değil, dokunmuş gibi davranır.
 */
const KINA_DOKUMA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f9efe2]',
  page: 'text-[#554438]',
  surface: 'bg-[#fdf6ec]/90',
  border: 'border-[#e6d4bc]',
  heading: 'text-[#2c1d16]',
  body: 'text-[#8d7d6c]',
  accent: 'text-[#8a4f7a]',
  accentBg: 'bg-[#8a4f7a]',
  accentSoft: 'bg-[#8a4f7a]/12',
  input:
    'w-full bg-white border border-[#e6d4bc] rounded-lg px-3.5 py-2.5 text-sm text-[#554438] placeholder:text-[#8d7d6c] focus:outline-none focus:border-[#8a4f7a] focus:ring-2 focus:ring-[#8a4f7a]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2c1d16] hover:bg-[#463125] text-[#f9efe2] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#ddc9ae] text-[#655445] hover:bg-[#f2e6d5] hover:border-[#c2ab8a]',
  divider: 'bg-[#e6d4bc]',
  timelineLine: 'from-[#8a4f7a] via-[#c2354f]/50 to-transparent'
};

export function KinaDokuma({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_DOKUMA_THEME}
      renderHero={(props) => (
        <DokumaHero
          {...props}
          threads={['#c2354f', '#1f6f6a', '#e0a75c']}
          weave="#a88f6f"
          stitch="#8a4f7a"
          seed={17}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdf5e9 0%, #f4e9d7 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.03}
          fadeTo="#f9efe2"
        />
      )}
    />
  );
}
