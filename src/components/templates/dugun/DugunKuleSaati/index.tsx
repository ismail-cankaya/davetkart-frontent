import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';
import { buildTrain, gearPath, weddingMinutes, type Gear } from './mekanizma';

type Mode = 'preview' | 'live';

const GLOW = '[text-shadow:0_0_22px_rgba(214,168,86,0.35),0_1px_2px_rgba(0,0,0,0.7)]';
/** Açılışta saat düğün saatinden bu kadar dakika önce başlar. */
const LEAD_MIN = 180;
/** Hero bir ekran kaydığında saat bu kadar dakika ileri sarar. */
const SCROLL_MIN = 720;
const ROMAN = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

const KULE_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0F0E0D] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-medium',
  page: 'text-[#EDE0C0]',
  surface: 'bg-[#1B1916]/85 backdrop-blur-md shadow-[0_0_40px_-22px_rgba(201,155,72,0.5)]',
  border: 'border-[#C99B48]/20',
  heading: 'text-[#F3E6C6]',
  body: 'text-[#C9BDA2]',
  accent: 'text-[#D9AE5E]',
  accentBg: 'bg-[#C99B48]',
  accentSoft: 'bg-[#C99B48]/10',
  input:
    'w-full bg-[#0F0E0D]/70 border border-[#C99B48]/25 rounded-lg px-3.5 py-2.5 text-sm text-[#F3E6C6] placeholder:text-[#8F8572] focus:outline-none focus:border-[#C99B48] focus:ring-2 focus:ring-[#C99B48]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#E9C77E,#B5853A)] hover:brightness-110 text-[#17120A] shadow-lg shadow-[#C99B48]/25',
  buttonGhost: 'border border-[#C99B48]/35 text-[#EDE0C0] hover:bg-[#C99B48]/10',
  divider: 'bg-[#C99B48]/15',
  timelineLine: 'from-[#C99B48]/80 via-[#C99B48]/35 to-transparent',
  envelope: {
    paper: 'bg-[#1E1C19]',
    flap: 'bg-[#2A2622]',
    seal: 'bg-[#C99B48] text-[#17120A]',
    glow: 'bg-[#C99B48]/25',
    card: 'bg-[#F3E6C6] border border-[#C99B48]/40'
  },
  mapHeader: 'bg-[#1E1C19]',
  footer: { names: 'text-[#C9BDA2]', branding: 'text-[#8F8572]' }
};

const KULE_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Saat o ânı çaldığında',
  headings: { timeline: 'Saat Saat Günümüz', details: 'Kulenin Altında', gallery: 'Durdurulmuş Anlar', gift: 'Takı & Hediye', rsvp: 'Katılımınızı Bildirin' }
};

/** Animasyon ancak misafir sayfasında ve hareket azaltılmamışsa çalışır. */
function useAnimated(mode: Mode) {
  const reduced = useReducedMotion() ?? false;
  return mode === 'live' && !reduced;
}

function initials(people: string[]): string {
  const letters = people.map((p) => p.trim().charAt(0).toLocaleUpperCase('tr-TR')).filter(Boolean);
  return letters.join(' & ');
}

/* ------------------------------------------------------------------ */
/* Arka plan: koyu demir, yavaşça dönen dev dişli silüetleri             */
/* ------------------------------------------------------------------ */

const BG_GEAR_BIG = gearPath(48, 150);
const BG_GEAR_SMALL = gearPath(24, 75);

