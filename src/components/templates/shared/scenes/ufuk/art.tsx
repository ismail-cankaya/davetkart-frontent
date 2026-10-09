import React from 'react';
import { rng } from '../../effects/scenery';

/**
 * Ufuk sahnelerinin çizimleri — saf SVG, hareket İÇERMEZ.
 *
 * Hareketi UfukScene verir; bu dosya yalnızca "neyin nerede durduğunu"
 * söyler. Ayrım bilinçlidir: aynı çizimler kapak görseli üreten betik
 * (scripts/temalar/ufuk-kapaklar.tsx) tarafından Node'da da basılır, orada
 * ne Motion ne tarayıcı vardır.
 *
 * ——— Koordinat sözleşmesi ———
 *
 * Her katman sabit bir ŞERİT üzerinde çizilir ve sahne onu
 * `preserveAspectRatio="… slice"` ile kadraja oturtur:
 *
 *   STRIP  1600×600   alta yaslı   — uzak tepe, ana motif, ön plan
 *   FLOAT  1600×1000  alta yaslı   — gökyüzüne yükselen nesneler (balon, kep)
 *   TOP    1600×400   üste yaslı   — tepeden sarkanlar (fener, ampul, flama)
 *
 * Telefonda (dikey kadraj) şeridin yalnızca ORTA ~%35'i görünür: kabaca
 * x ∈ [520, 1080]. Ana motif bu yüzden hep x = 800 ekseninde durur; yanlara
 * konan ağaç ve binalar yalnızca geniş ekranda kadraja girer ve kompozisyonu
 * genişletir. Yeni bir motif eklerken bu güvenli bölge korunmalıdır.
 *
 * ——— Katman sözleşmesi ———
 *
 * Her şerit üç parçadan oluşur (bkz. UfukStrip). Işık parçaları siluetten
 * AYRI çizilir çünkü sahne onları kaydırmayla yakar: alacakaranlıkta sönük
 * duran pencereler gece bastıkça parlar.
 */

/* ————————————————— sözleşme ————————————————— */

export const STRIP = { w: 1600, h: 600 } as const;
export const FLOAT = { w: 1600, h: 1000 } as const;
export const TOP = { w: 1600, h: 400 } as const;

/** Bir derinlik katmanı: siluet ve onun yanan ışıkları. */
export interface UfukStrip {
  /** Siluet. Işık kapalıyken de görünen her şey. */
  shape: React.ReactNode;
  /**
   * Siluetin ARKASINDA yanan ışık — sütun ya da kemer aralarından görünen
   * iç aydınlık. Önde çizilseydi sütunların üstüne taşardı.
   */
  glow?: React.ReactNode;
  /** Siluetin ÖNÜNDE yanan ışık — pencere camı, ampul, fener, mum. */
  lights?: React.ReactNode;
}

export interface UfukLayers {
  far: UfukStrip;
  /** Kaydırdıkça gökyüzüne YÜKSELEN nesneler (FLOAT koordinatında). */
  float?: UfukStrip;
  mid: UfukStrip;
  near: UfukStrip;
  /** Tepeden sarkanlar (TOP koordinatında); kaydırınca kadrajdan çıkar. */
  top?: UfukStrip;
}

/** Bir sahnenin mürekkepleri. Siluetler uzaktan yakına koyulaşır. */
export interface UfukPalette {
  far: string;
  mid: string;
  near: string;
  /** Pencere, fener, ampul ve mum ışığı. */
  light: string;
  /** Renkli süsler (balon, flama, çiçek, neon). En az bir renk. */
  accents: string[];
}

/**
 * Sahne türleri motife göre adlandırılır, kategoriye göre değil: bir
 * kategori başka bir sahneyi de seçebilir (ör. nişan için "servi").
 */
export type UfukSceneKind =
  | 'servi'
  | 'fener'
  | 'bahce'
  | 'saray'
  | 'balon'
  | 'kampus'
  | 'bulut'
  | 'neon'
  | 'kule';

/* ————————————————— geometri yardımcıları ————————————————— */

type Pt = [number, number];

/** Yol dizgilerini kısa tutar: 0.1 birim hassasiyet gözle ayırt edilmez. */
const n = (v: number) => Math.round(v * 10) / 10;

/** Catmull-Rom → kübik Bézier: noktaların tam üzerinden geçen yumuşak eğri. */
function smooth(points: Pt[]): string {
  let d = `M${n(points[0][0])} ${n(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    d += ` C${n(p1[0] + (p2[0] - p0[0]) / 6)} ${n(p1[1] + (p2[1] - p0[1]) / 6)} ${n(p2[0] - (p3[0] - p1[0]) / 6)} ${n(p2[1] - (p3[1] - p1[1]) / 6)} ${n(p2[0])} ${n(p2[1])}`;
  }
  return d;
}

interface Ridge {
  d: string;
  /**
   * Sırtın x'teki yaklaşık yüksekliği. Ağaç ve binalar tabanlarını buna
   * oturtur; aksi hâlde inişli çıkışlı bir tepede havada asılı dururlardı.
   */
  yAt: (x: number) => number;
}

/** Kadrajı iki yandan taşan, alttan kapalı yumuşak bir tepe bandı. */
function ridge(seed: number, baseY: number, amp: number, steps: number, bottom: number = STRIP.h): Ridge {
  const random = rng(seed);
  const x0 = -80;
  const x1 = STRIP.w + 80;
  const pts: Pt[] = Array.from({ length: steps + 1 }, (_, i) => [x0 + ((x1 - x0) * i) / steps, baseY - random() * amp]);

  return {
    d: `${smooth(pts)} L${x1} ${bottom} L${x0} ${bottom} Z`,
    yAt: (x) => {
      const t = ((x - x0) / (x1 - x0)) * steps;
      const i = Math.max(0, Math.min(steps - 1, Math.floor(t)));
      return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * (t - i);
    }
  };
}

/** Yarım daire kubbe; (x, y) taban ortası. */
const semi = (x: number, y: number, r: number) => `M${n(x - r)} ${n(y)} A${r} ${r} 0 0 1 ${n(x + r)} ${n(y)} Z`;

/** Kemerli pencere / kapı; (x, y) sol üst köşe. */
const arch = (x: number, y: number, w: number, h: number) =>
  `M${n(x)} ${n(y + h)} L${n(x)} ${n(y + w / 2)} A${n(w / 2)} ${n(w / 2)} 0 0 1 ${n(x + w)} ${n(y + w / 2)} L${n(x + w)} ${n(y + h)} Z`;

/**
 * Servi: sivri tepe, alt üçte birde en geniş, tabanda yuvarlanan sütun.
 * `w` en geniş noktadaki YARIM genişliktir.
 */
function cypress(x: number, base: number, h: number, w: number): string {
  const top = base - h;
  return `M${n(x)} ${n(top)}
    C${n(x + w * 0.35)} ${n(top + h * 0.2)} ${n(x + w * 1.08)} ${n(top + h * 0.56)} ${n(x + w * 0.86)} ${n(base - h * 0.08)}
    Q${n(x + w * 0.5)} ${n(base)} ${n(x)} ${n(base)}
    Q${n(x - w * 0.5)} ${n(base)} ${n(x - w * 0.86)} ${n(base - h * 0.08)}
    C${n(x - w * 1.08)} ${n(top + h * 0.56)} ${n(x - w * 0.35)} ${n(top + h * 0.2)} ${n(x)} ${n(top)} Z`;
}

/** Yuvarlak taçlı ağaç: gövde + üç örtüşen taç. */
function RoundTree({ x, base, h, r }: { x: number; base: number; h: number; r: number }) {
  const crown = base - h + r;
  return (
    <>
      <rect x={n(x - r * 0.07)} y={n(base - h * 0.42)} width={n(r * 0.14)} height={n(h * 0.42)} />
      <circle cx={n(x)} cy={n(crown)} r={n(r)} />
      <circle cx={n(x - r * 0.62)} cy={n(crown + r * 0.42)} r={n(r * 0.72)} />
      <circle cx={n(x + r * 0.6)} cy={n(crown + r * 0.38)} r={n(r * 0.7)} />
    </>
  );
}

/**
 * İki nokta arasında sarkan tel. `sag`, telin ortadaki çöküş miktarıdır;
 * `at(t)` tel boyunca nokta verir — ampul ve flamalar buna asılır.
 */
function catenary(x1: number, y1: number, x2: number, y2: number, sag: number) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 + sag * 2;
  return {
    d: `M${n(x1)} ${n(y1)} Q${n(cx)} ${n(cy)} ${n(x2)} ${n(y2)}`,
    at: (t: number): Pt => {
      const u = 1 - t;
      return [u * u * x1 + 2 * u * t * cx + t * t * x2, u * u * y1 + 2 * u * t * cy + t * t * y2];
    }
  };
}

/** Beş köşeli yıldız; (x, y) merkez. */
export function star5(x: number, y: number, R: number): string {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? R : R * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    return `${n(x + r * Math.cos(a))} ${n(y + r * Math.sin(a))}`;
  });
  return `M${pts.join(' L')} Z`;
}

/** Sağa açılan hilal; (x, y) merkez, R dış yarıçap. */
export function crescent(x: number, y: number, R: number): string {
  return `M${n(x)} ${n(y - R)} A${R} ${R} 0 0 0 ${n(x)} ${n(y + R)} A${n(R * 1.25)} ${n(R * 1.25)} 0 0 1 ${n(x)} ${n(y - R)} Z`;
}

/** Dört kollu ışıltı (✦). */
function sparkle(x: number, y: number, r: number): string {
  const k = r * 0.22;
  return `M${n(x)} ${n(y - r)} Q${n(x + k)} ${n(y - k)} ${n(x + r)} ${n(y)} Q${n(x + k)} ${n(y + k)} ${n(x)} ${n(y + r)} Q${n(x - k)} ${n(y + k)} ${n(x - r)} ${n(y)} Q${n(x - k)} ${n(y - k)} ${n(x)} ${n(y - r)} Z`;
}

/**
 * Işık halesi gradyanı. Her ışık parçası kendi <defs>'ini taşır: parçalar
 * ayrı <svg> öğelerinde çizilir ve hangisinin önce boyanacağı garanti değil.
 */
function GlowDef({ id, color, core = 0.9 }: { id: string; color: string; core?: number }) {
  return (
    <defs>
      <radialGradient id={id}>
        <stop offset="0%" stopColor={color} stopOpacity={core} />
        <stop offset="38%" stopColor={color} stopOpacity={core * 0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
  );
}

/** Yanan tek bir nokta: hale + çekirdek. */
function Bulb({ x, y, r, glow, color, halo = 4 }: { x: number; y: number; r: number; glow: string; color: string; halo?: number }) {
  return (
    <>
      <circle cx={n(x)} cy={n(y)} r={n(r * halo)} fill={`url(#${glow})`} />
      <circle cx={n(x)} cy={n(y)} r={n(r)} fill={color} />
    </>
  );
}

