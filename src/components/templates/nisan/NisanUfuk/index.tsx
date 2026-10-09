import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { UfukHero } from '../../shared/heroes';
import { UfukScene, UFUK_PRESETS } from '../../shared/scenes/ufuk';
import { NISAN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** NisanUfuk — "Ufuk" yorumu: ampul dizileri altında çiçekli bir kemer; gül kurusu alacakaranlık. */
const NISAN_UFUK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#06060f]',
  page: 'text-[#f1ebf3]',
  // Bölümler hareketli bir sahnenin önünden akar: kartlar koyu ve yoğun cam
  // taşır ki arkadaki ışık metnin kontrastını hiçbir an düşürmesin.
  surface: 'bg-[#0f0d1f]/75 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-white',
  body: 'text-[#c4bccf]',
  accent: 'text-[#f7b9c4]',
  accentBg: 'bg-[#f7b9c4]',
  accentSoft: 'bg-[#f7b9c4]/12',
  input: 'w-full bg-white/[0.06] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#f7b9c4]/70 focus:ring-2 focus:ring-[#f7b9c4]/20 transition duration-300',
  buttonPrimary: 'bg-[#f7b9c4] hover:brightness-110 text-[#2a1626] shadow-lg shadow-black/30',
  buttonGhost: 'border border-white/20 text-white hover:bg-white/10 hover:border-white/35',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f7b9c4] via-[#f7b9c4]/40 to-transparent',
};

const SCENE = UFUK_PRESETS.nisan;

export function NisanUfuk({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={NISAN_FLAVOR}
      mode={mode}
      themeOverride={NISAN_UFUK_THEME}
      renderBackdrop={(state) => <UfukScene {...state} preset={SCENE} />}
      renderHero={(props) => <UfukHero {...props} scrim={SCENE.scrim} shutter={SCENE.sky.night[0][0]} />}
    />
  );
}
