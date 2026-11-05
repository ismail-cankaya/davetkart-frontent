import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { Eraser } from 'lucide-react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { useTemplateFont } from '../../shared/sinema/useTemplateFont';
import { HeroCountdown, NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { TEBESIRLER, fitCanvas, tebesirCiz, useTebesirTozu, type TebesirId } from './tebesirMotoru';

type Mode = 'preview' | 'live';

const CHALK_FONT = 'Caveat, "Cormorant Garamond", Georgia, serif';
const CHALK_GLOW = '[text-shadow:0_0_1px_rgba(244,241,230,0.9),0_0_10px_rgba(244,241,230,0.18)]';
/** Silgi geçişi (sn): panel çıkışı ve silgi aynı sürede ilerler. */
const WIPE = 0.8;

const TAHTA_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#1B2A24] [&_.font-serif]:[font-family:Caveat,_"Cormorant_Garamond",_Georgia,_serif] [&_.font-serif]:font-semibold',
  page: 'text-[#ECE9DD]',
  surface: 'bg-[#22342C]/90 shadow-[inset_0_0_30px_rgba(0,0,0,0.35),0_10px_30px_-18px_rgba(0,0,0,0.6)]',
  border: 'border-[#F4F1E6]/15 border-dashed',
  heading: 'text-[#F4F1E6]',
  body: 'text-[#C9CFC3]',
  accent: 'text-[#F5B9C9]',
  accentBg: 'bg-[#F5B9C9]',
  accentSoft: 'bg-[#F5B9C9]/10',
  input:
    'w-full bg-[#15211C]/80 border border-[#F4F1E6]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#F4F1E6] placeholder:text-[#8E9A90] focus:outline-none focus:border-[#A9D6EC] focus:ring-2 focus:ring-[#A9D6EC]/20 transition-all duration-300',
  buttonPrimary: 'bg-[#F4F1E6] hover:bg-white text-[#1B2A24] shadow-lg shadow-black/30',
  buttonGhost: 'border border-[#F4F1E6]/30 text-[#ECE9DD] hover:bg-[#F4F1E6]/10',
  divider: 'bg-[#F4F1E6]/15',
  timelineLine: 'from-[#F6E3A0]/80 via-[#F6E3A0]/35 to-transparent',
  envelope: {
    paper: 'bg-[#22342C]',
    flap: 'bg-[#2A3E35]',
    seal: 'bg-[#F5B9C9] text-[#1B2A24]',
    glow: 'bg-[#F4F1E6]/20',
    card: 'bg-[#F4F1E6] border border-[#C89A62]/40'
  },
  mapHeader: 'bg-[#22342C]',
  footer: { names: 'text-[#C9CFC3]', branding: 'text-[#8E9A90]' }
};

const TAHTA_FLAVOR: TemplateFlavor = {
  ...MEZUNIYET_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Son ders: Mezuniyet',
  headings: { timeline: 'Günün Ders Programı', details: 'Sınıfın Adresi', gallery: 'Okul Yıllarından', gift: 'Hediye', rsvp: 'Yoklama' }
};

function useAnimated(mode: Mode) {
  const reduced = useReducedMotion() ?? false;
  return mode === 'live' && !reduced;
}

/* ------------------------------------------------------------------ */
/* Arka plan: tahta yeşili + SVG türbülans silinmiş tebeşir lekeleri   */
/* ------------------------------------------------------------------ */

function TahtaBackdrop(_: BackdropState) {
  const id = useId().replace(/:/g, '');
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,#2C4239_0%,#1D2D26_55%,#141F1A_100%)]" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full opacity-[0.16]" preserveAspectRatio="none">
        <filter id={`${id}-leke`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="3" seed="7" />
          <feColorMatrix values="0 0 0 0 0.95  0 0 0 0 0.95  0 0 0 0 0.92  0 0 0 1.6 -0.75" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id}-leke)`} />
      </svg>
      <svg className="absolute inset-0 w-full h-full opacity-[0.07] mix-blend-screen">
        <filter id={`${id}-kum`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="2" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.2 -0.45" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id}-kum)`} />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Paneller                                                            */
