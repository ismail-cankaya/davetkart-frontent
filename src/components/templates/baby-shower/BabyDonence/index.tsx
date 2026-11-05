import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { BABY_SHOWER_FLAVOR } from '../flavors';

type Mode = 'preview' | 'live';
type FigureKind = 'moon' | 'star' | 'cloud';

interface FigureSpec {
  kind: FigureKind;
  /** İp uzunluğu (px). Uzun ip = yavaş, geniş salınım. */
  length: number;
  size: number;
  /** Önizleme karesinde ve açılışta başlangıç açısı (radyan). */
  rest: number;
}

const FIGURES: FigureSpec[] = [
  { kind: 'moon', length: 96, size: 70, rest: 0.08 },
  { kind: 'star', length: 58, size: 48, rest: -0.12 },
  { kind: 'cloud', length: 118, size: 80, rest: 0.05 },
  { kind: 'star', length: 84, size: 42, rest: 0.14 },
  { kind: 'cloud', length: 70, size: 64, rest: -0.06 }
];

const INK = '#3E4A66';
const HONEY = '#E9B55C';

const DONENCE_TEMASI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#FBF6EC] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#3E4A66]',
  surface: 'bg-white/75 backdrop-blur-md shadow-[0_18px_40px_-26px_rgba(80,110,160,0.45)]',
  border: 'border-[#BFD3EA]/70',
  heading: 'text-[#34405C]',
  body: 'text-[#5D6A85]',
  accent: 'text-[#C98E2E]',
  accentBg: 'bg-[#E9B55C]',
  accentSoft: 'bg-[#E9B55C]/12',
  input:
    'w-full bg-white/80 border border-[#BFD3EA] rounded-xl px-3.5 py-2.5 text-sm text-[#34405C] placeholder:text-[#9AA6BD] focus:outline-none focus:border-[#E9B55C] focus:ring-2 focus:ring-[#E9B55C]/25 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#F3CB7E,#E2A748)] hover:brightness-105 text-[#3A2A10] shadow-lg shadow-[#E9B55C]/30',
  buttonGhost: 'border border-[#BFD3EA] text-[#3E4A66] hover:bg-[#DCE8F5]/60',
  divider: 'bg-[#BFD3EA]/70',
  timelineLine: 'from-[#E9B55C]/80 via-[#BFD3EA] to-transparent',
  envelope: {
    paper: 'bg-[#EAF1F9]',
    flap: 'bg-[#DCE8F5]',
    seal: 'bg-[#E9B55C] text-[#3A2A10]',
    glow: 'bg-[#E9B55C]/25',
    card: 'bg-[#FFFBF2] border border-[#E9B55C]/40'
  },
  mapHeader: 'bg-[#EAF1F9]',
  footer: { names: 'text-[#5D6A85]', branding: 'text-[#9AA6BD]' }
};

const DONENCE_FLAVOR: TemplateFlavor = {
  ...BABY_SHOWER_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Dönence dönüyor, minik yolcu geliyor',
  headings: { timeline: 'Günün Akışı', details: 'Buluşma Yeri', gallery: 'Bekleyişten Kareler', gift: 'Hediye Listesi', rsvp: 'Katılımınızı Bildirin' }
};

/** Animasyon ancak misafir sayfasında ve hareket azaltılmamışsa çalışır. */
function useAnimated(mode: Mode) {
  const reduced = useReducedMotion() ?? false;
  return mode === 'live' && !reduced;
}

/* ───────────────────────── Figürler (SVG) ───────────────────────── */

