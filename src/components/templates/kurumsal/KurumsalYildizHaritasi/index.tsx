import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { YildizHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalYildizHaritasi — "Yıldız Haritası" kurumsal yorumu: veri haritası tonunda; çelik mavisi. */
const KURUMSAL_YILDIZ_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#06090e]',
  page: 'text-[#d7dde3]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#eff3f6]',
  body: 'text-[#818a94]',
  accent: 'text-[#8fb8d8]',
  accentBg: 'bg-[#8fb8d8]',
  accentSoft: 'bg-[#8fb8d8]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#eff3f6] placeholder:text-[#818a94] focus:outline-none focus:border-[#8fb8d8]/60 focus:ring-2 focus:ring-[#8fb8d8]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#8fb8d8] hover:bg-[#a8cae4] text-[#06090e] shadow-lg shadow-[#8fb8d8]/20',
  buttonGhost: 'border border-white/16 text-[#d7dde3] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#8fb8d8] via-[#4f6f8c]/45 to-transparent'
};

export function KurumsalYildizHaritasi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_YILDIZ_THEME}
      renderHero={(props) => <YildizHero {...props} star="#ffffff" line="#8fb8d8" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 30%, #101c28 0%, #080f16 55%, #030507 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="143,184,216" size={54} x={50} y={34} opacity={0.13} duration={15} />}
          parallax={6}
          grain={0.026}
          fadeTo="#06090e"
        />
      )}
    />
  );
}
