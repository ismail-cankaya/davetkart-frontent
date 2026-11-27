import React from 'react';
import { cn } from '../../utils/cn';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Sabit telefon çerçevesi (9:19): genişliği kapsayıcı verir, bütün ölçüler orana bağlıdır.
 * Ekran bir boyut kapsayıcısıdır (`cqh`/`cqw`): içerik ekran yüksekliğine göre kaydırılabilir.
 */
export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        'relative aspect-[9/19] w-full rounded-[13%/6.2%] bg-[#141617] p-[3.8%]',
        'shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.09),0_2px_4px_rgba(4,56,43,0.08),0_24px_48px_-16px_rgba(4,56,43,0.3),0_60px_100px_-40px_rgba(4,56,43,0.35)]',
        className
      )}
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[2.6%] z-10 aspect-square w-[4.4%] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
      />
      <div className="relative h-full w-full overflow-hidden rounded-[9.5%/4.3%] bg-black [container-type:size]">
        {children}
      </div>
    </div>
  );
}
