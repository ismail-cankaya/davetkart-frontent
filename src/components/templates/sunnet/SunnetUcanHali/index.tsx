import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useTransform } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { clipSet, videoSet } from '../../shared/videoAssets';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { CinemaBackdrop, DateCountdown, LightLayer, ScrollCue, useTemplateFont } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { SUNNET_FLAVOR } from '../flavors';

const VIDEO = videoSet('sunnet-ucan-hali', { landscape: '50% 70%', portrait: '42% 70%' });
const TOZ = clipSet('sunnet-ucan-hali', 'on');
const FONTS = 'Cinzel:wght@500;700&family=Cormorant+Garamond:ital,wght@0,500;1,400';
const CINZEL = "[font-family:'Cinzel',var(--font-cormorant),serif]";
const SERIF = "[font-family:'Cormorant_Garamond',var(--font-cormorant),serif]";
const GOLD = 'bg-[linear-gradient(180deg,#FFF1C8_0%,#F3C65F_48%,#B8812C_100%)] bg-clip-text text-transparent';

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#0B0A22] [&_.font-serif]:[font-family:'Cinzel',var(--font-cormorant),serif] [&_.font-serif]:font-medium [&_.font-serif]:tracking-[0.04em]",
  page: 'text-[#ECE6FF]',
  surface: 'bg-[#15123A]/75 backdrop-blur-xl shadow-[0_0_80px_-30px_rgba(243,198,95,0.45)]',
  border: 'border-[#F3C65F]/20',
  heading: 'text-[#FBF4DF]',
  body: 'text-[#BDB5E0]',
  accent: 'text-[#F3C65F]',
  accentBg: 'bg-[#B3262E]',
  accentSoft: 'bg-[#F3C65F]/12',
  input:
    'w-full bg-[#0E0C2A]/80 border border-[#F3C65F]/25 rounded-xl px-3.5 py-2.5 text-sm text-[#FBF4DF] placeholder:text-[#7F78A8] focus:outline-none focus:border-[#F3C65F] focus:ring-2 focus:ring-[#F3C65F]/25 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(135deg,#C7303A,#8E1B26)] hover:brightness-110 text-[#FFF4E0] shadow-lg shadow-[#8E1B26]/40',
  buttonGhost: 'border border-[#F3C65F]/35 text-[#ECE6FF] hover:bg-[#F3C65F]/10',
  divider: 'bg-[#F3C65F]/18',
  timelineLine: 'from-[#F3C65F]/80 via-[#C7303A]/45 to-transparent',
  envelope: {
    paper: 'bg-[#1B1650]',
    flap: 'bg-[#231D63]',
    seal: 'bg-[#C7303A] text-[#FFF1C8]',
    glow: 'bg-[#F3C65F]/30',
    card: 'bg-[#FBF4DF] border border-[#F3C65F]/45'
  },
  mapHeader: 'bg-[#15123A]',
  footer: { names: 'text-[#BDB5E0]', branding: 'text-[#7F78A8]' }
};

const FLAVOR: TemplateFlavor = {
  ...SUNNET_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Şehzademiz halısıyla göklerde',
  headings: { timeline: 'Yolculuk Programı', details: 'İneceğimiz Yer', gallery: 'Masal Kareleri', gift: 'Hediye', rsvp: 'Halıda Yerinizi Ayırın' }
};

/**
 * Halı: kırmızı zemin, lacivert bordür, altın zikzak, ortada madalyon ve
 * madalyonun içine işlenmiş ad. Kenarlarda püsküller sallanır.
 */
