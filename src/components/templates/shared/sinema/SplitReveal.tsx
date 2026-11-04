import React, { useMemo } from 'react';
import { motion, useReducedMotion, type TargetAndTransition } from 'motion/react';
import { cn } from '../../../../utils/cn';

/** Harf harf bölünmesi bitişik yazıyı (Arapça vb.) bozacak metinler kelime kelime açılır. */
const JOINING_SCRIPT = /[֐-ࣿיִ-﷿ﹰ-﻿]/;

function graphemes(text: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment(s: string): Iterable<{ segment: string }> } }).Segmenter;
  if (Seg) return Array.from(new Seg('tr', { granularity: 'grapheme' }).segment(text), (s) => s.segment);
  return Array.from(text);
}

export type RevealStyle = 'rise' | 'blur' | 'mask' | 'scale' | 'drop' | 'glow';

const FROM: Record<RevealStyle, TargetAndTransition> = {
  rise: { opacity: 0, y: '0.55em' },
  blur: { opacity: 0, filter: 'blur(14px)', scale: 1.08 },
  mask: { y: '110%' },
  scale: { opacity: 0, scale: 0.4 },
  drop: { opacity: 0, y: '-0.8em', rotateX: 80 },
  glow: { opacity: 0, filter: 'blur(6px) brightness(2.2)' }
};
const TO: Record<RevealStyle, TargetAndTransition> = {
  rise: { opacity: 1, y: 0 },
  blur: { opacity: 1, filter: 'blur(0px)', scale: 1 },
  mask: { y: '0%' },
  scale: { opacity: 1, scale: 1 },
  drop: { opacity: 1, y: 0, rotateX: 0 },
  glow: { opacity: 1, filter: 'blur(0px) brightness(1)' }
};

interface SplitRevealProps {
  text: string;
  style?: RevealStyle;
  delay?: number;
  /** Harfler arası gecikme (sn). */
  stagger?: number;
  duration?: number;
  className?: string;
  /** Her harfe ek sınıf (ör. degrade metin). */
  charClassName?: string;
}

/**
 * Metni harf (grapheme) harf sahneye getirir. Ekran okuyucu tek parça metni
 * okur (`aria-label`); harf kutuları gizlidir. Hareketi azalt açıksa düz metin.
 */
export function SplitReveal({ text, style = 'rise', delay = 0, stagger = 0.045, duration = 0.9, className, charClassName }: SplitRevealProps) {
  const reduced = useReducedMotion() ?? false;
  /** Kelimeler bölünmez (`nowrap`): satır yalnızca boşlukta kırılır. */
  const words = useMemo(() => {
    const joining = JOINING_SCRIPT.test(text);
    return text.split(/(\s+)/).map((w) => (joining || /^\s+$/.test(w) ? [w] : graphemes(w)));
  }, [text]);

  if (reduced) return <span className={className}>{text}</span>;

  const masked = style === 'mask';
  let index = 0;
  const letter = (part: string, key: number) => {
    const k = index++;
    const char = (
      <motion.span
        key={key}
        aria-hidden="true"
        className={cn('inline-block will-change-transform', charClassName)}
        initial={FROM[style]}
        animate={TO[style]}
        transition={{ duration, delay: delay + k * stagger, ease: [0.22, 1, 0.36, 1] }}
        style={style === 'drop' ? { transformOrigin: '50% 0%' } : undefined}
      >
        {part}
      </motion.span>
    );
    return masked ? (
      <span key={key} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
        {char}
      </span>
    ) : (
      char
    );
  };
  return (
    <span className={cn('inline', className)} aria-label={text} role="text">
      {words.map((word, i) =>
        /^\s+$/.test(word[0]) ? (
          <span key={i} aria-hidden="true">{word[0]}</span>
        ) : (
          <span key={i} aria-hidden="true" className="inline-block whitespace-nowrap">
            {word.map((part, j) => letter(part, j))}
          </span>
        )
      )}
    </span>
  );
}
