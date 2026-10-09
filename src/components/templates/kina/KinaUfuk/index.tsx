import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { UfukHero } from '../../shared/heroes';
import { UfukScene, UFUK_PRESETS } from '../../shared/scenes/ufuk';
import { KINA_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KinaUfuk — "Ufuk" yorumu: fenerlerin altında, terastan kubbeli bir şehre bakan kına gecesi. */
const KINA_UFUK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#07040a]',
  page: 'text-[#f4e9ea]',
  // Bölümler hareketli bir sahnenin önünden akar: kartlar koyu ve yoğun cam
  // taşır ki arkadaki ışık metnin kontrastını hiçbir an düşürmesin.
  surface: 'bg-[#140912]/75 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-white',
  body: 'text-[#cdb6bd]',
  accent: 'text-[#ffb866]',
  accentBg: 'bg-[#ffb866]',
  accentSoft: 'bg-[#ffb866]/12',
  input: 'w-full bg-white/[0.06] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffb866]/70 focus:ring-2 focus:ring-[#ffb866]/20 transition duration-300',
  buttonPrimary: 'bg-[#ffb866] hover:brightness-110 text-[#2a0f17] shadow-lg shadow-black/30',
  buttonGhost: 'border border-white/20 text-white hover:bg-white/10 hover:border-white/35',
  divider: 'bg-white/12',
  timelineLine: 'from-[#ffb866] via-[#ffb866]/40 to-transparent',
};

const SCENE = UFUK_PRESETS.kina;

export function KinaUfuk({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_UFUK_THEME}
      renderBackdrop={(state) => <UfukScene {...state} preset={SCENE} />}
      renderHero={(props) => <UfukHero {...props} scrim={SCENE.scrim} shutter={SCENE.sky.night[0][0]} />}
    />
  );
}
