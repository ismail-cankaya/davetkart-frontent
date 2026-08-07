import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PlakHero } from '../../shared/heroes';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * BabyPlak — "Vinil Plak" baby shower yorumu: ninni plağı. AÇIK zemin, hardal etiket.
 *
 * Plak dilinin tek açık sürümü: gövde yine koyu (tırnaklar ancak koyu
 * yüzeyde okunur) ama sayfa gündüz tarafında kalıyor. Dönüş de en yavaşı —
 * ninni temposu.
 */
const BABY_PLAK_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f4ef]',
  page: 'text-[#585349]',
  surface: 'bg-white/85 backdrop-blur-sm',
  border: 'border-[#e2ddd0]',
  heading: 'text-[#2a271f]',
  body: 'text-[#8a8478]',
  accent: 'text-[#b08a1e]',
  accentBg: 'bg-[#b08a1e]',
  accentSoft: 'bg-[#b08a1e]/14',
  input:
    'w-full bg-white border border-[#e2ddd0] rounded-lg px-3.5 py-2.5 text-sm text-[#585349] placeholder:text-[#8a8478] focus:outline-none focus:border-[#b08a1e] focus:ring-2 focus:ring-[#b08a1e]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#2a271f] hover:bg-[#433e31] text-[#f6f4ef] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d8d2c2] text-[#67614f] hover:bg-[#eeeade] hover:border-[#bcb49c]',
  divider: 'bg-[#e2ddd0]',
  timelineLine: 'from-[#b08a1e] via-[#dcc78a]/60 to-transparent'
};

export function BabyPlak({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_PLAK_THEME}
      renderHero={(props) => (
        <PlakHero {...props} label="#dcb43c" labelInk="#2a2214" disc="#2b2822" spinDuration={58} />
      )}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 38%, #fdfbf6 0%, #f3efe6 55%, #e9e3d6 100%)"
          scrim={false}
          vignette={false}
          atmosphere={<Halo color="220,180,60" size={54} x={50} y={38} opacity={0.16} duration={14} />}
          parallax={5}
          grain={0.018}
          fadeTo="#f6f4ef"
        />
      )}
    />
  );
}
