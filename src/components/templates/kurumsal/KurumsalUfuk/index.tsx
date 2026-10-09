import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { UfukHero } from '../../shared/heroes';
import { UfukScene, UFUK_PRESETS } from '../../shared/scenes/ufuk';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/** KurumsalUfuk — "Ufuk" yorumu: mavi saatte cam kuleler ve eğik askılı bir köprü. */
const KURUMSAL_UFUK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#03070d]',
  page: 'text-[#e6eef5]',
  // Bölümler hareketli bir sahnenin önünden akar: kartlar koyu ve yoğun cam
  // taşır ki arkadaki ışık metnin kontrastını hiçbir an düşürmesin.
  surface: 'bg-[#08121f]/75 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-white',
  body: 'text-[#b0c0cf]',
  accent: 'text-[#8fd8ea]',
  accentBg: 'bg-[#8fd8ea]',
  accentSoft: 'bg-[#8fd8ea]/12',
  input: 'w-full bg-white/[0.06] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#8fd8ea]/70 focus:ring-2 focus:ring-[#8fd8ea]/20 transition duration-300',
  buttonPrimary: 'bg-[#8fd8ea] hover:brightness-110 text-[#071120] shadow-lg shadow-black/30',
  buttonGhost: 'border border-white/20 text-white hover:bg-white/10 hover:border-white/35',
  divider: 'bg-white/12',
  timelineLine: 'from-[#8fd8ea] via-[#8fd8ea]/40 to-transparent',
};

const SCENE = UFUK_PRESETS.kurumsal;

export function KurumsalUfuk({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_UFUK_THEME}
      renderBackdrop={(state) => <UfukScene {...state} preset={SCENE} />}
      renderHero={(props) => <UfukHero {...props} scrim={SCENE.scrim} shutter={SCENE.sky.night[0][0]} />}
    />
  );
}
