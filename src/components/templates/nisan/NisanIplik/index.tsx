import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { videoSet } from '../../shared/videoAssets';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { CinemaBackdrop, DateCountdown, ScrollCue, SplitReveal, useTemplateFont } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { NISAN_FLAVOR } from '../flavors';

const VIDEO = videoSet('nisan-iplik', { landscape: '50% 35%', portrait: '50% 30%' });
const FONT = 'Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600';
const DISPLAY = "[font-family:'Fraunces',var(--font-cormorant),serif]";
const NAME_GRADIENT = 'bg-[linear-gradient(100deg,#FFE2C2_0%,#F6C27A_40%,#FF9DB8_100%)] bg-clip-text text-transparent';

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#12060F] [&_.font-serif]:[font-family:'Fraunces',var(--font-cormorant),serif] [&_.font-serif]:italic [&_.font-serif]:font-light",
  page: 'text-[#F5E4EA]',
  surface: 'bg-[#22091C]/70 backdrop-blur-md shadow-[0_0_50px_-22px_rgba(255,120,160,0.45)]',
  border: 'border-[#F6C27A]/20',
  heading: 'text-[#FFEDE3]',
  body: 'text-[#CFB3BF]',
  accent: 'text-[#F6C27A]',
  accentBg: 'bg-[#E86C91]',
  accentSoft: 'bg-[#E86C91]/12',
  input:
    'w-full bg-[#160612]/75 border border-[#F6C27A]/25 rounded-lg px-3.5 py-2.5 text-sm text-[#FFEDE3] placeholder:text-[#9A7D89] focus:outline-none focus:border-[#F6C27A] focus:ring-2 focus:ring-[#F6C27A]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(100deg,#F6C27A,#E86C91)] hover:brightness-110 text-[#2A0B1E] shadow-lg shadow-[#E86C91]/30',
  buttonGhost: 'border border-[#F6C27A]/35 text-[#F5E4EA] hover:bg-[#F6C27A]/10',
  divider: 'bg-[#F6C27A]/18',
  timelineLine: 'from-[#F6C27A]/80 via-[#E86C91]/45 to-transparent',
  envelope: {
    paper: 'bg-[#3A1230]',
    flap: 'bg-[#4A183D]',
    seal: 'bg-[#F6C27A] text-[#2A0B1E]',
    glow: 'bg-[#E86C91]/30',
    card: 'bg-[#FFF5EE] border border-[#F6C27A]/40'
  },
  mapHeader: 'bg-[#2A0B22]',
  footer: { names: 'text-[#CFB3BF]', branding: 'text-[#9A7D89]' }
};

const FLAVOR: TemplateFlavor = {
  ...NISAN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'İki iplik, tek düğüm',
  headings: { timeline: 'Akşamın Akışı', details: 'Buluşma Yeri', gallery: 'Bizden Kareler', gift: 'Hediye', rsvp: 'Sözümüze Tanık Olun' }
};

/** Adların arasında "&" yerine kendini çizen küçük bir düğüm. */
function Dugum({ reduced, delay }: { reduced: boolean; delay: number }) {
  const draw = (d: number) =>
    reduced ? {} : { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { delay: d, duration: 1.4, ease: 'easeInOut' as const } };
  return (
    <svg viewBox="0 0 120 40" className="block mx-auto my-2 w-24 h-8" fill="none" aria-hidden="true">
      <motion.path d="M0 22 C 30 22, 40 4, 58 12 C 74 20, 58 36, 48 26 C 40 16, 70 8, 120 20" stroke="#F6C27A" strokeWidth="1.4" strokeLinecap="round" {...draw(delay)} />
      <motion.path d="M0 18 C 34 18, 44 34, 62 28 C 78 22, 66 6, 56 14 C 48 22, 80 30, 120 22" stroke="#FF8FB0" strokeWidth="1.4" strokeLinecap="round" {...draw(delay + 0.2)} />
    </svg>
  );
}