/** Ateş böcekleri — gece ön planda beliren sıcak noktalar. */
function Fireflies({ points, glow, color }: { points: Pt[]; glow: string; color: string }) {
  return (
    <>
      {points.map(([x, y], i) => (
        <React.Fragment key={i}>
          <Bulb x={x} y={y} r={2} glow={glow} color={color} halo={5} />
        </React.Fragment>
      ))}
    </>
  );
}

/* ————————————————— Düğün · Servi bahçesi ————————————————— */

const ROTUNDA_COLS = 6;
const ROTUNDA_SPAN = 236;

/** Kubbeli rotunda (çardak); yerel koordinatta, taban ortası (0, 0). */
function Rotunda({ cx, base, s }: { cx: number; base: number; s: number }) {
  return (
    <g transform={`translate(${n(cx)} ${n(base)}) scale(${s})`}>
      <rect x={-160} y={-14} width={320} height={14} />
      <rect x={-146} y={-28} width={292} height={14} />
      {Array.from({ length: ROTUNDA_COLS }, (_, i) => {
        const x = -ROTUNDA_SPAN / 2 + (ROTUNDA_SPAN / (ROTUNDA_COLS - 1)) * i;
        return (
          <g key={i}>
            <rect x={x - 6.5} y={-190} width={13} height={162} />
            <rect x={x - 10.5} y={-196} width={21} height={7} />
            <rect x={x - 10.5} y={-34} width={21} height={6} />
          </g>
        );
      })}
      <rect x={-132} y={-214} width={264} height={20} />
      <rect x={-140} y={-221} width={280} height={8} />
      <path d="M-122 -221 C-122 -298 -70 -330 0 -332 C70 -330 122 -298 122 -221 Z" />
      <rect x={-14} y={-352} width={28} height={22} />
      <path d="M-18 -352 Q0 -374 18 -352 Z" />
      <rect x={-1.5} y={-392} width={3} height={24} />
      <circle cx={0} cy={-394} r={4} />
    </g>
  );
}

function servi(p: UfukPalette, uid: string): UfukLayers {
  const glow = `${uid}-glow`;
  const farBack = ridge(11, 410, 70, 9);
  const farFront = ridge(12, 462, 38, 7);
  const random = rng(13);
  const farTrees = Array.from({ length: 26 }, (_, i) => {
    const x = 30 + i * 60 + random() * 30;
    return { x, h: 26 + random() * 30, w: 4 + random() * 2.5 };
  });

  const ground = ridge(14, 548, 18, 8);
  const midCypress: Array<[number, number, number]> = [
    [300, 175, 20], [352, 228, 24], [410, 160, 19],
    [582, 252, 26], [640, 202, 22],
    [960, 210, 23], [1018, 258, 27],
    [1185, 168, 20], [1240, 230, 25], [1298, 178, 21]
  ];
  const s = 0.82;
  const rotBase = ground.yAt(800) + 6;
  const colX = (i: number) => 800 + s * (-ROTUNDA_SPAN / 2 + (ROTUNDA_SPAN / (ROTUNDA_COLS - 1)) * i);
  const garlandY = rotBase - 186 * s;

  const near = ridge(15, 580, 14, 7);
  const nearCypress: Array<[number, number, number]> = [
    [200, 410, 40], [536, 355, 33], [1068, 330, 31], [1400, 395, 38]
  ];
  const shrubs: Array<[number, number, number]> = [
    [470, 70, 24], [700, 82, 26], [905, 92, 24], [1170, 76, 24]
  ];

  return {
    far: {
      shape: (
        <>
          <path d={farBack.d} fill={p.far} opacity={0.55} />
          <path d={farFront.d} fill={p.far} />
          {farTrees.map((t, i) => (
            <path key={i} d={cypress(t.x, farFront.yAt(t.x) + 6, t.h, t.w)} fill={p.far} />
          ))}
        </>
      )
    },
    mid: {
      shape: (
        <g fill={p.mid}>
          <path d={ground.d} />
          {midCypress.map(([x, h, w], i) => (
            <path key={i} d={cypress(x, ground.yAt(x) + 8, h, w)} />
          ))}
          <Rotunda cx={800} base={rotBase} s={s} />
        </g>
      ),
      // Sütunların arasından görünen iç aydınlık.
      glow: (
        <>
          <GlowDef id={`${glow}-in`} color={p.light} core={0.75} />
          <ellipse cx={800} cy={n(rotBase - 108 * s)} rx={n(120 * s)} ry={n(98 * s)} fill={`url(#${glow}-in)`} />
        </>
      ),
      // Sütun başlıkları arasında sarkan ampul dizisi.
      lights: (
        <>
          <GlowDef id={glow} color={p.light} />
          {Array.from({ length: ROTUNDA_COLS - 1 }, (_, i) => {
            const wire = catenary(colX(i), garlandY, colX(i + 1), garlandY, 14 * s);
            return (
              <g key={i}>
                <path d={wire.d} fill="none" stroke={p.light} strokeOpacity={0.35} strokeWidth={1} />
                {[0.2, 0.4, 0.6, 0.8].map((t) => {
                  const [x, y] = wire.at(t);
                  return (
                    <React.Fragment key={t}>
                      <Bulb x={x} y={y + 2} r={2.2} glow={glow} color={p.light} />
                    </React.Fragment>
                  );
                })}
              </g>
            );
          })}
        </>
      )
    },
    near: {
      shape: (
        <g fill={p.near}>
          <path d={near.d} />
          {nearCypress.map(([x, h, w], i) => (
            <path key={i} d={cypress(x, 604, h, w)} />
          ))}
          {shrubs.map(([x, rx, ry], i) => (
            <ellipse key={i} cx={x} cy={near.yAt(x) + 6} rx={rx} ry={ry} />
          ))}
        </g>
      ),
      lights: (
        <>
          <GlowDef id={`${glow}-fly`} color={p.light} />
          <Fireflies
            glow={`${glow}-fly`}
            color={p.light}
            points={[[620, 512], [735, 540], [930, 522], [1005, 548], [468, 532], [1130, 528], [820, 560], [300, 520], [1320, 540]]}
          />
        </>
      )
    }
  };
}

/* ————————————————— Kına · Fenerler ve kubbeler ————————————————— */

const MINARET_X = 292;

/** Cami silueti; yerel koordinatta, taban ortası (0, 0). */
function Mosque({ cx, base }: { cx: number; base: number }) {
  return (
    <g transform={`translate(${n(cx)} ${n(base)})`}>
      <rect x={-262} y={-62} width={524} height={62} />
      <path d={semi(-232, -62, 22)} />
      <path d={semi(232, -62, 22)} />
      <rect x={-150} y={-150} width={300} height={150} />
      <path d={semi(-108, -150, 50)} />
      <path d={semi(108, -150, 50)} />
      <rect x={-84} y={-200} width={168} height={52} />
      <path d="M-96 -198 C-96 -268 -54 -300 0 -302 C54 -300 96 -268 96 -198 Z" />
      <rect x={-2} y={-334} width={4} height={34} />
      <circle cx={0} cy={-336} r={5} />
      <path d={crescent(0, -352, 8)} />
      {[-MINARET_X, MINARET_X].map((x) => (
        <g key={x}>
          <rect x={x - 13} y={-44} width={26} height={44} />
          <rect x={x - 9} y={-330} width={18} height={290} />
          <rect x={x - 15} y={-252} width={30} height={7} />
          <rect x={x - 14} y={-298} width={28} height={6} />
          <path d={`M${x - 10} -330 L${x} -404 L${x + 10} -330 Z`} />
          <rect x={x - 1} y={-418} width={2} height={16} />
        </g>
      ))}
    </g>
  );
}

