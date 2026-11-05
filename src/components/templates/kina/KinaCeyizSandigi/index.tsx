import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { KINA_FLAVOR } from '../flavors';

type Mode = 'preview' | 'live';

/** Palet: kına kırmızısı, ceviz, krem. */
const KINA = '#A3241C';

/** Misafir dokunmazsa sandık kendiliğinden bu süre sonra açılır (ms). */
const AUTO_OPEN_MS = 3600;

/**
 * Bölüm yüzeyleri "katlanmış bez" gibi okunur: keten dokusu, ortasında kat
 * izi, içte kına iplikli teyel ve üst/alt kenarda oya fistonu. Kompozisyon
 * bölümleri kendi çizdiği için bez görünümü `theme.surface` sınıfına bağlı
 * düz CSS ile verilir; sözde öğeler kutunun İÇİNDE kalır (Details kırpar).
 */
const BEZ_CSS = `
.kcs-bez{position:relative;background-color:#FBF4E6;
background-image:
radial-gradient(circle at 50% 0,${KINA} 3.2px,transparent 3.8px),
radial-gradient(circle at 50% 100%,${KINA} 3.2px,transparent 3.8px),
linear-gradient(180deg,transparent 49.6%,rgba(74,42,23,.07) 50%,rgba(255,255,255,.5) 50.6%,transparent 51.5%),
repeating-linear-gradient(90deg,rgba(74,42,23,.028) 0 1px,transparent 1px 3px),
repeating-linear-gradient(0deg,rgba(74,42,23,.025) 0 1px,transparent 1px 3px);
background-size:14px 8px,14px 8px,100% 100%,auto,auto;
background-position:0 0,0 100%,0 0,0 0,0 0;
background-repeat:repeat-x,repeat-x,no-repeat,repeat,repeat;
outline:1.5px dashed rgba(163,36,28,.45);outline-offset:-12px;
box-shadow:0 18px 30px -18px rgba(74,42,23,.45),0 2px 0 rgba(74,42,23,.08)}
@supports (animation-timeline: view()){
@media (prefers-reduced-motion: no-preference){
[data-mode="live"] .kcs-bez{animation:kcs-acil linear both;animation-timeline:view();animation-range:entry 0% entry 70%;transform-origin:50% 0}
}}
@keyframes kcs-acil{from{opacity:.2;transform:perspective(900px) rotateX(-38deg) scaleY(.82)}to{opacity:1;transform:none}}
`;

const SANDIK_TEMASI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#EFE2CB] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#4A2A17]',
  surface: 'kcs-bez',
  border: 'border-[#A3241C]/25',
  heading: 'text-[#4A2A17]',
  body: 'text-[#6B4A33]',
  accent: 'text-[#A3241C]',
  accentBg: 'bg-[#A3241C]',
  accentSoft: 'bg-[#A3241C]/10',
  input:
    'w-full bg-white/70 border border-[#A3241C]/25 rounded-lg px-3.5 py-2.5 text-sm text-[#4A2A17] placeholder:text-[#9C8068] focus:outline-none focus:border-[#A3241C] focus:ring-2 focus:ring-[#A3241C]/15 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#B9352B,#8E1D16)] hover:brightness-110 text-[#FBF4E6] shadow-lg shadow-[#A3241C]/25',
  buttonGhost: 'border border-[#A3241C]/35 text-[#4A2A17] hover:bg-[#A3241C]/10',
  divider: 'bg-[#A3241C]/20',
  timelineLine: 'from-[#A3241C]/70 via-[#A3241C]/30 to-transparent',
  timelineNode: 'bg-[#FBF4E6] border-[#A3241C]/45 rounded-full shadow-[0_0_0_4px_rgba(163,36,28,0.08)]',
  envelope: {
    paper: 'bg-[#5A341D]',
    flap: 'bg-[#4A2A17]',
    seal: 'bg-[#A3241C] text-[#FBF4E6]',
    glow: 'bg-[#A3241C]/25',
    card: 'bg-[#FBF4E6] border border-[#A3241C]/30'
  },
  mapHeader: 'bg-[#4A2A17]',
  footer: { names: 'text-[#6B4A33]', branding: 'text-[#9C8068]' }
};

