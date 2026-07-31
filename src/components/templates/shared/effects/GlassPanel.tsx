import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { GoldSheen } from './atmosphere';

export interface GlassPanelProps {
  children: React.ReactNode;
  /**
   * 'light' videonun koyu bölgesine oturur (beyaz cam), 'dark' aydınlık
   * videoya oturur (füme cam), 'gold' şampanya/altın konseptler içindir.
   */
  tone?: 'light' | 'dark' | 'gold';
  /** Üst kenarda gezen metalik parlama. */
  sheen?: boolean;
  /** Girişte aşağıdan yükselerek belirme gecikmesi (saniye). */
  delay?: number;
  className?: string;
}

const TONE: Record<NonNullable<GlassPanelProps['tone']>, string> = {
  light: 'bg-white/10 border-white/25 shadow-black/30',
  dark: 'bg-black/25 border-white/15 shadow-black/40',
  gold: 'bg-[#c9a961]/10 border-[#e4cd94]/30 shadow-black/35'
};

/**
 * Premium cam yüzey (glassmorphism).
 *
 * Ucuz glassmorphism ile aranın açıldığı üç detay:
 *  1. Üst kenarda 1px'lik açık "highlight" — camın kalınlığını o çizgi verir.
 *  2. backdrop-blur ile birlikte hafif satürasyon artışı; blur tek başına
 *     arkadaki rengi soldurur, saturate onu geri getirir.
 *  3. Geniş ve yumuşak gölge: panel yüzeye yapışık değil, üstünde durur.
 */
export function GlassPanel({
  children,
  tone = 'light',
  sheen = false,
  delay = 0,
  className
}: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative overflow-hidden rounded-2xl border backdrop-blur-xl backdrop-saturate-150',
        'shadow-[0_18px_50px_-12px_var(--tw-shadow-color)]',
        TONE[tone],
        className
      )}
    >
      {/* Cam kalınlığı: üstte parlak, altta sönen hairline. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
      />
      {sheen && <GoldSheen opacity={0.25} duration={7} />}

      <div className="relative">{children}</div>
    </motion.div>
  );
}
