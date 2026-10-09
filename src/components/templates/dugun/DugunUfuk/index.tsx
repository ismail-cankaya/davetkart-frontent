import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { UfukHero } from '../../shared/heroes';
import { UfukScene, UFUK_PRESETS } from '../../shared/scenes/ufuk';
import { DUGUN_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DugunUfuk — "Ufuk" yorumu: servi bahçesindeki rotundada gün batımından yıldızlı geceye uzanan bir akşam. */
const DUGUN_UFUK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#05070f]',
  page: 'text-[#ece8f4]',
  // Bölümler hareketli bir sahnenin önünden akar: kartlar koyu ve yoğun cam
  // taşır ki arkadaki ışık metnin kontrastını hiçbir an düşürmesin.
  surface: 'bg-[#0b0d1d]/75 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-white',
  body: 'text-[#bdb8cf]',
  accent: 'text-[#f3cf9b]',
  accentBg: 'bg-[#f3cf9b]',
  accentSoft: 'bg-[#f3cf9b]/12',
  input: 'w-full bg-white/[0.06] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#f3cf9b]/70 focus:ring-2 focus:ring-[#f3cf9b]/20 transition duration-300',
  buttonPrimary: 'bg-[#f3cf9b] hover:brightness-110 text-[#1a1426] shadow-lg shadow-black/30',
  buttonGhost: 'border border-white/20 text-white hover:bg-white/10 hover:border-white/35',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f3cf9b] via-[#f3cf9b]/40 to-transparent',
};

const SCENE = UFUK_PRESETS.dugun;

export function DugunUfuk({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_UFUK_THEME}
      renderBackdrop={(state) => <UfukScene {...state} preset={SCENE} />}
      renderHero={(props) => <UfukHero {...props} scrim={SCENE.scrim} shutter={SCENE.sky.night[0][0]} />}
    />
  );
}
