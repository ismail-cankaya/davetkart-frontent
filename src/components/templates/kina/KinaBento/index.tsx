import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh } from '../../shared/effects';
import { BentoHero } from '../../shared/heroes';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KinaBento — "Bento Editorial" kına yorumu: pudra zemin, bordo tipografi,
 * altın vurgu.
 *
 * Kına gecesi bilgi yoğun bir etkinliktir (program akışı, mekân, kıyafet
 * notu); bento ızgarası bu bilgiyi hiyerarşiyle taşıyabilen tek dil.
 */
const KINA_BENTO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#faf3f4]',
  page: 'text-[#5e444a]',
  surface: 'bg-white/88 backdrop-blur-sm',
  border: 'border-[#eddadd]',
  heading: 'text-[#3d1620]',
  body: 'text-[#9a7c83]',
  accent: 'text-[#b08442]',
  accentBg: 'bg-[#b08442]',
  accentSoft: 'bg-[#b08442]/12',
  input:
    'w-full bg-white border border-[#eddadd] rounded-lg px-3.5 py-2.5 text-sm text-[#5e444a] placeholder:text-[#bfa3a9] focus:outline-none focus:border-[#b08442] focus:ring-2 focus:ring-[#b08442]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#8e1b2e] hover:bg-[#a52b40] text-[#faf3f4] shadow-lg shadow-[#8e1b2e]/15',
  buttonGhost:
    'border border-[#e2c6cb] text-[#7a5a61] hover:bg-[#f4e6e8] hover:border-[#cfa8b0]',
  divider: 'bg-[#eddadd]',
  timelineLine: 'from-[#b08442] via-[#dcb9a0]/60 to-transparent'
};

export function KinaBento({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_BENTO_THEME}
      renderHero={(props) => <BentoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #fdf8f8 0%, #f8f0f1 55%, #f2e6e6 100%)"
          scrim={false}
          vignette={false}
          atmosphere={
            <AuroraMesh colors={['232,196,200', '224,196,164', '212,190,200']} opacity={0.22} duration={31} />
          }
          parallax={6}
          grain={0.016}
          fadeTo="#faf3f4"
        />
      )}
    />
  );
}
