import React, { useCallback, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { DateCountdown, LiveShader, ScrollCue, useTemplateFont, type LiveShaderFrame, type UniformValue } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { NISAN_FLAVOR } from '../flavors';
import { KOI_FRAG } from './koiShader';
import { createKoiSim, type Food } from './koiSim';

const FONTS = 'Italiana&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400';
const ITALIANA = "[font-family:'Italiana',var(--font-cormorant),serif]";
const SERIF = "[font-family:'Cormorant_Garamond',var(--font-cormorant),serif]";

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#061615] [&_.font-serif]:[font-family:'Italiana',var(--font-cormorant),serif] [&_.font-serif]:tracking-[0.04em]",
  page: 'text-[#E4F1EC]',
  surface: 'bg-[#0B2422]/75 backdrop-blur-xl shadow-[0_0_70px_-30px_rgba(240,120,90,0.35)]',
  border: 'border-[#9FD6C6]/18',
  heading: 'text-[#F4FBF8]',
  body: 'text-[#A9C7BE]',
  accent: 'text-[#F2A07B]',
  accentBg: 'bg-[#D9573A]',
  accentSoft: 'bg-[#F2A07B]/12',
  input:
    'w-full bg-[#071B19]/80 border border-[#9FD6C6]/22 rounded-xl px-3.5 py-2.5 text-sm text-[#F4FBF8] placeholder:text-[#6F918A] focus:outline-none focus:border-[#F2A07B] focus:ring-2 focus:ring-[#F2A07B]/25 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(135deg,#E8714F,#C9472C)] hover:brightness-110 text-[#FFF5F0] shadow-lg shadow-[#C9472C]/30',
  buttonGhost: 'border border-[#9FD6C6]/30 text-[#E4F1EC] hover:bg-[#9FD6C6]/10',
  divider: 'bg-[#9FD6C6]/16',
  timelineLine: 'from-[#F2A07B]/80 via-[#9FD6C6]/40 to-transparent',
  envelope: {
    paper: 'bg-[#0E2E2A]',
    flap: 'bg-[#123833]',
    seal: 'bg-[#D9573A] text-[#FFF5F0]',
    glow: 'bg-[#F7D58A]/30',
    card: 'bg-[#F6F1E7] border border-[#9FD6C6]/40'
  },
  mapHeader: 'bg-[#0B2422]',
  footer: { names: 'text-[#A9C7BE]', branding: 'text-[#6F918A]' }
};

const FLAVOR: TemplateFlavor = {
  ...NISAN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'İki ayrı akıntı, tek bir havuz',
  headings: { timeline: 'Nişan Akışı', details: 'Buluşma Yeri', gallery: 'Bizden Kareler', gift: 'Hediye', rsvp: 'Katılımınızı Bildirin' }
};

/** WebGL yokken / önizlemede: aynı kompozisyonun durağan SVG'si. */
function StaticPond() {
  const koi = (fill: string, spot: string, rotate: number) => (
    <g transform={`rotate(${rotate} 200 230)`}>
      <path d="M200 140 C 232 150 246 190 238 230 C 232 262 214 288 200 300 C 206 286 206 268 200 250 C 188 220 176 186 200 140 Z" fill={fill} opacity="0.95" />
      <path d="M200 300 C 186 318 214 330 206 312 C 218 324 222 306 200 300 Z" fill={fill} opacity="0.7" />
      <ellipse cx="214" cy="190" rx="12" ry="18" fill={spot} opacity="0.85" />
    </g>
  );
  return (
    <svg viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="koi-dip" cx="50%" cy="55%" r="70%">
          <stop offset="0" stopColor="#16403A" />
          <stop offset="1" stopColor="#051514" />
        </radialGradient>
      </defs>
      <rect width="400" height="460" fill="url(#koi-dip)" />
      <g transform="translate(-14 26)">
        {koi('#F7F2EA', '#E2452A', 0)}
        {koi('#F6C451', '#FBE08E', 180)}
      </g>
      {[
        [60, 70, 34],
        [345, 60, 28],
        [355, 380, 36],
        [45, 400, 30]
      ].map(([x, y, r]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={r} fill="#2F6A3A" />
          <path d={`M${x} ${y} L${x + r} ${y - 6} L${x + r} ${y + 6} Z`} fill="#0A2422" />
        </g>
      ))}
      <circle cx="68" cy="66" r="11" fill="#F7B8C8" />
      <circle cx="68" cy="66" r="4" fill="#F7D467" />
    </svg>
  );
}

