import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, AuroraMesh } from '../../shared/effects';
import { BentoHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KurumsalBento — "Bento Editorial": kurumsal davetin doğal dili. Program, konum ve kayıt bilgisi hücre alanıyla hiyerarşiye giriyor.
 */
const KURUMSAL_BENTO_THEME: SectionTheme = {
  id: 'stone',
  base: 'bg-[#f5f6f8]',
  page: 'text-[#464c55]',
  surface: 'bg-white/90 backdrop-blur-sm',
  border: 'border-[#dde1e7]',
  heading: 'text-[#12161c]',
  body: 'text-[#7c838d]',
  accent: 'text-[#1f7a8c]',
  accentBg: 'bg-[#1f7a8c]',
  accentSoft: 'bg-[#1f7a8c]/12',
  input:
    'w-full bg-white border border-[#dde1e7] rounded-lg px-3.5 py-2.5 text-sm text-[#464c55] placeholder:text-[#7c838d] focus:outline-none focus:border-[#1f7a8c] focus:ring-2 focus:ring-[#1f7a8c]/18 transition-all duration-300',
  buttonPrimary:
    'bg-[#12161c] hover:bg-[#242b34] text-[#f5f6f8] shadow-lg shadow-black/10',
  buttonGhost:
    'border border-[#ccd2da] text-[#565d67] hover:bg-[#eaedf1] hover:border-[#aab3bf]',
  divider: 'bg-[#dde1e7]',
  timelineLine: 'from-[#1f7a8c] via-[#a8c4cc]/60 to-transparent'
};

export function KurumsalBento({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_BENTO_THEME}
      renderHero={(props) => <BentoHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="linear-gradient(160deg, #fbfcfd 0%, #f2f4f7 55%, #e9ecf0 100%)"
          scrim={false}
          vignette={false}
          atmosphere={<AuroraMesh colors={['168,196,204', '188,200,216', '204,212,220']} opacity={0.2} duration={32} />}
          parallax={6}
          grain={0.016}
          fadeTo="#f5f6f8"
        />
      )}
    />
  );
}
