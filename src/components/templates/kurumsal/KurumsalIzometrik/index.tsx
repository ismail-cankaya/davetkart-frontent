import React, { useCallback, useMemo, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { displayText } from '../../utils';
import { hasTimelineEventContent } from '../../../../utils/timelineEvents';
import type { Invitation } from '../../../../types';
import { TemplateProps } from '../../types';
import { KURUMSAL_FLAVOR } from '../flavors';

type Mode = 'preview' | 'live';

/*
 * Palet — "Maket Kâğıdı": kâğıt beyazı #F6F5F0, arduvaz #1E293B / #475569,
 * çizgi grisi #CBD5E1, tek vurgu: mimari mavi #2563EB.
 */
const IZOMETRIK_TEMASI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#F6F5F0] [&_.font-serif]:font-sans [&_.font-serif]:font-semibold [&_.font-serif]:tracking-tight',
  page: 'text-[#1E293B]',
  surface: 'bg-white/90 shadow-[0_1px_0_#CBD5E1,0_18px_40px_-28px_rgba(30,41,59,0.35)]',
  border: 'border-[#CBD5E1]',
  heading: 'text-[#0F172A]',
  body: 'text-[#475569]',
  accent: 'text-[#2563EB]',
  accentBg: 'bg-[#2563EB]',
  accentSoft: 'bg-[#2563EB]/8',
  input:
    'w-full bg-white border border-[#CBD5E1] rounded-md px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md shadow-[#2563EB]/20',
  buttonGhost: 'border border-[#CBD5E1] text-[#1E293B] hover:bg-[#2563EB]/5',
  divider: 'bg-[#CBD5E1]',
  timelineLine: 'from-[#2563EB]/70 via-[#2563EB]/25 to-transparent',
  envelope: {
    paper: 'bg-[#EEECE4]',
    flap: 'bg-[#E4E1D6]',
    seal: 'bg-[#2563EB] text-white',
    glow: 'bg-[#2563EB]/15',
    card: 'bg-white border border-[#CBD5E1]'
  },
  mapHeader: 'bg-[#EEECE4]',
  footer: { names: 'text-[#475569]', branding: 'text-[#94A3B8]' }
};

const HEADINGS = {
  timeline: 'Ajanda',
  details: 'Mekân',
  gallery: 'Maketten Kareler',
  gift: 'Katkı',
  rsvp: 'LCV'
} as const;

const IZOMETRIK_FLAVOR: TemplateFlavor = {
  ...KURUMSAL_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Ölçek 1:100 · Etkinlik Maketi',
  headings: { ...HEADINGS },
  eyebrows: { timeline: 'Program', details: 'Konum', gallery: 'Arşiv', gift: 'Destek', rsvp: 'Katılım' }
};

type FloorKey = keyof typeof HEADINGS;

interface Floor {
  key: FloorKey;
  label: string;
}

/** Yalnızca verisi dolu (kompozisyonun gerçekten çizeceği) bölümler kat olur. */
function buildFloors(invitation: Invitation): Floor[] {
  const floors: Floor[] = [];
  if (invitation.showTimeline && (invitation.timelineEvents ?? []).some(hasTimelineEventContent)) {
    floors.push({ key: 'timeline', label: 'Ajanda' });
  }
  if (displayText(invitation.date) || displayText(invitation.venue) || displayText(invitation.mapUrl)) {
    floors.push({ key: 'details', label: 'Mekân' });
  }
  if (invitation.showGallery && invitation.galleryImages.length > 0) floors.push({ key: 'gallery', label: 'Galeri' });
  if (invitation.showGift && displayText(invitation.iban)) floors.push({ key: 'gift', label: 'Katkı' });
  if (invitation.showRSVP) floors.push({ key: 'rsvp', label: 'LCV' });
  return floors;
}

// ——— İzometrik izdüşüm ———

const COS = 0.866;
const SIN = 0.5;
const W = 112; // bina genişliği (x)
const D = 72; // bina derinliği (y)
const H = 26; // kat yüksekliği (z)
const SLAB = 4; // döşeme kalınlığı
const GAP = 24; // tam patlatmada katlar arası ek boşluk
const PLATE = 52; // zemin plakasının binadan taşması
const OX = 196; // izdüşüm başlangıcı (viewBox)

