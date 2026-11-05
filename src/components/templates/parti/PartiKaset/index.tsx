import { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { PARTI_FLAVOR } from '../flavors';

const GOLD = '#FFC857';

const KASET_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#120E1E] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#FCEBD2]',
  surface: 'bg-[#241C38]/70 backdrop-blur-md shadow-[0_0_40px_-18px_rgba(255,200,87,0.45)]',
  border: 'border-[#FFC857]/30',
  heading: 'text-[#FCEBD2]',
  body: 'text-[#CFC4E0]',
  accent: 'text-[#FFC857]',
  accentBg: 'bg-[#FFC857]',
  accentSoft: 'bg-[#FFC857]/10',
  input:
    'w-full bg-[#120E1E]/70 border border-[#FFC857]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#FCEBD2] placeholder:text-[#8E82A8] focus:outline-none focus:border-[#FFC857] focus:ring-2 focus:ring-[#FFC857]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#FFD889,#E0A33A)] hover:brightness-110 text-[#120E1E] shadow-lg shadow-[#FFC857]/25',
  buttonGhost: 'border border-[#FFC857]/40 text-[#FCEBD2] hover:bg-[#FFC857]/10',
  divider: 'bg-[#FFC857]/20',
  timelineLine: 'from-[#FFC857]/80 via-[#FF5E8A]/40 to-transparent',
  envelope: {
    paper: 'bg-[#241C38]',
    flap: 'bg-[#2E2446]',
    seal: 'bg-[#FFC857] text-[#120E1E]',
    glow: 'bg-[#FFC857]/30',
    card: 'bg-[#FFF8EC] border border-[#FFC857]/50'
  },
  mapHeader: 'bg-[#241C38]',
  footer: { names: 'text-[#CFC4E0]', branding: 'text-[#8E82A8]' }
};

const KASET_FLAVOR: TemplateFlavor = {
  ...PARTI_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Kaseti tak, parti başlasın',
  headings: {
    timeline: 'A Yüzü — Akış',
    details: 'B Yüzü — Yol',
    gallery: 'Kareler',
    gift: 'Hediye',
    rsvp: 'Listeye Adını Yaz'
  }
};

const CSS = `
@keyframes pk-spin{to{transform:rotate(360deg)}}
.pk-run .pk-reel{animation:pk-spin 2.4s linear infinite;transform-box:fill-box;transform-origin:center}
@media (prefers-reduced-motion:reduce){.pk-run .pk-reel{animation:none}}
`;

/** Kaset: iki dönen makara; etikette adlar (HTML katmanı). */
function Kaset({ hareketli, adlar }: { hareketli: boolean; adlar: string }) {
  return (
    <motion.div
      initial={hareketli ? { y: 40, opacity: 0, rotate: -6 } : false}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      className={`relative w-[min(86vw,340px)] aspect-[1.6] [container-type:inline-size] ${hareketli ? 'pk-run' : ''}`}
    >
      <svg viewBox="0 0 160 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <rect x="2" y="2" width="156" height="96" rx="8" fill="#1F1A2E" stroke={GOLD} strokeWidth="1.2" />
        <rect x="12" y="10" width="136" height="44" rx="4" fill="#FCEBD2" />
        <rect x="12" y="10" width="136" height="8" fill="#FF5E8A" />
        <rect x="40" y="56" width="80" height="22" rx="11" fill="#0E0B18" />
        {[58, 102].map((cx) => (
          <g key={cx} className="pk-reel">
            <circle cx={cx} cy={67} r={9} fill="#3A2F52" />
            <circle cx={cx} cy={67} r={3} fill="#0E0B18" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <rect key={a} x={cx - 0.8} y={58.5} width={1.6} height={4} fill={GOLD} transform={`rotate(${a} ${cx} 67)`} />
            ))}
          </g>
        ))}
        <path d="M30 98 L 40 84 H 120 L 130 98" fill="#2A2340" />
      </svg>
      <p className="absolute left-[10%] right-[10%] top-[21%] text-center font-cormorant italic font-semibold text-[#1F1A2E] text-[clamp(1rem,6cqw,1.6rem)] leading-tight line-clamp-2">
        {adlar}
      </p>
    </motion.div>
  );
}

function KasetBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_50%_20%,#2E2446_0%,#120E1E_65%,#08060F_100%)]">
      <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-[0.12] bg-[repeating-linear-gradient(90deg,#FF5E8A_0_2px,transparent_2px_14px)]" />
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

function KasetHero({ invitation, hareketli }: HeroRenderProps & { hareketli: boolean }) {
  const d = useHeroData(invitation);
  const bilgi = useMemo(() => satirlar(d), [d]);
  const belir = (delay: number) =>
    hareketli
      ? { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const } }
      : { initial: false as const };

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-6 pt-16 pb-16 text-center">
      <motion.p {...belir(1.6)} className="text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#FFC857]">
        {d.title || KASET_FLAVOR.tagline}
      </motion.p>
      <h1 className="sr-only">{d.hasNames ? d.people.join(' & ') : NO_NAMES}</h1>
      <div className="mt-6">
        <Kaset hareketli={hareketli} adlar={d.hasNames ? d.people.join(' & ') : NO_NAMES} />
      </div>
      {bilgi.length > 0 && (
        <dl className="mt-8 w-full max-w-[300px] space-y-2.5">
          {bilgi.map((s, i) => (
            <motion.div key={s.k} {...belir(2.5 + i * 0.3)} className="flex items-baseline justify-between gap-4 border-b border-[#FFC857]/25 pb-2 text-left">
              <dt className="shrink-0 text-[10px] tracking-[0.3em] uppercase text-[#B4A6D0]">{String(i + 1).padStart(2, '0')} · {s.l}</dt>
              <dd className="min-w-0 text-right font-cormorant text-lg text-[#FCEBD2] break-words">{s.v}</dd>
            </motion.div>
          ))}
        </dl>
      )}
      <motion.div {...belir(3.3)} className="mt-8">
        <HeroCountdown
          invitation={invitation}
          cellClassName="min-w-[56px] rounded-lg border border-[#FFC857]/30 bg-[#241C38]/70 px-2 py-1.5"
          numberClassName="font-cormorant text-2xl text-[#FFD889]"
          labelClassName="text-[10px] text-[#B4A6D0]"
        />
      </motion.div>
      {d.subtitle && (
        <motion.p {...belir(3.6)} className="mt-6 max-w-md font-cormorant italic text-lg text-[#DCD2EC]">
          {d.subtitle}
        </motion.p>
      )}
    </div>
  );
}

/**
 * PartiKaset — dönen makaralı bir kaset; etikette adlar, bilgiler şarkı listesi gibi
 * numaralı satırlar. Önizleme / "hareketi azalt" → makaralar durur.
 */
export function PartiKaset({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  const hareketli = mode === 'live' && !reduced;
  return (
    <>
      <style href="parti-kaset" precedence="parti">
        {CSS}
      </style>
      <InvitationComposition
        invitation={invitation}
        flavor={KASET_FLAVOR}
        mode={mode}
        themeOverride={KASET_TEMASI}
        renderBackdrop={() => <KasetBackdrop />}
        renderHero={(props) => <KasetHero {...props} hareketli={hareketli} />}
      />
    </>
  );
}
