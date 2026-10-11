import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { UfukHero } from '../../shared/heroes';
import { UfukScene, UFUK_PRESETS } from '../../shared/scenes/ufuk';
import { KURUMSAL_FLAVOR } from '../flavors';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalUfuk — "Ufuk" yorumu: mavi saatte cam kuleler ve eğik askılı bir
 * köprü. Sahne ortak ön ayardan gelir (kapak görseli onunla basılır);
 * kategori kimliği bölümlerde: grotesk başlık, kobalt ışığı vurgu.
 * Hero'nun hap biçimli rozeti korunur (köşe: serbest).
 */
const KURUMSAL_UFUK_THEME = kurumsalTheme(
  {
    id: 'midnight',
    base: 'bg-[#03070D]',
    page: 'text-[#E6EEF5]',
    // Bölümler hareketli bir sahnenin önünden akar: kartlar koyu ve yoğun cam
    // taşır ki arkadaki ışık metnin kontrastını hiçbir an düşürmesin.
    surface: 'bg-[#08121F]/80 backdrop-blur-md',
    border: 'border-white/12',
    heading: 'text-white',
    body: 'text-[#B0C0CF]',
    accent: 'text-[#9FAAFF]',
    accentBg: 'bg-[#9FAAFF]',
    accentSoft: 'bg-[#9FAAFF]/12',
    input:
      'w-full bg-white/[0.06] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/55 focus:outline-none focus:border-[#9FAAFF]/70 focus:ring-2 focus:ring-[#9FAAFF]/20 transition duration-300',
    buttonPrimary: 'bg-[#9FAAFF] hover:brightness-110 text-[#071120] shadow-lg shadow-black/30',
    buttonGhost: 'border border-white/20 text-white hover:bg-white/10 hover:border-white/35',
    divider: 'bg-white/12',
    timelineLine: 'from-[#9FAAFF] via-[#9FAAFF]/40 to-transparent'
  },
  { edge: 'serbest' }
);

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
