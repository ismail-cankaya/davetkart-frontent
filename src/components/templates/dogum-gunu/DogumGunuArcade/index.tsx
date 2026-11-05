import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import type { Invitation } from '../../../../types';
import { buildWorld, createGame, drawScene, sizeCanvas, STEP, type GameState, type TokenKind, type World } from './motor';

/* ------------------------------------------------------------------ */
/* Tema                                                                */
/* ------------------------------------------------------------------ */

const NEON = { pink: '#FF3EA5', cyan: '#2DE2E6', yellow: '#F9F871', violet: '#7B2FF7', ink: '#0B0620' };
const GLOW = '[text-shadow:0_0_12px_rgba(255,62,165,0.65),0_0_28px_rgba(45,226,230,0.35)]';

const ARCADE_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0B0620] [&_.font-serif]:font-mono [&_.font-serif]:uppercase [&_.font-serif]:tracking-[0.08em]',
  page: 'text-[#E9E4FF]',
  surface: 'bg-[#140B33]/85 backdrop-blur-md shadow-[0_0_0_1px_rgba(45,226,230,0.18),0_0_40px_-18px_rgba(255,62,165,0.55)]',
  border: 'border-[#2DE2E6]/25',
  heading: 'text-[#F9F871]',
  body: 'text-[#B9B2E0]',
  accent: 'text-[#2DE2E6]',
  accentBg: 'bg-[#FF3EA5]',
  accentSoft: 'bg-[#FF3EA5]/10',
  input:
    'w-full bg-[#0B0620]/70 border border-[#2DE2E6]/30 rounded-md px-3.5 py-2.5 text-sm text-[#E9E4FF] placeholder:text-[#7D74AA] focus:outline-none focus:border-[#2DE2E6] focus:ring-2 focus:ring-[#2DE2E6]/25 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#FF5BB4,#D61F84)] hover:brightness-110 text-white shadow-lg shadow-[#FF3EA5]/30',
  buttonGhost: 'border border-[#2DE2E6]/40 text-[#E9E4FF] hover:bg-[#2DE2E6]/10',
  divider: 'bg-[#2DE2E6]/20',
  timelineLine: 'from-[#FF3EA5]/80 via-[#2DE2E6]/40 to-transparent',
  envelope: {
    paper: 'bg-[#140B33]',
    flap: 'bg-[#1C1045]',
    seal: 'bg-[#FF3EA5] text-white',
    glow: 'bg-[#2DE2E6]/25',
    card: 'bg-[#F4F0FF] border border-[#2DE2E6]/40'
  },
  mapHeader: 'bg-[#140B33]',
  footer: { names: 'text-[#B9B2E0]', branding: 'text-[#7D74AA]' }
};

const ARCADE_FLAVOR: TemplateFlavor = {
  ...DOGUM_GUNU_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Yeni seviyeye hoş geldin',
  headings: { timeline: 'Bölüm Bölüm Parti', details: 'Oyun Alanı', gallery: 'Yüksek Skorlar', gift: 'Bonus Kutusu', rsvp: 'Oyuncu 2 Katıl' }
};

/* ------------------------------------------------------------------ */
/* Veri                                                                */
/* ------------------------------------------------------------------ */

interface InfoToken {
  kind: TokenKind;
  label: string;
  lines: string[];
}

const TOKEN_COLOR: Record<TokenKind, string> = { date: NEON.pink, venue: NEON.cyan, program: NEON.yellow };

function useInfoTokens(invitation: Invitation, d: HeroData): InfoToken[] {
  const events = invitation.timelineEvents;
  return useMemo(() => {
    const out: InfoToken[] = [];
    if (d.date.day) {
      out.push({
        kind: 'date',
        label: 'Tarih',
        lines: [[d.date.weekday, d.date.day].filter(Boolean).join(', ') + (d.date.time ? ` · ${d.date.time}` : '')]
      });
    }
    if (d.venue) out.push({ kind: 'venue', label: 'Mekân', lines: [d.venue] });
    const program = events
      .map((e) => [e.time.trim(), e.title.trim()].filter(Boolean).join(' — '))
      .filter((line) => line.length > 0);
    if (program.length > 0) out.push({ kind: 'program', label: 'Program', lines: program });
    return out;
  }, [d.date.day, d.date.weekday, d.date.time, d.venue, events]);
}

/* ------------------------------------------------------------------ */
/* Bilgi listesi (erişilebilir, düz)                                   */
/* ------------------------------------------------------------------ */

