import React from 'react';
import { motion } from 'motion/react';
import { ease } from '../../../../utils/motion';
import { KinaMotionStyles } from '../parts/motion';

/**
 * "Yüksek Tepeler" — kına türküsünün manzarası: kayısı akşamında üç sıra
 * tepe, en yüksek tepede ışığı yanan bir ev, ona kıvrılan yol.
 * Tepeler sabit yükseklikte altta durur; metin `KinaHero`'nun alt boşluğuyla
 * üstlerinde kalır, hero uzarsa sahne de uzar.
 */
export function TepelerSahnesi({ revealed }: { revealed: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #fcf3e9 0%, #f9e6d3 48%, #f4d0b0 76%, #eebb90 92%)' }}
    >
      <KinaMotionStyles />
      {/* Akşam güneşi: tepelerin ardından nefes alan ışık. */}
      <div
        data-atmosphere=""
        className="kina-glow absolute left-[62%] bottom-[96px] @md:bottom-[120px] w-[340px] h-[340px] -translate-x-1/2 translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(246,160,96,0.55), rgba(246,160,96,0) 66%)', animationDuration: '7s' }}
      />
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 400 170"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 w-full h-[170px] @md:h-[210px]"
        initial={{ y: 28, opacity: 0 }}
        animate={revealed ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
        transition={{ duration: 1.4, ease: ease.out }}
      >
        <path d="M0 92C40 70 70 62 110 74S180 96 220 72S300 30 340 46S385 70 400 64L400 170L0 170Z" fill="#e3a87f" />
        {/* Yüksek tepedeki ev: beyaz duvar, al çatı, yanan pencere. */}
        <g transform="translate(330 35)">
          <rect x="-7" y="-6" width="14" height="10" fill="#fcf3e9" />
          <path d="M-9-6L0-13L9-6Z" fill="#b0241c" />
          <rect x="-1.6" y="-3.2" width="3.2" height="3.2" fill="#ffc96b" />
        </g>
        <path d="M0 118C50 98 90 104 140 116S230 132 270 112S350 90 400 104L400 170L0 170Z" fill="#b46944" />
        <path
          d="M178 170C186 152 212 140 232 128S282 104 300 84S324 52 330 42"
          fill="none"
          stroke="#fcf3e9"
          strokeOpacity="0.7"
          strokeWidth="1.6"
          strokeDasharray="3 4"
          strokeLinecap="round"
        />
        <path d="M0 142C60 126 110 132 160 142S260 156 310 138S370 128 400 134L400 170L0 170Z" fill="#6c2e1a" />
        {/* Kına ağaçları: yakın tepede yuvarlak, zeytin yeşili taçlar. */}
        <g fill="#5a5e22">
          <circle cx="38" cy="128" r="7" />
          <circle cx="50" cy="131" r="5.5" />
          <circle cx="352" cy="124" r="6" />
        </g>
        <g stroke="#3a1a0e" strokeWidth="1.4">
          <path d="M38 135V141M50 136V142M352 130V136" />
        </g>
      </motion.svg>
    </div>
  );
}
