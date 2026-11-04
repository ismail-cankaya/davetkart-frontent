import React, { useEffect, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { GyroButton, useStageActive, useTilt } from '../../shared/three';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';

const IRIDESCENT = 'bg-[linear-gradient(110deg,#FFC4E6,#C4E1FF_35%,#D2FFE4_65%,#FFF4C4)]';

const HOLO_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#07070C] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-medium',
  page: 'text-slate-100',
  surface: 'bg-white/[0.06] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]',
  border: 'border-white/15',
  heading: 'text-white',
  body: 'text-slate-300',
  accent: 'text-[#BFD9FF]',
  accentBg: 'bg-[#C4E1FF]',
  accentSoft: 'bg-[#C4E1FF]/10',
  input:
    'w-full bg-white/[0.05] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C4E1FF]/70 focus:ring-2 focus:ring-[#C4E1FF]/20 transition-all duration-300',
  buttonPrimary: `${IRIDESCENT} text-[#141420] hover:brightness-110 shadow-[0_10px_30px_-10px_rgba(196,225,255,0.6)]`,
  buttonGhost: 'border border-white/20 text-white hover:bg-white/5 hover:border-white/35',
  divider: 'bg-white/10',
  timelineLine: 'from-[#FFC4E6] via-[#C4E1FF]/60 to-transparent',
  envelope: {
    paper: 'bg-[#E9ECF5]',
    flap: 'bg-[#DCE1EE]',
    seal: `${IRIDESCENT} text-[#141420]`,
    glow: 'bg-[#C4E1FF]/30',
    card: 'bg-white border border-white'
  },
  mapHeader: 'bg-[#141420]',
  footer: { names: 'text-slate-300', branding: 'text-slate-400' }
};

const HOLO_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Işığın kırıldığı gün',
  headings: { timeline: 'Günün Akışı', details: 'Nerede, Ne Zaman', gallery: 'Yansımalar', gift: 'Takı & Hediye', rsvp: 'Katılımınızı Bildirin' }
};

/** Eğim (işaretçi/jiroskop) + boşta yavaş salınım → yaylanmış -1..1 değerleri. */
function useHoloTilt(live: boolean, reduced: boolean, active: boolean): { x: MotionValue<number>; y: MotionValue<number> } {
  const tilt = useTilt(live && !reduced);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 70, damping: 16, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 70, damping: 16, mass: 0.6 });
  const last = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    // Ekran dışında ya da sekme gizliyken döngü durur.
    if (reduced || !active) return;
    let raf = 0;
    const loop = (now: number) => {
      const t = tilt.current;
      if (t.x !== last.current.x || t.y !== last.current.y) last.current = { x: t.x, y: t.y, t: now };
      // İki saniye hareket yoksa kart kendi kendine yavaşça salınır (önizlemede hep).
      const idle = now - last.current.t > 2000;
      rawX.set(idle ? Math.sin(now / 1900) * 0.55 : t.x);
      rawY.set(idle ? Math.cos(now / 2600) * 0.35 : t.y);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, active, tilt, rawX, rawY]);

  return { x, y };
}

function HoloBackdrop({ heroExit }: BackdropState) {
  const shift = useTransform(heroExit, [0, 1], ['0%', '-18%']);
  return (
    <div className="absolute inset-0 bg-[#07070C]">
      <motion.div style={{ y: shift }} className="absolute inset-[-20%]">
        <div className="absolute left-[10%] top-[8%] w-[60%] aspect-square rounded-full bg-[#7A5CFF]/25 blur-[90px] motion-safe:animate-[pulse_9s_ease-in-out_infinite]" />
        <div className="absolute right-[5%] top-[30%] w-[55%] aspect-square rounded-full bg-[#FF6FB5]/20 blur-[100px] motion-safe:animate-[pulse_11s_ease-in-out_infinite]" />
        <div className="absolute left-[20%] bottom-[10%] w-[60%] aspect-square rounded-full bg-[#3FE0C5]/15 blur-[110px] motion-safe:animate-[pulse_13s_ease-in-out_infinite]" />
      </motion.div>
      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
    </div>
  );
}

