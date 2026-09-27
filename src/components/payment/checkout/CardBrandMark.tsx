import React from 'react';
import { cn } from '../../../utils/cn';
import type { CardBrand } from '../../../utils/paymentCard';

interface CardBrandMarkProps {
  brand: Exclude<CardBrand, 'unknown'>;
  /** `badge`: açık zeminde beyaz rozet · `onCard`: koyu kart önizlemesinin üstü. */
  variant?: 'badge' | 'onCard';
  className?: string;
}

/**
 * Kart ağlarının kabul işaretleri — görsel dosya yerine CSS ile çizilir ki
 * ödeme sayfası ek bir ağ isteğine ve lisanslı logo dosyasına bağlı kalmasın.
 */
export function CardBrandMark({ brand, variant = 'badge', className }: CardBrandMarkProps) {
  const onCard = variant === 'onCard';

  const mark = (() => {
    switch (brand) {
      case 'visa':
        return (
          <span className={cn('font-black italic tracking-tight leading-none', onCard ? 'text-white text-xl' : 'text-[#1a1f71] text-[11px]')}>
            VISA
          </span>
        );
      case 'mastercard':
        return (
          <span className={cn('relative inline-flex items-center', onCard ? 'w-11 h-7' : 'w-6 h-4')} aria-hidden>
            <span className={cn('absolute left-0 rounded-full bg-[#eb001b]', onCard ? 'w-7 h-7' : 'w-4 h-4')} />
            <span className={cn('absolute right-0 rounded-full bg-[#f79e1b] mix-blend-multiply', onCard ? 'w-7 h-7' : 'w-4 h-4')} />
          </span>
        );
      case 'troy':
        return (
          <span className={cn('font-extrabold lowercase tracking-tight leading-none', onCard ? 'text-white text-xl' : 'text-[#0a7c86] text-[12px]')}>
            troy
          </span>
        );
      case 'amex':
        return (
          <span
            className={cn(
              'font-black tracking-tight leading-none rounded-[3px] bg-[#2e77bc] text-white',
              onCard ? 'text-xs px-1.5 py-1' : 'text-[8px] px-1 py-0.5'
            )}
          >
            AMEX
          </span>
        );
    }
  })();

  if (onCard) return <span className={cn('inline-flex items-center', className)}>{mark}</span>;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center h-6 min-w-9 px-1.5 rounded-md bg-white border border-ink/[0.08] shadow-sm',
        className
      )}
      title={brand === 'amex' ? 'American Express' : brand[0].toUpperCase() + brand.slice(1)}
    >
      {mark}
    </span>
  );
}
