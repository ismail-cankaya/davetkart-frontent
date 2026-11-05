import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { DateCountdown, ScrollCue, useTemplateFont } from '../../shared/sinema';
import { GyroButton, useDeviceMotion } from '../../shared/three';
import { displayText } from '../../utils';
import { TemplateProps } from '../../types';
import { DOGUM_GUNU_FLAVOR } from '../flavors';
import { CAPSULE_COLORS, createMachine, type Machine } from './makineMotoru';

const FONTS = 'Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700';
const BALOO = "[font-family:'Baloo_2',ui-rounded,var(--font-sans),sans-serif]";
const NUNITO = "[font-family:'Nunito',var(--font-sans),sans-serif]";
const TOTAL = 18;

const THEME: SectionTheme = {
  id: 'stone',
  base: "bg-[#FFF4E4] [&_.font-serif]:[font-family:'Baloo_2',ui-rounded,var(--font-sans),sans-serif] [&_.font-serif]:font-bold",
  page: 'text-[#3B2A3F]',
  surface: 'bg-white/90 shadow-[0_14px_0_-6px_rgba(232,52,78,0.15),0_20px_40px_-24px_rgba(59,42,63,0.35)]',
  border: 'border-[#F3D9C4]',
  heading: 'text-[#2E1F33]',
  body: 'text-[#6E5A70]',
  accent: 'text-[#E8344E]',
  accentBg: 'bg-[#E8344E]',
  accentSoft: 'bg-[#E8344E]/10',
  input:
    'w-full bg-white border-2 border-[#F3D9C4] rounded-2xl px-3.5 py-2.5 text-sm text-[#2E1F33] placeholder:text-[#B9A3AE] focus:outline-none focus:border-[#E8344E] focus:ring-2 focus:ring-[#E8344E]/20 transition-all duration-300',
  buttonPrimary: 'bg-[#E8344E] hover:bg-[#D42840] text-white shadow-[0_5px_0_#A81C30] active:translate-y-[3px] active:shadow-[0_2px_0_#A81C30]',
  buttonGhost: 'border-2 border-[#F3D9C4] text-[#3B2A3F] hover:bg-white',
  divider: 'bg-[#F3D9C4]',
  timelineLine: 'from-[#E8344E]/80 via-[#FFC83D]/60 to-transparent',
  envelope: {
    paper: 'bg-[#FFDCE2]',
    flap: 'bg-[#FFC9D2]',
    seal: 'bg-[#E8344E] text-white',
    glow: 'bg-[#FFC83D]/40',
    card: 'bg-white border border-[#F3D9C4]'
  },
  mapHeader: 'bg-[#FFE9D6]',
  footer: { names: 'text-[#6E5A70]', branding: 'text-[#B9A3AE]' }
};

const FLAVOR: TemplateFlavor = {
  ...DOGUM_GUNU_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Pasta, oyun ve bolca kahkaha!',
  headings: { timeline: 'Parti Programı', details: 'Parti Nerede?', gallery: 'Anılar', gift: 'Hediye Fikirleri', rsvp: 'Geliyor musun?' }
};

interface Prize {
  key: string;
  icon: string;
  label: string;
  value: string;
}

/** Kapsülden çıkan kart. */
function PrizeCard({ prize, color }: { prize: Prize; color: number }) {
  const [main, light] = CAPSULE_COLORS[color % CAPSULE_COLORS.length];
  return (
    <div className="rounded-2xl bg-white px-4 py-3 shadow-[0_6px_0_-2px_rgba(59,42,63,0.08),0_14px_28px_-18px_rgba(59,42,63,0.45)] border-2 flex items-center gap-3 text-left" style={{ borderColor: light }}>
      <span className="grid place-items-center w-10 h-10 shrink-0 rounded-full text-lg" style={{ background: light, color: main }} aria-hidden="true">
        {prize.icon}
      </span>
      <span className="min-w-0">
        <span className={`${BALOO} block text-[11px] font-bold tracking-[0.18em] uppercase`} style={{ color: main }}>
          {prize.label}
        </span>
        <span className={`${NUNITO} block text-[15px] font-bold text-[#2E1F33] leading-snug break-words`}>{prize.value}</span>
      </span>
    </div>
  );
}

