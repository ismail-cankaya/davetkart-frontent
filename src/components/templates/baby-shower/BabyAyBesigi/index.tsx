import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { videoSet } from '../../shared/videoAssets';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { CinemaBackdrop, DateCountdown, ScrollCue, SplitReveal, TapBurst, useTemplateFont } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { BABY_SHOWER_FLAVOR } from '../flavors';

const VIDEO = videoSet('baby-ay-besigi', { landscape: '50% 30%', portrait: '50% 30%' });
const FONT = 'Quicksand:wght@300..700';
const DISPLAY = "[font-family:'Quicksand',var(--font-sans),sans-serif]";

const THEME: SectionTheme = {
  id: 'stone',
  base: "bg-[#F6E6F0] [&_.font-serif]:[font-family:'Quicksand',var(--font-sans),sans-serif] [&_.font-serif]:font-semibold",
  page: 'text-[#4B3B66]',
  surface: 'bg-white/60 backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(120,90,170,0.45)]',
  border: 'border-[#B9A6E0]/35',
  heading: 'text-[#3E2F5B]',
  body: 'text-[#6E5E86]',
  accent: 'text-[#9A7BD0]',
  accentBg: 'bg-[#B79CE6]',
  accentSoft: 'bg-[#B79CE6]/15',
  input:
    'w-full bg-white/70 border border-[#B9A6E0]/45 rounded-2xl px-3.5 py-2.5 text-sm text-[#3E2F5B] placeholder:text-[#9C8FB3] focus:outline-none focus:border-[#9A7BD0] focus:ring-2 focus:ring-[#9A7BD0]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(135deg,#B79CE6,#F2A9C4)] hover:brightness-105 text-white shadow-lg shadow-[#B79CE6]/35 rounded-full',
  buttonGhost: 'border border-[#B9A6E0]/50 text-[#4B3B66] hover:bg-white/50 rounded-full',
  divider: 'bg-[#B9A6E0]/30',
  timelineLine: 'from-[#B79CE6]/80 via-[#F2A9C4]/50 to-transparent',
  envelope: {
    paper: 'bg-[#E9DDF7]',
    flap: 'bg-[#DCCBF2]',
    seal: 'bg-[#F6D58E] text-[#4B3B66]',
    glow: 'bg-[#F6D58E]/40',
    card: 'bg-white border border-[#B9A6E0]/40'
  },
  mapHeader: 'bg-[#E9DDF7]',
  footer: { names: 'text-[#6E5E86]', branding: 'text-[#9C8FB3]' }
};

const FLAVOR: TemplateFlavor = {
  ...BABY_SHOWER_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Ayın beşiğinde, yıldızların ninnisinde',
  headings: { timeline: 'Günün Akışı', details: 'Buluşma Yeri', gallery: 'Bekleyiş', gift: 'Hediye Listesi', rsvp: 'Katılımınızı Bildirin' }
};

/** Açılışta tek tek yanan küçük yıldızlar (metnin çevresinde). */
function Pirilti({ reduced }: { reduced: boolean }) {
  const spots = [
    [12, 22, 0.4], [86, 18, 0.9], [20, 70, 1.3], [80, 66, 1.1], [50, 8, 0.7], [6, 48, 1.6], [94, 44, 1.9]
  ];
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      {spots.map(([x, y, d], i) => (
        <motion.svg
          key={i}
          viewBox="0 0 20 20"
          className="absolute w-3.5 h-3.5 text-[#F6D58E]"
          style={{ left: `${x}%`, top: `${y}%` }}
          initial={reduced ? false : { scale: 0, opacity: 0, rotate: -40 }}
          animate={reduced ? undefined : { scale: [0, 1.2, 1], opacity: [0, 1, 0.85], rotate: 0 }}
          transition={{ delay: d, duration: 1.2, ease: 'easeOut' }}
        >
          <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="currentColor" />
        </motion.svg>
      ))}
    </div>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONT);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const fade = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 1.4, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className="relative grow flex flex-col">
      {/* Ay kadrajın üst yarısında: metin ayın altındaki boşluğa oturur. */}
      <div className="relative min-h-[100svh] @container flex flex-col items-center justify-end px-6 pt-[40svh] pb-28 text-center" dir="auto">
        <TapBurst enabled={mode === 'live'} style={{ colors: ['#FFF4C9', '#F6D58E', '#E9D8FF', '#FFD6E6'], count: 18, speed: 70, gravity: -22, life: 2.2, size: 2.4 }} />
        <motion.div
          className="relative px-6 py-7 rounded-[2.5rem] bg-white/25 backdrop-blur-[2px]"
          animate={reduced ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        >
          <Pirilti reduced={reduced} />
          <motion.p {...fade(0.8)} className="text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#8F72C4]">
            {d.title || 'Bebek Hoş Geldin'}
          </motion.p>
          <h1 className={`mt-4 ${DISPLAY} font-semibold leading-[1.05] text-[clamp(2.4rem,11cqw,5.2rem)] text-[#3E2F5B] max-w-full break-words [text-shadow:0_2px_24px_rgba(255,255,255,0.7)]`}>
            {(d.hasNames ? d.people : [NO_NAMES]).map((p, i) => (
              <span key={p + i} className="block">
                {i > 0 && (
                  <motion.span {...fade(2.1)} className="block my-1 text-[0.4em] font-normal text-[#8F72C4]">
                    &amp;
                  </motion.span>
                )}
                <SplitReveal text={p} style="blur" delay={1.3 + i * 0.6} stagger={0.07} duration={1.4} />
              </span>
            ))}
          </h1>
          <motion.p {...fade(2.6)} className={`mt-5 ${DISPLAY} text-base sm:text-lg text-[#5E4D7A]`}>
            {d.subtitle || FLAVOR.tagline}
          </motion.p>
          {(d.date.day || d.venue) && (
            <motion.p {...fade(3)} className="mt-4 text-[11px] tracking-[0.28em] uppercase text-[#7D6A9C]">
              {[d.date.day, d.venue].filter(Boolean).join('  ·  ')}
            </motion.p>
          )}
        </motion.div>
        <ScrollCue delay={3.6} className="text-[#7D6A9C]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Kavuşmaya kalan"
        classes={{
          root: 'min-h-[75svh]',
          eyebrow: 'text-[#8F72C4]',
          date: `${DISPLAY} font-semibold text-[clamp(2.4rem,10cqw,4.6rem)] leading-none text-[#3E2F5B]`,
          meta: 'text-[#6E5E86]',
          cell: 'rounded-full bg-white/55 backdrop-blur w-[4.4rem] h-[4.4rem] justify-center shadow-[0_10px_30px_-18px_rgba(120,90,170,0.6)]',
          number: `${DISPLAY} font-semibold text-2xl sm:text-3xl text-[#3E2F5B]`,
          label: 'mt-1 text-[8px] text-[#8F7FA8]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

/**
 * BabyAyBesigi — "Ay Beşiği": pastel alacakaranlıkta iki kurdeleye asılı
 * hilal beşik gibi sallanır, uçlarından yıldızlar sarkar, bulut yatağı nefes
 * alır (kodla üretilmiş video). Adlar yumuşak bir bulanıklıktan doğar; kart
 * ninni temposunda süzülür, dokunulan yerden yıldız tozu yükselir.
 */
export function BabyAyBesigi({ invitation, mode = 'preview' }: TemplateProps) {
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
          base="linear-gradient(180deg, #A9A3E2 0%, #F2D3EA 55%, #F6E6F0 100%)"
          dimRgb="246,232,242"
          dim={0.55}
          zoom={1.06}
        />
      )}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
