import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, type MotionValue } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { DateCountdown, ScrollCue, useTemplateFont } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { MEZUNIYET_FLAVOR } from '../flavors';
import { KivrilanSayfa } from './KivrilanSayfa';

const FONTS = 'Playfair+Display:ital,wght@0,500;0,700;0,800;1,500&family=Caveat:wght@500;700&family=Libre+Baskerville:ital@0;1';
const PLAYFAIR = "[font-family:'Playfair_Display',var(--font-cormorant),serif]";
const HAND = "[font-family:'Caveat',cursive]";
const BASK = "[font-family:'Libre_Baskerville',Georgia,serif]";
const GOLD = 'bg-[linear-gradient(180deg,#FBE7B0_0%,#E0B45C_50%,#A87A2C_100%)] bg-clip-text text-transparent';

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#0C1222] [&_.font-serif]:[font-family:'Playfair_Display',var(--font-cormorant),serif] [&_.font-serif]:font-bold",
  page: 'text-[#E6E1D4]',
  surface: 'bg-[#141C33]/80 backdrop-blur-xl shadow-[0_0_70px_-30px_rgba(224,180,92,0.4)]',
  border: 'border-[#E0B45C]/20',
  heading: 'text-[#F6F0E1]',
  body: 'text-[#B6B2A6]',
  accent: 'text-[#E0B45C]',
  accentBg: 'bg-[#8E2B2B]',
  accentSoft: 'bg-[#E0B45C]/10',
  input:
    'w-full bg-[#0F162B]/80 border border-[#E0B45C]/22 rounded-xl px-3.5 py-2.5 text-sm text-[#F6F0E1] placeholder:text-[#7E8296] focus:outline-none focus:border-[#E0B45C] focus:ring-2 focus:ring-[#E0B45C]/25 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(135deg,#E0B45C,#B98A3A)] hover:brightness-110 text-[#1A1407] shadow-lg shadow-[#E0B45C]/25',
  buttonGhost: 'border border-[#E0B45C]/35 text-[#E6E1D4] hover:bg-[#E0B45C]/10',
  divider: 'bg-[#E0B45C]/18',
  timelineLine: 'from-[#E0B45C]/80 via-[#8E2B2B]/45 to-transparent',
  envelope: {
    paper: 'bg-[#16213F]',
    flap: 'bg-[#1C2A50]',
    seal: 'bg-[#8E2B2B] text-[#FBE7B0]',
    glow: 'bg-[#E0B45C]/30',
    card: 'bg-[#F6F0E1] border border-[#E0B45C]/45'
  },
  mapHeader: 'bg-[#141C33]',
  footer: { names: 'text-[#B6B2A6]', branding: 'text-[#7E8296]' }
};

const FLAVOR: TemplateFlavor = {
  ...MEZUNIYET_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Bir dönem bitti, hikâye yeni başlıyor',
  headings: { timeline: 'Tören Programı', details: 'Tören Yeri', gallery: 'Yıllıktan Kareler', gift: 'Hediye', rsvp: 'Yıllığı İmzala' }
};

const PAPER = 'bg-[#F4EEE0] bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.6),transparent_60%)]';

/** Kâğıdın arkası: soluk, aynalı mürekkep izi gibi ince çizgiler. */
const PAGE_BACK = (
  <div className={`absolute inset-0 ${PAPER}`}>
    <div className="absolute inset-[10%] opacity-[0.07] bg-[repeating-linear-gradient(180deg,#2B2418_0_1px,transparent_1px_14px)]" />
  </div>
);

function Laurel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <path d="M60 64c-22-4-38-18-42-42M60 64c22-4 38-18 42-42" />
      {[0, 1, 2, 3, 4].map((i) => {
        const t = 0.15 + i * 0.17;
        const xl = 18 + 6 * i, yl = 22 + 9 * i;
        return (
          <g key={i}>
            <path d={`M${xl} ${yl}c-8-2-12-8-12-14c7 1 12 6 12 14z`} fill="currentColor" fillOpacity={0.25 + t * 0.2} />
            <path d={`M${120 - xl} ${yl}c8-2 12-8 12-14c-7 1-12 6-12 14z`} fill="currentColor" fillOpacity={0.25 + t * 0.2} />
          </g>
        );
      })}
      <path d="M52 20l8-12 8 12-8 6z" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