/** Çıkan kapsül: hazneye düşer, zıplar; dokununca açılır. */
function DroppedCapsule({ color, onOpen }: { color: number; onOpen: () => void }) {
  const [main, light] = CAPSULE_COLORS[color];
  const [opening, setOpening] = useState(false);
  return (
    <motion.button
      type="button"
      aria-label="Kapsülü aç"
      onClick={() => {
        if (opening) return;
        setOpening(true);
        window.setTimeout(onOpen, 380);
      }}
      className="absolute left-1/2 bottom-[6px] -translate-x-1/2 w-12 h-12 rounded-full"
      initial={{ y: -70, scale: 0.6 }}
      animate={{ y: [-70, 0, -16, 0, -5, 0], scale: 1 }}
      transition={{ duration: 0.9, times: [0, 0.4, 0.6, 0.78, 0.9, 1], ease: 'easeOut' }}
    >
      <motion.span
        className="absolute inset-x-0 top-0 h-1/2 rounded-t-full"
        style={{ background: `linear-gradient(180deg, ${light}, ${main})` }}
        animate={opening ? { y: -26, rotate: -35, opacity: 0 } : { y: 0, rotate: 0 }}
        transition={{ duration: 0.45 }}
      />
      <motion.span
        className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-full bg-white border-t border-black/10"
        animate={opening ? { y: 18, rotate: 25, opacity: 0 } : { y: 0 }}
        transition={{ duration: 0.45 }}
      />
      {!opening && <span className="absolute inset-0 rounded-full ring-4 ring-white/70 animate-pulse" aria-hidden="true" />}
    </motion.button>
  );
}

