import React, { useId, useMemo } from 'react';
import { motion, useReducedMotion, useTransform, type MotionValue } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { KINA_FLAVOR } from '../flavors';

type Mode = 'preview' | 'live';

const GOLD = '#D9AE5F';
const HENNA = '#5A2210';
const GLOW = '[text-shadow:0_0_22px_rgba(217,174,95,0.35)]';

const MEHNDI_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#2A140B] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-medium',
  page: 'text-[#F6E7CF]',
  surface: 'bg-[#3A1E12]/80 backdrop-blur-md shadow-[0_0_40px_-18px_rgba(217,174,95,0.45)]',
  border: 'border-[#D9AE5F]/25',
  heading: 'text-[#FBEFD9]',
  body: 'text-[#DCC7AA]',
  accent: 'text-[#E6C27A]',
  accentBg: 'bg-[#D9AE5F]',
  accentSoft: 'bg-[#D9AE5F]/10',
  input:
    'w-full bg-[#2A140B]/70 border border-[#D9AE5F]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#FBEFD9] placeholder:text-[#A88F72] focus:outline-none focus:border-[#E6C27A] focus:ring-2 focus:ring-[#D9AE5F]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#F0CF8A,#C8923F)] hover:brightness-110 text-[#2A140B] shadow-lg shadow-[#C8923F]/30',
  buttonGhost: 'border border-[#D9AE5F]/40 text-[#F6E7CF] hover:bg-[#D9AE5F]/10',
  divider: 'bg-[#D9AE5F]/20',
  timelineLine: 'from-[#D9AE5F]/80 via-[#D9AE5F]/35 to-transparent',
  envelope: {
    paper: 'bg-[#3A1E12]',
    flap: 'bg-[#4A2717]',
    seal: 'bg-[#D9AE5F] text-[#2A140B]',
    glow: 'bg-[#D9AE5F]/30',
    card: 'bg-[#FBF1E0] border border-[#D9AE5F]/40'
  },
  mapHeader: 'bg-[#3A1E12]',
  footer: { names: 'text-[#DCC7AA]', branding: 'text-[#A88F72]' }
};

const MEHNDI_FLAVOR: TemplateFlavor = {
  ...KINA_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Kınamız Yakılıyor',
  headings: { ...KINA_FLAVOR.headings, timeline: 'Gecenin Deseni', gallery: 'Kınalı Anlar', rsvp: 'Bize Haber Verin' }
};

/* ------------------------------------------------------------------ */
/* Desen geometrisi — saf fonksiyonlar, hepsi 200×300 viewBox içinde.   */
/* ------------------------------------------------------------------ */

type Pt = readonly [number, number];
interface Stroke {
  d: string;
  /** Çizgi kalınlığı (viewBox birimi). */
  w: number;
  /** Kapalı küçük şekillerde hafif dolgu. */
  fill?: boolean;
}

const f = (n: number) => n.toFixed(1);

/** Avuç içi + parmaklar: tek açık kontur (bilekte açık). */
const HAND =
  'M72 295 C70 270 64 250 58 232 C48 214 30 196 22 176 C16 162 26 154 36 162 C46 172 56 186 64 192 ' +
  'C64 170 62 140 60 108 C59 94 76 92 78 106 C80 130 82 150 84 158 ' +
  'C84 130 84 90 86 70 C87 56 106 56 107 70 C108 90 108 130 108 156 ' +
  'C110 132 114 100 116 84 C118 70 136 72 135 86 C134 108 130 138 128 162 ' +
  'C132 144 140 124 144 112 C148 100 164 104 160 118 C154 142 148 170 144 196 ' +
  'C140 224 134 252 130 295';

/** Parmak eksenleri: [kök, uç, yarı genişlik]. */
const FINGERS: ReadonlyArray<readonly [Pt, Pt, number]> = [
  [[56, 194], [30, 168], 6],
  [[71, 166], [69, 106], 7],
  [[97, 158], [97, 70], 8],
  [[123, 160], [126, 86], 7],
  [[146, 178], [152, 116], 6]
];

/** Parmağa enine kemer bantları + aralarda zikzak, uca doğru. */
function fingerStrokes([a, b, w]: readonly [Pt, Pt, number]): Stroke[] {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const at = (t: number, s: number, lift = 0): string =>
    `${f(a[0] + dx * t + nx * s + ux * lift)} ${f(a[1] + dy * t + ny * s + uy * lift)}`;
  const band = (t: number, k: number) => `M${at(t, -w * k)} Q${at(t, 0, 5)} ${at(t, w * k)}`;
  const zig = (t0: number, t1: number) => {
    const n = 4;
    let d = `M${at(t0, -w * 0.7)}`;
    for (let i = 1; i <= n; i++) d += ` L${at(t0 + ((t1 - t0) * i) / n, (i % 2 ? 1 : -1) * w * 0.7)}`;
    return d;
  };
  return [
    { d: band(0.12, 0.95), w: 0.9 },
    { d: band(0.2, 0.95), w: 0.6 },
    { d: zig(0.24, 0.44), w: 0.6 },
    { d: band(0.48, 0.92), w: 0.9 },
    { d: `M${at(0.56, 0)} L${at(0.7, 0)}`, w: 0.6 }
  ];
}