/** Kırma çatılı ev; (x) orta, taban (base). */
function House({ x, base, w, h }: { x: number; base: number; w: number; h: number }) {
  return (
    <>
      <rect x={n(x - w / 2)} y={n(base - h)} width={n(w)} height={n(h)} />
      <path d={`M${n(x - w / 2 - 6)} ${n(base - h)} L${n(x - w * 0.2)} ${n(base - h - w * 0.32)} L${n(x + w * 0.2)} ${n(base - h - w * 0.32)} L${n(x + w / 2 + 6)} ${n(base - h)} Z`} />
    </>
  );
}

/** Evin pencereleri (2 × 2, kemerli). */
function HouseWindows({ x, base, w, h, fill, lit }: { x: number; base: number; w: number; h: number; fill: string; lit: boolean[] }) {
  const cells: Pt[] = [
    [x - w * 0.25, base - h * 0.78],
    [x + w * 0.25, base - h * 0.78],
    [x - w * 0.25, base - h * 0.4],
    [x + w * 0.25, base - h * 0.4]
  ];
  return (
    <>
      {cells.map(([cx, cy], i) =>
        lit[i] ? <path key={i} d={arch(cx - 6, cy, 12, 20)} fill={fill} /> : null
      )}
    </>
  );
}

/** Osmanlı feneri; ip boyu `len`, ölçek `s`. Çerçeve siluette, camlar ışıkta. */
function lanternFrame(x: number, len: number, s: number) {
  return (
    <g transform={`translate(${n(x)} 0)`}>
      <rect x={-0.8} y={0} width={1.6} height={n(len)} />
      <g transform={`translate(0 ${n(len)}) scale(${s})`}>
        <circle cx={0} cy={0} r={4} fill="none" stroke="currentColor" strokeWidth={1.6} />
        <path d="M-15 17 Q0 -2 15 17 Z" />
        <rect x={-17} y={16} width={34} height={5} />
        <path d="M-17 21 L-22 41 L-17 62 L17 62 L22 41 L17 21 Z" />
        <rect x={-13} y={62} width={26} height={5} />
        <path d="M-7 67 L0 82 L7 67 Z" />
      </g>
    </g>
  );
}

function lanternGlass(x: number, len: number, s: number, glow: string, light: string, frame: string) {
  return (
    <g transform={`translate(${n(x)} ${n(len)}) scale(${s})`}>
      <circle cx={0} cy={41} r={58} fill={`url(#${glow})`} />
      <path d="M-13 25 L-17 41 L-13 58 L13 58 L17 41 L13 25 Z" fill={light} />
      {/* Kafes: camı dört dilime bölen çubuklar. */}
      <path d="M-4.5 25 L-6 41 L-4.5 58 M4.5 25 L6 41 L4.5 58 M-17 41 L17 41" stroke={frame} strokeWidth={2} fill="none" />
    </g>
  );
}

function fener(p: UfukPalette, uid: string): UfukLayers {
  const glow = `${uid}-glow`;
  const random = rng(21);
  const farBack = ridge(22, 432, 50, 8);
  const farFront = ridge(23, 478, 16, 8);
  const farCity = Array.from({ length: 22 }, (_, i) => ({
    x: 30 + i * 72 + random() * 30,
    w: 34 + random() * 34,
    h: 18 + random() * 34,
    dome: random() > 0.55,
    minaret: random() > 0.78
  }));

  const ground = ridge(24, 558, 8, 6);
  const base = ground.yAt(800) + 4;
  const houses: Array<[number, number, number]> = [
    [370, 120, 70], [492, 92, 96], [1108, 100, 86], [1232, 128, 66]
  ];
  const houseLit = houses.map(() => [random() > 0.2, random() > 0.5, random() > 0.35, random() > 0.25]);

  const lanterns: Array<[number, number, number]> = [
    [300, 190, 1.15], [430, 140, 1.05], [570, 92, 0.95], [700, 38, 0.78],
    [905, 58, 0.82], [1040, 104, 0.95], [1175, 150, 1.05], [1310, 196, 1.15]
  ];

  const balusters = Array.from({ length: 49 }, (_, i) => i * 34);
  const pillars = [120, 460, 800, 1140, 1480];
  const candles = [640, 960, 330, 1270];

  return {
    far: {
      shape: (
        <g fill={p.far}>
          <path d={farBack.d} opacity={0.55} />
          {farCity.map((b, i) => {
            const y = farFront.yAt(b.x) + 6;
            return (
              <g key={i}>
                <rect x={n(b.x - b.w / 2)} y={n(y - b.h)} width={n(b.w)} height={n(b.h)} />
                {b.dome && <path d={semi(b.x, y - b.h, b.w * 0.32)} />}
                {b.minaret && (
                  <path d={`M${n(b.x + b.w / 2 - 4)} ${n(y)} L${n(b.x + b.w / 2 - 4)} ${n(y - b.h - 60)} L${n(b.x + b.w / 2)} ${n(y - b.h - 78)} L${n(b.x + b.w / 2 + 4)} ${n(y - b.h - 60)} L${n(b.x + b.w / 2 + 4)} ${n(y)} Z`} />
                )}
              </g>
            );
          })}
          <path d={farFront.d} />
        </g>
      )
    },
    mid: {
      shape: (
        <g fill={p.mid} color={p.mid}>
          <path d={ground.d} />
          {houses.map(([x, w, h], i) => (
            <React.Fragment key={i}>
              <House x={x} base={ground.yAt(x) + 4} w={w} h={h} />
            </React.Fragment>
          ))}
          <Mosque cx={800} base={base} />
        </g>
      ),
      lights: (
        <>
          <GlowDef id={glow} color={p.light} core={0.55} />
          <g transform={`translate(800 ${n(base)})`}>
            {[-80, -40, 0, 40, 80].map((x) => (
              <React.Fragment key={x}>
                <circle cx={x} cy={-104} r={26} fill={`url(#${glow})`} />
                <path d={arch(x - 8, -128, 16, 40)} fill={p.light} />
              </React.Fragment>
            ))}
            {[-63, -42, -21, 0, 21, 42, 63].map((x) => (
              <path key={x} d={arch(x - 4.5, -192, 9, 18)} fill={p.light} opacity={0.85} />
            ))}
            {[-230, -188, -146, 146, 188, 230].map((x) => (
              <path key={x} d={arch(x - 6, -48, 12, 24)} fill={p.light} opacity={0.9} />
            ))}
            <circle cx={0} cy={-30} r={40} fill={`url(#${glow})`} />
            <path d={arch(-16, -62, 32, 62)} fill={p.light} />
            {[-MINARET_X, MINARET_X].map((x) => (
              <circle key={x} cx={x} cy={-250} r={22} fill={`url(#${glow})`} />
            ))}
          </g>
          {houses.map(([x, w, h], i) => (
            <React.Fragment key={i}>
              <HouseWindows x={x} base={ground.yAt(x) + 4} w={w} h={h} fill={p.light} lit={houseLit[i]} />
            </React.Fragment>
          ))}
        </>
      )
    },
    near: {
      // Taraça korkuluğu: şehre yukarıdan, bir kına gecesinin terasından bakılır.
      shape: (
        <g fill={p.near}>
          <rect x={-20} y={548} width={1640} height={12} rx={2} />
          <rect x={-20} y={590} width={1640} height={12} />
          {balusters.map((x) => (
            <path key={x} d={`M${x - 5} 560 Q${x - 10} 572 ${x - 4} 578 L${x - 4} 590 L${x + 4} 590 L${x + 4} 578 Q${x + 10} 572 ${x + 5} 560 Z`} />
          ))}
          {pillars.map((x) => (
            <g key={x}>
              <rect x={x - 13} y={540} width={26} height={62} />
              <rect x={x - 16} y={535} width={32} height={7} />
            </g>
          ))}
          {[470, 1130].map((x) => (
            <g key={x}>
              <path d={`M${x - 20} 548 L${x - 25} 516 L${x + 25} 516 L${x + 20} 548 Z`} />
              <ellipse cx={x - 14} cy={500} rx={11} ry={24} transform={`rotate(-28 ${x - 14} 500)`} />
              <ellipse cx={x + 14} cy={498} rx={11} ry={26} transform={`rotate(26 ${x + 14} 498)`} />
              <ellipse cx={x} cy={490} rx={10} ry={30} />
            </g>
          ))}
          {candles.map((x) => (
            <rect key={x} x={x - 4} y={530} width={8} height={18} rx={1} />
          ))}
        </g>
      ),
      lights: (
        <>
          <GlowDef id={`${glow}-c`} color={p.light} />
          {candles.map((x) => (
            <g key={x}>
              <circle cx={x} cy={520} r={30} fill={`url(#${glow}-c)`} />
              <path d={`M${x} 510 Q${x + 5} 520 ${x} 528 Q${x - 5} 520 ${x} 510 Z`} fill={p.light} />
            </g>
          ))}
        </>
      )
    },
    top: {
      shape: (
        <g fill={p.near} color={p.near}>
          {lanterns.map(([x, len, s]) => (
            <React.Fragment key={x}>{lanternFrame(x, len, s)}</React.Fragment>
          ))}
        </g>
      ),
      lights: (
        <>
          <GlowDef id={`${glow}-l`} color={p.light} core={0.6} />
          {lanterns.map(([x, len, s]) => (
            <React.Fragment key={x}>{lanternGlass(x, len, s, `${glow}-l`, p.light, p.near)}</React.Fragment>
          ))}
        </>
      )
    }
  };
}

