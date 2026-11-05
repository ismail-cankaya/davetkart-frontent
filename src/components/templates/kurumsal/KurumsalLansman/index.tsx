import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { clipSet, videoSet } from '../../shared/videoAssets';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { CinemaBackdrop, DateCountdown, ScrollCue, useTemplateFont } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { KURUMSAL_FLAVOR } from '../flavors';

const VIDEO = videoSet('kurumsal-lansman', { landscape: '50% 45%', portrait: '50% 40%' });
const GIRIS = clipSet('kurumsal-lansman', 'giris', { landscape: '50% 45%', portrait: '50% 40%' });
const FONT = 'Space+Grotesk:wght@300..700';
const GROTESK = "[font-family:'Space_Grotesk',var(--font-sans),sans-serif]";
/** Giriş klibinde LED duvar ~2,0 sn'de açılmaya başlar, ~4,3 sn'de tamdır. */
const WALL_ON = 2.3;

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#03050C] [&_.font-serif]:[font-family:'Space_Grotesk',var(--font-sans),sans-serif] [&_.font-serif]:font-semibold [&_.font-serif]:tracking-[-0.02em]",
  page: 'text-[#DCE6FF]',
  surface: 'bg-[#0A1022]/75 backdrop-blur-xl shadow-[0_0_80px_-30px_rgba(64,140,255,0.55)]',
  border: 'border-[#6FA8FF]/20',
  heading: 'text-[#F3F7FF]',
  body: 'text-[#A6B4D6]',
  accent: 'text-[#5FD4FF]',
  accentBg: 'bg-[#3D8BFF]',
  accentSoft: 'bg-[#3D8BFF]/12',
  input:
    'w-full bg-[#060A18]/80 border border-[#6FA8FF]/25 rounded-xl px-3.5 py-2.5 text-sm text-[#F3F7FF] placeholder:text-[#6B7AA3] focus:outline-none focus:border-[#5FD4FF] focus:ring-2 focus:ring-[#5FD4FF]/25 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(90deg,#3D8BFF,#7A5CFF)] hover:brightness-110 text-white shadow-lg shadow-[#3D8BFF]/30',
  buttonGhost: 'border border-[#6FA8FF]/35 text-[#DCE6FF] hover:bg-[#6FA8FF]/10',
  divider: 'bg-[#6FA8FF]/18',
  timelineLine: 'from-[#5FD4FF]/80 via-[#7A5CFF]/45 to-transparent',
  envelope: {
    paper: 'bg-[#0A1022]',
    flap: 'bg-[#101A36]',
    seal: 'bg-[#3D8BFF] text-white',
    glow: 'bg-[#5FD4FF]/30',
    card: 'bg-[#F3F7FF] border border-[#6FA8FF]/45'
  },
  mapHeader: 'bg-[#0A1022]',
  footer: { names: 'text-[#A6B4D6]', branding: 'text-[#6B7AA3]' }
};

const FLAVOR: TemplateFlavor = {
  ...KURUMSAL_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Sahne sizin için hazırlanıyor',
  headings: { timeline: 'Akış', details: 'Salon & Ulaşım', gallery: 'Sahne Arkası', gift: 'Katkı', rsvp: 'Yerinizi Ayırtın' }
};

const INTERACTIVE = 'a, button, input, select, textarea, label, [role="button"]';

/**
 * Takip spotu: misafirin dokunduğu yere üstteki başlıktan bir ışık konisi
 * döner (yaylı). Hiç dokunulmazsa sahnenin ortasında yavaşça gezinir.
 * Yalnızca canlıda; ekran harmanıyla videonun üstüne biner.
 */
