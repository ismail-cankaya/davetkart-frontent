import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Hourglass, SearchX, ShieldCheck, ShieldQuestionMark, X } from 'lucide-react';
import { duration, ease, spring } from '../../../utils/motion';

export type EmblemTone = 'progress' | 'success' | 'warning' | 'danger' | 'unknown' | 'missing';

/** Her tonun zemin halesi — ikonun arkasında yumuşak, renkli bir ışık. */
const HALO: Record<EmblemTone, string> = {
  progress: 'bg-brand/10',
  success: 'bg-gold/30',
  warning: 'bg-amber-200/50',
  danger: 'bg-rose-200/50',
  unknown: 'bg-stone-300/40',
  missing: 'bg-stone-300/40'
};

const SPARKS = 8;

/**
 * Onay anının tek seferlik kıvılcımları. Yalnızca `transform` + `opacity`
 * canlanır (compositor); hareketi azaltan kullanıcıda hiç çizilmez.
 */
function SuccessSparks() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {Array.from({ length: SPARKS }, (_, i) => {
        const angle = (i / SPARKS) * Math.PI * 2 - Math.PI / 2;
        const radius = i % 2 === 0 ? 76 : 62;
        return (
          <motion.span
            key={i}
            className={`absolute left-1/2 top-1/2 -ml-1 -mt-1 w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-gold' : 'bg-champagne'}`}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, scale: [0, 1, 0.4], opacity: [1, 1, 0] }}
            transition={{ duration: 0.9, ease: ease.out, delay: 0.3 }}
          />
        );
      })}
    </div>
  );
}

/**
 * Dönen bir yay: onay beklenirken tek hareketli öğe. SVG'nin tamamı döner
 * (iz tam bir çember olduğu için dönüşü görünmez) — `transform` compositor'da
 * kalır. Döngünün ömrü yoklama bütçesiyle sınırlı: 30 sn sonra ekran değişir.
 */
function ProgressRing({ still }: { still: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 112 112"
      className="absolute inset-0 w-full h-full"
      animate={still ? undefined : { rotate: 360 }}
      transition={{ duration: 1.4, ease: 'linear', repeat: Infinity }}
      aria-hidden
    >
      <circle cx="56" cy="56" r="52" fill="none" strokeWidth="3" className="stroke-brand/10" />
      <circle
        cx="56"
        cy="56"
        r="52"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="72 255"
        className="stroke-brand"
      />
    </motion.svg>
  );
}

function Core({ tone }: { tone: EmblemTone }) {
  switch (tone) {
    case 'progress':
      return (
        <span className="w-[76px] h-[76px] rounded-full bg-white shadow-lg shadow-brand/10 border border-brand/10 flex items-center justify-center text-brand">
          <ShieldCheck size={30} strokeWidth={1.75} />
        </span>
      );
    case 'success':
      return (
        <span className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-soft to-brand-deep shadow-xl shadow-brand/30 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-11 h-11" fill="none" aria-hidden>
            <motion.path
              d="M5 12.5l4.5 4.5L19 7.5"
              className="stroke-champagne"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: ease.out, delay: 0.18 }}
            />
          </svg>
        </span>
      );
    case 'warning':
      return (
        <span className="w-24 h-24 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <Hourglass size={34} strokeWidth={1.6} />
        </span>
      );
    case 'danger':
      return (
        <span className="w-24 h-24 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
          <X size={38} strokeWidth={1.8} />
        </span>
      );
    case 'unknown':
      return (
        <span className="w-24 h-24 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500">
          <ShieldQuestionMark size={34} strokeWidth={1.6} />
        </span>
      );
    case 'missing':
      return (
        <span className="w-24 h-24 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500">
          <SearchX size={34} strokeWidth={1.6} />
        </span>
      );
  }
}

/**
 * Dönüş sayfasının amblemi: ödemenin hangi durumda olduğunu tek bakışta,
 * metni okumadan anlatır. Ton değiştiğinde (onay → onaylandı) eski amblem
 * hızlanarak çekilir, yenisi yay ile oturur.
 */
export function PaymentStatusEmblem({ tone }: { tone: EmblemTone }) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="relative w-28 h-28 mx-auto" role="presentation">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tone}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1, transition: spring.soft }}
          exit={{ opacity: 0, scale: 0.85, transition: { duration: duration.fast, ease: ease.in } }}
        >
          <span className={`absolute -inset-6 rounded-full blur-2xl ${HALO[tone]}`} aria-hidden />

          {tone === 'progress' && <ProgressRing still={reduceMotion} />}

          {/* Onay anında tek bir halka dışa doğru yayılır ve söner. */}
          {tone === 'success' && !reduceMotion && (
            <motion.span
              className="absolute inset-2 rounded-full border-2 border-gold/60"
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1.55, opacity: 0 }}
              transition={{ duration: 1.1, ease: ease.out, delay: 0.2 }}
              aria-hidden
            />
          )}
          {tone === 'success' && !reduceMotion && <SuccessSparks />}

          <span className="relative">
            <Core tone={tone} />
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