/* ————————————————— Nişan · Işıklı bahçe ————————————————— */

function Topiary({ x, base }: { x: number; base: number }) {
  return (
    <>
      <path d={`M${x - 22} ${n(base)} L${x - 27} ${n(base - 36)} L${x + 27} ${n(base - 36)} L${x + 22} ${n(base)} Z`} />
      <rect x={x - 3} y={n(base - 150)} width={6} height={116} />
      <circle cx={x} cy={n(base - 150)} r={52} />
      <circle cx={x} cy={n(base - 232)} r={34} />
      <circle cx={x} cy={n(base - 280)} r={18} />
    </>
  );
}

function bahce(p: UfukPalette, uid: string): UfukLayers {
  const glow = `${uid}-glow`;
  const random = rng(31);
  const farBack = ridge(32, 430, 55, 8);
  const farFront = ridge(33, 480, 20, 8);
  const farTrees = Array.from({ length: 30 }, (_, i) => ({
    x: i * 56 + random() * 24,
    h: 46 + random() * 40,
    r: 16 + random() * 12
  }));

  const ground = ridge(34, 552, 12, 6);
  const base = ground.yAt(800) + 4;

  // Kemer boyunca yaprak kümeleri ve çiçekler.
  const foliage: Array<{ x: number; y: number; r: number; bloom: number }> = [];
  for (let a = 180; a >= 0; a -= 9) {
    const t = (a * Math.PI) / 180;
    foliage.push({
      x: 800 + 100 * Math.cos(t) + (random() - 0.5) * 12,
      y: base - 236 - 100 * Math.sin(t) + (random() - 0.5) * 12,
      r: 12 + random() * 9,
      bloom: random()
    });
  }
  for (let y = base - 236; y < base - 30; y += 22) {
    for (const side of [-1, 1]) {
      foliage.push({ x: 800 + side * 100 + (random() - 0.5) * 16, y, r: 10 + random() * 7, bloom: random() });
    }
  }

  const fairy = Array.from({ length: 25 }, (_, i) => {
    const t = Math.PI - (i * Math.PI) / 24;
    return [800 + 110 * Math.cos(t), base - 236 - 110 * Math.sin(t)] as Pt;
  });

  const strands = [
    catenary(-60, 18, 700, 40, 118),
    catenary(700, 40, 1660, 22, 118),
    catenary(380, -6, 1220, -6, 68)
  ];

  const near = ridge(35, 584, 10, 6);
  const stems = Array.from({ length: 64 }, (_, i) => {
    const x = i * 26 + random() * 14;
    return { x, h: 18 + random() * 54, lean: (random() - 0.5) * 14, r: 3 + random() * 4 };
  });

  return {
    far: {
      shape: (
        <g fill={p.far}>
          <path d={farBack.d} opacity={0.55} />
          {farTrees.map((t, i) => (
            <React.Fragment key={i}>
              <RoundTree x={t.x} base={farFront.yAt(t.x) + 8} h={t.h} r={t.r} />
            </React.Fragment>
          ))}
          <path d={farFront.d} />
        </g>
      )
    },
    mid: {
      shape: (
        <g fill={p.mid}>
          <path d={ground.d} />
          <RoundTree x={330} base={ground.yAt(330) + 6} h={270} r={72} />
          <RoundTree x={1270} base={ground.yAt(1270) + 6} h={250} r={68} />
          <Topiary x={575} base={ground.yAt(575) + 4} />
          <Topiary x={1025} base={ground.yAt(1025) + 4} />
          <rect x={692} y={n(base - 236)} width={16} height={236} />
          <rect x={892} y={n(base - 236)} width={16} height={236} />
          <path d={`M700 ${n(base - 236)} A100 100 0 0 1 900 ${n(base - 236)}`} fill="none" stroke={p.mid} strokeWidth={16} />
          {foliage.map((f, i) => (
            <circle key={i} cx={n(f.x)} cy={n(f.y)} r={n(f.r)} />
          ))}
          {[[700, 30], [900, 30], [640, 22], [960, 22]].map(([x, r]) => (
            <circle key={x} cx={x} cy={n(base - r * 0.6)} r={r} />
          ))}
          {/* Kemerin çiçekleri: alacakaranlıkta da renkli kalan tek süs. */}
          {foliage
            .filter((f) => f.bloom > 0.45)
            .map((f, i) => (
              <circle
                key={`b${i}`}
                cx={n(f.x + (f.bloom - 0.7) * 14)}
                cy={n(f.y - f.r * 0.35)}
                r={n(3 + f.bloom * 4)}
                fill={p.accents[i % p.accents.length]}
                opacity={0.8}
              />
            ))}
        </g>
      ),
      glow: (
        <>
          <GlowDef id={`${glow}-in`} color={p.light} core={0.7} />
          <ellipse cx={800} cy={n(base - 130)} rx={96} ry={124} fill={`url(#${glow}-in)`} />
        </>
      ),
      lights: (
        <>
          <GlowDef id={glow} color={p.light} />
          {fairy.map(([x, y], i) => (
            <React.Fragment key={i}>
              <Bulb x={x} y={y} r={2.1} glow={glow} color={p.light} />
            </React.Fragment>
          ))}
          {[665, 935].map((x) => (
            <g key={x}>
              <circle cx={x} cy={n(base - 24)} r={30} fill={`url(#${glow})`} />
              <rect x={x - 9} y={n(base - 38)} width={18} height={26} rx={2} fill={p.mid} />
              <rect x={x - 6} y={n(base - 34)} width={12} height={18} fill={p.light} />
            </g>
          ))}
        </>
      )
    },
    near: {
      shape: (
        <g fill={p.near}>
          <path d={near.d} />
          <circle cx={470} cy={n(near.yAt(470))} r={46} />
          <circle cx={1130} cy={n(near.yAt(1130))} r={50} />
          {stems.map((s, i) => {
            const y = near.yAt(s.x) + 4;
            return (
              <g key={i}>
                <path d={`M${n(s.x)} ${n(y)} Q${n(s.x + s.lean * 0.3)} ${n(y - s.h * 0.6)} ${n(s.x + s.lean)} ${n(y - s.h)}`} fill="none" stroke={p.near} strokeWidth={2} />
                <circle cx={n(s.x + s.lean)} cy={n(y - s.h)} r={n(s.r)} />
              </g>
            );
          })}
        </g>
      ),
      lights: (
        <>
          <GlowDef id={`${glow}-fly`} color={p.light} />
          <Fireflies glow={`${glow}-fly`} color={p.light} points={[[560, 520], [690, 548], [905, 530], [1010, 552], [420, 540], [1190, 530]]} />
        </>
      )
    },
    top: {
      shape: (
        <g fill="none" stroke={p.near} strokeWidth={2}>
          {strands.map((s, i) => (
            <path key={i} d={s.d} />
          ))}
        </g>
      ),
      lights: (
        <>
          <GlowDef id={`${glow}-s`} color={p.light} />
          {strands.flatMap((s, si) =>
            Array.from({ length: 15 }, (_, i) => {
              const [x, y] = s.at((i + 0.5) / 15);
              return (
                <g key={`${si}-${i}`}>
                  <circle cx={n(x)} cy={n(y + 10)} r={22} fill={`url(#${glow}-s)`} />
                  <rect x={n(x - 2.5)} y={n(y)} width={5} height={5} fill={p.near} />
                  <ellipse cx={n(x)} cy={n(y + 10)} rx={4.5} ry={6.5} fill={p.light} />
                </g>
              );
            })
          )}
        </>
      )
    }
  };
}

/* ————————————————— Sünnet · Saray ————————————————— */

const PALACE_TOWER = 228;

function Palace({ cx, base }: { cx: number; base: number }) {
  return (
    <g transform={`translate(${n(cx)} ${n(base)})`}>
      <rect x={-310} y={-112} width={620} height={112} />
      {Array.from({ length: 26 }, (_, i) => (
        <rect key={i} x={-306 + i * 24} y={-124} width={12} height={12} />
      ))}
      <path d={semi(-300, -124, 18)} />
      <path d={semi(300, -124, 18)} />
      <rect x={-124} y={-210} width={248} height={210} />
      <rect x={-132} y={-218} width={264} height={10} />
      <rect x={-86} y={-238} width={172} height={22} />
      {/* Soğan kubbe: kasnaktan taşar, sonra sivri bir alemle kapanır. */}
      <path d="M-90 -236 C-132 -280 -62 -330 0 -372 C62 -330 132 -280 90 -236 Z" />
      <rect x={-2.5} y={-410} width={5} height={42} />
      <path d={crescent(0, -424, 11)} />
      {[-PALACE_TOWER, PALACE_TOWER].map((x) => (
        <g key={x}>
          <rect x={x - 30} y={-262} width={60} height={262} />
          <rect x={x - 35} y={-270} width={70} height={9} />
          <path d={`M${x - 28} -270 C${x - 44} -296 ${x - 18} -314 ${x} -336 C${x + 18} -314 ${x + 44} -296 ${x + 28} -270 Z`} />
          <rect x={x - 1.5} y={-354} width={3} height={20} />
        </g>
      ))}
    </g>
  );
}

