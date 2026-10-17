import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { eserAsilir } from './hareket';

interface CerceveProps {
  children: React.ReactNode;
  /** Eserin en/boy oranı (CSS `aspect-ratio`). */
  oran?: string;
  /** Paspartu payı, çerçeve genişliğine göre yüzde. */
  paspartu?: number;
  /** Asılma gecikmesi (s). */
  gecikme?: number;
  className?: string;
}

/**
 * Duvara asılı çerçeve: beyaz paspartu, ince kenar, tek yumuşak gölge
 * (§5). Altın ya da oyma çerçeve yok; köşe yuvarlaması yok. Gölge
 * canlandırılmaz, çerçeveyle birlikte asılır.
 *
 * Paspartu kesiminin iç kenarı tek kıl çizgidir; eser onun içinde kırpılır.
 */
export function Cerceve({ children, oran = '4 / 5', paspartu = 9, gecikme = 0, className }: CerceveProps) {
  return (
    <motion.div
      {...eserAsilir(gecikme)}
      className={cn(
        'relative bg-[var(--sg-cerceve)] border border-[var(--sg-kenar)] [box-shadow:var(--sg-cerceve-golge)] origin-top',
        className
      )}
      style={{ padding: `${paspartu}%` }}
    >
      <div
        className="relative overflow-hidden [box-shadow:0_0_0_1px_rgba(0,0,0,0.07)]"
        style={{ aspectRatio: oran }}
      >
        {children}
      </div>
    </motion.div>
  );
}