function pt(x: number, y: number, z: number): string {
  return `${(OX + (x - y) * COS).toFixed(1)},${((x + y) * SIN - z).toFixed(1)}`;
}
function poly(points: [number, number, number][]): string {
  return points.map(([x, y, z]) => pt(x, y, z)).join(' ');
}

/** Sağ cephe (x = W) üzerinde y0..y1, z0..z1 dikdörtgeni. */
function faceX(y0: number, y1: number, z0: number, z1: number): string {
  return poly([[W, y0, z0], [W, y1, z0], [W, y1, z1], [W, y0, z1]]);
}
/** Ön cephe (y = D) üzerinde x0..x1, z0..z1 dikdörtgeni. */
function faceY(x0: number, x1: number, z0: number, z1: number): string {
  return poly([[x0, D, z0], [x1, D, z0], [x1, D, z1], [x0, D, z1]]);
}

const WIN_X = [8, 24, 40, 56]; // sağ cephe pencere başlangıçları (y)
const WIN_Y = [8, 26, 44, 62, 80, 98]; // ön cephe pencere başlangıçları (x)

/** Bir katın geometrisi (yerel z = 0). Zemin katı (lobi) sütunlu çizilir. */
function FloorShape({ lobby, active }: { lobby: boolean; active: boolean }) {
  const wallTop = H - SLAB;
  const slabFill = active ? '#DBE7FF' : '#FFFFFF';
  const stroke = active ? '#2563EB' : '#334155';
  return (
    <g strokeLinejoin="round" strokeWidth={0.8} stroke={stroke}>
      {/* duvarlar */}
      <polygon points={faceX(0, D, 0, wallTop)} fill={lobby ? '#EEF2F7' : '#E2E8F0'} />
      <polygon points={faceY(0, W, 0, wallTop)} fill={lobby ? '#F8FAFC' : '#F1F5F9'} />
      {lobby ? (
        <>
          {/* sütunlar */}
          {[10, 34, 58, 82, 104].map((x) => (
            <polygon key={x} points={faceY(x - 2, x + 2, 0, wallTop)} fill="#CBD5E1" strokeWidth={0.5} />
          ))}
          <polygon points={faceY(44, 68, 0, 15)} fill="#2563EB" fillOpacity={0.18} strokeWidth={0.6} />
        </>
      ) : (
        <>
          {WIN_X.map((y) => (
            <polygon key={y} points={faceX(y, y + 10, 6, wallTop - 5)} fill="#93B4E8" fillOpacity={0.55} strokeWidth={0.4} />
          ))}
          {WIN_Y.map((x) => (
            <polygon key={x} points={faceY(x, x + 11, 6, wallTop - 5)} fill="#BFD3F5" fillOpacity={0.6} strokeWidth={0.4} />
          ))}
        </>
      )}
      {/* döşeme: iki yan + üst */}
      <polygon points={faceX(0, D, wallTop, H)} fill={active ? '#93B4E8' : '#CBD5E1'} />
      <polygon points={faceY(0, W, wallTop, H)} fill={active ? '#BFD3F5' : '#E2E8F0'} />
      <polygon points={poly([[0, 0, H], [W, 0, H], [W, D, H], [0, D, H]])} fill={slabFill} />
    </g>
  );
}

function Tree({ x, y, delay, animated }: { x: number; y: number; delay: number; animated: boolean }) {
  const [sx, sy] = pt(x, y, 0).split(',').map(Number);
  return (
    <motion.g
      initial={animated ? { scale: 0, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 18 }}
      style={{ originX: `${sx}px`, originY: `${sy}px` }}
    >
      <ellipse cx={sx} cy={sy} rx={6} ry={3} fill="#0F172A" opacity={0.08} />
      <line x1={sx} y1={sy} x2={sx} y2={sy - 8} stroke="#64748B" strokeWidth={1.2} />
      <circle cx={sx} cy={sy - 12} r={6} fill="#E2E8F0" stroke="#475569" strokeWidth={0.7} />
      <circle cx={sx - 1.8} cy={sy - 13.8} r={2} fill="#FFFFFF" />
    </motion.g>
  );
}

