import React from 'react';
import { cn } from '../../../../utils/cn';
import { LEKE_MASKESI } from './doku';
import { PIGMENTLER, type PigmentAdi } from './palet';

/**
 * Taşan suluboya lekesi. Biçim önceden üretilmiş tek bir alfa maskesidir
 * (kenarda toplanmış pigment, tanecik); rengi CSS'ten alır. Aynı maske
 * döndürülüp aynalanıp farklı boylarda kullanılarak çeşitlenir.
 *
 * İki leke üst üste geldiğinde `multiply` üçüncü bir ton üretir — boyanın
 * kâğıtta yaptığı gibi. Leke süstür; üstüne yazı gelecekse kontrast ölçülür.
 */
interface SuluboyaLekeProps {
  renk: PigmentAdi;
  /** px. Maske 200 px; iki katına kadar büyütmek kenarı yumuşatır, sorun değil. */
  boyut?: number;
  aci?: number;
  /** Yatay aynalama: aynı maskeden ikinci bir biçim. */
  ayna?: boolean;
  /** Basıklık (dikey/yatay oran). */
  oran?: number;
  saydamlik?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function SuluboyaLeke({ renk, boyut = 220, aci = 0, ayna = false, oran = 1, saydamlik = 0.85, className, style }: SuluboyaLekeProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none', className)}
      style={{
        width: boyut,
        height: boyut * oran,
        backgroundColor: PIGMENTLER[renk],
        opacity: saydamlik,
        mixBlendMode: 'multiply',
        transform: `rotate(${aci}deg)${ayna ? ' scaleX(-1)' : ''}`,
        maskImage: `url("${LEKE_MASKESI}")`,
        WebkitMaskImage: `url("${LEKE_MASKESI}")`,
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
        ...style
      }}
    />
  );
}
