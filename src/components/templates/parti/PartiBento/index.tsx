import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh } from '../../shared/effects';
import { BentoHero } from '../../shared/heroes';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * PartiBento — "Bento Editorial" parti yorumu: gece zeminli ızgara, asit yeşili vurgu.
 *
 * Bento diğer kategorilerde açık zeminlidir; parti daveti gece kimliğini
 * kaybedemeyeceği için hücreler cam yüzeye alındı. Izgara mantığı aynı:
 * hiyerarşiyi font boyutu değil hücre ALANI taşıyor.
 */
const PARTI_BENTO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0b0b0f]',
  page: 'text-[#dfe2d8]',
  surface: 'bg-white/[0.06] backdrop-blur-xl',
  border: 'border-white/12',
  heading: 'text-[#f6f7f2]',
  body: 'text-[#8e9285]',
  accent: 'text-[#a3e635]',
  accentBg: 'bg-[#a3e635]',
  accentSoft: 'bg-[#a3e635]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f6f7f2] placeholder:text-[#8e9285] focus:outline-none focus:border-[#a3e635]/60 focus:ring-2 focus:ring-[#a3e635]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#a3e635] hover:bg-[#b7ef5c] text-[#0e1206] shadow-lg shadow-[#a3e635]/25',
  buttonGhost:
    'border border-white/16 text-[#dfe2d8] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#a3e635] via-[#4fd1c5]/45 to-transparent'
};

export function PartiBento({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_BENTO_THEME}
      renderHero={(props) => <BentoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #16180f 0%, #0d0e10 55%, #070708 100%)"
          scrim={{ from: 'both', strength: 0.28 }}
          vignette={{ strength: 0.45 }}
          atmosphere={<AuroraMesh colors={['163,230,53', '79,209,197', '120,120,255']} opacity={0.34} duration={24} />}
          parallax={7}
          grain={0.028}
          fadeTo="#0b0b0f"
        />
      )}
    />
  );
}
