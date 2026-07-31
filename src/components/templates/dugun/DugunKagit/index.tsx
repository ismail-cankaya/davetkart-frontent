import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PaperHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DugunKagit — "Kağıt & Mühür": deckle kenarlı fildişi kart, kabartma tipografi, bordo mum mührü.
 *
 * Hero tam ekran KAPLAMAZ — kenar boşluğu kağıdın nesne olduğunu söyler.
 */
const DUGUN_KAGIT_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f3ede1]',
  page: 'text-[#5a5044]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#d9cdb8]',
  heading: 'text-[#2a231b]',
  body: 'text-[#877c6c]',
  accent: 'text-[#8e1b2e]',
  accentBg: 'bg-[#8e1b2e]',
  accentSoft: 'bg-[#8e1b2e]/10',
  input:
    'w-full bg-white/80 border border-[#d9cdb8] rounded-lg px-3.5 py-2.5 text-sm text-[#5a5044] placeholder:text-[#a89c8a] focus:outline-none focus:border-[#8e1b2e] focus:ring-2 focus:ring-[#8e1b2e]/20 transition-all duration-300',
  buttonPrimary:
    'bg-[#2a231b] hover:bg-[#43392e] text-[#f7f2e8] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d1c3ab] text-[#6b6153] hover:bg-[#ebe3d3] hover:border-[#b9a889]',
  divider: 'bg-[#d9cdb8]',
  timelineLine: 'from-[#8e1b2e] via-[#c9b294]/60 to-transparent'
};

export function DugunKagit({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_KAGIT_THEME}
      renderHero={(props) => <PaperHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 40%, #efe7d8 0%, #e4dac6 55%, #d8ccb4 100%)"
          scrim={false}
          vignette={false}
          parallax={6}
          grain={0.02}
          fadeTo="#f3ede1"
        />
      )}
    />
  );
}
