import React, { useMemo, useRef } from 'react';
import { motion, useReducedMotion, useTransform } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { PARTI_FLAVOR } from '../flavors';
import { createStage, createWall, drawBall, dropBeat, spin, stepStage, useCanvasLoop, type DiscoStage } from './diskoMotoru';

type Mode = 'preview' | 'live';

const NEON_PINK = '[text-shadow:0_0_6px_rgba(255,120,230,0.9),0_0_18px_rgba(255,60,210,0.7),0_0_42px_rgba(255,40,200,0.45)]';
const NEON_CYAN = '[text-shadow:0_0_5px_rgba(140,240,255,0.9),0_0_16px_rgba(60,220,255,0.6)]';
/** Açılış: top iner (0–1,1 sn) → huzmeler (0,9) → benekler (1,3) → neon adlar (1,7) → ayrıntılar (2,5). */
const T_NAMES = 1.7;
const T_DETAILS = 2.5;

const DISKO_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0B0614]',
  page: 'text-[#F3E8FF]',
  surface: 'bg-[#170C26]/80 backdrop-blur-md shadow-[0_0_44px_-18px_rgba(255,60,210,0.45)]',
  border: 'border-[#FF4FD8]/25',
  heading: 'text-[#FFE6FA] [text-shadow:0_0_14px_rgba(255,60,210,0.55)]',
  body: 'text-[#CDBDE6]',
  accent: 'text-[#6FE8FF]',
  accentBg: 'bg-[#FF4FD8]',
  accentSoft: 'bg-[#FF4FD8]/10',
  input:
    'w-full bg-[#0B0614]/75 border border-[#6FE8FF]/25 rounded-lg px-3.5 py-2.5 text-sm text-[#F3E8FF] placeholder:text-[#8C7BA8] focus:outline-none focus:border-[#6FE8FF] focus:ring-2 focus:ring-[#6FE8FF]/25 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(90deg,#FF4FD8,#9B5CFF)] hover:brightness-110 text-white shadow-lg shadow-[#FF4FD8]/30',
  buttonGhost: 'border border-[#6FE8FF]/40 text-[#E8F9FF] hover:bg-[#6FE8FF]/10',
  divider: 'bg-[#FF4FD8]/20',
  timelineLine: 'from-[#FF4FD8]/80 via-[#9B5CFF]/45 to-transparent',
  envelope: {
    paper: 'bg-[#170C26]',
    flap: 'bg-[#22113A]',
    seal: 'bg-[#FF4FD8] text-white',
    glow: 'bg-[#FF4FD8]/30',
    card: 'bg-[#F7EEFF] border border-[#FF4FD8]/40'
  },
  mapHeader: 'bg-[#170C26]',
  footer: { names: 'text-[#CDBDE6]', branding: 'text-[#8C7BA8]' }
};

const DISKO_FLAVOR: TemplateFlavor = {
  ...PARTI_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Işıklar Sönünce Başlıyoruz',
  headings: { timeline: 'Gecenin Akışı', details: 'Pist Nerede?', gallery: 'Işıltılı Kareler', gift: 'Hediye', rsvp: 'Listeye Adını Yaz' }
};

/** Animasyon ancak misafir sayfasında ve hareket azaltılmamışsa çalışır. */
function useAnimated(mode: Mode) {
  const reduced = useReducedMotion() ?? false;
  return mode === 'live' && !reduced;
}

