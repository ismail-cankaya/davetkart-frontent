import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PostaHero } from '../../shared/heroes';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunPosta — "Posta Damgası" düğün yorumu: yollanmış, damgalanmış ve ulaşmış davet. */
const DUGUN_POSTA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f8f5ee]',
  page: 'text-[#524a3e]',
  surface: 'bg-[#fdfaf3]/85 backdrop-blur-sm',
  border: 'border-[#e4ddcc]',
  heading: 'text-[#2a231b]',
  body: 'text-[#867e70]',
  accent: 'text-[#9c3b46]',
  accentBg: 'bg-[#9c3b46]',
  accentSoft: 'bg-[#9c3b46]/12',
  input: 'w-full bg-white border border-[#e4ddcc] rounded-lg px-3.5 py-2.5 text-sm text-[#524a3e] placeholder:text-[#867e70] focus:outline-none focus:border-[#9c3b46] focus:ring-2 focus:ring-[#9c3b46]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#2a231b] hover:brightness-125 text-[#f8f5ee] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e4ddcc] text-[#524a3e] hover:bg-[#f8f5ee] hover:border-[#9c3b46]/40',
  divider: 'bg-[#e4ddcc]',
  timelineLine: 'from-[#9c3b46] via-[#9c3b46]/40 to-transparent',
};

export function DugunPosta({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_POSTA_THEME}
      renderHero={(props) => (
        <PostaHero
          {...props}
          stripe={['#b8323f', '#1f4e8c']}
          stamp="#c9a961"
          postmark="#2f4f6b"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdfbf5 0%, #f3efe4 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f8f5ee"
        />
      )}
    />
  );
}
