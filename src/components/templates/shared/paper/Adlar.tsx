import React from 'react';
import { cn } from '../../../../utils/cn';

/**
 * Adlar el yazısıyla; `&` işareti ise serif italikle.
 *
 * Kaligrafi fontlarının `&` glifi çoğu zaman harfe benzer (Pinyon'da "ɤ"
 * gibi okunur). Davetiye dizgisinde bilinen çözüm, bağlacı yazının
 * içinden alıp serif italikle dizmektir.
 *
 * Boy adların uzunluğuna göre küçülür: 120 karakterlik ad 360 px'te üç
 * satırı geçmesin diye. Satır sonu dengelenir (`text-wrap: balance`); ad
 * hiçbir zaman kesilmez, `…` ile kısaltılmaz.
 */
interface AdlarProps {
  adlar: string;
  /** Kısa adlardaki boy (px); uzun adlarda oranla küçülür. */
  boy?: number;
  as?: 'h1' | 'h2' | 'p';
  className?: string;
}

/** Ad uzunluğuna göre boy çarpanı. */
function olcek(uzunluk: number): number {
  if (uzunluk <= 22) return 1;
  if (uzunluk <= 34) return 0.86;
  if (uzunluk <= 52) return 0.74;
  return 0.62;
}

export function Adlar({ adlar, boy = 44, as: Etiket = 'h1', className }: AdlarProps) {
  const parcalar = adlar.split(/\s*&\s*/);
  return (
    <Etiket
      className={cn('leading-[1.14] [text-wrap:balance] [overflow-wrap:anywhere]', className)}
      style={{ fontFamily: 'var(--kg-el-font)', fontSize: Math.round(boy * olcek(adlar.length)) }}
    >
      {parcalar.map((parca, i) => (
        <React.Fragment key={i}>
          {/* Satır `&`'tan ÖNCE kırılır; bağlaç ikinci adla birlikte kalır. */}
          {i > 0 && (
            <>
              {' '}
              <span className="italic font-normal" style={{ fontFamily: 'var(--kg-baslik-font)', fontSize: '0.78em' }}>
                &amp;
              </span>
              {' '}
            </>
          )}
          {parca}
        </React.Fragment>
      ))}
    </Etiket>
  );
}
