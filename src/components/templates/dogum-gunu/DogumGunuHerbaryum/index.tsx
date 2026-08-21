import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HerbaryumHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuHerbaryum — "Herbaryum" yorumu: yeni yaşı arşive giren bir örnek gibi etiketleyen föy. */
const DOGUM_GUNU_HERBARYUM_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#fdf6ea]',
  page: 'text-[#8a7d63]',
  surface: 'bg-[#fffdf6]/85 backdrop-blur-sm',
  border: 'border-[#7f8b4f]/25',
  heading: 'text-[#2c2418]',
  body: 'text-[#8a7d63]',
  accent: 'text-[#d9603f]',
  accentBg: 'bg-[#d9603f]',
  accentSoft: 'bg-[#d9603f]/10',
  input: 'w-full bg-[#fffdf6] border border-[#7f8b4f]/30 rounded-sm px-3.5 py-2.5 text-sm text-[#2c2418] placeholder:text-[#8a7d63] focus:outline-none focus:border-[#d9603f] focus:ring-2 focus:ring-[#d9603f]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#2c2418] hover:brightness-125 text-[#fdf6ea] rounded-sm shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#7f8b4f]/35 text-[#2c2418] hover:bg-[#7f8b4f]/10 hover:border-[#7f8b4f]/60 rounded-sm',
  divider: 'bg-[#7f8b4f]/20',
  timelineLine: 'from-[#d9603f] via-[#d9603f]/40 to-transparent',
};

export function DogumGunuHerbaryum({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_HERBARYUM_THEME}
      renderHero={(props) => (
        <HerbaryumHero
          {...props}
          sheet="#fdf6ea"
          tape="rgba(230,205,160,0.5)"
          specimen="#7f8b4f"
          label="#fffdf6"
          accession="No. 046"
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fffdf6 0%, #fdf6ea 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.022}
          fadeTo="#fdf6ea"
        />
      )}
    />
  );
}
