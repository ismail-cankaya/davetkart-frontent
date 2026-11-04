import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { videoSet } from '../../shared/videoAssets';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { CinemaBackdrop, DateCountdown, ScrollCue, SplitReveal, TapBurst, useTemplateFont } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { KINA_FLAVOR } from '../flavors';

const VIDEO = videoSet('kina-al-duvak');
const FONT = 'Yeseva+One';
const DISPLAY = "[font-family:'Yeseva_One',var(--font-cormorant),serif]";
const GOLD_TEXT = 'bg-[linear-gradient(180deg,#FFF1C9_0%,#E9B860_48%,#B87A2C_100%)] bg-clip-text text-transparent';
const GLOW = '[filter:drop-shadow(0_0_18px_rgba(255,170,90,0.35))]';

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#0C0206] [&_.font-serif]:[font-family:'Yeseva_One',var(--font-cormorant),serif] [&_.font-serif]:font-normal",
  page: 'text-[#F6E6DA]',
  surface: 'bg-[#1A050C]/72 backdrop-blur-md shadow-[0_0_60px_-24px_rgba(232,64,64,0.55)]',
  border: 'border-[#E9B860]/22',
  heading: 'text-[#FFEBD2]',
  body: 'text-[#D9BFB4]',
  accent: 'text-[#E9B860]',
  accentBg: 'bg-[#C8322F]',
  accentSoft: 'bg-[#C8322F]/12',
  input:
    'w-full bg-[#12030A]/75 border border-[#E9B860]/25 rounded-lg px-3.5 py-2.5 text-sm text-[#FFEBD2] placeholder:text-[#9C7F78] focus:outline-none focus:border-[#E9B860] focus:ring-2 focus:ring-[#E9B860]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#E3473F,#9E1420)] hover:brightness-110 text-[#FFF1E4] shadow-lg shadow-[#9E1420]/40',
  buttonGhost: 'border border-[#E9B860]/35 text-[#F6E6DA] hover:bg-[#E9B860]/10',
  divider: 'bg-[#E9B860]/18',
  timelineLine: 'from-[#E9B860]/80 via-[#C8322F]/45 to-transparent',
  envelope: {
    paper: 'bg-[#5E0A16]',
    flap: 'bg-[#741021]',
    seal: 'bg-[#E9B860] text-[#3A0710]',
    glow: 'bg-[#E3473F]/35',
    card: 'bg-[#FFF3E6] border border-[#E9B860]/45'
  },
  mapHeader: 'bg-[#2A0710]',
  footer: { names: 'text-[#D9BFB4]', branding: 'text-[#A88C86]' }
};

const FLAVOR: TemplateFlavor = {
  ...KINA_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Al duvağın altında bir gece',
  headings: { timeline: 'Gecenin Akışı', details: 'Kına Evi', gallery: 'Kınalı Anlar', gift: 'Takı & Hediye', rsvp: 'Gelişinizi Bildirin' }
};

/** Kına deseni: damla, nokta dizisi ve kıvrık sarmaşık — kendini çizerek gelir. */
function KinaDeseni({ reduced }: { reduced: boolean }) {
  const draw = (delay: number, duration = 1.8) =>
    reduced
      ? {}
      : { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { delay, duration, ease: 'easeInOut' as const } };
  const dot = (delay: number) =>
    reduced ? {} : { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { delay, duration: 0.5 } };
  return (
    <svg viewBox="0 0 240 90" className="w-[min(62vw,240px)] h-auto" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="kad-altin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF1C9" />
          <stop offset="1" stopColor="#C88A3A" />
        </linearGradient>
      </defs>
      <g stroke="url(#kad-altin)" strokeWidth="1.2" strokeLinecap="round">
        {/* Orta damla (paisley) */}
        <motion.path d="M120 12 C 136 30, 140 52, 120 72 C 100 52, 104 30, 120 12 Z" {...draw(1.2)} />
        <motion.path d="M120 26 C 129 38, 130 52, 120 62 C 110 52, 111 38, 120 26 Z" {...draw(1.6, 1.4)} />
        {/* Yan sarmaşıklar */}
        <motion.path d="M104 52 C 84 60, 66 40, 46 50 C 32 57, 30 70, 14 66" {...draw(1.9, 2.0)} />
        <motion.path d="M136 52 C 156 60, 174 40, 194 50 C 208 57, 210 70, 226 66" {...draw(1.9, 2.0)} />
        <motion.path d="M70 46 C 66 36, 74 30, 80 34 C 84 38, 78 44, 74 40" {...draw(2.6, 1)} />
        <motion.path d="M170 46 C 174 36, 166 30, 160 34 C 156 38, 162 44, 166 40" {...draw(2.6, 1)} />
      </g>
      <g fill="#E9B860">
        {[30, 46, 62].map((x, i) => (
          <motion.circle key={`l${x}`} cx={x} cy={i === 1 ? 46 : 56} r="1.6" {...dot(2.9 + i * 0.1)} />
        ))}
        {[178, 194, 210].map((x, i) => (
          <motion.circle key={`r${x}`} cx={x} cy={i === 1 ? 46 : 56} r="1.6" {...dot(2.9 + i * 0.1)} />
        ))}
        <motion.circle cx="120" cy="82" r="2.2" {...dot(3.1)} />
      </g>
    </svg>
  );
}

/**
 * Açılış: ekranı örten iki tül kanadı yanlara çekilir — duvak kalkar. Video
 * ve isimler bu aralıktan görünür. Yalnızca canlı modda; önizlemede ve
 * hareketi azalt'ta hiç çizilmez.
 */
