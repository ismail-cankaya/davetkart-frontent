import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { splitNames } from '../../../../utils/names';
import { ease } from '../../../../utils/motion';

/**
 * Ebru — su üstünde boyanan kağıt.
 *
 * Ebrucu teknedeki kitreli suya önce "battal"ı serper: yüzeyi baştan başa
 * kaplayan, birbirini iterek çokgenleşen küçük damlalar. Sonra "taş"ları
 * koyar: aynı noktaya art arda damlatılıp halka halka açılan büyük
 * damlalar. Burada da sıra aynıdır ve iki katman ayrıdır.
 *
 * 🔴 Performans kararı: desen bir SVG FİLTRESİYLE (feTurbulence +
 * feDisplacementMap) bükülür ve bu filtre pahalıdır. Canlı DOM'da dursaydı
 * damlaların açılma animasyonu her karede filtreyi yeniden hesaplatırdı —
 * telefonda tam ekran bir türbülans, kare başına onlarca milisaniye. Bunun
 * yerine her katman bir data-URI GÖRSELİNE çevrilir: tarayıcı onu bir kez
 * rasterleştirip bitmap olarak saklar, animasyon yalnızca o bitmap'in
 * transform/opacity'sini değiştirir (compositor işi).
 *
 * Desen deterministiktir ve davetiyeye özgüdür: tohum isimlerin BAŞ HARFLERİ
 * ve etkinlik gününden türetilir. Tam isim kullanılsaydı kullanıcı editörde
 * her harf yazdığında ebru baştan değişirdi; baş harf ve gün ise nadiren
 * değişir, yine de iki davetiyenin aynı ebruyu taşıması pek olası değildir.
 */

/** Tohumlu, deterministik rastgele sayı üreteci (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(input: string): number {
  return Math.abs(input.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 17)) || 1;
}

/** Davetiyenin ebru tohumu: baş harfler + etkinlik günü (saat hariç). */
export function ebruSeed(names: string, date: string): number {
  const initials = splitNames(names)
    .map((part) => part.trim()[0] ?? '')
    .join('')
    .toLocaleUpperCase('tr-TR');
  return hash(`${initials}|${date.slice(0, 10)}`);
}

const svgUri = (svg: string) => `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;

/**
 * Battal zemin: teknenin tamamını kaplayan küçük damlalar, en sonda da
 * zemin renginde "delik" damlaları. İki aşamalı bükme: önce iri, organik
 * bir kırılma; sonra yatayda uzamış bir gürültüyle tarağın (gelgit) izi.
 */
function battalSvg(seed: number, ground: string, inks: string[]): string {
  const next = rng(seed);
  const W = 400;
  const H = 800;
  const drops: string[] = [];

  // Yüzeyi baştan başa örtecek kadar sık: gerçek battalda zemin ancak
  // damlaların arasındaki ince damarlarda görünür.
  for (let i = 0; i < 300; i++) {
    const r = 12 + next() ** 1.6 * 30;
    const ink = inks[Math.floor(next() * inks.length)];
    drops.push(
      `<circle cx="${(next() * W).toFixed(1)}" cy="${(next() * H).toFixed(1)}" r="${r.toFixed(1)}" fill="${ink}" stroke="rgba(0,0,0,0.12)" stroke-width="1.2"/>`
    );
  }
  // Zemin renginde son serpinti: battalın içinde açılan açık gözler.
  for (let i = 0; i < 60; i++) {
    const r = 2.5 + next() * 6;
    drops.push(
      `<circle cx="${(next() * W).toFixed(1)}" cy="${(next() * H).toFixed(1)}" r="${r.toFixed(1)}" fill="${ground}" fill-opacity="0.92"/>`
    );
  }

  // İki aşamalı bükme, ikisi de yumuşak gürültüyle: önce iri organik
  // kırılma, sonra yatayda uzamış bir dalga (tarağın/gelgitin izi). Keskin
  // `turbulence` türü burada kullanılmaz; düz yatay çizgiler bırakıyor.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs><filter id="f" x="-10%" y="-10%" width="120%" height="120%">
<feTurbulence type="fractalNoise" baseFrequency="0.011 0.018" numOctaves="2" seed="${seed % 997}" result="a"/>
<feDisplacementMap in="SourceGraphic" in2="a" scale="46" xChannelSelector="R" yChannelSelector="G" result="b"/>
<feTurbulence type="fractalNoise" baseFrequency="0.004 0.022" numOctaves="1" seed="${(seed + 7) % 997}" result="c"/>
<feDisplacementMap in="b" in2="c" scale="30" xChannelSelector="G" yChannelSelector="R"/>
</filter></defs>
<rect width="${W}" height="${H}" fill="${ground}"/>
<g filter="url(#f)">${drops.join('')}</g>
</svg>`;
}

