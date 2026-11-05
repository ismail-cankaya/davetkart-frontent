import { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { SUNNET_FLAVOR } from '../flavors';

const GOK_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#E6F4FF] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#1F3A5F]',
  surface: 'bg-[#FFFFFF]/70 backdrop-blur-md shadow-[0_0_40px_-18px_rgba(47,128,209,0.45)]',
  border: 'border-[#2F80D1]/30',
  heading: 'text-[#1F3A5F]',
  body: 'text-[#4A6585]',
  accent: 'text-[#2F80D1]',
  accentBg: 'bg-[#2F80D1]',
  accentSoft: 'bg-[#2F80D1]/10',
  input:
    'w-full bg-[#E6F4FF]/70 border border-[#2F80D1]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#1F3A5F] placeholder:text-[#8AA2BD] focus:outline-none focus:border-[#2F80D1] focus:ring-2 focus:ring-[#2F80D1]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#4DABF7,#2F80D1)] hover:brightness-110 text-[#E6F4FF] shadow-lg shadow-[#2F80D1]/25',
  buttonGhost: 'border border-[#2F80D1]/40 text-[#1F3A5F] hover:bg-[#2F80D1]/10',
  divider: 'bg-[#2F80D1]/20',
  timelineLine: 'from-[#2F80D1]/80 via-[#FF6B6B]/40 to-transparent',
  envelope: {
    paper: 'bg-[#FFFFFF]',
    flap: 'bg-[#D6ECFF]',
    seal: 'bg-[#2F80D1] text-[#E6F4FF]',
    glow: 'bg-[#2F80D1]/30',
    card: 'bg-[#FFFFFF] border border-[#2F80D1]/50'
  },
  mapHeader: 'bg-[#FFFFFF]',
  footer: { names: 'text-[#4A6585]', branding: 'text-[#8AA2BD]' }
};

const GOK_FLAVOR: TemplateFlavor = {
  ...SUNNET_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Gökkuşağı kadar renkli bir gün',
  headings: {
    timeline: 'Günün Akışı',
    details: 'Şenlik Yeri',
    gallery: 'Anılar',
    gift: 'Hediye',
    rsvp: 'Şenliğe Katılın'
  }
};

const RENKLER = ['#FF6B6B', '#FFA94D', '#FFD43B', '#69DB7C', '#4DABF7', '#9775FA'] as const;

/** Gökkuşağı: yaylar dıştan içe pathLength ile çizilir; iki uçta bulut. */
function Gokkusagi({ hareketli, adlar }: { hareketli: boolean; adlar: string }) {
  return (
    <div className="relative w-[min(88vw,340px)] [container-type:inline-size]">
      <svg viewBox="0 0 200 116" className="w-full" aria-hidden="true">
        {RENKLER.map((c, i) => {
          const r = 92 - i * 9;
          return (
            <motion.path
              key={c}
              d={`M ${100 - r} 106 A ${r} ${r} 0 0 1 ${100 + r} 106`}
              fill="none"
              stroke={c}
              strokeWidth={8.5}
              strokeLinecap="round"
              initial={hareketli ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, delay: 0.3 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
        {[14, 186].map((cx, i) => (
          <motion.g
            key={cx}
            initial={hareketli ? { opacity: 0, x: i ? 24 : -24 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <ellipse cx={cx} cy={104} rx={20} ry={9} fill="#FFFFFF" />
            <circle cx={cx - 7} cy={98} r={8} fill="#FFFFFF" />
            <circle cx={cx + 6} cy={96} r={10} fill="#FFFFFF" />
          </motion.g>
        ))}
      </svg>
      <motion.p
        initial={hareketli ? { opacity: 0, y: 12, scale: 0.9 } : false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 14, delay: hareketli ? 1.8 : 0 }}
        className="absolute inset-x-[22%] bottom-[2%] text-center font-cormorant font-bold text-[#1F3A5F] text-[clamp(1.5rem,9cqw,2.6rem)] leading-tight break-words"
      >
        {adlar}
      </motion.p>
    </div>
  );
}

function GokBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#BFE3FF_0%,#E6F4FF_55%,#FFF8EC_100%)]">
      <div className="absolute inset-0 opacity-[0.25] bg-[radial-gradient(circle,#FFFFFF_1.5px,transparent_2px)] [background-size:30px_30px]" />
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

function GokHero({ invitation, hareketli }: HeroRenderProps & { hareketli: boolean }) {
  const d = useHeroData(invitation);
  const bilgi = useMemo(() => satirlar(d), [d]);
  const belir = (delay: number) =>
    hareketli
      ? { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const } }
      : { initial: false as const };

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-6 pt-16 pb-16 text-center">
      <motion.p {...belir(1.6)} className="text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#2F80D1]">
        {d.title || GOK_FLAVOR.tagline}
      </motion.p>
      <h1 className="sr-only">{d.hasNames ? d.people.join(' & ') : NO_NAMES}</h1>
      <div className="mt-6">
        <Gokkusagi hareketli={hareketli} adlar={d.hasNames ? d.people.join(' & ') : NO_NAMES} />
      </div>
      {bilgi.length > 0 && (
        <dl className="mt-8 w-full max-w-[300px] space-y-2.5">
          {bilgi.map((s, i) => (
            <motion.div key={s.k} {...belir(2.5 + i * 0.3)} className="flex items-baseline justify-between gap-4 border-b border-[#2F80D1]/25 pb-2 text-left">
              <dt className="shrink-0 text-[10px] tracking-[0.3em] uppercase text-[#5A7FA6]">{String(i + 1).padStart(2, '0')} · {s.l}</dt>
              <dd className="min-w-0 text-right font-cormorant text-lg text-[#1F3A5F] break-words">{s.v}</dd>
            </motion.div>
          ))}
        </dl>
      )}
      <motion.div {...belir(3.3)} className="mt-8">
        <HeroCountdown
          invitation={invitation}
          cellClassName="min-w-[56px] rounded-lg border border-[#2F80D1]/30 bg-[#FFFFFF]/70 px-2 py-1.5"
          numberClassName="font-cormorant text-2xl text-[#4DABF7]"
          labelClassName="text-[10px] text-[#5A7FA6]"
        />
      </motion.div>
      {d.subtitle && (
        <motion.p {...belir(3.6)} className="mt-6 max-w-md font-cormorant italic text-lg text-[#4A6585]">
          {d.subtitle}
        </motion.p>
      )}
    </div>
  );
}

/**
 * SunnetGokkusagi — gökkuşağı yayları tek tek çizilir, bulutlar süzülür, ad altta belirir;
 * bilgiler gökkuşağının altında. Önizleme / "hareketi azalt" → çizili gökkuşağı.
 */
export function SunnetGokkusagi({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  const hareketli = mode === 'live' && !reduced;
  return (
    <InvitationComposition
        invitation={invitation}
        flavor={GOK_FLAVOR}
        mode={mode}
        themeOverride={GOK_TEMASI}
        renderBackdrop={() => <GokBackdrop />}
        renderHero={(props) => <GokHero {...props} hareketli={hareketli} />}
      />
  );
}
