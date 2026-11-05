import React from 'react';
import { motion, useReducedMotion, useTransform, type MotionValue } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';

type Mode = 'preview' | 'live';
type Pt = readonly [number, number];
type Tri = readonly [Pt, Pt, Pt];

/* ——— Renkler: washi kâğıdı, sumi mürekkebi, tek vermilyon vurgu ——— */
const WASHI = '#F4EFE5';
const SUMI = '#1F1C19';

/** Washi dokusu: feTurbulence gürültüsü (data URI) + yatay lif çizgileri. */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.3 0 0 0 0 0.24 0 0 0 0.22 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const WASHI_BG = `${NOISE}, repeating-linear-gradient(176deg, rgba(120,100,70,0.05) 0 1px, transparent 1px 9px), repeating-linear-gradient(92deg, rgba(255,255,255,0.35) 0 2px, transparent 2px 23px), radial-gradient(120% 80% at 50% 0%, #FBF8F1 0%, ${WASHI} 55%, #E9E1D2 100%)`;

const TURNA_TEMASI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#F4EFE5] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-medium',
  page: 'text-[#1F1C19]',
  surface: 'bg-[#FBF8F2]/85 backdrop-blur-sm shadow-[0_18px_40px_-28px_rgba(31,28,25,0.45)]',
  border: 'border-[#1F1C19]/12',
  heading: 'text-[#1F1C19]',
  body: 'text-[#4A443D]',
  accent: 'text-[#B8321C]',
  accentBg: 'bg-[#B8321C]',
  accentSoft: 'bg-[#B8321C]/8',
  input:
    'w-full bg-[#FFFDF8] border border-[#1F1C19]/20 rounded-md px-3.5 py-2.5 text-sm text-[#1F1C19] placeholder:text-[#7A7268] focus:outline-none focus:border-[#B8321C] focus:ring-2 focus:ring-[#B8321C]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#B8321C] hover:bg-[#9E2A16] text-[#FFF8EE] shadow-md shadow-[#B8321C]/25',
  buttonGhost: 'border border-[#1F1C19]/25 text-[#1F1C19] hover:bg-[#1F1C19]/5',
  divider: 'bg-[#1F1C19]/12',
  timelineLine: 'from-[#1F1C19]/60 via-[#1F1C19]/25 to-transparent',
  envelope: {
    paper: 'bg-[#EFE8DB]',
    flap: 'bg-[#E6DDCC]',
    seal: 'bg-[#B8321C] text-[#FFF8EE]',
    glow: 'bg-[#B8321C]/15',
    card: 'bg-[#FFFDF8] border border-[#1F1C19]/10'
  },
  mapHeader: 'bg-[#E6DDCC]',
  sectionMotion: { duration: 1.1, distance: 18 },
  footer: { names: 'text-[#4A443D]', branding: 'text-[#6B635A]' }
};

const TURNA_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Bin turna katladık, tek bir dilek için',
  headings: { timeline: 'Günün Akışı', details: 'Buluşma Yeri', gallery: 'Kâğıttaki Anlar', gift: 'Takı & Hediye', rsvp: 'Katılımınızı Bildirin' }
};

/* ——— Katlama geometrisi ———
 * Sekiz üçgen panel (yüzde koordinatlı clip-path). Dört durum arasında
 * köşe noktaları biçim değiştirir; her geçişin ortasında panel rotateX/Y ile
 * kalkıp geri yatar — perspektif içinde bu, kâğıdın katlanışı gibi okunur.
 *   S0 kare yaprak → S1 köşegenden katlanmış üçgen → S2 kare taban → S3 turna
 */
const C: Pt = [50, 50];
const TL: Pt = [4, 4], TM: Pt = [50, 4], TR: Pt = [96, 4], RM: Pt = [96, 50];
const BR: Pt = [96, 96], BM: Pt = [50, 96], BL: Pt = [4, 96], LM: Pt = [4, 50];

