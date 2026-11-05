import React, { useEffect, useRef } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { videoSet } from '../../shared/videoAssets';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { CinemaBackdrop, DateCountdown, ScrollCue, useTemplateFont } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';

const VIDEO = videoSet('dugun-kristal-balo', { landscape: '50% 40%', portrait: '50% 35%' });
const FONT = 'Bodoni+Moda:ital,opsz,wght@0,6..96,400..800;1,6..96,400..800';
const DIDONE = "[font-family:'Bodoni_Moda',var(--font-serif),serif]";
const PRISM =
  'bg-[linear-gradient(105deg,#FFFFFF_0%,#E8EEFF_35%,#FFE7F3_45%,#E3FFF6_52%,#FFF6DA_58%,#FFFFFF_70%)] bg-[length:220%_100%] bg-clip-text text-transparent';

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#070814] [&_.font-serif]:[font-family:'Bodoni_Moda',var(--font-serif),serif] [&_.font-serif]:font-medium",
  page: 'text-[#E9ECF6]',
  surface: 'bg-[#10132A]/70 backdrop-blur-md shadow-[0_0_60px_-28px_rgba(200,215,255,0.45)]',
  border: 'border-[#DDE3F5]/18',
  heading: 'text-[#FFFFFF]',
  body: 'text-[#AEB4CC]',
  accent: 'text-[#E6C887]',
  accentBg: 'bg-[#E6C887]',
  accentSoft: 'bg-[#E6C887]/10',
  input:
    'w-full bg-[#0A0C1E]/75 border border-[#DDE3F5]/22 rounded-none px-3.5 py-2.5 text-sm text-white placeholder:text-[#7C82A0] focus:outline-none focus:border-[#E6C887] focus:ring-2 focus:ring-[#E6C887]/20 transition-all duration-300',
  buttonPrimary: 'bg-[#F5F2EA] hover:bg-white text-[#0A0C1E] tracking-[0.2em] uppercase text-xs shadow-lg shadow-black/40',
  buttonGhost: 'border border-[#DDE3F5]/30 text-[#E9ECF6] hover:bg-white/5',
  divider: 'bg-[#DDE3F5]/15',
  timelineLine: 'from-[#E6C887]/80 via-[#DDE3F5]/35 to-transparent',
  envelope: {
    paper: 'bg-[#14183A]',
    flap: 'bg-[#1A1F48]',
    seal: 'bg-[#E6C887] text-[#0A0C1E]',
    glow: 'bg-[#C8D4FF]/30',
    card: 'bg-[#FBFAF6] border border-[#E6C887]/40'
  },
  mapHeader: 'bg-[#10132A]',
  footer: { names: 'text-[#AEB4CC]', branding: 'text-[#7C82A0]' }
};

const FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Kristallerin altında ilk dansımıza',
  headings: { timeline: 'Balonun Akışı', details: 'Balo Salonu', gallery: 'Işıltılı Anlar', gift: 'Hediye', rsvp: 'Davetiyeye Yanıt' }
};

/**
 * Kaydırma ↔ video zamanı. Açılışta video 3 sn'de kendiliğinden %18'e ilerler
 * (ilk "vay" anı); sonrasında belge ilerlemesi devralır ve kamera avizenin
 * etrafında dönerek yükselir. İkisinin büyüğü alınır: geri kaydırınca giriş
 * hareketi geri sarılmaz.
 */
function Backdrop({ mode, ...state }: BackdropState & { mode: 'preview' | 'live' }) {
  const reduced = useReducedMotion() ?? false;
  const intro = useMotionValue(0);
  useEffect(() => {
    if (mode !== 'live' || reduced) return;
    const c = animate(intro, 0.18, { duration: 3.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 });
    return () => c.stop();
  }, [mode, reduced, intro]);
  const scrub = useTransform(() => Math.max(intro.get(), state.progress.get()));
  return (
    <CinemaBackdrop
      {...state}
      video={VIDEO}
      mode={mode}
      playback={{ kind: 'scrub', progress: scrub }}
      base="radial-gradient(ellipse 70% 60% at 50% 38%, #2A2340 0%, #0B0C1C 55%, #050610 100%)"
      dimRgb="6,7,16"
      dim={0.5}
      zoom={1.04}
    >
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(0deg,rgba(5,6,16,0.94),rgba(5,6,16,0.62)_45%,transparent)]" />
    </CinemaBackdrop>
  );
}

