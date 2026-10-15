import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { kaymaGirisi } from './hareket';

/**
 * Ana kart: tırtıklı (deckle) kenarlı, dokulu, gölgeli bir kâğıt yaprağı.
 *
 * Kenar, `clip-path` çokgenidir ve tohumdan bir kez hesaplanır: aynı kart her
 * açılışta aynı yırtığı taşır, çalışma anında filtre yoktur. İki katman var:
 * dışta yarı saydam bir lif saçağı, içte kâğıdın gövdesi — el yapımı kâğıdın
 * kenarı keskin bir çizgi değil, incelerek biten bir saçaktır.
 *
 * Gölge `drop-shadow` ile verilir ve yalnızca kâğıdı taşıyan katmanda durur:
 * gölge tırtıklı kenarı izler, metin filtreye girmez.
 */

type Nokta = { yuzde: number; ic: number };

function tohumluRastgele(tohum: number) {
  let a = tohum >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bir kenar boyunca içe doğru girinti profili (px). */
function kenarProfili(r: () => number, adim: number, genlik: number): number[] {
  const faz1 = r() * 6.28;
  const faz2 = r() * 6.28;
  return Array.from({ length: adim }, (_, i) => {
    const dalga = 0.5 + 0.3 * Math.sin(i * 0.37 + faz1) + 0.2 * Math.sin(i * 1.9 + faz2);
    return Math.max(0, genlik * (dalga * (0.55 + 0.45 * r()) + (r() - 0.5) * 0.5));
  });
}

const cokgenler = new Map<string, { sacak: string; govde: string }>();

/**
 * Tohuma göre iki çokgen (saçak ve gövde). Önbellekte tutulur: hesap modül
 * ömründe bir kez yapılır, her çizimde aynı dizge kullanılır.
 */
export function tirtikliKenar(tohum = 7, genlik = 2.6, adim = 64): { sacak: string; govde: string } {
  const anahtar = `${tohum}:${genlik}:${adim}`;
  const hazir = cokgenler.get(anahtar);
  if (hazir) return hazir;

  const r = tohumluRastgele(tohum);
  const kenarlar = [0, 1, 2, 3].map(() => {
    const dis = kenarProfili(r, adim, genlik);
    return dis.map<[Nokta, Nokta]>((d, i) => {
      const yuzde = (i / (adim - 1)) * 100;
      return [{ yuzde, ic: d }, { yuzde, ic: d + 0.9 + r() * 1.3 }];
    });
  });

  const yaz = (secim: 0 | 1) => {
    const pts: string[] = [];
    const px = (n: number) => n.toFixed(2);
    kenarlar[0].forEach((p) => pts.push(`${px(p[secim].yuzde)}% ${px(p[secim].ic)}px`));
    kenarlar[1].forEach((p) => pts.push(`calc(100% - ${px(p[secim].ic)}px) ${px(p[secim].yuzde)}%`));
    kenarlar[2].forEach((p) => pts.push(`${px(100 - p[secim].yuzde)}% calc(100% - ${px(p[secim].ic)}px)`));
    kenarlar[3].forEach((p) => pts.push(`${px(p[secim].ic)}px ${px(100 - p[secim].yuzde)}%`));
    return `polygon(${pts.join(',')})`;
  };

  const sonuc = { sacak: yaz(0), govde: yaz(1) };
  cokgenler.set(anahtar, sonuc);
  return sonuc;
}

/** Katlanma izi: ince bir gölge, onun hemen altında bir ışık çizgisi. */
const KAT_IZI: Record<'yatay' | 'dikey', string> = {
  yatay:
    'linear-gradient(180deg, transparent 49%, var(--kg-kat-golge) 49.7%, var(--kg-kat-isik) 50.1%, transparent 51.2%), linear-gradient(180deg, transparent 50%, var(--kg-kat-golge) 50.2%, transparent 64%)',
  dikey:
    'linear-gradient(90deg, transparent 49%, var(--kg-kat-golge) 49.7%, var(--kg-kat-isik) 50.1%, transparent 51.2%), linear-gradient(90deg, transparent 50%, var(--kg-kat-golge) 50.2%, transparent 64%)'
};

interface KagitLevhaProps {
  children?: React.ReactNode;
  className?: string;
  /** İçerik kabının sınıfları (dolgu, hizalama). */
  icerikClassName?: string;
  kenar?: 'tirtikli' | 'duz';
  /** Yırtığın biçimi; aynı sayfadaki iki kart farklı tohum almalı. */
  tohum?: number;
  kat?: 'yok' | 'yatay' | 'dikey';
  /** Kâğıt rengi; verilmezse setin kart rengi. */
  zemin?: string;
  doku?: boolean;
  golge?: boolean;
  /** Masaya kayarak giriş; sayı verilirse gecikmedir (s). */
  giris?: boolean | number;
}

export function KagitLevha({
  children,
  className,
  icerikClassName,
  kenar = 'tirtikli',
  tohum = 7,
  kat = 'yok',
  zemin = 'var(--kg-kart)',
  doku = true,
  golge = true,
  giris = false
}: KagitLevhaProps) {
  const cokgen = kenar === 'tirtikli' ? tirtikliKenar(tohum) : null;
  const katmanlar = [kat !== 'yok' ? KAT_IZI[kat] : null, doku ? 'var(--kg-doku)' : null].filter(Boolean);
  const kagit: React.CSSProperties = {
    backgroundColor: zemin,
    backgroundImage: katmanlar.join(', ') || undefined,
    backgroundSize: kat !== 'yok' ? '100% 100%, 100% 100%, var(--kg-doku-boy)' : 'var(--kg-doku-boy)',
    backgroundBlendMode: kat !== 'yok' ? 'normal, normal, multiply' : 'multiply'
  };
  const hareket = giris === false ? {} : kaymaGirisi(typeof giris === 'number' ? giris : 0);

  return (
    <motion.div {...hareket} className={cn('relative', className)}>
      <div aria-hidden="true" className="absolute inset-0" style={golge ? { filter: 'var(--kg-levha-golge)' } : undefined}>
        {cokgen ? (
          <>
            <div className="absolute inset-0 opacity-50" style={{ ...kagit, clipPath: cokgen.sacak }} />
            <div className="absolute inset-0" style={{ ...kagit, clipPath: cokgen.govde }} />
          </>
        ) : (
          <div className="absolute inset-0 rounded-[2px]" style={kagit} />
        )}
      </div>
      <div className={cn('relative', icerikClassName)}>{children}</div>
    </motion.div>
  );
}