function SleepyFace({ cx, cy, s }: { cx: number; cy: number; s: number }) {
  return (
    <g stroke={INK} strokeWidth={1.4 * s} strokeLinecap="round" fill="none" opacity="0.7">
      <path d={`M${cx - 7 * s} ${cy} q ${3 * s} ${3 * s} ${6 * s} 0`} />
      <path d={`M${cx + 1 * s} ${cy} q ${3 * s} ${3 * s} ${6 * s} 0`} />
      <circle cx={cx - 9 * s} cy={cy + 6 * s} r={2.4 * s} fill="#F4B9B2" stroke="none" opacity="0.6" />
      <circle cx={cx + 9 * s} cy={cy + 6 * s} r={2.4 * s} fill="#F4B9B2" stroke="none" opacity="0.6" />
    </g>
  );
}

function FigureArt({ kind }: { kind: FigureKind }) {
  if (kind === 'moon') {
    return (
      <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible" aria-hidden="true">
        <path d="M40 6a26 26 0 1 0 18 40A21 21 0 1 1 40 6Z" fill="#FFF3D6" stroke="#E9C98A" strokeWidth="1.5" />
        <circle cx="22" cy="44" r="2.2" fill="#F1DDAE" />
        <circle cx="16" cy="30" r="1.4" fill="#F1DDAE" />
        <SleepyFace cx={24} cy={36} s={0.8} />
      </svg>
    );
  }
  if (kind === 'star') {
    return (
      <svg viewBox="0 0 64 64" className="w-full h-full overflow-visible" aria-hidden="true">
        <path
          d="M32 4l7.6 16.4 17.9 2.2-13.2 12.3 3.4 17.7L32 43.8 16.3 52.6l3.4-17.7L6.5 22.6l17.9-2.2Z"
          fill="#F6CF82"
          stroke={HONEY}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <SleepyFace cx={32} cy={30} s={0.7} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 56" className="w-full h-full overflow-visible" aria-hidden="true">
      <path
        d="M18 48a13 13 0 0 1-1-26 17 17 0 0 1 32-6 13 13 0 0 1 19 11 11 11 0 0 1-2 21Z"
        fill="#DCE8F5"
        stroke="#A9C3E3"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <SleepyFace cx={40} cy={34} s={0.8} />
    </svg>
  );
}

/* ───────────────────────── Fizik ───────────────────────── */

interface Swing {
  phi: number;
  omega: number;
}

/** Mobil halkasının yarıçapı ve basıklığı (2B izdüşüm). */
const RING_RX = 118;
const RING_RY = 22;
const RING_Y = 34;

function layout(rot: number, i: number) {
  const theta = rot + (i / FIGURES.length) * Math.PI * 2;
  const depth = Math.cos(theta); // 1 = önde, -1 = arkada
  return {
    x: Math.sin(theta) * RING_RX,
    y: RING_Y + depth * RING_RY,
    depth,
    scale: 0.78 + 0.22 * (depth + 1) * 0.5,
    opacity: 0.62 + 0.38 * (depth + 1) * 0.5
  };
}

function applyFrame(
  outer: (HTMLDivElement | null)[],
  inner: (HTMLDivElement | null)[],
  rot: number,
  swings: Swing[]
) {
  for (let i = 0; i < FIGURES.length; i++) {
    const o = outer[i];
    const n = inner[i];
    if (!o || !n) continue;
    const l = layout(rot, i);
    o.style.transform = `translate3d(${l.x.toFixed(2)}px, ${l.y.toFixed(2)}px, 0) scale(${l.scale.toFixed(3)})`;
    o.style.opacity = l.opacity.toFixed(3);
    o.style.zIndex = String(Math.round((l.depth + 1) * 10) + (l.depth > 0 ? 20 : 0));
    n.style.transform = `rotate(${swings[i].phi.toFixed(4)}rad)`;
  }
}

/**
 * Dönence: halka + ipler + figürler. Her figür sönümlü bir açısal yaydır
 * (sarkaç: φ'' = −(g/L)·φ − c·φ'), kendi rAF integratörüyle ilerler.
 * Kaydırma halkayı döndürür; halkanın açısal ivmesi figürlere geri tepki
 * olarak geçer. Dokunma figüre bir itki (ω += ±J) verir.
 */
function Mobile({ rotTarget, animated }: { rotTarget: MotionValue<number>; animated: boolean }) {
  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const swings = useRef<Swing[]>(FIGURES.map((f, i) => ({ phi: animated ? (i % 2 ? -0.9 : 0.9) : f.rest, omega: 0 })));

  useEffect(() => {
    const STATIC_ROT = 0.32;
    if (!animated) {
      swings.current.forEach((s, i) => {
        s.phi = FIGURES[i].rest;
        s.omega = 0;
      });
      applyFrame(outerRefs.current, innerRefs.current, STATIC_ROT, swings.current);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const start = last;
    let rot = STATIC_ROT;
    let rotVel = 0;
    const tick = (now: number) => {
      const dt = Math.min(1 / 30, (now - last) / 1000);
      last = now;
      const t = (now - start) / 1000;
      // Hedef açı: kaydırma + çok yavaş kendiliğinden dönüş
      const target = STATIC_ROT + rotTarget.get() + t * 0.09;
      const prevVel = rotVel;
      // Halka kritik sönümlü yayla hedefe yetişir (atalet hissi)
      const k = 14;
      const acc = k * (target - rot) - 2 * Math.sqrt(k) * rotVel;
      rotVel += acc * dt;
      rot += rotVel * dt;
      const ringAcc = (rotVel - prevVel) / Math.max(dt, 1e-4);

      for (let i = 0; i < FIGURES.length; i++) {
        const s = swings.current[i];
        const g = 2600 / FIGURES[i].length; // g/L
        const c = 0.9;
        const drive = -ringAcc * 0.06 * Math.cos(rot + (i / FIGURES.length) * Math.PI * 2);
        const a = -g * Math.sin(s.phi) - c * s.omega + drive;
        s.omega += a * dt; // yarı-örtük Euler
        s.phi += s.omega * dt;
        if (s.phi > 1.3) {
          s.phi = 1.3;
          s.omega *= -0.4;
        } else if (s.phi < -1.3) {
          s.phi = -1.3;
          s.omega *= -0.4;
        }
      }
      applyFrame(outerRefs.current, innerRefs.current, rot, swings.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animated, rotTarget]);

  const fling = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const s = swings.current[i];
    const rect = e.currentTarget.getBoundingClientRect();
    const dir = e.clientX === 0 && e.clientY === 0 ? (Math.random() < 0.5 ? -1 : 1) : e.clientX < rect.left + rect.width / 2 ? -1 : 1;
    s.omega += dir * (5 + Math.random() * 2);
    // Komşulara ip üzerinden küçük bir titreşim geçer
    const n = FIGURES.length;
    swings.current[(i + 1) % n].omega += dir * 0.9;
    swings.current[(i + n - 1) % n].omega += dir * 0.9;
  };

  return (
    <div className="relative mx-auto h-[250px] w-[300px] sm:h-[280px] sm:w-[340px]" aria-label="Dönence">
      {/* Tavan ipi + kanca */}
      <div className="absolute left-1/2 -top-6 h-[36px] w-px -translate-x-1/2 bg-[#9DB2CF]" />
      <div className="absolute left-1/2 top-[9px] h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#C9A25A] bg-[#FFF3D6]" />
      {/* Halka (perspektif elips) — önde kalanlar üstüne, arkadakiler altına çizilir */}
      <svg className="absolute inset-x-0 top-0 h-[80px] w-full z-[20] pointer-events-none" viewBox="-150 0 300 80" aria-hidden="true">
        <line x1="0" y1="15" x2={-RING_RX} y2={RING_Y} stroke="#B9CBE2" strokeWidth="1" />
        <line x1="0" y1="15" x2={RING_RX} y2={RING_Y} stroke="#B9CBE2" strokeWidth="1" />
        <line x1="0" y1="15" x2="0" y2={RING_Y + RING_RY} stroke="#B9CBE2" strokeWidth="1" />
        <ellipse cx="0" cy={RING_Y} rx={RING_RX} ry={RING_RY} fill="none" stroke="#E9C98A" strokeWidth="3" />
        <ellipse cx="0" cy={RING_Y} rx={RING_RX} ry={RING_RY} fill="none" stroke="#FFF3D6" strokeWidth="1" />
      </svg>
      {FIGURES.map((f, i) => (
        <div
          key={i}
          ref={(el) => {
            outerRefs.current[i] = el;
          }}
          className="absolute left-1/2 top-0 h-0 w-0 will-change-transform"
        >
          <div
            ref={(el) => {
              innerRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 origin-top"
          >
            <motion.div
              initial={animated ? { opacity: 0, scaleY: 0 } : false}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 0.7 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-0 w-px origin-top bg-[#9DB2CF]"
              style={{ height: f.length }}
            />
            <motion.button
              type="button"
              onClick={(e) => fling(i, e)}
              aria-label="Figürü salla"
              initial={animated ? { opacity: 0, y: -24, scale: 0.6 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.95 + i * 0.12, type: 'spring', stiffness: 220, damping: 14 }}
              className="absolute cursor-pointer rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-[#E9B55C] drop-shadow-[0_8px_10px_rgba(90,120,170,0.22)]"
              style={{ top: f.length - 4, left: -(f.size + 8) / 2, width: f.size + 8, height: f.size * (f.kind === 'cloud' ? 0.72 : 1) + 8 }}
            >
              <FigureArt kind={f.kind} />
            </motion.button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── Sahne ───────────────────────── */

function DonenceBackdrop({ heroExit, mode }: BackdropState & { mode: Mode }) {
  const animated = useAnimated(mode);
  const dusk = useTransform(heroExit, [0, 1], [0, 0.55]);
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#E4EEF8_0%,#F3F1EA_48%,#FBF6EC_100%)]">
      <motion.div
        style={{ opacity: dusk }}
        className="absolute inset-0 bg-[linear-gradient(180deg,#C9D9EE_0%,#E7E2F1_60%,transparent_100%)]"
      />
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#E9B55C_0.9px,transparent_1.2px)] bg-[size:46px_46px] [mask-image:radial-gradient(ellipse_at_50%_20%,black,transparent_75%)]" />
      <motion.div
        aria-hidden="true"
        className="absolute -left-16 top-[58%] h-40 w-72 rounded-full bg-white/60 blur-2xl"
        animate={animated ? { x: [0, 40, 0] } : undefined}
        transition={animated ? { duration: 18, repeat: Infinity, ease: 'easeInOut' } : undefined}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -right-20 top-[22%] h-32 w-64 rounded-full bg-[#DCE8F5]/80 blur-2xl"
        animate={animated ? { x: [0, -30, 0] } : undefined}
        transition={animated ? { duration: 22, repeat: Infinity, ease: 'easeInOut' } : undefined}
      />
    </div>
  );
}

interface InfoCard {
  key: string;
  label: string;
  value: string;
  extra?: string;
}

function DonenceHero({ invitation, scrollContainer, mode }: HeroRenderProps & { mode: Mode }) {
  const d = useHeroData(invitation);
  const animated = useAnimated(mode);
  const { scrollY } = useScroll({ container: scrollContainer });
  // Bir ekran boyu kaydırma ≈ halkanın bir buçuk tur dönmesi
  const rotTarget = useTransform(scrollY, (y) => (y / (scrollContainer?.current?.clientHeight || 800)) * Math.PI * 3);

  const cards: InfoCard[] = [];
  if (d.date.day) cards.push({ key: 'date', label: d.date.weekday || 'Tarih', value: d.date.day, extra: d.date.time || undefined });
  if (d.venue) cards.push({ key: 'venue', label: 'Yer', value: d.venue });

  const rise = (delay: number) =>
    animated
      ? { initial: { opacity: 0, y: 14, filter: 'blur(6px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }
      : {};

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-5 pt-12 pb-20 text-center text-[#3E4A66]">
      <motion.p {...rise(0.2)} className="text-[10px] sm:text-[11px] tracking-[0.38em] uppercase text-[#C98E2E]">
        {d.title || DONENCE_FLAVOR.tagline}
      </motion.p>

      <motion.h1
        {...rise(0.45)}
        className="mt-4 font-cormorant italic font-semibold leading-[0.98] text-[#34405C] text-[clamp(2.4rem,11cqw,4.8rem)] break-words max-w-full"
      >
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && <span className="block my-1 text-[0.42em] not-italic text-[#C98E2E]">&amp;</span>}
              <span className="block">{p}</span>
            </React.Fragment>
          ))
        ) : (
          <span className="block">{NO_NAMES}</span>
        )}
      </motion.h1>

      {/* Dönence yukarıdan iner */}
      <motion.div
        initial={animated ? { y: -80, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 70, damping: 11 }}
        className="relative z-20 mt-12"
      >
        <div className="origin-top sm:scale-[1.3] sm:mb-[84px]">
          <Mobile rotTarget={rotTarget} animated={animated} />
        </div>
      </motion.div>
      {animated && (
        <motion.p {...rise(2.4)} className="relative z-20 -mt-2 text-[10px] tracking-[0.3em] uppercase text-[#8E9AB4]">
          Figürlere dokunun
        </motion.p>
      )}

      {/* Bilgi kartları figürlerin arkasından çıkar */}
      {cards.length > 0 && (
        <div className="relative z-10 mt-5 grid w-full max-w-sm grid-cols-1 gap-3">
          {cards.map((c, i) => (
            <motion.div
              key={c.key}
              initial={animated ? { opacity: 0, y: -90, scale: 0.7, rotate: i % 2 ? 4 : -4 } : false}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{ delay: 1.7 + i * 0.18, type: 'spring', stiffness: 120, damping: 15 }}
              className="rounded-2xl border border-[#BFD3EA]/80 bg-white/80 px-5 py-3.5 shadow-[0_18px_36px_-24px_rgba(80,110,160,0.55)] backdrop-blur-md"
            >
              <p className="text-[10px] tracking-[0.32em] uppercase text-[#C98E2E]">{c.label}</p>
              <p className="mt-1 font-cormorant text-xl font-semibold text-[#34405C] break-words">
                {c.value}
                {c.extra && <span className="text-[#5D6A85]"> · {c.extra}</span>}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div {...rise(2.2)} className="relative z-10 flex flex-col items-center">
        <HeroCountdown
          invitation={invitation}
          className="mt-6"
          numberClassName="font-cormorant font-semibold text-[#34405C]"
          labelClassName="text-[#8E9AB4]"
        />
        {d.subtitle && <p className="mt-5 max-w-md font-cormorant italic text-lg text-[#5D6A85]">{d.subtitle}</p>}
      </motion.div>
    </div>
  );
}

/**
 * BabyDonence — "Dönence": beşik dönencesi. Halkadan sarkan ay, yıldız ve
 * bulutlar her biri kendi sönümlü sarkaç yayıyla (tek rAF integratörü) sallanır;
 * dokunulan figür savrulur ve komşularını titretir. Kaydırma halkayı 2B
 * izdüşümle döndürür (derinliğe göre ölçek/opaklık/z-sırası). Açılışta halka
 * iner, ipler uzar, figürler yayla belirir, bilgi kartları figürlerin
 * arkasından çıkar. Önizleme ve azaltılmış hareket kipinde tek statik kare.
 */
export function BabyDonence({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={DONENCE_FLAVOR}
      mode={mode}
      themeOverride={DONENCE_TEMASI}
      renderBackdrop={(state) => <DonenceBackdrop {...state} mode={mode} />}
      renderHero={(props) => <DonenceHero {...props} mode={mode} />}
    />
  );
}