/** Köşegen (TR–BL) boyunca katlama: sol üst yarı sağ alta yansır. */
const fold = (p: Pt): Pt => (p[0] + p[1] >= 100 ? p : [100 - p[1], 100 - p[0]]);
const S0: Tri[] = [[C, TL, TM], [C, TM, TR], [C, TR, RM], [C, RM, BR], [C, BR, BM], [C, BM, BL], [C, BL, LM], [C, LM, TL]];
const S1: Tri[] = S0.map((t) => [fold(t[0]), fold(t[1]), fold(t[2])] as const);
const DT: Pt = [50, 14], DL: Pt = [26, 52], DR: Pt = [74, 52], DB: Pt = [50, 90], DC: Pt = [50, 52];
const S2: Tri[] = [[DC, DT, DL], [DC, DT, DR], [DC, DR, DB], [DC, DB, DL], [DC, DL, DT], [DC, DR, DT], [DC, DB, DR], [DC, DL, DB]];
const S3: Tri[] = [
  [[44, 57], [62, 8], [58, 59]], // arka kanat
  [[36, 60], [16, 14], [60, 61]], // ön kanat
  [[33, 60], [67, 60], [50, 50]], // gövde üstü
  [[33, 60], [67, 60], [50, 75]], // gövde altı
  [[58, 63], [67, 57], [88, 26]], // boyun
  [[84, 24], [90, 28], [97, 37]], // baş
  [[42, 63], [34, 57], [7, 33]], // kuyruk
  [[37, 61], [47, 67], [10, 36]] // kuyruk iç yüzü
];
const STATES = [S0, S1, S2, S3];

/** Her panelin iki yüzü yerine tonla verilen faset gölgesi. */
const SHADES = ['#FFFDF8', '#EFE7D8', '#F7F1E6', '#DDD2BF', '#E8DFCF', '#B8321C', '#F2EBDD', '#D6CAB4'];
/** Geçiş ortasında panelin kalkış ekseni: [rotateX, rotateY]. */
const LIFT: Array<readonly [number, number]> = [
  [62, -20], [-55, 30], [40, 60], [-48, -35], [58, 25], [-40, -55], [50, 40], [-60, 15]
];

const mid = (p: Pt, q: Pt): Pt => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const lerp = (a: Tri, b: Tri): Tri => [mid(a[0], b[0]), mid(a[1], b[1]), mid(a[2], b[2])];
const poly = (t: Tri) => `polygon(${t.map(([x, y]) => `${x}% ${y}%`).join(', ')})`;

/** Kare ve durak kare dizisi: S0, S0, M01, S1, S1, M12, S2, S2, M23, S3 */
const TIMES = [0, 0.1, 0.17, 0.26, 0.38, 0.46, 0.56, 0.68, 0.8, 1];
function panelKeyframes(i: number) {
  const clip: string[] = [];
  const rx: number[] = [];
  const ry: number[] = [];
  for (let k = 0; k < 3; k++) {
    const a = STATES[k][i];
    const b = STATES[k + 1][i];
    clip.push(poly(a), poly(a), poly(lerp(a, b)));
    rx.push(0, 0, LIFT[i][0] * (k % 2 ? -1 : 1));
    ry.push(0, 0, LIFT[i][1]);
  }
  clip.push(poly(S3[i]));
  rx.push(0);
  ry.push(0);
  return { clip, rx, ry };
}
const FINAL_CLIPS = S3.map(poly);
const KEYFRAMES = S3.map((_, i) => panelKeyframes(i));

