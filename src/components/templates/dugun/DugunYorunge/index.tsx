import React, { lazy, useEffect, useRef } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue
} from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { GyroButton, ThreeStage } from '../../shared/three';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';
import { INTRO_MERGE, orbitFrame } from './yorunge';

const YorungeSahnesi = lazy(() => import('./YorungeSahnesi'));

type Mode = 'preview' | 'live';

const GLOW = '[text-shadow:0_0_26px_rgba(150,180,255,0.45),0_1px_2px_rgba(0,0,0,0.7)]';
/** Bölüm durakları: kaydırma çubuğundaki uydu sayısı. */
const STOPS = 5;

const YORUNGE_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#05061A] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-medium',
  page: 'text-[#E6E8FA]',
  surface: 'bg-[#0D1030]/75 backdrop-blur-md shadow-[0_0_44px_-20px_rgba(130,150,255,0.5)]',
  border: 'border-[#A9B6FF]/20',
  heading: 'text-[#F4F1FF]',
  body: 'text-[#B9BDDC]',
  accent: 'text-[#F3D9A4]',
  accentBg: 'bg-[#F3D9A4]',
  accentSoft: 'bg-[#F3D9A4]/10',
  input:
    'w-full bg-[#05061A]/70 border border-[#A9B6FF]/25 rounded-lg px-3.5 py-2.5 text-sm text-[#F4F1FF] placeholder:text-[#7D82A8] focus:outline-none focus:border-[#F3D9A4] focus:ring-2 focus:ring-[#F3D9A4]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(120deg,#9FC2FF,#F3D9A4_55%,#F2A2D2)] hover:brightness-110 text-[#0A0B22] shadow-lg shadow-[#9FB4FF]/25',
  buttonGhost: 'border border-[#A9B6FF]/35 text-[#E6E8FA] hover:bg-[#A9B6FF]/10',
  divider: 'bg-[#A9B6FF]/15',
  timelineLine: 'from-[#F3D9A4]/80 via-[#A9B6FF]/35 to-transparent',
  envelope: {
    paper: 'bg-[#0D1030]',
    flap: 'bg-[#141842]',
    seal: 'bg-[#F3D9A4] text-[#0A0B22]',
    glow: 'bg-[#9FB4FF]/30',
    card: 'bg-[#F4F1FF] border border-[#A9B6FF]/40'
  },
  mapHeader: 'bg-[#0D1030]',
  footer: { names: 'text-[#B9BDDC]', branding: 'text-[#7D82A8]' }
};

const YORUNGE_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'İki yörünge, tek bir yol',
  headings: { timeline: 'Yörünge Durakları', details: 'Buluşma Noktası', gallery: 'Yıldız Haritamız', gift: 'Takı & Hediye', rsvp: 'Yörüngemize Katılın' }
};

/** Animasyon ancak misafir sayfasında ve hareket azaltılmamışsa çalışır. */
function useAnimated(mode: Mode) {
  const reduced = useReducedMotion() ?? false;
  return mode === 'live' && !reduced;
}

/** Birleşme: açılışta kendiliğinden INTRO_MERGE'e gelir, kalanını kaydırma tamamlar. Önizlemede son kare. */
function useMerge(progress: MotionValue<number>, revealed: boolean, mode: Mode, animated: boolean) {
  const intro = useMotionValue(mode === 'preview' ? 1 : animated ? 0 : INTRO_MERGE);
  useEffect(() => {
    if (mode === 'preview') {
      intro.set(1);
      return;
    }
    if (!animated) {
      intro.set(INTRO_MERGE);
      return;
    }
    if (!revealed) return;
    const c = animate(intro, INTRO_MERGE, { duration: 3.2, delay: 0.9, ease: [0.45, 0, 0.2, 1] });
    return () => c.stop();
  }, [animated, revealed, mode, intro]);
  return useTransform([intro, progress], ([a, p]: number[]) => Math.min(1, a + Math.min(1, p * 1.6) * (1 - INTRO_MERGE)));
}

/* ------------------------------------------------------------------ */
/* SVG yedeği: WebGL yok, önizleme, hareketi azalt                      */
/* ------------------------------------------------------------------ */

const TILT_Y = 0.42;

function seededStars(n: number) {
  let s = 7;
  const r = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  return Array.from({ length: n }, () => ({ x: r() * 100, y: r() * 100, s: 0.4 + r() * 1.1, o: 0.3 + r() * 0.6 }));
}
const STARS = seededStars(90);

