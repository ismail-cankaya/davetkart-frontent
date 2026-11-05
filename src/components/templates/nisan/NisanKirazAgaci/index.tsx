import React, { useEffect, useMemo, useRef } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { NISAN_FLAVOR } from '../flavors';
import { SEASON_BLOOM, createTree, useCanvasLoop, type TreeBox } from './kirazMotoru';

type Mode = 'preview' | 'live';

/** Açılış süresi: ağaç büyür ve çiçeklenir (season 0 → SEASON_BLOOM). */
const GROW_SECONDS = 3.6;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const KIRAZ_TEMASI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#FBF5EF] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-medium',
  page: 'text-[#4A2B33]',
  surface: 'bg-white/70 backdrop-blur-md shadow-[0_10px_40px_-24px_rgba(190,90,115,0.45)]',
  border: 'border-[#E8B7C3]/45',
  heading: 'text-[#5A2E3A]',
  body: 'text-[#7A5560]',
  accent: 'text-[#C25A78]',
  accentBg: 'bg-[#D97A95]',
  accentSoft: 'bg-[#F4C6D2]/30',
  input:
    'w-full bg-white/80 border border-[#E8B7C3]/60 rounded-lg px-3.5 py-2.5 text-sm text-[#4A2B33] placeholder:text-[#B79AA2] focus:outline-none focus:border-[#D97A95] focus:ring-2 focus:ring-[#D97A95]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#E99AB0,#C95F7E)] hover:brightness-105 text-white shadow-lg shadow-[#D97A95]/30',
  buttonGhost: 'border border-[#D97A95]/40 text-[#5A2E3A] hover:bg-[#F4C6D2]/25',
  divider: 'bg-[#E8B7C3]/45',
  timelineLine: 'from-[#D97A95]/80 via-[#E8B7C3]/45 to-transparent',
  envelope: {
    paper: 'bg-[#F8E9E6]',
    flap: 'bg-[#F3DAD9]',
    seal: 'bg-[#C95F7E] text-white',
    glow: 'bg-[#F4C6D2]/40',
    card: 'bg-[#FFFBF7] border border-[#E8B7C3]/60'
  },
  mapHeader: 'bg-[#F8E9E6]',
  footer: { names: 'text-[#7A5560]', branding: 'text-[#B79AA2]' }
};

const KIRAZ_FLAVOR: TemplateFlavor = {
  ...NISAN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Kiraz çiçekleri açarken söz veriyoruz',
  headings: { timeline: 'Günün Akışı', details: 'Ağacın Altında', gallery: 'Çiçek Çiçek Anılar', gift: 'Hediye', rsvp: 'Katılımınızı Bildirin' }
};

/** Animasyon ancak misafir sayfasında ve hareket azaltılmamışsa çalışır. */
function useAnimated(mode: Mode) {
  const reduced = useReducedMotion() ?? false;
  return mode === 'live' && !reduced;
}

function KirazBackdrop({ heroExit }: BackdropState) {
  // Mevsim ilerledikçe gökyüzü fildişinden yaz şeftalisine ısınır
  const warm = useTransform(heroExit, [0, 1], [0, 1]);
  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#FDF8F3_0%,#FBEFEF_55%,#F7E3E6_100%)]">
      <motion.div
        style={{ opacity: warm }}
        className="absolute inset-0 bg-[linear-gradient(180deg,#FFF6EC_0%,#FCE9DD_60%,#F6DCD4_100%)]"
      />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[140%] h-[60%] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.9),transparent)]" />
      <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="absolute bottom-0 inset-x-0 w-full h-[12%]" aria-hidden="true">
        <path d="M0 50 C 90 30, 160 46, 230 38 C 300 30, 350 44, 400 36 V 80 H 0 Z" fill="#F3D9DD" opacity="0.7" />
        <path d="M0 62 C 80 52, 170 66, 250 58 C 320 52, 360 60, 400 56 V 80 H 0 Z" fill="#EDC9CF" opacity="0.6" />
      </svg>
    </div>
  );
}

