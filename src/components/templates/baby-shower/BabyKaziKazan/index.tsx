import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { DateCountdown, ScrollCue, useTemplateFont } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import { createParticles, createScratchCard, paintCoating, type ScratchCard } from './kaziMotoru';

const FONTS = 'Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600';
const ROUND = "[font-family:'Fredoka',ui-rounded,var(--font-sans),sans-serif]";
const NUNITO = "[font-family:'Nunito',var(--font-sans),sans-serif]";
/** Bu oranda açılınca kaplamanın kalanı kendiliğinden dökülür. */
const REVEAL_AT = 0.5;

const THEME: SectionTheme = {
  id: 'stone',
  base: "bg-[#FFF6F1] [&_.font-serif]:[font-family:'Fredoka',ui-rounded,var(--font-sans),sans-serif] [&_.font-serif]:font-semibold",
  page: 'text-[#5B4A63]',
  surface: 'bg-white/80 backdrop-blur-md shadow-[0_18px_50px_-24px_rgba(183,156,230,0.55)]',
  border: 'border-[#E9DDF5]',
  heading: 'text-[#4A3A55]',
  body: 'text-[#7C6C86]',
  accent: 'text-[#C27BA0]',
  accentBg: 'bg-[#E88FA9]',
  accentSoft: 'bg-[#E88FA9]/12',
  input:
    'w-full bg-white border border-[#E9DDF5] rounded-2xl px-3.5 py-2.5 text-sm text-[#4A3A55] placeholder:text-[#B3A6BD] focus:outline-none focus:border-[#E88FA9] focus:ring-2 focus:ring-[#E88FA9]/25 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(135deg,#F2A9C4,#B79CE6)] hover:brightness-105 text-white shadow-lg shadow-[#E88FA9]/30',
  buttonGhost: 'border border-[#E9DDF5] text-[#5B4A63] hover:bg-[#F7EEFB]',
  divider: 'bg-[#E9DDF5]',
  timelineLine: 'from-[#E88FA9]/80 via-[#B79CE6]/50 to-transparent',
  envelope: {
    paper: 'bg-[#F7D9E3]',
    flap: 'bg-[#F2CBD9]',
    seal: 'bg-[#D9AE62] text-white',
    glow: 'bg-[#FBE3A6]/50',
    card: 'bg-white border border-[#E9DDF5]'
  },
  mapHeader: 'bg-[#F7EEFB]',
  footer: { names: 'text-[#7C6C86]', branding: 'text-[#B3A6BD]' }
};

const FLAVOR: TemplateFlavor = {
  ...BABY_SHOWER_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Minik bir mucize yolda!',
  headings: { timeline: 'Günün Akışı', details: 'Nerede Buluşuyoruz?', gallery: 'Bekleyiş Kareleri', gift: 'Bebek Listesi', rsvp: 'Geliyor musunuz?' }
};

interface Panel {
  key: string;
  label: string;
  coat: string;
  content: React.ReactNode;
}

type Crumb = (x: number, y: number) => void;

