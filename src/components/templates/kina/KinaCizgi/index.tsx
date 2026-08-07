import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HatHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaCizgi — "Tek Çizgi" kına yorumu: kum kağıdı, zümrüt hat.
 *
 * Kına dilinin alışıldık kızıl-altınının dışına çıkan tek sürüm; monoline
 * çerçeve süslemeyi çizgiye indirgediği için renk de sadeleşti.
 */
const KINA_CIZGI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f9f3e8]',
  page: 'text-[#4e463b]',
  surface: 'bg-white/85',
  border: 'border-[#e0d5c0]',
  heading: 'text-[#241a14]',
  body: 'text-[#877c6c]',
  accent: 'text-[#1f6f6a]',
  accentBg: 'bg-[#1f6f6a]',
  accentSoft: 'bg-[#1f6f6a]/10',
  input:
    'w-full bg-white border border-[#e0d5c0] rounded-lg px-3.5 py-2.5 text-sm text-[#4e463b] placeholder:text-[#877c6c] focus:outline-none focus:border-[#1f6f6a] focus:ring-2 focus:ring-[#1f6f6a]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#241a14] hover:bg-[#3d2d22] text-[#f9f3e8] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d8ccb4] text-[#5f5648] hover:bg-[#f1e9d9] hover:border-[#bcac8e]',
  divider: 'bg-[#e0d5c0]',
  timelineLine: 'from-[#1f6f6a] via-[#a9c6c2]/60 to-transparent'
};

export function KinaCizgi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_CIZGI_THEME}
      renderHero={(props) => <HatHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fdf8ee 0%, #f5eee0 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.02}
          fadeTo="#f9f3e8"
        />
      )}
    />
  );
}