/** Badem yaprak, (x,y)'den açı yönünde. */
function leaf(x: number, y: number, deg: number, len: number): Stroke {
  const r = (deg * Math.PI) / 180;
  const ux = Math.cos(r);
  const uy = Math.sin(r);
  const p = (t: number, s: number) => `${f(x + ux * len * t - uy * s)} ${f(y + uy * len * t + ux * s)}`;
  const w = len * 0.38;
  return { d: `M${p(0, 0)} C${p(0.3, -w)} ${p(0.75, -w)} ${p(1, 0)} C${p(0.75, w)} ${p(0.3, w)} ${p(0, 0)} M${p(0.1, 0)} L${p(0.8, 0)}`, w: 0.55, fill: true };
}

/** Beş/sekiz yapraklı çiçek. */
function flower(cx: number, cy: number, r: number, petals: number): Stroke[] {
  const out: Stroke[] = [{ d: `M${f(cx - r * 0.28)} ${f(cy)} a${f(r * 0.28)} ${f(r * 0.28)} 0 1 0 ${f(r * 0.56)} 0 a${f(r * 0.28)} ${f(r * 0.28)} 0 1 0 ${f(-r * 0.56)} 0`, w: 0.7, fill: true }];
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2 - Math.PI / 2;
    const s = Math.PI / petals;
    const p = (ang: number, rad: number) => `${f(cx + Math.cos(ang) * rad)} ${f(cy + Math.sin(ang) * rad)}`;
    out.push({ d: `M${p(a - s * 0.6, r * 0.32)} Q${p(a - s * 0.75, r * 0.95)} ${p(a, r)} Q${p(a + s * 0.75, r * 0.95)} ${p(a + s * 0.6, r * 0.32)}`, w: 0.7 });
  }
  return out;
}

function circle(cx: number, cy: number, r: number, w: number): Stroke {
  return { d: `M${f(cx - r)} ${f(cy)} a${f(r)} ${f(r)} 0 1 0 ${f(r * 2)} 0 a${f(r)} ${f(r)} 0 1 0 ${f(-r * 2)} 0`, w };
}

/** Avuç ortasındaki mandala. */
function mandala(cx: number, cy: number): Stroke[] {
  const out: Stroke[] = [...flower(cx, cy, 13, 8), circle(cx, cy, 17, 0.8), circle(cx, cy, 19.5, 0.5)];
  // Dış taç: 12 küçük kemer.
  const n = 12;
  let d = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    const am = (a0 + a1) / 2;
    const r0 = 19.5;
    if (i === 0) d += `M${f(cx + Math.cos(a0) * r0)} ${f(cy + Math.sin(a0) * r0)}`;
    d += ` Q${f(cx + Math.cos(am) * 29)} ${f(cy + Math.sin(am) * 29)} ${f(cx + Math.cos(a1) * r0)} ${f(cy + Math.sin(a1) * r0)}`;
  }
  out.push({ d, w: 0.8 });
  return out;
}

interface Dot {
  cx: number;
  cy: number;
  r: number;
}

/** Mandala tacının dışındaki nokta halkası + bilek nokta sırası. */
const DOTS: Dot[] = [
  ...Array.from({ length: 12 }, (_, i) => {
    const a = ((i + 0.5) / 12) * Math.PI * 2;
    return { cx: 100 + Math.cos(a) * 32, cy: 214 + Math.sin(a) * 32, r: 1.1 };
  }),
  ...Array.from({ length: 9 }, (_, i) => ({ cx: 78 + i * 6, cy: 283 + Math.sin((i / 8) * Math.PI) * 2.5, r: 0.9 }))
];

/** Parmak uçlarındaki koyu kına başlıkları (dolu). */
const CAPS: ReadonlyArray<{ cx: number; cy: number; rx: number; ry: number; rot: number }> = [
  { cx: 27, cy: 165, rx: 7, ry: 8, rot: -45 },
  { cx: 69, cy: 103, rx: 8, ry: 8, rot: 0 },
  { cx: 96.5, cy: 66, rx: 9, ry: 9, rot: 0 },
  { cx: 125.5, cy: 83, rx: 8.5, ry: 8.5, rot: 4 },
  { cx: 153, cy: 112, rx: 7, ry: 7, rot: 12 }
];