function saray(p: UfukPalette, uid: string): UfukLayers {
  const glow = `${uid}-glow`;
  const random = rng(41);
  const farBack = ridge(42, 440, 60, 7);
  const farFront = ridge(43, 486, 18, 8);
  const farDomes = Array.from({ length: 16 }, (_, i) => ({
    x: 50 + i * 100 + random() * 40,
    r: 12 + random() * 16
  }));

  const ground = ridge(44, 556, 8, 6);
  const base = ground.yAt(800) + 4;
  const gallery = Array.from({ length: 15 }, (_, i) => -280 + i * 40).filter((x) => Math.abs(x) > 140);

  const near = ridge(45, 584, 8, 8);
  const nearCypress: Array<[number, number, number]> = [
    [260, 330, 30], [500, 372, 32], [566, 300, 27], [1034, 300, 27], [1100, 372, 32], [1340, 330, 30]
  ];

  return {
    far: {
      shape: (
        <g fill={p.far}>
          <path d={farBack.d} opacity={0.55} />
          {farDomes.map((d, i) => {
            const y = farFront.yAt(d.x) + 4;
            return (
              <g key={i}>
                <rect x={n(d.x - d.r)} y={n(y - d.r * 1.4)} width={n(d.r * 2)} height={n(d.r * 1.4)} />
                <path d={semi(d.x, y - d.r * 1.4, d.r)} />
              </g>
            );
          })}
          <path d={farFront.d} />
        </g>
      )
    },
    mid: {
      shape: (
        <g fill={p.mid}>
          <path d={ground.d} />
          <Palace cx={800} base={base} />
        </g>
      ),
      lights: (
        <>
          <GlowDef id={glow} color={p.light} core={0.5} />
          <g transform={`translate(800 ${n(base)})`} fill={p.light}>
            <circle cx={0} cy={-50} r={70} fill={`url(#${glow})`} />
            <path d={arch(-22, -100, 44, 100)} />
            {[-72, -30, 30, 72].map((x) => (
              <path key={x} d={arch(x - 9, -190, 18, 46)} />
            ))}
            {[-72, -48, -24, 0, 24, 48, 72].map((x) => (
              <path key={x} d={arch(x - 4, -234, 8, 14)} opacity={0.85} />
            ))}
            {gallery.map((x) => (
              <path key={x} d={arch(x - 7, -86, 14, 32)} opacity={0.9} />
            ))}
            {[-PALACE_TOWER, PALACE_TOWER].flatMap((x) =>
              [-232, -180, -128].map((y) => <path key={`${x}${y}`} d={arch(x - 6, y, 12, 26)} />)
            )}
          </g>
        </>
      )
    },
    near: {
      shape: (
        <g fill={p.near}>
          <path d={near.d} />
          {nearCypress.map(([x, h, w], i) => (
            <path key={i} d={cypress(x, 604, h, w)} />
          ))}
          <rect x={618} y={566} width={364} height={8} />
        </g>
      ),
      // Havuzdaki yansıma: sarayın ışıkları suda kırılır.
      lights: (
        <g fill={p.light}>
          <rect x={622} y={574} width={356} height={30} fill={p.mid} />
          {[[800, 580, 70], [760, 586, 40], [842, 590, 52], [800, 596, 90], [690, 584, 22], [910, 588, 26]].map(([x, y, w], i) => (
            <rect key={i} x={x - w / 2} y={y} width={w} height={2} rx={1} opacity={0.35 + (i % 3) * 0.15} />
          ))}
        </g>
      )
    }
  };
}

/* ————————————————— Doğum günü · Balonlar ————————————————— */

/** Sıcak hava balonu zarfı; (cx, cy) üst yarım kürenin merkezi. */
function balloonEnvelope(cx: number, cy: number, r: number): string {
  return `M${n(cx - r)} ${n(cy)} A${n(r)} ${n(r)} 0 0 1 ${n(cx + r)} ${n(cy)}
    C${n(cx + r)} ${n(cy + r * 0.55)} ${n(cx + r * 0.38)} ${n(cy + r * 0.95)} ${n(cx + r * 0.26)} ${n(cy + r * 1.15)}
    L${n(cx - r * 0.26)} ${n(cy + r * 1.15)}
    C${n(cx - r * 0.38)} ${n(cy + r * 0.95)} ${n(cx - r)} ${n(cy + r * 0.55)} ${n(cx - r)} ${n(cy)} Z`;
}

function balon(p: UfukPalette, uid: string): UfukLayers {
  const glow = `${uid}-glow`;
  const shade = `${uid}-shade`;
  const farBack = ridge(51, 400, 60, 6);
  const farFront = ridge(52, 456, 44, 6);
  const midHill = ridge(54, 522, 38, 6);
  const near = ridge(55, 574, 20, 6);
  const random = rng(56);

  const balloons: Array<[number, number, number]> = [
    [880, 420, 92], [650, 560, 60], [560, 330, 36], [1040, 640, 50],
    [300, 470, 70], [1300, 380, 78], [1180, 220, 40]
  ];
  const accent = (i: number) => p.accents[i % p.accents.length];

  const flags = [catenary(-40, 8, 820, 40, 70), catenary(780, 40, 1640, 8, 70)];
  const grass = Array.from({ length: 80 }, (_, i) => ({ x: i * 20 + random() * 12, h: 10 + random() * 22 }));

  return {
    far: {
      shape: (
        <g fill={p.far}>
          <path d={farBack.d} opacity={0.55} />
          <path d={farFront.d} />
        </g>
      )
    },
    float: {
      shape: (
        <>
          <defs>
            <linearGradient id={shade} x1="0" y1="0" x2="1" y2="0.35">
              <stop offset="0" stopColor="#ffffff" stopOpacity={0.22} />
              <stop offset="0.45" stopColor="#000000" stopOpacity={0} />
              <stop offset="1" stopColor="#000000" stopOpacity={0.5} />
            </linearGradient>
            {balloons.map(([cx, cy, r], i) => (
              <clipPath key={i} id={`${uid}-b${i}`}>
                <path d={balloonEnvelope(cx, cy, r)} />
              </clipPath>
            ))}
          </defs>
          {balloons.map(([cx, cy, r], i) => (
            <g key={i}>
              {/* İpler ve sepet */}
              <path
                d={`M${n(cx - r * 0.26)} ${n(cy + r * 1.15)} L${n(cx - r * 0.16)} ${n(cy + r * 1.4)} M${n(cx + r * 0.26)} ${n(cy + r * 1.15)} L${n(cx + r * 0.16)} ${n(cy + r * 1.4)}`}
                fill="none"
                stroke={p.mid}
                strokeWidth={1.4}
              />
              <rect x={n(cx - r * 0.18)} y={n(cy + r * 1.4)} width={n(r * 0.36)} height={n(r * 0.24)} rx={2} fill={p.mid} />
              {/* Zarf: dikey dilimler (gore) zarfın kendi biçimine kırpılır. */}
              <g clipPath={`url(#${uid}-b${i})`}>
                <rect x={n(cx - r)} y={n(cy - r)} width={n(r * 2)} height={n(r * 2.2)} fill={accent(i)} />
                <ellipse cx={n(cx)} cy={n(cy + r * 0.1)} rx={n(r * 0.66)} ry={n(r * 1.4)} fill={accent(i + 1)} />
                <ellipse cx={n(cx)} cy={n(cy + r * 0.1)} rx={n(r * 0.26)} ry={n(r * 1.4)} fill={accent(i)} />
                <rect x={n(cx - r)} y={n(cy + r * 0.92)} width={n(r * 2)} height={n(r * 0.1)} fill={p.mid} opacity={0.35} />
                <rect x={n(cx - r)} y={n(cy - r)} width={n(r * 2)} height={n(r * 2.2)} fill={`url(#${shade})`} />
              </g>
            </g>
          ))}
        </>
      ),
      // Brülör alevi: balon gecede kendi içinden yanar.
      lights: (
        <>
          <GlowDef id={glow} color={p.light} core={0.8} />
          {balloons.map(([cx, cy, r], i) => (
            <circle key={i} cx={n(cx)} cy={n(cy + r * 1.05)} r={n(r * 0.5)} fill={`url(#${glow})`} />
          ))}
        </>
      )
    },
    mid: {
      shape: (
        <g fill={p.mid}>
          <path d={midHill.d} />
          {[[420, 70, 22], [462, 52, 16], [1180, 64, 20], [1222, 48, 15], [250, 80, 24], [1380, 76, 22]].map(([x, h, r]) => (
            <React.Fragment key={x}>
              <RoundTree x={x} base={midHill.yAt(x) + 6} h={h} r={r} />
            </React.Fragment>
          ))}
        </g>
      )
    },
    near: {
      shape: (
        <g fill={p.near}>
          <path d={near.d} />
          {grass.map((g, i) => {
            const y = near.yAt(g.x) + 4;
            return <path key={i} d={`M${n(g.x - 3)} ${n(y)} L${n(g.x + 1)} ${n(y - g.h)} L${n(g.x + 4)} ${n(y)} Z`} />;
          })}
        </g>
      ),
      lights: (
        <>
          <GlowDef id={`${glow}-fly`} color={p.light} />
          <Fireflies glow={`${glow}-fly`} color={p.light} points={[[600, 540], [720, 556], [890, 546], [1010, 560], [480, 552], [1150, 548]]} />
        </>
      )
    },
    top: {
      // Flama dizisi: parti, gökyüzünün kenarından başlar.
      shape: (
        <>
          {flags.map((f, fi) => (
            <g key={fi}>
              <path d={f.d} fill="none" stroke={p.near} strokeWidth={2} />
              {Array.from({ length: 15 }, (_, i) => {
                const [x, y] = f.at((i + 0.5) / 15);
                return (
                  <path
                    key={i}
                    d={`M${n(x - 15)} ${n(y)} L${n(x + 15)} ${n(y)} L${n(x)} ${n(y + 36)} Z`}
                    fill={accent(i + fi)}
                    opacity={0.92}
                  />
                );
              })}
            </g>
          ))}
        </>
      )
    }
  };
}

