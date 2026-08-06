import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { SectionTheme } from '../../shared/palette';
import { HeroStage, Halo } from '../../shared/effects';
import { NoirHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { TemplateProps } from '../../types';

/**
 * KurumsalNoir — "Noir Minimal": yönetici daveti. Efekt bütçesi en düşük; ciddiyet sessizlikten geliyor.
 */
const KURUMSAL_NOIR_THEME: SectionTheme = {
  id: 'midnight',
  base: 'theme-cormorant bg-[#060607]',
  page: 'text-[#d4d6d8]',
  surface: 'bg-white/[0.06] backdrop-blur-xl',
  border: 'border-[#a8b4bd]/16',
  heading: 'text-[#f4f6f7]',
  body: 'text-[#868a8e]',
  accent: 'text-[#a8b4bd]',
  accentBg: 'bg-[#a8b4bd]',
  accentSoft: 'bg-[#a8b4bd]/12',
  input:
    'w-full bg-white/[0.06] border border-[#a8b4bd]/16 rounded-none px-3.5 py-2.5 text-sm text-[#f4f6f7] placeholder:text-[#868a8e] focus:outline-none focus:border-[#a8b4bd]/60 focus:ring-2 focus:ring-[#a8b4bd]/15 transition-all duration-300',
  buttonPrimary:
    'rounded-none bg-[#a8b4bd] hover:bg-[#bdc7ce] text-[#08090a] shadow-none',
  buttonGhost:
    'rounded-none border border-[#a8b4bd]/22 text-[#d4d6d8] hover:bg-[#a8b4bd]/8 hover:border-[#a8b4bd]/40',
  divider: 'bg-[#a8b4bd]/18',
  timelineLine: 'from-[#a8b4bd] via-[#a8b4bd]/30 to-transparent'
};

export function KurumsalNoir({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_NOIR_THEME}
      renderHero={(props) => <NoirHero {...props} />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 42%, #121415 0%, #08090a 55%, #040405 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="168,180,189" size={52} x={50} y={42} opacity={0.12} duration={15} />}
          parallax={8}
          grain={0.038}
          fadeTo="#060607"
        />
      )}
    />
  );
}