const TREES: [number, number][] = [
  [-34, 10], [-30, 52], [-20, 92], [140, -20], [150, 30], [40, 112], [90, 116]
];

interface ModelProps {
  floors: Floor[];
  explode: MotionValue<number>;
  animated: boolean;
  active: FloorKey | null;
  onHover: (k: FloorKey | null) => void;
  onPick: (k: FloorKey) => void;
}

/** Bir kat grubu: dikey konum = sıra × H + patlatma × sıra × GAP. */
function FloorLayer({
  index,
  explode,
  animated,
  delay,
  children
}: {
  index: number;
  explode: MotionValue<number>;
  animated: boolean;
  delay: number;
  children: React.ReactNode;
}) {
  const y = useTransform(explode, (e) => -(index * H + e * index * GAP));
  return (
    <motion.g style={{ y }}>
      <motion.g
        initial={animated ? { y: -70, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.g>
    </motion.g>
  );
}

const PLATE_DRAW = 0.9;
const FLOOR_STAGGER = 0.22;

function Model({ floors, explode, animated, active, onHover, onPick }: ModelProps) {
  const levels = floors.length + 1; // + lobi
  const top = levels * (H + GAP) + 26;
  const plate = poly([[-PLATE, -PLATE, 0], [W + PLATE, -PLATE, 0], [W + PLATE, D + PLATE, 0], [-PLATE, D + PLATE, 0]]);
  const bottom = (W + D + 2 * PLATE) * SIN + 8;
  const grid: string[] = [];
  for (let g = -PLATE + 16; g < W + PLATE; g += 16) grid.push(`M${pt(g, -PLATE, 0)} L${pt(g, D + PLATE, 0)}`);
  for (let g = -PLATE + 16; g < D + PLATE; g += 16) grid.push(`M${pt(-PLATE, g, 0)} L${pt(W + PLATE, g, 0)}`);
  const lastFloorDelay = PLATE_DRAW + levels * FLOOR_STAGGER;

  return (
    <svg
      viewBox={`0 ${-top} 400 ${top + bottom}`}
      className="w-full max-w-[460px] h-auto overflow-visible"
      role="img"
      aria-label="Etkinliğin izometrik maketi; her kat bir bölümü gösterir"
    >
      {/* zemin plakası: önce çerçeve çizilir, ardından ızgara belirir */}
      <motion.polygon
        points={plate}
        fill="#FBFBF8"
        stroke="#475569"
        strokeWidth={1}
        initial={animated ? { pathLength: 0, fillOpacity: 0 } : false}
        animate={{ pathLength: 1, fillOpacity: 1 }}
        transition={{ pathLength: { duration: PLATE_DRAW, ease: 'easeInOut' }, fillOpacity: { delay: PLATE_DRAW * 0.6, duration: 0.4 } }}
      />
      <motion.g
        initial={animated ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: PLATE_DRAW * 0.7, duration: 0.5 }}
      >
        <polygon points={poly([[-PLATE, D + PLATE, 0], [W + PLATE, D + PLATE, 0], [W + PLATE, D + PLATE, -6], [-PLATE, D + PLATE, -6]])} fill="#E2E8F0" stroke="#94A3B8" strokeWidth={0.6} />
        <polygon points={poly([[W + PLATE, -PLATE, 0], [W + PLATE, D + PLATE, 0], [W + PLATE, D + PLATE, -6], [W + PLATE, -PLATE, -6]])} fill="#CBD5E1" stroke="#94A3B8" strokeWidth={0.6} />
        <path d={grid.join(' ')} stroke="#2563EB" strokeOpacity={0.16} strokeWidth={0.6} fill="none" />
        <polygon points={poly([[6, 6, 0], [W + 14, 6, 0], [W + 14, D + 10, 0], [6, D + 10, 0]])} fill="#0F172A" opacity={0.07} />
      </motion.g>
      {TREES.filter(([x, y]) => x + y < W + D).map(([x, y], i) => (
        <Tree key={i} x={x} y={y} delay={PLATE_DRAW + i * 0.05} animated={animated} />
      ))}

      <FloorLayer index={0} explode={explode} animated={animated} delay={PLATE_DRAW}>
        <FloorShape lobby active={false} />
      </FloorLayer>
      {floors.map((f, i) => (
        <FloorLayer key={f.key} index={i + 1} explode={explode} animated={animated} delay={PLATE_DRAW + (i + 1) * FLOOR_STAGGER}>
          <g
            role="button"
            tabIndex={0}
            aria-label={`${f.label} bölümüne git`}
            className="cursor-pointer focus:outline-none"
            onClick={() => onPick(f.key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onPick(f.key);
              }
            }}
            onMouseEnter={() => onHover(f.key)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(f.key)}
            onBlur={() => onHover(null)}
          >
            <FloorShape lobby={false} active={active === f.key} />
            {/* künye: sol köşeden çıkan çizgi + etiket */}
            <line x1={OX - D * COS} y1={D * SIN - H / 2} x2={18} y2={D * SIN - H / 2} stroke={active === f.key ? '#2563EB' : '#94A3B8'} strokeWidth={0.7} strokeDasharray="2 2" />
            <circle cx={OX - D * COS} cy={D * SIN - H / 2} r={2} fill="#2563EB" />
            <text x={14} y={D * SIN - H / 2 - 5} fontSize={9} fill="#64748B" fontFamily="ui-monospace, monospace" letterSpacing={1}>
              {`K${String(i + 1).padStart(2, '0')}`}
            </text>
            <text x={14} y={D * SIN - H / 2 + 11} fontSize={12.5} fontWeight={600} fill={active === f.key ? '#2563EB' : '#0F172A'} letterSpacing={0.4}>
              {f.label.toLocaleUpperCase('tr-TR')}
            </text>
          </g>
        </FloorLayer>
      ))}
      {/* çatı bayrağı: son kat yerleşince */}
      <FloorLayer index={levels} explode={explode} animated={animated} delay={lastFloorDelay}>
        <line x1={OX + 20} y1={(40) * SIN} x2={OX + 20} y2={40 * SIN - 22} stroke="#334155" strokeWidth={1} />
        <polygon points={`${OX + 20},${40 * SIN - 22} ${OX + 34},${40 * SIN - 18} ${OX + 20},${40 * SIN - 14}`} fill="#2563EB" />
      </FloorLayer>
    </svg>
  );
}