/** Çizim sırası: mandala → sarmaşık & çiçekler → parmaklar → bilek. */
function buildStrokes(): Stroke[] {
  const vine: Stroke[] = [
    { d: 'M100 186 C88 182 80 190 74 200 C70 208 72 218 66 226', w: 0.9 },
    { d: 'M100 186 C112 182 122 188 128 198 C134 208 132 220 136 230', w: 0.9 },
    leaf(80, 190, 200, 9),
    leaf(72, 212, 160, 8),
    leaf(122, 188, -20, 9),
    leaf(131, 212, 20, 8),
    leaf(70, 224, 230, 7),
    leaf(134, 226, -50, 7)
  ];
  const wrist: Stroke[] = [
    { d: 'M71 262 Q100 270 132 262', w: 1 },
    { d: 'M71 274 Q100 282 132 274', w: 1 },
    {
      d: Array.from({ length: 8 }, (_, i) => {
        const x = 73 + i * 7.3;
        const y = 265 + Math.sin(((i + 0.5) / 8) * Math.PI) * 3.5;
        return `${i === 0 ? 'M' : ''}${f(x)} ${f(y)} q3.65 5 7.3 0`;
      }).join(' '),
      w: 0.6
    }
  ];
  return [
    ...mandala(100, 214),
    ...flower(100, 176, 8, 5),
    ...vine,
    ...flower(76, 246, 6, 5),
    ...flower(126, 246, 6, 5),
    ...FINGERS.flatMap(fingerStrokes),
    ...wrist
  ];
}

/* ------------------------------------------------------------------ */

