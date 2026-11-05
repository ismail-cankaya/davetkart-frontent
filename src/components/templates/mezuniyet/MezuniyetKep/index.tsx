import React, { useEffect } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { videoSet } from '../../shared/videoAssets';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { CinemaBackdrop, DateCountdown, ScrollCue, SplitReveal, TapBurst, useTemplateFont } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { MEZUNIYET_FLAVOR } from '../flavors';

const VIDEO = videoSet('mezuniyet-kep', { landscape: '50% 45%', portrait: '50% 45%' });
const FONT = 'DM+Serif+Display:ital@0;1';
const DISPLAY = "[font-family:'DM_Serif_Display',var(--font-serif),serif]";

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#120E24] [&_.font-serif]:[font-family:'DM_Serif_Display',var(--font-serif),serif] [&_.font-serif]:font-normal",
  page: 'text-[#F6EEE6]',
  surface: 'bg-[#1C1636]/72 backdrop-blur-md shadow-[0_0_60px_-28px_rgba(255,170,90,0.5)]',
  border: 'border-[#F2C26B]/22',
  heading: 'text-[#FFF6EC]',
  body: 'text-[#CFC3CF]',
  accent: 'text-[#F2C26B]',
  accentBg: 'bg-[#F2C26B]',
  accentSoft: 'bg-[#F2C26B]/12',
  input:
    'w-full bg-[#140F2A]/75 border border-[#F2C26B]/25 rounded-lg px-3.5 py-2.5 text-sm text-[#FFF6EC] placeholder:text-[#8C819E] focus:outline-none focus:border-[#F2C26B] focus:ring-2 focus:ring-[#F2C26B]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#FFD58C,#E89A4A)] hover:brightness-110 text-[#1E1230] shadow-lg shadow-[#E89A4A]/30',
  buttonGhost: 'border border-[#F2C26B]/35 text-[#F6EEE6] hover:bg-[#F2C26B]/10',
  divider: 'bg-[#F2C26B]/18',
  timelineLine: 'from-[#F2C26B]/80 via-[#E98A7A]/45 to-transparent',
  envelope: {
    paper: 'bg-[#1E1A44]',
    flap: 'bg-[#26205A]',
    seal: 'bg-[#F2C26B] text-[#1E1230]',
    glow: 'bg-[#FF9F5A]/30',
    card: 'bg-[#FFF8EE] border border-[#F2C26B]/40'
  },
  mapHeader: 'bg-[#1C1636]',
  footer: { names: 'text-[#CFC3CF]', branding: 'text-[#8C819E]' }
};

const FLAVOR: TemplateFlavor = {
  ...MEZUNIYET_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Kepler havada, gelecek önümüzde',
  headings: { timeline: 'Tören Programı', details: 'Tören Yeri', gallery: 'Okul Yılları', gift: 'Hediye', rsvp: 'Törene Katılım' }
};

/**
 * Kaydırma ↔ video. Açılışta kepler 3.5 sn'de kendiliğinden havalanır (%40);
 * sonra belge ilerlemesi devralır ve misafir aşağı indikçe kepler tepeye
 * ulaşıp asılı kalır.
 */
