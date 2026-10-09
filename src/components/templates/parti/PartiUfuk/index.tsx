import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { UfukHero } from '../../shared/heroes';
import { UfukScene, UFUK_PRESETS } from '../../shared/scenes/ufuk';
import { PARTI_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** PartiUfuk — "Ufuk" yorumu: pencereleri tek tek yanan, neonu suya yansıyan bir şehir. */
const PARTI_UFUK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#040208]',
  page: 'text-[#f5ecf8]',
  // Bölümler hareketli bir sahnenin önünden akar: kartlar koyu ve yoğun cam
  // taşır ki arkadaki ışık metnin kontrastını hiçbir an düşürmesin.
  surface: 'bg-[#0d0618]/75 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-white',
  body: 'text-[#c8b8d6]',
  accent: 'text-[#ff7ab6]',
  accentBg: 'bg-[#ff7ab6]',
  accentSoft: 'bg-[#ff7ab6]/12',
  input: 'w-full bg-white/[0.06] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7ab6]/70 focus:ring-2 focus:ring-[#ff7ab6]/20 transition duration-300',
  buttonPrimary: 'bg-[#ff7ab6] hover:brightness-110 text-[#1a0620] shadow-lg shadow-black/30',
  buttonGhost: 'border border-white/20 text-white hover:bg-white/10 hover:border-white/35',
  divider: 'bg-white/12',
  timelineLine: 'from-[#ff7ab6] via-[#ff7ab6]/40 to-transparent',
};

const SCENE = UFUK_PRESETS.parti;

export function PartiUfuk({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={PARTI_FLAVOR}
      mode={mode}
      themeOverride={PARTI_UFUK_THEME}
      renderBackdrop={(state) => <UfukScene {...state} preset={SCENE} />}
      renderHero={(props) => <UfukHero {...props} scrim={SCENE.scrim} shutter={SCENE.sky.night[0][0]} />}
    />
  );
}
