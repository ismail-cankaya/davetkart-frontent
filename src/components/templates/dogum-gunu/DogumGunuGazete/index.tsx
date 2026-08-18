import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { GazeteHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuGazete — "Gazete Manşeti" doğum günü yorumu: daveti haber olarak duyuran dizgi. */
const DOGUM_GUNU_GAZETE_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#faf6ec]',
  page: 'text-[#524a3d]',
  surface: 'bg-[#fdfaf2]/85 backdrop-blur-sm',
  border: 'border-[#e9e0cb]',
  heading: 'text-[#1d1a12]',
  body: 'text-[#877f70]',
  accent: 'text-[#d9432f]',
  accentBg: 'bg-[#d9432f]',
  accentSoft: 'bg-[#d9432f]/12',
  input: 'w-full bg-white border border-[#e9e0cb] rounded-lg px-3.5 py-2.5 text-sm text-[#524a3d] placeholder:text-[#877f70] focus:outline-none focus:border-[#d9432f] focus:ring-2 focus:ring-[#d9432f]/18 transition-all duration-300',
  buttonPrimary: 'bg-[#1d1a12] hover:brightness-125 text-[#faf6ec] shadow-lg shadow-black/10',
  buttonGhost: 'border border-[#e9e0cb] text-[#524a3d] hover:bg-[#faf6ec] hover:border-[#d9432f]/40',
  divider: 'bg-[#e9e0cb]',
  timelineLine: 'from-[#d9432f] via-[#d9432f]/40 to-transparent',
};

export function DogumGunuGazete({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_GAZETE_THEME}
      renderHero={(props) => <GazeteHero {...props} masthead="YAŞ GÜNÜ EKSPRES" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(180deg, #fefbf3 0%, #f4efe2 100%)"
          scrim={false}
          vignette={false}
          parallax={4}
          grain={0.024}
          fadeTo="#faf6ec"
        />
      )}
    />
  );
}
