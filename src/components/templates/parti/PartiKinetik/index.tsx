import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { KinetikHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * PartiKinetik — "Kinetik Tipografi" parti yorumu: mürekkep siyahı zemin, turuncu sinyal.
 *
 * Kayan şeritler burada tam anlamıyla kulüp afişi: hız da, kontrast da
 * kategorinin en yükseği.
 */
const PARTI_KINETIK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0a0a0b]',
  page: 'text-[#dedad8]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f2f2ef]',
  body: 'text-[#87877f]',
  accent: 'text-[#ff8a1f]',
  accentBg: 'bg-[#ff8a1f]',
  accentSoft: 'bg-[#ff8a1f]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f2f2ef] placeholder:text-[#87877f] focus:outline-none focus:border-[#ff8a1f]/60 focus:ring-2 focus:ring-[#ff8a1f]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#ff8a1f] hover:bg-[#ffa24a] text-[#150a02] shadow-lg shadow-[#ff8a1f]/25',
  buttonGhost:
    'border border-white/16 text-[#dedad8] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#ff8a1f] via-[#ff4fa3]/45 to-transparent'
};

export function PartiKinetik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_KINETIK_THEME}
      renderHero={(props) => <KinetikHero {...props} topWord="PARTİ" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #17150f 0%, #0d0c0b 55%, #060606 100%)"
          scrim={false}
          vignette={{ strength: 0.42 }}
          atmosphere={<Halo color="255,138,31" size={58} x={50} y={45} opacity={0.15} duration={10} />}
          parallax={5}
          grain={0.03}
          fadeTo="#0a0a0b"
        />
      )}
    />
  );
}
