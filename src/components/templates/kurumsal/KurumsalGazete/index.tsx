import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { GazeteHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalGazete — "Gazete Manşeti" kurumsal yorumu: daveti haber olarak duyuran dizgi. */
const KURUMSAL_GAZETE_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f3f5f6]',
  page: 'text-[#484e52]',
  surface: 'bg-[#f9fbfc]/85 backdrop-blur-sm',
  border: 'border-[#dfe3e6]',
  heading: 'text-[#12171a]',
  body: 'text-[#7c848a]',
  accent: 'text-[#1f5f7f]',
  accentBg: 'bg-[#1f5f7f]',
  accentSoft: 'bg-[#1f5f7f]/12',
  input: 'w-full bg-white border border-[#dfe3e6] rounded-lg px-3.5 py-2.5 text-sm text-[#484e52] placeholder:text-[#7c848a] focus:outline-none focus:border-[#1f5f7f] focus:ring-2 focus:ring-[#1f5f7f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#12171a] hover:brightness-125 text-[#f3f5f6] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#dfe3e6] text-[#484e52] hover:bg-[#f3f5f6] hover:border-[#1f5f7f]/40',
  divider: 'bg-[#dfe3e6]',
  timelineLine: 'from-[#1f5f7f] via-[#1f5f7f]/40 to-transparent',
};

export function KurumsalGazete({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_GAZETE_THEME}
      renderHero={(props) => <GazeteHero {...props} masthead="KURUMSAL BÜLTEN" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fafcfd 0%, #eef1f3 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f3f5f6"
        />
      )}
    />
  );
}
