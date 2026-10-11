import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { KURUMSAL_EASE } from './theme';

const PANES = [
  { key: 'a', style: { right: '-10%', top: '9%', width: '62%', height: '42%' }, rotate: -9, drift: 10, duration: 14, delay: 0.1 },
  { key: 'b', style: { right: '16%', top: '48%', width: '42%', height: '30%' }, rotate: 7, drift: -8, duration: 17, delay: 0.25 }
] as const;

/**
 * Buzlu cam levhalar — açık zeminli "Sıvı Cam" sahnesinin ön katmanı.
 *
 * backdrop-filter kullanılmaz: altındaki renk kütleleri zaten bulanık ve her
 * karede hareket ediyor; filtre her karede yeniden örneklenirdi. Camı yarı
 * saydam degrade, parlak kenar ve iç ışık çizgisi kurar.
 */
export function GlassPanes({ revealed }: { revealed: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {PANES.map((pane) => (
        <motion.div
          key={pane.key}
          className="absolute rounded-[22px] border border-white/70"
          style={{
            ...pane.style,
            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.16) 55%, rgba(143,156,255,0.14) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), inset 1px 0 0 rgba(43,63,224,0.18), 0 40px 70px -40px rgba(16,18,40,0.35)'
          }}
          initial={{ opacity: 0, rotate: pane.rotate, y: 0 }}
          animate={revealed ? { opacity: 1, y: reduceMotion ? 0 : [0, pane.drift, 0] } : { opacity: 0, y: 0 }}
          transition={{
            opacity: { duration: 1.1, ease: KURUMSAL_EASE, delay: pane.delay },
            y: reduceMotion
              ? { duration: 0 }
              : { duration: pane.duration, ease: 'easeInOut', repeat: Infinity, delay: pane.delay }
          }}
        />
      ))}
    </div>
  );
}
