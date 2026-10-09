import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { UfukHero } from '../../shared/heroes';
import { UfukScene, UFUK_PRESETS } from '../../shared/scenes/ufuk';
import { SUNNET_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** SunnetUfuk — "Ufuk" yorumu: havuzunda yansıyan soğan kubbeli bir saray, hilalin altında. */
const SUNNET_UFUK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#03070f]',
  page: 'text-[#e8eef6]',
  // Bölümler hareketli bir sahnenin önünden akar: kartlar koyu ve yoğun cam
  // taşır ki arkadaki ışık metnin kontrastını hiçbir an düşürmesin.
  surface: 'bg-[#08122a]/75 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-white',
  body: 'text-[#b3c0d2]',
  accent: 'text-[#f2cf7a]',
  accentBg: 'bg-[#f2cf7a]',
  accentSoft: 'bg-[#f2cf7a]/12',
  input: 'w-full bg-white/[0.06] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#f2cf7a]/70 focus:ring-2 focus:ring-[#f2cf7a]/20 transition duration-300',
  buttonPrimary: 'bg-[#f2cf7a] hover:brightness-110 text-[#0b1a2f] shadow-lg shadow-black/30',
  buttonGhost: 'border border-white/20 text-white hover:bg-white/10 hover:border-white/35',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f2cf7a] via-[#f2cf7a]/40 to-transparent',
};

const SCENE = UFUK_PRESETS.sunnet;

export function SunnetUfuk({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SUNNET_FLAVOR}
      mode={mode}
      themeOverride={SUNNET_UFUK_THEME}
      renderBackdrop={(state) => <UfukScene {...state} preset={SCENE} />}
      renderHero={(props) => <UfukHero {...props} scrim={SCENE.scrim} shutter={SCENE.sky.night[0][0]} />}
    />
  );
}
