import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { UfukHero } from '../../shared/heroes';
import { UfukScene, UFUK_PRESETS } from '../../shared/scenes/ufuk';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** DogumGunuUfuk — "Ufuk" yorumu: mercan gün batımında tepelerden yükselen sıcak hava balonları. */
const DOGUM_GUNU_UFUK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#07061a]',
  page: 'text-[#f0edfa]',
  // Bölümler hareketli bir sahnenin önünden akar: kartlar koyu ve yoğun cam
  // taşır ki arkadaki ışık metnin kontrastını hiçbir an düşürmesin.
  surface: 'bg-[#110e2c]/75 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-white',
  body: 'text-[#c3bddb]',
  accent: 'text-[#ffd27a]',
  accentBg: 'bg-[#ffd27a]',
  accentSoft: 'bg-[#ffd27a]/12',
  input: 'w-full bg-white/[0.06] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffd27a]/70 focus:ring-2 focus:ring-[#ffd27a]/20 transition duration-300',
  buttonPrimary: 'bg-[#ffd27a] hover:brightness-110 text-[#1d1640] shadow-lg shadow-black/30',
  buttonGhost: 'border border-white/20 text-white hover:bg-white/10 hover:border-white/35',
  divider: 'bg-white/12',
  timelineLine: 'from-[#ffd27a] via-[#ffd27a]/40 to-transparent',
};

const SCENE = UFUK_PRESETS['dogum-gunu'];

export function DogumGunuUfuk({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_UFUK_THEME}
      renderBackdrop={(state) => <UfukScene {...state} preset={SCENE} />}
      renderHero={(props) => <UfukHero {...props} scrim={SCENE.scrim} shutter={SCENE.sky.night[0][0]} />}
    />
  );
}
