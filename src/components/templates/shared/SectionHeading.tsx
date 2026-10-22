import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../utils/cn';
import { ease } from '../../../utils/motion';
import { SectionTheme } from './palette';

/** Bölüm girişinin süresi (s) ve kayma mesafesi (px); tema vermezse çağıranın bugünkü değeri. */
export function sectionMotion(theme: SectionTheme, fallback: { duration: number; distance: number }) {
  return {
    duration: theme.sectionMotion?.duration ?? fallback.duration,
    distance: theme.sectionMotion?.distance ?? fallback.distance
  };
}

/** Başa yaslı başlık içerik sütununun (`max-w-md`) sol kenarına oturur. */
export const isStartAligned = (theme: SectionTheme) => theme.headingAlign === 'start';

interface SectionHeadingProps {
  theme: SectionTheme;
  eyebrow: string;
  title: string;
  /** Girişin başlaması için görünmesi gereken oran. */
  amount: number;
  /** Alt boşluk (`mb-10` / `mb-12`). */
  className: string;
  /** Başlığın altındaki açıklama satırı (hediye notu, LCV son günü). */
  children?: React.ReactNode;
}

/** Ortak bölümlerin üst etiket + başlık bloğu. */
export function SectionHeading({ theme, eyebrow, title, amount, className, children }: SectionHeadingProps) {
  const { duration, distance } = sectionMotion(theme, { duration: 0.9, distance: 24 });
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, ease: ease.out }}
      className={cn('text-center', className, isStartAligned(theme) && 'max-w-md mx-auto text-start')}
    >
      <span className={cn('text-[10px] font-semibold tracking-[0.3em] uppercase', theme.accent)}>{eyebrow}</span>
      <h2 className={cn('font-serif text-2xl md:text-3xl font-bold mt-2', theme.heading)}>{title}</h2>
      {children}
    </motion.div>
  );
}
