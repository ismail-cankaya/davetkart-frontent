import { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { MEZUNIYET_FLAVOR } from '../flavors';

const INK = '#1E3A5F';

const UCAK_TEMASI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#F6F3EC]',
  page: 'text-[#1E3A5F]',
  surface: 'bg-white/85 backdrop-blur-md shadow-[0_10px_40px_-22px_rgba(30,58,95,0.4)]',
  border: 'border-[#C9D3E0]',
  heading: 'text-[#1E3A5F]',
  body: 'text-[#4E6582]',
  accent: 'text-[#D9534F]',
  accentBg: 'bg-[#D9534F]',
  accentSoft: 'bg-[#D9534F]/10',
  input:
    'w-full bg-white border border-[#C9D3E0] rounded-lg px-3.5 py-2.5 text-sm text-[#1E3A5F] placeholder:text-[#93A3B8] focus:outline-none focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#1E3A5F] hover:bg-[#2A4C78] text-white shadow-lg shadow-[#1E3A5F]/20',
  buttonGhost: 'border border-[#1E3A5F]/30 text-[#1E3A5F] hover:bg-[#1E3A5F]/5',
  divider: 'bg-[#C9D3E0]',
  timelineLine: 'from-[#1E3A5F]/70 via-[#D9534F]/40 to-transparent',
  envelope: {
    paper: 'bg-[#E9EEF5]',
    flap: 'bg-[#DCE4EF]',
    seal: 'bg-[#D9534F] text-white',
    glow: 'bg-[#1E3A5F]/15',
    card: 'bg-white border border-[#C9D3E0]'
  },
  mapHeader: 'bg-[#E9EEF5]',
  footer: { names: 'text-[#4E6582]', branding: 'text-[#93A3B8]' }
};

const UCAK_FLAVOR: TemplateFlavor = {
  ...MEZUNIYET_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Yeni rotamızı birlikte kutlayalım',
  headings: {
    timeline: 'Uçuş Planı',
    details: 'Varış Noktası',
    gallery: 'Yolculuktan Kareler',
    gift: 'Hediye',
    rsvp: 'Biniş Kartını Al'
  }
};

interface Durak {
  k: string;
  l: string;
  v: string;
}

function duraklar(d: HeroData): Durak[] {
  const s: Durak[] = [];
  if (d.date.day) s.push({ k: 'tarih', l: 'Tarih', v: [d.date.dayMonth || d.date.day, d.date.weekday].filter(Boolean).join(' · ') });
  if (d.date.time) s.push({ k: 'saat', l: 'Saat', v: d.date.time });
  if (d.venue) s.push({ k: 'mekan', l: 'Mekân', v: d.venue });
  return s;
}

/** Rota 340 px genişliğinde bir kutuda çizilir; duraklar sağ/sol sırayla. */
const W = 340;
const ARA = 130;
const durakX = (i: number) => (i % 2 === 0 ? 70 : 270);
const durakY = (i: number) => 50 + i * ARA;

function rotaYolu(n: number): string {
  let d = `M ${durakX(0)} 0 L ${durakX(0)} ${durakY(0)}`;
  for (let i = 1; i < n; i++) {
    const x0 = durakX(i - 1);
    const y0 = durakY(i - 1);
    const x1 = durakX(i);
    const y1 = durakY(i);
    d += ` C ${x0} ${y0 + 70}, ${x1} ${y1 - 70}, ${x1} ${y1}`;
  }
  return d;
}

const ADIM = 1.3;