function Photo({ src, fallback, className }: { src?: string; fallback: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#D9CFBC] ${className ?? ''}`}>
      {src ? <img src={src} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover" /> : <div className="absolute inset-0" style={{ background: fallback }} />}
    </div>
  );
}

const FALLBACKS = [
  'radial-gradient(circle at 50% 38%, #E7C9A8 0 16%, transparent 17%), radial-gradient(ellipse at 50% 95%, #2E3A5E 0 38%, transparent 39%), linear-gradient(180deg, #C9D6E4, #E9E1D2)',
  'linear-gradient(160deg, #9BB4C9, #D8C4A8)',
  'radial-gradient(circle at 30% 60%, #E2B45A 0 12%, transparent 13%), linear-gradient(180deg, #2E3A5E, #6D5B7E)',
  'linear-gradient(200deg, #CDB89A, #8EA38C)',
  'linear-gradient(180deg, #E9D7C0, #B9A58A)'
];

const SIGNATURES = [
  { text: 'Yolun hep açık olsun!', x: 8, y: 22, r: -6, c: '#1F3B8A' },
  { text: 'Bu yıl efsaneydi ✿', x: 46, y: 38, r: 5, c: '#8E2B2B' },
  { text: 'Sakın bizi unutma :)', x: 10, y: 58, r: -3, c: '#2F6B4F' },
  { text: 'Nice başarılara — sınıfın', x: 30, y: 78, r: 4, c: '#5B3A8A' }
];

function pages(d: HeroData, photos: string[], name: string, drawSigs: boolean): React.ReactNode[] {
  const year = d.date.year || String(new Date().getFullYear());
  const stamp = (
    <div className="absolute right-[8%] bottom-[9%] w-[34%] aspect-square rounded-full border-[3px] border-[#8E2B2B]/70 grid place-items-center rotate-[-14deg] text-[#8E2B2B]/80">
      <div className="text-center">
        <p className={`${BASK} text-[9px] tracking-[0.25em]`}>SINIF</p>
        <p className={`${PLAYFAIR} text-[18px] font-extrabold leading-none`}>{year}</p>
        <p className={`${BASK} text-[9px] tracking-[0.25em]`}>MEZUN</p>
      </div>
    </div>
  );
  return [
    // 0 · Kapak
    <div key="kapak" className="absolute inset-0 bg-[#16213F] bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)] flex flex-col items-center justify-center text-center px-[10%]">
      <div className="absolute inset-[5%] border border-[#E0B45C]/50 rounded-sm" />
      <div className="absolute inset-[6.5%] border border-[#E0B45C]/25 rounded-sm" />
      <div className="absolute left-0 top-0 bottom-0 w-[7%] bg-[linear-gradient(90deg,rgba(0,0,0,0.45),rgba(0,0,0,0))]" />
      <Laurel className="w-[42%] text-[#E0B45C]" />
      <p className={`${BASK} mt-3 text-[10px] tracking-[0.4em] uppercase text-[#E0B45C]/85`}>{d.title || 'Mezuniyet Yıllığı'}</p>
      <p className={`${PLAYFAIR} ${GOLD} mt-2 font-extrabold text-[clamp(2.2rem,12cqw,3.4rem)] leading-none`}>{year}</p>
      <p className={`${PLAYFAIR} mt-4 italic text-[#F6F0E1] text-[clamp(1.1rem,5.4cqw,1.6rem)] leading-tight break-words`}>{name}</p>
      <p className={`${BASK} absolute bottom-[9%] text-[9px] tracking-[0.3em] uppercase text-[#E0B45C]/60`}>Sayfayı çevirin →</p>
    </div>,
    // 1 · Portre
    <div key="portre" className={`absolute inset-0 ${PAPER} px-[9%] pt-[9%] pb-[8%] flex flex-col`}>
      <p className={`${BASK} text-[9px] tracking-[0.35em] uppercase text-[#7A6A50]`}>Sınıfın yıldızı</p>
      <Photo src={photos[0]} fallback={FALLBACKS[0]} className="mt-3 w-full aspect-[4/3.4] shadow-[0_6px_14px_-6px_rgba(0,0,0,0.5)]" />
      <p className={`${PLAYFAIR} mt-4 font-bold text-[#1C2340] text-[clamp(1.3rem,6.4cqw,1.9rem)] leading-tight break-words`}>{name}</p>
      <p className={`${HAND} mt-1 text-[#4A3F2E] text-[clamp(1.05rem,5cqw,1.4rem)] leading-snug`}>“{d.subtitle || FLAVOR.tagline}”</p>
    </div>,
    // 2 · Tören
    <div key="toren" className={`absolute inset-0 ${PAPER} px-[10%] pt-[11%] pb-[8%]`}>
      <p className={`${BASK} text-[9px] tracking-[0.35em] uppercase text-[#7A6A50]`}>Mezuniyet töreni</p>
      <div className="mt-5 space-y-4 text-[#1C2340]">
        {[
          ['Tarih', [d.date.dayMonth || d.date.day, d.date.weekday].filter(Boolean).join(', ')],
          ['Saat', d.date.time],
          ['Yer', d.venue]
        ]
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="border-b border-dashed border-[#B9A98C] pb-2">
              <p className={`${BASK} text-[9px] tracking-[0.3em] uppercase text-[#8A7A60]`}>{k}</p>
              <p className={`${PLAYFAIR} text-[clamp(1.05rem,5cqw,1.35rem)] font-bold leading-snug break-words`}>{v}</p>
            </div>
          ))}
      </div>
      {stamp}
    </div>,
    // 3 · Kolaj
    <div key="kolaj" className={`absolute inset-0 ${PAPER} p-[8%]`}>
      <p className={`${BASK} text-[9px] tracking-[0.35em] uppercase text-[#7A6A50]`}>Unutulmayanlar</p>
      <div className="relative mt-3 h-[86%]">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute w-[54%] bg-white p-[3%] pb-[8%] shadow-[0_8px_16px_-8px_rgba(0,0,0,0.6)]"
            style={{ left: i % 2 ? '44%' : '2%', top: `${i * 22}%`, rotate: `${[-5, 4, 3, -4][i]}deg` }}
          >
            <Photo src={photos[i + 1]} fallback={FALLBACKS[(i + 1) % FALLBACKS.length]} className="w-full aspect-square" />
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[38%] h-4 bg-[#F3E2A6]/80 rotate-[-3deg]" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>,
    // 4 · İmzalar
    <div key="imza" className={`absolute inset-0 ${PAPER} p-[8%]`}>
      <p className={`${BASK} text-[9px] tracking-[0.35em] uppercase text-[#7A6A50]`}>İmzalar</p>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-[8%] w-[84%] h-[84%] overflow-visible" aria-hidden="true">
        {SIGNATURES.map((s, i) => (
          <motion.text
            key={s.text}
            x={s.x}
            y={s.y}
            transform={`rotate(${s.r} ${s.x} ${s.y})`}
            className={HAND}
            fontSize="8.5"
            fontWeight={700}
            fill={s.c}
            stroke={s.c}
            strokeWidth="0.25"
            strokeDasharray="160"
            initial={drawSigs ? { strokeDashoffset: 160, fillOpacity: 0 } : false}
            animate={drawSigs ? { strokeDashoffset: 0, fillOpacity: 1 } : undefined}
            transition={{ delay: 0.4 + i * 0.7, duration: 1.4, ease: 'easeInOut' }}
          >
            {s.text}
          </motion.text>
        ))}
      </svg>
      <p className="sr-only">Arkadaşlarının notları: {SIGNATURES.map((s) => s.text).join(', ')}</p>
    </div>,
    // 5 · Son sayfa (çevrilmez)
    <div key="son" className={`absolute inset-0 ${PAPER} px-[10%] flex flex-col items-center justify-center text-center`}>
      <Laurel className="w-[34%] text-[#B98A3A]" />
      <p className={`${PLAYFAIR} mt-4 font-bold text-[#1C2340] text-[clamp(1.4rem,7cqw,2rem)] leading-tight`}>Bu sayfaya senin imzan eksik</p>
      <p className={`${BASK} mt-3 text-[13px] italic text-[#5A4E3A]`}>Törende bizimle ol, yıllığı birlikte kapatalım.</p>
      <p className={`${BASK} mt-6 text-[9px] tracking-[0.3em] uppercase text-[#8A7A60]`}>Aşağı kaydırın ↓</p>
    </div>
  ];
}

