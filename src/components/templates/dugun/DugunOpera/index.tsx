import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue
} from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';
import { createCurtain, fitCanvas } from './perdeMotoru';

type Mode = 'preview' | 'live';

const GLOW = '[text-shadow:0_0_24px_rgba(247,205,120,0.45),0_2px_3px_rgba(0,0,0,0.7)]';
/** Açılış koreografisi (sn): ışıklar → perde → isimler → ayrıntılar. */
const T_SPOTS = 0.2;
const T_CURTAIN = 1.1;
const T_NAMES = 1.7;

const OPERA_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#100406] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-medium',
  page: 'text-[#F6E6C8]',
  surface: 'bg-[#1E080C]/85 backdrop-blur-md shadow-[0_0_44px_-20px_rgba(217,165,72,0.5)]',
  border: 'border-[#D9A548]/25',
  heading: 'text-[#FBE9C2]',
  body: 'text-[#D9C3A4]',
  accent: 'text-[#E8BC62]',
  accentBg: 'bg-[#D9A548]',
  accentSoft: 'bg-[#D9A548]/10',
  input:
    'w-full bg-[#100406]/70 border border-[#D9A548]/25 rounded-lg px-3.5 py-2.5 text-sm text-[#FBE9C2] placeholder:text-[#A28A70] focus:outline-none focus:border-[#D9A548] focus:ring-2 focus:ring-[#D9A548]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#F5D488,#C88C32)] hover:brightness-110 text-[#240A0E] shadow-lg shadow-[#D9A548]/25',
  buttonGhost: 'border border-[#D9A548]/35 text-[#F6E6C8] hover:bg-[#D9A548]/10',
  divider: 'bg-[#D9A548]/15',
  timelineLine: 'from-[#D9A548]/80 via-[#9E1B2C]/45 to-transparent',
  envelope: {
    paper: 'bg-[#2A0A10]',
    flap: 'bg-[#3A0E16]',
    seal: 'bg-[#D9A548] text-[#240A0E]',
    glow: 'bg-[#D9A548]/25',
    card: 'bg-[#FBEBCB] border border-[#D9A548]/40'
  },
  mapHeader: 'bg-[#2A0A10]',
  footer: { names: 'text-[#D9C3A4]', branding: 'text-[#9E8670]' }
};

const OPERA_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  envelopeLabel: 'Gala Davetiyesi',
  tagline: 'Perde aşkımız için açılıyor',
  headings: { timeline: 'Perdeler & Sahneler', details: 'Sahne', gallery: 'Kulis Anları', gift: 'Takı & Hediye', rsvp: 'Locanızı Ayırtın' },
  eyebrows: { timeline: 'Gecenin Librettosu', details: 'Gala Salonu', gallery: 'Perde Arkası', rsvp: 'Katılım' }
};

function useAnimated(mode: Mode) {
  const reduced = useReducedMotion() ?? false;
  return mode === 'live' && !reduced;
}

/* ───────────────────────── Arka plan: localar ve spot ışıkları ───────────────────────── */

