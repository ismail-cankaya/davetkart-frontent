import React from 'react';
import { cn } from '../../../../utils/cn';

/**
 * Katmanlı manzara siluetleri.
 *
 * Videosuz şablonların "sahne" ihtiyacını karşılar. Degrade ve parçacık
 * atmosfer üretir ama mekân üretmez; bir davetiyenin "orman", "zirve" ya da
 * "saray" olduğunu anlatan şey ufuk çizgisinin biçimidir.
 *
 * Hepsi tek bir kurala uyar: siluetler ALTTAN yukarı doğru dizilir, arkadaki
 * katman daha açık ve daha alçaktır. HeroStage'in parallax'ı katmanları
 * farklı hızda kaydırınca derinlik kendiliğinden oluşur.
 *
 * Şekiller deterministik üretilir (sabit tohum): aynı şablon her açılışta
 * aynı manzarayı gösterir, kullanıcı "değişen" bir arka plan görmez.
 */

/** Küçük, tekrarlanabilir PRNG — silueti her render'da aynı üretmek için. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x9e3779b9) >>> 0;
    let t = Math.imul(a ^ (a >>> 16), 0x21f0aaad);
    t = Math.imul(t ^ (t >>> 15), 0x735a2d97);
    return ((t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

interface SceneryProps {
  /** Silueti dolduran renk (rgb üçlüsü, örn. '18,26,20'). */
  color?: string;
  /** Katman opaklığı. */
  opacity?: number;
  /** Siluetin kapladığı dikey oran (0..1, alttan yukarı). */
  height?: number;
  className?: string;
  seed?: number;
}

/** Ortak SVG sarmalayıcı: alta yaslanır, kadrajı yatayda doldurur. */
function Layer({
  children,
  opacity,
  className,
  height
}: {
  children: React.ReactNode;
  opacity: number;
  className?: string;
  height: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={cn('absolute inset-x-0 bottom-0 w-full pointer-events-none', className)}
      style={{ height: `${height * 100}%`, opacity }}
    >
      {children}
    </svg>
  );
}

/**
 * Sıradağ / tepe katmanları — zirve, bohem çadır, kır manzarası.
 *
 * `layers` arttıkça arkaya doğru daha açık ve daha alçak sırtlar eklenir;
 * atmosferik perspektifin (uzak = soluk) en ucuz taklidi budur.
 */
export function Ridges({
  color = '20,28,40',
  opacity = 1,
  height = 0.45,
  layers = 3,
  roughness = 1,
  className,
  seed = 7
}: SceneryProps & { layers?: number; roughness?: number }) {
  const random = rng(seed);

  const bands = Array.from({ length: layers }, (_, i) => {
    // Arka katman: daha alçak taban, daha sönük, daha yumuşak tepeler.
    const depth = i / Math.max(1, layers - 1);
    const baseY = 16 + depth * 12;
    const amp = (11 - depth * 6) * roughness;
    const steps = 7 + Math.round(depth * 4);

    let d = `M0 40 L0 ${baseY.toFixed(1)}`;
    for (let s = 1; s <= steps; s++) {
      const x = (100 / steps) * s;
      const peak = baseY - random() * amp;
      const midX = x - 100 / steps / 2;
      const midY = baseY - random() * amp * 0.55;
      d += ` Q${midX.toFixed(1)} ${midY.toFixed(1)} ${x.toFixed(1)} ${peak.toFixed(1)}`;
    }
    d += ' L100 40 Z';

    return { d, alpha: 0.3 + (1 - depth) * 0.7 };
  }).reverse();

  return (
    <Layer opacity={opacity} className={className} height={height}>
      {bands.map((band, i) => (
        <path key={i} d={band.d} fill={`rgba(${color},${band.alpha})`} />
      ))}
    </Layer>
  );
}

/**
 * Ağaç hattı — rustik orman. Farklı yükseklikte konik siluetler; aradaki
 * boşluklardan ışık huzmeleri geçer.
 */
