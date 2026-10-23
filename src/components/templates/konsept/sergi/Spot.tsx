import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { spotYanar } from './hareket';

/**
 * Tek spot ışığı: çok hafif sıcak beyaz, radyal; konseptteki tek degrade.
 *
 * Aydınlattığı öğenin `relative` kabına konur. Kap yığın bağlamı kurmamalıdır
 * (`isolate`, `z-*` yok): spot `-z-10` ile kapağın bütün yazılarının
 * arkasına, duvarın önüne iner. Varsayılan konum eserin üst kenarıdır; duvar
 * yazısı gibi başka bir hedefte `className` ile kaydırılır. Işık metni yalnızca
 * açar, karartmaz: kontrastın en kötü noktası düz duvardır.
 */
export function Spot({ className, gecikme = 0 }: { className?: string; gecikme?: number }) {
  return (
    <motion.div
      aria-hidden="true"
      {...spotYanar(gecikme)}
      className={cn(
        'pointer-events-none absolute -z-10 left-1/2 top-0 w-[190%] aspect-[1.15] -translate-x-1/2 -translate-y-[38%]',
        'bg-[radial-gradient(ellipse_closest-side_at_50%_50%,var(--sg-spot),rgba(255,252,244,0.55)_45%,rgba(255,252,244,0)_100%)]',
        className
      )}
    />
  );
}