/* ------------------------------------------------------------------ */

interface Line {
  key: string;
  content: React.ReactNode;
  chars: number;
  className: string;
}

interface Panel {
  id: string;
  label: string;
  lines: Line[];
  doodle: 'underline' | 'cap' | 'stars';
  countdown?: boolean;
}

function buildPanels(d: HeroData, showTimer: boolean): Panel[] {
  const panels: Panel[] = [];
  const namesLines: Line[] = [
    { key: 'tag', content: d.title || TAHTA_FLAVOR.tagline, chars: (d.title || TAHTA_FLAVOR.tagline).length, className: 'text-[#F6E3A0] text-[22px] sm:text-2xl' }
  ];
  if (d.hasNames) {
    d.people.forEach((p, i) => {
      if (i > 0) namesLines.push({ key: `amp${i}`, content: '&', chars: 2, className: 'text-[#F5B9C9] text-3xl leading-none' });
      namesLines.push({ key: `p${i}`, content: p, chars: p.length, className: 'text-[clamp(2.6rem,13cqw,4.8rem)] leading-[0.95] font-semibold' });
    });
  } else {
    namesLines.push({ key: 'nn', content: NO_NAMES, chars: NO_NAMES.length, className: 'text-[clamp(2.6rem,13cqw,4.8rem)] leading-[0.95] font-semibold' });
  }
  panels.push({ id: 'adlar', label: 'Adlar', lines: namesLines, doodle: 'underline' });

  if (d.date.day || d.venue) {
    const lines: Line[] = [];
    if (d.date.weekday) lines.push({ key: 'wd', content: d.date.weekday, chars: d.date.weekday.length, className: 'text-[#A9D6EC] text-2xl' });
    if (d.date.day) lines.push({ key: 'day', content: d.date.day, chars: d.date.day.length, className: 'text-[clamp(2.2rem,10cqw,3.6rem)] leading-none font-semibold' });
    if (d.date.time) lines.push({ key: 'time', content: `saat ${d.date.time}`, chars: 9, className: 'text-[#F6E3A0] text-3xl' });
    if (d.venue) lines.push({ key: 'venue', content: d.venue, chars: d.venue.length, className: 'text-2xl text-[#BFE6C4] max-w-[22ch]' });
    panels.push({ id: 'tarih', label: 'Tarih ve yer', lines, doodle: 'cap' });
  }

  // Son panel yalnızca söylenecek bir şey varsa: alt yazı ya da geri sayım.
  const timer = showTimer && !!d.date.day;
  if (timer || d.subtitle) {
    const lines: Line[] = [];
    if (timer) lines.push({ key: 'h', content: 'Geri sayım', chars: 10, className: 'text-[#F5B9C9] text-2xl' });
    if (d.subtitle) lines.push({ key: 'sub', content: d.subtitle, chars: d.subtitle.length, className: 'text-2xl max-w-[24ch] leading-tight' });
    panels.push({ id: 'sayim', label: timer ? 'Geri sayım' : 'Not', lines, doodle: 'stars', countdown: timer });
  }
  return panels;
}

/** Satır başına yazma süresi (sn) ve başlangıçları. */
function lineTimings(lines: Line[], start: number) {
  let t = start;
  return lines.map((l) => {
    const dur = Math.min(1.3, Math.max(0.45, l.chars * 0.06));
    const r = { delay: t, dur };
    t += dur + 0.12;
    return r;
  });
}

