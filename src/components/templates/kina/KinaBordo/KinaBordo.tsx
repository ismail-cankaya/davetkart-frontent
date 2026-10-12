import React, { useId } from 'react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { videoSet } from '../../shared/videoAssets';
import { HeroStage, SilkVeil, Halo } from '../../shared/effects';
import { KINA_BORDO } from '../themes';
import { KINA_FLAVOR } from '../flavors';
import { KinaHero } from '../parts/KinaHero';
import { TemplateProps } from '../../types';

const VIDEO = videoSet('kina-bordo', { landscape: '50% 50%', portrait: '50% 50%' });

/** Oya pullarının eğri üstündeki yerleri: `y = 46 + 200·t·(1−t)`, t = .1 … .9. */
const PULLAR = [0.1, 0.3, 0.5, 0.7, 0.9].map((t) => [120 * t, 46 + 200 * t * (1 - t)] as const);

/**
 * Al duvak — tepeden sarkan yarı saydam al tül; her 120 px'te bir kavis,
 * kenarında iğne oyası pulları. Desen yatayda tekrarlanır, boyu sabittir.
 */
function Duvak({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const tul = `kina-duvak-${uid}`;
  const pattern = `kina-duvak-desen-${uid}`;
  return (
    <svg aria-hidden="true" className={className} width="100%" height="112" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={tul} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8f1a1a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#b0241c" stopOpacity="0.5" />
        </linearGradient>
        <pattern id={pattern} x="0" y="0" width="120" height="112" patternUnits="userSpaceOnUse">
          <path d="M0 0H120V46Q60 146 0 46Z" fill={`url(#${tul})`} />
          {/* Tülün kıvrımları. */}
          <path d="M30 0V64M60 0V88M90 0V64" stroke="#2a060b" strokeOpacity="0.28" strokeWidth="6" />
          <path d="M0 46Q60 146 120 46" fill="none" stroke="#d8a24a" strokeOpacity="0.85" strokeWidth="1" />
          {PULLAR.map(([x, y]) => (
            <g key={x} fill="#d8a24a">
              <path d={`M${x} ${y}v5`} stroke="#d8a24a" strokeOpacity="0.7" strokeWidth="0.7" />
              <circle cx={x} cy={y + 7} r="1.8" />
              <circle cx={x} cy={y + 11.5} r="0.9" fillOpacity="0.7" />
            </g>
          ))}
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="112" fill={`url(#${pattern})`} />
    </svg>
  );
}

/**
 * KinaBordo — "Al Duvak": şarap ipeği videosunun tepesinden sarkan oyalı al
 * duvak, dalgalanan tül ve sırma pullar. Metin okuma halesiyle videodan
 * ayrılır; sayaç tek satır.
 */
export function KinaBordo({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KINA_FLAVOR}
      mode={mode}
      themeOverride={KINA_BORDO}
      renderHero={(props) => <KinaHero {...props} halo="24,5,12" timer="satir" className="pt-36" />}
      renderHeroBackground={() => (
        <HeroStage
          video={VIDEO}
          base="radial-gradient(ellipse 85% 70% at 50% 45%, #61121f 0%, #2c0810 55%, #150409 100%)"
          scrim={{ from: 'both', strength: 0.5 }}
          vignette={{ strength: 0.55 }}
          atmosphere={
            <>
              <SilkVeil color="176,36,28" opacity={0.42} duration={17} />
              <Halo color="242,160,102" size={62} x={50} y={44} opacity={0.16} duration={10} />
            </>
          }
          particles={[
            {
              preset: 'fairyDust',
              colors: ['#d8a24a', '#ffd27f', '#f2a066'],
              blend: 'screen',
              density: 0.7,
              speed: 0.5,
              opacity: 0.6,
              depth: 0.6,
              seed: 58
            }
          ]}
          overlay={<Duvak className="absolute top-0 inset-x-0" />}
          fadeTo="#1d0710"
        />
      )}
    />
  );
}
