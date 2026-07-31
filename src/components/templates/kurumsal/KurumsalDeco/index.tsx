import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Sunburst, GoldSheen } from '../../shared/effects';
import { DecoHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KurumsalDeco — "Art Deco Gala" kurumsal yorumu: zümrüt zemin, şampanya altını. Gala ve ödül töreni.
 */
const KURUMSAL_DECO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#061410]',
  page: 'text-[#dae8e0]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-[#d8c07a]/22',
  heading: 'text-[#f0f8f2]',
  body: 'text-[#87a396]',
  accent: 'text-[#d8c07a]',
  accentBg: 'bg-[#d8c07a]',
  accentSoft: 'bg-[#d8c07a]/10',
  input:
    'w-full bg-white/[0.05] border border-[#d8c07a]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#eaf4ee] placeholder:text-[#6f8a7d] focus:outline-none focus:border-[#d8c07a] focus:ring-2 focus:ring-[#d8c07a]/20 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#d8c07a] to-[#f0e0aa] hover:brightness-110 text-[#0a1a14] shadow-lg shadow-[#d8c07a]/20',
  buttonGhost:
    'border border-[#d8c07a]/25 text-[#dae8e0] hover:bg-[#d8c07a]/10 hover:border-[#d8c07a]/45',
  divider: 'bg-[#d8c07a]/22',
  timelineLine: 'from-[#d8c07a] via-[#4e8c70]/45 to-transparent'
};

export function KurumsalDeco({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_DECO_THEME}
      renderHero={(props) => <DecoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #0d2a20 0%, #071a14 55%, #04100c 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              {/* Dev yelpaze kadrajın merkezinden açılır; DecoHero kendi
                  küçük madalyonunu bunun üstüne bindirir. */}
              <Sunburst color="216,192,122" rays={48} opacity={0.2} x={50} y={38} />
              <GoldSheen color="240,224,170" opacity={0.14} duration={9} />
            </>
          }
          parallax={9}
          grain={0.032}
          fadeTo="#061410"
        />
      )}
    />
  );
}
