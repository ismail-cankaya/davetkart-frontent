import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { BABY_SHOWER_FLAVOR } from '../flavors';
import type { Invitation } from '../../../../types';

/* ——— Pastel gökyüzü paleti ——— */
const INK = '#3E4A6B';
const STRING = '#8C93AE';

/** En fazla bu kadar uçurtma (ve kart) çizilir. */
const UCURTMA_SAYISI = 4;

/** Uçurtma renkleri: [ana, ikinci yarı, kuyruk fiyonkları]. */
const RENKLER: ReadonlyArray<readonly [string, string, string]> = [
  ['#F7A8B8', '#F48BA3', '#F9D56E'],
  ['#9ED9C6', '#7CC8B1', '#F7A8B8'],
  ['#F9D56E', '#F3C14B', '#A9B8F0'],
  ['#B9A8EA', '#A08CE0', '#9ED9C6']
];

const UCURTMA_TEMASI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#EAF4FB] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#3E4A6B]',
  surface: 'bg-white/75 backdrop-blur-md shadow-[0_10px_40px_-20px_rgba(62,74,107,0.35)]',
  border: 'border-[#BFD3EA]/70',
  heading: 'text-[#3E4A6B]',
  body: 'text-[#5D6888]',
  accent: 'text-[#E07A93]',
  accentBg: 'bg-[#F48BA3]',
  accentSoft: 'bg-[#F7A8B8]/15',
  input:
    'w-full bg-white/80 border border-[#BFD3EA] rounded-xl px-3.5 py-2.5 text-sm text-[#3E4A6B] placeholder:text-[#98A2BC] focus:outline-none focus:border-[#F48BA3] focus:ring-2 focus:ring-[#F48BA3]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#F7A8B8,#E98199)] hover:brightness-105 text-white shadow-lg shadow-[#F48BA3]/30',
  buttonGhost: 'border border-[#F48BA3]/50 text-[#3E4A6B] hover:bg-[#F7A8B8]/15',
  divider: 'bg-[#BFD3EA]',
  timelineLine: 'from-[#F48BA3]/70 via-[#9ED9C6]/50 to-transparent',
  envelope: {
    paper: 'bg-[#DCEBF7]',
    flap: 'bg-[#F7A8B8]',
    seal: 'bg-[#F9D56E] text-[#3E4A6B]',
    glow: 'bg-[#F7A8B8]/30',
    card: 'bg-white border border-[#BFD3EA]'
  },
  mapHeader: 'bg-[#DCEBF7]',
  footer: { names: 'text-[#5D6888]', branding: 'text-[#98A2BC]' }
};

const UCURTMA_FLAVOR: TemplateFlavor = {
  ...BABY_SHOWER_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Minik bir rüzgâr geliyor',
  headings: {
    timeline: 'Günün Akışı',
    details: 'Buluşma Noktası',
    gallery: 'Gökyüzünden Kareler',
    gift: 'Hediye Listesi',
    rsvp: 'Uçurtmanı Bize Gönder'
  }
};

/*
 * Uçurtma ipinin dibinden (kartın üstü) sallanır (uc-sway), kuyruk kendi
 * tepesinden kıvrılır (uc-tail), bulutlar yatayda süzülür (uc-cloud).
 * "Hareketi azalt" tercihinde CSS de her şeyi durdurur.
 */
const CSS = `
@keyframes uc-sway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
@keyframes uc-tail{0%,100%{transform:rotate(8deg) skewX(-6deg)}50%{transform:rotate(-8deg) skewX(6deg)}}
@keyframes uc-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes uc-cloud{from{transform:translateX(-30vw)}to{transform:translateX(130vw)}}
.uc-run .uc-sway{animation:uc-sway var(--d) ease-in-out infinite;animation-delay:var(--b)}
.uc-run .uc-tail{animation:uc-tail calc(var(--d) * .5) ease-in-out infinite;animation-delay:var(--b)}
.uc-run .uc-bob{animation:uc-bob 3.6s ease-in-out infinite;animation-delay:var(--b)}
.uc-run .uc-cloud{animation:uc-cloud var(--d) linear infinite;animation-delay:var(--b)}
.uc-tail{transform-box:fill-box;transform-origin:50% 0}
@media (prefers-reduced-motion:reduce){.uc-run .uc-sway,.uc-run .uc-tail,.uc-run .uc-bob,.uc-run .uc-cloud{animation:none}}
`;

function UcurtmaStyles() {
  return (
    <style href="baby-ucurtma" precedence="baby">
      {CSS}
    </style>
  );
}

/** Özel CSS değişkenleri taşıyan stil nesnesi. */
type VarStyle = React.CSSProperties & Record<`--${string}`, string>;

