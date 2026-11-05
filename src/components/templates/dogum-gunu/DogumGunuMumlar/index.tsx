import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DOGUM_GUNU_FLAVOR } from '../flavors';

const CANDLE_COUNT = 5;
const CANDLE_COLORS = ['#C2416B', '#E8B04A', '#F2A7BC', '#E8B04A', '#C2416B'];
const CONFETTI_COLORS = ['#C2416B', '#E8B04A', '#F2A7BC', '#FFF7EC', '#8E1F45'];
const CONFETTI_MS = 1900;

const MUM_TEMASI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#FFF7EC] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#4A2233]',
  surface: 'bg-white/80 backdrop-blur-sm shadow-[0_18px_40px_-24px_rgba(194,65,107,0.45)]',
  border: 'border-[#E8B04A]/30',
  heading: 'text-[#8E1F45]',
  body: 'text-[#6E4A57]',
  accent: 'text-[#B8862B]',
  accentBg: 'bg-[#C2416B]',
  accentSoft: 'bg-[#C2416B]/10',
  input:
    'w-full bg-white border border-[#E8B04A]/40 rounded-lg px-3.5 py-2.5 text-sm text-[#4A2233] placeholder:text-[#B59AA4] focus:outline-none focus:border-[#C2416B] focus:ring-2 focus:ring-[#C2416B]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#D2557F,#A82D58)] hover:brightness-110 text-white shadow-lg shadow-[#C2416B]/30',
  buttonGhost: 'border border-[#C2416B]/35 text-[#8E1F45] hover:bg-[#C2416B]/10',
  divider: 'bg-[#E8B04A]/30',
  timelineLine: 'from-[#C2416B]/70 via-[#E8B04A]/40 to-transparent',
  envelope: {
    paper: 'bg-[#FBE9EF]',
    flap: 'bg-[#F6D5E0]',
    seal: 'bg-[#C2416B] text-white',
    glow: 'bg-[#E8B04A]/30',
    card: 'bg-white border border-[#E8B04A]/40'
  },
  mapHeader: 'bg-[#FBE9EF]',
  footer: { names: 'text-[#6E4A57]', branding: 'text-[#B59AA4]' }
};

const MUM_FLAVOR: TemplateFlavor = {
  ...DOGUM_GUNU_FLAVOR,
  tagline: 'Bir dilek tut, mumları üfle',
  headings: { timeline: 'Partinin Akışı', details: 'Kutlama Yeri', gallery: 'Tatlı Anılar', gift: 'Hediye Kutusu', rsvp: 'Pastaya Sen de Ortak Ol' }
};

/** Alev titremesi + duman; `prefers-reduced-motion` altında hiçbiri oynamaz. */
const KEYFRAMES = `
@keyframes dgm-flicker {
  0%,100% { transform: scale(1,1) rotate(-2deg); opacity: 1; }
  25% { transform: scale(0.92,1.08) rotate(2deg); opacity: .92; }
  50% { transform: scale(1.05,0.94) rotate(-1deg); opacity: 1; }
  75% { transform: scale(0.96,1.04) rotate(3deg); opacity: .95; }
}
@keyframes dgm-glow { 0%,100% { opacity: .55; } 50% { opacity: .8; } }
.dgm-flame { transform-origin: 50% 90%; animation: dgm-flicker 1.1s ease-in-out infinite; }
.dgm-glow { animation: dgm-glow 1.6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .dgm-flame, .dgm-glow { animation: none; } }
`;

/* ------------------------------------------------------------------ */
/* Pasta                                                               */
/* ------------------------------------------------------------------ */

interface CakeProps {
  lit: boolean[];
  onBlow?: (index: number) => void;
  size?: 'lg' | 'sm';
  /** Titreme yok (önizleme). */
  still?: boolean;
}

function Flame({ delay, still }: { delay: number; still: boolean }) {
  return (
    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-0.5 w-5 h-8 pointer-events-none" aria-hidden="true">
      <span className={`${still ? '' : 'dgm-glow '}absolute -inset-4 rounded-full bg-[#FFD27A]/50 blur-lg`} />
      <span
        className={`${still ? '' : 'dgm-flame '}absolute inset-0 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[radial-gradient(ellipse_at_50%_75%,#FFFFFF_0%,#FFE7A0_30%,#F6A23A_65%,rgba(232,93,58,0)_100%)]`}
        style={{ animationDelay: `${delay}s` }}
      />
    </span>
  );
}

