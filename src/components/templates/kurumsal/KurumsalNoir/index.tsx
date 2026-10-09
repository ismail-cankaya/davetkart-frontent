import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, Halo } from '../../shared/effects';
import { NoirHero } from '../../shared/heroes';
import { KURUMSAL_FLAVOR } from '../flavors';
import { KurumsalFrame } from '../parts/KurumsalFrame';
import { kurumsalTheme } from '../parts/theme';
import { TemplateProps } from '../../types';

/**
 * KurumsalNoir — "Noir Minimal": yönetici daveti. Grafit, platin ve
 * Cormorant; efekt bütçesi en düşük — ciddiyet sessizlikten gelir. Kadrajda
 * yalnızca dört kesim işareti var, cetvel yok.
 */
const KURUMSAL_NOIR_THEME = kurumsalTheme(
  {
    id: 'midnight',
    base: 'theme-cormorant bg-[#0B0C0E]',
    page: 'text-[#D6D8DB]',
    surface: 'bg-[#141518]/85 backdrop-blur-xl',
    border: 'border-[#C5CBD3]/16',
    heading: 'text-[#F3F4F1]',
    body: 'text-[#9EA3A9]',
    accent: 'text-[#C5CBD3]',
    accentBg: 'bg-[#C5CBD3]',
    accentSoft: 'bg-[#C5CBD3]/12',
    input:
      'w-full bg-white/[0.05] border border-[#C5CBD3]/18 px-3.5 py-2.5 text-sm text-[#F3F4F1] placeholder:text-[#8A8F96] focus:outline-none focus:border-[#C5CBD3]/60 focus:ring-2 focus:ring-[#C5CBD3]/15 transition duration-300',
    buttonPrimary: 'bg-[#C5CBD3] hover:bg-[#DDE1E6] text-[#0B0C0E] shadow-none',
    buttonGhost: 'border border-[#C5CBD3]/24 text-[#D6D8DB] hover:bg-[#C5CBD3]/8 hover:border-[#C5CBD3]/45',
    divider: 'bg-[#C5CBD3]/18',
    timelineLine: 'from-[#C5CBD3] via-[#C5CBD3]/30 to-transparent'
  },
  { edge: 'sert', type: 'serif' }
);

export function KurumsalNoir({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KURUMSAL_FLAVOR}
      mode={mode}
      themeOverride={KURUMSAL_NOIR_THEME}
      renderHero={(props) => <NoirHero {...props} />}
      renderHeroBackground={({ revealed }) => (
        <HeroStage
          base="radial-gradient(ellipse 90% 80% at 50% 42%, #141518 0%, #0A0B0D 55%, #050506 100%)"
          scrim={false}
          vignette={{ strength: 0.5 }}
          atmosphere={<Halo color="197,203,211" size={52} x={50} y={42} opacity={0.1} duration={15} />}
          overlay={<KurumsalFrame color="rgba(197,203,211,0.28)" revealed={revealed} ruler={false} />}
          parallax={8}
          grain={0.038}
          fadeTo="#0B0C0E"
        />
      )}
    />
  );
}
