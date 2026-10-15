import React, { useId } from 'react';
import { cn } from '../../../../utils/cn';
import { MUREKKEP_MASKESI } from './doku';

/**
 * İki baskı tekniği: mürekkepsiz kabartma ve mürekkep damgası.
 *
 * İkisi de SÜSTÜR (`aria-hidden`): taşıdıkları ad ya da tarih sayfada gerçek
 * metin olarak da bulunmalıdır. Kabartmanın kâğıtla kontrastı bilerek
 * düşüktür; bilgi taşıyamaz.
 */

/**
 * Kör kabartma (blind emboss): harf kâğıdın kendi rengindedir, yalnızca
 * zıt yönlü ışık ve gölgeyle okunur.
 */
export function Kabartma({ metin, boyut = 64, className }: { metin: string; boyut?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block leading-none select-none', className)}
      style={{
        fontFamily: 'var(--kg-baslik-font)',
        fontWeight: 600,
        fontSize: boyut,
        color: 'var(--kg-kart)',
        textShadow: '-1px -1px 0 var(--kg-kabartma-isik), 1px 1px 1px var(--kg-kabartma-golge)'
      }}
    >
      {metin}
    </span>
  );
}

interface MurekkepDamgaProps {
  /** Halkanın üst yayı (ör. "NİŞAN TÖRENİ"). Türkçe büyük harfe çevrilir. */
  ust: string;
  /** Halkanın alt yayı (ör. tarih). */
  alt?: string;
  /** Ortadaki kısa metin ya da baş harfler. */
  orta?: string;
  /** Mürekkep rengi; verilmezse setin vurgu mürekkebi. */
  renk?: string;
  boyut?: number;
  /** Damganın kâğıda vuruş açısı (derece). */
  aci?: number;
  className?: string;
}

/**
 * Yuvarlak mürekkep damgası. Boya eşit dağılmaz: önceden üretilmiş alfa
 * maskesi (`murekkep.webp`) damganın her yerinde başka bir doygunluk bırakır.
 * Açık kâğıtta `multiply` ile kâğıda işler, koyu kartonda `screen` ile üstünde durur.
 */
export function MurekkepDamga({ ust, alt, orta, renk = 'var(--kg-vurgu)', boyut = 104, aci = -8, className }: MurekkepDamgaProps) {
  const uid = useId().replace(/:/g, '');
  const buyuk = (s: string) => s.toLocaleUpperCase('tr-TR');

  return (
    <div
      aria-hidden="true"
      className={cn('relative shrink-0 select-none', className)}
      style={{
        width: boyut,
        height: boyut,
        color: renk,
        transform: `rotate(${aci}deg)`,
        mixBlendMode: 'var(--kg-karisim)' as React.CSSProperties['mixBlendMode'],
        maskImage: `url("${MUREKKEP_MASKESI}")`,
        WebkitMaskImage: `url("${MUREKKEP_MASKESI}")`,
        maskSize: '128px',
        WebkitMaskSize: '128px'
      }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
        <defs>
          <path id={`${uid}-ust`} d="M 18 60 A 42 42 0 0 1 102 60" />
          <path id={`${uid}-alt`} d="M 16 60 A 44 44 0 0 0 104 60" />
        </defs>
        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="60" cy="60" r="51.5" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="60" cy="60" r="29" fill="none" stroke="currentColor" strokeWidth="1" />
        <g fill="currentColor" style={{ fontFamily: 'var(--kg-govde-font)', fontWeight: 600, letterSpacing: '0.16em' }} fontSize="10.5">
          <text textAnchor="middle">
            <textPath href={`#${uid}-ust`} startOffset="50%">{buyuk(ust)}</textPath>
          </text>
          {alt && (
            <text textAnchor="middle" dominantBaseline="hanging">
              <textPath href={`#${uid}-alt`} startOffset="50%">{buyuk(alt)}</textPath>
            </text>
          )}
        </g>
        {orta && (
          <text
            x="60"
            y="60"
            textAnchor="middle"
            dominantBaseline="central"
            fill="currentColor"
            fontSize={orta.length > 3 ? 13 : 24}
            style={{ fontFamily: 'var(--kg-baslik-font)', fontWeight: 600 }}
          >
            {orta}
          </text>
        )}
      </svg>
    </div>
  );
}
