import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { BrutalHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuBrutal — "Brutal" yorumu: konfeti yerine düz renk blokları kullanan yüksek sesli yorum. */
const DOGUM_GUNU_BRUTAL_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fdf0d9]',
  page: 'text-[#756a55]',
  surface: 'bg-[#fffbf0]',
  border: 'border-[#17120a]/20',
  heading: 'text-[#17120a]',
  body: 'text-[#756a55]',
  accent: 'text-[#ff5722]',
  accentBg: 'bg-[#ff5722]',
  accentSoft: 'bg-[#ff5722]/12',
  input: 'w-full bg-[#fffbf0] border-2 border-[#17120a] rounded-none px-3.5 py-2.5 text-sm text-[#17120a] placeholder:text-[#756a55] focus:outline-none focus:border-[#ff5722] focus:ring-0 transition-colors duration-200',
  buttonPrimary: 'bg-[#ff5722] hover:brightness-110 text-[#fff3ec] border-2 border-[#17120a] rounded-none font-black uppercase tracking-wide shadow-[4px_4px_0_0_#17120a]',
  buttonGhost: 'bg-[#fffbf0] border-2 border-[#17120a] text-[#17120a] rounded-none font-black uppercase tracking-wide hover:bg-[#ffd23f] hover:text-[#17120a]',
  divider: 'bg-[#17120a]/20',
  timelineLine: 'from-[#ff5722] via-[#ff5722]/40 to-transparent',
};

export function DogumGunuBrutal({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_BRUTAL_THEME}
      renderHero={(props) => (
        <BrutalHero
          {...props}
          ink="#17120a"
          accent="#ff5722"
          accent2="#ffd23f"
          onAccent="#fff3ec"
          onAccent2="#17120a"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="#fdf0d9"
          scrim={false}
          vignette={false}
          parallax={0}
          grain={0.018}
          fadeTo="#fdf0d9"
        />
      )}
    />
  );
}