/** Üç katlı opera locaları; yaldızlı korkuluk, kadife iç. */
function OperaBoxes({ side }: { side: 'left' | 'right' }) {
  const tiers = [0, 1, 2];
  return (
    <svg
      viewBox="0 0 120 600"
      preserveAspectRatio="xMinYMid slice"
      className={`absolute top-0 h-full w-[15vw] min-w-[56px] max-w-[220px] ${side === 'left' ? 'left-0' : 'right-0 -scale-x-100'}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`op-gold-${side}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#F4D38A" />
          <stop offset="1" stopColor="#9A6A22" />
        </linearGradient>
        <radialGradient id={`op-box-${side}`} cx="0.5" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#5A0E18" />
          <stop offset="1" stopColor="#1C0408" />
        </radialGradient>
      </defs>
      <rect width="120" height="600" fill="#140508" />
      {tiers.map((k) => {
        const y = 70 + k * 175;
        return (
          <g key={k}>
            {/* Loca açıklığı */}
            <path d={`M10 ${y + 120} V ${y + 30} Q 55 ${y - 12} 100 ${y + 30} V ${y + 120} Z`} fill={`url(#op-box-${side})`} />
            {/* Silüet: iki seyirci, soyut */}
            <circle cx="40" cy={y + 82} r="9" fill="#0C0204" opacity="0.8" />
            <circle cx="68" cy={y + 86} r="8" fill="#0C0204" opacity="0.8" />
            <path d={`M10 ${y + 120} V ${y + 30} Q 55 ${y - 12} 100 ${y + 30} V ${y + 120}`} fill="none" stroke={`url(#op-gold-${side})`} strokeWidth="3" />
            {/* Kıvrımlı korkuluk */}
            <path d={`M2 ${y + 112} Q 55 ${y + 132} 108 ${y + 112} V ${y + 140} Q 55 ${y + 160} 2 ${y + 140} Z`} fill="#6E1220" stroke={`url(#op-gold-${side})`} strokeWidth="2" />
            {[16, 34, 52, 70, 88].map((x) => (
              <circle key={x} cx={x} cy={y + 134 + (x - 52) * (x - 52) * -0.002} r="2.2" fill="#E2B55A" />
            ))}
            {/* Altın yaprak kartuş */}
            <path d={`M55 ${y - 2} q -10 -14 -22 -6 q 12 -2 22 14 q 10 -16 22 -14 q -12 -8 -22 6 Z`} fill="#D9A548" opacity="0.9" />
            {/* Loca lambası */}
            <circle cx="104" cy={y + 52} r="4" fill="#FFD98A" />
            <circle cx="104" cy={y + 52} r="12" fill="#FFD98A" opacity="0.15" />
          </g>
        );
      })}
      <rect x="112" width="8" height="600" fill={`url(#op-gold-${side})`} opacity="0.6" />
    </svg>
  );
}

function Spotlight({ rotate, side, opacity }: { rotate: MotionValue<number>; side: 'left' | 'right'; opacity: MotionValue<number> | number }) {
  return (
    <motion.div
      aria-hidden="true"
      style={{ rotate, opacity, transformOrigin: '50% 0%' }}
      className={`absolute -top-[6%] ${side === 'left' ? 'left-[14%]' : 'right-[14%]'} w-[46vmin] h-[115vh] -ml-[23vmin] mix-blend-screen`}
    >
      <div className="absolute inset-0 [clip-path:polygon(46%_0,54%_0,100%_100%,0_100%)] bg-[linear-gradient(180deg,rgba(255,236,190,0.55),rgba(255,214,140,0.16)_60%,rgba(255,214,140,0)_100%)] blur-[6px]" />
    </motion.div>
  );
}

function OperaBackdrop({ heroExit, revealed, mode, aim, gate }: BackdropState & { mode: Mode; aim: MotionValue<number>; gate: MotionValue<number> }) {
  const animated = useAnimated(mode);
  useEffect(() => {
    if (revealed) gate.set(1);
  }, [revealed, gate]);

  const smooth = useSpring(aim, { stiffness: 60, damping: 14 });
  const leftRot = useTransform(smooth, [-1, 1], [-6, -46]);
  const rightRot = useTransform(smooth, [-1, 1], [46, 6]);
  const spots = useMotionValue(animated ? 0 : 1);
  useEffect(() => {
    if (!animated || !revealed) return;
    const c = animate(spots, 1, { duration: 1.2, delay: T_SPOTS, ease: 'easeOut' });
    return () => c.stop();
  }, [animated, revealed, spots]);
  const spotOpacity = useTransform([spots, heroExit], ([s, e]: number[]) => s * (1 - e * 0.7));
  const boxesY = useTransform(heroExit, [0, 1], ['0%', '-8%']);
  // Bölümler önünden akarken localar geri çekilir: içerik okunur kalır.
  const boxesOpacity = useTransform(heroExit, [0, 1], [0.9, 0.35]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,#3A0A12_0%,#1A0509_55%,#080203_100%)]">
      <motion.div style={{ y: boxesY, opacity: boxesOpacity }} className="absolute inset-0">
        <OperaBoxes side="left" />
        <OperaBoxes side="right" />
      </motion.div>
      {/* Sahne ağzı: yaldızlı kemer */}
      <div className="absolute inset-x-[10%] top-0 h-6 bg-[linear-gradient(180deg,#B8822C,#6A4210)] opacity-70 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]" />
      <Spotlight rotate={leftRot} side="left" opacity={spotOpacity} />
      <Spotlight rotate={rightRot} side="right" opacity={spotOpacity} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}

/* ───────────────────────── Hero: perde, sahne, isimler ───────────────────────── */

/** Altın yaprak taç süsü. */
function GoldCrest({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 44" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="op-crest" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FBE3A0" />
          <stop offset="1" stopColor="#B07A26" />
        </linearGradient>
      </defs>
      <g fill="url(#op-crest)">
        <path d="M80 4 l6 12 l-6 6 l-6 -6 Z" />
        <path d="M74 22 q-22 -18 -44 -4 q14 -2 22 6 q-14 0 -22 10 q22 -10 44 -12 Z" />
        <path d="M86 22 q22 -18 44 -4 q-14 -2 -22 6 q14 0 22 10 q-22 -10 -44 -12 Z" />
        <circle cx="20" cy="30" r="3" />
        <circle cx="140" cy="30" r="3" />
        <rect x="40" y="38" width="80" height="1.5" rx="0.75" />
      </g>
    </svg>
  );
}

function StageCurtain({ animated, gate, onAim }: { animated: boolean; gate: MotionValue<number>; onAim: (x: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const curtain = useMemo(() => createCurtain(animated ? 0 : 1), [animated]);
  const [open, setOpen] = useState(!animated);
  const redrawRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let size = fitCanvas(canvas, ctx);
    let raf = 0;
    let last = performance.now();
    let visible = true;
    const still = () => curtain.draw(ctx, size.w, size.h, 0);
    redrawRef.current = still;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // Hero ekrandan çıkınca fizik ve çizim durur; döngü yalnızca bekler.
      if (visible) {
        curtain.step(dt);
        curtain.draw(ctx, size.w, size.h, now / 1000);
      }
      raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      size = fitCanvas(canvas, ctx);
      if (!animated) still();
    };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    ro?.observe(canvas);
    const io =
      animated && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
          })
        : null;
    io?.observe(canvas);
    if (animated) raf = requestAnimationFrame(frame);
    else still();
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      io?.disconnect();
      redrawRef.current = () => undefined;
    };
  }, [animated, curtain]);

  // Açılış: zarf kalkınca (gate) perde kendiliğinden açılır.
  useEffect(() => {
    if (!animated) return;
    let timer = 0;
    const start = () => {
      timer = window.setTimeout(() => {
        curtain.setTarget(1);
        setOpen(true);
      }, T_CURTAIN * 1000);
    };
    if (gate.get() >= 1) start();
    const off = gate.on('change', (v) => {
      if (v >= 1 && !timer) start();
    });
    return () => {
      off();
      window.clearTimeout(timer);
    };
  }, [animated, gate, curtain]);

  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const toggle = useCallback(() => {
    const next = curtain.getTarget() < 0.5 ? 1 : 0;
    if (animated) curtain.setTarget(next);
    else {
      curtain.snap(next);
      redrawRef.current();
    }
    setOpen(next === 1);
  }, [animated, curtain]);

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (curtain.hit(x, y, r.width, r.height)) toggle();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    onAim((x / r.width) * 2 - 1);
    const prev = lastPoint.current;
    lastPoint.current = { x, y };
    if (!animated || !prev) return;
    // Kadifeye sürtünen el: kenarın yakınında yatay hız kumaşa dalga verir.
    if (curtain.hit(x, y, r.width, r.height)) {
      const dx = (x - prev.x) / r.width;
      const signed = x < r.width / 2 ? -dx : dx;
      curtain.poke(y / r.height, Math.max(-0.6, Math.min(0.6, signed * 12)));
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        onPointerLeave={() => (lastPoint.current = null)}
        className="absolute inset-0 z-20 w-full h-full cursor-pointer [touch-action:pan-y]"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute z-30 bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-[#D9A548]/50 bg-[#1A0509]/70 backdrop-blur px-4 py-1.5 text-[10px] tracking-[0.32em] uppercase text-[#F2D08A] hover:bg-[#D9A548]/15 transition-colors"
      >
        {open ? 'Perdeyi kapat' : 'Perdeyi aç'}
      </button>
    </>
  );
}

