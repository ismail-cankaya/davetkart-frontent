import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { SUNNET_FLAVOR } from '../flavors';

type Mode = 'preview' | 'live';

const GLOW = '[text-shadow:0_0_22px_rgba(245,170,80,0.45),0_1px_2px_rgba(0,0,0,0.6)]';
const GROUND = 232;
/** Sahne geçiş süreleri (sn) ve otomatik ilerleme anları. */
const SCENE_DUR = [1.2, 3.4, 1.6] as const;
const AUTO_AT = [4.6, 8.8] as const;
const OPENING = 1.6;

const GOLGE_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#140B06] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-medium',
  page: 'text-[#F6E3C2]',
  surface: 'bg-[#22130A]/85 backdrop-blur-md shadow-[0_0_44px_-20px_rgba(240,150,60,0.5)]',
  border: 'border-[#E89A45]/22',
  heading: 'text-[#FCE7C0]',
  body: 'text-[#D7BF9C]',
  accent: 'text-[#F0AE5C]',
  accentBg: 'bg-[#E08A3A]',
  accentSoft: 'bg-[#E08A3A]/10',
  input:
    'w-full bg-[#140B06]/70 border border-[#E89A45]/25 rounded-lg px-3.5 py-2.5 text-sm text-[#FCE7C0] placeholder:text-[#9C8166] focus:outline-none focus:border-[#E89A45] focus:ring-2 focus:ring-[#E89A45]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#F8C97A,#D9792E)] hover:brightness-110 text-[#1E0F06] shadow-lg shadow-[#E08A3A]/25',
  buttonGhost: 'border border-[#E89A45]/35 text-[#F6E3C2] hover:bg-[#E08A3A]/10',
  divider: 'bg-[#E89A45]/15',
  timelineLine: 'from-[#E89A45]/80 via-[#E89A45]/35 to-transparent',
  envelope: {
    paper: 'bg-[#26150B]',
    flap: 'bg-[#311B0E]',
    seal: 'bg-[#E08A3A] text-[#1E0F06]',
    glow: 'bg-[#E08A3A]/25',
    card: 'bg-[#FCE7C0] border border-[#E89A45]/40'
  },
  mapHeader: 'bg-[#26150B]',
  footer: { names: 'text-[#D7BF9C]', branding: 'text-[#9C8166]' }
};

const GOLGE_FLAVOR: TemplateFlavor = {
  ...SUNNET_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Perde aralanıyor, şehzademizin günü geldi',
  headings: { ...SUNNET_FLAVOR.headings, gallery: 'Perdenin Ardından Kareler' }
};