function DiskoBackdrop({ heroExit, stage, animated }: BackdropState & { stage: DiscoStage; animated: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wall = useMemo(() => createWall(70), []);
  useCanvasLoop(
    canvasRef,
    (ctx, size, dt) => {
      stage.wall = canvasRef.current;
      wall(ctx, size, stage, dt, 1 - heroExit.get() * 0.55);
    },
    animated
  );
  const glow = useTransform(heroExit, [0, 1], [1, 0.45]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_50%_18%,#2A0F45_0%,#13081F_48%,#07040C_100%)]">
      <motion.div
        style={{ opacity: glow }}
        className="absolute inset-x-0 bottom-0 h-[38%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,60,210,0.22),transparent_70%)]"
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      {/* Pist ızgarası: perspektifli neon çizgiler */}
      <div
        className="absolute inset-x-[-20%] bottom-0 h-[22%] opacity-40 [transform:perspective(260px)_rotateX(62deg)] origin-bottom bg-[linear-gradient(rgba(111,232,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,79,216,0.5)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:linear-gradient(to_top,black,transparent)]"
        aria-hidden="true"
      />
    </div>
  );
}

function Ball({ stage, animated }: { stage: DiscoStage; animated: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drag = useRef<{ x: number; t: number; startX: number; startY: number; startT: number; id: number } | null>(null);

  useCanvasLoop(
    canvasRef,
    (ctx, size, dt) => {
      if (animated) stepStage(stage, dt);
      drawBall(ctx, size, stage.rot, stage.flash);
    },
    animated
  );

  const locateBall = () => {
    const el = canvasRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const wr = stage.wall?.getBoundingClientRect();
    stage.ball = { x: r.left + r.width / 2 - (wr?.left ?? 0), y: r.top + r.height / 2 - (wr?.top ?? 0), r: r.width * 0.42 };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!animated) return;
    const now = performance.now();
    drag.current = { x: e.clientX, t: now, startX: e.clientX, startY: e.clientY, startT: now, id: e.pointerId };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const now = performance.now();
    const dt = Math.max(8, now - d.t) / 1000;
    if (Math.abs(e.clientX - d.startX) > 6 && !e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    spin(stage, (e.clientX - d.x) / dt, (canvasRef.current?.clientWidth ?? 180) * 0.42);
    d.x = e.clientX;
    d.t = now;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId) return;
    const moved = Math.hypot(e.clientX - d.startX, e.clientY - d.startY);
    if (moved < 8 && performance.now() - d.startT < 350) {
      locateBall();
      dropBeat(stage, true);
    }
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!animated) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      stage.vel += e.key === 'ArrowRight' ? 1.5 : -1.5;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      locateBall();
      dropBeat(stage, true);
    }
  };

  return (
    <button
      type="button"
      aria-label="Disko topu: kaydırarak çevir, dokunarak ritmi düşür"
      disabled={!animated}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (drag.current = null)}
      onKeyDown={onKeyDown}
      className="relative block w-[184px] h-[184px] sm:w-[232px] sm:h-[232px] rounded-full [touch-action:pan-y] select-none cursor-grab active:cursor-grabbing disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6FE8FF]/70"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
    </button>
  );
}

