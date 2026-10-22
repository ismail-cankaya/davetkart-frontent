import React from 'react';
import { cn } from '../../../../utils/cn';

/**
 * Kapak ve iç kapak başlığı: adlar Caslon Display ile alt alta, `&` kendi
 * satırında Caslon Text italikle — Caslon'un italik `&`'ı dizginin süsüdür.
 *
 * Boy kabın genişliğine (`cqi`) göre akar ve en uzun ada göre küçülür, ama
 * hiçbir zaman 32 px'in altına inmez (Display'in kıl çizgileri). Ad kesilmez,
 * `…` ile kısaltılmaz; satır sonu dengelenir. Harf büyüklüğüne dokunulmaz.
 */
interface KitapAdlarProps {
  /** `kisiler(names)` çıktısı. */
  adlar: string[];
  /** Kısa adlarda varılacak en büyük boy (px). */
  enCok?: number;
  /** Kap genişliğinin yüzdesi olarak akış (`cqi`). */
  akis?: number;
  /** Ad yoksa yazılacak metin. */
  bos?: string;
  as?: 'h1' | 'h2' | 'p';
  className?: string;
  /** `&` işaretinin rengi (ör. kurdele). */
  baglacClassName?: string;
}

/** En uzun ada göre boy çarpanı. */
function olcek(adlar: readonly string[]): number {
  const uzun = Math.max(0, ...adlar.map((ad) => ad.length));
  if (uzun <= 12) return 1;
  if (uzun <= 18) return 0.86;
  if (uzun <= 26) return 0.74;
  return 0.64;
}

/**
 * Adların yazı boyu (CSS değeri). Adlarla aynı ölçüde çizilmesi gereken bir
 * süs (ör. adların arasındaki kurdele) `em` birimini buna bağlar.
 */
export function adlarBoyu(adlar: readonly string[], enCok = 64, akis = 12.5): string {
  const o = olcek(adlar.length ? adlar : ['Davetlisiniz']);
  return `max(32px, min(${(akis * o).toFixed(2)}cqi, ${Math.round(enCok * o)}px))`;
}

export function KitapAdlar({
  adlar,
  enCok = 64,
  akis = 12.5,
  bos = 'Davetlisiniz',
  as: Etiket = 'h1',
  className,
  baglacClassName
}: KitapAdlarProps) {
  const parcalar = adlar.length ? adlar : [bos];
  return (
    <Etiket
      className={cn('leading-[1.08] [text-wrap:balance] [overflow-wrap:break-word]', className)}
      style={{ fontFamily: 'var(--kt-baslik-font)', fontSize: adlarBoyu(parcalar, enCok, akis) }}
    >
      {parcalar.map((ad, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <>
              {' '}
              <span
                className={cn('block italic my-[0.12em] leading-none', baglacClassName)}
                style={{ fontFamily: 'var(--kt-metin-font)', fontSize: '0.7em' }}
              >
                &amp;
              </span>{' '}
            </>
          )}
          <span className="block">{ad}</span>
        </React.Fragment>
      ))}
    </Etiket>
  );
}
