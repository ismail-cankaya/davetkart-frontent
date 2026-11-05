import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DOGUM_GUNU_FLAVOR } from '../flavors';

const BALON_TEMASI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#FFF6EC]',
  page: 'text-[#3B2A4A]',
  surface: 'bg-white/80 backdrop-blur-md shadow-[0_10px_40px_-20px_rgba(120,60,140,0.35)]',
  border: 'border-[#E9C6E0]',
  heading: 'text-[#3B2A4A]',
  body: 'text-[#6A5878]',
  accent: 'text-[#E0507A]',
  accentBg: 'bg-[#E0507A]',
  accentSoft: 'bg-[#E0507A]/10',
  input:
    'w-full bg-white border border-[#E9C6E0] rounded-lg px-3.5 py-2.5 text-sm text-[#3B2A4A] placeholder:text-[#A896B4] focus:outline-none focus:border-[#E0507A] focus:ring-2 focus:ring-[#E0507A]/20 transition-all duration-300',
  buttonPrimary: 'bg-[#E0507A] hover:bg-[#E86A90] text-white shadow-lg shadow-[#E0507A]/25',
  buttonGhost: 'border border-[#E0507A]/40 text-[#3B2A4A] hover:bg-[#E0507A]/10',
  divider: 'bg-[#E9C6E0]',
  timelineLine: 'from-[#E0507A]/80 via-[#7FB7E8]/50 to-transparent',
  envelope: {
    paper: 'bg-[#FDE3EC]',
    flap: 'bg-[#F9CFDF]',
    seal: 'bg-[#E0507A] text-white',
    glow: 'bg-[#E0507A]/25',
    card: 'bg-white border border-[#E9C6E0]'
  },
  mapHeader: 'bg-[#FDE3EC]',
  footer: { names: 'text-[#6A5878]', branding: 'text-[#A896B4]' }
};

const BALON_FLAVOR: TemplateFlavor = {
  ...DOGUM_GUNU_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Balonları patlat, sürprizi gör!',
  headings: {
    timeline: 'Parti Akışı',
    details: 'Partiye Giden Yol',
    gallery: 'Anılar',
    gift: 'Hediye Fikirleri',
    rsvp: 'Geliyor musun?'
  }
};

const RENKLER = ['#FF7A9C', '#7FB7E8', '#FFC857', '#9C7FE8'] as const;

const CSS = `
@keyframes db-float{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-12px) rotate(3deg)}}
.db-run .db-float{animation:db-float 4.2s ease-in-out infinite;animation-delay:var(--d,0s)}
@media (prefers-reduced-motion:reduce){.db-run .db-float{animation:none}}
`;

type VarStyle = React.CSSProperties & Record<`--${string}`, string>;
interface Bilgi {
  k: string;
  l: string;
  v: string;
}

function bilgiler(d: HeroData): Bilgi[] {
  const s: Bilgi[] = [];
  if (d.date.day) s.push({ k: 'tarih', l: 'Tarih', v: [d.date.dayMonth || d.date.day, d.date.weekday].filter(Boolean).join(' · ') });
  if (d.date.time) s.push({ k: 'saat', l: 'Saat', v: d.date.time });
  if (d.venue) s.push({ k: 'mekan', l: 'Mekân', v: d.venue });
  return s;
}

function Balon({ renk }: { renk: string }) {
  return (
    <svg viewBox="0 0 60 96" className="w-[64px] h-[102px]" aria-hidden="true">
      <path d="M30 4 C 50 4, 56 24, 54 38 C 52 54, 38 66, 30 68 C 22 66, 8 54, 6 38 C 4 24, 10 4, 30 4 Z" fill={renk} />
      <ellipse cx="20" cy="22" rx="5" ry="9" fill="#fff" opacity="0.45" transform="rotate(-20 20 22)" />
      <path d="M27 68 L 33 68 L 30 73 Z" fill={renk} />
      <path d="M30 73 C 26 80, 34 86, 30 96" stroke="#8A7A96" strokeWidth="1" fill="none" />
    </svg>
  );
}