function InfoList({ tokens, className = '' }: { tokens: InfoToken[]; className?: string }) {
  if (tokens.length === 0) return null;
  return (
    <dl className={`w-full max-w-sm text-left font-mono ${className}`}>
      {tokens.map((t) => (
        <div key={t.kind} className="flex gap-3 py-2.5 border-b border-[#2DE2E6]/15 last:border-b-0">
          <dt className="shrink-0 w-[4.8rem] text-[10px] tracking-[0.2em] uppercase pt-0.5" style={{ color: TOKEN_COLOR[t.kind] }}>
            {t.label}
          </dt>
          <dd className="min-w-0 text-sm text-[#E9E4FF] break-words">
            {t.lines.length === 1 ? (
              t.lines[0]
            ) : (
              <ul className="space-y-1">
                {t.lines.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/* Statik kare (önizleme / bitiş / azaltılmış hareket)                */
/* ------------------------------------------------------------------ */

function StaticFrame({ kinds }: { kinds: TokenKind[] }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const key = kinds.join(',');
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const world = buildWorld(key ? (key.split(',') as TokenKind[]) : []);
    const state = createGame(world);
    state.player.x = 96;
    state.frame = 1;
    state.tokens.forEach((t, i) => (t.taken = i > 0));
    const paint = () => {
      const ctx = sizeCanvas(canvas);
      if (ctx) drawScene(ctx.ctx, ctx.w, ctx.h, world, state, 0.6);
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [key]);
  return (
    <div className="relative w-full max-w-sm aspect-[16/7] rounded-md overflow-hidden border-2 border-[#2DE2E6]/40 shadow-[0_0_30px_-8px_rgba(255,62,165,0.6)]">
      <canvas ref={ref} className="absolute inset-0 w-full h-full [image-rendering:pixelated]" aria-hidden="true" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Oyun kapısı                                                         */
/* ------------------------------------------------------------------ */

type Phase = 'coin' | 'ready' | 'play' | 'clear';

function ArcadeGate({ tokens, title, onDone }: { tokens: InfoToken[]; title: string; onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('coin');
  const [taken, setTaken] = useState<TokenKind[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const jumpRef = useRef(false);
  const keysRef = useRef({ left: false, right: false });
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const kinds = useMemo(() => tokens.map((t) => t.kind), [tokens]);
  const phaseRef = useRef<Phase>(phase);
  phaseRef.current = phase;

  // Açılış koreografisi: INSERT COIN → READY → oyun.
  useEffect(() => {
    if (phase === 'coin') {
      const id = window.setTimeout(() => setPhase('ready'), 1700);
      return () => window.clearTimeout(id);
    }
    if (phase === 'ready') {
      const id = window.setTimeout(() => setPhase('play'), 1100);
      return () => window.clearTimeout(id);
    }
    if (phase === 'clear') {
      const id = window.setTimeout(() => doneRef.current(), 1600);
      return () => window.clearTimeout(id);
    }
  }, [phase]);

  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  // Klavye: yalnızca kapı açıkken; kapı modal olduğundan sayfa kaydırması zaten kilitli.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        doneRef.current();
        return;
      }
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (e.target instanceof HTMLButtonElement && e.key === ' ') return;
        e.preventDefault();
        if (phase === 'coin') setPhase('ready');
        jumpRef.current = true;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        keysRef.current.left = true;
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        keysRef.current.right = true;
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keysRef.current.left = false;
      if (e.key === 'ArrowRight') keysRef.current.right = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [phase]);

  // Oyun döngüsü: sabit adımlı fizik (1/60 sn), değişken çizim.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const world: World = buildWorld(kinds);
    const state: GameState = createGame(world);
    let sized = sizeCanvas(canvas);
    const ro = new ResizeObserver(() => (sized = sizeCanvas(canvas)));
    ro.observe(canvas);
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let clock = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      acc += dt;
      clock += dt;
      while (acc >= STEP) {
        const active = phaseRef.current === 'play';
        const res = state.step(active ? { left: keysRef.current.left, right: keysRef.current.right, jump: jumpRef.current } : null);
        jumpRef.current = false;
        if (res.collected) setTaken((prev) => (prev.includes(res.collected as TokenKind) ? prev : [...prev, res.collected as TokenKind]));
        if (res.finished && phaseRef.current === 'play') {
          phaseRef.current = 'clear';
          setPhase('clear');
        }
        acc -= STEP;
      }
      if (sized) drawScene(sized.ctx, sized.w, sized.h, world, state, clock);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // Döngü bir kez kurulur; faz değişimi phaseRef üzerinden okunur.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kinds]);

  const tap = () => {
    if (phase === 'coin') setPhase('ready');
    jumpRef.current = true;
  };

  const collected = tokens.filter((t) => taken.includes(t.kind));

  return (
    <motion.div
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Arcade davetiye oyunu"
      className="absolute inset-0 z-50 flex flex-col items-center overflow-y-auto px-4 pt-14 pb-6 text-center font-mono text-[#E9E4FF] bg-[radial-gradient(ellipse_at_50%_0%,#2A0F5C_0%,#0B0620_60%)] focus:outline-none"
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.5 } }}
    >
      {/* Tarama çizgileri */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.5)_0_1px,transparent_1px_3px)]" aria-hidden="true" />

      <button
        type="button"
        onClick={onDone}
        className="absolute top-3 right-3 z-10 rounded-sm px-3.5 py-2 text-[11px] tracking-[0.18em] uppercase text-[#0B0620] bg-[#2DE2E6] hover:bg-[#F9F871] shadow-[0_0_18px_rgba(45,226,230,0.6)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F9F871] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0620]"
      >
        Oyunu atla ▸
      </button>

      <p className="relative text-[10px] tracking-[0.35em] uppercase text-[#2DE2E6]">{title}</p>
      <p className="relative mt-1 text-[10px] tracking-[0.2em] uppercase text-[#B9B2E0]">
        1UP · {String(taken.length * 1000).padStart(5, '0')} · {taken.length}/{tokens.length}
      </p>

      {/* Ekran */}
      <div className="relative mt-4 w-full max-w-xl">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-md overflow-hidden border-2 border-[#FF3EA5]/60 shadow-[0_0_40px_-6px_rgba(255,62,165,0.6),inset_0_0_30px_rgba(0,0,0,0.6)]">
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => {
              e.preventDefault();
              tap();
            }}
            className="absolute inset-0 w-full h-full touch-none cursor-pointer [image-rendering:pixelated]"
            aria-hidden="true"
          />
          <AnimatePresence>
            {phase === 'coin' && (
              <motion.div
                key="coin"
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0620]/70 pointer-events-none"
                exit={{ opacity: 0, scale: 1.3, transition: { duration: 0.3 } }}
              >
                <motion.p
                  className={`text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#F9F871] ${GLOW}`}
                  initial={{ scale: 2.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: [0, 1, 0.2, 1, 0.2, 1] }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                >
                  INSERT COIN
                </motion.p>
                <motion.span
                  className="mt-4 block w-5 h-5 rounded-full border-2 border-[#F9F871] bg-[#F9F871]/30"
                  initial={{ y: -60, opacity: 0 }}
                  animate={{ y: 0, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.2, delay: 0.3, ease: 'easeIn' }}
                />
              </motion.div>
            )}
            {phase === 'ready' && (
              <motion.div
                key="ready"
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <motion.p
                  className={`text-3xl font-bold tracking-[0.3em] text-[#2DE2E6] ${GLOW}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  READY!
                </motion.p>
              </motion.div>
            )}
            {phase === 'clear' && (
              <motion.div
                key="clear"
                className="absolute inset-0 flex items-center justify-center bg-[#0B0620]/55 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.p
                  className={`text-2xl font-bold tracking-[0.2em] text-[#F9F871] ${GLOW}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  STAGE CLEAR!
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-2 text-[10px] tracking-[0.15em] uppercase text-[#7D74AA]">Dokun / Boşluk / ↑ zıpla · ← → hız</p>
      </div>

      {/* HUD kartları */}
      <div className="relative mt-4 w-full max-w-xl grid gap-2 text-left" aria-live="polite">
        <AnimatePresence initial={false}>
          {collected.map((t) => (
            <motion.div
              key={t.kind}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              className="rounded-sm border-2 bg-[#140B33]/90 px-3 py-2"
              style={{ borderColor: TOKEN_COLOR[t.kind], boxShadow: `0 0 16px -4px ${TOKEN_COLOR[t.kind]}` }}
            >
              <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: TOKEN_COLOR[t.kind] }}>
                ★ {t.label}
              </p>
              <p className="mt-0.5 text-sm text-[#E9E4FF] break-words">{t.lines.slice(0, 3).join(' · ')}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {collected.length === 0 && tokens.length > 0 && (
          <p className="text-center text-xs text-[#B9B2E0]">Jetonları topla: tarih, mekân ve program açılsın.</p>
        )}
      </div>

      {/* Ekran okuyucular için tüm bilgi, oyundan bağımsız */}
      <div className="sr-only">
        <InfoList tokens={tokens} />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function ArcadeHero({ invitation, play, mode, onReplay }: HeroRenderProps & { play: boolean; mode: 'preview' | 'live'; onReplay?: () => void }) {
  const d = useHeroData(invitation);
  const tokens = useInfoTokens(invitation, d);
  const reduced = useReducedMotion() ?? false;
  const still = mode === 'preview' || reduced;
  const rise = (delay: number) =>
    still
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 18 },
          animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const }
        };

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-5 pt-14 pb-24 text-center font-mono">
      <motion.p {...rise(0.05)} className="text-[10px] tracking-[0.35em] uppercase text-[#2DE2E6]">
        {d.title || ARCADE_FLAVOR.tagline}
      </motion.p>
      <motion.h1
        {...rise(0.15)}
        className={`mt-4 font-bold uppercase leading-[1.05] tracking-[0.04em] text-[#F9F871] text-[clamp(2rem,10cqw,4.4rem)] break-words max-w-full ${GLOW}`}
      >
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && <span className="block my-1 text-[0.4em] text-[#FF3EA5]">+ PLAYER 2 +</span>}
              <span className="block">{p}</span>
            </React.Fragment>
          ))
        ) : (
          <span className="block">{NO_NAMES}</span>
        )}
      </motion.h1>
      <motion.div {...rise(0.3)} className="mt-6 w-full flex justify-center">
        <StaticFrame kinds={tokens.map((t) => t.kind)} />
      </motion.div>
      <motion.div {...rise(0.45)} className="mt-5 w-full flex justify-center">
        <InfoList tokens={tokens} className="rounded-sm border border-[#2DE2E6]/25 bg-[#140B33]/70 px-4 py-1" />
      </motion.div>
      <motion.div {...rise(0.6)} className="mt-6">
        <HeroCountdown invitation={invitation} numberClassName={`font-mono text-[#FF3EA5] ${GLOW}`} labelClassName="text-[#B9B2E0]" />
      </motion.div>
      {d.subtitle && (
        <motion.p {...rise(0.7)} className="mt-6 max-w-md text-sm text-[#B9B2E0]">
          {d.subtitle}
        </motion.p>
      )}
      {onReplay && (
        <motion.button
          {...rise(0.8)}
          type="button"
          onClick={onReplay}
          className="mt-6 rounded-sm px-4 py-2 text-[11px] tracking-[0.2em] uppercase border border-[#FF3EA5]/60 text-[#FF3EA5] hover:bg-[#FF3EA5]/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3EA5]"
        >
          ↻ Tekrar oyna
        </motion.button>
      )}
    </div>
  );
}

function ArcadeBackdrop() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#0B0620_0%,#1A0A40_55%,#2A0F5C_100%)]">
      <div className="absolute inset-x-0 bottom-0 h-[45%] opacity-40 [mask-image:linear-gradient(to_top,black,transparent)] bg-[linear-gradient(#FF3EA5_1px,transparent_1px),linear-gradient(90deg,#FF3EA5_1px,transparent_1px)] bg-[size:36px_36px]" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[130%] h-72 rounded-full bg-[#7B2FF7]/25 blur-3xl" />
    </div>
  );
}

function ArcadeGateHost({ invitation, onDone }: { invitation: Invitation; onDone: () => void }) {
  const d = useHeroData(invitation);
  const tokens = useInfoTokens(invitation, d);
  return <ArcadeGate tokens={tokens} title={d.title || ARCADE_FLAVOR.tagline} onDone={onDone} />;
}

function prefersReduced(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * DogumGunuArcade — "Arcade": davetiye oynanabilir bir mini platform oyunu.
 * Canvas 2D, piksel çizim, sabit adımlı fizik. Kendi tasarımımız küçük bir
 * robot koşar; dokunuş/boşluk/↑ zıplatır, ← → hızı ayarlar. Toplanan her
 * jeton (tarih, mekân, program) bir HUD kartı açar. "Oyunu atla" her an
 * görünür; bitince ya da atlanınca hero'da düz bilgi listesi durur.
 * Önizlemede ve azaltılmış harekette oyun döngüsü kurulmaz, tek kare çizilir.
 */
export function DogumGunuArcade({ invitation, mode = 'preview' }: TemplateProps) {
  const [gateOpen, setGateOpen] = useState(() => mode === 'live' && !prefersReduced());
  const finish = useCallback(() => setGateOpen(false), []);
  const replay = useCallback(() => setGateOpen(true), []);
  const showGate = mode === 'live' && gateOpen;
  const canReplay = mode === 'live' && !prefersReduced();
  const compositionInvitation = useMemo(() => ({ ...invitation, showEnvelope: false }), [invitation]);

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full" inert={showGate}>
        <InvitationComposition
          invitation={compositionInvitation}
          flavor={ARCADE_FLAVOR}
          mode={mode}
          themeOverride={ARCADE_TEMASI}
          renderBackdrop={() => <ArcadeBackdrop />}
          renderHero={(props) => <ArcadeHero {...props} mode={mode} play={!showGate} onReplay={canReplay ? replay : undefined} />}
        />
      </div>
      <AnimatePresence>{showGate && <ArcadeGateHost key="gate" invitation={invitation} onDone={finish} />}</AnimatePresence>
    </div>
  );
}
