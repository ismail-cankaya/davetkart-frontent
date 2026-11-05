import React, { useCallback, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { videoSet } from '../../shared/videoAssets';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { CinemaBackdrop, DateCountdown, LiveShader, ScrollCue, useTemplateFont, type UniformValue } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { PARTI_FLAVOR } from '../flavors';
import { HAVUZ_FRAG, ORB_COLORS, orbPositions } from './havuzShader';

const VIDEO = videoSet('parti-havuz');
const FONT = 'Unbounded:wght@300..800';
const DISPLAY = "[font-family:'Unbounded',var(--font-sans),sans-serif]";
const ORB_COLOR_FLAT = ORB_COLORS.flat();

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#03121A] [&_.font-serif]:[font-family:'Unbounded',var(--font-sans),sans-serif] [&_.font-serif]:font-semibold [&_.font-serif]:tracking-tight",
  page: 'text-[#DDF6F8]',
  surface: 'bg-[#062230]/70 backdrop-blur-xl shadow-[0_0_70px_-28px_rgba(255,46,158,0.55)]',
  border: 'border-[#5CE1F0]/20',
  heading: 'text-[#F2FEFF]',
  body: 'text-[#A9CCD3]',
  accent: 'text-[#FF5DB1]',
  accentBg: 'bg-[#FF2E9E]',
  accentSoft: 'bg-[#FF2E9E]/12',
  input:
    'w-full bg-[#031A24]/80 border border-[#5CE1F0]/25 rounded-xl px-3.5 py-2.5 text-sm text-[#F2FEFF] placeholder:text-[#6F98A2] focus:outline-none focus:border-[#FF5DB1] focus:ring-2 focus:ring-[#FF5DB1]/25 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(90deg,#FF2E9E,#8A5CFF_55%,#3FD8F0)] hover:brightness-110 text-white shadow-lg shadow-[#FF2E9E]/30',
  buttonGhost: 'border border-[#5CE1F0]/35 text-[#DDF6F8] hover:bg-[#5CE1F0]/10',
  divider: 'bg-[#5CE1F0]/18',
  timelineLine: 'from-[#FF5DB1]/80 via-[#5CE1F0]/45 to-transparent',
  envelope: {
    paper: 'bg-[#06303F]',
    flap: 'bg-[#0A3E52]',
    seal: 'bg-[#FF2E9E] text-white',
    glow: 'bg-[#3FD8F0]/30',
    card: 'bg-[#F2FEFF] border border-[#5CE1F0]/45'
  },
  mapHeader: 'bg-[#062230]',
  footer: { names: 'text-[#A9CCD3]', branding: 'text-[#6F98A2]' }
};

const FLAVOR: TemplateFlavor = {
  ...PARTI_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Işıklar suyun altında yanıyor',
  headings: { timeline: 'Gecenin Programı', details: 'Havuz Başı', gallery: 'Kareler', gift: 'Hediye', rsvp: 'Listeye Adını Yaz' }
};

