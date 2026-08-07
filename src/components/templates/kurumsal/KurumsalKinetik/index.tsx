import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { KinetikHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KurumsalKinetik — "Kinetik Tipografi" kurumsal yorumu: konferans afişi. Grafit zemin, sinyal turuncusu.
 *
 * Zirve ve lansman iletişiminin standart dili iri tipografidir; kayan
 * şerit bunu ekranda hareketli hale getirir.
 */
const KURUMSAL_KINETIK_THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0e1116]',
  page: 'text-[#dbe0e5]',
  surface: 'bg-white/[0.06] backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#f2f5f7]',
  body: 'text-[#828b96]',
  accent: 'text-[#f2653a]',
  accentBg: 'bg-[#f2653a]',
  accentSoft: 'bg-[#f2653a]/12',
  input:
    'w-full bg-white/[0.06] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#f2f5f7] placeholder:text-[#828b96] focus:outline-none focus:border-[#f2653a]/60 focus:ring-2 focus:ring-[#f2653a]/15 transition-all duration-300',
  buttonPrimary:
    'bg-[#f2653a] hover:bg-[#ff7d55] text-[#120704] shadow-lg shadow-[#f2653a]/25',
  buttonGhost:
    'border border-white/16 text-[#dbe0e5] hover:bg-white/[0.08] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#f2653a] via-[#6ea8ff]/40 to-transparent'
};

export function KurumsalKinetik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_KINETIK_THEME}
      renderHero={(props) => <KinetikHero {...props} topWord="DAVET" />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(170deg, #182029 0%, #0f1319 55%, #080a0d 100%)"
          scrim={false}
          vignette={{ strength: 0.42 }}
          atmosphere={<Halo color="242,101,58" size={56} x={50} y={45} opacity={0.13} duration={12} />}
          parallax={5}
          grain={0.028}
          fadeTo="#0e1116"
        />
      )}
    />
  );
}