function Backdrop({ mode, ...state }: BackdropState & { mode: 'preview' | 'live' }) {
  const reduced = useReducedMotion() ?? false;
  const intro = useMotionValue(mode === 'live' && !reduced ? 0 : 0.55);
  useEffect(() => {
    if (mode !== 'live' || reduced) return;
    const c = animate(intro, 0.4, { duration: 3.5, ease: [0.2, 0.7, 0.3, 1], delay: 0.2 });
    return () => c.stop();
  }, [mode, reduced, intro]);
  const scrub = useTransform(() => (intro.get() < 0.4 ? intro.get() : 0.4 + state.progress.get() * 0.6));
  return (
    <CinemaBackdrop
      {...state}
      video={VIDEO}
      mode={mode}
      playback={{ kind: 'scrub', progress: scrub }}
      base="linear-gradient(180deg, #2A2458 0%, #8E4E7A 50%, #F09A52 100%)"
      dimRgb="18,14,36"
      dim={0.6}
      zoom={1.05}
    >
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,rgba(18,14,36,0.7),transparent)]" />
    </CinemaBackdrop>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONT);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const fade = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 1, ease: [0.22, 1, 0.36, 1] as const } };
  const year = d.date.year ? `’${d.date.year.slice(-2)}` : '';

  return (
    <div className="relative grow flex flex-col">
      <div className="relative min-h-[100svh] @container flex flex-col items-center justify-end px-6 pt-[40svh] pb-24 text-center" dir="auto">
        <TapBurst enabled={mode === 'live'} style={{ colors: ['#FFD58C', '#F2C26B', '#3A4AA8', '#FFFFFF'], count: 30, speed: 210, gravity: 160, life: 1.5, size: 2.4 }} />
        {year && (
          <motion.span
            aria-hidden="true"
            className={`absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 ${DISPLAY} text-[clamp(9rem,48cqw,26rem)] leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,236,210,0.35)] select-none pointer-events-none`}
            initial={reduced ? false : { opacity: 0, scale: 1.25, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {year}
          </motion.span>
        )}
        <motion.p {...fade(1.2)} className="relative text-[10px] sm:text-[11px] tracking-[0.5em] uppercase text-[#FFE2A8] [text-shadow:0_1px_3px_rgba(30,15,40,0.95),0_0_14px_rgba(30,15,40,0.7)]">
          {d.title || 'Mezuniyet Törenine Davet'}
        </motion.p>
        <h1 className={`relative mt-5 ${DISPLAY} leading-[1] text-[clamp(2.6rem,12cqw,6.2rem)] text-[#FFF6EC] max-w-full break-words [text-shadow:0_0_30px_rgba(255,170,90,0.45),0_3px_16px_rgba(20,10,40,0.7)]`}>
          {(d.hasNames ? d.people : [NO_NAMES]).map((p, i) =>
            i === 0 ? (
              <span key={p + i} className="block">
                <SplitReveal text={p} style="rise" delay={1.6} stagger={0.045} duration={0.9} />
              </span>
            ) : (
              <motion.span key={p + i} {...fade(2.4)} className="block mt-3 italic text-[0.38em] text-[#FFD58C]">
                {p}
              </motion.span>
            )
          )}
        </h1>
        {/* Diploma kurdelesi: ortadan iki yana açılır */}
        <motion.span
          aria-hidden="true"
          className="relative mt-6 block h-[3px] w-40 bg-[linear-gradient(90deg,transparent,#F2C26B_20%,#B23A48_50%,#F2C26B_80%,transparent)]"
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.6, duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
        />
        <motion.p {...fade(2.9)} className={`relative mt-5 ${DISPLAY} italic text-lg sm:text-xl text-[#F3E4DA]`}>
          {d.subtitle || FLAVOR.tagline}
        </motion.p>
        {(d.date.day || d.venue) && (
          <motion.p {...fade(3.2)} className="relative mt-4 text-[11px] tracking-[0.3em] uppercase text-[#E3D3DA]">
            {[d.date.day, d.venue].filter(Boolean).join('  ·  ')}
          </motion.p>
        )}
        <ScrollCue delay={3.6} className="text-[#FFD58C]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Törene kalan"
        classes={{
          root: 'min-h-[80svh]',
          eyebrow: 'text-[#FFD58C]',
          date: `${DISPLAY} text-[clamp(3rem,13cqw,6rem)] leading-none text-[#FFF6EC]`,
          meta: 'text-[#CFC3CF]',
          cell: 'border-t-2 border-[#F2C26B] pt-3',
          number: `${DISPLAY} text-[#FFF6EC]`,
          label: 'text-[#A497B0]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

/**
 * MezuniyetKep — "Kep Atma": gün batımında ağır çekimle havalanan kepler,
 * savrulan püsküller, kurdeleler ve güneşte parlayan pul konfeti (kodla
 * üretilmiş, kaydırmaya bağlı video). Açılışta kepler kendiliğinden
 * havalanır; kaydırdıkça tepeye ulaşır. Arkada mezuniyet yılı, dokununca
 * konfeti.
 */
export function MezuniyetKep({ invitation, mode = 'preview' }: TemplateProps) {
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