/* ————————————————— Mezuniyet · Kampüs ————————————————— */

const CAMPUS_COLS = 6;

function Campus({ cx, base }: { cx: number; base: number }) {
  return (
    <g transform={`translate(${n(cx)} ${n(base)})`}>
      {/* Saat kulesi binanın ARKASINDA yükselir. */}
      <rect x={-44} y={-336} width={88} height={170} />
      <rect x={-52} y={-344} width={104} height={10} />
      <rect x={-30} y={-386} width={60} height={42} />
      <path d="M-36 -386 Q0 -436 36 -386 Z" />
      <rect x={-2} y={-470} width={4} height={50} />
      <circle cx={0} cy={-472} r={4} />
      <rect x={-262} y={-172} width={524} height={172} />
      <rect x={-272} y={-184} width={544} height={12} />
      <path d="M-150 -184 L0 -246 L150 -184 Z" />
      <rect x={-430} y={-124} width={168} height={124} />
      <rect x={262} y={-124} width={168} height={124} />
      <path d="M-436 -124 L-418 -148 L-276 -148 L-262 -124 Z" />
      <path d="M436 -124 L418 -148 L276 -148 L262 -124 Z" />
    </g>
  );
}

/** Kep: üstten bakılan pano + başlık + püskül. */
function Cap({ x, y, s, rot, fill, tassel }: { x: number; y: number; s: number; rot: number; fill: string; tassel: string }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) rotate(${rot}) scale(${s})`}>
      <path d="M-34 6 L-34 28 Q0 44 34 28 L34 6 Z" fill={fill} />
      <path d="M-62 0 L0 -22 L62 0 L0 22 Z" fill={fill} />
      <path d="M0 0 L44 8 L44 36" fill="none" stroke={tassel} strokeWidth={2.4} />
      <rect x={40} y={34} width={8} height={14} rx={2} fill={tassel} />
      <circle cx={0} cy={0} r={4} fill={tassel} />
    </g>
  );
}

function kampus(p: UfukPalette, uid: string): UfukLayers {
  const glow = `${uid}-glow`;
  const random = rng(61);
  const farBack = ridge(62, 420, 60, 7);
  const farFront = ridge(63, 478, 22, 8);
  const farTrees = Array.from({ length: 28 }, (_, i) => ({ x: i * 60 + random() * 26, h: 40 + random() * 36, r: 15 + random() * 10 }));

  const ground = ridge(64, 556, 8, 6);
  const base = ground.yAt(800) + 4;
  const near = ridge(65, 586, 8, 6);

  const sideWindows: Pt[] = [];
  for (const row of [-150, -92]) {
    for (const x of [-240, -210, -180, -150, 150, 180, 210, 240]) sideWindows.push([x, row]);
  }
  const wingWindows: Pt[] = [];
  for (const row of [-104, -60]) {
    for (const x of [-410, -378, -346, -314, -282, 282, 314, 346, 378, 410]) wingWindows.push([x, row]);
  }
  const lit = (i: number) => (i * 7919) % 10 > 1;

  const caps: Array<[number, number, number, number]> = [
    [620, 380, 1, -18], [980, 300, 0.85, 22], [760, 240, 0.62, -8], [1110, 470, 0.9, 10],
    [430, 430, 0.75, 15], [1300, 330, 0.8, -20], [540, 220, 0.55, 30]
  ];

  return {
    far: {
      shape: (
        <g fill={p.far}>
          <path d={farBack.d} opacity={0.55} />
          {farTrees.map((t, i) => (
            <React.Fragment key={i}>
              <RoundTree x={t.x} base={farFront.yAt(t.x) + 8} h={t.h} r={t.r} />
            </React.Fragment>
          ))}
          <path d={farFront.d} />
        </g>
      )
    },
    float: {
      shape: (
        <>
          {caps.map(([x, y, s, rot], i) => (
            <React.Fragment key={i}>
              <Cap x={x} y={y} s={s} rot={rot} fill={p.mid} tassel={p.accents[0]} />
            </React.Fragment>
          ))}
        </>
      )
    },
    mid: {
      shape: (
        <g fill={p.mid}>
          <path d={ground.d} />
          <Campus cx={800} base={base} />
        </g>
      ),
      lights: (
        <>
          <GlowDef id={glow} color={p.light} core={0.55} />
          <g transform={`translate(800 ${n(base)})`}>
            <circle cx={0} cy={-90} r={140} fill={`url(#${glow})`} />
            {/* Revak: sütunların arkasındaki aydınlık hol, sütunlar onun önünde. */}
            <rect x={-126} y={-168} width={252} height={150} fill={p.light} opacity={0.55} />
            {Array.from({ length: CAMPUS_COLS }, (_, i) => {
              const x = -110 + (220 / (CAMPUS_COLS - 1)) * i;
              return <rect key={i} x={x - 7} y={-170} width={14} height={152} fill={p.mid} />;
            })}
            <rect x={-130} y={-22} width={260} height={8} fill={p.mid} />
            {sideWindows.map(([x, y], i) =>
              lit(i) ? <path key={`s${i}`} d={arch(x - 7, y, 14, 34)} fill={p.light} /> : null
            )}
            {wingWindows.map(([x, y], i) =>
              lit(i + 3) ? <rect key={`w${i}`} x={x - 6} y={y} width={12} height={24} fill={p.light} opacity={0.9} /> : null
            )}
            <circle cx={0} cy={-290} r={22} fill={p.light} />
            <circle cx={0} cy={-290} r={22} fill="none" stroke={p.mid} strokeWidth={3} />
            <path d="M0 -290 L0 -304 M0 -290 L10 -284" stroke={p.mid} strokeWidth={2.5} strokeLinecap="round" />
            <path d={arch(-6, -240, 12, 30)} fill={p.light} opacity={0.85} />
          </g>
        </>
      )
    },
    near: {
      shape: (
        <g fill={p.near}>
          <path d={near.d} />
          <RoundTree x={470} base={near.yAt(470) + 6} h={290} r={62} />
          <RoundTree x={1130} base={near.yAt(1130) + 6} h={270} r={58} />
          <RoundTree x={290} base={near.yAt(290) + 6} h={320} r={70} />
          <RoundTree x={1310} base={near.yAt(1310) + 6} h={300} r={66} />
          {[612, 988].map((x) => (
            <g key={x}>
              <rect x={x - 3} y={436} width={6} height={160} />
              <path d={`M${x - 11} 436 L${x + 11} 436 L${x + 8} 414 L${x - 8} 414 Z`} />
              <path d={`M${x - 10} 414 L${x} 402 L${x + 10} 414 Z`} />
            </g>
          ))}
        </g>
      ),
      lights: (
        <>
          <GlowDef id={`${glow}-lamp`} color={p.light} />
          {[612, 988].map((x) => (
            <g key={x}>
              <circle cx={x} cy={426} r={46} fill={`url(#${glow}-lamp)`} />
              <rect x={x - 6} y={417} width={12} height={16} fill={p.light} />
            </g>
          ))}
        </>
      )
    }
  };
}

/* ————————————————— Baby shower · Bulutlar ————————————————— */

function CloudMass({ seed, baseY, count, rMin, rMax }: { seed: number; baseY: number; count: number; rMin: number; rMax: number }) {
  const random = rng(seed);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const r = rMin + random() * (rMax - rMin);
        const x = -60 + ((STRIP.w + 120) / (count - 1)) * i + (random() - 0.5) * 40;
        return <circle key={i} cx={n(x)} cy={n(baseY - r * 0.35 + random() * 10)} r={n(r)} />;
      })}
      <rect x={-80} y={baseY} width={STRIP.w + 160} height={STRIP.h - baseY + 10} />
    </>
  );
}