function KirazHero({ invitation, scrollContainer, mode }: HeroRenderProps & { mode: Mode }) {
  const d = useHeroData(invitation);
  const animated = useAnimated(mode);
  const reduced = useReducedMotion() ?? false;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engine = useMemo(() => createTree(animated), [animated]);

  // Mevsim = açılıştaki büyüme + kaydırma. Statik kipte baştan tam çiçek.
  const intro = useMotionValue(animated ? 0 : SEASON_BLOOM);
  useEffect(() => {
    if (!animated) {
      intro.set(SEASON_BLOOM);
      return;
    }
    intro.set(0);
    const controls = animate(intro, SEASON_BLOOM, { duration: GROW_SECONDS, delay: 0.5, ease: [0.4, 0, 0.3, 1] });
    return () => controls.stop();
  }, [animated, intro]);

  const { scrollY } = useScroll({ container: scrollContainer });
  const exit = useTransform(scrollY, (y) => Math.min(1, Math.max(0, y / (scrollContainer?.current?.clientHeight || 1))));
  const season = useTransform([intro, exit], ([a, b]: number[]) =>
    mode === 'preview' ? SEASON_BLOOM : Math.min(1, a + Math.min(1, b / 0.55) * (1 - SEASON_BLOOM))
  );

  useCanvasLoop(
    canvasRef,
    (ctx, size, t, dt) => {
      const canvas = canvasRef.current;
      const boxEl = boxRef.current;
      let box: TreeBox = { x: size.w * 0.1, y: size.h * 0.3, w: size.w * 0.8, h: size.h * 0.45 };
      if (canvas && boxEl) {
        const c = canvas.getBoundingClientRect();
        const b = boxEl.getBoundingClientRect();
        box = { x: b.left - c.left, y: b.top - c.top, w: b.width, h: b.height };
      }
      engine.draw(ctx, size, box, season.get(), t, dt);
    },
    animated,
    season
  );

  // Gerçek etkileşim: dokun / sürükle → rüzgâr yaprakları savurur
  const lastPt = useRef<{ x: number; y: number; t: number } | null>(null);
  const toLocal = (e: React.PointerEvent) => {
    const r = canvasRef.current?.getBoundingClientRect();
    return { x: e.clientX - (r?.left ?? 0), y: e.clientY - (r?.top ?? 0) };
  };
  const onDown = (e: React.PointerEvent) => {
    if (!animated) return;
    const p = toLocal(e);
    lastPt.current = { ...p, t: performance.now() };
    engine.gust(p.x, p.y, 0, 0);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!animated || !lastPt.current) return;
    const p = toLocal(e);
    const now = performance.now();
    const dtm = Math.max(16, now - lastPt.current.t) / 1000;
    if (now - lastPt.current.t < 40) return;
    engine.gust(p.x, p.y, ((p.x - lastPt.current.x) / dtm) * 0.6, ((p.y - lastPt.current.y) / dtm) * 0.6);
    lastPt.current = { ...p, t: now };
  };
  const onUp = () => {
    lastPt.current = null;
  };

  // Katmanlı açılış: etiket → ağaç büyür → isimler çiçekle açar → tarih/sayaç
  const rise = (delay: number) =>
    animated
      ? {
          initial: { opacity: 0, y: 14, filter: 'blur(6px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 1.1, delay, ease: EASE }
        }
      : reduced && mode === 'live'
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, delay: delay * 0.1 } }
        : {};

  return (
    <div ref={rootRef} dir="auto" className="relative grow flex flex-col items-center px-6 pt-12 pb-20 text-center">
      <canvas
        ref={canvasRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onPointerCancel={onUp}
        className="absolute inset-0 w-full h-full [touch-action:pan-y]"
        aria-hidden="true"
      />

      <div className="relative z-[1] flex flex-col items-center pointer-events-none">
        <motion.p {...rise(0.1)} className="text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#C25A78]">
          {d.title || KIRAZ_FLAVOR.tagline}
        </motion.p>

        <motion.h1
          {...rise(2.2)}
          className="mt-4 font-cormorant italic font-medium leading-[0.98] text-[#5A2E3A] text-[clamp(2.4rem,11cqw,4.8rem)] break-words max-w-full [text-shadow:0_1px_18px_rgba(255,255,255,0.9)]"
        >
          {d.hasNames ? (
            d.people.map((p, i) => (
              <React.Fragment key={p + i}>
                {i > 0 && <span className="block my-0.5 text-[0.42em] not-italic text-[#D97A95]">&amp;</span>}
                <span className="block">{p}</span>
              </React.Fragment>
            ))
          ) : (
            <span className="block">{NO_NAMES}</span>
          )}
        </motion.h1>
      </div>

      {/* Ağacın oturduğu kutu: canvas burayı ölçer */}
      <div ref={boxRef} className="relative w-full max-w-[560px] h-[min(46vh,400px)] min-h-[260px] mt-2 pointer-events-none" aria-hidden="true" />

      <div className="relative z-[1] flex flex-col items-center pointer-events-none">
        {d.date.day && (
          <motion.p {...rise(3.0)} className="mt-5 font-cormorant text-2xl text-[#5A2E3A]">
            {d.date.weekday && <span className="block text-[11px] tracking-[0.35em] uppercase text-[#9A6B78] mb-1">{d.date.weekday}</span>}
            {d.date.day}
            {d.date.time && ` · ${d.date.time}`}
          </motion.p>
        )}
        {d.venue && (
          <motion.p {...rise(3.2)} className="mt-2 text-sm text-[#7A5560]">
            {d.venue}
          </motion.p>
        )}
        <motion.div {...rise(3.4)}>
          <HeroCountdown invitation={invitation} className="mt-6" numberClassName="font-cormorant text-[#C25A78]" labelClassName="text-[#9A6B78]" />
        </motion.div>
        {d.subtitle && (
          <motion.p {...rise(3.6)} className="mt-6 max-w-md font-cormorant italic text-lg text-[#6E4752]">
            {d.subtitle}
          </motion.p>
        )}
        {animated && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.8, 0] }}
            transition={{ duration: 6, delay: 4.4, times: [0, 0.15, 0.8, 1] }}
            className="mt-6 text-[10px] tracking-[0.3em] uppercase text-[#B5848F]"
          >
            Dokun · rüzgâr essin
          </motion.p>
        )}
      </div>
    </div>
  );
}

/**
 * NisanKirazAgaci — "Kiraz Ağacı": tohumlu özyinelemeli dallanmayla üretilen
 * bir kiraz ağacı canvas 2D'de dal dal büyür, tomurcuklar açar. Kaydırdıkça
 * mevsim ilerler: çiçekler dökülür, yerlerinde kirazlar belirir. Dokunmak ya
 * da sürüklemek bir rüzgâr esintisi yaratır ve yaprakları savurur.
 * Önizleme ve azaltılmış hareket kipinde rAF kurulmaz, tek kare (tam çiçek) çizilir.
 */
export function NisanKirazAgaci({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KIRAZ_FLAVOR}
      mode={mode}
      themeOverride={KIRAZ_TEMASI}
      renderBackdrop={(state) => <KirazBackdrop {...state} />}
      renderHero={(props) => <KirazHero {...props} mode={mode} />}
    />
  );
}