function Machine({ prizes, live, still, onPrize }: { prizes: Prize[]; live: boolean; still: boolean; onPrize: (color: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const machine = useRef<Machine | null>(null);
  const [turns, setTurns] = useState(0);
  const [pending, setPending] = useState<{ id: number; color: number } | null>(null);
  const [given, setGiven] = useState(0);
  const motionState = useDeviceMotion(live && !still);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const m = createMachine(canvas, {
      animate: live && !still,
      total: TOTAL,
      onDispense: (color) => setPending({ id: Date.now(), color })
    });
    machine.current = m;
    return () => {
      m.destroy();
      machine.current = null;
    };
  }, [live, still]);

  // Telefonun eğimi fanustaki yerçekimini çevirir (sensör yoksa düz aşağı).
  useEffect(() => {
    if (!live || still) return;
    const id = window.setInterval(() => {
      const s = motionState.current;
      if (s.live) machine.current?.setGravity(s.gx, Math.max(0.15, s.gy));
    }, 60);
    return () => window.clearInterval(id);
  }, [live, still, motionState]);

  const done = given >= prizes.length;
  const crank = () => {
    if (pending || done) return;
    setTurns((t) => t + 1);
    window.setTimeout(() => machine.current?.crank(), 280);
  };

  return (
    <div className="relative w-[min(78vw,330px)] mx-auto select-none">
      {/* Fanus */}
      <div className="relative aspect-square">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.85),rgba(255,255,255,0.25)_35%,rgba(210,236,255,0.18)_70%,rgba(160,200,230,0.3))] border-[6px] border-white/80 shadow-[inset_0_-12px_30px_rgba(120,160,200,0.25),0_10px_30px_-10px_rgba(59,42,63,0.3)]" />
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-[6px] w-[calc(100%-12px)] h-[calc(100%-12px)] rounded-full" />
        {/* Cam parlaması önde */}
        <div aria-hidden="true" className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_30%_18%_at_32%_22%,rgba(255,255,255,0.75),transparent)] pointer-events-none" />
        {/* Tepe kapağı */}
        <div aria-hidden="true" className="absolute left-1/2 -top-3 -translate-x-1/2 w-[34%] h-7 rounded-t-[18px] bg-[linear-gradient(180deg,#FF5A70,#C9213A)] shadow-md" />
        <div aria-hidden="true" className="absolute left-1/2 -top-6 -translate-x-1/2 w-5 h-5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#FFFFFF,#D0D6DE_60%,#8E99A6)]" />
      </div>
      {/* Gövde */}
      <div className="relative -mt-4 mx-auto w-[82%] rounded-b-[36px] rounded-t-[22px] bg-[linear-gradient(180deg,#FF5A70_0%,#E8344E_40%,#B81E36_100%)] pt-6 pb-4 shadow-[inset_0_6px_0_rgba(255,255,255,0.25),0_18px_30px_-14px_rgba(168,28,48,0.7)]">
        <div className="flex items-end justify-between px-5">
          {/* Kol */}
          <motion.button
            type="button"
            onClick={crank}
            disabled={!live || done || pending !== null}
            aria-label="Kolu çevir, kapsül çıkar"
            className="relative w-16 h-16 rounded-full bg-[radial-gradient(circle_at_35%_35%,#FFFFFF,#D7DDE5_55%,#8E99A6)] shadow-[0_4px_0_#6D7783,0_10px_18px_-6px_rgba(0,0,0,0.5)] disabled:cursor-not-allowed enabled:cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#FFC83D]"
            animate={{ rotate: turns * 360 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <span aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-3.5 rounded-full bg-[linear-gradient(180deg,#F4F6F9,#9AA4B0)] shadow" />
          </motion.button>
          {/* Hazne */}
          <div className="relative w-20 h-[70px] rounded-2xl bg-[#7E1426] shadow-[inset_0_6px_14px_rgba(0,0,0,0.5)] overflow-visible">
            <div aria-hidden="true" className="absolute inset-x-2 top-2 h-3 rounded-full bg-black/30" />
            <AnimatePresence>
              {pending && (
                <DroppedCapsule
                  key={pending.id}
                  color={pending.color}
                  onOpen={() => {
                    onPrize(pending.color);
                    setGiven((n) => n + 1);
                    setPending(null);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className={`${BALOO} mt-3 text-center text-[12px] font-bold tracking-[0.2em] uppercase text-white/90`}>
          {!live ? 'Sürpriz Makinesi' : done ? 'Hepsi açıldı!' : pending ? 'Kapsüle dokun!' : 'Kolu çevir'}
        </p>
      </div>
      {/* Ayak */}
      <div aria-hidden="true" className="mx-auto w-[56%] h-5 rounded-b-2xl bg-[linear-gradient(180deg,#C9213A,#8E1428)]" />
    </div>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONTS);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const live = mode === 'live';
  const still = reduced || !live;
  const fade = (delay: number) =>
    still ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } };

  const prizes = useMemo<Prize[]>(() => {
    const first = invitation.timelineEvents.find((e) => displayText(e.title));
    const list: Prize[] = [
      { key: 'tarih', icon: '📅', label: 'Tarih', value: [d.date.dayMonth || d.date.day, d.date.weekday].filter(Boolean).join(', ') },
      { key: 'saat', icon: '⏰', label: 'Saat', value: d.date.time },
      { key: 'yer', icon: '📍', label: 'Yer', value: d.venue },
      { key: 'program', icon: '🎈', label: 'Programda', value: first ? [first.time, displayText(first.title)].filter(Boolean).join(' · ') : '' },
      { key: 'surpriz', icon: '🎁', label: 'Sürpriz', value: d.subtitle || FLAVOR.tagline }
    ];
    return list.filter((p) => p.value);
  }, [d, invitation.timelineEvents]);

  const [opened, setOpened] = useState<{ prize: Prize; color: number }[]>([]);
  // Önizleme ve hareketi azalt: bütün kartlar baştan açık.
  const shown = live && !reduced ? opened : prizes.map((p, i) => ({ prize: p, color: i }));
  const name = d.hasNames ? d.people.join(' & ') : NO_NAMES;

  return (
    <div className="relative grow flex flex-col">
      <div className="relative min-h-[100svh] flex flex-col items-center px-5 pt-12 pb-24 text-center" dir="auto">
        <motion.p {...fade(0.1)} className={`${BALOO} text-xs font-bold tracking-[0.3em] uppercase text-[#E8344E]`}>
          {d.title || 'Doğum Günü Partisi'}
        </motion.p>
        <motion.h1 {...fade(0.2)} className={`${BALOO} mt-1 font-extrabold leading-[0.95] text-[clamp(2.6rem,12cqw,4.6rem)] text-[#2E1F33] break-words max-w-full [text-shadow:0_4px_0_#FFC83D]`}>
          {name}
        </motion.h1>
        <motion.p {...fade(0.35)} className={`${NUNITO} mt-2 mb-6 text-[15px] font-semibold text-[#6E5A70]`}>
          {live && !reduced ? 'Kolu çevir, kapsülleri aç, partiyi keşfet!' : 'Sürpriz makinesinden çıkanlar:'}
        </motion.p>

        <motion.div initial={still ? false : { opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}>
          <Machine prizes={prizes} live={live && !reduced} still={still} onPrize={(color) => setOpened((o) => (o.length < prizes.length ? [...o, { prize: prizes[o.length], color }] : o))} />
        </motion.div>
        {live && !reduced && <GyroButton className="mt-4 bg-white/80 text-[#6E5A70] border border-[#F3D9C4]" label="Telefonu eğerek kapsülleri yuvarla" />}

        <div className="mt-6 w-full max-w-[360px] space-y-2.5" aria-live="polite">
          <AnimatePresence>
            {shown.map(({ prize, color }) => (
              <motion.div key={prize.key} initial={still ? false : { opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                <PrizeCard prize={prize} color={color} />
              </motion.div>
            ))}
          </AnimatePresence>
          {live && !reduced && opened.length < prizes.length && (
            <button
              type="button"
              onClick={() => setOpened(prizes.map((p, i) => opened[i] ?? { prize: p, color: i }))}
              className={`${NUNITO} mx-auto block rounded-full px-4 py-2 min-h-11 text-sm font-semibold text-[#6E5A70] underline decoration-dotted underline-offset-4 hover:text-[#E8344E]`}
            >
              Hepsini birden göster
            </button>
          )}
        </div>
        <ScrollCue delay={still ? 0 : 1.4} className="text-[#E8344E]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Partiye kalan"
        classes={{
          root: 'min-h-[70svh]',
          eyebrow: 'text-[#E8344E]',
          date: `${BALOO} font-extrabold text-[clamp(2.6rem,11cqw,5rem)] leading-none text-[#2E1F33] [text-shadow:0_4px_0_#FFC83D]`,
          meta: 'text-[#6E5A70]',
          cell: 'rounded-2xl bg-white border-2 border-[#F3D9C4] px-2 py-3',
          number: `${BALOO} font-bold text-[#2E1F33]`,
          label: 'text-[#B9A3AE]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

/** Krem zemin, renkli puantiye ve yavaş dönen serpme konfeti. */
function Backdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-[#FFF4E4] overflow-hidden">
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle,#FFD1DC_2.5px,transparent_3px),radial-gradient(circle,#D4F0FF_2.5px,transparent_3px)] bg-[length:44px_44px,44px_44px] bg-[position:0_0,22px_22px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(255,244,228,0.95),transparent)]" />
    </div>
  );
}

/**
 * DogumGunuSurprizMakinesi — "Sürpriz Makinesi": retro bir kapsül makinesi.
 * Fanustaki kapsüller gerçek zamanlı 2B fizikle çarpışır; telefon eğilince
 * yerçekimi döner, kapsüller yuvarlanır. Kol çevrilince makine sarsılır,
 * bir kapsül hazneye düşer; dokununca açılır ve partinin bir bilgisini
 * (tarih, saat, yer, program, sürpriz) kart olarak verir.
 */
export function DogumGunuSurprizMakinesi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={FLAVOR}
      mode={mode}
      themeOverride={THEME}
      renderBackdrop={() => <Backdrop />}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