const SANDIK_FLAVOR: TemplateFlavor = {
  ...KINA_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Çeyizimiz serildi, kınamız yakılıyor',
  headings: {
    timeline: 'Gecenin Akışı',
    details: 'Kınanın Yakılacağı Yer',
    gallery: 'Sandıktan Anılar',
    gift: 'Takı & Armağan',
    rsvp: 'Katılımınızı Bildirin'
  }
};

function useAnimated(mode: Mode) {
  const reduced = useReducedMotion() ?? false;
  return mode === 'live' && !reduced;
}

/** Sabit sahne: krem keten, köşelerde soluk kına dalı, ortada sıcak ışık. */
function SandikBackdrop() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#F8EEDC_0%,#EFE2CB_55%,#E3CFB0_100%)]">
      <div className="absolute inset-0 opacity-60 bg-[repeating-linear-gradient(90deg,rgba(74,42,23,0.025)_0_1px,transparent_1px_4px),repeating-linear-gradient(0deg,rgba(74,42,23,0.02)_0_1px,transparent_1px_4px)]" />
      <svg viewBox="0 0 120 120" className="absolute -top-4 -left-4 w-36 opacity-25" aria-hidden="true">
        <Dal />
      </svg>
      <svg viewBox="0 0 120 120" className="absolute -bottom-4 -right-4 w-36 opacity-25 rotate-180" aria-hidden="true">
        <Dal />
      </svg>
    </div>
  );
}

function Dal() {
  return (
    <g fill="none" stroke={KINA} strokeWidth="1.4" strokeLinecap="round">
      <path d="M10 110 C 30 80, 50 60, 100 20" />
      {[0.2, 0.4, 0.6, 0.8].map((t) => {
        const x = 10 + 90 * t;
        const y = 110 - 90 * t;
        return (
          <g key={t}>
            <path d={`M${x} ${y} q -14 -4 -16 -16 q 12 2 16 16 Z`} fill={KINA} fillOpacity="0.35" />
            <path d={`M${x} ${y} q 4 14 16 16 q -2 -12 -16 -16 Z`} fill={KINA} fillOpacity="0.35" />
          </g>
        );
      })}
      <circle cx="100" cy="20" r="4" fill={KINA} />
    </g>
  );
}

/** Oyma rozet: sekiz yapraklı çiçek, ortası pul. */
function Rozet({ x, y, r, id }: { x: number; y: number; r: number; id: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 3} fill="none" stroke="#2B160A" strokeOpacity="0.55" strokeWidth="1.2" />
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          transform={`rotate(${i * 45})`}
          d={`M0 0 C ${r * 0.35} ${-r * 0.35}, ${r * 0.3} ${-r * 0.85}, 0 ${-r} C ${-r * 0.3} ${-r * 0.85}, ${-r * 0.35} ${-r * 0.35}, 0 0 Z`}
          fill={`url(#${id}-oyuk)`}
          stroke="#2B160A"
          strokeOpacity="0.5"
          strokeWidth="0.7"
        />
      ))}
      <circle r={r * 0.22} fill={`url(#${id}-pirinc)`} />
    </g>
  );
}

/** Oyma lale: gövde + üç taç yaprağı. */
function Lale({ x, y, flip = false, id }: { x: number; y: number; flip?: boolean; id: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} stroke="#2B160A" strokeOpacity="0.5" strokeWidth="0.8">
      <path d="M0 22 C 0 14, 1 8, 0 2" fill="none" />
      <path d="M0 16 C -8 14, -11 8, -12 4 C -6 6, -2 10, 0 16 Z" fill={`url(#${id}-oyuk)`} />
      <path d="M0 2 C -7 0, -8 -9, -5 -14 C -3 -9, -1 -7, 0 -6 C 1 -7, 3 -9, 5 -14 C 8 -9, 7 0, 0 2 Z" fill={`url(#${id}-oyuk)`} />
    </g>
  );
}

