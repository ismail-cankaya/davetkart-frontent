import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PaperHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * PartiKagit — "Kağıt & Mühür" parti yorumu: kokteyl daveti. Krem kart, gece mavisi mürekkep.
 *
 * Parti kategorisinin tamamı neon ve gece zemini üzerine kurulu; bu şablon
 * kasıtlı olarak sessiz — elden verilen, mühürlü bir kokteyl daveti.
 */
const PARTI_KAGIT_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f2eee4]',
  page: 'text-[#544e42]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#ddd6c6]',
  heading: 'text-[#221f1a]',
  body: 'text-[#857f72]',
  accent: 'text-[#2f4f7a]',
  accentBg: 'bg-[#2f4f7a]',
  accentSoft: 'bg-[#2f4f7a]/12',
  input:
    'w-full bg-white border border-[#ddd6c6] rounded-lg px-3.5 py-2.5 text-sm text-[#544e42] placeholder:text-[#857f72] focus:outline-none focus:border-[#2f4f7a] focus:ring-2 focus:ring-[#2f4f7a]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#221f1a] hover:bg-[#3c372c] text-[#f6f3ea] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d2cab6] text-[#645e50] hover:bg-[#eae5d8] hover:border-[#b6ac93]',
  divider: 'bg-[#ddd6c6]',
  timelineLine: 'from-[#2f4f7a] via-[#b3bfd0]/60 to-transparent'
};

export function PartiKagit({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_KAGIT_THEME}
      renderHero={(props) => <PaperHero {...props} sealColor="#2f4f7a" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 40%, #f4f0e6 0%, #e9e3d4 55%, #ddd5c2 100%)"
          scrim={false}
          vignette={false}
          parallax={6}
          grain={0.02}
          fadeTo="#f2eee4"
        />
      )}
    />
  );
}