function Ucak() {
  return (
    <svg viewBox="0 0 40 40" className="w-9 h-9 drop-shadow-md" aria-hidden="true">
      <path d="M4 20 L 36 6 L 22 34 L 18 23 Z" fill="#fff" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M18 23 L 36 6 L 14 21 Z" fill="#DCE4EF" stroke={INK} strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

function Rota({ liste, hareketli }: { liste: Durak[]; hareketli: boolean }) {
  const n = liste.length;
  const H = durakY(n - 1) + 60;
  const xs = liste.map((_, i) => `${(durakX(i) / W) * 100}%`);
  const ys = liste.map((_, i) => durakY(i));
  const sure = Math.max(n - 1, 0) * ADIM + 0.6;

  return (
    <div className="relative mx-auto w-full max-w-[340px]" style={{ height: H }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" aria-hidden="true">
        <motion.path
          d={rotaYolu(n)}
          fill="none"
          stroke={INK}
          strokeOpacity={0.45}
          strokeWidth={1.6}
          strokeDasharray="6 7"
          initial={hareketli ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: sure, ease: 'linear' }}
        />
        {liste.map((_, i) => (
          <circle key={i} cx={durakX(i)} cy={durakY(i)} r={5} fill="#D9534F" />
        ))}
      </svg>

      {liste.map((s, i) => {
        const solda = i % 2 === 0;
        return (
          <motion.div
            key={s.k}
            initial={hareketli ? { opacity: 0, scale: 0.6 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: hareketli ? 0.6 + i * ADIM : 0 }}
            className={`absolute w-[52%] rounded-xl border border-[#C9D3E0] bg-white/90 px-3 py-2.5 text-left shadow-sm ${solda ? 'right-0' : 'left-0'}`}
            style={{ top: durakY(i) - 30, transformOrigin: solda ? 'left center' : 'right center' }}
          >
            <p className="text-[9px] tracking-[0.3em] uppercase text-[#D9534F]">
              {String(i + 1).padStart(2, '0')} · {s.l}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-[#1E3A5F] break-words line-clamp-2">{s.v}</p>
          </motion.div>
        );
      })}

      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        initial={hareketli ? { left: xs[0], top: 0, opacity: 0 } : false}
        animate={
          hareketli
            ? { left: xs, top: ys, opacity: 1 }
            : { left: xs[n - 1], top: ys[n - 1] - 26, opacity: 1 }
        }
        transition={{ duration: sure, ease: 'easeInOut' }}
        style={hareketli ? undefined : { left: xs[n - 1], top: ys[n - 1] - 26 }}
      >
        <Ucak />
      </motion.div>
    </div>
  );
}

function UcakHero({ invitation, hareketli }: HeroRenderProps & { hareketli: boolean }) {
  const d = useHeroData(invitation);
  const liste = useMemo(() => duraklar(d), [d]);
  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-5 pt-14 pb-16 text-center">
      <p className="text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#D9534F]">{d.title || UCAK_FLAVOR.tagline}</p>
      <h1 className="mt-4 font-cormorant font-semibold leading-[1.05] text-[#1E3A5F] text-[clamp(2.3rem,11cqw,4.4rem)] break-words max-w-full">
        {d.hasNames ? d.people.join(' & ') : NO_NAMES}
      </h1>
      {liste.length > 0 && (
        <div className="mt-8 w-full">
          <Rota liste={liste} hareketli={hareketli} />
        </div>
      )}
      <div className="mt-8">
        <HeroCountdown
          invitation={invitation}
          cellClassName="min-w-[56px] rounded-lg border border-[#C9D3E0] bg-white/80 px-2 py-1.5"
          numberClassName="font-cormorant text-2xl text-[#1E3A5F]"
          labelClassName="text-[10px] text-[#4E6582]"
        />
      </div>
      {d.subtitle && <p className="mt-6 max-w-md font-cormorant italic text-lg text-[#4E6582]">{d.subtitle}</p>}
    </div>
  );
}

/**
 * MezuniyetKagitUcak — kâğıt uçak süzülerek kesikli bir rota çizer; her durakta
 * bir bilgi kartı açılır. Önizleme / "hareketi azalt" → rota çizili, kartlar açık.
 */
export function MezuniyetKagitUcak({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  const hareketli = mode === 'live' && !reduced;
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={UCAK_FLAVOR}
      mode={mode}
      themeOverride={UCAK_TEMASI}
      renderBackdrop={() => (
        <div className="absolute inset-0 bg-[#F6F3EC] bg-[linear-gradient(#1E3A5F0F_1px,transparent_1px),linear-gradient(90deg,#1E3A5F0F_1px,transparent_1px)] [background-size:24px_24px]" />
      )}
      renderHero={(props) => <UcakHero {...props} hareketli={hareketli} />}
    />
  );
}