function Carpet({ name, still }: { name: string; still: boolean }) {
  const short = name.length > 14 ? name.slice(0, 13) + '…' : name;
  return (
    <svg viewBox="0 0 320 190" className="w-full h-auto overflow-visible drop-shadow-[0_24px_30px_rgba(0,0,0,0.45)]" aria-hidden="true">
      <defs>
        <pattern id="hali-zikzak" width="12" height="10" patternUnits="userSpaceOnUse">
          <path d="M0 8 L6 2 L12 8" fill="none" stroke="#E7B654" strokeWidth="1.4" />
        </pattern>
        <pattern id="hali-zemin" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M11 3 L19 11 L11 19 L3 11 Z" fill="none" stroke="#B2343A" strokeWidth="1" />
          <circle cx="11" cy="11" r="1.6" fill="#D9A441" />
        </pattern>
        <radialGradient id="hali-isik" cx="35%" cy="25%" r="85%">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.22" />
        </radialGradient>
      </defs>
      {/* Püsküller (kısa kenarlar) */}
      {[0, 1].map((side) =>
        Array.from({ length: 13 }, (_, i) => {
          const y = 18 + i * 12.6;
          const x = side === 0 ? 10 : 310;
          const dir = side === 0 ? -1 : 1;
          return (
            <motion.line
              key={`${side}-${i}`}
              x1={x}
              y1={y}
              x2={x + dir * 12}
              y2={y + 2}
              stroke="#F1D9A0"
              strokeWidth="1.6"
              strokeLinecap="round"
              style={{ transformOrigin: `${x}px ${y}px` }}
              animate={still ? undefined : { rotate: [dir * -10, dir * 12, dir * -10] }}
              transition={{ duration: 1.6 + (i % 3) * 0.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.07 }}
            />
          );
        })
      )}
      <rect x="10" y="10" width="300" height="170" rx="4" fill="#1B2A5C" />
      <rect x="18" y="18" width="284" height="154" fill="url(#hali-zikzak)" />
      <rect x="30" y="30" width="260" height="130" fill="#8A1B22" stroke="#E7B654" strokeWidth="1.4" />
      <rect x="30" y="30" width="260" height="130" fill="url(#hali-zemin)" opacity="0.8" />
      {/* Köşe çeyrek madalyonları */}
      {[
        [30, 30, 0],
        [290, 30, 90],
        [290, 160, 180],
        [30, 160, 270]
      ].map(([x, y, r]) => (
        <path key={`${x}-${y}`} d="M0 0 L34 0 Q24 24 0 34 Z" fill="#1B2A5C" stroke="#E7B654" strokeWidth="1.2" transform={`translate(${x} ${y}) rotate(${r})`} />
      ))}
      {/* Madalyon */}
      <path d="M160 46 L236 95 L160 144 L84 95 Z" fill="#1B2A5C" stroke="#E7B654" strokeWidth="1.6" />
      <path d="M160 56 L220 95 L160 134 L100 95 Z" fill="#F4E2B4" stroke="#B8812C" strokeWidth="1" />
      <text x="160" y="100" textAnchor="middle" fontFamily="Cinzel, serif" fontSize={short.length > 9 ? 13 : 16} fontWeight="700" fill="#8A1B22" letterSpacing="1">
        {short}
      </text>
      <rect x="10" y="10" width="300" height="170" rx="4" fill="url(#hali-isik)" />
    </svg>
  );
}

const INTERACTIVE = 'a, button, input, select, textarea, label, [role="button"]';

interface Streak {
  id: number;
  x: number;
  y: number;
}

