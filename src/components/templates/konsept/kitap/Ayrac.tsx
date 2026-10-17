import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { ayracSarkar } from './hareket';

/**
 * Ayraç kurdelesi: sayfanın üst kenarından sarkan, ucu kırlangıç kuyruğu
 * kesilmiş kurdele. Süstür (`aria-hidden`), bilgi taşımaz. Kabı `overflow`
 * kesmelidir; kurdele kabın üstünden iner.
 *
 * Renk ve konum `className`'den; varsayılan kurdele rengidir. Kenarlardaki
 * koyu kılçizgi saten kurdelenin kıvrımını düz renkle söyler (parlama yok).
 */
export function Ayrac({ className }: { className?: string }) {
  return (
    <motion.div {...ayracSarkar} aria-hidden="true" className={cn('absolute top-0 w-[14px] h-[30%] max-h-[260px] min-h-[140px]', className)}>
      <div
        className="h-full w-full bg-[#8C2F2F]"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 9px), 0 100%)',
          backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.22) 0 1px, transparent 1px calc(100% - 1px), rgba(0,0,0,0.22) calc(100% - 1px))'
        }}
      />
    </motion.div>
  );
}
