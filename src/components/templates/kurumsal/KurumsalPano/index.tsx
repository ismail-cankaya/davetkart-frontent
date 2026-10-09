import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { PanoHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { KurumsalFrame } from '../parts/KurumsalFrame';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalPano — "Mekanik Pano" kurumsal yorumu: terminal kalkış panosu.
 * Grafit gövde, kâğıt beyazı paletler; vurgu işaret kırmızısı — panoda
 * "kalkış" satırını işaretleyen renk.
 */
const KURUMSAL_PANO_THEME = kurumsalTheme({
  id: 'midnight',
  base: 'bg-[#0D0F13]',
  page: 'text-[#DADDE3]',
  surface: 'bg-[#161A20]/85 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#F3F4F1]',
  body: 'text-[#A2A8B0]',
  accent: 'text-[#FF6A4D]',
  accentBg: 'bg-[#FF6A4D]',
  accentSoft: 'bg-[#FF6A4D]/12',
  input:
    'w-full bg-white/[0.05] border border-white/14 px-3.5 py-2.5 text-sm text-[#F3F4F1] placeholder:text-[#8A9099] focus:outline-none focus:border-[#FF6A4D]/70 focus:ring-2 focus:ring-[#FF6A4D]/18 transition duration-300',
  buttonPrimary: 'bg-[#FF6A4D] hover:bg-[#FF8468] text-[#0D0F13] shadow-[0_12px_30px_-14px_rgba(255,106,77,0.55)]',
  buttonGhost: 'border border-white/16 text-[#DADDE3] hover:bg-white/[0.06] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#FF6A4D] via-[#8F9CFF]/35 to-transparent'
});

export function KurumsalPano({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_PANO_THEME}
      renderHero={(props) => <PanoHero {...props} flap="#16191F" ink="#F3F4F1" />}
      renderHeroBackground={({ revealed }) => (
        <HeroStage
          base="linear-gradient(170deg, #171B22 0%, #0E1015 55%, #08090C 100%)"
          scrim={false}
          vignette={{ strength: 0.45 }}
          atmosphere={<Halo color="143,156,255" size={56} x={50} y={42} opacity={0.12} duration={13} />}
          overlay={<KurumsalFrame color="rgba(243,244,241,0.24)" revealed={revealed} />}
          parallax={5}
          grain={0.026}
          fadeTo="#0D0F13"
        />
      )}
    />
  );
}
