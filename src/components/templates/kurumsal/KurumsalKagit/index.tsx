import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage } from '../../shared/effects';
import { PaperHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KurumsalKagit — "Kağıt & Mühür" kurumsal yorumu: resmî davetiye. Fildişi kart, koyu yeşil mühür.
 *
 * Gala yemeği, ödül töreni ve resmî açılış davetlerinin fiziksel karşılığı
 * budur: kabartma baskılı kart ve kurum mührü. Ekranda da aynı ciddiyeti
 * kuran tek dil.
 */
const KURUMSAL_KAGIT_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f2f1ec]',
  page: 'text-[#4f4d45]',
  surface: 'bg-white/80 backdrop-blur-sm',
  border: 'border-[#dcd8cc]',
  heading: 'text-[#1c1b18]',
  body: 'text-[#7d7a70]',
  accent: 'text-[#2c4a44]',
  accentBg: 'bg-[#2c4a44]',
  accentSoft: 'bg-[#2c4a44]/12',
  input:
    'w-full bg-white border border-[#dcd8cc] rounded-lg px-3.5 py-2.5 text-sm text-[#4f4d45] placeholder:text-[#7d7a70] focus:outline-none focus:border-[#2c4a44] focus:ring-2 focus:ring-[#2c4a44]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#1c1b18] hover:bg-[#33312b] text-[#f6f5f0] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d1ccbe] text-[#5e5c53] hover:bg-[#eae8e0] hover:border-[#b3ada0]',
  divider: 'bg-[#dcd8cc]',
  timelineLine: 'from-[#2c4a44] via-[#adbdb6]/60 to-transparent'
};

export function KurumsalKagit({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_KAGIT_THEME}
      renderHero={(props) => <PaperHero {...props} sealColor="#2c4a44" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 40%, #f5f4ef 0%, #eae8e0 55%, #dedbd0 100%)"
          scrim={false}
          vignette={false}
          parallax={6}
          grain={0.02}
          fadeTo="#f2f1ec"
        />
      )}
    />
  );
}
