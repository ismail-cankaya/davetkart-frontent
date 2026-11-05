import React, { useEffect, useMemo, useRef } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';
import { createDustField, createHourglass, useCanvasLoop } from './kumMotoru';

type Mode = 'preview' | 'live';

const GLOW = '[text-shadow:0_0_22px_rgba(242,190,100,0.4),0_1px_2px_rgba(0,0,0,0.6)]';
/** Açılışta dökülen kum: isimler bu orana gelince tamamen görünür. */
const INTRO_POUR = 0.3;

const KUM_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#120C08] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-medium',
  page: 'text-[#F4E4C6]',
  surface: 'bg-[#1E150E]/85 backdrop-blur-md shadow-[0_0_40px_-20px_rgba(226,174,85,0.45)]',
  border: 'border-[#E2AE55]/20',
  heading: 'text-[#FBEBC8]',
  body: 'text-[#D2C2A2]',
  accent: 'text-[#EBC172]',
  accentBg: 'bg-[#E2AE55]',
  accentSoft: 'bg-[#E2AE55]/10',
  input:
    'w-full bg-[#120C08]/70 border border-[#E2AE55]/25 rounded-lg px-3.5 py-2.5 text-sm text-[#FBEBC8] placeholder:text-[#9E8E70] focus:outline-none focus:border-[#E2AE55] focus:ring-2 focus:ring-[#E2AE55]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#F6D58A,#D49A42)] hover:brightness-110 text-[#1C1208] shadow-lg shadow-[#E2AE55]/25',
  buttonGhost: 'border border-[#E2AE55]/35 text-[#F4E4C6] hover:bg-[#E2AE55]/10',
  divider: 'bg-[#E2AE55]/15',
  timelineLine: 'from-[#E2AE55]/80 via-[#E2AE55]/35 to-transparent',
  envelope: {
    paper: 'bg-[#22170F]',
    flap: 'bg-[#2C1E13]',
    seal: 'bg-[#E2AE55] text-[#1C1208]',
    glow: 'bg-[#E2AE55]/25',
    card: 'bg-[#FBEBC8] border border-[#E2AE55]/40'
  },
  mapHeader: 'bg-[#22170F]',
  footer: { names: 'text-[#D2C2A2]', branding: 'text-[#9E8E70]' }
};

const KUM_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Zaman bizim için akıyor',
  headings: { timeline: 'Günün Akışı', details: 'Buluşma Yeri', gallery: 'Kum Taneleri Kadar Anı', gift: 'Takı & Hediye', rsvp: 'Katılımınızı Bildirin' }
};

/** Animasyon ancak misafir sayfasında ve hareket azaltılmamışsa çalışır. */
function useAnimated(mode: Mode) {
  const reduced = useReducedMotion() ?? false;
  return mode === 'live' && !reduced;
}

