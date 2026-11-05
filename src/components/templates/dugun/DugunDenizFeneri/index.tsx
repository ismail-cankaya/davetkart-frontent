import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';

/* ——— Gece kıyısı paleti ——— */
const LAMP = '#FFD27A';
const CREAM = '#F4EBD8';

/** Fenerin bir tam turu (s). İki huzme olduğundan metinler her yarım turda aydınlanır. */
const TUR = 10;

const FENER_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#07111F] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#F4EBD8]',
  surface: 'bg-[#0E2A3F]/75 backdrop-blur-md shadow-[0_0_40px_-18px_rgba(255,210,122,0.45)]',
  border: 'border-[#FFD27A]/25',
  heading: 'text-[#F4EBD8]',
  body: 'text-[#C9D3DC]',
  accent: 'text-[#FFD27A]',
  accentBg: 'bg-[#FFD27A]',
  accentSoft: 'bg-[#FFD27A]/10',
  input:
    'w-full bg-[#07111F]/70 border border-[#FFD27A]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#F4EBD8] placeholder:text-[#8796A6] focus:outline-none focus:border-[#FFD27A] focus:ring-2 focus:ring-[#FFD27A]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#FFE09A,#E9B24F)] hover:brightness-110 text-[#07111F] shadow-lg shadow-[#FFD27A]/25',
  buttonGhost: 'border border-[#FFD27A]/40 text-[#F4EBD8] hover:bg-[#FFD27A]/10',
  divider: 'bg-[#FFD27A]/20',
  timelineLine: 'from-[#FFD27A]/80 via-[#6FB3C9]/40 to-transparent',
  envelope: {
    paper: 'bg-[#0E2A3F]',
    flap: 'bg-[#123651]',
    seal: 'bg-[#FFD27A] text-[#07111F]',
    glow: 'bg-[#FFD27A]/30',
    card: 'bg-[#FBF6EC] border border-[#FFD27A]/50'
  },
  mapHeader: 'bg-[#0E2A3F]',
  footer: { names: 'text-[#C9D3DC]', branding: 'text-[#8796A6]' }
};

const FENER_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Fenerin ışığında, bir ömür boyu',
  headings: {
    timeline: 'Gecenin Akışı',
    details: 'Kıyıya Giden Yol',
    gallery: 'Işıktan Kareler',
    gift: 'Hediye & Takı',
    rsvp: 'Işığımıza Katılın'
  }
};

/*
 * Huzme fenerin lambası etrafında döner (df-spin). Metinler aynı tempoda,
 * her yarım turda bir kez aydınlanır (df-lit). Dalgalar iki kat geniş,
 * kendini tekrarlayan bir yolun yarısı kadar kayar (df-wave).
 */
const CSS = `
@keyframes df-spin{from{transform:rotate(-160deg)}to{transform:rotate(200deg)}}
@keyframes df-lit{0%,100%{text-shadow:0 0 6px rgba(255,210,122,.15);opacity:.82}45%,55%{text-shadow:0 0 26px rgba(255,210,122,.75),0 0 2px rgba(255,240,210,.9);opacity:1}}
@keyframes df-wave{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes df-twinkle{0%,100%{opacity:.9}50%{opacity:.35}}
.df-run .df-beam{animation:df-spin ${TUR}s linear infinite}
.df-run .df-lit{animation:df-lit ${TUR / 2}s ease-in-out infinite;animation-delay:var(--d,0s)}
.df-run .df-wave{animation:df-wave var(--w,14s) linear infinite}
.df-run .df-star{animation:df-twinkle 3.4s ease-in-out infinite;animation-delay:var(--d,0s)}
@media (prefers-reduced-motion:reduce){.df-run .df-beam,.df-run .df-lit,.df-run .df-wave,.df-run .df-star{animation:none}}
`;

function FenerStyles() {
  return (
    <style href="dugun-deniz-feneri" precedence="dugun">
      {CSS}
    </style>
  );
}

type VarStyle = React.CSSProperties & Record<`--${string}`, string>;

/** 0–200 genişliğinde, iki tam periyotlu dalga: yarısı kadar kayınca dikiş görünmez. */
function dalgaYolu(y: number, genlik: number): string {
  let d = `M0 ${y}`;
  for (let x = 0; x < 200; x += 50) {
    d += ` Q ${x + 12.5} ${y - genlik} ${x + 25} ${y} T ${x + 50} ${y}`;
  }
  return `${d} V 40 H 0 Z`;
}