function bulut(p: UfukPalette, uid: string): UfukLayers {
  const glow = `${uid}-glow`;
  const soft = `${uid}-soft`;
  const accent = (i: number) => p.accents[i % p.accents.length];

  // Mobil: tepedeki askıdan sarkan yıldız, hilal, kalp ve bulut.
  const bar = catenary(560, 62, 1040, 62, -14);
  const hangers: Array<{ t: number; len: number; kind: 'star' | 'moon' | 'heart' | 'cloud' }> = [
    { t: 0.05, len: 92, kind: 'star' },
    { t: 0.27, len: 58, kind: 'moon' },
    { t: 0.5, len: 34, kind: 'heart' },
    { t: 0.73, len: 62, kind: 'cloud' },
    { t: 0.95, len: 96, kind: 'star' }
  ];
  const sideStars: Array<[number, number, number]> = [[300, 120, 16], [420, 70, 12], [1180, 80, 12], [1300, 130, 16]];

  const ornament = (kind: string, x: number, y: number, fill: string, key: React.Key) => {
    switch (kind) {
      case 'moon':
        return <path key={key} d={crescent(x, y + 20, 20)} fill={fill} />;
      case 'heart':
        return (
          <path
            key={key}
            d={`M${n(x)} ${n(y + 34)} C${n(x - 24)} ${n(y + 18)} ${n(x - 22)} ${n(y - 2)} ${n(x - 10)} ${n(y + 2)} C${n(x - 4)} ${n(y + 4)} ${n(x)} ${n(y + 10)} ${n(x)} ${n(y + 12)} C${n(x)} ${n(y + 10)} ${n(x + 4)} ${n(y + 4)} ${n(x + 10)} ${n(y + 2)} C${n(x + 22)} ${n(y - 2)} ${n(x + 24)} ${n(y + 18)} ${n(x)} ${n(y + 34)} Z`}
            fill={fill}
          />
        );
      case 'cloud':
        return (
          <g key={key} fill={fill}>
            <circle cx={x - 14} cy={y + 18} r={11} />
            <circle cx={x + 2} cy={y + 12} r={15} />
            <circle cx={x + 17} cy={y + 20} r={10} />
            <rect x={x - 25} y={y + 18} width={52} height={12} rx={6} />
          </g>
        );
      default:
        return <path key={key} d={star5(x, y + 20, 20)} fill={fill} />;
    }
  };

  return {
    far: {
      shape: (
        <>
          <defs>
            <filter id={soft} x="-10%" y="-30%" width="120%" height="160%">
              <feGaussianBlur stdDeviation={5} />
            </filter>
          </defs>
          <g fill={p.far} filter={`url(#${soft})`} opacity={0.75}>
            <CloudMass seed={71} baseY={470} count={22} rMin={30} rMax={62} />
          </g>
        </>
      )
    },
    mid: {
      shape: (
        <g fill={p.mid}>
          <CloudMass seed={72} baseY={528} count={16} rMin={44} rMax={86} />
        </g>
      ),
      lights: (
        <g fill={p.light}>
          {[[560, 470, 9], [700, 452, 6], [880, 446, 8], [1010, 468, 6], [380, 480, 7], [1230, 474, 8]].map(([x, y, r], i) => (
            <path key={i} d={sparkle(x, y, r)} opacity={0.9} />
          ))}
        </g>
      )
    },
    near: {
      shape: (
        <g fill={p.near}>
          <CloudMass seed={73} baseY={584} count={12} rMin={60} rMax={112} />
        </g>
      ),
      lights: (
        <g fill={p.light}>
          {[[640, 520, 7], [930, 512, 9], [470, 530, 6], [1120, 526, 7]].map(([x, y, r], i) => (
            <path key={i} d={sparkle(x, y, r)} opacity={0.85} />
          ))}
        </g>
      )
    },
    top: {
      shape: (
        <>
          <g fill="none" stroke={p.mid} strokeWidth={1.4} strokeOpacity={0.75}>
            <path d="M800 0 L800 48" />
            <path d={bar.d} strokeWidth={3} strokeOpacity={1} />
            {hangers.map((h, i) => {
              const [x, y] = bar.at(h.t);
              return <path key={i} d={`M${n(x)} ${n(y)} L${n(x)} ${n(y + h.len)}`} />;
            })}
            {sideStars.map(([x, len]) => (
              <path key={x} d={`M${x} 0 L${x} ${len}`} />
            ))}
          </g>
          {hangers.map((h, i) => {
            const [x, y] = bar.at(h.t);
            return ornament(h.kind, x, y + h.len, accent(i), i);
          })}
          {sideStars.map(([x, len, r], i) => (
            <path key={x} d={star5(x, len + r, r)} fill={accent(i + 2)} />
          ))}
        </>
      ),
      lights: (
        <>
          <GlowDef id={glow} color={p.light} core={0.55} />
          {hangers.map((h, i) => {
            const [x, y] = bar.at(h.t);
            return <circle key={i} cx={n(x)} cy={n(y + h.len + 20)} r={44} fill={`url(#${glow})`} />;
          })}
        </>
      )
    }
  };
}

/* ————————————————— Parti · Neon şehir ————————————————— */

type Roof = 'flat' | 'antenna' | 'step' | 'slant' | 'spire';

interface Building {
  x: number;
  w: number;
  h: number;
  roof: Roof;
}

/**
 * Ufuk çizgisi üreteci. Binalar soldan sağa dizilir; ortaya yaklaştıkça
 * yükselir ki silüet merkezde zirve yapsın (bkz. güvenli bölge).
 */
function skyline(seed: number, x0: number, x1: number, wMin: number, wMax: number, hMin: number, hMax: number): Building[] {
  const random = rng(seed);
  const roofs: Roof[] = ['flat', 'flat', 'antenna', 'step', 'slant', 'flat', 'spire'];
  const out: Building[] = [];
  let x = x0;
  while (x < x1) {
    const w = wMin + random() * (wMax - wMin);
    const center = 1 - Math.min(1, Math.abs(x + w / 2 - STRIP.w / 2) / (STRIP.w / 2));
    const h = hMin + random() * (hMax - hMin) * (0.45 + 0.55 * center);
    out.push({ x, w, h, roof: roofs[Math.floor(random() * roofs.length)] });
    x += w + (random() - 0.4) * 10;
  }
  return out;
}

function buildingPath(b: Building, base: number): string {
  const top = base - b.h;
  const body = `M${n(b.x)} ${n(base)} L${n(b.x)} ${n(top)} L${n(b.x + b.w)} ${n(top)} L${n(b.x + b.w)} ${n(base)} Z`;
  switch (b.roof) {
    case 'antenna':
      return `${body} M${n(b.x + b.w / 2 - 1.5)} ${n(top)} L${n(b.x + b.w / 2 - 1.5)} ${n(top - 46)} L${n(b.x + b.w / 2 + 1.5)} ${n(top - 46)} L${n(b.x + b.w / 2 + 1.5)} ${n(top)} Z`;
    case 'step':
      return `${body} M${n(b.x + b.w * 0.18)} ${n(top)} L${n(b.x + b.w * 0.18)} ${n(top - 18)} L${n(b.x + b.w * 0.82)} ${n(top - 18)} L${n(b.x + b.w * 0.82)} ${n(top)} Z M${n(b.x + b.w * 0.36)} ${n(top - 18)} L${n(b.x + b.w * 0.36)} ${n(top - 32)} L${n(b.x + b.w * 0.64)} ${n(top - 32)} L${n(b.x + b.w * 0.64)} ${n(top - 18)} Z`;
    case 'slant':
      return `${body} M${n(b.x)} ${n(top)} L${n(b.x + b.w)} ${n(top - b.w * 0.45)} L${n(b.x + b.w)} ${n(top)} Z`;
    case 'spire':
      return `${body} M${n(b.x + b.w * 0.3)} ${n(top)} L${n(b.x + b.w / 2)} ${n(top - 64)} L${n(b.x + b.w * 0.7)} ${n(top)} Z`;
    default:
      return body;
  }
}

/** Pencere ızgarası: yanan pencereler, çoğu sıcak, bazısı vurgu renginde. */
function Windows({
  buildings,
  base,
  seed,
  lit,
  light,
  accents,
  accentRatio,
  band = false
}: {
  buildings: Building[];
  base: number;
  seed: number;
  lit: number;
  light: string;
  accents: string[];
  accentRatio: number;
  /** Ofis kulesi: tek tek pencere yerine kat boyu bant camlar. */
  band?: boolean;
}) {
  const random = rng(seed);
  const cells: React.ReactNode[] = [];
  buildings.forEach((b, bi) => {
    const top = base - b.h;
    const cols = band ? 1 : Math.max(1, Math.floor((b.w - 10) / 12));
    const rows = Math.max(1, Math.floor((b.h - 18) / (band ? 13 : 16)));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (random() > lit) continue;
        const fill = random() < accentRatio ? accents[Math.floor(random() * accents.length)] : light;
        cells.push(
          band ? (
            <rect key={`${bi}-${r}`} x={n(b.x + 5)} y={n(top + 10 + r * 13)} width={n(b.w - 10)} height={4} fill={fill} opacity={0.75} />
          ) : (
            <rect key={`${bi}-${r}-${c}`} x={n(b.x + 7 + c * 12)} y={n(top + 10 + r * 16)} width={5} height={8} fill={fill} />
          )
        );
      }
    }
  });
  return <>{cells}</>;
}

