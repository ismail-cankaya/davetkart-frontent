import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh } from '../../shared/effects';
import { BentoHero } from '../../shared/heroes';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * NisanBento — "Bento Editorial" nişan yorumu: porselen beyazı zemin,
 * lacivert tipografi, çelik mavisi vurgu.
 *
 * Düğün bento'su sıcak fildişi/adaçayı; bu soğuk porselen/lacivert. Aynı
 * düzen, tamamen farklı sıcaklık — kategori ayrımı burada renkten geliyor.
 */
const NISAN_BENTO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f4f6f9]',
  page: 'text-[#454e5c]',
  surface: 'bg-white/88 backdrop-blur-sm',
  border: 'border-[#dde3ec]',
  heading: 'text-[#141d2b]',
  body: 'text-[#7d879a]',
  accent: 'text-[#4a7fb5]',
  accentBg: 'bg-[#4a7fb5]',
  accentSoft: 'bg-[#4a7fb5]/12',
  input:
    'w-full bg-white border border-[#dde3ec] rounded-lg px-3.5 py-2.5 text-sm text-[#454e5c] placeholder:text-[#a3adbd] focus:outline-none focus:border-[#4a7fb5] focus:ring-2 focus:ring-[#4a7fb5]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#141d2b] hover:bg-[#26344a] text-[#f4f6f9] shadow-lg shadow-[#141d2b]/12',
  buttonGhost:
    'border border-[#ccd5e2] text-[#57627a] hover:bg-[#e9eef5] hover:border-[#adbbcd]',
  divider: 'bg-[#dde3ec]',
  timelineLine: 'from-[#4a7fb5] via-[#a8c2dd]/60 to-transparent'
};

export function NisanBento({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_BENTO_THEME}
      renderHero={(props) => <BentoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #fbfcfe 0%, #f1f4f9 55%, #e8edf4 100%)"
          scrim={false}
          vignette={false}
          atmosphere={
            <AuroraMesh colors={['176,200,224', '196,208,232', '208,220,214']} opacity={0.2} duration={32} />
          }
          parallax={6}
          grain={0.016}
          fadeTo="#f4f6f9"
        />
      )}
    />
  );
}
