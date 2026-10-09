import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { PaperHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalKagit — "Kağıt & Mühür" kurumsal yorumu: resmî davetiye.
 *
 * Gala yemeği, ödül töreni ve resmî açılışın fiziksel karşılığı: kabartma
 * baskılı kart ve kurum mührü. Mühür kırmızı ya da altın değil koyu kobalt —
 * kategorinin sinyali mumda da sürer. Serif başlık korunur (resmî kayıt).
 */
const KURUMSAL_KAGIT_THEME = kurumsalTheme(
  {
    id: 'stone',
    base: 'bg-[#F1F1ED]',
    page: 'text-[#3E434B]',
    surface: 'bg-white/85 backdrop-blur-sm',
    border: 'border-[#101216]/12',
    heading: 'text-[#101216]',
    body: 'text-[#565B63]',
    accent: 'text-[#2233C2]',
    accentBg: 'bg-[#2233C2]',
    accentSoft: 'bg-[#2233C2]/10',
    input:
      'w-full bg-white border border-[#101216]/14 px-3.5 py-2.5 text-sm text-[#101216] placeholder:text-[#6B7079] focus:outline-none focus:border-[#2233C2] focus:ring-2 focus:ring-[#2233C2]/18 transition duration-300',
    buttonPrimary: 'bg-[#101216] hover:bg-[#2233C2] text-[#F1F1ED] shadow-lg shadow-black/10',
    buttonGhost: 'border border-[#101216]/18 text-[#101216] hover:bg-[#E4E4DE] hover:border-[#101216]/30',
    divider: 'bg-[#101216]/12',
    timelineLine: 'from-[#2233C2] via-[#C5CBD3]/60 to-transparent'
  },
  { type: 'serif' }
);

export function KurumsalKagit({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_KAGIT_THEME}
      renderHero={(props) => <PaperHero {...props} sealColor="#2233C2" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 40%, #F5F5F2 0%, #E9E9E3 55%, #DCDCD5 100%)"
          scrim={false}
          vignette={false}
          parallax={6}
          grain={0.02}
          fadeTo="#F1F1ED"
        />
      )}
    />
  );
}
