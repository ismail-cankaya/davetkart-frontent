import React from 'react';
import { motion } from 'motion/react';
import { InvitationComposition } from '../../shared/InvitationComposition';
import { DUGUN_FLAVOR } from '../flavors';
import { DUGUN_THEMES } from '../themes';
import { KurdeleHero } from '../parts/KurdeleHero';
import { TemplateProps } from '../../types';
import { ease } from '../../../../utils/motion';

/** Çapraz kurdele bantları ve kesişimlerine dizili inciler — gelinlik kafesi. */
function InciKafes({ revealed }: { revealed: boolean }) {
  const id = `inci-kafes-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const bead = 'rgba(239,232,243,0.5)';
  return (
    <motion.svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: revealed ? 1 : 0 }}
      transition={{ duration: 1.8, ease: ease.out, delay: 0.2 }}
    >
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <path
            d="M3 0 L56 53 M0 53 L3 56 M0 3 L53 56 M53 0 L56 3 M53 0 L0 53 M56 53 L53 56 M56 3 L3 56 M3 0 L0 3"
            fill="none"
            stroke="rgba(217,208,226,0.26)"
            strokeWidth="0.7"
          />
          <circle cx="28" cy="28" r="2.4" fill={bead} />
          <circle cx="27.3" cy="27.3" r="0.8" fill="rgba(255,255,255,0.7)" />
          {[0, 56].map((x) => [0, 56].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.7" fill={bead} />))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </motion.svg>
  );
}

/**
 * DugunSekilli — "İnci Motif": mersin gecesinde baştan sona inci kafes;
 * metin kafesin önünde, üstü kemerli koyu bir plakette durur. Plaketin
 * çift çizgisi (kenar + 6 px boşluk + ikinci kıl çizgi) gölgeyle çizilir.
 */
export function DugunSekilli({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DUGUN_FLAVOR}
      mode={mode}
      themeOverride={DUGUN_THEMES.DugunSekilli}
      renderHero={(props) => (
        <KurdeleHero
          {...props}
          panelClassName="rounded-t-[999px] rounded-b-[1.75rem] pt-24 @sm:pt-28 pb-10 bg-[#0f1714]/95 border border-[#dcd2e6]/30 shadow-[0_0_0_6px_rgba(15,23,20,0.95),0_0_0_7px_rgba(220,210,230,0.2)]"
        />
      )}
      renderHeroBackground={({ revealed }) => (
        <div className="absolute inset-0 bg-[#0f1714]">
          <InciKafes revealed={revealed} />
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(15,23,20,0.35) 0%, rgba(15,23,20,0) 100%)' }}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0f1714]" />
        </div>
      )}
    />
  );
}