function OperaHero({ invitation, mode, gate, onAim }: HeroRenderProps & { mode: Mode; gate: MotionValue<number>; onAim: (x: number) => void }) {
  const d = useHeroData(invitation);
  const animated = useAnimated(mode);
  const [play, setPlay] = useState(!animated);

  useEffect(() => {
    if (!animated) return;
    if (gate.get() >= 1) {
      setPlay(true);
      return;
    }
    return gate.on('change', (v) => v >= 1 && setPlay(true));
  }, [animated, gate]);

  const rise = (delay: number) =>
    animated
      ? {
          initial: { opacity: 0, y: 22, filter: 'blur(6px)' },
          animate: play ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined,
          transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const }
        }
      : {};

  return (
    <div dir="auto" className="relative grow flex flex-col items-center justify-center overflow-hidden px-14 sm:px-24 pt-24 pb-28 text-center">
      {/* Sahne tabanı ve rampa ışıkları */}
      <div className="absolute inset-x-0 bottom-0 h-[22%] bg-[linear-gradient(180deg,transparent,#2A1008_35%,#140804)] [mask-image:linear-gradient(180deg,transparent,black_30%)]" aria-hidden="true" />
      <div className="absolute inset-x-[8%] bottom-[14%] flex justify-between" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#FFDFA0] shadow-[0_0_14px_6px_rgba(255,206,120,0.45)]" />
        ))}
      </div>
      {/* Sahne ortasına düşen spot halkası */}
      <div className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[640px] aspect-[2/1] rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,226,170,0.16),transparent)]" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div {...rise(T_NAMES - 0.4)}>
          <GoldCrest className="w-32 sm:w-40 h-auto" />
          <p className="mt-3 text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#E8BC62]">{d.title || 'Gala Gecesi'}</p>
        </motion.div>

        <motion.h1
          {...rise(T_NAMES)}
          className={`mt-5 font-cormorant italic font-medium leading-[0.98] text-[#FBE9C2] text-[clamp(2.4rem,11cqw,5.4rem)] break-words max-w-full ${GLOW}`}
        >
          {d.hasNames ? (
            d.people.map((p, i) => (
              <React.Fragment key={p + i}>
                {i > 0 && <span className="block my-1 text-[0.4em] not-italic tracking-[0.3em] text-[#E8BC62]">&amp;</span>}
                <span className="block">{p}</span>
              </React.Fragment>
            ))
          ) : (
            <span className="block">{NO_NAMES}</span>
          )}
        </motion.h1>

        <motion.div {...rise(T_NAMES + 0.5)} className="flex flex-col items-center">
          <p className="mt-4 font-cormorant italic text-lg text-[#E9D6B4]">{OPERA_FLAVOR.tagline}</p>
          {d.date.day && (
            <p className={`mt-5 font-cormorant text-2xl text-[#FBE9C2] ${GLOW}`}>
              {d.date.weekday && <span className="block text-[11px] tracking-[0.35em] uppercase text-[#D9C3A4] mb-1">{d.date.weekday}</span>}
              {d.date.day}
              {d.date.time && <span className="text-[#E8BC62]"> · Perde {d.date.time}</span>}
            </p>
          )}
          {d.venue && <p className="mt-2 text-sm text-[#D9C3A4]">{d.venue}</p>}
          <HeroCountdown invitation={invitation} className="mt-6" numberClassName={`font-cormorant text-[#FFE2A8] ${GLOW}`} labelClassName="text-[#B89C7C]" />
          {d.subtitle && <p className="mt-6 max-w-md font-cormorant italic text-lg text-[#E9D6B4]">{d.subtitle}</p>}
        </motion.div>
      </div>

      <StageCurtain animated={animated} gate={gate} onAim={onAim} />
    </div>
  );
}