function MehndiHand({ still }: { still: boolean }) {
  const strokes = useMemo(buildStrokes, []);
  // Aynı belgede birden çok davetiye çizilirse gradyan kimlikleri çakışmasın.
  const gradId = `mehndi-ten-${useId().replace(/:/g, '')}`;
  const STEP = 0.07;
  const START = 1.1;
  const strokeDur = 0.9;
  const endOfStrokes = START + strokes.length * STEP;
  const draw = (delay: number, dur = strokeDur) =>
    still
      ? { initial: false as const }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { pathLength: { duration: dur, delay, ease: 'easeInOut' as const }, opacity: { duration: 0.15, delay } }
        };
  const pop = (delay: number) =>
    still
      ? { initial: false as const }
      : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay } };

  return (
    <svg viewBox="0 0 200 300" className="w-[min(62vw,250px)] h-auto drop-shadow-[0_0_30px_rgba(217,174,95,0.18)]" role="img" aria-label="Kına deseniyle süslenmiş el">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4DDB8" />
          <stop offset="1" stopColor="#DDB083" />
        </linearGradient>
      </defs>
      {/* Ten: önce yumuşakça belirir */}
      <motion.path d={`${HAND} Z`} fill={`url(#${gradId})`} {...pop(0.2)} />
      {/* Altın kontur */}
      <motion.path d={HAND} fill="none" stroke={GOLD} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" {...draw(0.1, 1.6)} />
      {/* Kına çizgileri */}
      <g stroke={HENNA} strokeLinecap="round" strokeLinejoin="round">
        {strokes.map((s, i) => (
          <motion.path key={i} d={s.d} strokeWidth={s.w} fill={s.fill ? HENNA : 'none'} fillOpacity={s.fill ? 0.18 : undefined} {...draw(START + i * STEP)} />
        ))}
      </g>
      <g fill={HENNA}>
        {DOTS.map((p, i) => (
          <motion.circle key={i} cx={p.cx} cy={p.cy} r={p.r} {...pop(START + 0.9 + i * 0.03)} />
        ))}
        {CAPS.map((c, i) => (
          <motion.ellipse
            key={i}
            cx={c.cx}
            cy={c.cy}
            rx={c.rx}
            ry={c.ry}
            transform={`rotate(${c.rot} ${c.cx} ${c.cy})`}
            fillOpacity={0.88}
            {...pop(endOfStrokes + i * 0.12)}
          />
        ))}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Arka plan: kenarlarda kaydırdıkça uzayan sarmaşıklar.                */
/* ------------------------------------------------------------------ */

const SIDE_VINE = (() => {
  let d = 'M20 0';
  for (let y = 0; y < 800; y += 50) d += ` C${y % 100 ? 6 : 34} ${y + 16} ${y % 100 ? 6 : 34} ${y + 34} 20 ${y + 50}`;
  return d;
})();

const SIDE_LEAVES: Stroke[] = Array.from({ length: 15 }, (_, i) => {
  const y = 25 + i * 50;
  const right = i % 2 === 0;
  return leaf(right ? 30 : 10, y, right ? -35 : 215, 10);
});

function SideLeaf({ s, at, progress, still }: { s: Stroke; at: number; progress: MotionValue<number>; still: boolean }) {
  const opacity = useTransform(progress, [Math.max(0, at - 0.06), at], [0, 1]);
  return <motion.path d={s.d} strokeWidth={0.8} fill={GOLD} fillOpacity={0.15} style={still ? undefined : { opacity }} vectorEffect="non-scaling-stroke" />;
}

function SideVine({ progress, still, flip }: { progress: MotionValue<number>; still: boolean; flip?: boolean }) {
  const len = useTransform(progress, [0, 0.95], [0.06, 1]);
  return (
    <svg
      viewBox="0 0 40 800"
      preserveAspectRatio="none"
      className={`absolute top-0 h-full w-8 sm:w-10 opacity-60 ${flip ? 'right-1 -scale-x-100' : 'left-1'}`}
      aria-hidden="true"
    >
      <g stroke={GOLD} fill="none" strokeLinecap="round">
        <motion.path d={SIDE_VINE} strokeWidth={1} vectorEffect="non-scaling-stroke" style={still ? undefined : { pathLength: len }} />
        {SIDE_LEAVES.map((s, i) => (
          <SideLeaf key={i} s={s} at={(i + 1) / (SIDE_LEAVES.length + 1)} progress={progress} still={still} />
        ))}
      </g>
    </svg>
  );
}

function MehndiBackdrop({ progress, mode }: BackdropState & { mode: Mode }) {
  const reduced = useReducedMotion() ?? false;
  const still = reduced || mode === 'preview';
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(120%_70%_at_50%_22%,#4A2717_0%,#3A1E12_45%,#24110A_100%)]">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#D9AE5F_0.6px,transparent_1px)] bg-[size:38px_38px]" />
      <SideVine progress={progress} still={still} />
      <SideVine progress={progress} still={still} flip />
    </div>
  );
}

function MehndiHero({ invitation, mode }: HeroRenderProps & { mode: Mode }) {
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const still = reduced || mode === 'preview';
  const rise = (delay: number) =>
    still
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] as const }
        };
  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-6 pt-12 pb-24 text-center">
      <motion.p {...rise(0.2)} className="text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#E6C27A]">
        {d.title || MEHNDI_FLAVOR.tagline}
      </motion.p>
      <div className="mt-5">
        <MehndiHand still={still} />
      </div>
      <h1 className={`mt-6 font-cormorant italic font-medium leading-[0.98] text-[#FBEFD9] text-[clamp(2.5rem,12cqw,5rem)] break-words max-w-full ${GLOW}`}>
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && (
                <motion.span {...rise(1.6)} className="block my-1 text-[0.45em] not-italic text-[#E6C27A]">
                  &amp;
                </motion.span>
              )}
              <motion.span {...rise(1.3 + i * 0.5)} className="block">
                {p}
              </motion.span>
            </React.Fragment>
          ))
        ) : (
          <motion.span {...rise(1.3)} className="block">
            {NO_NAMES}
          </motion.span>
        )}
      </h1>
      {d.date.day && (
        <motion.p {...rise(2.1)} className="mt-6 font-cormorant text-2xl text-[#FBEFD9]">
          {d.date.weekday && <span className="block text-[11px] tracking-[0.35em] uppercase text-[#DCC7AA] mb-1">{d.date.weekday}</span>}
          {d.date.day}
          {d.date.time && ` · ${d.date.time}`}
        </motion.p>
      )}
      {d.venue && (
        <motion.p {...rise(2.3)} className="mt-2 text-sm text-[#DCC7AA]">
          {d.venue}
        </motion.p>
      )}
      <motion.div {...rise(2.6)} className="mt-7">
        <HeroCountdown invitation={invitation} numberClassName="font-cormorant text-[#F0CF8A]" labelClassName="text-[#B9A285]" />
      </motion.div>
      {d.subtitle && (
        <motion.p {...rise(2.9)} className="mt-7 max-w-md font-cormorant italic text-lg text-[#EADBC4]">
          {d.subtitle}
        </motion.p>
      )}
    </div>
  );
}

/**
 * KinaMehndi — "Kına Deseni": açık tenli bir avuç üzerine kına desenleri
 * (mandala, sarmaşık, çiçek, parmak bantları, bilek bileziği) SVG `pathLength`
 * ile tek tek kendini çizer; parmak uçları en son koyulaşır. Arka planda iki
 * altın sarmaşık kaydırma ilerlemesiyle uzar. Önizlemede ve azaltılmış
 * harekette her şey baştan çizili gelir.
 */
export function KinaMehndi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MEHNDI_FLAVOR}
      mode={mode}
      themeOverride={MEHNDI_TEMASI}
      renderBackdrop={(state) => <MehndiBackdrop {...state} mode={mode} />}
      renderHero={(props) => <MehndiHero {...props} mode={mode} />}
    />
  );
}
