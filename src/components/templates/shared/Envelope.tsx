import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Invitation } from '../../../types';
import { cn } from '../../../utils/cn';
import { SectionTheme } from './palette';
import { TemplateFlavor } from './flavor';
import { ease } from '../../../utils/motion';

interface EnvelopeProps {
  invitation: Invitation;
  theme: SectionTheme;
  flavor: TemplateFlavor;
  /** Fired once the opening animation finishes so the parent can unmount us. */
  onOpened: () => void;
}

/**
 * Full-screen envelope gate. A tap breaks the wax seal, the flap swings open
 * in 3D and the whole envelope glides away to reveal the invitation.
 */
export function Envelope({ invitation, theme, flavor, onOpened }: EnvelopeProps) {
  const [opening, setOpening] = useState(false);
  const isDark = theme.id === 'midnight';
  const { Ornament } = flavor;

  const paper = isDark
    ? 'bg-gradient-to-b from-slate-800 to-slate-900'
    : 'bg-gradient-to-b from-stone-100 to-stone-200';
  const flap = isDark ? 'bg-slate-700' : 'bg-stone-300';
  const seal = isDark ? 'bg-amber-300 text-slate-950' : 'bg-stone-800 text-stone-50';

  const handleOpen = () => {
    if (!opening) setOpening(true);
  };

  return (
    <motion.div
      className={cn(
        'absolute inset-0 z-40 flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none',
        theme.page,
        theme.base
      )}
      onClick={handleOpen}
      initial={{ opacity: 1 }}
      animate={opening ? { opacity: 0, y: '-100%' } : { opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: ease.out, delay: opening ? 0.9 : 0 }}
      onAnimationComplete={() => {
        if (opening) onOpened();
      }}
    >
      {/* Ambient glow behind the envelope */}
      <div
        className={cn(
          'absolute w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none',
          isDark ? 'bg-amber-300/10' : 'bg-rose-200/40'
        )}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: ease.out }}
        className="relative w-[82%] max-w-sm"
        style={{ perspective: 900 }}
      >
        {/* Envelope body */}
        <div className={cn('relative w-full aspect-[7/5] rounded-xl shadow-2xl shadow-black/30', paper)}>
          {/* Inner letter peeking out while opening */}
          <motion.div
            className={cn(
              'absolute left-[6%] right-[6%] top-[8%] bottom-[8%] rounded-lg flex flex-col items-center justify-center gap-1.5 px-4',
              isDark ? 'bg-slate-950 border border-white/10' : 'bg-white border border-stone-200'
            )}
            initial={false}
            animate={opening ? { y: '-46%', scale: 1.02 } : { y: 0 }}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.45 }}
          >
            <span className={cn('text-[9px] font-semibold tracking-[0.3em] uppercase', theme.accent)}>
              {flavor.envelopeLabel}
            </span>
            <span className={cn('font-serif italic text-xl text-center leading-snug', theme.heading)}>
              {invitation.names || 'Davetlisiniz'}
            </span>
          </motion.div>

          {/* Side folds */}
          <div
            className={cn('absolute inset-0 rounded-xl pointer-events-none', flap)}
            style={{ clipPath: 'polygon(0 0, 0 100%, 50% 55%)', opacity: 0.55 }}
          />
          <div
            className={cn('absolute inset-0 rounded-xl pointer-events-none', flap)}
            style={{ clipPath: 'polygon(100% 0, 100% 100%, 50% 55%)', opacity: 0.55 }}
          />
          <div
            className={cn('absolute inset-0 rounded-xl pointer-events-none', flap)}
            style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 45%)', opacity: 0.85 }}
          />

          {/* Top flap — swings open in 3D */}
          <motion.div
            className={cn('absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-xl', flap)}
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 96%)',
              transformStyle: 'preserve-3d',
              zIndex: opening ? 0 : 20
            }}
            initial={false}
            animate={opening ? { rotateX: 180 } : { rotateX: 0 }}
            transition={{ duration: 0.7, ease: ease.out }}
          />

          {/* Wax seal */}
          <motion.button
            type="button"
            aria-label="Davetiyeyi aç"
            className={cn(
              'absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full',
              'flex items-center justify-center shadow-xl shadow-black/25 cursor-pointer',
              seal
            )}
            initial={false}
            animate={opening ? { scale: 0, rotate: 45, opacity: 0 } : { scale: 1 }}
            whileHover={opening ? undefined : { scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.4, ease: ease.out }}
          >
            <Ornament size={30} />
          </motion.button>
        </div>

        {/* Hint — bekleme nabzı CSS'te, compositor'da döner (bkz. index.css).
            🔴 Nabız içteki span'dedir: aynı elemanın opaklığını hem Motion
            (açılırken söndürme) hem CSS animasyonu yönetirse Chrome animasyonu
            compositor'a alamıyor ve sayfa boştayken bile her karede ana thread
            çalışıyordu. Opaklıklar çarpıldığı için görünüm aynıdır. */}
        <motion.p
          className={cn('mt-8 text-center text-[11px] font-medium tracking-[0.25em] uppercase', theme.body)}
          animate={{ opacity: opening ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className={opening ? 'inline-block' : 'inline-block animate-hint-fade'}>Mühre dokunarak açın</span>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