function BalonHero({ invitation, hareketli }: HeroRenderProps & { hareketli: boolean }) {
  const d = useHeroData(invitation);
  const liste = useMemo(() => bilgiler(d), [d]);
  const [acik, setAcik] = useState<Set<string>>(() => new Set());
  const hepsi = !hareketli || acik.size >= liste.length;
  const goster = (k: string) => hepsi || acik.has(k);
  const patlat = (k: string) => setAcik((s) => new Set(s).add(k));

  return (
    <div dir="auto" className={`grow flex flex-col items-center justify-center px-5 pt-16 pb-16 text-center ${hareketli ? 'db-run' : ''}`}>
      <p className="text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#E0507A]">{d.title || BALON_FLAVOR.tagline}</p>
      <h1 className="mt-4 font-sans font-extrabold leading-[1.05] text-[#3B2A4A] text-[clamp(2.3rem,11cqw,4.4rem)] break-words max-w-full">
        {d.hasNames ? d.people.join(' & ') : NO_NAMES}
      </h1>

      {liste.length > 0 && (
        <ul className="mt-8 grid grid-cols-3 gap-2 w-full max-w-[360px]">
          {liste.map((b, i) => (
            <li key={b.k} className="flex flex-col items-center min-h-[124px] justify-start">
              <AnimatePresence mode="wait" initial={false}>
                {goster(b.k) ? (
                  <motion.div
                    key="kart"
                    initial={hareketli ? { scale: 0.4, opacity: 0 } : false}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                    className="w-full rounded-xl border border-[#E9C6E0] bg-white/85 px-2 py-3 shadow-sm"
                  >
                    <p className="text-[9px] tracking-[0.25em] uppercase" style={{ color: RENKLER[i % RENKLER.length] }}>
                      {b.l}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#3B2A4A] break-words line-clamp-3">{b.v}</p>
                  </motion.div>
                ) : (
                  <motion.button
                    key="balon"
                    type="button"
                    onClick={() => patlat(b.k)}
                    exit={{ scale: 1.6, opacity: 0, transition: { duration: 0.18 } }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Balonu patlat: ${b.l}`}
                    className="db-float cursor-pointer"
                    style={{ '--d': `${-i * 1.3}s` } as VarStyle}
                  >
                    <Balon renk={RENKLER[i % RENKLER.length]} />
                  </motion.button>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      )}

      {hareketli && liste.length > 0 && !hepsi && (
        <button
          type="button"
          onClick={() => setAcik(new Set(liste.map((b) => b.k)))}
          className="mt-4 rounded-full border border-[#E0507A]/40 px-4 py-1.5 text-xs text-[#E0507A] hover:bg-[#E0507A]/10 transition-colors"
        >
          Hepsini göster
        </button>
      )}

      <div className="mt-8">
        <HeroCountdown
          invitation={invitation}
          cellClassName="min-w-[56px] rounded-lg border border-[#E9C6E0] bg-white/80 px-2 py-1.5"
          numberClassName="font-sans font-bold text-2xl text-[#E0507A]"
          labelClassName="text-[10px] text-[#6A5878]"
        />
      </div>
      {d.subtitle && <p className="mt-6 max-w-md text-base text-[#6A5878]">{d.subtitle}</p>}
    </div>
  );
}

function BalonBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#FDE8F1_0%,#FFF6EC_55%,#E8F3FD_100%)]">
      <div className="absolute inset-0 opacity-[0.18] bg-[radial-gradient(circle,#E0507A_1.2px,transparent_1.8px)] [background-size:26px_26px]" />
    </div>
  );
}

/**
 * DogumGunuBalon — süzülen balonlar; dokununca patlar ve içinden bir bilgi
 * çıkar. "Hepsini göster" hepsini birden açar. Önizleme / "hareketi azalt" →
 * tüm bilgiler açık.
 */
export function DogumGunuBalon({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  const hareketli = mode === 'live' && !reduced;
  return (
    <>
      <style href="dogum-gunu-balon" precedence="dogum-gunu">
        {CSS}
      </style>
      <InvitationComposition
        invitation={invitation}
        flavor={BALON_FLAVOR}
        mode={mode}
        themeOverride={BALON_TEMASI}
        renderBackdrop={() => <BalonBackdrop />}
        renderHero={(props) => <BalonHero {...props} hareketli={hareketli} />}
      />
    </>
  );
}