function KuleBackdrop({ heroExit }: BackdropState) {
  // Kaydırmaya bağlı dönüş (döngü değil); büyük ve küçük çark kavrar: oran 48/24.
  const big = useTransform(heroExit, [0, 1], [0, 40]);
  const small = useTransform(big, (a) => -a * 2);
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_50%_30%,#24201B_0%,#131210_55%,#090908_100%)]">
      <svg viewBox="-160 -160 320 320" className="absolute -left-[38%] top-[8%] w-[95%] max-w-[720px] opacity-[0.07]" aria-hidden="true">
        <motion.g style={{ rotate: big }}>
          <path d={BG_GEAR_BIG} fill="#C99B48" />
          <circle r="104" fill="#090908" />
          <circle r="22" fill="#C99B48" />
        </motion.g>
      </svg>
      <svg viewBox="-80 -80 160 160" className="absolute -right-[16%] top-[2%] w-[48%] max-w-[360px] opacity-[0.06]" aria-hidden="true">
        <motion.g style={{ rotate: small }}>
          <path d={BG_GEAR_SMALL} fill="#C99B48" />
          <circle r="50" fill="#090908" />
          <circle r="12" fill="#C99B48" />
        </motion.g>
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Saat kulesi (SVG)                                                    */
/* ------------------------------------------------------------------ */

const CX = 150;
const CY = 140;
const PIVOT_Y = 262;

function GearShape({ g }: { g: Gear }) {
  const d = useMemo(() => gearPath(g.teeth, g.r), [g.teeth, g.r]);
  const spokes = g.teeth >= 24 ? 5 : 0;
  const fill = g.tone === 'brass' ? 'url(#kule-brass)' : 'url(#kule-iron)';
  return (
    <>
      <path d={d} fill={fill} stroke="#0A0908" strokeWidth="0.8" />
      {spokes > 0 ? (
        <>
          <circle r={g.r * 0.72} fill="#0E0D0C" opacity="0.85" />
          {Array.from({ length: spokes }, (_, i) => (
            <rect key={i} x={-2.6} y={0} width={5.2} height={g.r * 0.74} fill={fill} transform={`rotate(${(360 / spokes) * i})`} />
          ))}
        </>
      ) : (
        <circle r={g.r * 0.45} fill="none" stroke="#0A0908" strokeWidth="1" opacity="0.6" />
      )}
      <circle r={Math.max(4, g.r * 0.18)} fill={fill} stroke="#0A0908" strokeWidth="0.8" />
      <circle r="1.8" fill="#0A0908" />
    </>
  );
}

interface TowerProps {
  minutes: number;
  animated: boolean;
  opened: boolean;
  strikes: number;
  monogram: string;
  gearRefs: React.MutableRefObject<Map<string, SVGGElement>>;
  hourRef: React.RefObject<SVGGElement | null>;
  minuteRef: React.RefObject<SVGGElement | null>;
  pendulumRef: React.RefObject<SVGGElement | null>;
  train: Gear[];
}

function Tower({ minutes, animated, opened, strikes, monogram, gearRefs, hourRef, minuteRef, pendulumRef, train }: TowerProps) {
  const minuteDeg = (minutes % 60) * 6;
  const hourDeg = ((minutes / 60) % 12) * 30;
  const leaf = opened ? 44 : 0;
  const leafTransition = animated ? { duration: 1.1, ease: [0.65, 0, 0.2, 1] as const } : { duration: 0 };

  return (
    <svg viewBox="0 0 300 430" className="w-full h-auto overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="kule-brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F0D08A" />
          <stop offset="0.45" stopColor="#C2913F" />
          <stop offset="1" stopColor="#7A5420" />
        </linearGradient>
        <linearGradient id="kule-iron" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5A5650" />
          <stop offset="1" stopColor="#24221F" />
        </linearGradient>
        <radialGradient id="kule-face" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#F4E9CF" />
          <stop offset="0.8" stopColor="#E0CFA6" />
          <stop offset="1" stopColor="#BFA877" />
        </radialGradient>
        <radialGradient id="kule-glass" cx="0.5" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#2A2620" />
          <stop offset="1" stopColor="#0C0B0A" />
        </radialGradient>
        <clipPath id="kule-case">
          <rect x="46" y="262" width="208" height="150" rx="10" />
        </clipPath>
        <clipPath id="kule-window">
          <circle cx={CX} cy={CY} r="38" />
        </clipPath>
      </defs>

      {/* Çan vurunca dalgalar */}
      {strikes > 0 &&
        animated &&
        [0, 1, 2].map((i) => (
          <motion.circle
            key={`${strikes}-${i}`}
            cx={CX}
            cy={CY}
            fill="none"
            stroke="#E9C77E"
            strokeWidth="1.4"
            initial={{ r: 110, opacity: 0.7 }}
            animate={{ r: 175, opacity: 0 }}
            transition={{ duration: 1.6, delay: i * 0.28, ease: 'easeOut' }}
          />
        ))}

      {/* Kule gövdesi */}
      <path d="M150 0 L196 24 L104 24 Z" fill="url(#kule-iron)" stroke="#C99B48" strokeOpacity="0.5" />
      <circle cx={CX} cy="15" r="4" fill="url(#kule-brass)" />
      <rect x="30" y="24" width="240" height="398" rx="14" fill="#171513" stroke="#C99B48" strokeOpacity="0.35" strokeWidth="1.2" />
      <rect x="36" y="30" width="228" height="386" rx="10" fill="none" stroke="#C99B48" strokeOpacity="0.14" />

      {/* Kasa camı: dişli takımı + sarkaç */}
      <rect x="46" y="262" width="208" height="150" rx="10" fill="url(#kule-glass)" />
      <g clipPath="url(#kule-case)">
        {train.map((g) => (
          <g key={g.id} transform={`translate(${g.cx.toFixed(2)} ${g.cy.toFixed(2)})`}>
            <g
              ref={(el) => {
                if (el) gearRefs.current.set(g.id, el);
                else gearRefs.current.delete(g.id);
              }}
              transform={`rotate(${g.angle(minutes * 6).toFixed(2)})`}
            >
              <GearShape g={g} />
            </g>
          </g>
        ))}
        <g ref={pendulumRef} transform={`rotate(0 ${CX} ${PIVOT_Y})`}>
          <line x1={CX} y1={PIVOT_Y} x2={CX} y2="384" stroke="url(#kule-iron)" strokeWidth="3" />
          <line x1={CX - 0.6} y1={PIVOT_Y} x2={CX - 0.6} y2="384" stroke="#C99B48" strokeOpacity="0.5" strokeWidth="0.8" />
          <circle cx={CX} cy="392" r="16" fill="url(#kule-brass)" stroke="#5E4118" />
          <circle cx={CX - 5} cy="387" r="4" fill="#FFF3D0" opacity="0.45" />
        </g>
        <circle cx={CX} cy={PIVOT_Y + 2} r="3.5" fill="url(#kule-brass)" />
        <rect x="46" y="262" width="208" height="150" fill="url(#kule-glass)" opacity="0.18" />
      </g>
      <rect x="46" y="262" width="208" height="150" rx="10" fill="none" stroke="#C99B48" strokeOpacity="0.45" />

      {/* Kadran */}
      <circle cx={CX} cy={CY} r="114" fill="url(#kule-iron)" />
      <circle cx={CX} cy={CY} r="108" fill="url(#kule-brass)" />
      <circle cx={CX} cy={CY} r="101" fill="url(#kule-face)" />
      {Array.from({ length: 60 }, (_, i) => {
        const big = i % 5 === 0;
        return (
          <line
            key={i}
            x1={CX}
            y1={CY - 98}
            x2={CX}
            y2={CY - (big ? 89 : 93)}
            stroke="#2A241C"
            strokeWidth={big ? 2 : 0.8}
            transform={`rotate(${i * 6} ${CX} ${CY})`}
          />
        );
      })}
      {ROMAN.map((r, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return (
          <text
            key={r}
            x={CX + 74 * Math.sin(a)}
            y={CY - 74 * Math.cos(a) + 4.5}
            textAnchor="middle"
            fontSize="13"
            fontFamily="var(--font-cormorant), Georgia, serif"
            fontWeight="600"
            fill="#2A241C"
          >
            {r}
          </text>
        );
      })}

      {/* Kapak penceresi: arkada monogram, önde iki demir kanat */}
      <circle cx={CX} cy={CY} r="41" fill="url(#kule-brass)" />
      <g clipPath="url(#kule-window)">
        <circle cx={CX} cy={CY} r="38" fill="#14110D" />
        <text
          x={CX}
          y={CY + 6}
          textAnchor="middle"
          fontSize={monogram.length > 3 ? 19 : 26}
          fontStyle="italic"
          fontFamily="var(--font-cormorant), Georgia, serif"
          fill="#F0D08A"
        >
          {monogram}
        </text>
        <motion.g initial={false} animate={{ x: -leaf }} transition={leafTransition}>
          <rect x={CX - 40} y={CY - 40} width="40" height="80" fill="url(#kule-iron)" />
          <line x1={CX - 0.5} y1={CY - 40} x2={CX - 0.5} y2={CY + 40} stroke="#C99B48" strokeWidth="1" />
          <circle cx={CX - 26} cy={CY - 18} r="1.6" fill="#C99B48" />
          <circle cx={CX - 26} cy={CY + 18} r="1.6" fill="#C99B48" />
        </motion.g>
        <motion.g initial={false} animate={{ x: leaf }} transition={leafTransition}>
          <rect x={CX} y={CY - 40} width="40" height="80" fill="url(#kule-iron)" />
          <circle cx={CX + 26} cy={CY - 18} r="1.6" fill="#C99B48" />
          <circle cx={CX + 26} cy={CY + 18} r="1.6" fill="#C99B48" />
        </motion.g>
      </g>

      {/* Akrep ve yelkovan */}
      <g ref={hourRef} transform={`rotate(${hourDeg.toFixed(2)} ${CX} ${CY})`}>
        <path d={`M${CX - 4} ${CY + 12} L${CX - 2.4} ${CY - 50} L${CX} ${CY - 58} L${CX + 2.4} ${CY - 50} L${CX + 4} ${CY + 12} Z`} fill="#1C1915" />
        <circle cx={CX} cy={CY - 44} r="4" fill="none" stroke="#1C1915" strokeWidth="2" />
      </g>
      <g ref={minuteRef} transform={`rotate(${minuteDeg.toFixed(2)} ${CX} ${CY})`}>
        <path d={`M${CX - 2.6} ${CY + 16} L${CX - 1.4} ${CY - 80} L${CX} ${CY - 88} L${CX + 1.4} ${CY - 80} L${CX + 2.6} ${CY + 16} Z`} fill="#1C1915" />
      </g>
      <circle cx={CX} cy={CY} r="5.5" fill="url(#kule-brass)" stroke="#1C1915" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */

function KuleHero({ invitation, scrollContainer, mode }: HeroRenderProps & { mode: Mode }) {
  const d = useHeroData(invitation);
  const animated = useAnimated(mode);
  const target = weddingMinutes(d.date.hour, d.date.minute);
  const train = useMemo(() => buildTrain(), []);
  const monogram = useMemo(() => initials(d.people), [d.people]);

  const gearRefs = useRef(new Map<string, SVGGElement>());
  const hourRef = useRef<SVGGElement | null>(null);
  const minuteRef = useRef<SVGGElement | null>(null);
  const pendulumRef = useRef<SVGGElement | null>(null);

  // Saat = açılıştaki hızlı sarma + misafirin kurması + kaydırma.
  const intro = useMotionValue(animated ? target - LEAD_MIN : target);
  const wind = useMotionValue(0);
  const { scrollY } = useScroll({ container: scrollContainer });
  const exit = useTransform(scrollY, (y) => Math.min(1, Math.max(0, y / (scrollContainer?.current?.clientHeight || 1))));
  const clock = useTransform([intro, wind, exit], ([a, w, e]: number[]) => a + w + e * SCROLL_MIN);

  const [opened, setOpened] = useState(!animated);
  const [strikes, setStrikes] = useState(0);

  useEffect(() => {
    if (!animated) {
      intro.set(target);
      setOpened(true);
      return;
    }
    intro.set(target - LEAD_MIN);
    setOpened(false);
    const controls = animate(intro, target, { duration: 3.4, delay: 0.7, ease: [0.5, 0, 0.3, 1] });
    // Emniyet: kare döngüsü kısılsa bile isimler en geç 5,5 sn'de çıkar.
    const guard = window.setTimeout(() => setOpened(true), 5500);
    return () => {
      controls.stop();
      window.clearTimeout(guard);
    };
  }, [animated, intro, target]);

  // Saat düğün saatini vurduğu an: kapak açılır, isimler çıkar (bir kez).
  useMotionValueEvent(clock, 'change', (m) => {
    if (!opened && m >= target - 0.01) {
      setOpened(true);
      setStrikes((s) => s + 1);
    }
  });

  // Kareyi çiz: dişliler/akrep/yelkovan saatten, sarkaç gerçek zamandan.
  const apply = useCallback(
    (m: number, t: number) => {
      const drv = m * 6;
      for (const g of train) gearRefs.current.get(g.id)?.setAttribute('transform', `rotate(${g.angle(drv).toFixed(2)})`);
      minuteRef.current?.setAttribute('transform', `rotate(${(drv % 360).toFixed(2)} ${CX} ${CY})`);
      hourRef.current?.setAttribute('transform', `rotate(${(((m / 60) % 12) * 30).toFixed(2)} ${CX} ${CY})`);
      const swing = animated ? 9 * Math.sin(t * Math.PI * 1.25) : 0;
      pendulumRef.current?.setAttribute('transform', `rotate(${swing.toFixed(2)} ${CX} ${PIVOT_Y})`);
    },
    [animated, train]
  );

  useEffect(() => {
    if (!animated) {
      apply(clock.get(), 0);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      apply(clock.get(), (now - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [animated, apply, clock]);

  // Gerçek etkileşim: saate dokununca bir saat ileri kurulur, çan vurur.
  const windUp = useCallback(() => {
    if (!animated) return;
    animate(wind, wind.get() + 60, { duration: 1.2, ease: [0.4, 0, 0.2, 1] });
    if (opened) setStrikes((s) => s + 1);
  }, [animated, opened, wind]);

  const reveal = animated
    ? {
        initial: { opacity: 0, y: -46, scale: 0.86, filter: 'blur(6px)' },
        animate: opened ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : undefined,
        transition: { duration: 1.1, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] as const }
      }
    : {};
  const late = animated
    ? {
        initial: { opacity: 0, y: 14 },
        animate: opened ? { opacity: 1, y: 0 } : undefined,
        transition: { duration: 0.9, delay: 1.2 }
      }
    : {};

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-5 pt-10 pb-20 text-center">
      <motion.p
        initial={animated ? { opacity: 0, letterSpacing: '0.7em' } : false}
        animate={{ opacity: 1, letterSpacing: '0.42em' }}
        transition={{ duration: 1.4 }}
        className="text-[10px] sm:text-[11px] uppercase text-[#D9AE5E]"
      >
        {d.title || KULE_FLAVOR.tagline}
      </motion.p>

      <motion.button
        type="button"
        onClick={windUp}
        disabled={!animated}
        aria-label="Saati bir saat ileri kur"
        initial={animated ? { opacity: 0, y: 30, scale: 0.94 } : false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileTap={animated ? { scale: 0.98 } : undefined}
        transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
        className="mt-5 w-[min(68cqw,300px)] cursor-pointer disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C99B48]/60 rounded-2xl drop-shadow-[0_24px_40px_rgba(0,0,0,0.6)]"
      >
        <Tower
          minutes={animated ? target - LEAD_MIN : target}
          animated={animated}
          opened={opened}
          strikes={strikes}
          monogram={monogram}
          gearRefs={gearRefs}
          hourRef={hourRef}
          minuteRef={minuteRef}
          pendulumRef={pendulumRef}
          train={train}
        />
      </motion.button>
      {animated && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: opened ? 0.75 : 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-2 text-[10px] tracking-[0.3em] uppercase text-[#9C917B]"
        >
          Saati kurmak için dokunun
        </motion.p>
      )}

      <motion.h1
        {...reveal}
        className={`mt-5 font-cormorant italic font-medium leading-[0.98] text-[#F3E6C6] text-[clamp(2.4rem,11cqw,4.8rem)] break-words max-w-full ${GLOW}`}
      >
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && <span className="block my-1 text-[0.42em] not-italic text-[#D9AE5E]">&amp;</span>}
              <span className="block">{p}</span>
            </React.Fragment>
          ))
        ) : (
          <span className="block">{NO_NAMES}</span>
        )}
      </motion.h1>

      <motion.div {...late} className="flex flex-col items-center">
        {d.date.day && (
          <p className={`mt-5 font-cormorant text-2xl text-[#F3E6C6] ${GLOW}`}>
            {d.date.weekday && <span className="block text-[11px] tracking-[0.35em] uppercase text-[#C9BDA2] mb-1">{d.date.weekday}</span>}
            {d.date.day}
            {d.date.time && ` · ${d.date.time}`}
          </p>
        )}
        {d.venue && <p className="mt-2 text-sm text-[#C9BDA2]">{d.venue}</p>}
        <HeroCountdown
          invitation={invitation}
          className="mt-6"
          numberClassName={`font-cormorant text-[#F0D08A] ${GLOW}`}
          labelClassName="text-[#A89C82]"
        />
        {d.subtitle && <p className="mt-6 max-w-md font-cormorant italic text-lg text-[#E3D7BC]">{d.subtitle}</p>}
      </motion.div>
    </div>
  );
}

/**
 * DugunKuleSaati — "Kule Saati": SVG bir kule saati. Dişli takımı gerçek
 * oranlarla döner (kavrayan çarklar ters yönde, diş sayısı oranında), sarkaç
 * salınır. Açılışta saat düğün saatine doğru hızla ilerler; o saati vurduğunda
 * kadranın ortasındaki demir kapak açılır, monogram görünür ve isimler
 * saatten aşağı çıkar. Kaydırdıkça zaman ileri sarar; saate dokunmak onu bir
 * saat ileri kurar. Önizleme / azaltılmış hareket: rAF yok, son kare çizilir.
 */
export function DugunKuleSaati({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={KULE_FLAVOR}
      mode={mode}
      themeOverride={KULE_TEMASI}
      renderBackdrop={(state) => <KuleBackdrop {...state} />}
      renderHero={(props) => <KuleHero {...props} mode={mode} />}
    />
  );
}
