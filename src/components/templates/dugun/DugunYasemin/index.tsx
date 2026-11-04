import React, { useEffect, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { videoSet } from '../../shared/videoAssets';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { CinemaBackdrop, DateCountdown, ScrollCue, SplitReveal, useTemplateFont } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';

const VIDEO = videoSet('dugun-yasemin');
const FONT = 'Pinyon+Script';
const SCRIPT = "[font-family:'Pinyon_Script',var(--font-cormorant),cursive]";

const THEME: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#041012] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-medium',
  page: 'text-[#E9F0EA]',
  surface: 'bg-[#0A1F22]/70 backdrop-blur-md shadow-[0_0_50px_-24px_rgba(220,240,225,0.35)]',
  border: 'border-[#DCE8DF]/18',
  heading: 'text-[#F7FAF4]',
  body: 'text-[#B3C7BF]',
  accent: 'text-[#E8D9A6]',
  accentBg: 'bg-[#E8D9A6]',
  accentSoft: 'bg-[#E8D9A6]/10',
  input:
    'w-full bg-[#06171A]/75 border border-[#DCE8DF]/22 rounded-lg px-3.5 py-2.5 text-sm text-[#F7FAF4] placeholder:text-[#7F958E] focus:outline-none focus:border-[#E8D9A6] focus:ring-2 focus:ring-[#E8D9A6]/20 transition-all duration-300',
  buttonPrimary: 'bg-[#F4F1E6] hover:bg-white text-[#0A1F22] shadow-lg shadow-black/30',
  buttonGhost: 'border border-[#DCE8DF]/30 text-[#E9F0EA] hover:bg-white/5',
  divider: 'bg-[#DCE8DF]/15',
  timelineLine: 'from-[#E8D9A6]/70 via-[#DCE8DF]/35 to-transparent',
  envelope: {
    paper: 'bg-[#0E2A2C]',
    flap: 'bg-[#123335]',
    seal: 'bg-[#F4F1E6] text-[#0A1F22]',
    glow: 'bg-[#E8D9A6]/25',
    card: 'bg-[#FBFAF4] border border-[#E8D9A6]/40'
  },
  mapHeader: 'bg-[#0E2A2C]',
  footer: { names: 'text-[#B3C7BF]', branding: 'text-[#7F958E]' }
};

const FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Yaseminler açarken, ay ışığında',
  headings: { timeline: 'Gecenin Akışı', details: 'Bahçede Buluşalım', gallery: 'Anılarımız', gift: 'Hediye', rsvp: 'Katılımınızı Bildirin' }
};

/** İşaretçiyi izleyen ay ışığı: kadrajda yumuşak bir aydınlık havuz. */
function AyIsigi({ enabled }: { enabled: boolean }) {
  const x = useMotionValue(50);
  const y = useMotionValue(40);
  const sx = useSpring(x, { stiffness: 40, damping: 18 });
  const sy = useSpring(y, { stiffness: 40, damping: 18 });
  const bg = useMotionTemplate`radial-gradient(circle at ${sx}% ${sy}%, rgba(230,245,235,0.16), transparent 32%)`;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!enabled) return;
    const on = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      x.set(((e.clientX - r.left) / r.width) * 100);
      y.set(((e.clientY - r.top) / r.height) * 100);
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, [enabled, x, y]);
  return <motion.div ref={ref} aria-hidden="true" className="absolute inset-0 pointer-events-none mix-blend-screen" style={{ background: enabled ? bg : undefined }} />;
}