/** Kâğıt turna: animasyonlu ise kareden katlanır, değilse hazır katlı durur. */
function KatlananTurna({ animate }: { animate: boolean }) {
  return (
    <div className="relative mx-auto w-[min(62vw,240px)] aspect-square [filter:drop-shadow(0_14px_14px_rgba(31,28,25,0.18))]" aria-hidden="true">
      <motion.div
        className="absolute inset-0 [perspective:700px]"
        {...(animate
          ? {
              animate: { rotateZ: [0, 0, -8, -8, 0] },
              transition: { duration: 5.2, delay: 0.6, times: [0, 0.3, 0.5, 0.75, 1], ease: 'easeInOut' }
            }
          : {})}
      >
        <motion.div
          className="absolute inset-0 [transform-style:preserve-3d]"
          {...(animate
            ? {
                animate: { rotateY: [0, -14, 10, -14] },
                transition: { duration: 7, delay: 6, repeat: Infinity, repeatType: 'mirror' as const, ease: 'easeInOut' }
              }
            : {})}
        >
          {KEYFRAMES.map((kf, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{
                background: `linear-gradient(${135 + i * 25}deg, ${SHADES[i]} 0%, ${i === 5 ? '#8F2412' : '#E4DACA'} 140%)`,
                backfaceVisibility: 'visible',
                clipPath: animate ? kf.clip[0] : FINAL_CLIPS[i],
                zIndex: i === 0 ? 0 : i
              }}
              {...(animate
                ? {
                    animate: { clipPath: kf.clip, rotateX: kf.rx, rotateY: kf.ry },
                    transition: { duration: 5.2, delay: 0.6, times: TIMES, ease: 'easeInOut' }
                  }
                : {})}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Uçuşan küçük turna silueti (sumi mürekkebi). */
function TurnaSilueti({ flap, className }: { flap: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 48 28" className={className} aria-hidden="true">
      <motion.g
        style={{ originX: '24px', originY: '17px' }}
        {...(flap ? { animate: { scaleY: [1, -0.4, 1] }, transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } } : {})}
      >
        <path d="M22 17 L30 2 L28 18 Z" fill={SUMI} fillOpacity="0.55" />
        <path d="M20 18 L12 3 L30 18 Z" fill={SUMI} fillOpacity="0.8" />
      </motion.g>
      <path d="M16 18 L32 18 L24 22 Z M30 19 L34 17 L44 7 L45 9 Z M18 19 L15 17 L3 11 Z" fill={SUMI} fillOpacity="0.85" />
    </svg>
  );
}

const SURU: Array<{ top: number; size: number; speed: number; lag: number; phase: number }> = [
  { top: 18, size: 34, speed: 1, lag: 0, phase: 0 },
  { top: 26, size: 24, speed: 0.85, lag: 0.04, phase: 1.3 },
  { top: 12, size: 20, speed: 0.9, lag: 0.08, phase: 2.1 },
  { top: 34, size: 28, speed: 1.1, lag: 0.12, phase: 0.6 },
  { top: 22, size: 16, speed: 0.75, lag: 0.16, phase: 2.8 },
  { top: 40, size: 18, speed: 0.95, lag: 0.2, phase: 1.9 }
];

/** Bölümler açıldıkça (scroll) ekranı soldan sağa geçen tek turna. */
function UcanTurna({ progress, heroExit, top, size, speed, lag, phase }: (typeof SURU)[number] & { progress: MotionValue<number>; heroExit: MotionValue<number> }) {
  const left = useTransform(progress, (v) => `${-15 + Math.max(0, v - lag) * 150 * speed}%`);
  const y = useTransform(progress, (v) => Math.sin(v * 14 + phase) * 10);
  const opacity = useTransform(heroExit, [0.05, 0.45], [0, 1]);
  return (
    <motion.div className="absolute" style={{ left, top: `${top}%`, y, opacity, width: size }}>
      <TurnaSilueti flap className="w-full h-auto" />
    </motion.div>
  );
}

function TurnaBackdrop({ heroExit, progress, still }: BackdropState & { still: boolean }) {
  const sunY = useTransform(heroExit, [0, 1], ['0%', '-40%']);
  const hillY = useTransform(heroExit, [0, 1], ['0%', '35%']);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundImage: WASHI_BG }}>
      {/* Vermilyon güneş — soluk, kâğıda emilmiş mürekkep gibi */}
      <motion.div
        style={still ? undefined : { y: sunY }}
        className="absolute right-[-12%] top-[8%] w-[46%] aspect-square rounded-full bg-[radial-gradient(circle,rgba(184,50,28,0.16)_0%,rgba(184,50,28,0.10)_58%,transparent_70%)]"
      />
      {/* Sumi fırça dağları */}
      <motion.svg style={still ? undefined : { y: hillY }} viewBox="0 0 400 90" preserveAspectRatio="none" className="absolute bottom-0 inset-x-0 w-full h-[14%]" aria-hidden="true">
        <path d="M0 70 C 40 50, 70 58, 110 40 C 150 24, 180 52, 220 46 C 270 38, 300 18, 340 34 C 370 46, 390 40, 400 44 V 90 H 0 Z" fill={SUMI} fillOpacity="0.07" />
        <path d="M0 80 C 60 66, 120 76, 180 64 C 240 54, 300 74, 400 62 V 90 H 0 Z" fill={SUMI} fillOpacity="0.1" />
      </motion.svg>
      {still ? (
        // Hareketsiz: sürü, gökte asılı bir an olarak yerinde durur.
        <div className="absolute inset-0 opacity-40">
          {SURU.slice(0, 3).map((t, i) => (
            <div key={i} className="absolute" style={{ left: `${12 + i * 26}%`, top: `${t.top + 50}%`, width: t.size }}>
              <TurnaSilueti flap={false} className="w-full h-auto" />
            </div>
          ))}
        </div>
      ) : (
        SURU.map((t, i) => <UcanTurna key={i} {...t} progress={progress} heroExit={heroExit} />)
      )}
    </div>
  );
}