/** Ceviz damarı: uzatılmış türbülans, çarpma karışımıyla gövdeye işlenir. */
function WoodDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-ceviz`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7A4825" />
        <stop offset="0.5" stopColor="#5E351B" />
        <stop offset="1" stopColor="#3E2211" />
      </linearGradient>
      <linearGradient id={`${id}-oyuk`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3A1F0E" />
        <stop offset="1" stopColor="#8A5530" />
      </linearGradient>
      <linearGradient id={`${id}-pirinc`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F4D58D" />
        <stop offset="0.5" stopColor="#C6923F" />
        <stop offset="1" stopColor="#7E5A22" />
      </linearGradient>
      <filter id={`${id}-damar`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.16" numOctaves="3" seed="7" />
        <feColorMatrix values="0 0 0 0 0.16  0 0 0 0 0.08  0 0 0 0 0.03  0 0 0 1.1 -0.35" />
        {/* Damar yalnızca şeklin içine düşer (kapağın kemer köşeleri saydam kalır). */}
        <feComposite in2="SourceGraphic" operator="in" />
      </filter>
    </defs>
  );
}

/** Sandığın ön yüzü (gövde): oyma panolar, pirinç köşebent, kilit. */
function ChestBody({ id, open }: { id: string; open: boolean }) {
  return (
    <svg viewBox="0 0 300 124" className="block w-full h-full" aria-hidden="true">
      <WoodDefs id={id} />
      <rect x="0" y="0" width="300" height="124" rx="4" fill={`url(#${id}-ceviz)`} />
      <rect x="0" y="0" width="300" height="124" rx="4" filter={`url(#${id}-damar)`} opacity="0.8" />
      {/* Üst ve alt silme */}
      <rect x="0" y="0" width="300" height="8" fill="#2B160A" opacity="0.35" />
      <rect x="0" y="112" width="300" height="12" fill="#2B160A" opacity="0.4" />
      {/* Panolar */}
      {[16, 196].map((px) => (
        <g key={px}>
          <rect x={px} y="18" width="88" height="86" rx="6" fill="none" stroke="#2B160A" strokeOpacity="0.55" strokeWidth="2" />
          <rect x={px + 5} y="23" width="78" height="76" rx="4" fill="none" stroke="#C99A62" strokeOpacity="0.28" strokeWidth="1" />
          <Rozet x={px + 44} y={61} r={20} id={id} />
        </g>
      ))}
      {/* Orta pano: laleler ve kilit */}
      <rect x="114" y="18" width="72" height="86" rx="6" fill="none" stroke="#2B160A" strokeOpacity="0.55" strokeWidth="2" />
      <Lale x={130} y={74} id={id} />
      <Lale x={170} y={74} flip id={id} />
      <g transform="translate(150 30)">
        <path d="M-13 0 H13 V22 C 13 30, 6 34, 0 36 C -6 34, -13 30, -13 22 Z" fill={`url(#${id}-pirinc)`} stroke="#5C3F14" strokeWidth="0.8" />
        <circle cy="12" r="3.2" fill="#2B160A" />
        <path d="M-1.6 13 L-2.4 22 H2.4 L1.6 13 Z" fill="#2B160A" />
        {/* Açılınca kilit dili kalkar */}
        <rect x="-4" y={open ? -9 : -3} width="8" height="7" rx="1.5" fill={`url(#${id}-pirinc)`} style={{ transition: 'y .4s' }} />
      </g>
      {/* Köşebentler */}
      {[
        [0, 0, 1, 1],
        [300, 0, -1, 1],
        [0, 124, 1, -1],
        [300, 124, -1, -1]
      ].map(([x, y, sx, sy]) => (
        <path
          key={`${x}-${y}`}
          transform={`translate(${x} ${y}) scale(${sx} ${sy})`}
          d="M0 0 H22 C 18 4, 14 6, 10 10 C 6 14, 4 18, 0 22 Z"
          fill={`url(#${id}-pirinc)`}
          opacity="0.95"
        />
      ))}
    </svg>
  );
}