/** Açılışta kadrajı boydan boya geçen anamorfik ışık çizgisi. */
function IsikCizgisi() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute left-0 right-0 top-[44%] h-px pointer-events-none bg-[linear-gradient(90deg,transparent,rgba(190,210,255,0.9)_45%,#FFFFFF_50%,rgba(190,210,255,0.9)_55%,transparent)] shadow-[0_0_18px_4px_rgba(170,195,255,0.55)]"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: [0, 1.2, 1.4], opacity: [0, 1, 0] }}
      transition={{ delay: 0.6, duration: 2.2, ease: 'easeOut' }}
    />
    </div>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONT);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const live = mode === 'live' && !reduced;
  const fade = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 1.2, ease: [0.22, 1, 0.36, 1] as const } };

  // İşaretçiye bağlı hafif 3B eğim.
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 60, damping: 16 });
  const ry = useSpring(0, { stiffness: 60, damping: 16 });
  useEffect(() => {
    if (!live) return;
    const on = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      ry.set(((e.clientX / window.innerWidth) * 2 - 1) * 8);
      rx.set(-((e.clientY / window.innerHeight) * 2 - 1) * 6);
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, [live, rx, ry]);

  return (
    <div className="relative grow flex flex-col">
      {live && <IsikCizgisi />}
      {/* Avize kadrajın üst-ortasında: metin alt üçte birde. */}
      <div className="relative min-h-[100svh] @container flex flex-col items-center justify-end px-6 pt-[45svh] pb-24 text-center [perspective:900px]" dir="auto">
        <motion.div ref={ref} style={{ rotateX: rx, rotateY: ry }} className="[transform-style:preserve-3d]">
          <motion.p {...fade(1.2)} className={`${DIDONE} text-[10px] sm:text-[11px] tracking-[0.6em] uppercase text-[#E6C887]`}>
            {d.title || 'Balomuza Davetlisiniz'}
          </motion.p>
          <h1 className={`mt-5 ${DIDONE} font-medium leading-[0.98] tracking-[-0.01em] text-[clamp(2.6rem,12cqw,6.2rem)] max-w-full break-words [filter:drop-shadow(0_0_24px_rgba(200,215,255,0.35))_drop-shadow(0_3px_14px_rgba(0,0,0,0.8))]`}>
            {(d.hasNames ? d.people : [NO_NAMES]).map((p, i) => (
              <span key={p + i} className="block">
                {i > 0 && (
                  <motion.span {...fade(2.1)} className="block my-1 italic font-normal text-[0.42em] text-[#E6C887]">
                    &amp;
                  </motion.span>
                )}
                {/* Satır maskeyle açılır; prizma ışıltısı harflerin üstünde gezer. */}
                <motion.span
                  className="inline-block"
                  initial={reduced ? false : { clipPath: 'inset(0% 100% 0% 0%)', filter: 'blur(4px)' }}
                  animate={{ clipPath: 'inset(-45% -8% -35% -8%)', filter: 'blur(0px)' }}
                  transition={{ delay: 1.5 + i * 0.5, duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
                >
                  <motion.span
                    className={`inline-block ${PRISM} pt-[0.22em] -mt-[0.22em] pb-[0.08em] -mb-[0.08em]`}
                    animate={reduced ? undefined : { backgroundPosition: ['100% 0%', '0% 0%'] }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 3 }}
                  >
                    {p}
                  </motion.span>
                </motion.span>
              </span>
            ))}
          </h1>
        </motion.div>
        <motion.p {...fade(2.7)} className={`mt-6 ${DIDONE} italic text-lg sm:text-xl text-[#D5DAEA]`}>
          {d.subtitle || FLAVOR.tagline}
        </motion.p>
        {(d.date.day || d.venue) && (
          <motion.p {...fade(3)} className="mt-4 text-[11px] tracking-[0.35em] uppercase text-[#AEB4CC]">
            {[d.date.day, d.venue].filter(Boolean).join('  ·  ')}
          </motion.p>
        )}
        <ScrollCue delay={3.4} className="text-[#E6C887]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Balo gecesine"
        classes={{
          root: 'min-h-[80svh]',
          eyebrow: `${DIDONE} text-[#E6C887]`,
          date: `${DIDONE} italic font-medium text-[clamp(2.8rem,12cqw,5.8rem)] leading-none text-white`,
          meta: 'text-[#AEB4CC]',
          number: `${DIDONE} font-medium text-white`,
          label: 'text-[#7C82A0]',
          divider: 'bg-[#E6C887]/40'
        }}
      />
    </div>
  );
}

/**
 * DugunKristalBalo — "Kristal Balo": karanlık balo salonunda dönen kristal
 * avize, prizmatik ışık lekeleri ve bokeh (kodla üretilmiş, kısa GOP'lu
 * video). Video kaydırmaya bağlıdır: misafir aşağı indikçe kamera avizenin
 * etrafında dönerek yükselir. Adlar prizma ışıltılı didone harflerle gelir.
 */
export function DugunKristalBalo({ invitation, mode = 'preview' }: TemplateProps) {
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