function OrbitSvg({ merge, spin, animated }: { merge: MotionValue<number>; spin: MotionValue<number>; animated: boolean }) {
  const ringA = useRef<SVGEllipseElement>(null);
  const ringB = useRef<SVGEllipseElement>(null);
  const ringS = useRef<SVGEllipseElement>(null);
  const pA = useRef<SVGGElement>(null);
  const pB = useRef<SVGGElement>(null);
  const core = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let raf = 0;
    let yaw = spin.get();
    const t0 = performance.now();
    const draw = () => {
      const t = animated ? (performance.now() - t0) / 1000 + 1 : 2.2;
      yaw += (spin.get() - yaw) * (animated ? 0.12 : 1);
      const f = orbitFrame(merge.get(), t, 0);
      const cos = Math.cos(yaw);
      const sin = Math.sin(yaw);
      // Düzlemi y ekseni etrafında çevir, sonra eğik izdüşüm.
      const proj = (x: number, z: number): [number, number] => [x * cos - z * sin, (x * sin + z * cos) * TILT_Y];
      const [cax, caz] = proj(f.ca, 0);
      const [cbx, cbz] = proj(f.cb, 0);
      ringA.current?.setAttribute('cx', String(cax));
      ringA.current?.setAttribute('cy', String(caz));
      ringB.current?.setAttribute('cx', String(cbx));
      ringB.current?.setAttribute('cy', String(cbz));
      for (const el of [ringA.current, ringB.current]) {
        el?.setAttribute('rx', String(f.r));
        el?.setAttribute('ry', String(f.r * TILT_Y));
        el?.setAttribute('opacity', String(0.6 * (1 - f.shared * 0.8)));
      }
      ringS.current?.setAttribute('rx', String(f.r * 1.02));
      ringS.current?.setAttribute('ry', String(f.r * 1.02 * TILT_Y));
      ringS.current?.setAttribute('opacity', String(f.shared));
      const [ax, ay] = proj(f.ax, f.az);
      const [bx, by] = proj(f.bx, f.bz);
      pA.current?.setAttribute('transform', `translate(${ax} ${ay})`);
      pB.current?.setAttribute('transform', `translate(${bx} ${by})`);
      core.current?.setAttribute('r', String(0.5 + f.shared * 0.8));
      if (animated) raf = requestAnimationFrame(draw);
    };
    draw();
    // Statik kipte yalnızca kullanıcının sürüklemesi/kaydırması yeniden çizer.
    const offs = animated ? [] : [merge.on('change', draw), spin.on('change', draw)];
    return () => {
      cancelAnimationFrame(raf);
      offs.forEach((off) => off());
    };
  }, [animated, merge, spin]);

  return (
    <div className="absolute inset-0">
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        {STARS.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.s} fill="#E9ECFF" opacity={s.o} />
        ))}
      </svg>
      <svg viewBox="-4.3 -4.3 8.6 8.6" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <radialGradient id="yr-a" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#CFE3FF" />
            <stop offset="55%" stopColor="#5E9BFF" />
            <stop offset="100%" stopColor="#1A3A8A" />
          </radialGradient>
          <radialGradient id="yr-b" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#FFE0F0" />
            <stop offset="55%" stopColor="#E58BC0" />
            <stop offset="100%" stopColor="#6A1E58" />
          </radialGradient>
          <radialGradient id="yr-glow">
            <stop offset="0%" stopColor="#FFECC8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFB878" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle ref={core} r="0.3" fill="url(#yr-glow)" />
        <ellipse ref={ringA} fill="none" stroke="#7FB8FF" strokeWidth="0.025" />
        <ellipse ref={ringB} fill="none" stroke="#F2A2D2" strokeWidth="0.025" />
        <ellipse ref={ringS} fill="none" stroke="#F3D9A4" strokeWidth="0.035" opacity="0" />
        <g ref={pA}>
          <circle r="0.95" fill="#5E9BFF" opacity="0.16" />
          <circle r="0.48" fill="url(#yr-a)" />
        </g>
        <g ref={pB}>
          <circle r="0.85" fill="#E58BC0" opacity="0.16" />
          <ellipse rx="0.7" ry="0.16" fill="none" stroke="#F6CFE6" strokeWidth="0.02" opacity="0.7" transform="rotate(-18)" />
          <circle r="0.4" fill="url(#yr-b)" />
        </g>
      </svg>
    </div>
  );
}