function Smoke({ reduced }: { reduced: boolean }) {
  if (reduced) return null;
  return (
    <span className="absolute left-1/2 bottom-full -translate-x-1/2 pointer-events-none" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute -left-2 bottom-0 w-4 h-4 rounded-full bg-[#9C8A92]/45 blur-[3px]"
          initial={{ opacity: 0.7, y: 0, x: 0, scale: 0.5 }}
          animate={{ opacity: 0, y: -46 - i * 10, x: (i - 1) * 9, scale: 1.8 }}
          transition={{ duration: 1.3, delay: i * 0.12, ease: 'easeOut' }}
        />
      ))}
    </span>
  );
}

function Cake({ lit, onBlow, size = 'lg', still = false }: CakeProps) {
  const reduced = useReducedMotion() ?? false;
  const width = size === 'lg' ? 'w-[260px]' : 'w-[180px]';
  return (
    <div className={`relative ${width} mx-auto select-none`} style={{ aspectRatio: '1 / 0.92' }}>
      {/* Mumlar */}
      <div className="absolute inset-x-[14%] top-[6%] h-[30%] flex items-end justify-between z-10">
        {lit.map((on, i) => {
          const body = (
            <>
              {on && <Flame delay={i * 0.17} still={still} />}
              {!on && onBlow && <Smoke reduced={reduced} />}
              <span className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-[2px] h-2 bg-[#3B2A2F] rounded-full" aria-hidden="true" />
              <span
                className="block w-full h-full rounded-t-[3px] shadow-[inset_-3px_0_0_rgba(0,0,0,0.08)]"
                style={{
                  backgroundColor: CANDLE_COLORS[i % CANDLE_COLORS.length],
                  backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.55) 0 4px, transparent 4px 10px)'
                }}
                aria-hidden="true"
              />
            </>
          );
          const height = i % 2 === 0 ? 'h-[78%]' : 'h-[92%]';
          return onBlow ? (
            <button
              key={i}
              type="button"
              aria-label="Mumu söndür"
              aria-pressed={!on}
              disabled={!on}
              onClick={() => onBlow(i)}
              className={`relative w-3 ${height} rounded-t-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2416B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFF7EC] disabled:cursor-default cursor-pointer before:absolute before:-inset-x-4 before:-top-12 before:bottom-0 before:content-['']`}
            >
              {body}
            </button>
          ) : (
            <span key={i} className={`relative w-3 ${height}`}>
              {body}
            </span>
          );
        })}
      </div>
      {/* Pasta gövdesi (SVG) */}
      <svg viewBox="0 0 260 170" className="absolute inset-x-0 bottom-0 w-full h-[70%]" aria-hidden="true">
        <defs>
          <linearGradient id="dgm-tier" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#F7C6D3" />
            <stop offset="1" stopColor="#E99AB2" />
          </linearGradient>
          <linearGradient id="dgm-plate" x1="0" x2="1">
            <stop offset="0" stopColor="#C9973A" />
            <stop offset=".5" stopColor="#F3D27E" />
            <stop offset="1" stopColor="#C9973A" />
          </linearGradient>
        </defs>
        <ellipse cx="130" cy="156" rx="124" ry="11" fill="url(#dgm-plate)" />
        <rect x="22" y="40" width="216" height="110" rx="12" fill="url(#dgm-tier)" />
        <rect x="22" y="92" width="216" height="10" fill="#FFF7EC" opacity=".8" />
        <ellipse cx="130" cy="40" rx="108" ry="14" fill="#FFF3F6" />
        {/* Krema damlaları */}
        <path
          d="M22 42 q0 18 10 18 q10 0 10-12 q0 20 12 20 q12 0 12-16 q0 14 12 14 q12 0 12-18 q0 22 13 22 q13 0 13-20 q0 16 12 16 q12 0 12-14 q0 18 12 18 q12 0 12-20 q0 14 11 14 q10 0 10-12 q0 16 10 16 q10 0 10-18 V40 H22Z"
          fill="#FFF3F6"
        />
        {[44, 82, 120, 158, 196, 224].map((x, i) => (
          <circle key={x} cx={x} cy={124 + (i % 2) * 8} r="3.2" fill={i % 2 ? '#E8B04A' : '#C2416B'} />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Konfeti (canvas 2D)                                                 */
/* ------------------------------------------------------------------ */

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
}

function ConfettiBurst({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      doneRef.current();
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.scale(dpr, dpr);

    const originY = height * 0.42;
    const pieces: Piece[] = Array.from({ length: 140 }, () => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
      const speed = 6 + Math.random() * 9;
      return {
        x: width / 2,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.35,
        w: 5 + Math.random() * 5,
        h: 8 + Math.random() * 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
      };
    });

    let raf = 0;
    let finished = false;
    const start = performance.now();
    const tick = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, width, height);
      const fade = t > CONFETTI_MS - 500 ? Math.max(0, (CONFETTI_MS - t) / 500) : 1;
      ctx.globalAlpha = fade;
      for (const p of pieces) {
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.32;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, (-p.h / 2) * Math.abs(Math.cos(p.rot * 2)), p.w, p.h * Math.abs(Math.cos(p.rot * 2)) + 1);
        ctx.restore();
      }
      if (t < CONFETTI_MS) {
        raf = requestAnimationFrame(tick);
      } else if (!finished) {
        finished = true;
        doneRef.current();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/* Kapı: mumları üfle                                                  */
/* ------------------------------------------------------------------ */

function CandleGate({ title, onDone }: { title: string; onDone: () => void }) {
  const reduced = useReducedMotion() ?? false;
  const [lit, setLit] = useState<boolean[]>(() => Array.from({ length: CANDLE_COUNT }, () => true));
  const [celebrating, setCelebrating] = useState(false);
  const remaining = lit.filter(Boolean).length;
  const firstButton = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    firstButton.current?.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus({ preventScroll: true });
  }, []);

  const blow = useCallback((i: number) => {
    setLit((prev) => (prev[i] ? prev.map((v, j) => (j === i ? false : v)) : prev));
  }, []);

  useEffect(() => {
    if (remaining > 0 || celebrating) return;
    if (reduced) {
      onDone();
      return;
    }
    const id = window.setTimeout(() => setCelebrating(true), 450);
    return () => window.clearTimeout(id);
  }, [remaining, celebrating, reduced, onDone]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Mumları üfle"
      className="absolute inset-0 z-50 flex flex-col items-center justify-center px-6 text-center bg-[radial-gradient(ellipse_at_50%_38%,#FFFDF8_0%,#FFF1E2_45%,#F7D9E1_100%)] text-[#4A2233]"
      initial={reduced ? false : { opacity: 1 }}
      exit={reduced ? { opacity: 0, transition: { duration: 0.2 } } : { opacity: 0, scale: 1.04, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#E8B04A_1px,transparent_1.5px)] bg-[size:28px_28px] pointer-events-none" aria-hidden="true" />
      <p className="relative text-[10px] tracking-[0.42em] uppercase text-[#B8862B]">{title}</p>
      <h2 className="relative mt-3 font-cormorant italic font-semibold text-[2.4rem] leading-tight text-[#8E1F45]">Bir dilek tut</h2>
      <p className="relative mt-2 text-sm text-[#6E4A57] max-w-[18rem]">Davetiyeni açmak için mumlara dokunarak hepsini söndür.</p>

      <div ref={firstButton} className="relative mt-12">
        <Cake lit={lit} onBlow={celebrating ? undefined : blow} />
      </div>

      <p className="relative mt-6 h-5 text-xs tracking-[0.2em] uppercase text-[#B8862B]" aria-live="polite">
        {remaining > 0 ? `${remaining} mum kaldı` : 'İyi ki doğdun!'}
      </p>

      <button
        type="button"
        onClick={onDone}
        className="absolute top-4 right-4 rounded-full px-4 py-2 text-xs font-medium tracking-wider text-[#8E1F45] bg-white/70 border border-[#C2416B]/25 hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2416B]"
      >
        Atla
      </button>

      {celebrating && <ConfettiBurst onDone={onDone} />}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function MumHero({ invitation, play, still }: HeroRenderProps & { play: boolean; still: boolean }) {
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const rise = (delay: number) =>
    reduced
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 22 },
          animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
          transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const }
        };
  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-6 pt-14 pb-24 text-center">
      <motion.div {...rise(0.1)}>
        <Cake lit={Array.from({ length: CANDLE_COUNT }, () => true)} size="sm" still={still} />
      </motion.div>
      <motion.p {...rise(0.3)} className="mt-6 text-[10px] tracking-[0.42em] uppercase text-[#B8862B]">
        {d.title || MUM_FLAVOR.tagline}
      </motion.p>
      <h1 className="mt-4 font-cormorant italic font-semibold leading-[1] text-[#8E1F45] text-[clamp(2.6rem,12cqw,5rem)] break-words max-w-full">
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && (
                <motion.span {...rise(0.6)} className="block my-1 text-[0.45em] not-italic text-[#E8B04A]">
                  &amp;
                </motion.span>
              )}
              <motion.span {...rise(0.45 + i * 0.3)} className="block">
                {p}
              </motion.span>
            </React.Fragment>
          ))
        ) : (
          <motion.span {...rise(0.45)} className="block">
            {NO_NAMES}
          </motion.span>
        )}
      </h1>
      {d.date.day && (
        <motion.p {...rise(0.8)} className="mt-6 font-cormorant text-2xl text-[#4A2233]">
          {d.date.weekday && <span className="block text-[11px] tracking-[0.35em] uppercase text-[#6E4A57] mb-1">{d.date.weekday}</span>}
          {d.date.day}
          {d.date.time && ` · ${d.date.time}`}
        </motion.p>
      )}
      {d.venue && (
        <motion.p {...rise(0.9)} className="mt-2 text-sm text-[#6E4A57]">
          {d.venue}
        </motion.p>
      )}
      <motion.div {...rise(1.05)} className="mt-7">
        <HeroCountdown invitation={invitation} numberClassName="font-cormorant text-[#8E1F45]" labelClassName="text-[#B8862B]" />
      </motion.div>
      {d.subtitle && (
        <motion.p {...rise(1.2)} className="mt-6 max-w-md font-cormorant italic text-lg text-[#6E4A57]">
          {d.subtitle}
        </motion.p>
      )}
    </div>
  );
}

