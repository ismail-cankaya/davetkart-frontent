import { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { NISAN_FLAVOR } from '../flavors';

const MEKTUP_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#F6E6E0] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#3A0F18]',
  surface: 'bg-[#FBF1EC]/70 backdrop-blur-md shadow-[0_0_40px_-18px_rgba(140,28,44,0.45)]',
  border: 'border-[#8C1C2C]/30',
  heading: 'text-[#3A0F18]',
  body: 'text-[#6E4048]',
  accent: 'text-[#8C1C2C]',
  accentBg: 'bg-[#8C1C2C]',
  accentSoft: 'bg-[#8C1C2C]/10',
  input:
    'w-full bg-[#F6E6E0]/70 border border-[#8C1C2C]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#3A0F18] placeholder:text-[#A88088] focus:outline-none focus:border-[#8C1C2C] focus:ring-2 focus:ring-[#8C1C2C]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#A8283A,#7A1424)] hover:brightness-110 text-[#F6E6E0] shadow-lg shadow-[#8C1C2C]/25',
  buttonGhost: 'border border-[#8C1C2C]/40 text-[#3A0F18] hover:bg-[#8C1C2C]/10',
  divider: 'bg-[#8C1C2C]/20',
  timelineLine: 'from-[#8C1C2C]/80 via-[#B83A4A]/40 to-transparent',
  envelope: {
    paper: 'bg-[#FBF1EC]',
    flap: 'bg-[#F1DCD5]',
    seal: 'bg-[#8C1C2C] text-[#F6E6E0]',
    glow: 'bg-[#8C1C2C]/30',
    card: 'bg-[#FFFFFF] border border-[#8C1C2C]/50'
  },
  mapHeader: 'bg-[#FBF1EC]',
  footer: { names: 'text-[#6E4048]', branding: 'text-[#A88088]' }
};

const MEKTUP_FLAVOR: TemplateFlavor = {
  ...NISAN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Bir mektupla müjdeliyoruz',
  headings: {
    timeline: 'Gecenin Akışı',
    details: 'Adres',
    gallery: 'Anılar',
    gift: 'Hediye',
    rsvp: 'Cevabınızı Yazın'
  }
};

/** Mektup: mum mühür ikiye ayrılır, kâğıt yukarı doğru açılır; adlar mürekkeple yazılır. */
function Mektup({ hareketli, adlar }: { hareketli: boolean; adlar: string }) {
  const g = (delay: number) => (hareketli ? { delay } : { duration: 0 });
  return (
    <div className="relative w-[min(86vw,340px)] [container-type:inline-size]">
      <motion.div
        initial={hareketli ? { scaleY: 0.08, opacity: 0.6 } : false}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], ...g(1) }}
        style={{ transformOrigin: '50% 0%' }}
        className="relative rounded-sm bg-[#FBF5EA] px-6 pt-10 pb-8 shadow-[0_20px_50px_-25px_rgba(60,20,30,0.6)] bg-[repeating-linear-gradient(180deg,transparent_0_27px,#8C1C2C14_27px_28px)]"
      >
        <motion.p
          initial={hareketli ? { clipPath: 'inset(0 100% 0 0)' } : false}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1.6, ease: 'easeInOut', ...g(2) }}
          className="font-cormorant italic font-semibold text-[#5A1420] text-[clamp(1.8rem,10cqw,2.8rem)] leading-tight break-words"
        >
          {adlar}
        </motion.p>
        <p className="mt-3 text-[10px] tracking-[0.35em] uppercase text-[#8C1C2C]/70">söz verdik</p>
      </motion.div>
      {/* Mum mühür: iki yarım, açılışta ayrılıp düşer. */}
      {[-1, 1].map((yon) => (
        <motion.svg
          key={yon}
          viewBox="0 0 60 60"
          className="absolute left-1/2 top-0 -ml-[30px] -mt-[30px] w-[60px] h-[60px]"
          initial={false}
          animate={hareketli ? { x: yon * 70, y: 40, rotate: yon * 35, opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeIn', ...g(0.6) }}
          aria-hidden="true"
        >
          <clipPath id={`muhur-${yon}`}>
            <rect x={yon < 0 ? 0 : 30} y="0" width="30" height="60" />
          </clipPath>
          <g clipPath={`url(#muhur-${yon})`}>
            <circle cx="30" cy="30" r="26" fill="#8C1C2C" />
            <circle cx="30" cy="30" r="19" fill="none" stroke="#B83A4A" strokeWidth="2" />
            <text x="30" y="37" textAnchor="middle" fontSize="20" fontFamily="serif" fontStyle="italic" fill="#E8B4A0">
              &amp;
            </text>
          </g>
        </motion.svg>
      ))}
    </div>
  );
}

function MektupBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_50%_20%,#F6E6E0_0%,#EBD3CC_65%,#DDBDB4_100%)]" />
  );
}

function satirlar(d: HeroData): { k: string; l: string; v: string }[] {
  const s: { k: string; l: string; v: string }[] = [];
  if (d.date.day) s.push({ k: 'tarih', l: 'Tarih', v: [d.date.dayMonth || d.date.day, d.date.weekday].filter(Boolean).join(' · ') });
  if (d.date.time) s.push({ k: 'saat', l: 'Saat', v: d.date.time });
  if (d.venue) s.push({ k: 'mekan', l: 'Mekân', v: d.venue });
  return s;
}

function MektupHero({ invitation, hareketli }: HeroRenderProps & { hareketli: boolean }) {
  const d = useHeroData(invitation);
  const bilgi = useMemo(() => satirlar(d), [d]);
  const belir = (delay: number) =>
    hareketli
      ? { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const } }
      : { initial: false as const };

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-6 pt-16 pb-16 text-center">
      <motion.p {...belir(1.6)} className="text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#8C1C2C]">
        {d.title || MEKTUP_FLAVOR.tagline}
      </motion.p>
      <h1 className="sr-only">{d.hasNames ? d.people.join(' & ') : NO_NAMES}</h1>
      <div className="mt-6">
        <Mektup hareketli={hareketli} adlar={d.hasNames ? d.people.join(' & ') : NO_NAMES} />
      </div>
      {bilgi.length > 0 && (
        <dl className="mt-8 w-full max-w-[300px] space-y-2.5">
          {bilgi.map((s, i) => (
            <motion.div key={s.k} {...belir(2.5 + i * 0.3)} className="flex items-baseline justify-between gap-4 border-b border-[#8C1C2C]/25 pb-2 text-left">
              <dt className="shrink-0 text-[10px] tracking-[0.3em] uppercase text-[#9A5A64]">{String(i + 1).padStart(2, '0')} · {s.l}</dt>
              <dd className="min-w-0 text-right font-cormorant text-lg text-[#3A0F18] break-words">{s.v}</dd>
            </motion.div>
          ))}
        </dl>
      )}
      <motion.div {...belir(3.3)} className="mt-8">
        <HeroCountdown
          invitation={invitation}
          cellClassName="min-w-[56px] rounded-lg border border-[#8C1C2C]/30 bg-[#FBF1EC]/70 px-2 py-1.5"
          numberClassName="font-cormorant text-2xl text-[#A8283A]"
          labelClassName="text-[10px] text-[#9A5A64]"
        />
      </motion.div>
      {d.subtitle && (
        <motion.p {...belir(3.6)} className="mt-6 max-w-md font-cormorant italic text-lg text-[#6E4048]">
          {d.subtitle}
        </motion.p>
      )}
    </div>
  );
}

/**
 * NisanMektup — mum mühür kırılır, mektup açılır, adlar mürekkeple yazılır;
 * bilgiler mektubun altında. Önizleme / "hareketi azalt" → açık mektup.
 */
export function NisanMektup({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  const hareketli = mode === 'live' && !reduced;
  return (
    <InvitationComposition
        invitation={invitation}
        flavor={MEKTUP_FLAVOR}
        mode={mode}
        themeOverride={MEKTUP_TEMASI}
        renderBackdrop={() => <MektupBackdrop />}
        renderHero={(props) => <MektupHero {...props} hareketli={hareketli} />}
      />
  );
}