const DALGALAR = [
  { y: 12, g: 3, renk: '#123651', op: 0.9, sure: '18s' },
  { y: 20, g: 2.5, renk: '#0E2A3F', op: 1, sure: '12s' },
  { y: 28, g: 2, renk: '#0A1F30', op: 1, sure: '9s' }
] as const;

const YILDIZLAR = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 46,
  r: i % 3 === 0 ? 2 : 1.2
}));

/** Kayalık burun üzerinde beyaz-kırmızı kuşaklı fener. Lamba (60, 26) noktasında. */
function FenerSiluet() {
  return (
    <svg viewBox="0 0 120 220" className="w-full h-full" aria-hidden="true">
      <path d="M0 220 L 8 196 L 30 186 L 52 190 L 78 182 L 102 192 L 120 204 L 120 220 Z" fill="#050C16" />
      <path d="M44 190 L 50 52 L 70 52 L 76 190 Z" fill={CREAM} />
      <path d="M47 140 L 73 140 L 74 160 L 46 160 Z M48.6 98 L 71.4 98 L 72.3 118 L 47.7 118 Z" fill="#B8463E" />
      <rect x="44" y="46" width="32" height="7" rx="1" fill="#1B2733" />
      <rect x="50" y="16" width="20" height="30" rx="2" fill={LAMP} />
      <path d="M50 16 L 60 4 L 70 16 Z" fill="#1B2733" />
      <path d="M52 20 V 44 M60 20 V 44 M68 20 V 44" stroke="#1B2733" strokeWidth="1" />
      <circle cx="60" cy="28" r="20" fill={LAMP} opacity="0.25" />
      <rect x="57" y="170" width="6" height="12" rx="3" fill="#1B2733" />
    </svg>
  );
}

/** Gece göğü, yıldızlar, dönen huzme, fener ve dalgalar. */
function FenerBackdrop({ hareketli }: BackdropState & { hareketli: boolean }) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#040A14_0%,#07111F_55%,#0B2033_100%)] ${hareketli ? 'df-run' : ''}`}>
      {YILDIZLAR.map((s, i) => (
        <span
          key={i}
          className="df-star absolute rounded-full bg-[#F4EBD8]"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r, '--d': `${-(i % 5) * 0.7}s` } as VarStyle}
        />
      ))}

      {/* Fener + huzme: aynı kutuda, böylece huzmenin merkezi lambaya oturur. */}
      <div className="absolute right-[4%] bottom-[9%] w-[96px] h-[176px] sm:w-[120px] sm:h-[220px]">
        <div className="absolute left-1/2 top-[12.7%] w-0 h-0">
          <div className="df-beam absolute left-0 top-0 w-0 h-0" style={{ transform: 'rotate(-160deg)' }}>
            {[0, 180].map((aci) => (
              <div
                key={aci}
                className="absolute left-0 top-[-23vmax] w-[160vmax] h-[46vmax] origin-left"
                style={{
                  transform: `rotate(${aci}deg)`,
                  clipPath: 'polygon(0 49%, 100% 0, 100% 100%, 0 51%)',
                  background: 'linear-gradient(90deg, rgba(255,214,130,0.55), rgba(255,214,130,0.14) 45%, transparent 85%)',
                  mixBlendMode: 'screen'
                }}
              />
            ))}
          </div>
        </div>
        <FenerSiluet />
      </div>

      {/* Dalgalar: iki kat geniş yol, yarısı kadar kayar. */}
      <div className="absolute bottom-0 inset-x-0 h-[16%] min-h-[90px]">
        {DALGALAR.map((w, i) => (
          <svg key={i} viewBox="0 0 200 40" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
            <g className="df-wave" style={{ '--w': w.sure, transformBox: 'view-box' } as VarStyle}>
              <path d={dalgaYolu(w.y, w.g)} fill={w.renk} opacity={w.op} transform="scale(2 1)" />
            </g>
          </svg>
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(255,210,122,0.12),transparent_60%)]" />
      </div>
    </div>
  );
}

interface BilgiSatiri {
  key: string;
  label: string;
  value: string;
}