function Doodle({ kind, animated, delay }: { kind: Panel['doodle']; animated: boolean; delay: number }) {
  const draw = (i: number) =>
    animated
      ? { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 0.6, delay: delay + i * 0.25, ease: 'easeOut' as const } }
      : {};
  const common = { fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeWidth: 2.4 };
  if (kind === 'underline')
    return (
      <svg viewBox="0 0 220 26" className="w-[62%] max-w-[240px] h-6 mt-1" aria-hidden="true">
        <motion.path {...draw(0)} {...common} stroke="#F5B9C9" d="M6 14 C 50 6, 110 20, 160 10 S 205 12, 214 8" />
        <motion.path {...draw(1)} {...common} stroke="#F5B9C9" strokeWidth={1.6} d="M30 21 C 80 15, 140 24, 190 17" />
      </svg>
    );
  if (kind === 'cap')
    return (
      <svg viewBox="0 0 80 50" className="absolute right-3 top-3 w-14 h-9 sm:w-20 sm:h-12" aria-hidden="true">
        <motion.path {...draw(0)} {...common} stroke="#F6E3A0" d="M40 6 L76 18 L40 30 L4 18 Z" />
        <motion.path {...draw(1)} {...common} stroke="#F6E3A0" d="M18 23 L18 36 C 30 44, 50 44, 62 36 L62 23" />
        <motion.path {...draw(2)} {...common} stroke="#F5B9C9" d="M68 20 L68 38 M64 42 L68 36 L72 42" />
      </svg>
    );
  return (
    <svg viewBox="0 0 220 40" className="w-[60%] max-w-[220px] h-9 mt-2" aria-hidden="true">
      <motion.path {...draw(0)} {...common} stroke="#F6E3A0" d="M20 8 L24 18 L34 19 L26 25 L29 35 L20 29 L11 35 L14 25 L6 19 L16 18 Z" />
      <motion.path {...draw(1)} {...common} stroke="#A9D6EC" d="M110 6 L113 14 L121 15 L115 20 L117 28 L110 23 L103 28 L105 20 L99 15 L107 14 Z" />
      <motion.path {...draw(2)} {...common} stroke="#BFE6C4" d="M200 8 L204 18 L214 19 L206 25 L209 35 L200 29 L191 35 L194 25 L186 19 L196 18 Z" />
    </svg>
  );
}