/** Dokunulan yerden çapraz kayan yıldız (en çok 4 tane aynı anda). */
function ShootingStars({ enabled, host }: { enabled: boolean; host: React.RefObject<HTMLDivElement | null> }) {
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const next = useRef(0);
  useEffect(() => {
    if (!enabled) return;
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest(INTERACTIVE)) return;
      const r = host.current?.getBoundingClientRect();
      if (!r || e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      const id = next.current++;
      setStreaks((s) => [...s.slice(-3), { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
      window.setTimeout(() => setStreaks((s) => s.filter((k) => k.id !== id)), 1300);
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, [enabled, host]);
  if (!enabled) return null;
  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[100svh] pointer-events-none z-30 overflow-hidden">
      <AnimatePresence>
        {streaks.map((s) => (
          <motion.span
            key={s.id}
            className="absolute h-[2px] w-40 origin-right rounded-full bg-[linear-gradient(90deg,transparent,#FFF6D8_80%,#FFFFFF)] shadow-[0_0_12px_#FFE7A8]"
            style={{ left: s.x - 160, top: s.y, rotate: -28 }}
            initial={{ opacity: 0, x: 0, y: 0, scaleX: 0.2 }}
            animate={{ opacity: [0, 1, 0], x: -260, y: 140, scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONTS);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const still = reduced || mode === 'preview';
  const fade = (delay: number) =>
    still ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 1, ease: [0.22, 1, 0.36, 1] as const } };
  const name = d.hasNames ? d.people.join(' & ') : NO_NAMES;
  const chips = [d.date.day, d.date.time, d.venue].filter(Boolean);
  const host = useRef<HTMLDivElement>(null);

  return (
    <div ref={host} className="relative grow flex flex-col">
      <div className="relative min-h-[100svh] flex flex-col items-center justify-start px-5 pt-[11svh] pb-24 text-center" dir="auto">
        <motion.p {...fade(0.3)} className={`${CINZEL} text-[10px] sm:text-[11px] tracking-[0.45em] uppercase text-[#F3C65F]`}>
          {d.title || 'Sünnet Düğünü'}
        </motion.p>
        <motion.h1
          {...fade(0.6)}
          className={`${CINZEL} ${GOLD} mt-4 font-bold leading-[1.02] tracking-[0.02em] text-[clamp(2.3rem,10cqw,5.6rem)] max-w-full break-words [filter:drop-shadow(0_4px_24px_rgba(243,198,95,0.35))]`}
        >
          {name}
        </motion.h1>
        <motion.p {...fade(1)} className={`${SERIF} mt-3 italic text-lg text-[#E3DAFF]`}>
          {d.subtitle || FLAVOR.tagline}
        </motion.p>

        {/* Uçan halı: süzülerek gelir, sonra dalgalanarak havada kalır. */}
        <motion.div
          className="relative mt-[5svh] w-[min(80vw,440px)] [perspective:900px]"
          initial={still ? false : { x: '-120vw', y: 60, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="[transform-style:preserve-3d]"
            style={{ rotateX: 56 }}
            animate={still ? undefined : { y: [0, -14, 0], rotateZ: [-2.5, 2, -2.5], rotateY: [4, -4, 4] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Carpet name={name} still={still} />
          </motion.div>
          {/* Halının altındaki sihirli ışıltı */}
          <div aria-hidden="true" className="absolute left-1/2 -bottom-6 -translate-x-1/2 w-[70%] h-10 rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,214,120,0.45),transparent)] blur-md" />
        </motion.div>

        {chips.length > 0 && (
          <motion.div {...fade(3)} className="mt-10 flex flex-wrap justify-center gap-2">
            {chips.map((t) => (
              <span key={t} className={`${SERIF} rounded-full border border-[#F3C65F]/30 bg-[#0E0C2A]/55 backdrop-blur px-4 py-1.5 text-sm text-[#FBF4DF]`}>
                {t}
              </span>
            ))}
          </motion.div>
        )}
        {mode === 'live' && !reduced && (
          <motion.p {...fade(3.6)} className={`${CINZEL} mt-6 text-[9px] tracking-[0.38em] uppercase text-[#A99FD6]`}>
            Kaydırın, şehrin üstünden uçalım
          </motion.p>
        )}
        <ScrollCue delay={still ? 0 : 3.8} className="text-[#F3C65F]" />
      </div>
      <ShootingStars enabled={!still} host={host} />
      <DateCountdown
        invitation={invitation}
        eyebrow="Büyük güne"
        classes={{
          root: 'min-h-[80svh]',
          eyebrow: 'text-[#F3C65F]',
          date: `${CINZEL} ${GOLD} font-bold text-[clamp(2.4rem,10cqw,5rem)] leading-none`,
          meta: 'text-[#BDB5E0]',
          cell: 'rounded-2xl bg-[#0E0C2A]/60 backdrop-blur border border-[#F3C65F]/20 px-2 py-3',
          number: `${CINZEL} font-semibold text-[#FBF4DF]`,
          label: 'text-[#A99FD6]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

/** Halının önünden süzülen yıldız tozu (ekran harmanı); hero'dan çıkınca söner. */
function Stardust({ heroExit, mode }: BackdropState & { mode: 'preview' | 'live' }) {
  const opacity = useTransform(heroExit, [0, 0.7], [1, 0.25]);
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <LightLayer video={TOZ} mode={mode} opacity={0.85} />
    </motion.div>
  );
}

function Backdrop(props: BackdropState & { mode: 'preview' | 'live' }) {
  return (
    <CinemaBackdrop
      {...props}
      video={VIDEO}
      playback={{ kind: 'scrub', progress: props.progress }}
      base="linear-gradient(180deg, #2A1B5E 0%, #6B3F7E 55%, #E08A6A 78%, #2A1B3E 100%)"
      dimRgb="11,10,34"
      dim={0.5}
      zoom={1.04}
    />
  );
}

/**
 * SunnetUcanHali — "Uçan Halı": alacakaranlıkta kubbeli, minareli bir şehrin
 * üstünde süzülen bir halı; madalyonuna çocuğun adı işlenmiş. Arka plan
 * kaydırmaya bağlı bir videodur (kodla üretilmiş): kaydırdıkça şehrin üstünden
 * ilerlenir, gece çöker, ay yükselir ve pencereler yanar. Önden süzülen yıldız
 * tozu ayrı bir ışık katmanı; dokunulan yerden yıldız kayar.
 */
export function SunnetUcanHali({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={FLAVOR}
      mode={mode}
      themeOverride={THEME}
      renderBackdrop={(state) => <Backdrop {...state} mode={mode} />}
      renderForeground={(state) => <Stardust {...state} mode={mode} />}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