/** Tek kazı alanı: içerik gerçek DOM'dur, kaplama üstteki tuvaldir. */
function ScratchPanel({
  panel,
  index,
  live,
  revealed,
  onReveal,
  onCrumb,
  preScratch
}: {
  panel: Panel;
  index: number;
  live: boolean;
  revealed: boolean;
  onReveal: () => void;
  onCrumb: (canvas: HTMLCanvasElement, x: number, y: number) => void;
  preScratch: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const card = useRef<ScratchCard | null>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const moves = useRef(0);
  const crumbRef = useRef(onCrumb);
  crumbRef.current = onCrumb;
  const revealRef = useRef(onReveal);
  revealRef.current = onReveal;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (!live) {
      // Önizleme: durağan kaplama; ilk kartta kısa bir kazıma izi (kapakta ne olduğu anlaşılsın).
      const dpr = paintCoating(canvas, index + 1, panel.coat);
      if (preScratch) {
        const g = canvas.getContext('2d');
        if (g) {
          g.globalCompositeOperation = 'destination-out';
          g.lineWidth = 30 * dpr;
          g.lineCap = 'round';
          g.beginPath();
          const w = canvas.width, h = canvas.height;
          g.moveTo(w * 0.12, h * 0.55);
          g.bezierCurveTo(w * 0.3, h * 0.1, w * 0.42, h * 0.95, w * 0.62, h * 0.45);
          g.stroke();
        }
      }
      return;
    }
    const c = createScratchCard(canvas, index + 1, panel.coat, (x, y) => crumbRef.current(canvas, x, y));
    card.current = c;
    return () => {
      c.destroy();
      card.current = null;
    };
  }, [live, index, panel.coat, preScratch]);

  const pt = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const check = () => {
    if (!revealed && card.current && card.current.cleared() >= REVEAL_AT) revealRef.current();
  };

  return (
    <div className="relative">
      <p className={`${ROUND} mb-1.5 text-[11px] font-semibold tracking-[0.22em] uppercase text-[#B08AB8]`}>{panel.label}</p>
      <div className="relative rounded-[22px] overflow-hidden bg-[linear-gradient(135deg,#FFFFFF,#FDF3F7)] border-2 border-dashed border-[#EBC9D8] min-h-[88px] flex items-center justify-center px-4 py-3 text-center">
        <div className={`${ROUND} text-[#4A3A55]`}>{panel.content}</div>
        <canvas
          ref={ref}
          aria-hidden="true"
          onPointerDown={(e) => {
            if (!card.current || revealed) return;
            last.current = pt(e);
            card.current.scratch(last.current.x, last.current.y, last.current.x + 0.1, last.current.y);
          }}
          onPointerMove={(e) => {
            if (!card.current || revealed) return;
            // Kazımak için basılı tutmak gerekir (fare de, parmak da).
            if (e.buttons === 0) return;
            const p = pt(e);
            const prev = last.current ?? p;
            card.current.scratch(prev.x, prev.y, p.x, p.y);
            last.current = p;
            if (++moves.current % 14 === 0) check();
          }}
          onPointerUp={() => {
            last.current = null;
            check();
          }}
          onPointerLeave={() => (last.current = null)}
          className={`absolute inset-0 w-full h-full [touch-action:pan-y] ${live ? 'cursor-grab active:cursor-grabbing' : ''} transition-opacity duration-700 ${revealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        />
      </div>
    </div>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONTS);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const live = mode === 'live';
  const still = reduced || !live;
  const fade = (delay: number) =>
    still ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } };

  const panels: Panel[] = [
    {
      key: 'ad',
      label: 'Kimin için?',
      coat: 'kazı ✦ isim',
      content: (
        <span className="block text-[clamp(1.5rem,7cqw,2.2rem)] font-semibold leading-tight break-words">
          {d.hasNames ? d.people.join(' & ') : NO_NAMES}
        </span>
      )
    },
    ...(d.date.day
      ? [
          {
            key: 'tarih',
            label: 'Ne zaman?',
            coat: 'kazı ✦ tarih',
            content: (
              <span className="block">
                <span className="block text-[clamp(1.4rem,6.5cqw,2rem)] font-semibold leading-tight">{d.date.dayMonth || d.date.day}</span>
                <span className={`${NUNITO} block text-sm text-[#8C7A96] mt-0.5`}>{[d.date.weekday, d.date.time].filter(Boolean).join(' · ')}</span>
              </span>
            )
          }
        ]
      : []),
    {
      key: 'surpriz',
      label: 'Ve sürpriz…',
      coat: 'kazı ✦ sürpriz',
      content: <span className="block text-[clamp(1.2rem,5.5cqw,1.7rem)] font-semibold leading-snug text-[#C27BA0]">{d.subtitle || FLAVOR.tagline}</span>
    }
  ];

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const overlay = useRef<HTMLCanvasElement>(null);
  const fx = useRef<ReturnType<typeof createParticles> | null>(null);
  const allOpen = panels.every((p) => open[p.key]);
  const celebrated = useRef(false);

  useEffect(() => {
    if (!live || reduced || !overlay.current) return;
    const p = createParticles(overlay.current);
    fx.current = p;
    return () => {
      p.destroy();
      fx.current = null;
    };
  }, [live, reduced]);

  useEffect(() => {
    if (!allOpen || celebrated.current) return;
    celebrated.current = true;
    const o = overlay.current?.getBoundingClientRect();
    if (o) fx.current?.confetti(o.width / 2, o.height * 0.55);
  }, [allOpen]);

  const onCrumb = (canvas: HTMLCanvasElement, x: number, y: number) => {
    const o = overlay.current?.getBoundingClientRect();
    const c = canvas.getBoundingClientRect();
    if (o) fx.current?.crumbs(c.left - o.left + x, c.top - o.top + y);
  };

  return (
    <div className="relative grow flex flex-col">
      <div className="relative min-h-[100svh] flex flex-col items-center justify-center px-5 pt-12 pb-24" dir="auto">
        <motion.p {...fade(0.1)} className={`${ROUND} text-[11px] font-semibold tracking-[0.3em] uppercase text-[#C27BA0]`}>
          {d.title || 'Baby Shower'}
        </motion.p>
        <motion.h1 {...fade(0.25)} className={`${ROUND} mt-3 text-center font-bold leading-[1.05] text-[clamp(2rem,9cqw,3.4rem)] text-[#4A3A55]`}>
          Bir sürprizimiz var!
        </motion.h1>
        <motion.p {...fade(0.4)} className={`${NUNITO} mt-2 text-center text-[15px] text-[#8C7A96]`}>
          {live ? 'Parmağınızla kartları kazıyın' : 'Kartları kazıyarak keşfedin'}
        </motion.p>

        <motion.div
          className="relative mt-7 w-full max-w-[380px] rounded-[32px] bg-white/75 backdrop-blur-md p-5 shadow-[0_30px_70px_-30px_rgba(183,156,230,0.7)] border border-white space-y-4"
          initial={still ? false : { opacity: 0, y: 30, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {panels.map((p, i) => (
            <ScratchPanel
              key={p.key}
              panel={p}
              index={i}
              live={live}
              revealed={Boolean(open[p.key])}
              preScratch={!live && i === 0}
              onReveal={() => setOpen((o) => ({ ...o, [p.key]: true }))}
              onCrumb={onCrumb}
            />
          ))}
        </motion.div>

        <div className="mt-5 min-h-11 flex items-center">
          {live && !allOpen ? (
            <button
              type="button"
              onClick={() => setOpen(Object.fromEntries(panels.map((p) => [p.key, true])))}
              className={`${ROUND} rounded-full border border-[#E9DDF5] bg-white/70 px-5 py-2.5 min-h-11 text-sm font-medium text-[#7C6C86] hover:bg-white transition-colors`}
            >
              Hepsini birden aç
            </button>
          ) : (
            d.venue && (
              <motion.p initial={still ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`${NUNITO} rounded-full bg-white/80 px-4 py-2 text-sm text-[#5B4A63] shadow-sm`}>
                📍 {d.venue}
              </motion.p>
            )
          )}
        </div>
        <ScrollCue delay={still ? 0 : 1.6} className="text-[#C27BA0]" />
        <canvas ref={overlay} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none z-20" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Tanışmamıza kalan"
        classes={{
          root: 'min-h-[70svh]',
          eyebrow: 'text-[#C27BA0]',
          date: `${ROUND} font-bold text-[clamp(2.4rem,10cqw,4.6rem)] leading-none text-[#4A3A55]`,
          meta: 'text-[#8C7A96]',
          cell: 'rounded-3xl bg-white/80 border border-[#E9DDF5] px-2 py-3 shadow-sm',
          number: `${ROUND} font-semibold text-[#4A3A55]`,
          label: 'text-[#B08AB8]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

/** Pastel zemin: yavaşça süzülen yumuşak kabarcıklar (yalnızca CSS). */
function Backdrop({ still }: { still: boolean }) {
  const blobs = [
    ['12%', '18%', '#F7C9D8', 220],
    ['78%', '12%', '#CFE3F7', 260],
    ['70%', '68%', '#D9EFE2', 240],
    ['18%', '78%', '#E7DAF7', 280],
    ['50%', '45%', '#FBEBC4', 200]
  ] as const;
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,#FFF6F1_0%,#FBEFF6_50%,#F1F2FC_100%)] overflow-hidden">
      {blobs.map(([x, y, c, s], i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-70"
          style={{ left: x, top: y, width: s, height: s, background: c, translateX: '-50%', translateY: '-50%' }}
          animate={still ? undefined : { x: [0, 30, -20, 0], y: [0, -25, 20, 0] }}
          transition={{ duration: 16 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/**
 * BabyKaziKazan — "Kazı Kazan Sürpriz": pastel bir kartta altın simli
 * kaplamalar. Misafir parmağıyla kazıdıkça ad(lar), tarih ve sürpriz satırı
 * (alt metin; ör. "Bir kız bebek geliyor!") ortaya çıkar, sim kırıntıları
 * dökülür; hepsi açılınca konfeti patlar. "Hepsini birden aç" her an var.
 */
export function BabyKaziKazan({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={FLAVOR}
      mode={mode}
      themeOverride={THEME}
      renderBackdrop={() => <Backdrop still={reduced || mode === 'preview'} />}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