/** Kulüp ışığı: iki geniş huzme kadrajı yavaşça süpürür (yalnızca CSS dönüşü). */
function LightSweeps({ reduced }: { reduced: boolean }) {
  const beam = 'absolute left-1/2 top-[-30%] w-[160vmax] h-[160vmax] -translate-x-1/2 origin-top mix-blend-screen';
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className={`${beam} bg-[conic-gradient(from_180deg_at_50%_0%,transparent_0deg,rgba(255,46,158,0.18)_8deg,transparent_18deg)]`}
        animate={reduced ? undefined : { rotate: [-28, 28, -28] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`${beam} bg-[conic-gradient(from_180deg_at_50%_0%,transparent_0deg,rgba(63,216,240,0.16)_7deg,transparent_15deg)]`}
        animate={reduced ? undefined : { rotate: [24, -32, 24] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/** Açılış: merkezden yayılan üç su halkası (dalış anı). */
function DiveRings() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none">
      {[0, 0.35, 0.7].map((d) => (
        <motion.span
          key={d}
          className="absolute w-24 h-24 rounded-full border border-[#BFF6FF]/70"
          initial={{ scale: 0.2, opacity: 0.9 }}
          animate={{ scale: 9, opacity: 0 }}
          transition={{ delay: 0.25 + d, duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
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
    reduced ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } };
  const names = d.hasNames ? d.people : [NO_NAMES];
  const sweep =
    'bg-[linear-gradient(100deg,#F2FEFF_0%,#F2FEFF_38%,#FF8FCB_46%,#9DF3FF_54%,#F2FEFF_62%,#F2FEFF_100%)] bg-[length:250%_100%] bg-clip-text text-transparent';

  return (
    <div className="relative grow flex flex-col">
      <motion.div
        className="relative min-h-[100svh] @container flex flex-col items-center justify-center px-5 pt-14 pb-24 text-center"
        dir="auto"
        initial={live ? { scale: 1.18, filter: 'blur(10px)' } : false}
        animate={{ scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {live && <DiveRings />}
        <motion.span {...fade(0.9)} className="inline-flex items-center gap-2 rounded-full border border-[#5CE1F0]/30 bg-[#031A24]/55 backdrop-blur px-4 py-1.5 text-[10px] tracking-[0.35em] uppercase text-[#BFF6FF]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E9E] shadow-[0_0_10px_#FF2E9E]" />
          {d.title || 'Gece Havuzu'}
        </motion.span>
        <h1 className={`mt-7 ${DISPLAY} font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(2.4rem,11.5cqw,6.4rem)] max-w-full break-words [text-shadow:0_6px_40px_rgba(0,0,0,0.45)]`}>
          {names.map((p, i) => (
            <span key={p + i} className="block">
              {i > 0 && (
                <motion.span {...fade(1.7)} className="block my-2 text-[0.32em] font-light tracking-[0.4em] text-[#FF5DB1]">
                  +
                </motion.span>
              )}
              {/* Maske yukarı açılır; ardından ışık süpürmesi harflerin üstünden geçer. */}
              <motion.span
                className="inline-block"
                initial={reduced ? false : { clipPath: 'inset(100% 0% 0% 0%)', y: '0.35em' }}
                animate={{ clipPath: 'inset(-45% -8% -35% -8%)', y: 0 }}
                transition={{ delay: 1.1 + i * 0.4, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.span
                  className={`inline-block ${sweep} pt-[0.22em] -mt-[0.22em] pb-[0.08em] -mb-[0.08em]`}
                  animate={reduced ? undefined : { backgroundPosition: ['120% 0%', '-20% 0%'] }}
                  transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut', delay: 2.4 }}
                >
                  {p}
                </motion.span>
              </motion.span>
            </span>
          ))}
        </h1>
        {/* Su yansıması: adların soluk, dalgalanan aynası */}
        <motion.div
          aria-hidden="true"
          {...fade(2.2)}
          className={`${DISPLAY} font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(1.6rem,7cqw,3.6rem)] text-[#9DF3FF]/25 -scale-y-100 blur-[1.5px] [mask-image:linear-gradient(0deg,black,transparent_70%)] select-none`}
        >
          <motion.span className="inline-block" animate={reduced ? undefined : { skewX: [-4, 4, -4] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
            {names[names.length - 1]}
          </motion.span>
        </motion.div>
        <motion.p {...fade(2.4)} className="mt-6 text-base sm:text-lg text-[#CFEFF3] max-w-md">
          {d.subtitle || FLAVOR.tagline}
        </motion.p>
        {(d.date.day || d.venue) && (
          <motion.div {...fade(2.7)} className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[d.date.day, d.date.time, d.venue].filter(Boolean).map((t) => (
              <span key={t} className="rounded-full bg-[#031A24]/60 backdrop-blur border border-[#5CE1F0]/25 px-3.5 py-1.5 text-xs text-[#DDF6F8]">
                {t}
              </span>
            ))}
          </motion.div>
        )}
        {live && (
          <motion.p {...fade(3.4)} className="mt-6 text-[10px] tracking-[0.3em] uppercase text-[#7FC6D2]">
            Suya dokunun
          </motion.p>
        )}
        <ScrollCue delay={3.6} className="text-[#9DF3FF]" />
      </motion.div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Geri sayım"
        classes={{
          root: 'min-h-[80svh]',
          eyebrow: 'text-[#FF5DB1]',
          date: `${DISPLAY} font-bold tracking-[-0.03em] text-[clamp(2.4rem,11cqw,5.2rem)] leading-none text-[#F2FEFF]`,
          meta: 'text-[#A9CCD3]',
          cell: 'rounded-2xl bg-[#031A24]/55 backdrop-blur border border-[#5CE1F0]/20 px-2 py-3',
          number: `${DISPLAY} font-semibold text-[#F2FEFF]`,
          label: 'text-[#7FC6D2]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

function Backdrop(props: React.ComponentProps<typeof CinemaBackdrop>) {
  const reduced = useReducedMotion() ?? false;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ripples = useRef<number[]>(new Array(16).fill(0));
  const next = useRef(0);
  const onVideo = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
  }, []);
  const uniforms = useCallback(({ t, width, height }: { t: number; width: number; height: number }): Record<string, UniformValue> => {
    return {
      uOrbs: { type: '2fv', value: orbPositions(t, width / height) },
      uOrbColors: { type: '3fv', value: ORB_COLOR_FLAT },
      uRipples: { type: '4fv', value: ripples.current }
    };
  }, []);
  const onPointer = useCallback((x: number, y: number, clock: number) => {
    const i = next.current;
    next.current = (i + 1) % 4;
    ripples.current.splice(i * 4, 4, x, y, clock, 1);
  }, []);
  return (
    <CinemaBackdrop {...props} onVideo={onVideo}>
      <LiveShader
        fragment={HAVUZ_FRAG}
        mode={props.mode}
        uniforms={uniforms}
        timeSource={() => videoRef.current?.currentTime ?? null}
        onPointer={onPointer}
      />
      <LightSweeps reduced={reduced || props.mode === 'preview'} />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_48%,rgba(1,10,16,0.62),transparent_78%)]" />
    </CinemaBackdrop>
  );
}

/**
 * PartiHavuz — "Gece Havuzu": üstten bakılan gece havuzu; karo zeminde
 * döngüsel kostik ağı ve yüzen LED küreler (kodla üretilmiş video). Canlı
 * modda video, AYNI shader'ı çizen WebGL katmanına yumuşakça devreder:
 * dokunulan yerde su halkası açılır. Kulüp ışıkları kadrajı süpürür.
 */
export function PartiHavuz({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={FLAVOR}
      mode={mode}
      themeOverride={THEME}
      renderBackdrop={(state) => (
        <Backdrop
          {...state}
          video={VIDEO}
          mode={mode}
          base="radial-gradient(ellipse 90% 80% at 50% 50%, #08394A 0%, #03161F 60%, #010A0F 100%)"
          dimRgb="2,14,20"
          dim={0.58}
          zoom={1.12}
        />
      )}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