function PanelView({
  panel,
  invitation,
  animated,
  first,
  filterId,
  onWriteDust
}: {
  panel: Panel;
  invitation: HeroRenderProps['invitation'];
  animated: boolean;
  first: boolean;
  filterId: string;
  onWriteDust: (lineEls: HTMLElement[], timings: { delay: number; dur: number }[]) => () => void;
}) {
  const timings = useMemo(() => lineTimings(panel.lines, first ? 1.05 : 0.15), [panel.lines, first]);
  const end = timings.length ? timings[timings.length - 1].delay + timings[timings.length - 1].dur : 0;
  const lineRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!animated) return;
    const els = lineRefs.current.filter((e): e is HTMLElement => !!e);
    return onWriteDust(els, timings);
  }, [animated, onWriteDust, timings]);

  return (
    <motion.div
      initial={false}
      exit={animated ? { clipPath: 'inset(-20% -5% -20% 105%)' } : { opacity: 0 }}
      transition={animated ? { duration: WIPE, ease: [0.4, 0, 0.6, 1] } : { duration: 0 }}
      style={{ clipPath: 'inset(-20% -5% -20% -5%)' }}
      className="absolute inset-0 flex flex-col items-center justify-center px-5 py-6 text-center"
    >
      <div style={{ filter: `url(#${filterId})`, fontFamily: CHALK_FONT }} className={`flex flex-col items-center gap-1 text-[#F4F1E6] ${CHALK_GLOW}`}>
        {panel.lines.map((l, i) => (
          <motion.div
            key={l.key}
            ref={(el: HTMLDivElement | null) => {
              lineRefs.current[i] = el;
            }}
            initial={animated ? { clipPath: 'inset(-30% 102% -30% -4%)' } : false}
            animate={{ clipPath: 'inset(-30% -4% -30% -4%)' }}
            transition={{ duration: timings[i].dur, delay: timings[i].delay, ease: 'linear' }}
            className={`break-words max-w-full ${l.className}`}
          >
            {l.content}
          </motion.div>
        ))}
      </div>
      {panel.countdown && (
        <motion.div
          initial={animated ? { opacity: 0, y: 6 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: end }}
          style={{ fontFamily: CHALK_FONT }}
        >
          <HeroCountdown
            invitation={invitation}
            className="mt-3"
            cellClassName="border border-dashed border-[#F4F1E6]/30 rounded-md"
            numberClassName={`text-[#F4F1E6] text-3xl ${CHALK_GLOW}`}
            labelClassName="text-[#A9D6EC] text-sm"
          />
        </motion.div>
      )}
      <Doodle kind={panel.doodle} animated={animated} delay={end} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero: çerçeveli kara tahta + tebeşir rafı                           */
/* ------------------------------------------------------------------ */

function TahtaHero({ invitation, mode }: HeroRenderProps & { mode: Mode }) {
  useTemplateFont('Caveat:wght@400..700');
  const d = useHeroData(invitation);
  const animated = useAnimated(mode);
  const showTimer = !!invitation.showTimer;
  const panels = useMemo(() => buildPanels(d, showTimer), [d, showTimer]);
  const [index, setIndex] = useState(0);
  const [visited, setVisited] = useState(false);
  const [wiping, setWiping] = useState(false);
  const [chalk, setChalk] = useState<TebesirId | null>(null);
  const filterId = `kt-${useId().replace(/:/g, '')}`;

  const boardRef = useRef<HTMLDivElement | null>(null);
  const dustRef = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef<HTMLCanvasElement | null>(null);
  const emit = useTebesirTozu(dustRef, animated);
  const wipe = useMotionValue(0);
  const eraserLeft = useTransform(wipe, (v) => `${-22 + v * 124}%`);

  const safeIndex = index % panels.length;
  const panel = panels[safeIndex];

  // Yazarken tebeşirin ucundan toz dökülür: satırın görünür kenarını izle.
  const onWriteDust = useCallback(
    (els: HTMLElement[], timings: { delay: number; dur: number }[]) => {
      const board = boardRef.current;
      if (!board) return () => undefined;
      let raf = 0;
      const t0 = performance.now();
      const last = timings.length ? timings[timings.length - 1].delay + timings[timings.length - 1].dur : 0;
      const step = (now: number) => {
        const t = (now - t0) / 1000;
        const b = board.getBoundingClientRect();
        els.forEach((el, i) => {
          const tm = timings[i];
          if (!tm || t < tm.delay || t > tm.delay + tm.dur) return;
          const r = el.getBoundingClientRect();
          const p = (t - tm.delay) / tm.dur;
          emit(r.left - b.left + r.width * p, r.top - b.top + r.height * (0.35 + Math.random() * 0.5), 2, '#F4F1E6', 6);
        });
        if (t < last) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    },
    [emit]
  );

  // Çizim katmanı: misafir tebeşir seçince parmağıyla tahtaya yazar.
  const drawCtx = useRef<CanvasRenderingContext2D | null>(null);
  useEffect(() => {
    const canvas = drawRef.current;
    const ctx = canvas?.getContext('2d') ?? null;
    if (!canvas || !ctx) return;
    drawCtx.current = ctx;
    fitCanvas(canvas, ctx);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => fitCanvas(canvas, ctx)) : null;
    ro?.observe(canvas);
    return () => {
      ro?.disconnect();
      drawCtx.current = null;
    };
  }, []);

  const lastPt = useRef<{ x: number; y: number } | null>(null);
  const chalkColor = TEBESIRLER.find((c) => c.id === chalk)?.renk ?? '#F4F1E6';
  const pointAt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!chalk) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = pointAt(e);
    lastPt.current = p;
    if (drawCtx.current) tebesirCiz(drawCtx.current, p.x, p.y, p.x + 0.5, p.y + 0.5, chalkColor);
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const prev = lastPt.current;
    const ctx = drawCtx.current;
    if (!prev || !ctx) return;
    const p = pointAt(e);
    tebesirCiz(ctx, prev.x, prev.y, p.x, p.y, chalkColor);
    if (Math.random() < 0.35) emit(p.x, p.y, 1, chalkColor, 3);
    lastPt.current = p;
  };
  const onUp = () => {
    lastPt.current = null;
  };

  // Silgi: tahtayı soldan sağa siler (yazı + misafirin çizimi), sonra sıradaki panel yazılır.
  const wipeNext = () => {
    if (wiping) return;
    const canvas = drawRef.current;
    const ctx = drawCtx.current;
    const clearUpTo = (v: number) => {
      if (!canvas || !ctx) return;
      const r = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width * v, r.height);
    };
    setVisited(true);
    if (!animated) {
      clearUpTo(1);
      setIndex((i) => i + 1);
      return;
    }
    setWiping(true);
    wipe.set(0);
    setIndex((i) => i + 1);
    const board = boardRef.current;
    const unsub = wipe.on('change', (v) => {
      clearUpTo(v * 1.05);
      if (board) {
        const b = board.getBoundingClientRect();
        const x = b.width * v;
        for (let k = 0; k < 3; k++) emit(x, Math.random() * b.height, 3, '#F4F1E6', 10);
      }
    });
    animate(wipe, 1, { duration: WIPE, ease: [0.4, 0, 0.6, 1] }).then(() => {
      unsub();
      clearUpTo(1);
      setWiping(false);
    });
  };

  const enter = (delay: number, from: Record<string, number | string>) =>
    animated ? { initial: from, animate: { opacity: 1, y: 0, scale: 1, rotate: 0 }, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const } } : {};

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-3.5 pt-12 pb-20 sm:px-8">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id={filterId} x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="4" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -2.4 0 0 0 1.85" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" result="g" />
          <feDisplacementMap in="g" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Ahşap çerçeve */}
      <motion.div
        {...enter(0, { opacity: 0, y: 24, scale: 0.96, rotate: -1.5 })}
        className="relative w-full max-w-[640px] rounded-[14px] p-[10px] sm:p-[14px] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)] bg-[repeating-linear-gradient(92deg,#8A5A33_0px,#9B6A3E_6px,#80522E_11px,#946338_17px),linear-gradient(180deg,#A47243,#6E4526)] [background-blend-mode:multiply]"
      >
        <div
          ref={boardRef}
          className="relative h-[420px] sm:h-[440px] rounded-[6px] overflow-hidden bg-[radial-gradient(ellipse_at_40%_30%,#2F473C_0%,#24372F_50%,#1A2923_100%)] shadow-[inset_0_0_40px_rgba(0,0,0,0.55),inset_0_0_2px_rgba(0,0,0,0.8)] [container-type:inline-size]"
        >
          {/* Eski silinmiş tebeşir izleri */}
          <motion.svg
            {...(animated ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.9, delay: 0.3 } } : {})}
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 420"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <filter id={`${filterId}-s`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.015 0.04" numOctaves="3" seed="11" />
              <feColorMatrix values="0 0 0 0 0.93  0 0 0 0 0.95  0 0 0 0 0.9  0 0 0 1.4 -0.7" />
            </filter>
            <rect width="400" height="420" filter={`url(#${filterId}-s)`} opacity="0.22" />
            <g fill="none" stroke="#F4F1E6" strokeOpacity="0.06" strokeWidth="26" strokeLinecap="round">
              <path d="M30 90 C 120 60, 220 120, 370 80" />
              <path d="M10 330 C 140 300, 260 360, 390 320" />
            </g>
          </motion.svg>

          <AnimatePresence mode="wait" initial={false}>
            <PanelView
              key={index}
              panel={panel}
              invitation={invitation}
              animated={animated}
              first={!visited}
              filterId={filterId}
              onWriteDust={onWriteDust}
            />
          </AnimatePresence>

          <canvas
            ref={drawRef}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            className={`absolute inset-0 w-full h-full ${chalk ? 'cursor-crosshair touch-none' : 'pointer-events-none'}`}
            aria-label={chalk ? 'Tahtaya parmağınla yaz' : undefined}
            aria-hidden={chalk ? undefined : true}
          />
          {animated && <canvas ref={dustRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />}

          {/* Silgi geçişi */}
          {wiping && (
            <motion.div style={{ left: eraserLeft }} className="absolute top-0 bottom-0 w-[22%] pointer-events-none" aria-hidden="true">
              <div className="absolute inset-y-0 -left-[60%] w-[80%] bg-[linear-gradient(90deg,transparent,rgba(244,241,230,0.08))]" />
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-16 rounded-md bg-[linear-gradient(180deg,#C89A62_0%,#A9783F_58%,#5B5F66_58%,#4A4D53_100%)] shadow-[0_8px_20px_rgba(0,0,0,0.5)]" />
            </motion.div>
          )}

          {/* Panel noktaları */}
          <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-2" aria-hidden="true">
            {panels.map((p, i) => (
              <span key={p.id} className={`h-1.5 rounded-full transition-all duration-300 ${i === safeIndex ? 'w-5 bg-[#F4F1E6]/80' : 'w-1.5 bg-[#F4F1E6]/30'}`} />
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {panel.label}
          </p>
        </div>

        {/* Tebeşir rafı */}
        <motion.div
          {...enter(0.45, { opacity: 0, y: -8 })}
          className="relative -mx-[6px] sm:-mx-[10px] mt-[8px] h-12 rounded-b-[10px] rounded-t-[3px] bg-[linear-gradient(180deg,#B07B48,#7A4C2A)] shadow-[inset_0_2px_0_rgba(255,255,255,0.15),0_6px_12px_rgba(0,0,0,0.4)] flex items-center justify-between px-3"
        >
          <div className="flex items-end gap-2" role="group" aria-label="Tebeşirler">
            {TEBESIRLER.map((c, i) => (
              <motion.button
                key={c.id}
                type="button"
                {...enter(0.6 + i * 0.07, { opacity: 0, y: -10, rotate: -12 })}
                onClick={() => setChalk((cur) => (cur === c.id ? null : c.id))}
                aria-pressed={chalk === c.id}
                aria-label={c.ad}
                className={`h-3.5 w-9 sm:w-11 rounded-[3px] shadow-[0_2px_3px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${chalk === c.id ? '-translate-y-1.5 ring-2 ring-white/70' : ''}`}
                style={{ background: `linear-gradient(180deg, ${c.renk}, ${c.renk}CC)` }}
              />
            ))}
          </div>
          <motion.button
            type="button"
            {...enter(0.95, { opacity: 0, y: -10 })}
            whileTap={{ scale: 0.92 }}
            onClick={wipeNext}
            aria-label="Silgi: tahtayı sil, sonraki yazıya geç"
            className="relative h-9 w-[74px] rounded-md overflow-hidden shadow-[0_3px_6px_rgba(0,0,0,0.4)] bg-[linear-gradient(180deg,#C89A62_0%,#A9783F_55%,#5B5F66_55%,#45484E_100%)] flex items-center justify-center text-[#2A1A0C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Eraser className="w-4 h-4 -mt-3" strokeWidth={2.2} />
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.p
        {...(animated ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay: 2.4 } } : {})}
        style={{ fontFamily: CHALK_FONT }}
        className="mt-4 text-center text-lg text-[#C9CFC3]"
      >
        {chalk ? 'Parmağınla tahtaya yaz · silgiyle temizle' : 'Silgiye dokun, tahta silinsin · tebeşir al, sen de yaz'}
      </motion.p>
    </div>
  );
}

/**
 * MezuniyetKaraTahta — "Kara Tahta": ahşap çerçeveli, tebeşir lekeli bir okul
 * tahtası. Bilgiler satır satır tebeşirle yazılır (SVG pürüz filtresi + soldan
 * sağa açılan kırpma, çizim ucundan canvas tebeşir tozu), karalamalar
 * `pathLength` ile çizilir. Silgiye dokununca tahta soldan sağa silinip sıradaki
 * panel yazılır; raftan tebeşir alan misafir parmağıyla tahtaya çizer.
 * Önizleme ve azaltılmış hareket kipinde yazı baştan tamdır, toz/rAF kurulmaz.
 */
export function MezuniyetKaraTahta({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={TAHTA_FLAVOR}
      mode={mode}
      themeOverride={TAHTA_TEMASI}
      renderBackdrop={(state) => <TahtaBackdrop {...state} />}
      renderHero={(props) => <TahtaHero {...props} mode={mode} />}
    />
  );
}