/** Kapak: dış yüz (oymalı kemer) ve iç yüz (kına kırmızısı astar). */
function ChestLid({ id }: { id: string }) {
  return (
    <>
      <svg viewBox="0 0 300 58" className="absolute inset-0 w-full h-full [backface-visibility:hidden]" aria-hidden="true">
        <path d="M0 58 V 22 C 0 8, 40 0, 150 0 C 260 0, 300 8, 300 22 V 58 Z" fill={`url(#${id}-ceviz)`} />
        <path d="M0 58 V 22 C 0 8, 40 0, 150 0 C 260 0, 300 8, 300 22 V 58 Z" filter={`url(#${id}-damar)`} opacity="0.8" />
        <path d="M14 50 V 26 C 14 16, 50 10, 150 10 C 250 10, 286 16, 286 26 V 50 Z" fill="none" stroke="#2B160A" strokeOpacity="0.5" strokeWidth="1.6" />
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={38 + i * 28} cy={33} r="5" fill={`url(#${id}-oyuk)`} stroke="#2B160A" strokeOpacity="0.45" strokeWidth="0.7" />
        ))}
        <rect x="0" y="52" width="300" height="6" fill="#2B160A" opacity="0.45" />
        <rect x="137" y="46" width="26" height="12" rx="2" fill={`url(#${id}-pirinc)`} />
      </svg>
      <div
        className="absolute inset-0 rounded-t-[40%_70%] [backface-visibility:hidden] [transform:rotateX(180deg)] bg-[repeating-linear-gradient(45deg,#8E1D16_0_6px,#A3241C_6px_12px)] border-4 border-[#4A2A17]"
        aria-hidden="true"
      />
    </>
  );
}

interface ClothSpec {
  key: string;
  /** Sandık ağzına göre son konum (px, yukarı). */
  rise: number;
  width: string;
  height: number;
  className: string;
  edge: string;
}

/** Sandıktan kat kat yükselen örtüler — alttan üste. */
const CLOTHS: ClothSpec[] = [
  {
    key: 'yesil-oya',
    rise: 14,
    width: '86%',
    height: 34,
    className: 'bg-[linear-gradient(180deg,#5F7A4E,#4C6440)]',
    edge: '#E7D7A8'
  },
  {
    key: 'yazma',
    rise: 34,
    width: '80%',
    height: 34,
    className:
      'bg-[#A3241C] bg-[radial-gradient(circle,#F6EBD6_1.3px,transparent_1.8px),radial-gradient(circle,#E0A23B_1px,transparent_1.5px)] [background-size:12px_12px,12px_12px] [background-position:0_0,6px_6px]',
    edge: '#F6EBD6'
  },
  {
    key: 'dantel',
    rise: 54,
    width: '72%',
    height: 40,
    className: 'bg-[#FBF4E6] bg-[repeating-linear-gradient(90deg,rgba(74,42,23,0.04)_0_1px,transparent_1px_3px)]',
    edge: KINA
  }
];

