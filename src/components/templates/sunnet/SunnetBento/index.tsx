import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh } from '../../shared/effects';
import { BentoHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * SunnetBento — "Bento Editorial" sünnet yorumu: aydınlık gök grisi, deniz mavisi vurgu.
 *
 * Sünnet davetlerinin çoğu gece zeminli ve altın süslüdür; bento ızgarası
 * bilgiyi öne çıkardığı için burada zemin bilinçli olarak açık tutuldu —
 * kalabalık aile davetlerinde program ve mekân okunaklılığı süsten önemli.
 */
const SUNNET_BENTO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f3f6f9]',
  page: 'text-[#454e59]',
  surface: 'bg-white/90 backdrop-blur-sm',
  border: 'border-[#dce3ea]',
  heading: 'text-[#141a22]',
  body: 'text-[#79828e]',
  accent: 'text-[#1c7d99]',
  accentBg: 'bg-[#1c7d99]',
  accentSoft: 'bg-[#1c7d99]/12',
  input:
    'w-full bg-white border border-[#dce3ea] rounded-lg px-3.5 py-2.5 text-sm text-[#454e59] placeholder:text-[#79828e] focus:outline-none focus:border-[#1c7d99] focus:ring-2 focus:ring-[#1c7d99]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#141a22] hover:bg-[#28313d] text-[#f3f6f9] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#cbd4de] text-[#545d69] hover:bg-[#e8edf2] hover:border-[#a9b5c2]',
  divider: 'bg-[#dce3ea]',
  timelineLine: 'from-[#1c7d99] via-[#a6c8d6]/60 to-transparent'
};

export function SunnetBento({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_BENTO_THEME}
      renderHero={(props) => <BentoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #fbfcfe 0%, #f1f5f9 55%, #e7edf3 100%)"
          scrim={false}
          vignette={false}
          atmosphere={<AuroraMesh colors={['166,200,214', '182,206,232', '206,218,228']} opacity={0.22} duration={30} />}
          parallax={6}
          grain={0.016}
          fadeTo="#f3f6f9"
        />
      )}
    />
  );
}
