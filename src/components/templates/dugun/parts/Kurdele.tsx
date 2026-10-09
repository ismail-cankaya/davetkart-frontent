import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { ease } from '../../../../utils/motion';

/**
 * Kurdele düğümünün çizgileri (24×24). Mühür, hero süsü ve büyük çizim aynı
 * veriden çıkar; biri değişirse hepsi birlikte değişir.
 */
const KNOT = 'M12 9.25 Q13.25 9.25 13.25 10.35 Q13.25 11.45 12 11.45 Q10.75 11.45 10.75 10.35 Q10.75 9.25 12 9.25 Z';
const LOOPS = [
  'M10.8 9.7 C9 7.7 5.7 5.5 3.7 6.6 C1.9 7.6 2.3 11.2 4.4 12 C6.4 12.8 9.1 11.8 10.8 11',
  'M13.2 9.7 C15 7.7 18.3 5.5 20.3 6.6 C22.1 7.6 21.7 11.2 19.6 12 C17.6 12.8 14.9 11.8 13.2 11'
] as const;
const TAILS = [
  'M11.3 11.4 C10.4 13.4 8.6 14.9 8.7 17 C8.8 18.9 7.8 20.3 6.5 21.3',
  'M12.7 11.4 C13.6 13.4 15.4 14.9 15.3 17 C15.2 18.9 16.2 20.3 17.5 21.3'
] as const;
const CREASES = [
  'M10.6 10.4 C8.9 9.5 6.9 9.1 5.4 9.4',
  'M13.4 10.4 C15.1 9.5 17.1 9.1 18.6 9.4'
] as const;

interface KurdeleMarkProps {
  size?: number;
  className?: string;
  /** Kıvrım çizgileri; 24 px altında boğuk durduğu için küçük boyda kapatılır. */
  creases?: boolean;
}

/** Durağan kurdele düğümü — zarf mührü ve ortak hero'ların süsü. */
export function KurdeleMark({ size = 48, className, creases = size >= 28 }: KurdeleMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      strokeWidth={size >= 40 ? 0.8 : 1}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {LOOPS.map((d) => <path key={d} d={d} />)}
      {TAILS.map((d) => <path key={d} d={d} />)}
      {creases && CREASES.map((d) => <path key={d} d={d} strokeOpacity={0.6} strokeWidth={0.6} />)}
      <path d={KNOT} />
    </svg>
  );
}

interface KurdeleCizimProps {
  /** Düğümün piksel boyu. */
  size?: number;
  /** Düğüme iki yandan gelen kurdele çizgilerinin her birinin genişliği (Tailwind sınıfı). */
  lineClassName?: string;
  className?: string;
  /** Girişin başlama gecikmesi (s). */
  delay?: number;
}

/**
 * Hero'nun açılış imzası: iki kurdele ucu ekranın iki yanından gelip ortada
 * buluşur ve düğüm atılır. Önce çizgiler içeri uzanır, sonra ilmekler,
 * en son kuyruklar çizilir.
 *
 * "Hareketi azalt" açıksa düğüm baştan çizili gelir; `pathLength` bir
 * transform olmadığından MotionConfig onu kendiliğinden susturmaz.
 */
export function KurdeleCizim({ size = 60, lineClassName = 'w-16 @sm:w-24', className, delay = 0 }: KurdeleCizimProps) {
  const reduced = useReducedMotion();
  const draw = (at: number, length = 0.9) =>
    reduced
      ? { initial: false as const }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: length, ease: ease.out, delay: delay + at }
        };

  return (
    <div aria-hidden="true" className={cn('flex items-center justify-center', className)}>
      <motion.span
        className={cn('h-px origin-left bg-gradient-to-r from-transparent to-current opacity-70', lineClassName)}
        initial={reduced ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, ease: ease.out, delay }}
      />
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0 -mx-1"
        stroke="currentColor"
        strokeWidth={0.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {LOOPS.map((d) => <motion.path key={d} d={d} {...draw(0.7)} />)}
        {CREASES.map((d) => <motion.path key={d} d={d} strokeWidth={0.45} strokeOpacity={0.6} {...draw(1.2, 0.6)} />)}
        {TAILS.map((d) => <motion.path key={d} d={d} {...draw(1.1, 1)} />)}
        <motion.path d={KNOT} {...draw(0.95, 0.5)} />
      </svg>
      <motion.span
        className={cn('h-px origin-right bg-gradient-to-l from-transparent to-current opacity-70', lineClassName)}
        initial={reduced ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, ease: ease.out, delay }}
      />
    </div>
  );
}
