import React from 'react';
import { cn } from '../../../../utils/cn';

/**
 * Doku ve süsleme ilkelleri — ışıltıya değil MALZEMEYE dayanan tasarım
 * dilleri için.
 *
 * Projedeki diğer efekt katmanları (mesh, hale, parçacık) ışık üretir; bu
 * dosyadakiler yüzey üretir: kağıt lifi, kabartma baskı, tram noktası,
 * altın kakma, perforasyon. Hepsi CSS/SVG — tek bir görsel varlık yok.
 */

/* ————— Kağıt ————— */

/**
 * Kağıt lifi dokusu. İki farklı frekansta fractal gürültü üst üste biner:
 * ince olan lif, kaba olan tabaka düzensizliği. Tek frekans kullanılsaydı
 * doku "gren" gibi okunur, kağıt gibi değil.
 */
export function PaperGrain({ opacity = 0.5, className }: { opacity?: number; className?: string }) {
  return (
    <div aria-hidden="true" className={cn('absolute inset-0 pointer-events-none', className)} style={{ opacity }}>
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{
          opacity: 0.55,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E\")"
        }}
      />
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{
          opacity: 0.3,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.06' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")"
        }}
      />
    </div>
  );
}

/**
 * Deckle (yırtık el yapımı kağıt) kenarı. Kartın dört kenarını düzensiz bir
 * maskeyle keser — köşeleri yuvarlatmak yerine kenarı BOZMAK gerekir, çünkü
 * el yapımı kağıdı tanımlayan şey düzensizliğin kendisi.
 */
export function DeckleEdge({
  color = '#ffffff',
  amplitude = 4,
  seed = 3,
  className
}: {
  color?: string;
  /** Kenar düzensizliğinin genliği (px). */
  amplitude?: number;
  seed?: number;
  className?: string;
}) {
  // Deterministik kenar: aynı kart her açılışta aynı yırtığı taşır.
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const steps = 26;
  const edge = (n: number) => Array.from({ length: n }, () => (next() - 0.5) * amplitude);

  const top = edge(steps);
  const right = edge(steps);
  const bottom = edge(steps);
  const left = edge(steps);

  const pts: string[] = [];
  top.forEach((d, i) => pts.push(`${(i / (steps - 1)) * 100}% ${d}px`));
  right.forEach((d, i) => pts.push(`calc(100% + ${d}px) ${(i / (steps - 1)) * 100}%`));
  bottom.forEach((d, i) => pts.push(`${100 - (i / (steps - 1)) * 100}% calc(100% + ${d}px)`));
  left.forEach((d, i) => pts.push(`${d}px ${100 - (i / (steps - 1)) * 100}%`));

  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{ background: color, clipPath: `polygon(${pts.join(',')})` }}
    />
  );
}

/**
 * Mum mührü. Dış kenar hafif düzensiz (erimiş mum), içeride kabartma
 * monogram için gölge/ışık çifti var — kabartma hissini tek bir gölge
 * değil, zıt yönde iki gölge üretir.
 */
export function WaxSeal({
  color = '#8e1b2e',
  size = 62,
  initials = '',
  className
}: {
  color?: string;
  size?: number;
  /** Mührün ortasındaki harf(ler). Boşsa yalnızca desen basılır. */
  initials?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="wax-body" cx="38%" cy="32%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.42)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        {/* Erimiş kenar: 12 köşeli, yarıçapı hafif dalgalı bir disk. */}
        <path
          d={Array.from({ length: 24 }, (_, i) => {
            const ang = (i / 24) * Math.PI * 2;
            const r = 44 + Math.sin(i * 2.7) * 3.2 + Math.cos(i * 1.3) * 2.1;
            const x = 50 + Math.cos(ang) * r;
            const y = 50 + Math.sin(ang) * r;
            return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
          }).join(' ') + ' Z'}
          fill={color}
        />
        <circle cx="50" cy="50" r="44" fill="url(#wax-body)" />
        {/* İç halka: mührün bastırdığı çukur. */}
        <circle cx="50" cy="50" r="33" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1.6" />
        <circle cx="50" cy="50" r="33" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.6" transform="translate(0,-1.4)" />
      </svg>

      {initials && (
        <span
          className="absolute inset-0 flex items-center justify-center font-serif font-bold select-none"
          style={{
            fontSize: size * 0.34,
            color: 'rgba(255,255,255,0.82)',
            // Zıt yönde iki gölge = kabartma. Tek gölge "düşen yazı" olurdu.
            textShadow: '0 1px 0 rgba(0,0,0,0.35), 0 -1px 0 rgba(255,255,255,0.25)'
          }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}

/* ————— Baskı ————— */

/**
 * Halftone (tram) dokusu — risograph/ofset baskının nokta ızgarası.
 * Açı verilebilir: iki rengi farklı açıyla basmak moiré'yi önler, gerçek
 * baskıda da böyle yapılır.
 */
export function Halftone({
  color = '0,0,0',
  size = 6,
  angle = 15,
  opacity = 0.18,
  className
}: {
  color?: string;
  /** Nokta ızgarasının adımı (px). */
  size?: number;
  angle?: number;
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}
      style={{ opacity }}
    >
      <div
        className="absolute -inset-1/4"
        style={{
          transform: `rotate(${angle}deg)`,
          backgroundImage: `radial-gradient(rgba(${color},1) ${size * 0.26}px, transparent ${size * 0.27}px)`,
          backgroundSize: `${size}px ${size}px`
        }}
      />
    </div>
  );
}

/* ————— Art Deco ————— */

/**
 * Güneş ışını yelpazesi — Art Deco'nun imza motifi. Işınlar merkezden
 * dışa açılır, kalınlıkları dönüşümlü değişir (kalın-ince-kalın), bu ritim
 * motifi "çizgi yığını" olmaktan çıkarıp desen yapar.
 */
export function Sunburst({
  color = '212,175,95',
  rays = 36,
  opacity = 0.3,
  x = 50,
  y = 50,
  className
}: {
  color?: string;
  rays?: number;
  opacity?: number;
  x?: number;
  y?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}
      style={{ opacity }}
    >
      <div
        className="absolute"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: '260%',
          aspectRatio: '1 / 1',
          transform: 'translate(-50%, -50%)',
          backgroundImage: `conic-gradient(from 0deg, ${Array.from({ length: rays }, (_, i) => {
            const wide = i % 2 === 0;
            const step = 360 / rays;
            const a0 = (i * step).toFixed(2);
            const a1 = (i * step + step * (wide ? 0.42 : 0.16)).toFixed(2);
            const a2 = ((i + 1) * step).toFixed(2);
            return `rgba(${color},${wide ? 0.9 : 0.45}) ${a0}deg ${a1}deg, rgba(${color},0) ${a1}deg ${a2}deg`;
          }).join(', ')})`,
          maskImage: 'radial-gradient(circle, black 8%, transparent 62%)',
          WebkitMaskImage: 'radial-gradient(circle, black 8%, transparent 62%)'
        }}
      />
    </div>
  );
}