/** Katlanmış örtü: kat izi, teyel ve alt kenarda oya fistonu. */
function Cloth({ spec, monogram }: { spec: ClothSpec; monogram?: string }) {
  return (
    <div
      className={`relative mx-auto rounded-[3px] shadow-[0_-6px_14px_-8px_rgba(43,22,10,0.55),0_8px_12px_-8px_rgba(43,22,10,0.6)] ${spec.className}`}
      style={{ width: spec.width, height: spec.height }}
    >
      {/* Kat izi */}
      <div className="absolute inset-x-0 top-[46%] h-px bg-black/15 shadow-[0_1px_0_rgba(255,255,255,0.35)]" />
      {/* Teyel */}
      <div className="absolute inset-[5px] rounded-[2px] border border-dashed opacity-70" style={{ borderColor: spec.edge }} />
      {/* Oya fistonu */}
      <div
        className="absolute inset-x-0 -bottom-[6px] h-[7px]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0, ${spec.edge} 3.4px, transparent 4px)`,
          backgroundSize: '10px 7px',
          backgroundRepeat: 'repeat-x'
        }}
      />
      {monogram && (
        <span className="absolute inset-0 flex items-center justify-center font-cormorant italic font-semibold text-[19px] tracking-[0.18em] text-[#A3241C]">
          {monogram}
        </span>
      )}
    </div>
  );
}

const LID_H = 58;
const BODY_H = 124;
const STACK_H = 92;
const EASE = [0.22, 1, 0.36, 1] as const;

