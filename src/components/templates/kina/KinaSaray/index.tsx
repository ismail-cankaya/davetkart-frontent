import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { HeroStage, LightLeak, Halo, Arches } from '../../shared/effects';
import { KINA_SARAY } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { KinaHero } from '../parts/KinaHero';
import { TemplateProps } from '../../types';

/**
 * KinaSaray — "Kına Odası": sivri kemerlerin ardında mum ışığı; metin kemer
 * biçimli bir pencerenin içinde oturur. İki ışık sızıntısı farklı hızda
 * geçer: tek bir alev değil, odadaki bütün mumlar.
 */
export function KinaSaray({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_SARAY}
      renderHero={(props) => <KinaHero {...props} panel="kemer" flame="#ffd27f" className="pt-16 pb-20" />}
      renderHeroBackground={() => (
        <HeroStage
          base="radial-gradient(ellipse 85% 70% at 50% 30%, #6e2414 0%, #3a100a 55%, #1a0604 100%)"
          scrim={{ from: 'both', strength: 0.4 }}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <Halo color="255,190,110" size={64} x={50} y={30} opacity={0.3} duration={9} />
              <Arches color="36,10,7" opacity={0.92} count={5} pointed seed={13} />
              <LightLeak color="255,214,160" opacity={0.3} duration={10} />
              <LightLeak color="255,170,120" opacity={0.2} duration={15} />
            </>
          }
          particles={[
            {
              preset: 'embers',
              colors: ['#ffc777', '#f2803c', '#ffe1a8'],
              blend: 'screen',
              density: 0.6,
              speed: 0.55,
              opacity: 0.7,
              depth: 0.8,
              seed: 68
            }
          ]}
          fadeTo="#240a07"
        />
      )}
    />
  );
}
