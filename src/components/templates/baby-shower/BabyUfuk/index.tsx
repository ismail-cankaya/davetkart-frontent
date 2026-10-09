import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { UfukHero } from '../../shared/heroes';
import { UfukScene, UFUK_PRESETS } from '../../shared/scenes/ufuk';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** BabyUfuk — "Ufuk" yorumu: lavanta bulutların üstünde sallanan bir beşik dönencesi. */
const BABY_UFUK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#070a1f]',
  page: 'text-[#eef0fb]',
  // Bölümler hareketli bir sahnenin önünden akar: kartlar koyu ve yoğun cam
  // taşır ki arkadaki ışık metnin kontrastını hiçbir an düşürmesin.
  surface: 'bg-[#0e1437]/75 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-white',
  body: 'text-[#c2c8e6]',
  accent: 'text-[#ffd6e0]',
  accentBg: 'bg-[#ffd6e0]',
  accentSoft: 'bg-[#ffd6e0]/12',
  input: 'w-full bg-white/[0.06] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffd6e0]/70 focus:ring-2 focus:ring-[#ffd6e0]/20 transition duration-300',
  buttonPrimary: 'bg-[#ffd6e0] hover:brightness-110 text-[#1b2150] shadow-lg shadow-black/30',
  buttonGhost: 'border border-white/20 text-white hover:bg-white/10 hover:border-white/35',
  divider: 'bg-white/12',
  timelineLine: 'from-[#ffd6e0] via-[#ffd6e0]/40 to-transparent',
};

const SCENE = UFUK_PRESETS.baby;

export function BabyUfuk({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BABY_SHOWER_FLAVOR}
      mode={mode}
      themeOverride={BABY_UFUK_THEME}
      renderBackdrop={(state) => <UfukScene {...state} preset={SCENE} />}
      renderHero={(props) => <UfukHero {...props} scrim={SCENE.scrim} shutter={SCENE.sky.night[0][0]} />}
    />
  );
}
