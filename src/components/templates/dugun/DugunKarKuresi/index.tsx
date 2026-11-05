import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';

const KAR_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0F1B2E] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#EEF3FA]',
  surface: 'bg-[#1A2C47]/75 backdrop-blur-md shadow-[0_0_40px_-18px_rgba(200,220,255,0.4)]',
  border: 'border-[#C9D8EE]/25',
  heading: 'text-[#EEF3FA]',
  body: 'text-[#BCCAE0]',
  accent: 'text-[#D9B97A]',
  accentBg: 'bg-[#D9B97A]',
  accentSoft: 'bg-[#D9B97A]/10',
  input:
    'w-full bg-[#0F1B2E]/70 border border-[#C9D8EE]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#EEF3FA] placeholder:text-[#8494AE] focus:outline-none focus:border-[#D9B97A] focus:ring-2 focus:ring-[#D9B97A]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#E8CD94,#C29A55)] hover:brightness-110 text-[#0F1B2E] shadow-lg shadow-[#D9B97A]/25',
  buttonGhost: 'border border-[#C9D8EE]/40 text-[#EEF3FA] hover:bg-white/10',
  divider: 'bg-[#C9D8EE]/20',
  timelineLine: 'from-[#D9B97A]/80 via-[#C9D8EE]/40 to-transparent',
  envelope: {
    paper: 'bg-[#1A2C47]',
    flap: 'bg-[#22385A]',
    seal: 'bg-[#D9B97A] text-[#0F1B2E]',
    glow: 'bg-[#C9D8EE]/30',
    card: 'bg-[#F8FAFD] border border-[#D9B97A]/50'
  },
  mapHeader: 'bg-[#1A2C47]',
  footer: { names: 'text-[#BCCAE0]', branding: 'text-[#8494AE]' }
};

const KAR_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Bir kış masalında, birlikte',
  headings: {
    timeline: 'Masalın Akışı',
    details: 'Köşke Giden Yol',
    gallery: 'Kardan Kareler',
    gift: 'Hediye & Takı',
    rsvp: 'Masalımıza Katılın'
  }
};

const TANELER = Array.from({ length: 34 }, (_, i) => ({
  x: (i * 29 + 7) % 96,
  y: (i * 47 + 13) % 90,
  r: 2 + (i % 3),
  sure: 5 + (i % 5),
  gec: -((i * 0.9) % 6)
}));

const CSS = `
@keyframes kk-fall{from{transform:translate(0,-12cqw)}to{transform:translate(var(--sx,0px),105cqw)}}
.kk-run .kk-flake{animation:kk-fall var(--t,6s) linear infinite;animation-delay:var(--d,0s)}
@media (prefers-reduced-motion:reduce){.kk-run .kk-flake{animation:none}}
`;

type VarStyle = React.CSSProperties & Record<`--${string}`, string>;

function Kosk() {
  return (
    <svg viewBox="0 0 120 80" className="absolute bottom-[14%] left-1/2 -translate-x-1/2 w-[46%]" aria-hidden="true">
      <path d="M0 80 C 20 66, 100 66, 120 80 Z" fill="#F4F7FB" />
      <rect x="34" y="40" width="52" height="30" fill="#1C2F4C" />
      <path d="M28 42 L 60 18 L 92 42 Z" fill="#14233A" />
      <path d="M56 18 L 60 6 L 64 18 Z" fill="#D9B97A" />
      <rect x="54" y="52" width="12" height="18" rx="6" fill="#FFD98A" />
      <rect x="40" y="48" width="8" height="8" fill="#FFD98A" opacity="0.85" />
      <rect x="72" y="48" width="8" height="8" fill="#FFD98A" opacity="0.85" />
      <path d="M8 74 L 16 50 L 24 74 Z M98 74 L 106 46 L 114 74 Z" fill="#2E4A3A" />
    </svg>
  );
}

