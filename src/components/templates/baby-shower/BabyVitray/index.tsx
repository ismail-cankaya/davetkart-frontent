import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, GodRays, Halo } from '../../shared/effects';
import { VitrayHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * BabyVitray — "Vitray Işık" baby shower yorumu: AÇIK zeminli çocuk odası penceresi.
 *
 * Vitray dilinin tek açık sürümü. Katedral karanlığı yerine sabah odası:
 * camlar pastel, kurşun çizgisi siyah değil sıcak gri. Hero bileşeni
 * `theme.id === 'stone'` olduğunda okunabilirlik degradesini de açık
 * tarafa çevirdiği için ayrıca bir ayar gerekmiyor.
 */
const BABY_VITRAY_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f8f5f0]',
  page: 'text-[#5c564b]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#e4ddd1]',
  heading: 'text-[#2b2822]',
  body: 'text-[#8a8479]',
  accent: 'text-[#e695a8]',
  accentBg: 'bg-[#e695a8]',
  accentSoft: 'bg-[#e695a8]/14',
  input:
    'w-full bg-white border border-[#e4ddd1] rounded-lg px-3.5 py-2.5 text-sm text-[#5c564b] placeholder:text-[#8a8479] focus:outline-none focus:border-[#e695a8] focus:ring-2 focus:ring-[#e695a8]/18 transition-all duration-300',
  buttonPrimary:
    'bg-gradient-to-r from-[#e695a8] to-[#a8d5e2] hover:brightness-105 text-[#2b2822] shadow-lg shadow-[#e695a8]/20',
  buttonGhost:
    'border border-[#ded6c8] text-[#6b6559] hover:bg-[#efeae0] hover:border-[#c2b9a6]',
  divider: 'bg-[#e4ddd1]',
  timelineLine: 'from-[#e695a8] via-[#a8d5e2]/60 to-transparent'
};

export function BabyVitray({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_VITRAY_THEME}
      renderHero={(props) => (
        <VitrayHero
          {...props}
          glass={['#a8d5e2', '#f7c8c8', '#cfe3b5']}
          lead="#6b6257"
          glow="#a8d5e2"
          seed={59}
        />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 28%, #ffffff 0%, #f6f2ea 55%, #ece5d9 100%)"
          scrim={false}
          vignette={false}
          atmosphere={
            <>
              <GodRays color="255,236,200" angle={12} count={6} origin={50} opacity={0.4} duration={18} />
              <Halo color="168,213,226" size={54} x={50} y={30} opacity={0.22} duration={13} />
            </>
          }
          parallax={7}
          grain={0.018}
          fadeTo="#f8f5f0"
        />
      )}
    />
  );
}