function FollowSpot({ enabled }: { enabled: boolean }) {
  const x = useSpring(0.5, { stiffness: 40, damping: 14 });
  const y = useSpring(0.62, { stiffness: 40, damping: 14 });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest(INTERACTIVE)) return;
      x.set(e.clientX / window.innerWidth);
      y.set(Math.max(0.25, e.clientY / window.innerHeight));
      setTouched(true);
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, [enabled, x, y]);

  useEffect(() => {
    if (!enabled || touched) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      x.set(0.5 + 0.22 * Math.sin(t * 0.35));
      y.set(0.6 + 0.06 * Math.sin(t * 0.5));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled, touched, x, y]);

  // Koni: tepe ekranın üstünde sabit, taban dokunulan noktada elips.
  const cone = useTransform([x, y], ([cx, cy]: number[]) => {
    const bx = cx * 100;
    const by = cy * 100;
    const w = 7 + cy * 6;
    return `M ${50 + (cx - 0.5) * 30} -2 L ${bx - w} ${by} L ${bx + w} ${by} Z`;
  });
  const left = useTransform(x, (v) => `${v * 100}%`);
  const top = useTransform(y, (v) => `${v * 100}%`);

  if (!enabled) return null;
  return (
    <motion.div aria-hidden="true" className="absolute inset-0 mix-blend-screen pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.6, duration: 1.6 }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lansman-koni" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#BFE3FF" stopOpacity="0.02" />
            <stop offset="1" stopColor="#BFE3FF" stopOpacity="0.16" />
          </linearGradient>
        </defs>
        <motion.path d={cone} fill="url(#lansman-koni)" />
      </svg>
      <motion.div
        className="absolute w-[46vmin] h-[16vmin] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(205,232,255,0.4),rgba(120,170,255,0.12)_60%,transparent)]"
        style={{ left, top }}
      />
    </motion.div>
  );
}

function Backdrop(props: BackdropState & { mode: 'preview' | 'live' }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <CinemaBackdrop
      {...props}
      video={VIDEO}
      playback={{ kind: 'intro', intro: GIRIS }}
      base="radial-gradient(ellipse 70% 50% at 50% 42%, #14224A 0%, #070B18 60%, #02030A 100%)"
      dimRgb="3,5,12"
      dim={0.66}
      zoom={1.14}
    >
      <FollowSpot enabled={props.mode === 'live' && !reduced} />
    </CinemaBackdrop>
  );
}

