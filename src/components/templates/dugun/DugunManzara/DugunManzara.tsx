import React from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';
import bgImage from './assets/bg.png';

/**
 * DugunManzara — "İnci Gravür": süslü güllü çerçeve görseli gri tona çekilip
 * tersine çevrilir; koyu yeşil zemin tül beyazına, altın gravür gümüş bir
 * kalem işine döner. Lila çarpım katmanı gravüre kategori morunu verir.
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
        <div className="absolute inset-0 bg-[#f6f3f7]">
          <img
            src={bgImage}
            alt=""
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover opacity-40 select-none"
            style={{ filter: 'grayscale(1) invert(1) contrast(1.6)' }}
          />
          <div className="absolute inset-0 bg-[#e9e1ef] mix-blend-multiply" />
          {/* Okuma tülü: metnin oturduğu orta alan açılır, gravür kenarlarda kalır. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 62% 50% at 50% 50%, rgba(246,243,247,0.92) 0%, rgba(246,243,247,0.75) 60%, rgba(246,243,247,0.45) 100%)'
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#f6f3f7]" />
        </div>
      )}
    />
  );
}
