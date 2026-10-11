import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { YildizHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { RegistrationGrid } from '../parts/RegistrationGrid';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalYildizHaritasi — "Yıldız Haritası" kurumsal yorumu: veri haritası
 * tonunda takımyıldız. Kobalt ışığı çizgiler, altta koordinat ızgarası.
 */
const KURUMSAL_YILDIZ_THEME = kurumsalTheme({
  id: 'midnight',
  base: 'bg-[#080A11]',
  page: 'text-[#D9DCE4]',
  surface: 'bg-[#11141D]/85 backdrop-blur-md',
  border: 'border-white/12',
  heading: 'text-[#F3F4F1]',
  body: 'text-[#A0A6B3]',
  accent: 'text-[#8F9CFF]',
  accentBg: 'bg-[#8F9CFF]',
  accentSoft: 'bg-[#8F9CFF]/12',
  input:
    'w-full bg-white/[0.05] border border-white/14 px-3.5 py-2.5 text-sm text-[#F3F4F1] placeholder:text-[#8A90A0] focus:outline-none focus:border-[#8F9CFF] focus:ring-2 focus:ring-[#8F9CFF]/20 transition duration-300',
  buttonPrimary: 'bg-[#8F9CFF] hover:bg-[#A9B3FF] text-[#080A11] shadow-[0_12px_30px_-14px_rgba(143,156,255,0.6)]',
  buttonGhost: 'border border-white/16 text-[#D9DCE4] hover:bg-white/[0.06] hover:border-white/30',
  divider: 'bg-white/12',
  timelineLine: 'from-[#8F9CFF] via-[#2B3FE0]/45 to-transparent'
});

export function KurumsalYildizHaritasi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_YILDIZ_THEME}
      renderHero={(props) => <YildizHero {...props} star="#F3F4F1" line="#8F9CFF" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 100% 85% at 50% 30%, #121A33 0%, #0A0E1A 55%, #040509 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={
            <>
              <RegistrationGrid color="rgba(143,156,255,0.24)" />
              <Halo color="43,63,224" size={56} x={50} y={34} opacity={0.18} duration={15} />
            </>
          }
          parallax={6}
          grain={0.026}
          fadeTo="#080A11"
        />
      )}
    />
  );
}