function DuvakKalkisi() {
  const panel = 'absolute top-0 bottom-0 w-[58%] backdrop-blur-[3px]';
  // Aynalama `scale` ile yapılmaz: motion'ın `x` dönüşümü ters uzayda çalışır ve kanat yanlış yöne kayar.
  const leftFill = 'bg-[linear-gradient(90deg,rgba(120,6,20,0.92),rgba(170,18,34,0.78)_60%,rgba(200,40,50,0.55))]';
  const rightFill = 'bg-[linear-gradient(270deg,rgba(120,6,20,0.92),rgba(170,18,34,0.78)_60%,rgba(200,40,50,0.55))]';
  const ease = [0.65, 0, 0.35, 1] as const;
  return (
    <div aria-hidden="true" className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      <motion.div
        className={`${panel} ${leftFill} left-0 origin-left`}
        initial={{ x: '0%', skewY: 0 }}
        animate={{ x: '-105%', skewY: -4 }}
        transition={{ delay: 0.35, duration: 2.1, ease }}
      >
        <span className="absolute right-0 inset-y-0 w-[3px] bg-[linear-gradient(180deg,transparent,#E9B860,transparent)] opacity-80" />
      </motion.div>
      <motion.div
        className={`${panel} ${rightFill} right-0 origin-right`}
        initial={{ x: '0%', skewY: 0 }}
        animate={{ x: '105%', skewY: 4 }}
        transition={{ delay: 0.35, duration: 2.1, ease }}
      >
        <span className="absolute left-0 inset-y-0 w-[3px] bg-[linear-gradient(180deg,transparent,#E9B860,transparent)] opacity-80" />
      </motion.div>
    </div>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONT);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const live = mode === 'live' && !reduced;
  const fade = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 1.1, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className="relative grow flex flex-col">
      {live && <DuvakKalkisi />}
      <div className="relative min-h-[100svh] @container flex flex-col items-center justify-center px-6 pt-14 pb-24 text-center" dir="auto">
        <TapBurst enabled={mode === 'live'} style={{ colors: ['#FFE6A8', '#E9B860', '#FFB08A'], count: 26, speed: 150, gravity: 40, life: 1.3, size: 2.1 }} />
        <motion.p {...fade(1.6)} className="text-[10px] sm:text-[11px] tracking-[0.5em] uppercase text-[#E9B860]">
          {d.title || 'Kına Gecesi'}
        </motion.p>
        <div className="mt-5">
          <KinaDeseni reduced={reduced} />
        </div>
        <h1 className={`mt-4 ${DISPLAY} leading-[1.02] text-[clamp(2.7rem,12.5cqw,6.2rem)] max-w-full break-words ${GLOW}`}>
          {d.hasNames ? (
            d.people.map((p, i) => (
              <span key={p + i} className="block">
                {i > 0 && (
                  <motion.span {...fade(2.4)} className="block my-1 font-cormorant italic text-[0.42em] text-[#E9B860]">
                    &amp;
                  </motion.span>
                )}
                <SplitReveal text={p} style="glow" delay={1.9 + i * 0.55} stagger={0.06} duration={1.1} charClassName={GOLD_TEXT} />
              </span>
            ))
          ) : (
            <SplitReveal text={NO_NAMES} style="glow" delay={1.9} charClassName={GOLD_TEXT} />
          )}
        </h1>
        <motion.p {...fade(3.0)} className="mt-6 font-cormorant italic text-xl sm:text-2xl text-[#F3D9C8]">
          {d.subtitle || FLAVOR.tagline}
        </motion.p>
        {(d.date.day || d.venue) && (
          <motion.p {...fade(3.3)} className="mt-5 text-[11px] tracking-[0.32em] uppercase text-[#D9BFB4]">
            {[d.date.day, d.venue].filter(Boolean).join('  ·  ')}
          </motion.p>
        )}
        <ScrollCue delay={3.8} className="text-[#E9B860]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Kınaya kalan"
        classes={{
          root: 'min-h-[80svh]',
          eyebrow: 'text-[#E9B860]',
          date: `${DISPLAY} text-[clamp(2.6rem,11cqw,5rem)] leading-none ${GOLD_TEXT}`,
          meta: 'text-[#D9BFB4]',
          cell: 'px-1',
          number: `${DISPLAY} text-[#FFEBD2]`,
          label: 'text-[#B99A92]',
          divider: 'bg-[#E9B860]/30'
        }}
        ornament={<span aria-hidden="true" className="absolute inset-x-[18%] top-10 h-px bg-[linear-gradient(90deg,transparent,#E9B860,transparent)] opacity-50" />}
      />
    </div>
  );
}

/**
 * KinaAlDuvak — "Al Duvak": karanlıkta iki kanat hâlinde süzülen kırmızı tül,
 * kıvrımlarda yakalanan ışık ve kenar şeridinde parlayan altın pullar (kodla
 * üretilmiş video). Açılışta HTML tül kanatları yanlara çekilir (duvak
 * kalkar), kına deseni kendini çizer, adlar altın ışıkla belirir; dokunulan
 * yerde altın pul saçılır.
 */
export function KinaAlDuvak({ invitation, mode = 'preview' }: TemplateProps) {
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
          base="radial-gradient(ellipse 80% 70% at 50% 30%, #3A0610 0%, #12020A 60%, #070104 100%)"
          dimRgb="10,2,5"
          dim={0.6}
          zoom={1.1}
        >
          {/* Metnin arkasında hafif koyulaşma: tülün açık kıvrımları adları yutmasın. */}
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_52%,rgba(8,0,3,0.55),transparent_75%)]" />
        </CinemaBackdrop>
      )}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