/** Suya düşen ışık çizgileri: her binanın altında kırık yansımalar. */
function Reflections({ buildings, seed, top, light, accents }: { buildings: Building[]; seed: number; top: number; light: string; accents: string[] }) {
  const random = rng(seed);
  return (
    <>
      {buildings.flatMap((b, bi) =>
        Array.from({ length: 5 }, (_, k) => {
          const w = b.w * (0.2 + random() * 0.45);
          const x = b.x + b.w / 2 - w / 2 + (random() - 0.5) * 10;
          const fill = random() < 0.25 ? accents[Math.floor(random() * accents.length)] : light;
          return (
            <rect key={`${bi}-${k}`} x={n(x)} y={n(top + 6 + k * 9 + random() * 4)} width={n(w)} height={2} rx={1} fill={fill} opacity={n(0.18 + random() * 0.3)} />
          );
        })
      )}
    </>
  );
}

function neon(p: UfukPalette, uid: string): UfukLayers {
  const glow = `${uid}-glow`;
  const blur = `${uid}-neon`;
  const farBase = 478;
  const midBase = 542;
  const far = skyline(81, -40, 1640, 30, 72, 40, 140);
  const mid: Building[] = [
    ...skyline(82, -40, 740, 48, 108, 90, 300),
    { x: 762, w: 76, h: 370, roof: 'spire' },
    ...skyline(83, 852, 1660, 48, 108, 90, 300)
  ];
  // Telefonda görünen orta bölgedeki çatılar neonla çizilir.
  const neonRoofs = mid.filter((b) => b.x > 520 && b.x + b.w < 1090);

  return {
    far: {
      shape: (
        <g fill={p.far}>
          {far.map((b, i) => (
            <path key={i} d={buildingPath(b, farBase)} />
          ))}
          <rect x={-40} y={farBase - 2} width={1680} height={STRIP.h - farBase + 2} />
        </g>
      ),
      lights: (
        <Windows buildings={far} base={farBase} seed={84} lit={0.18} light={p.light} accents={p.accents} accentRatio={0.1} />
      )
    },
    mid: {
      shape: (
        <g fill={p.mid}>
          {mid.map((b, i) => (
            <path key={i} d={buildingPath(b, midBase)} />
          ))}
        </g>
      ),
      lights: (
        <>
          <defs>
            <filter id={blur} x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation={5} />
            </filter>
          </defs>
          <Windows buildings={mid} base={midBase} seed={85} lit={0.34} light={p.light} accents={p.accents} accentRatio={0.22} />
          {neonRoofs.map((b, i) => {
            const top = midBase - b.h;
            const d = `M${n(b.x)} ${n(top + 40)} L${n(b.x)} ${n(top)} L${n(b.x + b.w)} ${n(top)} L${n(b.x + b.w)} ${n(top + 40)}`;
            const color = p.accents[i % p.accents.length];
            return (
              <g key={i} fill="none" stroke={color} strokeLinecap="round">
                <path d={d} strokeWidth={8} opacity={0.6} filter={`url(#${blur})`} />
                <path d={d} strokeWidth={2.4} />
              </g>
            );
          })}
          <GlowDef id={glow} color={p.accents[0]} core={0.8} />
          <circle cx={800} cy={midBase - 370 - 64} r={26} fill={`url(#${glow})`} />
        </>
      )
    },
    near: {
      // Kıyı: su ve gezinti yolunun korkuluğu.
      shape: (
        <g fill={p.near}>
          <rect x={-20} y={midBase} width={1640} height={STRIP.h - midBase} opacity={0.82} />
          <rect x={-20} y={572} width={1640} height={4} />
          <rect x={-20} y={590} width={1640} height={12} />
          {Array.from({ length: 28 }, (_, i) => (
            <rect key={i} x={i * 60} y={572} width={4} height={22} />
          ))}
        </g>
      ),
      lights: <Reflections buildings={mid} seed={86} top={midBase} light={p.light} accents={p.accents} />
    }
  };
}

/* ————————————————— Kurumsal · Kuleler ve köprü ————————————————— */

function kule(p: UfukPalette, uid: string): UfukLayers {
  const glow = `${uid}-glow`;
  const mountains = ridge(91, 380, 110, 8);
  const farBase = 486;
  const midBase = 506;
  const far = skyline(92, -40, 1640, 28, 60, 30, 110);
  const towers: Building[] = [
    ...skyline(93, -40, 520, 46, 86, 80, 220),
    { x: 528, w: 70, h: 250, roof: 'slant' },
    { x: 606, w: 56, h: 320, roof: 'antenna' },
    { x: 670, w: 62, h: 214, roof: 'flat' },
    { x: 740, w: 82, h: 410, roof: 'step' },
    { x: 830, w: 66, h: 296, roof: 'slant' },
    { x: 904, w: 74, h: 350, roof: 'flat' },
    { x: 986, w: 60, h: 236, roof: 'antenna' },
    { x: 1054, w: 64, h: 280, roof: 'step' },
    ...skyline(94, 1126, 1660, 46, 86, 80, 220)
  ];

  const pylons = [600, 1000];

  return {
    far: {
      shape: (
        <g fill={p.far}>
          <path d={mountains.d} opacity={0.5} />
          {far.map((b, i) => (
            <path key={i} d={buildingPath(b, farBase)} />
          ))}
          <rect x={-40} y={farBase - 2} width={1680} height={STRIP.h - farBase + 2} />
        </g>
      )
    },
    mid: {
      shape: (
        <>
          <g fill={p.mid}>
            {towers.map((b, i) => (
              <path key={i} d={buildingPath(b, midBase)} />
            ))}
          </g>
          {/* Giydirme cephe: kulenin camını ele veren ince dikey hatlar. */}
          <g stroke={p.far} strokeOpacity={0.35} strokeWidth={1}>
            {towers
              .filter((b) => b.h > 200)
              .flatMap((b, bi) =>
                Array.from({ length: Math.floor(b.w / 12) }, (_, k) => (
                  <path key={`${bi}-${k}`} d={`M${n(b.x + 6 + k * 12)} ${n(midBase - b.h + 6)} L${n(b.x + 6 + k * 12)} ${midBase}`} />
                ))
              )}
          </g>
        </>
      ),
      lights: (
        <Windows buildings={towers} base={midBase} seed={95} lit={0.5} light={p.light} accents={p.accents} accentRatio={0.12} band />
      )
    },
    near: {
      // Eğik askılı köprü: kadrajı yatayda bağlayan tek çizgi.
      shape: (
        <g fill={p.near}>
          <rect x={-20} y={midBase + 10} width={1640} height={STRIP.h - midBase} opacity={0.85} />
          <rect x={-20} y={midBase - 6} width={1640} height={12} />
          <rect x={-20} y={midBase + 6} width={1640} height={5} opacity={0.7} />
          {pylons.map((x) => (
            <g key={x}>
              <path d={`M${x - 36} 604 L${x - 6} 318 L${x + 2} 318 L${x - 24} 604 Z`} />
              <path d={`M${x + 36} 604 L${x + 6} 318 L${x - 2} 318 L${x + 24} 604 Z`} />
              <rect x={x - 22} y={468} width={44} height={8} />
              <rect x={x - 9} y={306} width={18} height={14} />
            </g>
          ))}
          <g stroke={p.near} strokeWidth={1.6} strokeOpacity={0.85} fill="none">
            {pylons.flatMap((x) =>
              Array.from({ length: 7 }, (_, k) => (
                <React.Fragment key={`${x}-${k}`}>
                  <path d={`M${x} ${330 + k * 5} L${x - (k + 1) * 46} ${midBase - 6}`} />
                  <path d={`M${x} ${330 + k * 5} L${x + (k + 1) * 46} ${midBase - 6}`} />
                </React.Fragment>
              ))
            )}
          </g>
        </g>
      ),
      lights: (
        <>
          <GlowDef id={glow} color={p.light} />
          {Array.from({ length: 26 }, (_, i) => (
            <React.Fragment key={i}>
              <Bulb x={i * 64 + 8} y={midBase - 10} r={1.8} glow={glow} color={p.light} halo={5} />
            </React.Fragment>
          ))}
          {pylons.map((x) => (
            <circle key={x} cx={x} cy={304} r={3} fill={p.accents[0]} />
          ))}
          <Reflections buildings={towers.filter((b) => b.h > 200)} seed={96} top={midBase + 14} light={p.light} accents={p.accents} />
        </>
      )
    }
  };
}

/* ————————————————— katalog ————————————————— */

/**
 * Sahne türü → çizim. `uid` gradyan/filtre kimliklerini belge içinde tekil
 * kılar; aynı sayfada iki sahne olsa da birbirlerinin tanımlarını ezmezler.
 */
export const UFUK_ART: Record<UfukSceneKind, (palette: UfukPalette, uid: string) => UfukLayers> = {
  servi,
  fener,
  bahce,
  saray,
  balon,
  kampus,
  bulut,
  neon,
  kule
};