function MumBackdrop() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#FFF7EC_0%,#FDEFF2_55%,#F9E3EA_100%)]">
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#E8B04A_1px,transparent_1.5px)] bg-[size:34px_34px]" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[140%] h-72 rounded-full bg-[#F2A7BC]/25 blur-3xl" />
    </div>
  );
}

/**
 * DogumGunuMumlar — "Mumları Üfle": misafir pastadaki beş mumu tek tek
 * söndürür (duman), hepsi sönünce canvas konfetisi patlar ve davetiye açılır.
 * Önizlemede kapı hiç gösterilmez; hero'da pasta durağan durur.
 */
export function DogumGunuMumlar({ invitation, mode = 'preview' }: TemplateProps) {
  const [gateOpen, setGateOpen] = useState(mode === 'live');
  const finish = useCallback(() => setGateOpen(false), []);
  const showGate = mode === 'live' && gateOpen;
  /** Mum kapısı zarfın yerini alır: ortak zarf ikinci bir kapı olarak açılmasın. */
  const compositionInvitation = useMemo(() => ({ ...invitation, showEnvelope: false }), [invitation]);

  return (
    <div className="relative w-full h-full">
      <style>{KEYFRAMES}</style>
      <div className="w-full h-full" inert={showGate}>
        <InvitationComposition
          invitation={compositionInvitation}
          flavor={MUM_FLAVOR}
          mode={mode}
          themeOverride={MUM_TEMASI}
          renderBackdrop={() => <MumBackdrop />}
          renderHero={(props) => <MumHero {...props} play={!showGate} still={mode === 'preview'} />}
        />
      </div>
      <AnimatePresence>{showGate && <CandleGate key="gate" title={MUM_FLAVOR.tagline} onDone={finish} />}</AnimatePresence>
    </div>
  );
}