/**
 * Kademeli Art Deco çerçevesi. İç içe geçmiş, köşeleri pahlanmış üç hat;
 * aradaki boşluklar eşit değil (3-1-2 oranı) çünkü Deco'nun ritmi
 * simetrik ama monoton değildir.
 */
export function DecoFrame({
  color = '212,175,95',
  opacity = 0.75,
  className
}: {
  color?: string;
  opacity?: number;
  className?: string;
}) {
  const rings = [
    { inset: 3, w: 1.6, a: 0.95, notch: 9 },
    { inset: 5.4, w: 0.7, a: 0.6, notch: 7 },
    { inset: 9, w: 0.5, a: 0.4, notch: 5 }
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
      style={{ opacity }}
    >
      {rings.map((r, i) => {
        const a = r.inset;
        const b = 100 - r.inset;
        const n = r.notch / 10;
        return (
          <path
            key={i}
            // Köşeleri pahlı (chamfered) dikdörtgen — Deco köşeyi yuvarlamaz, keser.
            d={`M${a + n} ${a} L${b - n} ${a} L${b} ${a + n}
                L${b} ${b - n} L${b - n} ${b} L${a + n} ${b}
                L${a} ${b - n} L${a} ${a + n} Z`}
            fill="none"
            stroke={`rgba(${color},${r.a})`}
            strokeWidth={r.w}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

/* ————— Bilet ————— */

/**
 * Perforasyon hattı — biletin koparılabilir koçan çizgisi.
 * Delikler kartın kenarından TAŞAR (yarım daireler), çünkü gerçek
 * perforasyon kenardan başlar.
 */
export function Perforation({
  orientation = 'vertical',
  color = 'currentColor',
  className
}: {
  orientation?: 'vertical' | 'horizontal';
  color?: string;
  className?: string;
}) {
  const vertical = orientation === 'vertical';

  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute pointer-events-none',
        vertical ? 'inset-y-0 w-px' : 'inset-x-0 h-px',
        className
      )}
      style={{
        backgroundImage: `repeating-linear-gradient(${vertical ? 'to bottom' : 'to right'}, ${color} 0 4px, transparent 4px 9px)`,
        opacity: 0.55
      }}
    />
  );
}

/**
 * Barkod. Çubuk genişlikleri deterministik üretilir; gerçek bir kod
 * taşımaz ama ritmi gerçekçi olsun diye 4 farklı kalınlık kullanılır.
 */
export function Barcode({
  color = 'currentColor',
  bars = 42,
  seed = 7,
  className
}: {
  color?: string;
  bars?: number;
  seed?: number;
  className?: string;
}) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x9e3779b9) >>> 0;
    let t = Math.imul(a ^ (a >>> 16), 0x21f0aaad);
    t = Math.imul(t ^ (t >>> 15), 0x735a2d97);
    return ((t ^ (t >>> 15)) >>> 0) / 4294967296;
  };

  const widths = Array.from({ length: bars }, () => [1, 1, 2, 3][Math.floor(next() * 4)]);
  const total = widths.reduce((s, w) => s + w + 1, 0);

  let cursor = 0;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${total} 20`}
      preserveAspectRatio="none"
      className={cn('block', className)}
    >
      {widths.map((w, i) => {
        const x = cursor;
        cursor += w + 1;
        return <rect key={i} x={x} y="0" width={w} height="20" fill={color} />;
      })}
    </svg>
  );
}
