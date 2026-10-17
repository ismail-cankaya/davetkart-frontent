import React from 'react';
import { cn } from '../../../../utils/cn';

interface AdlarProps {
  /** `kisiler()` çıktısı; boşsa çağıran yedek metni verir. */
  kisiler: string[];
  /** İkinci ve sonraki satırları içeri al (asimetrik duvar yazısı). */
  girinti?: boolean;
  /** `&` işaretinin sınıfı (renk, duruş). */
  ampersandClassName?: string;
}

/**
 * Duvar yazısının adları: her kişi kendi satırında, ikincisi `&` ile başlar.
 * Satırlar `text-wrap: balance` ile dengelenir; uzun ad kesilmez. Satır
 * sonundaki boşluk görünmez ama metinde kalır: ekran okuyucu "A & B" okur.
 */
export function Adlar({ kisiler, girinti = false, ampersandClassName }: AdlarProps) {
  return (
    <>
      {kisiler.map((ad, i) => (
        <span key={ad + i} className={cn('block [text-wrap:balance] [overflow-wrap:break-word]', i > 0 && girinti && 'pl-[0.6em]')}>
          {i > 0 && <span className={ampersandClassName}>&amp; </span>}
          {ad}
          {i < kisiler.length - 1 && ' '}
        </span>
      ))}
    </>
  );
}
