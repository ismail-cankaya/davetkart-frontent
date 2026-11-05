import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { KINA_FLAVOR } from '../flavors';

const GOLD = '#E3B85C';

const LALE_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#2A0A0E] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#F7E7C8]',
  surface: 'bg-[#4A1219]/70 backdrop-blur-md shadow-[0_0_40px_-18px_rgba(227,184,92,0.45)]',
  border: 'border-[#E3B85C]/30',
  heading: 'text-[#F7E7C8]',
  body: 'text-[#E6CFC4]',
  accent: 'text-[#E3B85C]',
  accentBg: 'bg-[#E3B85C]',
  accentSoft: 'bg-[#E3B85C]/10',
  input:
    'w-full bg-[#2A0A0E]/70 border border-[#E3B85C]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#F7E7C8] placeholder:text-[#B8958A] focus:outline-none focus:border-[#E3B85C] focus:ring-2 focus:ring-[#E3B85C]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#F0CE7E,#C9973C)] hover:brightness-110 text-[#2A0A0E] shadow-lg shadow-[#E3B85C]/25',
  buttonGhost: 'border border-[#E3B85C]/40 text-[#F7E7C8] hover:bg-[#E3B85C]/10',
  divider: 'bg-[#E3B85C]/20',
  timelineLine: 'from-[#E3B85C]/80 via-[#C0283A]/40 to-transparent',
  envelope: {
    paper: 'bg-[#4A1219]',
    flap: 'bg-[#5C1720]',
    seal: 'bg-[#E3B85C] text-[#2A0A0E]',
    glow: 'bg-[#E3B85C]/30',
    card: 'bg-[#FBF3E4] border border-[#E3B85C]/50'
  },
  mapHeader: 'bg-[#4A1219]',
  footer: { names: 'text-[#E6CFC4]', branding: 'text-[#B8958A]' }
};

const LALE_FLAVOR: TemplateFlavor = {
  ...KINA_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Lalelerin arasında, kına gecemize',
  headings: {
    timeline: 'Gecenin Akışı',
    details: 'Bahçeye Giden Yol',
    gallery: 'Lale Kareleri',
    gift: 'Hediye & Takı',
    rsvp: 'Bahçemize Katılın'
  }
};

/** x (%), boy (px), renk, gecikme — deterministik dizilim. */
const LALELER = [
  { x: 6, h: 120, c: '#C0283A', d: 0.1 },
  { x: 17, h: 160, c: GOLD, d: 0.35 },
  { x: 28, h: 105, c: '#9E1B2C', d: 0.2 },
  { x: 72, h: 110, c: '#9E1B2C', d: 0.25 },
  { x: 83, h: 165, c: '#C0283A', d: 0.05 },
  { x: 94, h: 125, c: GOLD, d: 0.4 }
] as const;

const CSS = `
@keyframes kl-sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}
.kl-run .kl-sway{animation:kl-sway 5s ease-in-out infinite;animation-delay:var(--d,0s);transform-origin:50% 100%}
@media (prefers-reduced-motion:reduce){.kl-run .kl-sway{animation:none}}
`;

type VarStyle = React.CSSProperties & Record<`--${string}`, string>;

function Lale({ h, c, d, hareketli }: { h: number; c: string; d: number; hareketli: boolean }) {
  const buyu = hareketli
    ? { initial: { scaleY: 0 }, animate: { scaleY: 1 }, transition: { duration: 1.4, delay: d, ease: [0.22, 1, 0.36, 1] as const } }
    : { initial: false as const };
  const ac = hareketli
    ? { initial: { scale: 0.2, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.9, delay: d + 1.1 } }
    : { initial: false as const };
  return (
    <div className="kl-sway" style={{ '--d': `${-d * 4}s` } as VarStyle}>
      <svg viewBox={`0 0 40 ${h + 40}`} width={40} height={h + 40} aria-hidden="true" className="overflow-visible">
        <motion.g {...buyu} style={{ transformOrigin: `20px ${h + 40}px` }}>
          <path d={`M20 ${h + 40} V 34`} stroke="#3F6B3A" strokeWidth="2.5" />
          <path d={`M20 ${h + 20} C 6 ${h}, 4 ${h - 30}, 8 ${h - 50} C 14 ${h - 30}, 18 ${h - 10}, 20 ${h + 4}`} fill="#4E8045" />
          <path d={`M20 ${h + 30} C 34 ${h + 6}, 36 ${h - 20}, 32 ${h - 36} C 26 ${h - 18}, 22 ${h}, 20 ${h + 14}`} fill="#3F6B3A" />
        </motion.g>
        <motion.g {...ac} style={{ transformOrigin: '20px 30px' }}>
          <path d="M8 14 C 8 30, 14 38, 20 38 C 26 38, 32 30, 32 14 L 26 22 L 20 8 L 14 22 Z" fill={c} />
          <path d="M20 8 L 14 22 C 16 30, 18 34, 20 36 C 22 34, 24 30, 26 22 Z" fill="#000" opacity="0.15" />
          <path d="M8 14 L 14 22 M32 14 L 26 22" stroke={GOLD} strokeWidth="0.8" opacity="0.7" />
        </motion.g>
      </svg>
    </div>
  );
}

