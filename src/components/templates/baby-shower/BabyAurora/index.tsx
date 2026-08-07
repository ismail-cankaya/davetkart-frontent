import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh, Halo } from '../../shared/effects';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * BabyAurora — "Aurora Cam" baby shower yorumu: AÇIK zeminli pastel mesh.
 *
 * Aurora dilinin diğer kategorilerdeki sürümleri gece zeminlidir; renk
 * lekeleri karanlıkta parlar. Bebek davetinde bu ters çevrildi: mesh beyaz
 * ışığın içinde eriyen leylak–bebe mavisi lekelere dönüştü. Bu yüzden
 * parçacık katmanı da yok — açık zeminde `screen` karışımı toz görünmez,
 * eklemek boşuna işlem yükü olurdu.
 */
const BABY_AURORA_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f7f6fb]',
  page: 'text-[#5a5566]',
  surface: 'bg-white/75 backdrop-blur-xl',
  border: 'border-[#e6e3ee]',
  heading: 'text-[#241f2e]',
  body: 'text-[#8a8496]',
  accent: 'text-[#9a8fd8]',
  accentBg: 'bg-[#9a8fd8]',
  accentSoft: 'bg-[#9a8fd8]/14',
  input:
    'w-full bg-white/85 border border-[#e6e3ee] rounded-lg px-3.5 py-2.5 text-sm text-[#5a5566] placeholder:text-[#8a8496] focus:outline-none focus:border-[#9a8fd8] focus:ring-2 focus:ring-[#9a8fd8]/18 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#9a8fd8] to-[#7ec8e0] hover:brightness-105 text-[#1e1a28] shadow-lg shadow-[#9a8fd8]/20',
  buttonGhost:
    'border border-[#ddd8ea] text-[#6a6478] hover:bg-[#efedf6] hover:border-[#c3bcda]',
  divider: 'bg-[#e6e3ee]',
  timelineLine: 'from-[#9a8fd8] via-[#c9c2e8]/60 to-transparent'
};

export function BabyAurora({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_AURORA_THEME}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 110% 90% at 50% 25%, #ffffff 0%, #f4f2fb 55%, #eae7f5 100%)"
          scrim={false}
          vignette={false}
          atmosphere={
            <>
              <AuroraMesh colors={['154,143,216', '126,200,224', '255,196,214']} opacity={0.42} duration={30} />
              <Halo color="154,143,216" size={58} x={50} y={38} opacity={0.18} duration={12} />
            </>
          }
          parallax={6}
          grain={0.018}
          fadeTo="#f7f6fb"
        />
      )}
    />
  );
}