function SandikHero({ invitation, mode }: HeroRenderProps & { mode: Mode }) {
  const d = useHeroData(invitation);
  const animated = useAnimated(mode);
  const rawId = useId().replace(/:/g, '');
  const id = `kcs-${rawId}`;

  // Önizleme ve azaltılmış hareket: kapak baştan açık, son kare.
  const [open, setOpen] = useState(!animated);
  const touched = useRef(false);

  useEffect(() => {
    if (!animated) {
      setOpen(true);
      return;
    }
    const timer = window.setTimeout(() => {
      if (!touched.current) setOpen(true);
    }, AUTO_OPEN_MS);
    return () => window.clearTimeout(timer);
  }, [animated]);

  const toggle = useCallback(() => {
    touched.current = true;
    setOpen((o) => !o);
  }, []);

  const monogram = d.hasNames ? d.people.map((p) => p.trim().charAt(0).toLocaleUpperCase('tr-TR')).join(' · ') : '';

  // Koreografi: açılırken kapak → örtüler alttan üste → yazılar; kapanırken ters.
  const t = (openDelay: number, closeDelay: number, duration: number) =>
    animated ? { duration, delay: open ? openDelay : closeDelay, ease: EASE } : { duration: 0 };

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-6 pt-12 pb-16 text-center">
      <style>{BEZ_CSS}</style>

      <motion.p
        initial={animated ? { opacity: 0, y: -8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-[#A3241C] font-medium"
      >
        {d.title || SANDIK_FLAVOR.tagline}
      </motion.p>

      <motion.h1
        initial={animated ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.45 }}
        className="mt-4 font-cormorant italic font-semibold leading-[0.95] text-[#4A2A17] text-[clamp(2.4rem,11cqw,4.6rem)] break-words max-w-full"
      >
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && <span className="block my-0.5 text-[0.42em] not-italic text-[#A3241C]">&amp;</span>}
              <span className="block">{p}</span>
            </React.Fragment>
          ))
        ) : (
          <span className="block">{NO_NAMES}</span>
        )}
      </motion.h1>

      {/* Sandık sahnesi — dokununca kapak açılır/kapanır */}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={open}
        aria-label={open ? 'Çeyiz sandığını kapat' : 'Çeyiz sandığını aç'}
        className="group relative mt-4 w-full max-w-[300px] cursor-pointer select-none rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A3241C]/50"
        style={{ height: STACK_H + LID_H + BODY_H }}
      >
        {/* Sandığın iç karanlığı (kapak kalkınca görünür) */}
        <div
          className="absolute inset-x-[3%] rounded-t-md bg-[linear-gradient(180deg,#1E0F06,#3A1F0E)]"
          style={{ top: STACK_H + 10, height: LID_H - 6 }}
        />

        {/* Kapak: menteşe üst kenarda, geriye doğru devrilir */}
        <div className="absolute inset-x-0 [perspective:700px]" style={{ top: STACK_H, height: LID_H }}>
          <motion.div
            className="absolute inset-0 [transform-style:preserve-3d] origin-top"
            initial={false}
            animate={{ rotateX: open ? -158 : 0 }}
            transition={t(0, 1.05, animated ? 1.1 : 0)}
          >
            <ChestLid id={id} />
          </motion.div>
        </div>

        {/* Örtüler: sandık ağzının üstünde kırpılır, katman katman yükselir */}
        <div className="absolute inset-x-[-6%] top-0 overflow-hidden" style={{ height: STACK_H + LID_H }}>
          {CLOTHS.map((c, i) => (
            <motion.div
              key={c.key}
              className="absolute inset-x-0"
              style={{ bottom: 0 }}
              initial={false}
              animate={{ y: open ? -c.rise : c.height + 12 }}
              transition={t(0.55 + i * 0.28, (CLOTHS.length - 1 - i) * 0.18, animated ? 0.95 : 0)}
            >
              <Cloth spec={c} monogram={i === CLOTHS.length - 1 ? monogram : undefined} />
            </motion.div>
          ))}
        </div>

        {/* Gövde */}
        <div
          className="absolute inset-x-0 drop-shadow-[0_18px_18px_rgba(43,22,10,0.35)] transition-transform duration-300 group-active:scale-[0.985]"
          style={{ top: STACK_H + LID_H, height: BODY_H }}
        >
          <ChestBody id={id} open={open} />
        </div>
      </button>

      <motion.p
        aria-hidden="true"
        initial={false}
        animate={{ opacity: animated && !open ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="mt-3 h-4 text-[11px] tracking-[0.25em] uppercase text-[#6B4A33]"
      >
        Sandığı açmak için dokunun
      </motion.p>

      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, y: open ? 0 : 10 }}
        transition={t(1.5, 0, animated ? 0.8 : 0)}
        className="flex flex-col items-center"
      >
        {d.date.day && (
          <p className="mt-2 font-cormorant text-2xl font-semibold text-[#4A2A17]">
            {d.date.weekday && <span className="block text-[11px] tracking-[0.35em] uppercase text-[#A3241C] mb-1 font-sans font-medium">{d.date.weekday}</span>}
            {d.date.day}
            {d.date.time && ` · ${d.date.time}`}
          </p>
        )}
        {d.venue && <p className="mt-1.5 text-sm text-[#6B4A33]">{d.venue}</p>}
        <HeroCountdown
          invitation={invitation}
          className="mt-5"
          numberClassName="font-cormorant font-semibold text-[#A3241C]"
          labelClassName="text-[#8A6A50]"
        />
        {d.subtitle && <p className="mt-5 max-w-md font-cormorant italic text-lg text-[#5A3A25]">{d.subtitle}</p>}
      </motion.div>
    </div>
  );
}

/**
 * KinaCeyizSandigi — "Çeyiz Sandığı": oymalı ceviz bir çeyiz sandığı (SVG
 * oyma motifleri, türbülans damarlı ahşap). Dokununca kapak CSS 3B menteşeyle
 * geriye devrilir; içinden oyalı örtüler ve yazmalar kat kat yükselir, en
 * üstteki örtüde baş harfler işlidir. Bölüm yüzeyleri oya kenarlı, kat izli
 * bez gibi çizilir ve kaydırınca (destekleyen tarayıcıda) açılarak serilir.
 * Önizleme ve azaltılmış harekette kapak baştan açıktır; döngü yoktur.
 */
export function KinaCeyizSandigi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={SANDIK_FLAVOR}
      mode={mode}
      themeOverride={SANDIK_TEMASI}
      renderBackdrop={() => <SandikBackdrop />}
      renderHero={(props) => <SandikHero {...props} mode={mode} />}
    />
  );
}