function useAnimated(mode: Mode) {
  const reduced = useReducedMotion() ?? false;
  return mode === 'live' && !reduced;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

/** Tek saat: canlı kipte rAF ile saniye sayar, `active` kapanınca durur. */
function useClock(active: boolean, staticValue: number) {
  const [t, setT] = useState(active ? 0 : staticValue);
  const base = useRef<number | null>(null);
  const offset = useRef(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    base.current = null;
    const tick = (now: number) => {
      if (base.current === null) base.current = now - offset.current * 1000;
      const s = (now - base.current) / 1000;
      offset.current = s;
      setT(s);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  if (active) return t;
  return offset.current > 0 ? offset.current : staticValue;
}

/* ───────────────────────────── Figürler ───────────────────────────── */

const INK = '#2A1206';
const LIGHT_HOLE = '#FFE7A8';

/** İki parçalı bacak: kalça ve diz eklemi ayrı döner. */
function Leg({ x, y, hip, knee, fill }: { x: number; y: number; hip: number; knee: number; fill: string }) {
  return (
    <g transform={`rotate(${hip} ${x} ${y})`}>
      <path d={`M${x - 4} ${y} L${x + 4} ${y} L${x + 3} ${y + 24} L${x - 3} ${y + 24} Z`} fill={fill} stroke={INK} strokeWidth={1.3} />
      <g transform={`rotate(${knee} ${x} ${y + 23})`}>
        <path d={`M${x - 3} ${y + 23} L${x + 3} ${y + 23} L${x + 2.6} ${y + 44} L${x - 2.6} ${y + 44} Z`} fill={fill} stroke={INK} strokeWidth={1.3} />
        <path d={`M${x - 3.6} ${y + 44} h7.4 v4 h-7.4 Z`} fill={INK} />
      </g>
      <circle cx={x} cy={y} r={1.8} fill={LIGHT_HOLE} />
      <circle cx={x} cy={y + 23} r={1.4} fill={LIGHT_HOLE} opacity={0.8} />
    </g>
  );
}

interface HorsePose {
  x: number;
  rear: number;
  gait: number;
  amp: number;
  neck: number;
  tail: number;
}

function Horse({ p }: { p: HorsePose }) {
  const hide = '#A9441B';
  const s = Math.sin(p.gait);
  const c = Math.cos(p.gait);
  const front = p.rear < -4;
  return (
    <g transform={`translate(${p.x} ${GROUND - 58}) rotate(${p.rear} -31 10)`}>
      {/* arka (uzak) bacaklar biraz koyu */}
      <g opacity={0.8}>
        <Leg x={-28} y={8} hip={-s * 22 * p.amp} knee={Math.max(0, c) * 30 * p.amp} fill="#7A2E12" />
        <Leg x={24} y={8} hip={front ? -60 : s * 24 * p.amp} knee={front ? 95 : Math.max(0, -c) * 34 * p.amp} fill="#7A2E12" />
      </g>
      {/* kuyruk */}
      <path
        transform={`rotate(${p.tail} -45 -6)`}
        d="M-45 -8 C-64 -6 -70 14 -62 34 C-58 16 -54 6 -42 2 Z"
        fill="#5B220C"
        stroke={INK}
        strokeWidth={1.2}
        opacity={0.92}
      />
      {/* gövde */}
      <path d="M-46 -6 C-44 -24 30 -26 42 -12 C50 -2 42 16 30 17 L-36 17 C-49 15 -49 4 -46 -6 Z" fill={hide} fillOpacity={0.88} stroke={INK} strokeWidth={1.6} />
      {/* deri üstü delik süsleme: ışık deliklerden sızar */}
      {[-30, -20, -10, 0, 10, 20].map((dx) => (
        <circle key={dx} cx={dx} cy={8} r={1.6} fill={LIGHT_HOLE} opacity={0.85} />
      ))}
      <path d="M-34 0 Q-6 -10 26 0" fill="none" stroke={LIGHT_HOLE} strokeWidth={0.9} strokeDasharray="2 3" opacity={0.7} />
      {/* eyer örtüsü */}
      <path d="M-14 -21 L22 -22 L24 4 L4 10 L-16 4 Z" fill="#1E6E76" fillOpacity={0.88} stroke={INK} strokeWidth={1.3} />
      <path d="M4 -16 l4 6 l-4 6 l-4 -6 Z" fill={LIGHT_HOLE} opacity={0.85} />
      {/* yakın bacaklar */}
      <Leg x={-34} y={9} hip={s * 22 * p.amp} knee={Math.max(0, -c) * 30 * p.amp} fill={hide} />
      <Leg x={30} y={9} hip={front ? -75 : -s * 24 * p.amp} knee={front ? 110 : Math.max(0, c) * 34 * p.amp} fill={hide} />
      {/* boyun + baş: boyun ekleminden döner */}
      <g transform={`rotate(${p.neck} 34 -12)`}>
        <path d="M28 -16 L44 -46 L56 -50 L74 -32 L70 -26 L56 -32 L46 -6 Z" fill={hide} fillOpacity={0.9} stroke={INK} strokeWidth={1.5} />
        <path d="M50 -49 L52 -60 L57 -50 Z" fill={hide} stroke={INK} strokeWidth={1.2} />
        <path d="M30 -18 C34 -30 38 -40 46 -48" fill="none" stroke="#5B220C" strokeWidth={4} strokeLinecap="round" />
        <circle cx={58} cy={-42} r={1.8} fill={LIGHT_HOLE} />
        <path d="M44 -40 L64 -34 L60 -28" fill="none" stroke="#E7B54C" strokeWidth={1.4} />
      </g>
      <circle cx={34} cy={-12} r={1.8} fill={LIGHT_HOLE} />
    </g>
  );
}

interface PrincePose {
  x: number;
  y: number;
  rot: number;
  legA: number;
  legB: number;
  arm: number;
  flag: number;
  opacity: number;
}

function Prince({ p }: { p: PrincePose }) {
  return (
    <g transform={`translate(${p.x} ${p.y}) rotate(${p.rot})`} opacity={p.opacity}>
      {/* bacaklar (kalça eklemi) */}
      {[p.legB, p.legA].map((a, i) => (
        <g key={i} transform={`rotate(${a} 0 4)`} opacity={i === 0 ? 0.8 : 1}>
          <path d="M-3.5 4 L3.5 4 L3 24 L-3 24 Z" fill="#6E2410" stroke={INK} strokeWidth={1.1} />
          <path d="M-3 24 L6 24 L6 27 L-3.5 27 Z" fill="#C98A2C" stroke={INK} strokeWidth={1} />
        </g>
      ))}
      {/* kaftan */}
      <path d="M-7 -28 L7 -28 L13 12 L-13 12 Z" fill="#C2410C" fillOpacity={0.88} stroke={INK} strokeWidth={1.4} />
      <path d="M0 -26 L0 10" stroke="#E7B54C" strokeWidth={1.2} />
      {[-18, -10, -2, 6].map((y) => (
        <circle key={y} cx={0} cy={y} r={1.3} fill={LIGHT_HOLE} />
      ))}
      <path d="M-9 -6 L9 -6" stroke="#1E6E76" strokeWidth={3} />
      {/* pelerin */}
      <path d="M-7 -27 C-16 -14 -18 0 -20 10 L-12 10 Z" fill="#1E6E76" fillOpacity={0.85} stroke={INK} strokeWidth={1.1} />
      {/* baş + kavuk + sorguç */}
      <circle cx={0} cy={-35} r={7} fill="#E9B27A" fillOpacity={0.9} stroke={INK} strokeWidth={1.3} />
      <ellipse cx={0} cy={-44} rx={9.5} ry={6.5} fill="#F3E3B5" fillOpacity={0.92} stroke={INK} strokeWidth={1.3} />
      <path d="M-8 -44 Q0 -40 8 -44" fill="none" stroke="#C9A24A" strokeWidth={1} />
      <circle cx={0} cy={-46} r={2.2} fill="#1E6E76" stroke={INK} strokeWidth={0.8} />
      <path d="M0 -48 C-2 -58 3 -62 6 -64 C4 -58 4 -53 1.5 -48 Z" fill="#1E6E76" stroke={INK} strokeWidth={0.9} />
      <circle cx={3.2} cy={-35.5} r={0.9} fill={INK} />
      {/* kol: omuz ekleminden döner; elde flama */}
      <g transform={`rotate(${p.arm} 3 -25)`}>
        <path d="M0.5 -25 L5.5 -25 L5 -6 L1 -6 Z" fill="#C2410C" stroke={INK} strokeWidth={1.1} />
        <circle cx={3} cy={-4.5} r={2.4} fill="#E9B27A" stroke={INK} strokeWidth={0.9} />
        <g opacity={p.flag}>
          <path d="M3 -4.5 L3 22" stroke={INK} strokeWidth={1.4} />
          <path d="M3 22 L18 17 L3 12 Z" fill="#E7B54C" fillOpacity={0.9} stroke={INK} strokeWidth={1} />
          <circle cx={8} cy={17} r={1.2} fill={LIGHT_HOLE} />
        </g>
      </g>
      <circle cx={3} cy={-25} r={1.6} fill={LIGHT_HOLE} />
    </g>
  );
}

function Palace({ glow }: { glow: number }) {
  const body = '#4A1E0C';
  return (
    <g>
      <path d="M296 232 V150 H376 V232 Z" fill={body} fillOpacity={0.92} stroke={INK} strokeWidth={1.5} />
      <path d="M302 150 C302 112 370 112 370 150 Z" fill={body} fillOpacity={0.95} stroke={INK} strokeWidth={1.5} />
      <path d="M336 116 V102 M332 106 Q336 98 340 106" stroke={INK} strokeWidth={2} fill="none" />
      {/* minareler */}
      {[282, 390].map((x) => (
        <g key={x}>
          <path d={`M${x - 5} 232 V118 H${x + 5} V232 Z`} fill={body} fillOpacity={0.92} stroke={INK} strokeWidth={1.3} />
          <path d={`M${x - 8} 140 H${x + 8} V145 H${x - 8} Z`} fill={INK} />
          <path d={`M${x - 5} 118 L${x} 92 L${x + 5} 118 Z`} fill={body} stroke={INK} strokeWidth={1.3} />
        </g>
      ))}
      {/* ışık sızan pencereler ve kapı kemeri */}
      <g opacity={0.55 + glow * 0.45}>
        <path d="M326 232 V206 C326 192 346 192 346 206 V232 Z" fill={LIGHT_HOLE} />
        {[308, 326, 346, 364].map((x) => (
          <path key={x} d={`M${x - 3.5} 178 V168 C${x - 3.5} 162 ${x + 3.5} 162 ${x + 3.5} 168 V178 Z`} fill={LIGHT_HOLE} />
        ))}
        {[310, 362].map((x) => (
          <circle key={x} cx={x} cy={202} r={3} fill={LIGHT_HOLE} />
        ))}
        <path d="M306 140 Q336 128 366 140" fill="none" stroke={LIGHT_HOLE} strokeWidth={1.2} strokeDasharray="2 3" />
      </g>
    </g>
  );
}

/* ───────────────────────────── Sahne düzeni ───────────────────────────── */

function poses(scene: number, k: number, t: number, animated: boolean): { horse: HorsePose; prince: PrincePose; glow: number } {
  const wave = animated ? Math.sin(t * 5) * 18 : 0;
  const standing: PrincePose = { x: 262, y: GROUND - 27, rot: 0, legA: -4, legB: 4, arm: -140 + wave, flag: 0, opacity: 1 };
  if (scene === 0) {
    return { horse: { x: -90, rear: 0, gait: 0, amp: 0, neck: 0, tail: 0 }, prince: { ...standing, opacity: clamp01(k * 1.4) }, glow: 0 };
  }
  // Sahne 1: at soldan girer, şehzade sıçrayıp eyere biner.
  const walk = ease(clamp01(k / 0.66));
  const hx = scene === 1 ? lerp(-90, 170, walk) : lerp(170, 182, ease(k));
  const moving = scene === 1 && k < 0.66;
  const horseBase: HorsePose = {
    x: hx,
    rear: 0,
    gait: t * 9,
    amp: moving ? 1 : 0,
    neck: moving ? Math.sin(t * 9) * 4 : 0,
    tail: moving ? Math.sin(t * 9 + 1) * 8 : 0
  };
  const saddle = (h: HorsePose) => {
    const r = (h.rear * Math.PI) / 180;
    const lx = 6 + 31;
    const ly = -24 - 10;
    return { x: h.x - 31 + lx * Math.cos(r) - ly * Math.sin(r), y: GROUND - 58 + 10 + lx * Math.sin(r) + ly * Math.cos(r) };
  };
  const ridingPose = (h: HorsePose, arm: number, flag: number): PrincePose => {
    const s = saddle(h);
    return { x: s.x, y: s.y, rot: h.rear, legA: -48, legB: -38, arm, flag, opacity: 1 };
  };
  if (scene === 1) {
    const j = clamp01((k - 0.68) / 0.32);
    if (j <= 0) return { horse: horseBase, prince: { ...standing, arm: -20 }, glow: 0.2 };
    const ride = ridingPose(horseBase, -30, 0);
    const e = ease(j);
    return {
      horse: horseBase,
      prince: {
        ...ride,
        x: lerp(standing.x, ride.x, e),
        y: lerp(standing.y, ride.y, e) - Math.sin(j * Math.PI) * 26,
        legA: lerp(-4, -48, e),
        legB: lerp(4, -38, e),
        arm: lerp(-20, -30, e)
      },
      glow: 0.3
    };
  }
  // Sahne 2: at şaha kalkar, şehzade flamayı kaldırır.
  const up = Math.sin(clamp01(k) * Math.PI * 0.62) * 1;
  const horse: HorsePose = { ...horseBase, rear: -15 * up, neck: -10 * up, tail: 10 * up };
  return { horse, prince: ridingPose(horse, lerp(-30, -158, ease(k)), clamp01(k * 2)), glow: 1 };
}

function captionFor(scene: number, name: string) {
  if (scene === 0) return 'Bir varmış, bir yokmuş… Sarayda büyük bir gün doğuyor.';
  if (scene === 1) return 'Atı kapıya geldi; şehzademiz yola çıkıyor.';
  return name ? `${name} şehzademizin sünnet şöleni başlıyor!` : 'Şehzademizin sünnet şöleni başlıyor!';
}

/* ───────────────────────────── Perde ───────────────────────────── */

function ShadowScreen({ animated, name }: { animated: boolean; name: string }) {
  const [scene, setScene] = useState(animated ? 0 : 2);
  const [sceneStart, setSceneStart] = useState(0);
  const [lamp, setLamp] = useState({ x: 0.5, y: 0.32 });
  const [running, setRunning] = useState(animated);
  const t = useClock(running, 100);
  const tRef = useRef(t);
  tRef.current = t;

  const go = useCallback(
    (next: number) => {
      setScene(next);
      setSceneStart(animated ? tRef.current : -100);
      if (animated) setRunning(true);
    },
    [animated]
  );

  // Otomatik ilerleme: açılıştan sonra iki sahne kendiliğinden gelir.
  useEffect(() => {
    if (!animated) return;
    if (scene === 0 && t >= AUTO_AT[0] && sceneStart === 0) go(1);
    else if (scene === 1 && t - sceneStart >= AUTO_AT[1] - AUTO_AT[0] && sceneStart > 0 && sceneStart < AUTO_AT[1]) go(2);
  }, [animated, t, scene, sceneStart, go]);

  // Son sahne oturunca saati durdur (döngü yok, pil dostu).
  useEffect(() => {
    if (animated && scene === 2 && t - sceneStart > SCENE_DUR[2] + 0.4) setRunning(false);
  }, [animated, scene, t, sceneStart]);

  const start = scene === 0 ? sceneStart + OPENING : sceneStart;
  const k = animated ? clamp01((t - start) / SCENE_DUR[scene]) : 1;
  const { horse, prince, glow } = poses(scene, k, t, animated && running);

  const opening = animated ? clamp01(t / OPENING) : 1;
  const lampPower = 0.25 + 0.75 * ease(opening);

  // Sürükleme = kandili taşı; dokunma (hareketsiz) = sonraki sahne.
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const setFromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setLamp({ x: clamp01((e.clientX - r.left) / r.width), y: clamp01((e.clientY - r.top) / r.height) });
  };
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 7) {
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (d.moved) setFromPointer(e);
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved) go((scene + 1) % 3);
  };
  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = 0.08;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      go((scene + 1) % 3);
    } else if (e.key === 'ArrowLeft') setLamp((l) => ({ ...l, x: clamp01(l.x - step) }));
    else if (e.key === 'ArrowRight') setLamp((l) => ({ ...l, x: clamp01(l.x + step) }));
    else if (e.key === 'ArrowUp') setLamp((l) => ({ ...l, y: clamp01(l.y - step) }));
    else if (e.key === 'ArrowDown') setLamp((l) => ({ ...l, y: clamp01(l.y + step) }));
  };

  const dx = (0.5 - lamp.x) * 12;
  const dy = (0.35 - lamp.y) * 8;
  const shadow = `drop-shadow(${dx.toFixed(1)}px ${dy.toFixed(1)}px 3px rgba(40,12,2,0.55)) drop-shadow(0 0 6px rgba(255,190,90,${(0.25 * lampPower).toFixed(2)}))`;
  const lx = (lamp.x * 100).toFixed(1);
  const ly = (lamp.y * 100).toFixed(1);
  const caption = captionFor(scene, name);

  return (
    <div className="w-full max-w-[560px]">
      {/* ahşap çerçeve */}
      <div className="relative rounded-t-[46%_28%] rounded-b-xl p-[7px] bg-[linear-gradient(180deg,#5A2E14,#2B140A)] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8),0_0_80px_-30px_rgba(240,150,60,0.6)]">
        <div
          role="button"
          tabIndex={0}
          aria-label={`Gölge perdesi, sahne ${scene + 1}/3: ${caption} Sonraki sahne için dokunun; ışığı taşımak için sürükleyin.`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => (drag.current = null)}
          onKeyDown={onKey}
          className="relative overflow-hidden rounded-t-[46%_27%] rounded-b-lg aspect-[400/262] cursor-grab active:cursor-grabbing select-none touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-[#F0AE5C]"
          style={{
            background: `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,240,196,${lampPower}) 0%, rgba(246,184,96,${0.95 * lampPower}) 26%, rgba(176,92,34,${0.9 * lampPower}) 62%, #3A1708 100%)`
          }}
        >
          {/* perde dokusu */}
          <div className="absolute inset-0 opacity-25 mix-blend-multiply bg-[repeating-linear-gradient(0deg,rgba(90,40,10,0.25)_0_1px,transparent_1px_3px),repeating-linear-gradient(90deg,rgba(90,40,10,0.18)_0_1px,transparent_1px_4px)]" />
          {/* kandil alevi (perde arkasında, bulanık) */}
          <div
            className={`absolute w-10 h-14 -ml-5 -mt-7 rounded-full blur-md bg-[radial-gradient(ellipse_at_50%_60%,#FFF6D8,#FFC66B_45%,transparent_72%)] ${animated ? 'animate-pulse' : ''}`}
            style={{ left: `${lx}%`, top: `${ly}%`, opacity: 0.7 * lampPower }}
            aria-hidden="true"
          />
          <svg viewBox="0 0 400 262" className="absolute inset-0 w-full h-full" aria-hidden="true">
            {/* gökte delik yıldızlar ve hilal: son sahnede parlar */}
            <g opacity={0.35 + glow * 0.6}>
              <path d="M70 46 a14 14 0 1 0 12 22 a11 11 0 1 1 -12 -22 Z" fill={LIGHT_HOLE} />
              {[
                [130, 30],
                [190, 52],
                [236, 26],
                [40, 96],
                [160, 86]
              ].map(([x, y]) => (
                <path key={`${x}-${y}`} d={`M${x} ${y - 4} L${x + 1.2} ${y - 1.2} L${x + 4} ${y} L${x + 1.2} ${y + 1.2} L${x} ${y + 4} L${x - 1.2} ${y + 1.2} L${x - 4} ${y} L${x - 1.2} ${y - 1.2} Z`} fill={LIGHT_HOLE} />
              ))}
            </g>
            <g style={{ filter: shadow }}>
              <motion.g
                initial={animated ? { opacity: 0, y: 16 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Palace glow={glow} />
              </motion.g>
              {/* zemin: oyulmuş çimen şeridi */}
              <path d="M0 236 C60 228 120 238 200 232 C280 226 340 236 400 230 V262 H0 Z" fill="#3A1708" />
              <path d="M10 236 C60 230 120 240 200 234" fill="none" stroke={LIGHT_HOLE} strokeWidth={0.8} strokeDasharray="1.5 5" opacity={0.6} />
              <Horse p={horse} />
              <Prince p={prince} />
            </g>
          </svg>
          {/* sahne yazısı */}
          <div className="absolute inset-x-0 bottom-0 px-3 pb-1.5 pt-6 bg-[linear-gradient(0deg,rgba(28,10,3,0.85),transparent)]">
            <motion.p
              key={scene}
              initial={animated ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: scene === 0 ? OPENING : 0.2 }}
              className="text-center font-cormorant italic text-[13px] sm:text-base leading-snug text-[#FCE7C0]"
            >
              {caption}
            </motion.p>
          </div>
        </div>
      </div>
      {/* sahne noktaları + ipucu */}
      <div className="mt-3 flex items-center justify-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#B9976F]">
        <span className="flex gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === scene ? 'w-5 bg-[#F0AE5C]' : 'w-1.5 bg-[#F0AE5C]/30'}`} />
          ))}
        </span>
        <span>Dokun: sahne · Sürükle: ışık</span>
      </div>
    </div>
  );
}

