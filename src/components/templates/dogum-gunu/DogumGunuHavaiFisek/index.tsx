import React, { useMemo } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { videoSet } from '../../shared/videoAssets';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { CinemaBackdrop, DateCountdown, ScrollCue, SplitReveal, TapBurst, useTemplateFont } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import type { Invitation } from '../../../../types';
import { DOGUM_GUNU_FLAVOR } from '../flavors';

const VIDEO = videoSet('dogum-gunu-havai-fisek', { landscape: '50% 40%', portrait: '50% 45%' });
const FONT = 'Syne:wght@500..800';
const DISPLAY = "[font-family:'Syne',var(--font-sans),sans-serif]";

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#05040F] [&_.font-serif]:[font-family:'Syne',var(--font-sans),sans-serif] [&_.font-serif]:font-bold",
  page: 'text-[#EEEAFB]',
  surface: 'bg-[#100C2A]/70 backdrop-blur-md shadow-[0_0_60px_-26px_rgba(255,120,200,0.5)]',
  border: 'border-[#B9A4FF]/20',
  heading: 'text-[#FFFFFF]',
  body: 'text-[#B9B2D6]',
  accent: 'text-[#FFC86B]',
  accentBg: 'bg-[#FF5FA2]',
  accentSoft: 'bg-[#FF5FA2]/12',
  input:
    'w-full bg-[#0A0820]/75 border border-[#B9A4FF]/25 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-[#7E77A3] focus:outline-none focus:border-[#FFC86B] focus:ring-2 focus:ring-[#FFC86B]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(90deg,#FFC86B,#FF5FA2_55%,#9B7BFF)] hover:brightness-110 text-[#1A0B1F] shadow-lg shadow-[#FF5FA2]/30',
  buttonGhost: 'border border-[#B9A4FF]/35 text-[#EEEAFB] hover:bg-white/5',
  divider: 'bg-[#B9A4FF]/18',
  timelineLine: 'from-[#FFC86B]/80 via-[#FF5FA2]/45 to-transparent',
  envelope: {
    paper: 'bg-[#1A1440]',
    flap: 'bg-[#241A55]',
    seal: 'bg-[#FFC86B] text-[#1A0B1F]',
    glow: 'bg-[#FF5FA2]/30',
    card: 'bg-[#FFF8EE] border border-[#FFC86B]/40'
  },
  mapHeader: 'bg-[#100C2A]',
  footer: { names: 'text-[#B9B2D6]', branding: 'text-[#7E77A3]' }
};

const FLAVOR: TemplateFlavor = {
  ...DOGUM_GUNU_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Gökyüzü bu gece senin için yanıyor',
  headings: { timeline: 'Gecenin Programı', details: 'Kutlama Yeri', gallery: 'Yılın Kareleri', gift: 'Hediye', rsvp: 'Geliyor musun?' }
};

/**
 * Yaş, başlıkta ya da alt metinde geçen ilk 1–3 basamaklı sayıdır ("30. Yaş").
 * Ayrı bir alan yok; bulunmazsa yaş rakamı gösterilmez, tempo orta kalır.
 */
function ageOf(invitation: Invitation): number | null {
  const m = /(?:^|\D)(\d{1,3})(?:\D|$)/.exec(`${invitation.title} ${invitation.subtitle}`);
  if (!m) return null;
  const n = Number(m[1]);
  return n > 0 && n < 130 ? n : null;
}

/** Yaşa göre renk ve tempo: altın açıyla dönen ana ton, büyüdükçe sıklaşan patlamalar. */
function fireworkStyle(age: number | null) {
  const hue = age === null ? 330 : (age * 137.508) % 360;
  const colors = [0, 40, 180, 300].map((o) => `hsl(${(hue + o) % 360} 100% ${o === 180 ? 80 : 68}%)`);
  const interval = age === null ? 2.4 : Math.max(1.1, 3 - Math.min(age, 60) / 30);
  return { colors, interval };
}