export function TreeLine({
  color = '10,18,12',
  opacity = 1,
  height = 0.55,
  density = 22,
  className,
  seed = 11
}: SceneryProps & { density?: number }) {
  const random = rng(seed);

  const trees = Array.from({ length: density }, (_, i) => {
    const x = (100 / density) * i + random() * (100 / density) * 0.6;
    const h = 14 + random() * 20;
    const w = 2.2 + random() * 2.6;
    return { x, h, w, alpha: 0.55 + random() * 0.45 };
  });

  return (
    <Layer opacity={opacity} className={className} height={height}>
      {/* Zemin bandı: ağaçların "durduğu" karanlık taban. */}
      <rect x="0" y="34" width="100" height="6" fill={`rgba(${color},1)`} />
      {trees.map((t, i) => (
        <path
          key={i}
          // Üç kademeli köknar: gövde + iki dal katmanı.
          d={`M${t.x} ${40 - t.h}
              L${t.x + t.w} ${40 - t.h * 0.55}
              L${t.x + t.w * 0.6} ${40 - t.h * 0.55}
              L${t.x + t.w * 1.35} ${40 - t.h * 0.18}
              L${t.x - t.w * 1.35} ${40 - t.h * 0.18}
              L${t.x - t.w * 0.6} ${40 - t.h * 0.55}
              L${t.x - t.w} ${40 - t.h * 0.55} Z`}
          fill={`rgba(${color},${t.alpha})`}
        />
      ))}
    </Layer>
  );
}

/**
 * Kemerli revak — Osmanlı sarayı, tarihi kampüs koridoru.
 *
 * Silueti "içeriden dışarı bakış" olarak kurar: kemer boşlukları saydam
 * kalır, gökyüzü oradan görünür. Bu yüzden tek bir path'e delik açmak yerine
 * maske kullanılır.
 */
export function Arches({
  color = '12,8,12',
  opacity = 1,
  height = 1,
  count = 5,
  pointed = true,
  className,
  seed = 13
}: SceneryProps & { count?: number; pointed?: boolean }) {
  const maskId = `arch-mask-${seed}-${count}-${pointed ? 'p' : 'r'}`;
  const span = 100 / count;
  const pierWidth = span * 0.16;
  const archTop = 9;
  const springLine = 20;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
      style={{ opacity, height: `${height * 100}%` }}
    >
      <defs>
        <mask id={maskId}>
          {/* Beyaz = görünür duvar, siyah = kemer boşluğu. */}
          <rect x="0" y="0" width="100" height="40" fill="white" />
          {Array.from({ length: count }, (_, i) => {
            const cx = span * i + span / 2;
            const half = span / 2 - pierWidth / 2;
            const d = pointed
              ? `M${cx - half} 40 L${cx - half} ${springLine}
                 Q${cx - half} ${archTop} ${cx} ${archTop - 4}
                 Q${cx + half} ${archTop} ${cx + half} ${springLine}
                 L${cx + half} 40 Z`
              : `M${cx - half} 40 L${cx - half} ${springLine}
                 A${half} ${half} 0 0 1 ${cx + half} ${springLine}
                 L${cx + half} 40 Z`;
            return <path key={i} d={d} fill="black" />;
          })}
        </mask>
      </defs>
      <rect x="0" y="0" width="100" height="40" fill={`rgba(${color},1)`} mask={`url(#${maskId})`} />
    </svg>
  );
}

/**
 * Kule ve kubbe silueti — masal şatosu, lunapark.
 *
 * `roofs` 'cone' sivri külah (şato), 'dome' soğan kubbe (saray) üretir.
 */
export function Spires({
  color = '8,10,26',
  opacity = 1,
  height = 0.5,
  count = 7,
  roofs = 'cone',
  className,
  seed = 17
}: SceneryProps & { count?: number; roofs?: 'cone' | 'dome' }) {
  const random = rng(seed);

  const towers = Array.from({ length: count }, (_, i) => {
    const x = (100 / count) * i + (100 / count) * 0.5;
    // Ortadaki kuleler daha yüksek: klasik şato siluetinin piramidal dengesi.
    const centerBias = 1 - Math.abs(i - (count - 1) / 2) / ((count - 1) / 2 || 1);
    const h = 12 + centerBias * 14 + random() * 5;
    const w = 3.4 + random() * 2.4;
    return { x, h, w };
  });

  return (
    <Layer opacity={opacity} className={className} height={height}>
      <rect x="0" y="30" width="100" height="10" fill={`rgba(${color},1)`} />
      {towers.map((t, i) => {
        const bodyTop = 40 - t.h;
        const roof =
          roofs === 'cone'
            ? `M${t.x - t.w / 2} ${bodyTop} L${t.x} ${bodyTop - t.w * 1.7} L${t.x + t.w / 2} ${bodyTop} Z`
            : `M${t.x - t.w / 2} ${bodyTop}
               Q${t.x - t.w * 0.75} ${bodyTop - t.w} ${t.x} ${bodyTop - t.w * 1.6}
               Q${t.x + t.w * 0.75} ${bodyTop - t.w} ${t.x + t.w / 2} ${bodyTop} Z`;
        return (
          <g key={i} fill={`rgba(${color},1)`}>
            <rect x={t.x - t.w / 2} y={bodyTop} width={t.w} height={t.h} />
            <path d={roof} />
          </g>
        );
      })}
    </Layer>
  );
}