interface BilgiKarti {
  key: string;
  label: string;
  value: string;
  sub?: string;
}

/** İplerde asılı kartlar; boş alanların kartı (ve uçurtması) hiç çıkmaz. */
function kartlariKur(d: HeroData, invitation: Invitation): BilgiKarti[] {
  const kartlar: BilgiKarti[] = [];
  if (d.date.day) kartlar.push({ key: 'tarih', label: 'Tarih', value: d.date.dayMonth || d.date.day, sub: d.date.weekday || d.date.year });
  if (d.date.time) kartlar.push({ key: 'saat', label: 'Saat', value: d.date.time });
  if (d.venue) kartlar.push({ key: 'mekan', label: 'Mekân', value: d.venue });
  if (invitation.showTimeline) {
    const program = invitation.timelineEvents.filter((e) => e.title.trim() !== '');
    for (const e of program.slice(0, Math.max(0, UCURTMA_SAYISI - kartlar.length))) {
      kartlar.push({ key: `p-${e.localKey}`, label: e.time.trim() || 'Program', value: e.title.trim() });
    }
  }
  return kartlar.slice(0, UCURTMA_SAYISI);
}

/** Baklava uçurtma: dört yarım üçgen, çapraz çıta ve fiyonklu kuyruk. */
function UcurtmaSiluet({ renk }: { renk: readonly [string, string, string] }) {
  const [ana, ikinci, fiyonk] = renk;
  return (
    <svg viewBox="0 0 80 150" className="w-[68px] h-auto drop-shadow-[0_6px_8px_rgba(62,74,107,0.18)]" aria-hidden="true">
      <path d="M40 4 L 70 44 L 40 50 Z" fill={ana} />
      <path d="M40 4 L 10 44 L 40 50 Z" fill={ikinci} />
      <path d="M10 44 L 40 50 L 40 96 Z" fill={ana} />
      <path d="M70 44 L 40 50 L 40 96 Z" fill={ikinci} />
      <path d="M40 4 L 40 96 M10 44 L 70 44" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="1.4" />
      <g className="uc-tail">
        <path d="M40 96 C 30 108, 50 118, 40 130 C 32 138, 46 144, 40 150" stroke={STRING} strokeWidth="1.2" fill="none" />
        {[108, 124, 140].map((y, i) => (
          <path key={y} d={`M${i % 2 ? 34 : 46} ${y} l -6 -4 v 8 Z M${i % 2 ? 34 : 46} ${y} l 6 -4 v 8 Z`} fill={fiyonk} />
        ))}
      </g>
    </svg>
  );
}

/** Basit SVG bulut. */
function Bulut({ className, style }: { className?: string; style?: VarStyle }) {
  return (
    <svg viewBox="0 0 120 50" className={className} style={style} aria-hidden="true">
      <path d="M18 44 C 4 44, 4 26, 18 26 C 18 12, 40 8, 48 20 C 56 6, 82 8, 84 24 C 100 20, 112 34, 102 44 Z" fill="#FFFFFF" />
    </svg>
  );
}

/** İp boyları: kartlar farklı yükseklikte asılı dursun. */
const IP_BOYU = [54, 82, 64, 92];

