import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { PanoHero } from '../../shared/heroes';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * MezuniyetPano — "Mekanik Pano" mezuniyet yorumu: kalkış panosu.
 *
 * Kategoriyle en doğrudan örtüşen metafor: mezuniyet bir varış değil,
 * sıradaki uçuşun ilan edildiği andır.
 */
const MEZUNIYET_PANO_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0c0e13]',
  page: 'text-[#dcdfe4]',
  surface: 'bg-white/[0.05] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f0f3f7]',
  body: 'text-[#858b94]',
  accent: 'text-[#d8843f]',
  accentBg: 'bg-[#d8843f]',
  accentSoft: 'bg-[#d8843f]/12',
  input:
    'w-full bg-white/[0.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f0f3f7] placeholder:text-[#858b94] focus:outline-none focus:border-[#d8843f]/60 focus:ring-2 focus:ring-[#d8843f]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#d8843f] hover:bg-[#e59c5e] text-[#140b04] shadow-lg shadow-[#d8843f]/25',
  buttonGhost: 'border border-white/16 text-[#dcdfe4] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#d8843f] via-[#5f7f9f]/45 to-transparent'
};

export function MezuniyetPano({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEZUNIYET_FLAVOR}
      mode={mode}
      themeOverride={MEZUNIYET_PANO_THEME}
      renderHero={(props) => <PanoHero {...props} flap="#151920" ink="#f0f3f7" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #171b24 0%, #0d1015 55%, #07080b 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="216,132,63" size={54} x={50} y={42} opacity={0.14} duration={13} />}
          parallax={5}
          grain={0.026}
          fadeTo="#0c0e13"
        />
      )}
    />
  );
}