/** Bölümü kompozisyonun kaydırma kabında başlığından bulur ve oraya kayar. */
function scrollToSection(container: HTMLDivElement | null | undefined, key: FloorKey, smooth: boolean) {
  if (!container) return;
  const heading = HEADINGS[key];
  const target = Array.from(container.querySelectorAll('section')).find(
    (s) => (s.querySelector('h2')?.textContent ?? '').trim() === heading
  );
  if (!target) return;
  const top = target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 8;
  container.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
}

function IzometrikHero({ invitation, scrollContainer, mode }: HeroRenderProps & { mode: Mode }) {
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const animated = mode === 'live' && !reduced;
  const floors = useMemo(() => buildFloors(invitation), [invitation]);
  const [hover, setHover] = useState<FloorKey | null>(null);

  // Patlatılmış görünüm: kaydırdıkça katlar ayrılır. Statik kipte hafif ayrık sabit kare.
  const { scrollY } = useScroll({ container: scrollContainer });
  const explode = useTransform(scrollY, (y) => {
    if (!animated) return 0.4;
    const h = scrollContainer?.current?.clientHeight || 1;
    return 0.12 + 0.88 * Math.min(1, Math.max(0, y / (h * 0.35)));
  });

  const pick = useCallback(
    (k: FloorKey) => scrollToSection(scrollContainer?.current, k, !reduced),
    [scrollContainer, reduced]
  );
  const textDelay = animated ? PLATE_DRAW + (floors.length + 1) * FLOOR_STAGGER + 0.2 : 0;
  const fade = (delay: number) =>
    animated
      ? { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
      : {};

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-5 pt-12 pb-16 text-center">
      <motion.p {...fade(0.1)} className="font-mono text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-[#2563EB]">
        {d.title || IZOMETRIK_FLAVOR.tagline}
      </motion.p>
      <motion.h1
        {...fade(0.2)}
        className="mt-3 font-semibold tracking-tight leading-[1.02] text-[#0F172A] text-[clamp(2rem,10cqw,4.2rem)] break-words max-w-full"
      >
        {d.hasNames ? d.people.join(' & ') : NO_NAMES}
      </motion.h1>

      <div className="relative mt-4 w-full flex justify-center">
        <Model floors={floors} explode={explode} animated={animated} active={hover} onHover={setHover} onPick={pick} />
      </div>

      {floors.length > 0 && (
        <motion.nav {...fade(textDelay)} aria-label="Bölümler" className="mt-1 flex flex-wrap justify-center gap-1.5">
          {floors.map((f, i) => (
            <button
              key={f.key}
              type="button"
              onClick={() => pick(f.key)}
              onMouseEnter={() => setHover(f.key)}
              onMouseLeave={() => setHover(null)}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors duration-200 ${
                hover === f.key ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-[#CBD5E1] bg-white/80 text-[#334155] hover:border-[#2563EB]'
              }`}
            >
              <span className="font-mono text-[10px] opacity-60 mr-1">K{String(i + 1).padStart(2, '0')}</span>
              {f.label}
            </button>
          ))}
        </motion.nav>
      )}

      <motion.div {...fade(textDelay + 0.15)} className="mt-6 w-full max-w-sm">
        {/* Pafta künyesi */}
        {(d.date.day || d.venue) && (
          <dl className="grid grid-cols-[auto_1fr] border border-[#334155] text-left text-sm bg-white/70">
            {d.date.day && (
              <>
                <dt className="px-3 py-2 border-r border-b border-[#334155] font-mono text-[10px] tracking-[0.2em] uppercase text-[#64748B]">Tarih</dt>
                <dd className={`px-3 py-2 text-[#0F172A] ${d.venue ? 'border-b border-[#334155]' : ''}`}>
                  {[d.date.weekday, d.date.day].filter(Boolean).join(', ')}
                  {d.date.time && <span className="text-[#2563EB]"> · {d.date.time}</span>}
                </dd>
              </>
            )}
            {d.venue && (
              <>
                <dt className={`px-3 py-2 border-r border-[#334155] font-mono text-[10px] tracking-[0.2em] uppercase text-[#64748B]`}>Mekân</dt>
                <dd className="px-3 py-2 text-[#0F172A] break-words">{d.venue}</dd>
              </>
            )}
          </dl>
        )}
        <HeroCountdown invitation={invitation} className="mt-5" numberClassName="font-mono text-[#0F172A]" labelClassName="text-[#64748B]" />
        {d.subtitle && <p className="mt-5 text-[15px] leading-relaxed text-[#475569]">{d.subtitle}</p>}
      </motion.div>
    </div>
  );
}

function IzometrikBackdrop() {
  return (
    <div className="absolute inset-0 bg-[#F6F5F0]">
      <div className="absolute inset-0 opacity-60 bg-[linear-gradient(#E5E7EB_1px,transparent_1px),linear-gradient(90deg,#E5E7EB_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_50%_35%,black,transparent_85%)]" />
    </div>
  );
}

/**
 * KurumsalIzometrik — "İzometrik Maket": SVG izometrik izdüşümle çizilmiş bir
 * mimari maket. Açılışta zemin plakası çizilir, ağaçlar belirir, katlar tek tek
 * yukarıdan inip üst üste oturur. Kaydırdıkça katlar dikeyde ayrılır (patlatılmış
 * görünüm). Her kat dolu bir bölümdür (Ajanda, Mekân, Galeri, Katkı, LCV);
 * kata ya da altındaki çipe dokunmak o bölüme kaydırır. Boş bölümün katı çizilmez.
 * Önizleme / azaltılmış hareket: hafif ayrık, sabit tek kare; döngü yok.
 */
export function KurumsalIzometrik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={IZOMETRIK_FLAVOR}
      mode={mode}
      themeOverride={IZOMETRIK_TEMASI}
      renderBackdrop={() => <IzometrikBackdrop />}
      renderHero={(props) => <IzometrikHero {...props} mode={mode} />}
    />
  );
}
