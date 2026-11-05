import React, { lazy, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { DateCountdown, ScrollCue, useTemplateFont } from '../../shared/sinema';
import { ThreeStage } from '../../shared/three';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';
import { BUTTERFLY_PALETTES, toCss, type Perch, type PointerState } from './kelebek';

const KelebekSahnesi = lazy(() => import('./KelebekSahnesi'));

const FONTS = 'Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Pinyon+Script';
const SERIF = "[font-family:'Cormorant_Garamond',var(--font-cormorant),serif]";
const SCRIPT = "[font-family:'Pinyon_Script',cursive]";
const INTERACTIVE = 'a, button, input, select, textarea, label, [role="button"]';

const THEME: SectionTheme = {
  id: 'stone',
  base: "bg-[#FBF1EA] [&_.font-serif]:[font-family:'Cormorant_Garamond',var(--font-cormorant),serif] [&_.font-serif]:font-semibold",
  page: 'text-[#3E3546]',
  surface: 'bg-white/70 backdrop-blur-md shadow-[0_20px_50px_-28px_rgba(120,90,140,0.45)]',
  border: 'border-[#E8D6E0]',
  heading: 'text-[#2F2737]',
  body: 'text-[#6E6274]',
  accent: 'text-[#B5677A]',
  accentBg: 'bg-[#B5677A]',
  accentSoft: 'bg-[#B5677A]/10',
  input:
    'w-full bg-white/80 border border-[#E8D6E0] rounded-xl px-3.5 py-2.5 text-sm text-[#2F2737] placeholder:text-[#A898A8] focus:outline-none focus:border-[#B5677A] focus:ring-2 focus:ring-[#B5677A]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(135deg,#C97C8E,#9C5A86)] hover:brightness-105 text-white shadow-lg shadow-[#B5677A]/25',
  buttonGhost: 'border border-[#E8D6E0] text-[#3E3546] hover:bg-white/70',
  divider: 'bg-[#E8D6E0]',
  timelineLine: 'from-[#B5677A]/70 via-[#8FA9E0]/45 to-transparent',
  envelope: {
    paper: 'bg-[#F6E3E6]',
    flap: 'bg-[#F0D6DB]',
    seal: 'bg-[#B5677A] text-white',
    glow: 'bg-[#F7D9A8]/50',
    card: 'bg-white border border-[#E8D6E0]'
  },
  mapHeader: 'bg-[#F6E9EE]',
  footer: { names: 'text-[#6E6274]', branding: 'text-[#A898A8]' }
};

const FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Bahar gibi bir başlangıca davetlisiniz',
  headings: { timeline: 'Günün Akışı', details: 'Bahçe Adresi', gallery: 'Bizden Kareler', gift: 'Takı & Hediye', rsvp: 'Katılımınızı Bildirin' }
};

/** Durağan kelebek (önizleme, WebGL yok, hareketi azalt). */
function StaticButterfly({ x, y, r, s, i }: { x: string; y: string; r: number; s: number; i: number }) {
  const [a, b] = BUTTERFLY_PALETTES[i % BUTTERFLY_PALETTES.length];
  return (
    <svg viewBox="-20 -16 40 32" className="absolute" style={{ left: x, top: y, width: s, rotate: `${r}deg` }} aria-hidden="true">
      <defs>
        <radialGradient id={`kanat-${i}`} cx="0" cy="0" r="22" gradientUnits="userSpaceOnUse">
          <stop offset="0.15" stopColor={toCss(a)} />
          <stop offset="1" stopColor={toCss(b)} />
        </radialGradient>
      </defs>
      {[1, -1].map((side) => (
        <g key={side} transform={`scale(${side} 1)`}>
          <ellipse cx="9.5" cy="-5" rx="10" ry="9" fill={`url(#kanat-${i})`} stroke="#2A1E28" strokeWidth="1.1" />
          <ellipse cx="7" cy="7" rx="7" ry="7" fill={`url(#kanat-${i})`} stroke="#2A1E28" strokeWidth="1.1" />
          <circle cx="15" cy="-9" r="1.4" fill="#fff" />
        </g>
      ))}
      <ellipse cx="0" cy="0" rx="1.4" ry="11" fill="#2A1E28" />
    </svg>
  );
}

