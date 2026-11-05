import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { videoSet } from '../../shared/videoAssets';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { CinemaBackdrop, DateCountdown, ScrollCue, SplitReveal, TapBurst, useTemplateFont } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { SUNNET_FLAVOR } from '../flavors';

const VIDEO = videoSet('sunnet-sehzade', { landscape: '50% 30%', portrait: '50% 25%' });
const FONT = 'Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400..700';
const DECO = "[font-family:'Cinzel_Decorative',var(--font-cormorant),serif]";
const CINZEL = "[font-family:'Cinzel',var(--font-cormorant),serif]";
const GOLD = 'bg-[linear-gradient(180deg,#FFF0C4_0%,#E7BE6A_50%,#A8732A_100%)] bg-clip-text text-transparent pt-[0.22em] -mt-[0.22em] pb-[0.08em] -mb-[0.08em]';
// Dolgu: bg-clip-text yalnızca kutuyu boyar; İ noktası ve ğ kuyruğu kutu dışında kalmasın.

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#07060F] [&_.font-serif]:[font-family:'Cinzel',var(--font-cormorant),serif] [&_.font-serif]:font-semibold",
  page: 'text-[#F1E6CF]',
  surface: 'bg-[#120F26]/72 backdrop-blur-md shadow-[0_0_60px_-26px_rgba(255,170,80,0.5)]',
  border: 'border-[#E7BE6A]/22',
  heading: 'text-[#FFF0D2]',
  body: 'text-[#C7BBA8]',
  accent: 'text-[#E7BE6A]',
  accentBg: 'bg-[#9E1A2C]',
  accentSoft: 'bg-[#9E1A2C]/15',
  input:
    'w-full bg-[#0B0A18]/75 border border-[#E7BE6A]/25 rounded-lg px-3.5 py-2.5 text-sm text-[#FFF0D2] placeholder:text-[#8E8576] focus:outline-none focus:border-[#E7BE6A] focus:ring-2 focus:ring-[#E7BE6A]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#F3D58E,#C8923E)] hover:brightness-110 text-[#1B1206] shadow-lg shadow-[#C8923E]/30',
  buttonGhost: 'border border-[#E7BE6A]/35 text-[#F1E6CF] hover:bg-[#E7BE6A]/10',
  divider: 'bg-[#E7BE6A]/18',
  timelineLine: 'from-[#E7BE6A]/80 via-[#9E1A2C]/50 to-transparent',
  envelope: {
    paper: 'bg-[#1A1F4A]',
    flap: 'bg-[#6A0F1E]',
    seal: 'bg-[#E7BE6A] text-[#1B1206]',
    glow: 'bg-[#FFB45E]/30',
    card: 'bg-[#FFF6E4] border border-[#E7BE6A]/45'
  },
  mapHeader: 'bg-[#14183A]',
  footer: { names: 'text-[#C7BBA8]', branding: 'text-[#8E8576]' }
};

const FLAVOR: TemplateFlavor = {
  ...SUNNET_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Şehzademizin en mutlu günü',
  headings: { timeline: 'Şölen Programı', details: 'Otağımız', gallery: 'Şehzadeden Kareler', gift: 'Hediye', rsvp: 'Davete İcabet' }
};