/**
 * Bulut bankı — melek, gökyüzü, pamuk şekeri bulutlar.
 *
 * Üst üste binen elipslerden tek bir yumuşak kütle kurar; blur ile kenarlar
 * eritilir. Alt kenar düz kalır ki bulut "üstünde durulan" bir zemin olsun.
 */
export function CloudBank({
  color = '255,255,255',
  opacity = 0.9,
  height = 0.42,
  puffs = 14,
  className,
  seed = 23
}: SceneryProps & { puffs?: number }) {
  const random = rng(seed);

  const blobs = Array.from({ length: puffs }, (_, i) => ({
    cx: (100 / puffs) * i + random() * 8 - 4,
    cy: 30 + random() * 8,
    rx: 9 + random() * 12,
    ry: 5 + random() * 6,
    alpha: 0.45 + random() * 0.55
  }));

  return (
    <Layer opacity={opacity} className={cn('blur-[6px]', className)} height={height}>
      {blobs.map((b, i) => (
        <ellipse key={i} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={`rgba(${color},${b.alpha})`} />
      ))}
      <rect x="0" y="34" width="100" height="6" fill={`rgba(${color},0.95)`} />
    </Layer>
  );
}

/**
 * Su yüzeyi — alyans havuzu, mum ışığı, sahil.
 *
 * Yansımayı yatay ışık bantlarıyla kurar; bantlar aşağı indikçe genişler ve
 * seyrekleşir, bu perspektif hissini verir. Dalgalanma CSS blur + hafif
 * ölçekle taklit edilir, animasyon gerektirmez.
 */
export function WaterPlane({
  color = '255,225,170',
  opacity = 0.55,
  height = 0.42,
  bands = 9,
  className,
  seed = 29
}: SceneryProps & { bands?: number }) {
  const random = rng(seed);

  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden', className)}
      style={{ height: `${height * 100}%`, opacity }}
    >
      {Array.from({ length: bands }, (_, i) => {
        const t = i / (bands - 1);
        // Aşağı indikçe: daha kalın, daha geniş, daha sönük.
        const top = t * 100;
        const h = 0.6 + t * 2.4;
        const w = 12 + t * 46 + random() * 14;
        const alpha = 0.75 - t * 0.5;
        const offset = (random() - 0.5) * 10;
        return (
          <span
            key={i}
            className="absolute left-1/2 rounded-full blur-[2px]"
            style={{
              top: `${top}%`,
              height: `${h}%`,
              width: `${w}%`,
              transform: `translateX(calc(-50% + ${offset}%))`,
              background: `linear-gradient(to right, rgba(${color},0), rgba(${color},${alpha}), rgba(${color},0))`
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * Güneş / ay diski — ufukta duran ışık kaynağı.
 *
 * Disk + iki kademeli hale. Halenin ikinci katmanı çok geniş ve çok sönük
 * olduğu için gökyüzünü boyar; tek katman kullanılsaydı disk gökyüzüne
 * yapıştırılmış bir daire gibi dururdu.
 */
export function SunDisc({
  color = '255,200,120',
  size = 16,
  x = 50,
  y = 58,
  opacity = 0.9,
  className
}: {
  color?: string;
  /** Diskin çapı (kadraj genişliğinin yüzdesi). */
  size?: number;
  x?: number;
  y?: number;
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute pointer-events-none', className)}
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', opacity }}
    >
      {/* Geniş atmosferik hale */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: `${size * 9}vw`,
          aspectRatio: '1 / 1',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundImage: `radial-gradient(circle, rgba(${color},0.4), rgba(${color},0) 70%)`
        }}
      />
      {/* Yakın hale */}
      <div
        className="absolute rounded-full blur-xl"
        style={{
          width: `${size * 2.6}vw`,
          aspectRatio: '1 / 1',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundImage: `radial-gradient(circle, rgba(${color},0.85), rgba(${color},0) 68%)`
        }}
      />
      {/* Disk */}
      <div
        className="relative rounded-full"
        style={{
          width: `${size}vw`,
          aspectRatio: '1 / 1',
          background: `radial-gradient(circle at 50% 45%, rgba(255,255,255,0.95), rgba(${color},1) 55%, rgba(${color},0.7) 100%)`,
          boxShadow: `0 0 ${size * 2}px rgba(${color},0.6)`
        }}
      />
    </div>
  );
}
