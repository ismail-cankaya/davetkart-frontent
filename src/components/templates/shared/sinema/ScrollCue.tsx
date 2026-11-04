import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';

/** Kapak ekranının altında nefes alan ince çizgi: "aşağıda devamı var". */
export function ScrollCue({ delay = 3.2, className, lineClassName }: { delay?: number; className?: string; lineClassName?: string }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      aria-hidden="true"
      className={cn('absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2', className)}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1.2 }}
    >
      <span className="text-[9px] tracking-[0.4em] uppercase opacity-70">Kaydırın</span>
      <span className="relative block w-px h-10 overflow-hidden bg-current/20">
        {!reduced && (
          <motion.span
            className={cn('absolute inset-x-0 top-0 h-1/2 bg-current', lineClassName)}
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </span>
    </motion.div>
  );
}