/** Sağ kenarda uydu durakları: her bölüm bir durak, ilerledikçe yanar. */
function SatelliteRail({ progress }: { progress: MotionValue<number> }) {
  const fill = useTransform(progress, (p) => `${Math.min(100, Math.max(0, p * 100))}%`);
  return (
    <div className="absolute right-2.5 sm:right-5 top-1/2 -translate-y-1/2 h-[46vh] w-3 pointer-events-none" aria-hidden="true">
      <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-px bg-[#A9B6FF]/15" />
      <motion.div style={{ height: fill }} className="absolute left-1/2 -translate-x-1/2 top-0 w-px bg-[linear-gradient(180deg,#9FC2FF,#F3D9A4,#F2A2D2)]" />
      {Array.from({ length: STOPS }, (_, i) => (
        <Stop key={i} index={i} progress={progress} />
      ))}
    </div>
  );
}

function Stop({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const at = index / (STOPS - 1);
  // Aralık [0,1] içinde kalmalı (kaydırmaya bağlı dönüşüm WAAPI'ye devredilebilir).
  const from = Math.max(0, at - 0.08);
  const to = Math.max(from + 0.01, at);
  const lit = useTransform(progress, (p) => (p >= to ? 1 : p <= from ? 0.25 : 0.25 + ((p - from) / (to - from)) * 0.75));
  const scale = useTransform(lit, (o) => 0.7 + (o - 0.25) * 0.4);
  return (
    <motion.span
      style={{ top: `${at * 100}%`, opacity: lit, scale }}
      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 rounded-[2px] border border-[#F3D9A4] bg-[#F3D9A4]/40 shadow-[0_0_10px_rgba(243,217,164,0.7)]"
    />
  );
}

function YorungeBackdrop({ revealed, progress, mode, spin }: BackdropState & { mode: Mode; spin: MotionValue<number> }) {
  const animated = useAnimated(mode);
  const merge = useMerge(progress, revealed, mode, animated);
  const fallback = <OrbitSvg merge={merge} spin={spin} animated={animated} />;
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#18163F_0%,#0A0B26_45%,#03040F_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(94,155,255,0.14),transparent_45%),radial-gradient(ellipse_at_85%_80%,rgba(229,139,192,0.12),transparent_45%)]" />
      {animated ? (
        <ThreeStage mode={mode} fallback={fallback}>
          {(stage) => <YorungeSahnesi {...stage} revealed={revealed} merge={merge} spin={spin} />}
        </ThreeStage>
      ) : (
        fallback
      )}
      <SatelliteRail progress={progress} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */

/** Yatay sürükleme düzlemi çevirir; bırakınca ataletle süzülür. Ok tuşları da çevirir. */
function useSpinDrag(spin: MotionValue<number>, enabled: boolean) {
  const last = useRef<{ x: number; t: number; v: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    spin.stop();
    last.current = { x: e.clientX, t: performance.now(), v: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const l = last.current;
    if (!l) return;
    const now = performance.now();
    const dx = e.clientX - l.x;
    const dA = dx * 0.012;
    spin.set(spin.get() + dA);
    l.v = dA / Math.max(1, now - l.t);
    l.x = e.clientX;
    l.t = now;
  };
  const onPointerUp = () => {
    const l = last.current;
    last.current = null;
    if (!l || !enabled) return;
    const throwBy = Math.max(-2.5, Math.min(2.5, l.v * 320));
    animate(spin, spin.get() + throwBy, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const step = e.key === 'ArrowLeft' ? -0.4 : 0.4;
    if (enabled) animate(spin, spin.get() + step, { duration: 0.6, ease: 'easeOut' });
    else spin.set(spin.get() + step);
  };
  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onKeyDown };
}

function YorungeHero({ invitation, mode, spin }: HeroRenderProps & { mode: Mode; spin: MotionValue<number> }) {
  const d = useHeroData(invitation);
  const animated = useAnimated(mode);
  const drag = useSpinDrag(spin, animated);
  const [touched, setTouched] = React.useState(false);
  useMotionValueEvent(spin, 'change', () => {
    if (!touched) setTouched(true);
  });

  const rise = (delay: number) =>
    animated
      ? {
          initial: { opacity: 0, y: 22, filter: 'blur(10px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] as const }
        }
      : { initial: false as const };

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-between px-6 pt-12 pb-20 text-center min-h-[100svh]">
      <div className="flex flex-col items-center">
        <motion.p {...rise(1.2)} className="text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#F3D9A4]">
          {d.title || YORUNGE_FLAVOR.tagline}
        </motion.p>
        <h1 className={`mt-4 font-cormorant italic font-medium leading-[0.98] text-[#F4F1FF] text-[clamp(2.4rem,11cqw,5rem)] break-words max-w-full ${GLOW}`}>
          {d.hasNames ? (
            d.people.map((p, i) => (
              <React.Fragment key={p + i}>
                {i > 0 && (
                  <motion.span {...rise(2.3)} className="inline-block mx-3 text-[0.45em] not-italic text-[#F3D9A4] align-middle">
                    &amp;
                  </motion.span>
                )}
                <motion.span {...rise(1.6 + i * 0.4)} className={`inline-block ${i === 0 ? 'text-[#CFE0FF]' : 'text-[#FBD9EC]'}`}>
                  {p}
                </motion.span>
              </React.Fragment>
            ))
          ) : (
            <motion.span {...rise(1.6)} className="inline-block">
              {NO_NAMES}
            </motion.span>
          )}
        </h1>
      </div>

      {/* Etkileşim alanı: gezegenlerin durduğu boşluk. Yatay sürükleme sistemi çevirir; dikey kaydırma serbest. */}
      <div
        {...drag}
        role="slider"
        aria-label="Yörüngeyi çevir"
        aria-valuenow={0}
        tabIndex={0}
        className="relative w-full max-w-md grow min-h-[34svh] my-2 cursor-grab active:cursor-grabbing touch-pan-y select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F3D9A4]/40 rounded-full"
      >
        {mode === 'live' && (
          <motion.span
            {...rise(3.4)}
            className={`absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase text-[#9EA3CC] transition-opacity duration-700 ${touched ? 'opacity-0' : ''}`}
          >
            ← sürükle · çevir →
          </motion.span>
        )}
      </div>

      <div className="flex flex-col items-center">
        {d.date.day && (
          <motion.p {...rise(2.8)} className={`font-cormorant text-2xl text-[#F4F1FF] ${GLOW}`}>
            {d.date.weekday && <span className="block text-[11px] tracking-[0.35em] uppercase text-[#B9BDDC] mb-1">{d.date.weekday}</span>}
            {d.date.day}
            {d.date.time && ` · ${d.date.time}`}
          </motion.p>
        )}
        {d.venue && (
          <motion.p {...rise(3)} className="mt-1.5 text-sm text-[#B9BDDC]">
            {d.venue}
          </motion.p>
        )}
        <motion.div {...rise(3.2)} className="mt-5">
          <HeroCountdown invitation={invitation} numberClassName={`font-cormorant text-[#F3D9A4] ${GLOW}`} labelClassName="text-[#8F94BE]" />
        </motion.div>
        {mode === 'live' && <GyroButton className="mt-4 bg-[#0D1030]/70 text-[#F3D9A4] hover:text-[#F4F1FF]" />}
        {d.subtitle && (
          <motion.p {...rise(3.4)} className="mt-5 max-w-md font-cormorant italic text-lg text-[#DADCF2]">
            {d.subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}

/**
 * DugunYorunge — "Yörünge": iki gezegen ayrı yörüngelerden birbirine yaklaşır
 * ve tek bir ortak yörüngede buluşur (R3F; WebGL yok/önizleme/hareketi azalt
 * kipinde SVG). Açılışta halkalar çizilir, gezegenler belirir ve yaklaşmaya
 * başlar; kaydırma birleşmeyi tamamlar. Hero'da yatay sürükleme (ve ok
 * tuşları) sistemi çevirir; sağ kenarda bölüm durakları uydu gibi yanar.
 */
export function DugunYorunge({ invitation, mode = 'preview' }: TemplateProps) {
  const spin = useMotionValue(0.35);
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={YORUNGE_FLAVOR}
      mode={mode}
      themeOverride={YORUNGE_TEMASI}
      renderBackdrop={(state) => <YorungeBackdrop {...state} mode={mode} spin={spin} />}
      renderHero={(props) => <YorungeHero {...props} mode={mode} spin={spin} />}
    />
  );
}