/** Açılış sayımı: 3 · 2 · 1 — ardından ilk büyük patlama. */
function Sayim() {
  const steps = ['3', '2', '1'];
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (i >= steps.length) return;
    const id = window.setTimeout(() => setI((v) => v + 1), 520);
    return () => window.clearTimeout(id);
  }, [i, steps.length]);
  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[100svh] z-10 overflow-hidden flex items-center justify-center pointer-events-none">
      <AnimatePresence>
        {i < steps.length && (
          <motion.span
            key={steps[i]}
            className={`${DISPLAY} font-extrabold text-[30vmin] leading-none text-white/90 [text-shadow:0_0_40px_rgba(255,200,107,0.8)]`}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {steps[i]}
          </motion.span>
        )}
      </AnimatePresence>
      {i >= steps.length && (
        <motion.span
          className="absolute w-24 h-24 rounded-full bg-[radial-gradient(circle,#FFF4D6,rgba(255,200,107,0.5)_40%,transparent_70%)]"
          initial={{ scale: 0.2, opacity: 1 }}
          animate={{ scale: 14, opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      )}
    </div>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONT);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const live = mode === 'live' && !reduced;
  const age = ageOf(invitation);
  const style = useMemo(() => fireworkStyle(age), [age]);
  const t0 = live ? 1.8 : 0;
  const fade = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: t0 + delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className="relative grow flex flex-col">
      {live && <Sayim />}
      <div className="relative min-h-[100svh] @container flex flex-col items-center justify-start px-6 pt-[16svh] pb-24 text-center" dir="auto">
        <TapBurst
          enabled={mode === 'live'}
          autoBursts={style.interval}
          style={{ colors: style.colors, count: 46, speed: 230, gravity: 90, life: 1.6, size: 2.2, trail: true }}
        />
        <motion.p {...fade(0)} className={`${DISPLAY} font-semibold text-[10px] sm:text-xs tracking-[0.45em] uppercase text-[#FFC86B]`}>
          {d.title || 'Doğum Günü Kutlaması'}
        </motion.p>
        {age !== null && (
          <motion.div
            aria-hidden="true"
            className={`${DISPLAY} font-extrabold leading-[0.85] text-[clamp(6rem,34cqw,15rem)] tracking-[-0.06em] bg-[linear-gradient(0deg,#FFC86B_0%,#FF5FA2_18%,#9B7BFF_33%,transparent_45%)] bg-[length:100%_300%] bg-clip-text text-transparent [-webkit-text-stroke:1.5px_rgba(255,236,200,0.7)]`}
            initial={reduced ? false : { backgroundPosition: '0% 0%', scale: 0.85, opacity: 0 }}
            animate={{ backgroundPosition: '0% 100%', scale: 1, opacity: 1 }}
            transition={{ delay: t0, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {age}
          </motion.div>
        )}
        <h1 className={`mt-3 ${DISPLAY} font-bold leading-[1] tracking-[-0.02em] text-[clamp(2.4rem,11cqw,5.6rem)] text-white max-w-full break-words [text-shadow:0_0_30px_rgba(155,123,255,0.5),0_4px_20px_rgba(0,0,0,0.6)]`}>
          {(d.hasNames ? d.people : [NO_NAMES]).map((p, i) => (
            <span key={p + i} className="block">
              {i > 0 && <span className="block text-[0.35em] font-medium text-[#FFC86B] my-1">&amp;</span>}
              <SplitReveal text={p} style="scale" delay={t0 + 0.5 + i * 0.4} stagger={0.04} duration={0.7} />
            </span>
          ))}
        </h1>
        <motion.p {...fade(1.3)} className="mt-5 text-base sm:text-lg text-[#DAD3F5] max-w-md">
          {d.subtitle || FLAVOR.tagline}
        </motion.p>
        {(d.date.day || d.venue) && (
          <motion.p {...fade(1.6)} className={`mt-4 ${DISPLAY} text-xs tracking-[0.25em] uppercase text-[#B9B2D6]`}>
            {[d.date.day, d.date.time, d.venue].filter(Boolean).join('  ·  ')}
          </motion.p>
        )}
        {live && (
          <motion.p {...fade(2.2)} className="mt-5 text-[10px] tracking-[0.3em] uppercase text-[#8E86B8]">
            Gökyüzüne dokunun
          </motion.p>
        )}
        <ScrollCue delay={t0 + 2.4} className="text-[#FFC86B]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Büyük geceye"
        classes={{
          root: 'min-h-[80svh]',
          eyebrow: `${DISPLAY} text-[#FFC86B]`,
          date: `${DISPLAY} font-extrabold tracking-[-0.03em] text-[clamp(2.8rem,12cqw,5.6rem)] leading-none text-white`,
          meta: 'text-[#B9B2D6]',
          cell: 'rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-2 py-3',
          number: `${DISPLAY} font-bold text-white`,
          label: 'text-[#8E86B8]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

/**
 * DogumGunuHavaiFisek — "Havai Fişek": gece şehir silüeti üzerinde patlayan
 * fişekler, körfez suyunda dalgalı yansımaları (kodla üretilmiş video). Video
 * üstünde gerçek zamanlı ışık kompozisyonu: açılışta 3·2·1 sayımı ve flaş,
 * ardından yaşa göre renk ve tempoda kendiliğinden, dokununca da patlayan
 * kuyruklu fişekler. Yaş rakamı başlıktan okunur ve alttan ateşlenerek dolar.
 */
export function DogumGunuHavaiFisek({ invitation, mode = 'preview' }: TemplateProps) {
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
          base="linear-gradient(180deg, #04030F 0%, #0D0A2A 55%, #2A1640 75%, #04030B 100%)"
          dimRgb="5,4,15"
          dim={0.55}
          zoom={1.06}
        />
      )}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