function Kure({ hareketli }: { hareketli: boolean }) {
  const [tur, setTur] = useState(0);
  return (
    <button
      type="button"
      onClick={() => hareketli && setTur((t) => t + 1)}
      aria-label="Kar küresini salla"
      className={`relative block w-[min(78vw,300px)] aspect-square [container-type:inline-size] ${hareketli ? 'kk-run cursor-pointer' : 'cursor-default'}`}
    >
      <motion.div
        key={tur}
        initial={hareketli && tur > 0 ? { rotate: -6 } : false}
        animate={{ rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 6 }}
        className="absolute inset-0 rounded-full overflow-hidden border border-white/40 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.28),rgba(120,160,220,0.18)_45%,rgba(15,27,46,0.55)_100%)] shadow-[inset_0_0_40px_rgba(255,255,255,0.18),0_20px_60px_-20px_rgba(200,220,255,0.5)]"
      >
        <Kosk />
        {TANELER.map((t, i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{ left: `${t.x}%`, top: hareketli ? 0 : `${t.y}%` }}
            initial={hareketli && tur > 0 ? { x: ((i % 7) - 3) * 18, y: -((i % 5) * 22) } : false}
            animate={{ x: 0, y: 0 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          >
            <span
              className="kk-flake block rounded-full bg-white/90"
              style={{ width: t.r, height: t.r, '--t': `${t.sure}s`, '--d': `${t.gec}s`, '--sx': `${(i % 5) * 4 - 8}px` } as VarStyle}
            />
          </motion.span>
        ))}
        <span className="absolute left-[18%] top-[12%] w-[22%] h-[12%] rounded-full bg-white/25 blur-md rotate-[-30deg]" />
      </motion.div>
    </button>
  );
}

function satirlar(d: HeroData): { k: string; l: string; v: string }[] {
  const s: { k: string; l: string; v: string }[] = [];
  if (d.date.day) s.push({ k: 'tarih', l: 'Tarih', v: [d.date.dayMonth || d.date.day, d.date.weekday].filter(Boolean).join(' · ') });
  if (d.date.time) s.push({ k: 'saat', l: 'Saat', v: d.date.time });
  if (d.venue) s.push({ k: 'mekan', l: 'Mekân', v: d.venue });
  return s;
}

function KarHero({ invitation, hareketli }: HeroRenderProps & { hareketli: boolean }) {
  const d = useHeroData(invitation);
  const bilgi = useMemo(() => satirlar(d), [d]);
  const belir = (delay: number) =>
    hareketli
      ? { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay } }
      : { initial: false as const };

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-5 pt-14 pb-16 text-center">
      <motion.p {...belir(0.2)} className="mb-6 text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#D9B97A]">
        {d.title || KAR_FLAVOR.tagline}
      </motion.p>
      <Kure hareketli={hareketli} />
      {/* Kaide: adlar burada yazar. */}
      <motion.div
        {...belir(0.6)}
        className="-mt-3 w-[min(86vw,330px)] rounded-b-[40px] rounded-t-xl bg-[linear-gradient(180deg,#5A3A22,#3A2414)] border-t-4 border-[#D9B97A] px-4 py-4 shadow-xl"
      >
        <h1 className="font-cormorant italic font-semibold leading-tight text-[#F3E2BC] text-[clamp(1.5rem,7.5cqw,2.4rem)] break-words">
          {d.hasNames ? d.people.join(' & ') : NO_NAMES}
        </h1>
      </motion.div>
      {hareketli && <p className="mt-3 text-[10px] tracking-[0.3em] uppercase text-[#8494AE]">Küreye dokun, kar savrulsun</p>}

      {bilgi.length > 0 && (
        <dl className="mt-7 w-full max-w-[320px] space-y-2.5">
          {bilgi.map((s, i) => (
            <motion.div key={s.k} {...belir(1 + i * 0.25)} className="flex items-baseline justify-between gap-4 border-b border-[#C9D8EE]/20 pb-2 text-left">
              <dt className="shrink-0 text-[10px] tracking-[0.3em] uppercase text-[#9FB0C8]">{s.l}</dt>
              <dd className="min-w-0 text-right font-cormorant text-lg text-[#EEF3FA] break-words">{s.v}</dd>
            </motion.div>
          ))}
        </dl>
      )}
      <motion.div {...belir(1.8)} className="mt-8">
        <HeroCountdown
          invitation={invitation}
          cellClassName="min-w-[56px] rounded-lg border border-[#C9D8EE]/30 bg-[#1A2C47]/70 px-2 py-1.5"
          numberClassName="font-cormorant text-2xl text-[#F3E2BC]"
          labelClassName="text-[10px] text-[#9FB0C8]"
        />
      </motion.div>
      {d.subtitle && <p className="mt-6 max-w-md font-cormorant italic text-lg text-[#D6DFEC]">{d.subtitle}</p>}
    </div>
  );
}

/**
 * DugunKarKuresi — cam kürede yağan kar ve küçük bir köşk; küreye dokununca kar
 * yeniden savrulur. Adlar kürenin altındaki ahşap kaidede yazar.
 * Önizleme / "hareketi azalt" → kar taneleri sabit durur.
 */
export function DugunKarKuresi({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  const hareketli = mode === 'live' && !reduced;
  return (
    <>
      <style href="dugun-kar-kuresi" precedence="dugun">
        {CSS}
      </style>
      <InvitationComposition
        invitation={invitation}
        flavor={KAR_FLAVOR}
        mode={mode}
        themeOverride={KAR_TEMASI}
        renderBackdrop={() => (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,#22385A_0%,#0F1B2E_60%,#080F1B_100%)]" />
        )}
        renderHero={(props) => <KarHero {...props} hareketli={hareketli} />}
      />
    </>
  );
}