/** Açılışta kadrajdan süzülen birkaç yasemin yaprağı. */
function YaprakYagmuru() {
  const petals = [
    [12, 0.2, 7], [28, 0.7, 9], [46, 0.3, 6], [63, 1.0, 8], [78, 0.5, 7], [90, 1.2, 9], [36, 1.4, 6]
  ];
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map(([left, delay, size], i) => (
        <motion.span
          key={i}
          className="absolute top-0 rounded-[60%_40%_60%_40%] bg-[#F7F4EA] shadow-[0_0_10px_rgba(255,255,240,0.6)]"
          style={{ left: `${left}%`, width: size, height: size * 0.6 }}
          initial={{ y: '-5vh', opacity: 0, rotate: 0 }}
          animate={{ y: '105vh', opacity: [0, 1, 1, 0], rotate: 360 + i * 40, x: [0, 24, -18, 10] }}
          transition={{ delay, duration: 5.5 + (i % 3), ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONT);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const live = mode === 'live' && !reduced;
  const fade = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 12, filter: 'blur(6px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, transition: { delay, duration: 1.4, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className="relative grow flex flex-col">
      <div className="relative min-h-[100svh] @container flex flex-col items-center justify-center px-6 pt-16 pb-24 text-center" dir="auto">
        <AyIsigi enabled={live} />
        {live && <YaprakYagmuru />}
        <motion.p {...fade(0.7)} className="font-cormorant text-[11px] sm:text-xs tracking-[0.55em] uppercase text-[#E8D9A6] [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
          {d.title || 'Düğünümüze davetlisiniz'}
        </motion.p>
        <motion.span
          aria-hidden="true"
          className="mt-6 block h-px w-24 bg-[linear-gradient(90deg,transparent,#E8D9A6,transparent)]"
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.1, duration: 1.4 }}
        />
        <h1 className={`mt-4 ${SCRIPT} font-normal leading-[1.15] text-[clamp(3.2rem,15cqw,7.4rem)] text-[#FBFAF2] max-w-full break-words [text-shadow:0_0_28px_rgba(230,245,235,0.45),0_2px_14px_rgba(0,0,0,0.6)]`}>
          {(d.hasNames ? d.people : [NO_NAMES]).map((p, i) => (
            <span key={p + i} className="block">
              {i > 0 && (
                <motion.span {...fade(2.2)} className="block -my-2 font-cormorant italic text-[0.38em] text-[#E8D9A6]">
                  &amp;
                </motion.span>
              )}
              <SplitReveal text={p} style="blur" delay={1.5 + i * 0.7} stagger={0.06} duration={1.6} />
            </span>
          ))}
        </h1>
        <motion.p {...fade(2.8)} className="mt-6 font-cormorant italic text-xl sm:text-2xl text-[#D7E3DC]">
          {d.subtitle || FLAVOR.tagline}
        </motion.p>
        {(d.date.day || d.venue) && (
          <motion.p {...fade(3.1)} className="mt-5 font-cormorant text-sm tracking-[0.3em] uppercase text-[#B3C7BF]">
            {[d.date.day, d.venue].filter(Boolean).join('  ·  ')}
          </motion.p>
        )}
        <ScrollCue delay={3.6} className="text-[#E8D9A6]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Büyük güne"
        classes={{
          root: 'min-h-[80svh]',
          eyebrow: 'font-cormorant text-[#E8D9A6]',
          date: `${SCRIPT} text-[clamp(3.2rem,14cqw,6.4rem)] leading-none text-[#FBFAF2] [text-shadow:0_0_24px_rgba(230,245,235,0.35)]`,
          meta: 'font-cormorant text-[#B3C7BF]',
          number: 'font-cormorant text-[#F7FAF4]',
          label: 'text-[#8FA79F]',
          divider: 'bg-[#DCE8DF]/25'
        }}
      />
    </div>
  );
}

/**
 * DugunYasemin — "Gece Yasemini": ay ışığında bir bahçe duvarı; kenarlardan
 * sarkan sarmaşıklarda yaseminler nefes alır gibi açılıp kapanır, taç
 * yaprakları süzülür, ateş böcekleri dolaşır (kodla üretilmiş video). Adlar
 * el yazısıyla buğudan belirir; işaretçi kadrajda bir ay ışığı havuzu gezdirir.
 */
export function DugunYasemin({ invitation, mode = 'preview' }: TemplateProps) {
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
          base="radial-gradient(ellipse 90% 80% at 65% 25%, #1D3B40 0%, #0C2226 40%, #030A0C 100%)"
          dimRgb="3,12,14"
          dim={0.6}
          zoom={1.1}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_50%_38%_at_50%_50%,rgba(2,10,12,0.5),transparent_75%)]" />
        </CinemaBackdrop>
      )}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
