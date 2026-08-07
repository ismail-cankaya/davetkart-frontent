import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh } from '../../shared/effects';
import { BentoHero } from '../../shared/heroes';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * DogumGunuBento — "Bento Editorial" doğum günü yorumu: nötr kağıt zemin, mandalina vurgusu.
 *
 * Kategorinin diğer şablonları pembe/altın etrafında dönüyor; ızgara dili
 * zaten canlı olduğu için burada tek bir sıcak vurgu rengi yetiyor —
 * fazlası hücrelerin hiyerarşisini bozardı.
 */
const DOGUM_GUNU_BENTO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f6f6f4]',
  page: 'text-[#4b4842]',
  surface: 'bg-white/90 backdrop-blur-sm',
  border: 'border-[#e2e0da]',
  heading: 'text-[#1b1a17]',
  body: 'text-[#7d7a73]',
  accent: 'text-[#f26b3a]',
  accentBg: 'bg-[#f26b3a]',
  accentSoft: 'bg-[#f26b3a]/12',
  input:
    'w-full bg-white border border-[#e2e0da] rounded-lg px-3.5 py-2.5 text-sm text-[#4b4842] placeholder:text-[#7d7a73] focus:outline-none focus:border-[#f26b3a] focus:ring-2 focus:ring-[#f26b3a]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#1b1a17] hover:bg-[#333029] text-[#f6f6f4] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#d6d3cb] text-[#5b584f] hover:bg-[#eceae4] hover:border-[#b5b1a6]',
  divider: 'bg-[#e2e0da]',
  timelineLine: 'from-[#f26b3a] via-[#f6c8a8]/60 to-transparent'
};

export function DogumGunuBento({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DOGUM_GUNU_FLAVOR}
      mode={mode}
      themeOverride={DOGUM_GUNU_BENTO_THEME}
      renderHero={(props) => <BentoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #fdfdfb 0%, #f5f4f0 55%, #edebe5 100%)"
          scrim={false}
          vignette={false}
          atmosphere={<AuroraMesh colors={['242,107,58', '255,196,120', '255,232,204']} opacity={0.18} duration={28} />}
          parallax={6}
          grain={0.016}
          fadeTo="#f6f6f4"
        />
      )}
    />
  );
}
