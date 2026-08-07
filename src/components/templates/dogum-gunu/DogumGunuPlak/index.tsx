import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PlakHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DogumGunuPlak — "Vinil Plak" doğum günü yorumu: 45'lik single. Kırmızı etiket, hızlı dönüş.
 *
 * Dönüş süresi kategorinin en kısası: plak burada nostaljik değil, parti
 * enerjisini taşıyan bir öğe.
 */
const DOGUM_GUNU_PLAK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#121014]',
  page: 'text-[#e6dee2]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f8f2f4]',
  body: 'text-[#928a8f]',
  accent: 'text-[#f2758a]',
  accentBg: 'bg-[#f2758a]',
  accentSoft: 'bg-[#f2758a]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f8f2f4] placeholder:text-[#928a8f] focus:outline-none focus:border-[#f2758a]/60 focus:ring-2 focus:ring-[#f2758a]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#f2758a] hover:bg-[#f78ea0] text-[#18090d] shadow-lg shadow-[#f2758a]/25',
  buttonGhost:
    'border border-white/16 text-[#e6dee2] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f2758a] via-[#e8455f]/45 to-transparent'
};

export function DogumGunuPlak({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_PLAK_THEME}
      renderHero={(props) => <PlakHero {...props} label="#e8455f" labelInk="#fff2f4" spinDuration={34} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #241a22 0%, #161217 55%, #0a080b 100%)"
          scrim={false}
          vignette={{ strength: 0.48 }}
          atmosphere={<Halo color="242,117,138" size={58} x={50} y={38} opacity={0.18} duration={10} />}
          parallax={7}
          grain={0.03}
          fadeTo="#121014"
        />
      )}
    />
  );
}