/** Taş: aynı noktaya art arda damlatılmış, halka halka açılan büyük damla. */
function tasSvg(seed: number, ground: string, inks: string[]): string {
  const next = rng(seed);
  const rings = 3 + Math.floor(next() * 3);
  // Halkalar mürekkep, zemin, mürekkep… diye dizilir; aradaki açık halka
  // ebrucunun "gelin" dediği, damlayı damlalardan ayıran nefestir. Halka
  // kalınlıkları eşit değil: her damla farklı miktarda boya taşır.
  let r = 96;
  const circles: string[] = [];
  for (let i = 0; i < rings * 2 && r > 8; i++) {
    const fill = i % 2 === 1 ? ground : inks[(Math.floor(next() * inks.length) + i) % inks.length];
    circles.push(`<circle cx="100" cy="100" r="${r.toFixed(1)}" fill="${fill}" stroke="rgba(0,0,0,0.12)" stroke-width="1"/>`);
    r -= i % 2 === 1 ? 4 + next() * 6 : 10 + next() * 16;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
<defs><filter id="t" x="-15%" y="-15%" width="130%" height="130%">
<feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="2" seed="${seed % 997}" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="G" result="d"/>
<feGaussianBlur in="d" stdDeviation="0.35"/>
</filter></defs>
<g filter="url(#t)">${circles.join('')}</g>
</svg>`;
}

interface Stone {
  /** Sahne genişliğine göre yüzde. */
  x: number;
  y: number;
  size: number;
  seed: number;
}

/**
 * Taşların yeri: panelin kapattığı ortayı değil, görünen kenarları (üst
 * bant, alt bant, bir yan) doldurur. Merkezler arası mesafe aranır; ebruda
 * damlalar üst üste binmez, birbirini iter.
 */
function placeStones(seed: number): Stone[] {
  const next = rng(seed ^ 0x9e3779b9);
  const zones = [
    { x: [6, 50], y: [-4, 14] },
    { x: [52, 96], y: [-2, 16] },
    { x: [4, 46], y: [84, 104] },
    { x: [54, 98], y: [82, 102] },
    { x: next() < 0.5 ? [-8, 4] : [96, 108], y: [34, 62] }
  ];

  return zones.map((zone, i) => ({
    x: zone.x[0] + next() * (zone.x[1] - zone.x[0]),
    y: zone.y[0] + next() * (zone.y[1] - zone.y[0]),
    size: 44 + next() * 26,
    seed: seed + i * 131
  }));
}

export interface EbruSheetProps {
  /** Teknedeki suyun (kağıdın) rengi. */
  ground: string;
  /** Battal mürekkepleri. */
  inks: string[];
  /** Taş mürekkepleri; verilmezse battalınkiler kullanılır. */
  stoneInks?: string[];
  names: string;
  date: string;
  /** Zarf açılmaya başladığında `true`: damlalar ancak o an açılır. */
  revealed: boolean;
  /** Ebrunun bittiği yerde karıştığı gövde rengi. */
  fadeTo?: string;
}

/** Hero arka planı: battal zemin + açılan taşlar + çok yavaş su salınımı. */
export function EbruSheet({ ground, inks, stoneInks, names, date, revealed, fadeTo }: EbruSheetProps) {
  const reduced = useReducedMotion();
  const seed = ebruSeed(names, date);
  const inkKey = inks.join('|');
  const stoneKey = (stoneInks ?? inks).join('|');

  const battal = useMemo(() => svgUri(battalSvg(seed, ground, inkKey.split('|'))), [seed, ground, inkKey]);
  const stones = useMemo(
    () => placeStones(seed).map((s) => ({ ...s, uri: svgUri(tasSvg(s.seed, ground, stoneKey.split('|'))) })),
    [seed, ground, stoneKey]
  );

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden" style={{ background: ground }}>
      {/* Su salınımı: bütün yüzey birkaç piksel, çok yavaş kayar. */}
      <motion.div
        className="absolute -inset-[3%]"
        animate={reduced || !revealed ? undefined : { x: [0, -7, 0], y: [0, 5, 0] }}
        transition={{ duration: 26, ease: 'easeInOut', repeat: Infinity }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: battal }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={revealed ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.6, ease: ease.out }}
        />

        {stones.map((stone, i) => (
          <motion.div
            key={i}
            className="absolute bg-contain bg-no-repeat"
            style={{
              left: `${stone.x}%`,
              top: `${stone.y}%`,
              width: `${stone.size}%`,
              aspectRatio: '1 / 1',
              x: '-50%',
              y: '-50%',
              backgroundImage: stone.uri
            }}
            // Damla suya değdiği noktadan açılır: küçük ve opak başlar,
            // yavaşlayarak yayılır.
            initial={{ opacity: 0, scale: 0.12 }}
            animate={revealed ? { opacity: 1, scale: 1 } : undefined}
            transition={{
              opacity: { duration: 0.25, delay: 0.35 + i * 0.28 },
              scale: { duration: 2.2, ease: ease.out, delay: 0.35 + i * 0.28 }
            }}
          />
        ))}
      </motion.div>

      {fadeTo && (
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${fadeTo})` }}
        />
      )}
    </div>
  );
}