function Backdrop(props: BackdropState & { mode: 'preview' | 'live' }) {
  const sim = useRef(createKoiSim());
  const foods = useRef<Food[]>([]);
  const ripples = useRef<number[]>(new Array(16).fill(0));
  const nextRipple = useRef(0);
  const lastClock = useRef<number | null>(null);

  const uniforms = useCallback(({ clock }: LiveShaderFrame): Record<string, UniformValue> => {
    const dt = lastClock.current === null ? 1 / 60 : Math.min(0.05, clock - lastClock.current);
    lastClock.current = clock;
    const spine = sim.current.step(dt, clock, foods.current);
    const food = new Array(16).fill(0);
    foods.current.slice(-4).forEach((f, i) => food.splice(i * 4, 4, f.x, f.y, f.at, f.active ? 1 : 0));
    return {
      uSpine: { type: '2fv', value: spine },
      uRipples: { type: '4fv', value: ripples.current },
      uFood: { type: '4fv', value: food }
    };
  }, []);

  const onPointer = useCallback((x: number, y: number, clock: number) => {
    const i = nextRipple.current;
    nextRipple.current = (i + 1) % 4;
    ripples.current.splice(i * 4, 4, x, y, clock, 1);
    foods.current = [...foods.current.filter((f) => f.active && clock - f.at < 6).slice(-3), { x, y, at: clock, active: true }];
  }, []);

  return (
    <div className="absolute inset-0 bg-[#061615]">
      <StaticPond />
      <LiveShader fragment={KOI_FRAG} mode={props.mode} uniforms={uniforms} onPointer={onPointer} />
    </div>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONTS);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const still = reduced || mode === 'preview';
  const fade = (delay: number) =>
    still ? {} : { initial: { opacity: 0, y: 12, filter: 'blur(6px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, transition: { delay, duration: 1.4, ease: [0.22, 1, 0.36, 1] as const } };
  const names = d.hasNames ? d.people : [NO_NAMES];
  const meta = [d.date.dayMonth || d.date.day, d.date.time, d.venue].filter(Boolean);
  const shadow = '[text-shadow:0_2px_18px_rgba(2,12,11,0.85),0_0_2px_rgba(2,12,11,0.6)]';

  return (
    <div className="relative grow flex flex-col">
      <div className="relative min-h-[100svh] flex flex-col items-center justify-between px-5 pt-[9svh] pb-28 text-center pointer-events-none" dir="auto">
        <div>
          <motion.p {...fade(0.3)} className={`${SERIF} text-[11px] tracking-[0.42em] uppercase text-[#F2A07B] ${shadow}`}>
            {d.title || 'Nişan Davetiyesi'}
          </motion.p>
          <h1 className={`${ITALIANA} mt-4 text-[#F7FCFA] leading-[1] text-[clamp(2.6rem,12cqw,5.6rem)] break-words max-w-full ${shadow}`}>
            {names.map((p, i) => (
              <motion.span key={p + i} {...fade(0.7 + i * 0.5)} className="block">
                {i > 0 && <span className={`${SERIF} block italic text-[0.34em] text-[#F2A07B] my-1`}>ile</span>}
                {p}
              </motion.span>
            ))}
          </h1>
        </div>
        <div className="mt-[34svh]">
          <motion.p {...fade(1.8)} className={`${SERIF} text-lg italic text-[#DCEDE7] max-w-sm mx-auto ${shadow}`}>
            {d.subtitle || FLAVOR.tagline}
          </motion.p>
          {meta.length > 0 && (
            <motion.p {...fade(2.1)} className={`${SERIF} mt-3 text-[13px] tracking-[0.2em] uppercase text-[#F4FBF8] ${shadow}`}>
              {meta.join('  ·  ')}
            </motion.p>
          )}
          {mode === 'live' && !reduced && (
            <motion.p {...fade(2.6)} className={`${SERIF} mt-4 text-[10px] tracking-[0.35em] uppercase text-[#9FC9BE] ${shadow}`}>
              Suya dokunun, koilere yem atın
            </motion.p>
          )}
        </div>
        <ScrollCue delay={still ? 0 : 3} className="text-[#F2A07B]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Buluşmaya kalan"
        classes={{
          root: 'min-h-[75svh]',
          eyebrow: 'text-[#F2A07B]',
          date: `${ITALIANA} text-[clamp(2.8rem,12cqw,5.6rem)] leading-none text-[#F4FBF8] ${shadow}`,
          meta: 'text-[#A9C7BE]',
          cell: 'rounded-2xl bg-[#071B19]/60 backdrop-blur border border-[#9FD6C6]/18 px-2 py-3',
          number: `${SERIF} font-medium text-[#F4FBF8]`,
          label: 'text-[#6F918A]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

/**
 * NisanKoi — "Koi Havuzu": nilüferli bir gece havuzu, iki koi (biri kar
 * beyazı-kırmızı, biri altın). Balıklar birbirinin kuyruğunu kovalayarak
 * yin-yang biçiminde döner; hepsi tek bir canlı WebGL shader'ında çizilir
 * (gövde = omurga segmentlerine uzaklık). Misafir suya dokununca halka
 * yayılır ve yem düşer: en yakın balık yöne döner, hızlanır ve yer.
 */
export function NisanKoi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={FLAVOR}
      mode={mode}
      themeOverride={THEME}
      renderBackdrop={(state) => <Backdrop {...state} mode={mode} />}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