function Book({ d, photos, name, live }: { d: HeroData; photos: string[]; name: string; live: boolean }) {
  const [current, setCurrent] = useState(0);
  const p0 = useMotionValue(live ? 0 : 0.12);
  const p1 = useMotionValue(0);
  const p2 = useMotionValue(0);
  const p3 = useMotionValue(0);
  const p4 = useMotionValue(0);
  const progress: MotionValue<number>[] = [p0, p1, p2, p3, p4];
  const content = pages(d, photos, name, live && current >= 4);
  const flippable = content.length - 1;
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; w: number; dir: 0 | 1 | -1 } | null>(null);

  // İpucu: kapak hafifçe kalkıp geri iner.
  useEffect(() => {
    if (!live) return;
    const t = window.setTimeout(() => {
      void animate(p0, [0, 0.16, 0], { duration: 1.6, ease: 'easeInOut' });
    }, 1800);
    return () => window.clearTimeout(t);
  }, [live, p0]);

  const go = (target: number) => {
    const next = Math.max(0, Math.min(flippable, target));
    if (next === current) return;
    if (next > current) void animate(progress[current], 1, { type: 'spring', stiffness: 70, damping: 16 });
    else void animate(progress[next], 0, { type: 'spring', stiffness: 70, damping: 16 });
    setCurrent(next);
  };

  const onDown = (e: React.PointerEvent) => {
    if (!live) return;
    dragRef.current = { x: e.clientX, w: ref.current?.getBoundingClientRect().width ?? 300, dir: 0 };
  };
  const onMove = (e: React.PointerEvent) => {
    const g = dragRef.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    if (g.dir === 0 && Math.abs(dx) > 6) g.dir = dx < 0 ? 1 : -1;
    if (g.dir === 1 && current < flippable) progress[current].set(Math.min(1, Math.max(0, -dx / (g.w * 0.95))));
    if (g.dir === -1 && current > 0) progress[current - 1].set(1 - Math.min(1, Math.max(0, dx / (g.w * 0.95))));
  };
  const onUp = () => {
    const g = dragRef.current;
    dragRef.current = null;
    if (!g || g.dir === 0) return;
    if (g.dir === 1 && current < flippable) {
      if (progress[current].get() > 0.3) go(current + 1);
      else void animate(progress[current], 0, { type: 'spring', stiffness: 120, damping: 18 });
    }
    if (g.dir === -1 && current > 0) {
      if (progress[current - 1].get() < 0.7) go(current - 1);
      else void animate(progress[current - 1], 1, { type: 'spring', stiffness: 120, damping: 18 });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={ref}
        className="relative w-[min(78vw,340px)] aspect-[3/4.25] [perspective:1600px] [touch-action:pan-y] select-none"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(current + 1);
          if (e.key === 'ArrowLeft') go(current - 1);
        }}
        tabIndex={live ? 0 : -1}
        role="group"
        aria-roledescription="yıllık"
        aria-label={`Yıllık, sayfa ${current + 1} / ${content.length}. Sağ ve sol ok tuşlarıyla çevirin.`}
      >
        {/* Sayfa kalınlığı ve gölge */}
        <div aria-hidden="true" className="absolute inset-0 translate-x-[5px] translate-y-[5px] rounded-r-md bg-[repeating-linear-gradient(90deg,#E8E0CC_0_1px,#D9CFB8_1px_3px)] shadow-[0_40px_60px_-25px_rgba(0,0,0,0.9)]" />
        {/* Son sayfa en altta, düz */}
        <div className="absolute inset-0 rounded-r-md overflow-hidden">{content[flippable]}</div>
        {content.slice(0, flippable).map((page, i) => (
          <KivrilanSayfa
            key={i}
            progress={progress[i]}
            front={page}
            back={i === 0 ? <div className="absolute inset-0 bg-[#16213F]" /> : PAGE_BACK}
            // Üstteki sayfa önde; çevrilenler sırayla arkaya.
            style={{ zIndex: i >= current ? flippable - i + 10 : i }}
          />
        ))}
      </div>
      {live && (
        <div className="mt-5 flex items-center gap-4">
          <button type="button" onClick={() => go(current - 1)} disabled={current === 0} aria-label="Önceki sayfa" className="grid place-items-center w-11 h-11 rounded-full border border-[#E0B45C]/35 text-[#E0B45C] disabled:opacity-30 hover:bg-[#E0B45C]/10 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <span className={`${BASK} text-[11px] tracking-[0.25em] text-[#B6B2A6] tabular-nums`}>
            {current + 1} / {content.length}
          </span>
          <button type="button" onClick={() => go(current + 1)} disabled={current === flippable} aria-label="Sonraki sayfa" className="grid place-items-center w-11 h-11 rounded-full border border-[#E0B45C]/35 text-[#E0B45C] disabled:opacity-30 hover:bg-[#E0B45C]/10 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONTS);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const live = mode === 'live';
  const still = reduced || !live;
  const name = d.hasNames ? d.people.join(' & ') : NO_NAMES;
  const photos = invitation.showGallery ? invitation.galleryImages.slice(0, 5).map((g) => g.url) : [];
  return (
    <div className="relative grow flex flex-col">
      <div className="relative min-h-[100svh] flex flex-col items-center justify-center px-5 pt-10 pb-24 text-center" dir="auto">
        <motion.p
          initial={still ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className={`${BASK} mb-6 text-[11px] tracking-[0.35em] uppercase text-[#E0B45C]`}
        >
          {d.title || 'Mezuniyet Töreni'}
        </motion.p>
        <motion.div initial={still ? false : { opacity: 0, y: 30, rotateX: 18 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}>
          <Book d={d} photos={photos} name={name} live={live} />
        </motion.div>
        <h1 className="sr-only">{name}</h1>
        {live && (
          <p className={`${BASK} mt-3 text-[10px] italic tracking-[0.12em] text-[#7E8296]`}>Sayfayı parmağınızla sola çekin</p>
        )}
        <ScrollCue delay={still ? 0 : 2.4} className="text-[#E0B45C]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Kep atmaya kalan"
        classes={{
          root: 'min-h-[75svh]',
          eyebrow: 'text-[#E0B45C]',
          date: `${PLAYFAIR} ${GOLD} font-extrabold text-[clamp(2.6rem,11cqw,5.2rem)] leading-none`,
          meta: 'text-[#B6B2A6]',
          cell: 'rounded-xl bg-[#0F162B]/60 border border-[#E0B45C]/20 px-2 py-3',
          number: `${PLAYFAIR} font-bold text-[#F6F0E1]`,
          label: 'text-[#7E8296]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

/** Masa lambası altında koyu lacivert masa: sıcak ışık havuzu, ahşap damarı. */
function Backdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-[#0C1222] overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(95deg,rgba(255,255,255,0.02)_0_2px,transparent_2px_9px)]" />
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[120vmax] h-[90vmax] rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,214,150,0.22),rgba(255,190,120,0.06)_50%,transparent)]" />
    </div>
  );
}

/**
 * MezuniyetYillik — "Mezuniyet Yıllığı": lacivert deri kapaklı, altın
 * varaklı bir yıllık. Sayfalar parmakla çekilerek çevrilir ve çevrilirken
 * gerçek kâğıt gibi kıvrılır (6 şeritli CSS 3B; bkz. KivrilanSayfa). İçinde
 * portre, tören bilgileri ve damga, galeri kolajı ve kendiliğinden yazılan
 * arkadaş imzaları var. Oklar ve klavye ile de çevrilir.
 */
export function MezuniyetYillik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={FLAVOR}
      mode={mode}
      themeOverride={THEME}
      renderBackdrop={() => <Backdrop />}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