const STATIC_FLIES = [
  { x: '14%', y: '22%', r: -18, s: 34 },
  { x: '78%', y: '18%', r: 22, s: 28 },
  { x: '68%', y: '38%', r: -8, s: 22 },
  { x: '22%', y: '44%', r: 12, s: 24 },
  { x: '84%', y: '66%', r: -26, s: 30 },
  { x: '9%', y: '70%', r: 16, s: 26 }
];

/** Şafak bahçesi: lavanta-şeftali gökyüzü, sisli tepeler, önde sallanan kır çiçekleri. */
function Garden({ still }: { still: boolean }) {
  const flowers = Array.from({ length: 22 }, (_, i) => ({
    x: (i * 4.7 + (i % 3) * 1.3) % 100,
    h: 70 + ((i * 37) % 60),
    c: ['#E7A6B8', '#F2C48D', '#B9C8F2', '#F7E3A1', '#D7B4E8'][i % 5],
    d: 3 + (i % 5) * 0.6
  }));
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#E7E1F5_0%,#F6E3EA_38%,#FBE5D6_62%,#F4D7C4_100%)]">
      <div className="absolute left-1/2 top-[52%] -translate-x-1/2 w-[120vmax] h-[60vmax] rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,236,206,0.9),transparent)]" />
      <svg className="absolute inset-x-0 bottom-0 w-full h-[42%]" viewBox="0 0 400 200" preserveAspectRatio="none">
        <path d="M0 110 Q 80 70 160 100 T 320 90 T 400 96 V200 H0Z" fill="#E9CFCB" opacity="0.7" />
        <path d="M0 140 Q 100 105 200 132 T 400 124 V200 H0Z" fill="#D7C2C4" opacity="0.75" />
        <path d="M0 170 Q 120 150 240 166 T 400 160 V200 H0Z" fill="#B9B1B4" opacity="0.6" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-[26%]">
        {flowers.map((f, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 origin-bottom"
            style={{ left: `${f.x}%`, height: `${f.h}%` }}
            animate={still ? undefined : { rotate: [-3, 3, -3] }}
            transition={{ duration: f.d, repeat: Infinity, ease: 'easeInOut', delay: i * 0.13 }}
          >
            <div className="absolute bottom-0 left-1/2 w-px h-full bg-[#8F9C7E]/70" />
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: f.c, boxShadow: `0 0 0 2px ${f.c}55` }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONTS);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const live = mode === 'live' && !reduced;
  const fade = (delay: number) =>
    !live ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 1.2, ease: [0.22, 1, 0.36, 1] as const } };
  const names = d.hasNames ? d.people : [NO_NAMES];

  const box = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const perches = useRef<Perch[]>([]);
  const pointer = useRef<PointerState>({ x: 0, y: 0, active: false, tapAt: 0 });

  // Konma noktaları: ad satırlarının üst kenarı boyunca, harf aralıklarına yayılmış.
  useEffect(() => {
    const el = title.current;
    const host = box.current;
    if (!el || !host) return;
    const measure = () => {
      const hb = host.getBoundingClientRect();
      const out: Perch[] = [];
      el.querySelectorAll<HTMLElement>('[data-perch]').forEach((line) => {
        const range = document.createRange();
        range.selectNodeContents(line);
        Array.from(range.getClientRects()).forEach((r) => {
          const n = Math.max(2, Math.round(r.width / 70));
          for (let k = 0; k < n; k++) out.push({ x: r.left - hb.left + (r.width * (k + 0.5)) / n, y: r.top - hb.top + r.height * 0.18 });
        });
      });
      perches.current = out;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    void document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [names.join('|')]);

  useEffect(() => {
    if (!live) return;
    const local = (e: PointerEvent) => {
      const r = box.current?.getBoundingClientRect();
      if (!r) return null;
      return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientY >= r.top && e.clientY <= r.bottom };
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      if (!p) return;
      pointer.current.x = p.x;
      pointer.current.y = p.y;
      pointer.current.active = p.inside && (e.pointerType === 'mouse' || e.buttons > 0);
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest(INTERACTIVE)) return;
      const p = local(e);
      if (!p || !p.inside) return;
      pointer.current = { x: p.x, y: p.y, active: true, tapAt: performance.now() / 1000 };
    };
    const onLeave = () => (pointer.current.active = false);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onLeave, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onLeave);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [live]);

  const fallback = (
    <div className="absolute inset-0">
      {STATIC_FLIES.map((f, i) => (
        <StaticButterfly key={i} {...f} i={i} />
      ))}
    </div>
  );

  return (
    <div className="relative grow flex flex-col">
      <div ref={box} className="relative min-h-[100svh] flex flex-col items-center justify-center px-5 pt-12 pb-28 text-center" dir="auto">
        <motion.p {...fade(0.2)} className={`${SERIF} text-[11px] font-semibold tracking-[0.42em] uppercase text-[#B5677A]`}>
          {d.title || 'Düğünümüze davetlisiniz'}
        </motion.p>
        <h1 ref={title} className={`${SCRIPT} mt-5 text-[#2F2737] leading-[1.15] text-[clamp(3rem,14cqw,6.6rem)] max-w-full break-words`}>
          {names.map((p, i) => (
            <motion.span key={p + i} {...fade(0.5 + i * 0.4)} className="block">
              {i > 0 && <span className={`${SERIF} block not-italic text-[0.28em] tracking-[0.3em] text-[#B5677A] my-1`}>&amp;</span>}
              <span data-perch>{p}</span>
            </motion.span>
          ))}
        </h1>
        <motion.p {...fade(1.5)} className={`${SERIF} mt-5 text-lg italic text-[#5E5266] max-w-md`}>
          {d.subtitle || FLAVOR.tagline}
        </motion.p>
        {(d.date.day || d.venue) && (
          <motion.div {...fade(1.9)} className={`${SERIF} mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[15px] tracking-[0.14em] uppercase text-[#3E3546]`}>
            {[d.date.dayMonth || d.date.day, d.date.time, d.venue].filter(Boolean).map((t, i) => (
              <React.Fragment key={t}>
                {i > 0 && <span className="text-[#B5677A]">✦</span>}
                <span>{t}</span>
              </React.Fragment>
            ))}
          </motion.div>
        )}
        {live && (
          <motion.p {...fade(2.6)} className={`${SERIF} mt-5 text-[10px] tracking-[0.35em] uppercase text-[#9A8B9C]`}>
            Parmağınızı gezdirin · dokunun, havalansınlar
          </motion.p>
        )}
        <ScrollCue delay={live ? 3 : 0} className="text-[#B5677A]" />
        {/* Kelebekler metnin ÖNÜNDE: harflere konabilsinler diye. */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {live ? (
            <ThreeStage mode={mode} fallback={fallback}>
              {(stage) => <KelebekSahnesi {...stage} perches={perches} pointer={pointer} />}
            </ThreeStage>
          ) : (
            fallback
          )}
        </div>
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Büyük güne"
        classes={{
          root: 'min-h-[75svh]',
          eyebrow: 'text-[#B5677A]',
          date: `${SCRIPT} text-[clamp(3rem,13cqw,6rem)] leading-none text-[#2F2737]`,
          meta: 'text-[#6E6274]',
          cell: 'rounded-2xl bg-white/70 backdrop-blur border border-[#E8D6E0] px-2 py-3',
          number: `${SERIF} font-semibold text-[#2F2737]`,
          label: 'text-[#A898A8]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

/**
 * DugunKelebek — "Kelebek Bahçesi": şafak ışığında bir kır bahçesi. Onlarca
 * 3B kelebek (örneklenmiş tek mesh, kanat çırpma vertex shader'da) bahçede
 * süzülür, çiftin adlarının harflerine konar, kanatlarını yavaşça açıp
 * kapatır. Misafirin parmağını/imlecini izlerler; dokununca yakındakiler
 * havalanıp kaçar. WebGL yoksa ya da önizlemede durağan SVG kelebekler.
 */
export function DugunKelebek({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={FLAVOR}
      mode={mode}
      themeOverride={THEME}
      renderBackdrop={() => <Garden still={reduced || mode === 'preview'} />}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
