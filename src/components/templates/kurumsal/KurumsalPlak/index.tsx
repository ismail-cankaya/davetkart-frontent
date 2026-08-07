import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PlakHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KurumsalPlak — "Vinil Plak" kurumsal yorumu: lansman/afterparty. Çelik mavisi etiket.
 *
 * Kurumsal davetin gece yarısı tarafı: gala yemeğinden sonraki set,
 * yıldönümü kutlaması, marka partisi.
 */
const KURUMSAL_PLAK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0b0e12]',
  page: 'text-[#d9dee4]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f0f4f7]',
  body: 'text-[#828b96]',
  accent: 'text-[#5f9fd8]',
  accentBg: 'bg-[#5f9fd8]',
  accentSoft: 'bg-[#5f9fd8]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f0f4f7] placeholder:text-[#828b96] focus:outline-none focus:border-[#5f9fd8]/60 focus:ring-2 focus:ring-[#5f9fd8]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#5f9fd8] hover:bg-[#7cb3e4] text-[#08111a] shadow-lg shadow-[#5f9fd8]/25',
  buttonGhost:
    'border border-white/16 text-[#d9dee4] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#5f9fd8] via-[#1f5f8c]/45 to-transparent'
};

export function KurumsalPlak({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_PLAK_THEME}
      renderHero={(props) => <PlakHero {...props} label="#1f5f8c" labelInk="#eef5fb" spinDuration={42} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 95% 85% at 50% 35%, #141c26 0%, #0d1219 55%, #06080b 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="95,159,216" size={56} x={50} y={38} opacity={0.16} duration={13} />}
          parallax={6}
          grain={0.028}
          fadeTo="#0b0e12"
        />
      )}
    />
  );
}