/** Boş alanların satırı hiç çıkmaz. */
function satirlariKur(d: HeroData): BilgiSatiri[] {
  const s: BilgiSatiri[] = [];
  if (d.date.day) s.push({ key: 'tarih', label: 'Tarih', value: [d.date.dayMonth || d.date.day, d.date.weekday].filter(Boolean).join(' · ') });
  if (d.date.time) s.push({ key: 'saat', label: 'Saat', value: d.date.time });
  if (d.venue) s.push({ key: 'mekan', label: 'Mekân', value: d.venue });
  return s;
}

function FenerHero({ invitation, hareketli }: HeroRenderProps & { hareketli: boolean }) {
  const d = useHeroData(invitation);
  const satirlar = useMemo(() => satirlariKur(d), [d]);

  /** Işık soldan sağa süpürür gibi: kırpma açılır, bulanıklık kalkar. */
  const isik = (delay: number) =>
    hareketli
      ? {
          initial: { opacity: 0, clipPath: 'inset(0 100% 0 0)', filter: 'blur(6px)' },
          animate: { opacity: 1, clipPath: 'inset(0 0% 0 0)', filter: 'blur(0px)' },
          transition: { duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] as const }
        }
      : { initial: false as const };

  const lit = (i: number): VarStyle => ({ '--d': `${-i * 0.35}s` });

  return (
    <div dir="auto" className={`grow flex flex-col items-center justify-center px-5 pt-16 pb-36 text-center ${hareketli ? 'df-run' : ''}`}>
      <motion.p {...isik(0.3)} className="text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#FFD27A]">
        {d.title || FENER_FLAVOR.tagline}
      </motion.p>

      <h1 className="mt-5 font-cormorant italic font-semibold leading-[1.02] text-[#F4EBD8] text-[clamp(2.5rem,12cqw,5rem)] break-words max-w-full">
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && <span className="block my-1 text-[0.42em] not-italic text-[#FFD27A]">&amp;</span>}
              <motion.span {...isik(0.8 + i * 0.5)} className="block">
                <span className="df-lit block" style={lit(i)}>
                  {p}
                </span>
              </motion.span>
            </React.Fragment>
          ))
        ) : (
          <motion.span {...isik(0.8)} className="block">
            <span className="df-lit block">{NO_NAMES}</span>
          </motion.span>
        )}
      </h1>

      {satirlar.length > 0 && (
        <dl className="mt-8 w-full max-w-[340px] space-y-2.5">
          {satirlar.map((s, i) => (
            <motion.div
              key={s.key}
              {...isik(1.6 + i * 0.35)}
              className="flex items-baseline justify-between gap-4 border-b border-[#FFD27A]/20 pb-2 text-left"
            >
              <dt className="shrink-0 text-[10px] tracking-[0.3em] uppercase text-[#9FB4C4]">{s.label}</dt>
              <dd className="df-lit min-w-0 text-right font-cormorant text-lg text-[#F4EBD8] break-words" style={lit(i + 2)}>
                {s.value}
              </dd>
            </motion.div>
          ))}
        </dl>
      )}

      <motion.div {...isik(2.6)} className="mt-8">
        <HeroCountdown
          invitation={invitation}
          cellClassName="min-w-[56px] rounded-lg border border-[#FFD27A]/30 bg-[#0E2A3F]/70 px-2 py-1.5"
          numberClassName="font-cormorant text-2xl text-[#FFE3A6]"
          labelClassName="text-[10px] text-[#AFC0CE]"
        />
      </motion.div>

      {d.subtitle && (
        <motion.p {...isik(3)} className="mt-6 max-w-md font-cormorant italic text-lg text-[#DCE4EA]">
          {d.subtitle}
        </motion.p>
      )}
    </div>
  );
}

/**
 * DugunDenizFeneri — "Deniz Feneri": gece kıyısında dönen bir fener.
 * Işık huzmesi karanlığı süpürür; adlar ve bilgiler soldan sağa aydınlanarak
 * belirir, ardından her geçişte yeniden parlar. Dalgalar SVG ile kayar.
 * Önizlemede ve "hareketi azalt" tercihinde her şey son karede durur.
 */
export function DugunDenizFeneri({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  const hareketli = mode === 'live' && !reduced;
  return (
    <>
      <FenerStyles />
      <InvitationComposition
        invitation={invitation}
        flavor={FENER_FLAVOR}
        mode={mode}
        themeOverride={FENER_TEMASI}
        renderBackdrop={(state) => <FenerBackdrop {...state} hareketli={hareketli} />}
        renderHero={(props) => <FenerHero {...props} hareketli={hareketli} />}
      />
    </>
  );
}
