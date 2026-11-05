import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { NISAN_FLAVOR } from '../flavors';

type Mode = 'preview' | 'live';
/** cup: fincan dik · flip: ters çevriliyor · read: telve akıyor · done: son kare (statik). */
type Phase = 'cup' | 'flip' | 'read' | 'done';

const FLIP_MS = 1350;
const FLOW_MS = 3000;
const FORTUNE =
  'Fincanda bir yüzük, bir kuş ve upuzun bir yol görünüyor: yakında bir söz kesilecek, kahveler şekerli içilecek. Bir de davet çıkmış — gelmezsen fal tutmaz!';

const KAHVE_TEMASI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#F4EADB] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#3B2418]',
  surface: 'bg-[#FFF9F0]/85 backdrop-blur-sm shadow-[0_18px_40px_-26px_rgba(92,52,28,0.55)]',
  border: 'border-[#B8733A]/25',
  heading: 'text-[#4A2A1A]',
  body: 'text-[#6B4C3A]',
  accent: 'text-[#A8622C]',
  accentBg: 'bg-[#A8622C]',
  accentSoft: 'bg-[#B8733A]/10',
  input:
    'w-full bg-[#FFFBF5] border border-[#B8733A]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#3B2418] placeholder:text-[#A8907E] focus:outline-none focus:border-[#A8622C] focus:ring-2 focus:ring-[#A8622C]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#C98448,#9A5524)] hover:brightness-110 text-[#FFF6EA] shadow-lg shadow-[#9A5524]/30',
  buttonGhost: 'border border-[#A8622C]/35 text-[#4A2A1A] hover:bg-[#A8622C]/10',
  divider: 'bg-[#B8733A]/25',
  timelineLine: 'from-[#A8622C]/70 via-[#B8733A]/35 to-transparent',
  envelope: {
    paper: 'bg-[#EADBC4]',
    flap: 'bg-[#E0CDB2]',
    seal: 'bg-[#A8622C] text-[#FFF6EA]',
    glow: 'bg-[#B8733A]/25',
    card: 'bg-[#FFF9F0] border border-[#B8733A]/35'
  },
  mapHeader: 'bg-[#EADBC4]',
  footer: { names: 'text-[#6B4C3A]', branding: 'text-[#A8907E]' }
};

const KAHVE_FLAVOR: TemplateFlavor = {
  ...NISAN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Bir fincan kahvenin kırk yıl hatırı var',
  headings: { timeline: 'Günün Akışı', details: 'Kahve Nerede İçilecek', gallery: 'Fincandan Kareler', gift: 'Hediye', rsvp: 'Falına Katıl' }
};

/** Buhar dalgası + ipucu nabzı; `prefers-reduced-motion` altında hiçbiri oynamaz. */
const KEYFRAMES = `
@keyframes nkf-steam { 0% { transform: translateY(6px) scaleY(.9); opacity: 0; } 30% { opacity: .55; } 100% { transform: translateY(-26px) scaleY(1.1); opacity: 0; } }
@keyframes nkf-pulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
.nkf-steam { transform-box: fill-box; transform-origin: 50% 100%; animation: nkf-steam 2.6s ease-out infinite; }
.nkf-pulse { animation: nkf-pulse 2s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .nkf-steam, .nkf-pulse { animation: none; } }
`;

/* ------------------------------------------------------------------ */
/* Telve motoru (canvas 2B)                                             */
/* ------------------------------------------------------------------ */