/** Hanko mührü: çiftin baş harfleri, vermilyon kare. */
function Hanko({ text }: { text: string }) {
  return (
    <div
      className="inline-flex items-center justify-center w-12 h-12 rounded-[6px] border-2 border-[#FFF8EE]/40 bg-[#B8321C] text-[#FFF8EE] font-cormorant text-lg font-semibold tracking-wider rotate-[-4deg] shadow-[inset_0_0_0_3px_#B8321C,inset_0_0_0_4px_rgba(255,248,238,0.6)]"
      aria-hidden="true"
    >
      {text}
    </div>
  );
}

function TurnaHero({ invitation, mode }: HeroRenderProps & { mode: Mode }) {
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const animate = mode === 'live' && !reduced;
  const initials = d.people.map((p) => p.trim().charAt(0).toLocaleUpperCase('tr-TR')).join('·');
  const rise = (delay: number) =>
    animate
      ? {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] as const }
        }
      : { initial: false as const };
  const t0 = animate ? 5.4 : 0;
  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-6 pt-14 pb-24 text-center">
      <KatlananTurna animate={animate} />
      <motion.p {...rise(t0)} className="mt-6 text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#B8321C]">
        {d.title || TURNA_FLAVOR.tagline}
      </motion.p>
      <h1 className="mt-5 font-cormorant font-medium leading-[1.02] text-[#1F1C19] text-[clamp(2.5rem,12cqw,5rem)] break-words max-w-full">
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && (
                <motion.span {...rise(t0 + 0.3)} className="block my-1 text-[0.4em] italic text-[#B8321C]">
                  &amp;
                </motion.span>
              )}
              <motion.span {...rise(t0 + 0.2 + i * 0.35)} className="block">
                {p}
              </motion.span>
            </React.Fragment>
          ))
        ) : (
          <motion.span {...rise(t0 + 0.2)} className="block">
            {NO_NAMES}
          </motion.span>
        )}
      </h1>
      <motion.div {...rise(t0 + 0.8)} className="mt-6 flex items-center gap-4">
        <span className="h-px w-10 bg-[#1F1C19]/25" />
        {initials ? <Hanko text={initials} /> : <span className="w-2 h-2 rounded-full bg-[#B8321C]" />}
        <span className="h-px w-10 bg-[#1F1C19]/25" />
      </motion.div>
      {d.date.day && (
        <motion.p {...rise(t0 + 1)} className="mt-6 font-cormorant text-2xl text-[#1F1C19]">
          {d.date.weekday && <span className="block text-[11px] tracking-[0.32em] uppercase text-[#4A443D] mb-1">{d.date.weekday}</span>}
          {d.date.day}
          {d.date.time && ` · ${d.date.time}`}
        </motion.p>
      )}
      {d.venue && (
        <motion.p {...rise(t0 + 1.1)} className="mt-2 text-sm text-[#4A443D]">
          {d.venue}
        </motion.p>
      )}
      <motion.div {...rise(t0 + 1.3)} className="mt-7">
        <HeroCountdown invitation={invitation} numberClassName="font-cormorant text-[#1F1C19]" labelClassName="text-[#5E574F]" />
      </motion.div>
      {d.subtitle && (
        <motion.p {...rise(t0 + 1.5)} className="mt-7 max-w-md font-cormorant italic text-lg text-[#3A352F]">
          {d.subtitle}
        </motion.p>
      )}
    </div>
  );
}

/**
 * DugunOrigamiTurna — "Origami Turna": washi kâğıdından bir kare yaprak,
 * CSS 3D (preserve-3d + clip-path üçgen paneller) ile adım adım katlanıp
 * turnaya dönüşür; bölümler açıldıkça sumi mürekkebinden bir turna sürüsü
 * ekranı geçer. Sakin Japon minimalizmi: washi, sumi, tek vermilyon mühür.
 */
export function DugunOrigamiTurna({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  const still = mode === 'preview' || reduced;
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={TURNA_FLAVOR}
      mode={mode}
      themeOverride={TURNA_TEMASI}
      renderBackdrop={(state) => <TurnaBackdrop {...state} still={still} />}
      renderHero={(props) => <TurnaHero {...props} mode={mode} />}
    />
  );
}