/** İşaretçiyi izleyen ince altın iplik: son ~0.6 sn'nin yolu, sönerek. */
function IplikIzi({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!enabled || !canvas) return;
    const g = canvas.getContext('2d');
    if (!g) return;
    const pts: { x: number; y: number; t: number }[] = [];
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const draw = () => {
      raf = 0;
      const now = performance.now();
      while (pts.length && now - pts[0].t > 650) pts.shift();
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, canvas.width, canvas.height);
      if (pts.length > 1) {
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.lineCap = 'round';
        for (let i = 1; i < pts.length; i++) {
          const k = 1 - (now - pts[i].t) / 650;
          g.strokeStyle = `rgba(246,194,122,${0.7 * k})`;
          g.lineWidth = 1.6 * k + 0.3;
          g.beginPath();
          g.moveTo(pts[i - 1].x, pts[i - 1].y);
          g.lineTo(pts[i].x, pts[i].y);
          g.stroke();
        }
        raf = requestAnimationFrame(draw);
      }
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      pts.push({ x, y, t: performance.now() });
      if (!raf) raf = requestAnimationFrame(draw);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);
  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONT);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const fade = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 1.2, ease: [0.22, 1, 0.36, 1] as const } };
  const people = d.hasNames ? d.people : [NO_NAMES];

  return (
    <div className="relative grow flex flex-col">
      {/* İplikler videoda üst üçte birde düğümlenir; metin onun altında. */}
      <div className="relative min-h-[100svh] @container flex flex-col items-center justify-center px-6 pt-[30svh] @3xl:pt-[40svh] pb-24 text-center" dir="auto">
        <IplikIzi enabled={mode === 'live' && !reduced} />
        <motion.p {...fade(0.6)} className="text-[10px] sm:text-[11px] tracking-[0.5em] uppercase text-[#F6C27A]">
          {d.title || 'Nişan Davetiyesi'}
        </motion.p>
        <h1 className={`mt-6 ${DISPLAY} italic font-light leading-[1.02] text-[clamp(2.6rem,12cqw,6rem)] max-w-full break-words [filter:drop-shadow(0_0_22px_rgba(255,140,170,0.25))]`}>
          {people.map((p, i) => (
            <span key={p + i} className="block">
              {i > 0 && <Dugum reduced={reduced} delay={1.7} />}
              <SplitReveal text={p} style="rise" delay={1.0 + i * 0.7} stagger={0.05} duration={1.1} charClassName={NAME_GRADIENT} />
            </span>
          ))}
        </h1>
        <motion.p {...fade(2.5)} className={`mt-6 ${DISPLAY} italic text-lg sm:text-xl text-[#EBCFD8]`}>
          {d.subtitle || FLAVOR.tagline}
        </motion.p>
        {(d.date.day || d.venue) && (
          <motion.p {...fade(2.8)} className="mt-5 text-[11px] tracking-[0.3em] uppercase text-[#CFB3BF]">
            {[d.date.day, d.venue].filter(Boolean).join('  ·  ')}
          </motion.p>
        )}
        <ScrollCue delay={3.4} className="text-[#F6C27A]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Söz gününe"
        classes={{
          root: 'min-h-[80svh]',
          eyebrow: 'text-[#F6C27A]',
          date: `${DISPLAY} italic font-light text-[clamp(2.8rem,12cqw,5.6rem)] leading-none ${NAME_GRADIENT}`,
          meta: 'text-[#CFB3BF]',
          number: `${DISPLAY} font-light text-[#FFEDE3]`,
          label: 'text-[#A88E99]',
          divider: 'bg-[linear-gradient(180deg,transparent,#F6C27A,transparent)]'
        }}
      />
    </div>
  );
}

/**
 * NisanIplik — "Kader İpliği": mor kadife karanlıkta altın ve gül rengi iki
 * iplik iki uçtan gelip üst üçte birde düğüm atar; ipliklerin üstünde ışık
 * akar (kodla üretilmiş video). Adlar harf harf yükselir, aralarında "&"
 * yerine kendini çizen iki iplikli bir düğüm; işaretçi ince bir altın iplik
 * bırakır.
 */
export function NisanIplik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={FLAVOR}
      mode={mode}
      themeOverride={THEME}
      renderBackdrop={(state) => (
        <CinemaBackdrop
          {...state}
          video={VIDEO}
          mode={mode}
          base="radial-gradient(ellipse 80% 70% at 50% 45%, #3A1230 0%, #1C0818 50%, #08030A 100%)"
          dimRgb="14,5,12"
          dim={0.55}
          zoom={1.07}
        />
      )}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