/* ───────────────────────────── Arka plan + hero ───────────────────────────── */

function GolgeBackdrop(_: BackdropState) {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_22%,#3A1D0C_0%,#1A0D06_55%,#0B0503_100%)]">
      <div className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(90deg,#F0AE5C_0_1px,transparent_1px_22px)]" />
      <div className="absolute top-0 inset-x-0 h-24 bg-[linear-gradient(180deg,#5A1F0C_0%,transparent_100%)] opacity-60" />
    </div>
  );
}

function GolgeHero({ invitation, mode }: HeroRenderProps & { mode: Mode }) {
  const d = useHeroData(invitation);
  const animated = useAnimated(mode);
  const rise = (delay: number) =>
    animated
      ? { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } }
      : {};

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-4 pt-10 pb-20 text-center">
      <motion.p {...rise(0.2)} className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-[#F0AE5C] mb-5 px-2">
        {d.title || GOLGE_FLAVOR.tagline}
      </motion.p>

      <motion.div
        className="w-full flex justify-center"
        initial={animated ? { opacity: 0, scale: 0.96 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <ShadowScreen animated={animated} name={d.people[0] ?? ''} />
      </motion.div>

      <motion.h1
        {...rise(1.4)}
        className={`mt-7 font-cormorant italic font-medium leading-[0.98] text-[#FCE7C0] text-[clamp(2.4rem,11cqw,4.8rem)] break-words max-w-full ${GLOW}`}
      >
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && <span className="block my-1 text-[0.42em] not-italic text-[#F0AE5C]">&amp;</span>}
              <span className="block">{p}</span>
            </React.Fragment>
          ))
        ) : (
          <span className="block">{NO_NAMES}</span>
        )}
      </motion.h1>

      <motion.div {...rise(1.9)} className="flex flex-col items-center">
        {d.date.day && (
          <p className={`mt-5 font-cormorant text-2xl text-[#FCE7C0] ${GLOW}`}>
            {d.date.weekday && <span className="block text-[11px] tracking-[0.35em] uppercase text-[#D7BF9C] mb-1">{d.date.weekday}</span>}
            {d.date.day}
            {d.date.time && ` · ${d.date.time}`}
          </p>
        )}
        {d.venue && <p className="mt-2 text-sm text-[#D7BF9C]">{d.venue}</p>}
        <HeroCountdown invitation={invitation} className="mt-6" numberClassName={`font-cormorant text-[#FFDDA8] ${GLOW}`} labelClassName="text-[#B9976F]" />
        {d.subtitle && <p className="mt-6 max-w-md font-cormorant italic text-lg text-[#EAD6B4]">{d.subtitle}</p>}
      </motion.div>
    </div>
  );
}

/**
 * SunnetGolgeOyunu — "Gölge Tiyatrosu": arkadan kandille aydınlatılmış bir
 * perdede özgün figürler (şehzade, at, saray) üç sahnede hikâyeyi anlatır.
 * Figürler eklemli SVG'dir: bacaklar kalça/diz, kol omuz, boyun ve kuyruk
 * kendi eklem noktası çevresinde döner; yarı saydam renkli deri ve ışık
 * sızan delik süslemeler. Etkileşim: perdeye dokun → sonraki sahne; sürükle →
 * kandil yer değiştirir, ışık halesi ve gölge kayar. Önizleme ve azaltılmış
 * hareket kipinde son sahne statik çizilir; canlıda saat son sahnede durur.
 */
export function SunnetGolgeOyunu({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={GOLGE_FLAVOR}
      mode={mode}
      themeOverride={GOLGE_TEMASI}
      renderBackdrop={(state) => <GolgeBackdrop {...state} />}
      renderHero={(props) => <GolgeHero {...props} mode={mode} />}
    />
  );
}