function Ucurtmalar({ kartlar, hareketli }: { kartlar: BilgiKarti[]; hareketli: boolean }) {
  if (kartlar.length === 0) return null;
  return (
    <ul className={`flex flex-wrap items-end justify-center gap-x-3 gap-y-6 ${hareketli ? 'uc-run' : ''}`}>
      {kartlar.map((k, i) => {
        const degisken: VarStyle = { '--d': `${5.5 + i * 0.9}s`, '--b': `${-i * 1.3}s` };
        const giris = hareketli
          ? {
              initial: { opacity: 0, y: 70 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 1.6, delay: 0.9 + i * 0.25, ease: [0.22, 1, 0.36, 1] as const }
            }
          : { initial: false as const };
        return (
          <motion.li key={k.key} {...giris} className="w-[150px] sm:w-[160px] flex flex-col items-center" style={degisken}>
            <div className="uc-sway flex flex-col items-center [transform-origin:50%_100%]">
              <UcurtmaSiluet renk={RENKLER[i % RENKLER.length]} />
              <div className="-mt-[46px] ml-[10px] w-px bg-[#8C93AE]" style={{ height: IP_BOYU[i % IP_BOYU.length] + 46 }} />
            </div>
            <div className="uc-bob w-full">
              <div className="relative w-full rounded-xl border border-[#BFD3EA] bg-white/90 px-2 py-2 text-center shadow-[0_8px_18px_-10px_rgba(62,74,107,0.45)]">
                <span className="absolute -top-1 left-1/2 -ml-1 w-2 h-2 rounded-full bg-[#8C93AE]" />
                <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-[#E07A93] truncate">{k.label}</p>
                <p className="mt-0.5 text-[13px] font-semibold leading-tight text-[#3E4A6B] break-words line-clamp-2">{k.value}</p>
                {k.sub && <p className="text-[10px] leading-tight text-[#6F7A98] truncate">{k.sub}</p>}
              </div>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}

const BULUTLAR: ReadonlyArray<{ top: string; w: number; d: number; b: number; left: string }> = [
  { top: '8%', w: 120, d: 70, b: -10, left: '6%' },
  { top: '22%', w: 80, d: 55, b: -32, left: '62%' },
  { top: '48%', w: 140, d: 90, b: -60, left: '30%' },
  { top: '72%', w: 96, d: 65, b: -20, left: '74%' }
];

/** Pastel gökyüzü, güneş halesi ve süzülen bulutlar. */
function UcurtmaBackdrop({ hareketli }: BackdropState & { hareketli: boolean }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#BFE0F5_0%,#DCEBF7_45%,#FBE3E8_80%,#FFF1DC_100%)] ${hareketli ? 'uc-run' : ''}`}
    >
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(255,236,170,0.9),rgba(255,236,170,0)_70%)]" />
      {BULUTLAR.map((b, i) => (
        <Bulut
          key={i}
          className={`absolute opacity-80 ${hareketli ? 'uc-cloud left-0' : ''}`}
          style={{
            top: b.top,
            width: b.w,
            ...(hareketli ? {} : { left: b.left }),
            '--d': `${b.d}s`,
            '--b': `${b.b}s`
          }}
        />
      ))}
    </div>
  );
}

function UcurtmaHero({ invitation, hareketli }: HeroRenderProps & { hareketli: boolean }) {
  const d = useHeroData(invitation);
  const kartlar = useMemo(() => kartlariKur(d, invitation), [d, invitation]);
  const rise = (delay: number) =>
    hareketli
      ? {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const }
        }
      : { initial: false as const };
  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-4 pt-14 pb-24 text-center" style={{ color: INK }}>
      <motion.p {...rise(0.3)} className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-[#E07A93]">
        {d.title || UCURTMA_FLAVOR.tagline}
      </motion.p>
      <h1 className="mt-4 font-cormorant italic font-semibold leading-[1] text-[#3E4A6B] text-[clamp(2.4rem,11cqw,4.6rem)] break-words max-w-full [text-shadow:0_2px_14px_rgba(255,255,255,0.8)]">
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && <span className="block my-0.5 text-[0.45em] not-italic text-[#E07A93]">&amp;</span>}
              <motion.span {...rise(0.55 + i * 0.25)} className="block">
                {p}
              </motion.span>
            </React.Fragment>
          ))
        ) : (
          <motion.span {...rise(0.55)} className="block">
            {NO_NAMES}
          </motion.span>
        )}
      </h1>
      <div className="mt-8 w-full max-w-[520px]">
        <Ucurtmalar kartlar={kartlar} hareketli={hareketli} />
      </div>
      <motion.div {...rise(1.8)} className="mt-8">
        <HeroCountdown
          invitation={invitation}
          cellClassName="min-w-[56px] rounded-xl border border-[#BFD3EA] bg-white/70 px-2 py-1.5"
          numberClassName="font-cormorant text-2xl text-[#3E4A6B]"
          labelClassName="text-[10px] text-[#6F7A98]"
        />
      </motion.div>
      {d.subtitle && (
        <motion.p {...rise(2.1)} className="mt-6 max-w-md font-cormorant italic text-lg text-[#5D6888]">
          {d.subtitle}
        </motion.p>
      )}
    </div>
  );
}

/**
 * BabyUcurtma — "Uçurtma": pastel gökyüzünde kuyruklu uçurtmalar rüzgârda
 * süzülür; her uçurtmanın ipinde tarih, saat, mekân ya da program kartı
 * asılıdır. Verisi boş olan kartın uçurtması da çizilmez. Önizlemede ve
 * "hareketi azalt" tercihinde sahne duruktur.
 */
export function BabyUcurtma({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  const hareketli = mode === 'live' && !reduced;
  return (
    <>
      <UcurtmaStyles />
      <InvitationComposition
        invitation={invitation}
        flavor={UCURTMA_FLAVOR}
        mode={mode}
        themeOverride={UCURTMA_TEMASI}
        renderBackdrop={(state) => <UcurtmaBackdrop {...state} hareketli={hareketli} />}
        renderHero={(props) => <UcurtmaHero {...props} hareketli={hareketli} />}
      />
    </>
  );
}
