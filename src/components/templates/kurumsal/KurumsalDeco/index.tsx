import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Sunburst, GoldSheen } from '../../shared/effects';
import { DecoHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalDeco — "Art Deco Gala" kurumsal yorumu: platin gala. Kobalt gece
 * zemini, platin çerçeve ve yelpaze. Ödül töreni ve yıl sonu galası.
 *
 * Gala dilinin varsayılanı "koyu zemin + şampanya altını"; kategori onu
 * bilerek platine çevirir. DecoHero çerçevesini altın sabitle çizdiği için
 * hero'nun dekoratif (aria-hidden) katmanları gri tonlamayla platine
 * indirilir; metin ve süs zaten temadan renk alır.
 */
const KURUMSAL_DECO_THEME = kurumsalTheme(
  {
    id: 'midnight',
    base: 'theme-cormorant bg-[#0A0C14]',
    page: 'text-[#D9DCE4]',
    surface: 'bg-[#121522]/85 backdrop-blur-md',
    border: 'border-[#C5CBD3]/22',
    heading: 'text-[#F3F4F1]',
    body: 'text-[#A0A6B3]',
    accent: 'text-[#C5CBD3]',
    accentBg: 'bg-[#C5CBD3]',
    accentSoft: 'bg-[#C5CBD3]/10',
    input:
      'w-full bg-white/[0.05] border border-[#C5CBD3]/24 px-3.5 py-2.5 text-sm text-[#F3F4F1] placeholder:text-[#8A90A0] focus:outline-none focus:border-[#C5CBD3] focus:ring-2 focus:ring-[#C5CBD3]/20 transition duration-300',
    buttonPrimary: 'bg-gradient-to-r from-[#C5CBD3] to-[#EEF0F3] hover:brightness-105 text-[#0A0C14] shadow-[0_12px_30px_-14px_rgba(197,203,211,0.45)]',
    buttonGhost: 'border border-[#C5CBD3]/28 text-[#D9DCE4] hover:bg-[#C5CBD3]/10 hover:border-[#C5CBD3]/50',
    divider: 'bg-[#C5CBD3]/24',
    timelineLine: 'from-[#C5CBD3] via-[#2B3FE0]/45 to-transparent'
  },
  { type: 'serif' }
);

export function KurumsalDeco({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_DECO_THEME}
      renderHero={(props) => <DecoHero {...props} />}
      heroContentClassName="[&_[aria-hidden=true]]:grayscale"
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #141A33 0%, #0B0E1C 55%, #05060B 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              {/* Dev yelpaze kadrajın merkezinden açılır; DecoHero kendi
                  küçük madalyonunu bunun üstüne bindirir. */}
              <Sunburst color="197,203,211" rays={48} opacity={0.16} x={50} y={38} />
              <GoldSheen color="238,240,243" opacity={0.12} duration={9} />
            </>
          }
          parallax={9}
          grain={0.032}
          fadeTo="#0A0C14"
        />
      )}
    />
  );
}
