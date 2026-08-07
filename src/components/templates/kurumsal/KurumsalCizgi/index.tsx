import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { HatHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KurumsalCizgi — "Tek Çizgi" kurumsal yorumu: ofis beyazı, lacivert hat.
 *
 * Kurumsal davetin en ölçülü sürümü: tek çizgi, tek renk, geniş boşluk.
 */
const KURUMSAL_CIZGI_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f6f7]',
  page: 'text-[#464d54]',
  surface: 'bg-white/85',
  border: 'border-[#dbe0e4]',
  heading: 'text-[#101418]',
  body: 'text-[#7a828a]',
  accent: 'text-[#20386b]',
  accentBg: 'bg-[#20386b]',
  accentSoft: 'bg-[#20386b]/10',
  input:
    'w-full bg-white border border-[#dbe0e4] rounded-lg px-3.5 py-2.5 text-sm text-[#464d54] placeholder:text-[#7a828a] focus:outline-none focus:border-[#20386b] focus:ring-2 focus:ring-[#20386b]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#101418] hover:bg-[#262c33] text-[#f4f6f7] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#cfd5da] text-[#565d64] hover:bg-[#e9edef] hover:border-[#aab2b9]',
  divider: 'bg-[#dbe0e4]',
  timelineLine: 'from-[#20386b] via-[#adb8cd]/60 to-transparent'
};

export function KurumsalCizgi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_CIZGI_THEME}
      renderHero={(props) => <HatHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fbfcfc 0%, #eff2f4 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.016}
          fadeTo="#f4f6f7"
        />
      )}
    />
  );
}