function HoloHero({ invitation, mode, scrollContainer }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  // Kaydırınca kart geriye yatar ve küçülür: cam masaya bırakılıyor gibi.
  const { scrollY } = useScroll({ container: scrollContainer });
  const lean = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 28]);
  const shrink = useTransform(scrollY, [0, 600], [1, reduced ? 1 : 0.86]);
  const root = useRef<HTMLDivElement>(null);
  const active = useStageActive(root);
  const { x, y } = useHoloTilt(mode === 'live', reduced, active);

  const rotateY = useTransform(x, (v) => v * 16);
  const rotateX = useTransform(y, (v) => -v * 12);
  const glareX = useTransform(x, (v) => `${50 + v * 45}%`);
  const glareY = useTransform(y, (v) => `${45 + v * 40}%`);
  const foil = useTransform(x, (v) => `${50 + v * 60}% ${50 + v * 30}%`);
  const hue = useTransform(x, (v) => v * 70);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.55), rgba(255,255,255,0.08) 32%, transparent 55%)`;
  const conic = useMotionTemplate`conic-gradient(from ${hue}deg at ${glareX} ${glareY}, #FF9AD5, #9AD0FF, #B9FFCF, #FFF3A6, #D9A6FF, #FF9AD5)`;

  const fade = (delay: number) =>
    reduced
      ? { initial: false as const }
      : { initial: { opacity: 0, y: 10, filter: 'blur(6px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, transition: { duration: 0.8, delay } };

  return (
    <div ref={root} className="grow flex flex-col items-center justify-center px-5 py-14 [perspective:1100px]">
      <motion.div
        initial={reduced ? false : { rotateY: -170, scale: 0.6, opacity: 0 }}
        animate={{ rotateY: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="w-full max-w-[20rem] sm:max-w-[23rem] [transform-style:preserve-3d]"
      >
        <motion.div style={{ rotateX: lean, scale: shrink }} className="[transform-style:preserve-3d]">
        <motion.div
          style={{ rotateX, rotateY }}
          className="relative aspect-[3/4.25] rounded-[28px] overflow-hidden border border-white/25 bg-[#100E22]/80 backdrop-blur-xl shadow-[0_40px_120px_-30px_rgba(122,92,255,0.55)]"
        >
          <motion.div aria-hidden className="absolute inset-0 opacity-[0.38] mix-blend-screen" style={{ background: conic }} />
          <motion.div
            aria-hidden
            className="absolute inset-0 opacity-30 mix-blend-overlay bg-[repeating-linear-gradient(115deg,#FF9AD5_0%,#9AD0FF_6%,#B9FFCF_12%,#FFF3A6_18%,#FF9AD5_24%)] bg-[length:240%_240%]"
            style={{ backgroundPosition: foil }}
          />
          <motion.div aria-hidden className="absolute inset-0 mix-blend-screen" style={{ background: glare }} />
          {!reduced && (
            <motion.div
              aria-hidden
              initial={{ x: '-120%' }}
              animate={{ x: '260%' }}
              transition={{ duration: 1.3, delay: 1.5, ease: 'easeInOut' }}
              className="absolute inset-y-0 w-1/2 bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.7),transparent)] skew-x-[-12deg]"
            />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_50%,rgba(10,8,26,0.55),transparent)]" />
          <div className="absolute inset-3 rounded-[20px] border border-white/20" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-7 text-white [text-shadow:0_1px_12px_rgba(20,20,40,0.45)]">
            {d.title && (
              <motion.p {...fade(1.7)} className="text-[10px] tracking-[0.35em] uppercase text-white/85">
                {d.title}
              </motion.p>
            )}
            <motion.h1 {...fade(1.9)} className="mt-5 font-cormorant font-medium italic leading-[0.98] text-[clamp(2.4rem,11cqw,3.3rem)] break-words">
              {d.hasNames
                ? d.people.map((p, i) => (
                    <span key={p + i} className="block">
                      {i > 0 && <span className="block my-1 text-[0.5em] not-italic text-[#FFE7A6]">&amp;</span>}
                      {p}
                    </span>
                  ))
                : NO_NAMES}
            </motion.h1>
            {d.date.day && (
              <motion.p {...fade(2.2)} className="mt-6 text-sm tracking-[0.2em] uppercase">
                {d.date.day}
                {d.date.time && ` · ${d.date.time}`}
              </motion.p>
            )}
            {d.venue && (
              <motion.p {...fade(2.35)} className="mt-1.5 text-sm text-white/85">
                {d.venue}
              </motion.p>
            )}
          </div>
        </motion.div>
        </motion.div>
      </motion.div>
      <motion.div {...fade(2.6)} className="mt-9">
        <HeroCountdown
          invitation={invitation}
          numberClassName={`font-cormorant text-transparent bg-clip-text ${IRIDESCENT} text-[2rem]`}
          labelClassName="text-slate-400"
        />
      </motion.div>
      {mode === 'live' && <GyroButton className="mt-6 bg-white/10 text-white hover:bg-white/20" />}
      {d.subtitle && (
        <motion.p {...fade(2.8)} className="mt-6 max-w-sm text-center font-cormorant italic text-lg text-slate-300">
          {d.subtitle}
        </motion.p>
      )}
    </div>
  );
}

/**
 * DugunHolografik — "Holografik Cam": yanardöner, ışığı kıran cam kart.
 * Konik ve şerit gradyanlar `color-dodge`/`overlay` ile karışır; eğim
 * (işaretçi ya da jiroskop) parlamanın yerini ve renk açısını taşır. WebGL yok.
 */
export function DugunHolografik({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={HOLO_FLAVOR}
      mode={mode}
      themeOverride={HOLO_TEMASI}
      renderBackdrop={(state) => <HoloBackdrop {...state} />}
      renderHero={(props) => <HoloHero {...props} mode={mode} />}
    />
  );
}
