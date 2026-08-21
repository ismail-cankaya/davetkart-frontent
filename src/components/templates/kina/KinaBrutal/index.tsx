import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { BrutalHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaBrutal — "Brutal" yorumu: kına kırmızısını dekor olarak değil düz renk bloğu olarak kullanan sert yorum. */
const KINA_BRUTAL_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f8efdf]',
  page: 'text-[#736853]',
  surface: 'bg-[#fffaef]',
  border: 'border-[#17110a]/20',
  heading: 'text-[#17110a]',
  body: 'text-[#736853]',
  accent: 'text-[#c81e4a]',
  accentBg: 'bg-[#c81e4a]',
  accentSoft: 'bg-[#c81e4a]/12',
  input: 'w-full bg-[#fffaef] border-2 border-[#17110a] rounded-none px-3.5 py-2.5 text-sm text-[#17110a] placeholder:text-[#736853] focus:outline-none focus:border-[#c81e4a] focus:ring-0 transition-colors duration-200',
  buttonPrimary: 'bg-[#c81e4a] hover:brightness-110 text-[#fff0f3] border-2 border-[#17110a] rounded-none font-black uppercase tracking-wide shadow-[4px_4px_0_0_#17110a]',
  buttonGhost: 'bg-[#fffaef] border-2 border-[#17110a] text-[#17110a] rounded-none font-black uppercase tracking-wide hover:bg-[#f2921d] hover:text-[#17110a]',
  divider: 'bg-[#17110a]/20',
  timelineLine: 'from-[#c81e4a] via-[#c81e4a]/40 to-transparent',
};

export function KinaBrutal({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_BRUTAL_THEME}
      renderHero={(props) => (
        <BrutalHero
          {...props}
          ink="#17110a"
          accent="#c81e4a"
          accent2="#f2921d"
          onAccent="#fff0f3"
          onAccent2="#17110a"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="#f8efdf"
          scrim={false}
          vignette={false}
          parallax={0}
          grain={0.018}
          fadeTo="#f8efdf"
        />
      )}
    />
  );
}
