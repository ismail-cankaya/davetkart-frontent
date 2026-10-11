import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage } from '../../shared/effects';
import { SuluboyaHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { KurumsalFrame } from '../parts/KurumsalFrame';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalSuluboya — "Suluboya" kurumsal yorumu: kobalt ışığı, platin ve
 * soluk çivit lekeleri. Leke serbest, kadraj ölçülü: kesim işaretleri
 * boyanın bir prova kâğıdına sürüldüğünü söyler.
 */
const KURUMSAL_SULUBOYA_THEME = kurumsalTheme({
  id: 'stone',
  base: 'bg-[#F4F4F1]',
  page: 'text-[#3E434B]',
  surface: 'bg-white/85 backdrop-blur-sm',
  border: 'border-[#101216]/12',
  heading: 'text-[#101216]',
  body: 'text-[#565B63]',
  accent: 'text-[#2B3FE0]',
  accentBg: 'bg-[#2B3FE0]',
  accentSoft: 'bg-[#2B3FE0]/10',
  input:
    'w-full bg-white border border-[#101216]/14 px-3.5 py-2.5 text-sm text-[#101216] placeholder:text-[#6B7079] focus:outline-none focus:border-[#2B3FE0] focus:ring-2 focus:ring-[#2B3FE0]/18 transition duration-300',
  buttonPrimary: 'bg-[#2B3FE0] hover:bg-[#2233C2] text-white shadow-[0_12px_28px_-16px_rgba(43,63,224,0.7)]',
  buttonGhost: 'border border-[#101216]/18 text-[#101216] hover:bg-[#E4E4DE] hover:border-[#101216]/30',
  divider: 'bg-[#101216]/12',
  timelineLine: 'from-[#2B3FE0] via-[#8F9CFF]/50 to-transparent'
});

export function KurumsalSuluboya({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_SULUBOYA_THEME}
      renderHero={(props) => <SuluboyaHero {...props} washes={['#8F9CFF', '#C5CBD3', '#A9B7E8']} seed={83} />}
      renderHeroBackground={({ revealed }) => (
        <HeroStage
          base="linear-gradient(180deg, #FCFCFB 0%, #F0F0EC 100%)"
          scrim={false}
          vignette={false}
          overlay={<KurumsalFrame color="rgba(16,18,22,0.22)" revealed={revealed} />}
          parallax={4}
          grain={0.022}
          fadeTo="#F4F4F1"
        />
      )}
    />
  );
}