/** Sekiz köşeli yıldız arması: iki kare, kendini çizer, ortada nokta. */
function Arma({ reduced }: { reduced: boolean }) {
  const draw = (delay: number) =>
    reduced ? {} : { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { delay, duration: 1.6, ease: 'easeInOut' as const } };
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-16 h-16 sm:w-20 sm:h-20"
      fill="none"
      aria-hidden="true"
      animate={reduced ? undefined : { rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
    >
      <motion.rect x="22" y="22" width="56" height="56" stroke="#E7BE6A" strokeWidth="1.5" {...draw(1.4)} />
      <motion.rect x="22" y="22" width="56" height="56" stroke="#E7BE6A" strokeWidth="1.5" transform="rotate(45 50 50)" {...draw(1.7)} />
      <motion.circle cx="50" cy="50" r="12" stroke="#F3D58E" strokeWidth="1" {...draw(2.1)} />
      <circle cx="50" cy="50" r="3" fill="#F3D58E" />
    </motion.svg>
  );
}

/** Açılış: iki kadife perde, bağcıkla yanlara toplanır. */
function Perdeler() {
  const ease = [0.7, 0, 0.3, 1] as const;
  const fabric =
    'absolute top-0 bottom-0 w-1/2 bg-[repeating-linear-gradient(90deg,#5A0C18_0px,#8E1A2A_22px,#5A0C18_46px)] shadow-[inset_0_-40px_60px_rgba(0,0,0,0.45)]';
  return (
    // Yalnızca ilk ekran: bağlanmış perdeler kapağı çerçeveler, aşağı taşmaz.
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[100svh] z-20 pointer-events-none overflow-hidden">
      {(['left', 'right'] as const).map((side) => (
        <motion.div
          key={side}
          className={`${fabric} ${side === 'left' ? 'left-0 origin-left' : 'right-0 origin-right'}`}
          initial={{ scaleX: 1, x: 0 }}
          animate={{ scaleX: 0.16, x: 0 }}
          transition={{ delay: 0.5, duration: 2.2, ease }}
        >
          <span className={`absolute top-0 bottom-0 w-[3px] bg-[#E7BE6A]/80 ${side === 'left' ? 'right-0' : 'left-0'}`} />
        </motion.div>
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
    reduced ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 1.2, ease: [0.22, 1, 0.36, 1] as const } };
  const [first, ...rest] = d.hasNames ? d.people : [NO_NAMES];

  return (
    <div className="relative grow flex flex-col">
      {live && <Perdeler />}
      <div className="relative min-h-[100svh] @container flex flex-col items-center justify-center px-6 pt-[18svh] pb-24 text-center" dir="auto">
        <TapBurst enabled={mode === 'live'} style={{ colors: ['#FFE6A8', '#E7BE6A', '#FF9F5A'], count: 24, speed: 140, gravity: 70, life: 1.2, size: 2 }} />
        <Arma reduced={reduced} />
        <motion.p {...fade(1.9)} className={`mt-5 ${CINZEL} text-[10px] sm:text-xs tracking-[0.45em] uppercase text-[#E7BE6A]`}>
          {d.title || 'Sünnet Düğünümüze Davet'}
        </motion.p>
        <h1 className={`mt-5 ${DECO} font-bold leading-[1.05] text-[clamp(2.6rem,12cqw,6rem)] max-w-full break-words [filter:drop-shadow(0_0_20px_rgba(255,180,90,0.35))_drop-shadow(0_2px_10px_rgba(0,0,0,0.7))]`}>
          <SplitReveal text={first} style="drop" delay={2.1} stagger={0.07} duration={1} charClassName={GOLD} />
        </h1>
        {rest.length > 0 && (
          <motion.p {...fade(3)} className={`mt-4 ${CINZEL} text-base sm:text-xl tracking-[0.12em] text-[#F1E6CF]`}>
            <span className="text-[#E7BE6A] mr-2">&amp;</span>
            {rest.join(' ')}
          </motion.p>
        )}
        <motion.p {...fade(3.3)} className="mt-5 font-cormorant italic text-xl text-[#E6D8BE]">
          {d.subtitle || FLAVOR.tagline}
        </motion.p>
        {(d.date.day || d.venue) && (
          <motion.p {...fade(3.6)} className={`mt-4 ${CINZEL} text-[11px] tracking-[0.3em] uppercase text-[#C7BBA8]`}>
            {[d.date.day, d.venue].filter(Boolean).join('  ·  ')}
          </motion.p>
        )}
        <ScrollCue delay={4} className="text-[#E7BE6A]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Şölene kalan"
        classes={{
          root: 'min-h-[80svh]',
          eyebrow: `${CINZEL} text-[#E7BE6A]`,
          date: `${DECO} font-bold text-[clamp(2.4rem,10cqw,4.8rem)] leading-none ${GOLD}`,
          meta: `${CINZEL} text-[#C7BBA8]`,
          cell: 'border border-[#E7BE6A]/30 bg-[#120F26]/60 backdrop-blur px-2 py-3 [clip-path:polygon(15%_0,85%_0,100%_15%,100%_85%,85%_100%,15%_100%,0_85%,0_15%)]',
          number: `${CINZEL} font-semibold text-[#FFF0D2]`,
          label: 'text-[#A89C88]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

/**
 * SunnetSehzade — "Şehzade Çadırı": otağın içinden tepeye bakış; kubbeye
 * toplanan al-lacivert kumaş dilimleri ve zincirlerden sarkan delikli pirinç
 * fenerler (kodla üretilmiş video). Açılışta kadife perdeler bağlanarak
 * açılır, sekiz köşeli yıldız arması kendini çizer, şehzadenin adı altın
 * harflerle yukarıdan iner; dokunulan yerde altın kıvılcım.
 */
export function SunnetSehzade({ invitation, mode = 'preview' }: TemplateProps) {
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
          base="radial-gradient(ellipse 90% 70% at 50% 0%, #3A0A16 0%, #120A22 55%, #050309 100%)"
          dimRgb="6,5,12"
          dim={0.6}
          zoom={1.08}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_50%_36%_at_50%_55%,rgba(4,3,8,0.6),transparent_78%)]" />
        </CinemaBackdrop>
      )}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