interface Grain {
  /** Hedef (fincan içi, -1..1 normalize). */
  tr: number;
  ta: number;
  /** Başlangıç açısı (kenardan girer). */
  sa: number;
  delay: number;
  dur: number;
  size: number;
  alpha: number;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Organik desen alanı: birkaç sinüs katmanı, telve buraya toplanır. */
function field(x: number, y: number) {
  const r = Math.hypot(x, y);
  const th = Math.atan2(y, x);
  return (
    Math.sin(x * 4.3 + 1.3) * Math.cos(y * 3.9 - 0.8) +
    0.6 * Math.sin((x + y) * 6.1 + 2) +
    0.45 * Math.cos(r * 12 - th * 3) +
    0.3 * Math.sin(th * 5 + r * 4)
  );
}

function buildGrains(): Grain[] {
  const rnd = mulberry32(20261105);
  const out: Grain[] = [];
  const push = (x: number, y: number, size: number, alpha: number) => {
    const tr = Math.hypot(x, y);
    const ta = Math.atan2(y, x);
    out.push({
      tr,
      ta,
      sa: ta - 0.9 - rnd() * 1.1,
      delay: (1 - tr) * 0.55 + rnd() * 0.25,
      dur: 0.32 + rnd() * 0.22,
      size,
      alpha
    });
  };
  // Organik akıntılar: ortadaki yazı alanı (r < 0.56) boş kalır.
  let guard = 0;
  while (out.length < 2300 && guard++ < 60000) {
    const r = 0.56 + Math.sqrt(rnd()) * 0.4;
    const a = rnd() * Math.PI * 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    const f = field(x, y);
    if (f > 0.3 || (f > -0.1 && rnd() < 0.1)) push(x, y, 0.5 + rnd() * (f > 0.9 ? 1.9 : 1.2), 0.3 + rnd() * 0.5);
  }
  // Kenar tortusu.
  for (let i = 0; i < 260; i++) {
    const a = rnd() * Math.PI * 2;
    const r = 0.93 + rnd() * 0.05;
    push(Math.cos(a) * r, Math.sin(a) * r, 0.5 + rnd() * 0.9, 0.2 + rnd() * 0.35);
  }
  // Semboller: yüzük (sağ üst) ve kuş (sol alt) — falın "okunan" şekilleri.
  for (let i = 0; i < 70; i++) {
    const a = (i / 70) * Math.PI * 2;
    const j = (rnd() - 0.5) * 0.012;
    push(0.5 + Math.cos(a) * (0.085 + j), -0.52 + Math.sin(a) * (0.085 + j), 0.9 + rnd() * 0.6, 0.75);
  }
  for (let i = 0; i < 14; i++) push(0.5 + (rnd() - 0.5) * 0.05, -0.64 - rnd() * 0.04, 1 + rnd() * 0.6, 0.8);
  for (let i = 0; i < 60; i++) {
    const t = i / 59;
    const wing = Math.sin(t * Math.PI);
    const side = t < 0.5 ? -1 : 1;
    push(-0.56 + (t - 0.5) * 0.24, 0.5 - wing * 0.07 * (1 + 0.3 * side) + (rnd() - 0.5) * 0.012, 0.9 + rnd() * 0.5, 0.75);
  }
  return out;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function drawGrounds(ctx: CanvasRenderingContext2D, size: number, grains: Grain[], t: number) {
  ctx.clearRect(0, 0, size, size);
  const c = size / 2;
  const R = c * 0.97;
  const s = size / 340;
  // Islak iz: telve geçtikçe porselen hafifçe kahverengiye döner.
  const wash = Math.min(1, t * 1.4);
  if (wash > 0) {
    const g = ctx.createRadialGradient(c, c, R * 0.5, c, c, R);
    g.addColorStop(0, 'rgba(120,72,40,0)');
    g.addColorStop(0.75, `rgba(120,72,40,${0.1 * wash})`);
    g.addColorStop(1, `rgba(80,45,24,${0.28 * wash})`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(c, c, R, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const gr of grains) {
    const p = Math.min(1, Math.max(0, (t - gr.delay) / gr.dur));
    if (p <= 0) continue;
    const e = easeOut(p);
    const r = 0.97 + (gr.tr - 0.97) * e;
    const a = gr.sa + (gr.ta - gr.sa) * e;
    const x = c + Math.cos(a) * r * R;
    const y = c + Math.sin(a) * r * R;
    const rad = gr.size * s * (0.6 + 0.4 * e);
    ctx.fillStyle = `rgba(52,30,18,${gr.alpha * (0.4 + 0.6 * e)})`;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
    if (p < 1) {
      // Akış kuyruğu
      ctx.fillStyle = `rgba(52,30,18,${gr.alpha * 0.18})`;
      ctx.beginPath();
      ctx.arc(c + Math.cos(a - 0.05) * r * R, c + Math.sin(a - 0.05) * r * R, rad * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** Fincan içi: telve akışı. `animate` false ise yalnızca son kare çizilir. */
function GroundsCanvas({ animate }: { animate: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const grainsRef = useRef<Grain[] | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (!grainsRef.current) grainsRef.current = buildGrains();
    const grains = grainsRef.current;
    let raf = 0;
    let start = 0;
    let progress = animate ? 0 : 1;
    let cssSize = 0;

    const resize = () => {
      cssSize = canvas.clientWidth;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(cssSize * dpr);
      canvas.height = Math.round(cssSize * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawGrounds(ctx, cssSize, grains, progress);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (animate) {
      const tick = (now: number) => {
        if (!start) start = now;
        progress = Math.min(1, (now - start) / FLOW_MS);
        drawGrounds(ctx, cssSize, grains, progress);
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [animate]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-full" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/* Fincan + tabak (SVG)                                                */
/* ------------------------------------------------------------------ */

function Saucer() {
  return (
    <svg viewBox="0 0 240 60" className="absolute inset-x-0 bottom-[8%] w-full" aria-hidden="true">
      <ellipse cx="120" cy="34" rx="112" ry="22" fill="#7A4524" opacity="0.18" />
      <ellipse cx="120" cy="28" rx="110" ry="22" fill="#FBF4EA" stroke="#B8733A" strokeWidth="2" />
      <ellipse cx="120" cy="28" rx="96" ry="17" fill="none" stroke="#B8733A" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="2 4" />
      <ellipse cx="120" cy="27" rx="50" ry="9" fill="#EADBC4" />
    </svg>
  );
}

function Cup({ flipped }: { flipped: boolean }) {
  return (
    <svg viewBox="0 0 200 170" className="w-full h-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="nkf-body" x1="0" x2="1">
          <stop offset="0" stopColor="#E9DCC8" />
          <stop offset="0.35" stopColor="#FFFBF4" />
          <stop offset="1" stopColor="#D9C6AA" />
        </linearGradient>
        <radialGradient id="nkf-coffee" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#7A4A2A" />
          <stop offset="0.55" stopColor="#4A2A18" />
          <stop offset="1" stopColor="#2C180D" />
        </radialGradient>
      </defs>
      {/* Kulp */}
      <path d="M150 62 C 186 56, 190 104, 146 112" fill="none" stroke="#B8733A" strokeWidth="9" strokeLinecap="round" />
      <path d="M150 62 C 180 58, 183 100, 146 110" fill="none" stroke="#F3E6D3" strokeWidth="4" strokeLinecap="round" />
      {/* Gövde */}
      <path d="M40 44 L 160 44 C 158 100, 146 138, 118 148 L 82 148 C 54 138, 42 100, 40 44 Z" fill="url(#nkf-body)" stroke="#B8733A" strokeWidth="1.5" />
      {/* Bakır bant + motif */}
      <path d="M44 66 C 80 74, 120 74, 156 66" fill="none" stroke="#B8733A" strokeWidth="3" />
      <path d="M48 80 C 82 87, 118 87, 152 80" fill="none" stroke="#B8733A" strokeWidth="1" strokeOpacity="0.6" />
      {[64, 82, 100, 118, 136].map((x, i) => (
        <path key={x} d={`M${x} ${102 + (i === 2 ? 2 : 0)} q 5 -9 0 -14 q -5 5 0 14 Z`} fill="#B8733A" opacity="0.75" />
      ))}
      {/* Ağız + kahve + köpük */}
      <ellipse cx="100" cy="44" rx="60" ry="11" fill="#F8EEDF" stroke="#B8733A" strokeWidth="1.5" />
      <motion.g initial={false} animate={{ opacity: flipped ? 0 : 1 }} transition={{ duration: 0.3 }}>
        <ellipse cx="100" cy="45" rx="53" ry="8.5" fill="url(#nkf-coffee)" />
        <ellipse cx="100" cy="45" rx="53" ry="8.5" fill="none" stroke="#B07A4E" strokeWidth="2.5" strokeOpacity="0.8" />
        <ellipse cx="88" cy="43.5" rx="12" ry="2.4" fill="#C79A6E" opacity="0.55" />
      </motion.g>
    </svg>
  );
}

function Steam() {
  return (
    <svg viewBox="0 0 200 60" className="absolute left-0 right-0 -top-[18%] w-full h-[30%] pointer-events-none" aria-hidden="true">
      {[78, 100, 122].map((x, i) => (
        <path
          key={x}
          className="nkf-steam"
          style={{ animationDelay: `${i * 0.7}s` }}
          d={`M${x} 58 c -8 -10, 8 -18, 0 -28 c -8 -10, 8 -16, 0 -26`}
          fill="none"
          stroke="#A8907E"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */

function KahveHero({ invitation, mode }: HeroRenderProps & { mode: Mode }) {
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const interactive = mode === 'live' && !reduced;
  const [phase, setPhase] = useState<Phase>(interactive ? 'cup' : 'done');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!interactive) setPhase('done');
  }, [interactive]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flip = useCallback(() => {
    if (phase !== 'cup') return;
    setPhase('flip');
    timer.current = window.setTimeout(() => setPhase('read'), FLIP_MS);
  }, [phase]);
  const skip = useCallback(() => {
    window.clearTimeout(timer.current);
    setPhase('done');
  }, []);

  const revealed = phase === 'read' || phase === 'done';
  const flowing = phase === 'read';
  /** Akış sırasında yazılar telvenin arasından sırayla belirir; statikte anında. */
  const appear = (delay: number) =>
    flowing
      ? { initial: { opacity: 0, filter: 'blur(6px)', y: 6 }, animate: { opacity: 1, filter: 'blur(0px)', y: 0 }, transition: { duration: 0.9, delay, ease: 'easeOut' as const } }
      : { initial: false as const };
  const names = d.hasNames ? d.people : [NO_NAMES];

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-5 pt-12 pb-20 text-center">
      <style>{KEYFRAMES}</style>
      <h1 className="sr-only">
        {d.hasNames ? d.people.join(' & ') : NO_NAMES}
        {d.date.day ? ` — ${d.date.day}` : ''}
      </h1>
      <p className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-[#A8622C]">{d.title || KAHVE_FLAVOR.tagline}</p>

      <div className="relative mt-6 w-[min(86vw,340px)] sm:w-[380px] aspect-square">
        <AnimatePresence initial={false}>
          {!revealed && (
            <motion.div
              key="cup"
              className="absolute inset-0"
              exit={{ opacity: 0, scale: 1.15, transition: { duration: 0.45 } }}
              style={{ perspective: 700 }}
            >
              <Saucer />
              <button
                type="button"
                onClick={flip}
                disabled={phase !== 'cup'}
                aria-label="Fincanı tabağa kapat ve falı aç"
                className="absolute left-[12%] right-[12%] bottom-[19%] h-[68%] cursor-pointer disabled:cursor-default rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8622C] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EADB]"
              >
                <motion.div
                  className="relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                  initial={{ opacity: 0, y: 24, rotateX: 18 }}
                  animate={
                    phase === 'flip'
                      ? { opacity: 1, y: [0, -70, -40, 6], rotateX: [0, 35, 10, 0], rotateZ: [0, -25, 150, 180], scale: [1, 1.05, 1, 0.94] }
                      : { opacity: 1, y: 0, rotateX: 0, rotateZ: 0 }
                  }
                  transition={phase === 'flip' ? { duration: FLIP_MS / 1000 - 0.15, ease: 'easeInOut', times: [0, 0.3, 0.75, 1] } : { duration: 0.9, ease: 'easeOut' }}
                  whileHover={phase === 'cup' ? { y: -4, rotateZ: -3 } : undefined}
                  whileTap={phase === 'cup' ? { scale: 0.97 } : undefined}
                >
                  {phase === 'cup' && <Steam />}
                  <Cup flipped={phase === 'flip'} />
                </motion.div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {revealed && (
          <motion.div
            className="absolute inset-0 rounded-full p-[3.5%] [container-type:inline-size] bg-[conic-gradient(from_200deg,#C98448,#8E4E22,#E0A56E,#9A5524,#C98448)] shadow-[0_24px_50px_-24px_rgba(74,42,26,0.75)]"
            {...(flowing
              ? { initial: { opacity: 0, scale: 0.7, rotate: -20 }, animate: { opacity: 1, scale: 1, rotate: 0 }, transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } }
              : { initial: false as const })}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden bg-[radial-gradient(circle_at_42%_38%,#FFFDF8_0%,#F6EDE0_55%,#E2D0B8_100%)] shadow-[inset_0_6px_18px_rgba(92,52,28,0.35)]">
              <GroundsCanvas animate={flowing} />
              <div className="absolute inset-[22%] flex flex-col items-center justify-center" aria-hidden="true">
                <motion.p {...appear(1.5)} className="font-cormorant italic font-semibold leading-[0.95] text-[#3B2418] text-[clamp(1.2rem,9cqw,2.2rem)] break-words max-w-full">
                  {names.map((p, i) => (
                    <React.Fragment key={p + i}>
                      {i > 0 && <span className="block my-0.5 text-[0.5em] not-italic text-[#A8622C]">&amp;</span>}
                      <span className="block">{p}</span>
                    </React.Fragment>
                  ))}
                </motion.p>
                {d.date.day && (
                  <motion.p {...appear(2.1)} className="mt-2 text-[10px] tracking-[0.22em] uppercase text-[#7A4A2A]">
                    {d.date.day}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {phase === 'cup' && (
        <div className="mt-5 flex flex-col items-center gap-3">
          <p className="nkf-pulse font-cormorant italic text-lg text-[#6B4C3A]">Fincanı kapatmak için dokun</p>
          <button
            type="button"
            onClick={skip}
            className="text-[11px] tracking-[0.2em] uppercase text-[#A8622C] underline underline-offset-4 decoration-[#A8622C]/40 hover:decoration-[#A8622C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8622C] rounded"
          >
            Falı hemen göster
          </button>
        </div>
      )}

      {revealed && (
        <div className="flex flex-col items-center">
          <motion.figure {...appear(2.7)} className="relative mt-7 max-w-sm rounded-2xl border border-[#B8733A]/25 bg-[#FFF9F0]/80 px-5 py-4 shadow-[0_14px_30px_-22px_rgba(92,52,28,0.6)]">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#F4EADB] px-3 text-[10px] tracking-[0.35em] uppercase text-[#A8622C]">Falın</span>
            <blockquote className="font-cormorant italic text-[1.05rem] leading-snug text-[#4A2A1A]">{FORTUNE}</blockquote>
          </motion.figure>
          <motion.div {...appear(3.2)} className="flex flex-col items-center">
            {(d.date.weekday || d.date.time) && (
              <p className="mt-6 text-[11px] tracking-[0.3em] uppercase text-[#6B4C3A]">
                {[d.date.weekday, d.date.time].filter(Boolean).join(' · ')}
              </p>
            )}
            {d.venue && <p className="mt-2 font-cormorant text-xl text-[#3B2418]">{d.venue}</p>}
            <HeroCountdown invitation={invitation} className="mt-5" numberClassName="font-cormorant text-[#4A2A1A]" labelClassName="text-[#8A6A56]" />
            {d.subtitle && <p className="mt-5 max-w-md font-cormorant italic text-lg text-[#6B4C3A]">{d.subtitle}</p>}
          </motion.div>
        </div>
      )}
    </div>
  );
}

function KahveBackdrop() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#FBF4EA_0%,#F4EADB_50%,#E8D6BE_100%)]" aria-hidden="true">
      {/* Fincan izleri: tabağa düşmüş kahve halkaları */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 800">
        <g fill="none" stroke="#8E4E22">
          <circle cx="56" cy="120" r="44" strokeWidth="3" opacity="0.08" strokeDasharray="60 8 120 14" />
          <circle cx="60" cy="124" r="40" strokeWidth="1" opacity="0.07" />
          <circle cx="352" cy="520" r="58" strokeWidth="3.5" opacity="0.07" strokeDasharray="140 10 90 20" />
          <circle cx="40" cy="700" r="36" strokeWidth="2.5" opacity="0.06" strokeDasharray="80 12 40 6" />
        </g>
      </svg>
    </div>
  );
}

/**
 * NisanKahveFali — "Kahve Falı": tabakta bir Türk kahvesi fincanı. Misafir
 * fincana dokununca fincan 3B çevrilip tabağa kapanır; ardından fincanın içi
 * yukarıdan görünür ve telve canvas 2B üzerinde kenardan içeri akarak organik
 * desenler (bir yüzük, bir kuş) oluşturur. İsimler, tarih ve şakacı bir fal
 * desenlerin arasından belirir. "Falı hemen göster" ile adım atlanabilir.
 * Önizleme ve azaltılmış hareket kipinde son kare statik çizilir (döngü yok).
 */
export function NisanKahveFali({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KAHVE_FLAVOR}
      mode={mode}
      themeOverride={KAHVE_TEMASI}
      renderBackdrop={() => <KahveBackdrop />}
      renderHero={(props) => <KahveHero {...props} mode={mode} />}
    />
  );
}