/** LED duvar yazısı: piksel maskeli degrade + altında bulanık ışıma. */
function LedText({ text, delay, reduced }: { text: string; delay: number; reduced: boolean }) {
  // Noktalar sıkı (her LED hücresinin ~%80'i dolu): piksel dokusu görünür ama yazı okunur kalır.
  const dots = '[mask-image:radial-gradient(circle,#000_64%,transparent_74%)] [mask-size:0.06em_0.06em] [-webkit-mask-image:radial-gradient(circle,#000_64%,transparent_74%)] [-webkit-mask-size:0.06em_0.06em]';
  const fill = 'bg-[linear-gradient(100deg,#FFFFFF_0%,#BFEAFF_35%,#7FB2FF_65%,#C9A8FF_100%)] bg-clip-text text-transparent';
  return (
    <motion.span
      className="relative inline-block"
      initial={reduced ? false : { clipPath: 'inset(0% 50% 0% 50%)', opacity: 0.4 }}
      animate={{ clipPath: 'inset(-20% -5% -20% -5%)', opacity: 1 }}
      transition={{ delay, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <span aria-hidden="true" className={`absolute inset-0 ${fill} blur-[3px] opacity-60 select-none`}>
        {text}
      </span>
      <span aria-hidden="true" className={`absolute inset-0 ${fill} blur-[18px] opacity-80 select-none`}>
        {text}
      </span>
      <span className={`relative ${fill} ${dots}`}>{text}</span>
    </motion.span>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONT);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const still = reduced || mode === 'preview';
  const fade = (delay: number) =>
    still ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } };
  const name = d.hasNames ? d.people.join(' & ') : NO_NAMES;
  const meta = [d.date.day, d.date.time, d.venue].filter(Boolean);

  return (
    <div className="relative grow flex flex-col">
      <div className="relative min-h-[100svh] flex flex-col items-center justify-center px-5 pt-16 pb-[22svh] text-center" dir="auto">
        {/* Okunurluk perdesi: LED duvar ve huzmeler metnin arkasında kısılır. */}
        <div aria-hidden="true" className="absolute -z-10 inset-x-0 top-[18%] h-[52%] bg-[radial-gradient(ellipse_62%_50%_at_50%_50%,rgba(2,4,12,0.78),rgba(2,4,12,0.35)_60%,transparent_100%)] pointer-events-none" />
        <motion.div {...fade(still ? 0 : 1.2)} className="flex items-center gap-2.5 rounded-full border border-[#6FA8FF]/25 bg-[#050914]/60 backdrop-blur px-4 py-1.5">
          <span className="relative flex w-2 h-2">
            {!still && <span className="absolute inset-0 rounded-full bg-[#FF4D6D] animate-ping opacity-60" />}
            <span className="relative w-2 h-2 rounded-full bg-[#FF4D6D]" />
          </span>
          <span className={`${GROTESK} text-[10px] tracking-[0.35em] uppercase text-[#CFE0FF]`}>{d.title || 'Lansman'}</span>
        </motion.div>

        <h1 className={`${GROTESK} mt-7 font-bold tracking-[-0.035em] leading-[0.95] text-[clamp(2.3rem,10.5cqw,6.6rem)] max-w-[min(92vw,1100px)] break-words`}>
          <LedText text={name} delay={still ? 0 : WALL_ON} reduced={still} />
        </h1>

        <motion.p {...fade(still ? 0 : 3.6)} className={`${GROTESK} mt-6 text-base sm:text-lg text-[#C3D0F0] max-w-md`}>
          {d.subtitle || FLAVOR.tagline}
        </motion.p>

        {meta.length > 0 && (
          <motion.div {...fade(still ? 0 : 4.0)} className="mt-7 grid grid-flow-col auto-cols-fr gap-px rounded-2xl overflow-hidden border border-[#6FA8FF]/20 bg-[#6FA8FF]/15 backdrop-blur-md max-w-full">
            {meta.map((t) => (
              <span key={t} className={`${GROTESK} bg-[#050914]/75 px-3.5 sm:px-5 py-2.5 text-[11px] sm:text-xs tracking-[0.08em] text-[#E4ECFF] whitespace-nowrap overflow-hidden text-ellipsis`}>
                {t}
              </span>
            ))}
          </motion.div>
        )}
        {mode === 'live' && !reduced && (
          <motion.p {...fade(5.2)} className={`${GROTESK} mt-6 text-[10px] tracking-[0.32em] uppercase text-[#7E92C4]`}>
            Spotu yönlendirmek için dokunun
          </motion.p>
        )}
        <ScrollCue delay={still ? 0 : 5} className="text-[#9FB8F0]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Sahneye kalan süre"
        classes={{
          root: 'min-h-[80svh]',
          eyebrow: 'text-[#5FD4FF]',
          date: `${GROTESK} font-bold tracking-[-0.04em] text-[clamp(2.4rem,11cqw,5.4rem)] leading-none text-[#F3F7FF]`,
          meta: 'text-[#A6B4D6]',
          cell: 'rounded-2xl bg-[#050914]/60 backdrop-blur border border-[#6FA8FF]/20 px-2 py-3',
          number: `${GROTESK} font-semibold text-[#F3F7FF]`,
          label: 'text-[#7E92C4]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

/**
 * KurumsalLansman — "Lansman Sahnesi": karanlık konferans salonu, truss'tan
 * sahneyi tarayan başlıklar ve dev LED duvar (kodla üretilmiş video).
 * Giriş klibinde başlıklar sırayla yanar, LED duvar merkezden açılır; tam
 * o anda etkinlik adı duvarda piksel piksel belirir. Ardından döngü klibi
 * görünmez bir kesmeyle devralır. Misafirin dokunduğu yere takip spotu döner.
 */
export function KurumsalLansman({ invitation, mode = 'preview' }: TemplateProps) {
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