function DiskoHero({ invitation, mode, stage }: HeroRenderProps & { mode: Mode; stage: DiscoStage }) {
  const d = useHeroData(invitation);
  const animated = useAnimated(mode);

  const neonOn = animated
    ? {
        initial: { opacity: 0 },
        animate: { opacity: [0, 0.9, 0.15, 1, 0.45, 1] },
        transition: { duration: 1.1, delay: T_NAMES, times: [0, 0.15, 0.3, 0.5, 0.7, 1] }
      }
    : {};
  const rise = (delay: number) =>
    animated
      ? { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const } }
      : {};

  return (
    <div dir="auto" className="grow flex flex-col items-center px-6 pb-24 text-center">
      {/* Askı ipi + top: yukarıdan sallanarak iner */}
      <motion.div
        className="flex flex-col items-center"
        initial={animated ? { y: -420 } : false}
        animate={animated ? { y: 0 } : undefined}
        transition={{ type: 'spring', stiffness: 60, damping: 11, mass: 1, delay: 0.15 }}
      >
        <div className="w-px h-[7vh] min-h-10 bg-gradient-to-b from-transparent via-[#CDBDE6]/40 to-[#CDBDE6]/80" aria-hidden="true" />
        <div className="w-4 h-2.5 -mb-1 rounded-sm bg-[#5C4A78]" aria-hidden="true" />
        <Ball stage={stage} animated={animated} />
      </motion.div>

      <motion.p {...rise(1.2)} className={`mt-6 text-[10px] sm:text-[11px] tracking-[0.42em] uppercase font-semibold text-[#9BF1FF] ${NEON_CYAN}`}>
        {d.title || DISKO_FLAVOR.tagline}
      </motion.p>

      <motion.h1
        {...neonOn}
        className={`mt-4 font-serif italic font-semibold leading-[1.02] text-[#FFE3FA] text-[clamp(2.4rem,11.5cqw,5rem)] break-words max-w-full ${NEON_PINK}`}
      >
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && <span className={`block my-1 text-[0.4em] not-italic text-[#9BF1FF] ${NEON_CYAN}`}>&amp;</span>}
              <span className="block">{p}</span>
            </React.Fragment>
          ))
        ) : (
          <span className="block">{NO_NAMES}</span>
        )}
      </motion.h1>

      <motion.div {...rise(T_DETAILS)} className="flex flex-col items-center">
        {d.date.day && (
          <p className="mt-6 inline-flex flex-col items-center rounded-full border border-[#6FE8FF]/45 px-6 py-2 shadow-[0_0_18px_-4px_rgba(111,232,255,0.55),inset_0_0_14px_-6px_rgba(111,232,255,0.6)]">
            {d.date.weekday && <span className="text-[10px] tracking-[0.35em] uppercase text-[#CDBDE6]">{d.date.weekday}</span>}
            <span className={`text-lg font-semibold tracking-wide text-[#E8FCFF] ${NEON_CYAN}`}>
              {d.date.day}
              {d.date.time && ` · ${d.date.time}`}
            </span>
          </p>
        )}
        {d.venue && <p className="mt-3 text-sm text-[#CDBDE6]">{d.venue}</p>}
        <HeroCountdown
          invitation={invitation}
          className="mt-6"
          numberClassName={`font-semibold text-[#FFE3FA] ${NEON_PINK}`}
          labelClassName="text-[#A994C8]"
        />
        {d.subtitle && <p className="mt-6 max-w-md font-serif italic text-lg text-[#E6D9F7]">{d.subtitle}</p>}
        {animated && (
          <p className="mt-8 text-[10px] tracking-[0.24em] uppercase text-[#A994C8]/80">Kaydır: çevir · Dokun: ritmi düşür</p>
        )}
      </motion.div>
    </div>
  );
}

/**
 * PartiDiskoTopu — "Disko Topu": canvas 2D'de enlem/boylam yüzeylerine bölünmüş,
 * her yüzeyi normaline göre gölgelenen dönen aynalı top. Duvara düşen ışık
 * benekleri topla birlikte kayar, üstten üç neon huzme ritimle salınır.
 * Etkileşim: topu yatay sürükleyince hızlanır (sürtünmeyle yavaşlar); dokununca
 * tek, yumuşak bir parlama + benek patlaması ("ritmi düşür", en fazla 2/sn).
 * Önizleme ve azaltılmış hareket kipinde rAF kurulmaz, tek statik kare çizilir.
 */
export function PartiDiskoTopu({ invitation, mode = 'preview' }: TemplateProps) {
  const animated = useAnimated(mode);
  const stage = useMemo(() => {
    const s = createStage();
    if (!animated) s.t = 10; // statik kare: açılış tamamlanmış hâli
    return s;
  }, [animated]);

  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DISKO_FLAVOR}
      mode={mode}
      themeOverride={DISKO_TEMASI}
      renderBackdrop={(state) => <DiskoBackdrop {...state} stage={stage} animated={animated} />}
      renderHero={(props) => <DiskoHero {...props} mode={mode} stage={stage} />}
    />
  );
}