function KumBackdrop({ heroExit, mode }: BackdropState & { mode: Mode }) {
  const animated = useAnimated(mode);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const field = useMemo(() => createDustField(), []);
  useCanvasLoop(canvasRef, (ctx, size, t, dt) => field(ctx, size, t, dt, 1 + heroExit.get() * 2.5), animated);
  const dune = useTransform(heroExit, [0, 1], ['0%', '55%']);

  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,#2A1C10_0%,#150E09_55%,#0A0705_100%)]">
      {animated ? (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      ) : (
        <div className="absolute inset-0 opacity-35 bg-[radial-gradient(#E2AE55_0.8px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      )}
      {/* Kum tepeleri: kaydırınca aşağı çekilir */}
      <motion.svg style={{ y: dune }} viewBox="0 0 400 80" preserveAspectRatio="none" className="absolute bottom-0 inset-x-0 w-full h-[14%]" aria-hidden="true">
        <path d="M0 46 C 70 26, 120 40, 190 32 C 260 24, 310 44, 400 30 V 80 H 0 Z" fill="#2A1C10" opacity="0.8" />
        <path d="M0 60 C 80 48, 150 62, 230 54 C 300 46, 350 58, 400 52 V 80 H 0 Z" fill="#1A120B" />
      </motion.svg>
    </div>
  );
}

function Hourglass({ pour, animated }: { pour: MotionValue<number>; animated: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const draw = useMemo(() => createHourglass(animated), [animated]);
  useCanvasLoop(canvasRef, (ctx, size, t, dt) => draw(ctx, size, pour.get(), t, dt), animated, pour);
  return (
    <div className="relative w-[124px] h-[188px] sm:w-[150px] sm:h-[228px]" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

function KumHero({ invitation, scrollContainer, mode }: HeroRenderProps & { mode: Mode }) {
  const d = useHeroData(invitation);
  const animated = useAnimated(mode);

  // Kum miktarı = açılıştaki döküm + kaydırma. Statik kipte döküm baştan tamam.
  const intro = useMotionValue(animated ? 0 : INTRO_POUR);
  useEffect(() => {
    if (!animated) {
      intro.set(INTRO_POUR);
      return;
    }
    const controls = animate(intro, INTRO_POUR, { duration: 2.8, delay: 0.4, ease: [0.45, 0, 0.25, 1] });
    return () => controls.stop();
  }, [animated, intro]);

  const { scrollY } = useScroll({ container: scrollContainer });
  const exit = useTransform(scrollY, (y) => Math.min(1, Math.max(0, y / (scrollContainer?.current?.clientHeight || 1))));
  const pour = useTransform([intro, exit], ([a, b]: number[]) => Math.min(1, a + b * (1 - INTRO_POUR)));

  // İsimler kum gibi yukarıdan aşağı belirir; tarih dökümün sonunda.
  const namesClip = useTransform(pour, (p) => {
    const r = Math.min(1, p / INTRO_POUR);
    return `inset(-20% -12% ${-20 + (1 - r) * 140}% -12%)`;
  });
  const lateOpacity = useTransform(pour, [INTRO_POUR * 0.7, INTRO_POUR], [0, 1]);
  const late = animated ? { opacity: lateOpacity } : undefined;

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-6 pt-14 pb-24 text-center">
      <p className="text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#EBC172]">{d.title || KUM_FLAVOR.tagline}</p>

      <motion.h1
        style={animated ? { clipPath: namesClip } : undefined}
        className={`mt-5 font-cormorant italic font-medium leading-[0.98] text-[#FBEBC8] text-[clamp(2.5rem,12cqw,5.2rem)] break-words max-w-full ${GLOW}`}
      >
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && <span className="block my-1 text-[0.42em] not-italic text-[#EBC172]">&amp;</span>}
              <span className="block">{p}</span>
            </React.Fragment>
          ))
        ) : (
          <span className="block">{NO_NAMES}</span>
        )}
      </motion.h1>

      <div className="mt-6">
        <Hourglass pour={pour} animated={animated} />
      </div>

      <motion.div style={late} className="flex flex-col items-center">
        {d.date.day && (
          <p className={`mt-5 font-cormorant text-2xl text-[#FBEBC8] ${GLOW}`}>
            {d.date.weekday && <span className="block text-[11px] tracking-[0.35em] uppercase text-[#D2C2A2] mb-1">{d.date.weekday}</span>}
            {d.date.day}
            {d.date.time && ` · ${d.date.time}`}
          </p>
        )}
        {d.venue && <p className="mt-2 text-sm text-[#D2C2A2]">{d.venue}</p>}
        <HeroCountdown
          invitation={invitation}
          className="mt-6"
          numberClassName={`font-cormorant text-[#FFE3B0] ${GLOW}`}
          labelClassName="text-[#B5A483]"
        />
        {d.subtitle && <p className="mt-6 max-w-md font-cormorant italic text-lg text-[#E8DCC4]">{d.subtitle}</p>}
      </motion.div>
    </div>
  );
}

/**
 * DugunKumSaati — "Kum Saati": canvas 2D üzerinde altın kumlu bir kum saati.
 * Açılışta kum dökülür ve isimler yukarıdan aşağı belirir; kaydırdıkça kalan
 * kum alt hazneye akar. Arkada süzülen altın tanecikler (canvas, tek döngü).
 * Önizleme ve azaltılmış hareket kipinde rAF kurulmaz, tek kare çizilir.
 */
export function DugunKumSaati({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KUM_FLAVOR}
      mode={mode}
      themeOverride={KUM_TEMASI}
      renderBackdrop={(state) => <KumBackdrop {...state} mode={mode} />}
      renderHero={(props) => <KumHero {...props} mode={mode} />}
    />
  );
}