function LaleBackdrop({ hareketli }: { hareketli: boolean }) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_50%_20%,#5C1720_0%,#2A0A0E_65%,#170507_100%)] ${hareketli ? 'kl-run' : ''}`}>
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle,#E3B85C_1px,transparent_1.5px)] [background-size:22px_22px]" />
      <div className="absolute bottom-0 inset-x-0 h-[260px]">
        {LALELER.map((l, i) => (
          <div key={i} className="absolute bottom-0 -translate-x-1/2 scale-[0.8] sm:scale-100 origin-bottom" style={{ left: `${l.x}%` }}>
            <Lale h={l.h} c={l.c} d={l.d} hareketli={hareketli} />
          </div>
        ))}
      </div>
    </div>
  );
}

function satirlar(d: HeroData): { k: string; l: string; v: string }[] {
  const s: { k: string; l: string; v: string }[] = [];
  if (d.date.day) s.push({ k: 'tarih', l: 'Tarih', v: [d.date.dayMonth || d.date.day, d.date.weekday].filter(Boolean).join(' · ') });
  if (d.date.time) s.push({ k: 'saat', l: 'Saat', v: d.date.time });
  if (d.venue) s.push({ k: 'mekan', l: 'Mekân', v: d.venue });
  return s;
}

function LaleHero({ invitation, hareketli }: HeroRenderProps & { hareketli: boolean }) {
  const d = useHeroData(invitation);
  const bilgi = useMemo(() => satirlar(d), [d]);
  const belir = (delay: number) =>
    hareketli
      ? { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const } }
      : { initial: false as const };

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-6 pt-16 pb-56 text-center">
      <motion.p {...belir(1.6)} className="text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#E3B85C]">
        {d.title || LALE_FLAVOR.tagline}
      </motion.p>
      <motion.h1
        {...belir(2)}
        className="mt-5 font-cormorant italic font-semibold leading-[1.05] text-[#F7E7C8] text-[clamp(2.4rem,12cqw,4.8rem)] break-words max-w-full"
      >
        {d.hasNames
          ? d.people.map((p, i) => (
              <React.Fragment key={p + i}>
                {i > 0 && <span className="block my-1 text-[0.42em] not-italic text-[#E3B85C]">&amp;</span>}
                <span className="block">{p}</span>
              </React.Fragment>
            ))
          : NO_NAMES}
      </motion.h1>
      {bilgi.length > 0 && (
        <dl className="mt-8 w-full max-w-[300px] space-y-2.5">
          {bilgi.map((s, i) => (
            <motion.div key={s.k} {...belir(2.5 + i * 0.3)} className="flex items-baseline justify-between gap-4 border-b border-[#E3B85C]/25 pb-2 text-left">
              <dt className="shrink-0 text-[10px] tracking-[0.3em] uppercase text-[#D4A9A0]">{s.l}</dt>
              <dd className="min-w-0 text-right font-cormorant text-lg text-[#F7E7C8] break-words">{s.v}</dd>
            </motion.div>
          ))}
        </dl>
      )}
      <motion.div {...belir(3.3)} className="mt-8">
        <HeroCountdown
          invitation={invitation}
          cellClassName="min-w-[56px] rounded-lg border border-[#E3B85C]/30 bg-[#4A1219]/70 px-2 py-1.5"
          numberClassName="font-cormorant text-2xl text-[#F0CE7E]"
          labelClassName="text-[10px] text-[#D4A9A0]"
        />
      </motion.div>
      {d.subtitle && (
        <motion.p {...belir(3.6)} className="mt-6 max-w-md font-cormorant italic text-lg text-[#EAD7CC]">
          {d.subtitle}
        </motion.p>
      )}
    </div>
  );
}

/**
 * KinaLaleBahcesi — kırmızı ve altın laleler SVG ile yükselip açar; adlar ve
 * bilgiler lalelerin arasından belirir. Önizleme / "hareketi azalt" → son kare.
 */
export function KinaLaleBahcesi({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  const hareketli = mode === 'live' && !reduced;
  return (
    <>
      <style href="kina-lale-bahcesi" precedence="kina">
        {CSS}
      </style>
      <InvitationComposition
        invitation={invitation}
        flavor={LALE_FLAVOR}
        mode={mode}
        themeOverride={LALE_TEMASI}
        renderBackdrop={() => <LaleBackdrop hareketli={hareketli} />}
        renderHero={(props) => <LaleHero {...props} hareketli={hareketli} />}
      />
    </>
  );
}
