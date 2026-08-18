import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { GazeteHero } from '../../shared/heroes';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetGazete — "Gazete Manşeti" sünnet yorumu: daveti haber olarak duyuran dizgi. */
const SUNNET_GAZETE_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f2f5f6]',
  page: 'text-[#47525a]',
  surface: 'bg-[#f9fbfc]/85 backdrop-blur-sm',
  border: 'border-[#dde4e8]',
  heading: 'text-[#141c22]',
  body: 'text-[#7c868e]',
  accent: 'text-[#1f6f8c]',
  accentBg: 'bg-[#1f6f8c]',
  accentSoft: 'bg-[#1f6f8c]/12',
  input: 'w-full bg-white border border-[#dde4e8] rounded-lg px-3.5 py-2.5 text-sm text-[#47525a] placeholder:text-[#7c868e] focus:outline-none focus:border-[#1f6f8c] focus:ring-2 focus:ring-[#1f6f8c]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#141c22] hover:brightness-125 text-[#f2f5f6] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#dde4e8] text-[#47525a] hover:bg-[#f2f5f6] hover:border-[#1f6f8c]/40',
  divider: 'bg-[#dde4e8]',
  timelineLine: 'from-[#1f6f8c] via-[#1f6f8c]/40 to-transparent',
};

export function SunnetGazete({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_GAZETE_THEME}
      renderHero={(props) => <GazeteHero {...props} masthead="SÜNNET POSTASI" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fafcfd 0%, #edf1f3 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#f2f5f6"
        />
      )}
    />
  );
}
