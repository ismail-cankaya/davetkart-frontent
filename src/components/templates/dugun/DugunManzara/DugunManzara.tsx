import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';
import bgImage from './assets/bg.png';

/**
 * DugunManzara — süslü güllü çerçeve görseli, kategori kimliğine çevrilmiş
 * hâliyle: `mix-blend-luminosity` görselin yalnızca ışığını alır, rengini
 * gece zemininden. Yeşil-altın gravür böylece inci-menekşe bir kabartmaya döner.
 */
export function DugunManzara({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunManzara}
      renderHero={(props) => <KurdeleHero {...props} />}
      renderHeroBackground={() => (
        <div className="absolute inset-0 bg-[#121019]">
          <img
            src={bgImage}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-60 select-none"
          />
          {/* Okuma perdesi: çerçevenin ortası koyulaşır, kenardaki gravür görünür kalır. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 64% 50% at 50% 50%, rgba(18,16,25,0.9) 0%, rgba(18,16,25,0.62) 62%, rgba(18,16,25,0.38) 100%)'
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#121019]" />
        </div>
      )}
    />
  );
}