/**
 * DugunOpera — "Opera Perdesi": canvas 2D üzerinde kırmızı kadife bir sahne
 * perdesi. Perdenin iç kenarı birbirine bağlı sönümlü yaylardan oluşur;
 * çubuk çekilince açılma yukarıdan aşağı dalga olarak yayılır. Açılış
 * koreografisi: spot ışıkları yanar → perde açılır → taç süsü, isimler,
 * ayrıntılar sırayla sahneye çıkar. Perdeye dokunmak onu kapatıp açar,
 * parmağı/fareyi gezdirmek iki spotu o noktaya çevirir ve kadifeyi dalgalandırır.
 * Önizleme ve azaltılmış hareket kipinde rAF kurulmaz; açık perdeyle tek kare.
 */
export function DugunOpera({ invitation, mode = 'preview' }: TemplateProps) {
  const animated = useAnimated(mode);
  const aim = useMotionValue(0);
  const gate = useMotionValue(0);
  const sweep = useRef<AnimationPlaybackControls | null>(null);

  // Boştayken spotlar sahneyi tarar; kullanıcı dokununca kontrol ona geçer.
  useEffect(() => {
    if (!animated) return;
    aim.set(-0.7);
    sweep.current = animate(aim, 0.7, { duration: 4.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' });
    return () => {
      sweep.current?.stop();
      sweep.current = null;
    };
  }, [animated, aim]);

  const onAim = useCallback(
    (x: number) => {
      sweep.current?.stop();
      sweep.current = null;
      aim.set(Math.max(-1, Math.min(1, x)));
    },
    [aim]
  );

  return (
    <InvitationComposition
      invitation={invitation}
      flavor={OPERA_FLAVOR}
      mode={mode}
      themeOverride={OPERA_TEMASI}
      renderBackdrop={(state) => <OperaBackdrop {...state} mode={mode} aim={aim} gate={gate} />}
      renderHero={(props) => <OperaHero {...props} mode={mode} gate={gate} onAim={onAim} />}
    />
  );
}
