import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Sunburst, GoldSheen } from '../../shared/effects';
import { DecoHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DogumGunuDeco — "Art Deco Gala": yuvarlak yaş kutlaması için 1920 zarafeti. Balon ve konfeti yok; altın geometri var.
 */
const DOGUM_GUNU_DECO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#0c0a08]',
  page: 'text-[#eadfd0]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-[#e8b878]/22',
  heading: 'text-[#fdf5e8]',
  body: 'text-[#9b9080]',
  accent: 'text-[#e8b878]',
  accentBg: 'bg-[#e8b878]',
  accentSoft: 'bg-[#e8b878]/12',
  input:
    'w-full bg-white/[0.06] border border-[#e8b878]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#fdf5e8] placeholder:text-[#9b9080] focus:outline-none focus:border-[#e8b878]/60 focus:ring-2 focus:ring-[#e8b878]/15 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#e8b878] to-[#f6dcae] hover:brightness-110 text-[#17110a] shadow-lg shadow-[#e8b878]/20',
  buttonGhost:
    'border border-[#e8b878]/25 text-[#eadfd0] hover:bg-[#e8b878]/10 hover:border-[#e8b878]/45',
  divider: 'bg-[#e8b878]/22',
  timelineLine: 'from-[#e8b878] via-[#e8b878]/35 to-transparent'
};

export function DogumGunuDeco({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_DECO_THEME}
      renderHero={(props) => <DecoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #221a12 0%, #100d09 55%, #070605 100%)"
          scrim={false}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <Sunburst color="232,184,120" rays={48} opacity={0.22} x={50} y={38} />
              <GoldSheen color="246,220,174" opacity={0.14} duration={9} />
            </>
          }
          parallax={9}
          grain={0.032}
          fadeTo="#0c0a08"
        />
      )}
    />
  );
}
