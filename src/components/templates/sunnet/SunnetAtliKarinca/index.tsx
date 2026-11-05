import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { SUNNET_FLAVOR } from '../flavors';
import type { Invitation } from '../../../../types';

/* ——— Lunapark paleti ——— */
const NAVY = '#0A1230';
const RED = '#C8323C';
const CREAM = '#FFF3DC';
const GOLD = '#F6C453';

/** Bir tam tur (s). Halka, kartların karşı dönüşü ve derinlik solması aynı süreyi paylaşır. */
const TUR = 40;
const AT_SAYISI = 6;
const TENTE_DILIMI = 12;

const KARINCA_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0A1230] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#FFF3DC]',
  surface: 'bg-[#131C45]/80 backdrop-blur-md shadow-[0_0_40px_-18px_rgba(246,196,83,0.45)]',
  border: 'border-[#F6C453]/25',
  heading: 'text-[#FFF3DC]',
  body: 'text-[#D4D2E4]',
  accent: 'text-[#F6C453]',
  accentBg: 'bg-[#C8323C]',
  accentSoft: 'bg-[#F6C453]/10',
  input:
    'w-full bg-[#0A1230]/70 border border-[#F6C453]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#FFF3DC] placeholder:text-[#9A98B8] focus:outline-none focus:border-[#F6C453] focus:ring-2 focus:ring-[#F6C453]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#E0454F,#B3262F)] hover:brightness-110 text-[#FFF3DC] shadow-lg shadow-[#C8323C]/30',
  buttonGhost: 'border border-[#F6C453]/40 text-[#FFF3DC] hover:bg-[#F6C453]/10',
  divider: 'bg-[#F6C453]/20',
  timelineLine: 'from-[#F6C453]/80 via-[#C8323C]/40 to-transparent',
  envelope: {
    paper: 'bg-[#131C45]',
    flap: 'bg-[#C8323C]',
    seal: 'bg-[#F6C453] text-[#1B1206]',
    glow: 'bg-[#F6C453]/30',
    card: 'bg-[#FFF6E6] border border-[#F6C453]/50'
  },
  mapHeader: 'bg-[#131C45]',
  footer: { names: 'text-[#D4D2E4]', branding: 'text-[#9A98B8]' }
};

const KARINCA_FLAVOR: TemplateFlavor = {
  ...SUNNET_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Atlı karıncamız şehzademiz için dönüyor',
  headings: {
    timeline: 'Şenlik Programı',
    details: 'Lunaparkın Yolu',
    gallery: 'Şehzademizden Kareler',
    gift: 'Takı & Armağan',
    rsvp: 'Biletinizi Ayırtın'
  }
};

/*
 * Kareler: halka döner (ak-spin); her atın yüzü aynı sürede ters döner
 * (ak-face) ve böylece kart hep izleyiciye bakar; aynı fazda arkadaki atlar
 * solar (ak-depth). Faz, negatif `animation-delay` ile açıdan türetilir.
 * "Hareketi azalt" tercihinde CSS de her şeyi durdurur.
 */
const CSS = `
@keyframes ak-spin{from{transform:rotateY(var(--s))}to{transform:rotateY(calc(var(--s) + 360deg))}}
@keyframes ak-face{from{transform:rotateY(calc(var(--a) * -1))}to{transform:rotateY(calc(var(--a) * -1 - 360deg))}}
@keyframes ak-depth{0%,100%{opacity:1}25%,75%{opacity:.6}50%{opacity:.32}}
@keyframes ak-bob{0%,100%{transform:translateY(-9px)}50%{transform:translateY(9px)}}
@keyframes ak-twinkle{0%,100%{opacity:1}50%{opacity:.35}}
.ak-run .ak-ring{animation:ak-spin ${TUR}s linear infinite}
.ak-run .ak-face{animation:ak-face ${TUR}s linear infinite,ak-depth ${TUR}s linear infinite;animation-delay:0s,var(--dd)}
.ak-run .ak-bob{animation:ak-bob 3.2s ease-in-out infinite;animation-delay:var(--b)}
.ak-run .ak-bulb{animation:ak-twinkle 1.6s ease-in-out infinite;animation-delay:var(--b)}
@media (prefers-reduced-motion:reduce){.ak-run .ak-ring,.ak-run .ak-face,.ak-run .ak-bob,.ak-run .ak-bulb{animation:none}}
`;

function KarincaStyles() {
  return (
    <style href="sunnet-atli-karinca" precedence="sunnet">
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

/** Atların sırtındaki kartlar; boş alanların kartı hiç çıkmaz. */
function kartlariKur(d: HeroData, invitation: Invitation): BilgiKarti[] {
  const kartlar: BilgiKarti[] = [];
  if (d.date.day) kartlar.push({ key: 'tarih', label: 'Tarih', value: d.date.dayMonth || d.date.day, sub: d.date.weekday || d.date.year });
  if (d.date.time) kartlar.push({ key: 'saat', label: 'Saat', value: d.date.time });
  if (d.venue) kartlar.push({ key: 'mekan', label: 'Mekân', value: d.venue });
  if (invitation.showTimeline) {
    const program = invitation.timelineEvents.filter((e) => e.title.trim() !== '');
    for (const e of program.slice(0, AT_SAYISI - kartlar.length)) {
      kartlar.push({ key: `p-${e.localKey}`, label: e.time.trim() || 'Program', value: e.title.trim() });
    }
  }
  return kartlar.slice(0, AT_SAYISI);
}

/** Basit atlı karınca atı: şaha kalkmış gövde, eyer, yele. */
function AtSiluet({ renk }: { renk: string }) {
  return (
    <svg viewBox="0 0 100 72" className="w-[76px] h-auto drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)]" aria-hidden="true">
      <path d="M26 34 C 14 34, 10 44, 8 54" stroke={GOLD} strokeWidth="4" strokeLinecap="round" fill="none" />
      <g stroke={CREAM} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M34 44 L 27 56 L 20 60" />
        <path d="M41 46 L 42 60 L 37 67" />
        <path d="M66 43 L 76 51 L 84 47" />
        <path d="M60 46 L 64 58 L 72 61" />
      </g>
      <ellipse cx="48" cy="38" rx="25" ry="12.5" fill={CREAM} />
      <path d="M62 33 L 76 11 L 86 15 L 74 40 Z" fill={CREAM} />
      <ellipse cx="86" cy="18" rx="10.5" ry="6" transform="rotate(28 86 18)" fill={CREAM} />
      <path d="M79 9 L 82 2 L 85 10 Z" fill={CREAM} />
      <path d="M64 31 C 68 22, 72 15, 77 9" stroke={GOLD} strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M78 13 L 92 24" stroke={GOLD} strokeWidth="1.6" />
      <path d="M40 27 C 44 22, 56 22, 60 27 L 58 37 C 52 40, 46 40, 42 37 Z" fill={renk} />
      <path d="M42 37 C 46 40, 52 40, 58 37" stroke={GOLD} strokeWidth="1.6" fill="none" />
      <circle cx="88" cy="15" r="1.3" fill={NAVY} />
    </svg>
  );
}

const EYER_RENKLERI = [RED, '#2F6FD0', RED, '#2E9E6B', RED, '#8E44AD'];

/** Halka geometrisi (sahne merkezine göre px). */
const TENTE_ALT = -96;
const PLATFORM = 126;

function AtliKarinca({ kartlar, hareketli }: { kartlar: BilgiKarti[]; hareketli: boolean }) {
  // Kartları atlara eşit aralıkla dağıt.
  const atKarti = useMemo(() => {
    const harita = new Map<number, BilgiKarti>();
    kartlar.forEach((k, i) => harita.set(Math.round((i * AT_SAYISI) / kartlar.length) % AT_SAYISI, k));
    return harita;
  }, [kartlar]);

  // Duruk görünüm biraz döndürülür ki öndeki iki at da okunsun.
  const duruk = -18;
  const sahne: VarStyle = {
    '--r': 'clamp(104px, 33cqw, 168px)',
    '--rc': 'calc(var(--r) + 24px)',
    perspective: '900px'
  };

  return (
    <div className={`relative w-full h-[340px] ${hareketli ? 'ak-run' : ''}`} style={sahne}>
      <div className="absolute left-1/2 top-1/2 w-0 h-0 [transform-style:preserve-3d]" style={{ transform: 'rotateX(-7deg)' }}>
        {/* Orta direk — izleyiciye bakan düzlem, dönmez */}
        <div
          className="absolute w-[14px] -left-[7px] rounded-sm bg-[repeating-linear-gradient(135deg,#F6C453_0_7px,#FFF3DC_7px_11px,#C8323C_11px_16px)] shadow-[0_0_14px_rgba(246,196,83,0.4)]"
          style={{ top: TENTE_ALT - 40, height: PLATFORM - TENTE_ALT + 40 }}
        />
        {/* Tepe küresi */}
        <div className="absolute w-6 h-6 -left-3 rounded-full bg-[radial-gradient(circle_at_35%_35%,#FFF3DC,#F6C453_45%,#B07A18)]" style={{ top: TENTE_ALT - 82 }} />

        <div className="ak-ring absolute [transform-style:preserve-3d]" style={{ transform: `rotateY(${duruk}deg)`, '--s': `${duruk}deg` } as VarStyle}>
          {/* Platform: dönerken çizgileri akar */}
          <div
            className="absolute rounded-full border-4 border-[#F6C453]/70 bg-[repeating-conic-gradient(#7A1D25_0_15deg,#A8303A_15deg_30deg)]"
            style={{
              width: 'calc(var(--r) * 2 + 40px)',
              height: 'calc(var(--r) * 2 + 40px)',
              left: 'calc(var(--r) * -1 - 20px)',
              top: `calc(${PLATFORM}px - var(--r) - 20px)`,
              transform: 'rotateX(90deg)'
            }}
          />

          {/* Çizgili tente + ampuller */}
          {Array.from({ length: TENTE_DILIMI }, (_, i) => (
            <div
              key={`t${i}`}
              className="absolute h-[62px] [transform-origin:50%_100%]"
              style={{
                width: 'calc(var(--rc) * 0.54 + 1px)',
                left: 'calc(var(--rc) * -0.27)',
                top: TENTE_ALT - 62,
                transform: `rotateY(${i * (360 / TENTE_DILIMI)}deg) translateZ(calc(var(--rc) * 0.966)) rotateX(40deg)`,
                background: i % 2 === 0 ? RED : CREAM
              }}
            >
              <div
                className="absolute -bottom-[10px] inset-x-0 h-[10px]"
                style={{ background: `radial-gradient(circle at 50% 0, ${i % 2 === 0 ? RED : CREAM} 70%, transparent 72%)` }}
              />
              <span
                className="ak-bulb absolute -bottom-[3px] left-1/2 -ml-[4px] w-2 h-2 rounded-full bg-[#FFE7A0] shadow-[0_0_8px_3px_rgba(255,200,90,0.75)]"
                style={{ '--b': `${-(i % 4) * 0.4}s` } as VarStyle}
              />
            </div>
          ))}

          {/* Atlar */}
          {Array.from({ length: AT_SAYISI }, (_, i) => {
            const a = i * (360 / AT_SAYISI);
            const kart = atKarti.get(i);
            const faz = ((((a + duruk) % 360) + 360) % 360 / 360) * TUR;
            const dunyaAcisi = ((a + duruk) * Math.PI) / 180;
            const yuz: VarStyle = {
              '--a': `${a + duruk}deg`,
              '--dd': `${-faz}s`,
              top: TENTE_ALT,
              height: PLATFORM - TENTE_ALT,
              transform: `rotateY(${-(a + duruk)}deg)`,
              opacity: 0.66 + 0.34 * Math.cos(dunyaAcisi)
            };
            return (
              <div key={`a${i}`} className="absolute [transform-style:preserve-3d]" style={{ transform: `rotateY(${a}deg) translateZ(var(--r))` }}>
                <div className="ak-face absolute w-[104px] -left-[52px]" style={yuz}>
                  <div className="absolute left-1/2 -ml-[1.5px] w-[3px] h-full bg-[linear-gradient(180deg,#FFF3DC,#F6C453,#B07A18)]" />
                  <div className="ak-bob absolute inset-x-0 top-[14px] flex flex-col items-center" style={{ '--b': `${-i * 0.55}s` } as VarStyle}>
                    {kart ? (
                      <div className="relative z-10 w-[100px] rounded-md border border-[#F6C453] bg-[#FFF6E6] px-1.5 py-1 text-center shadow-[0_4px_10px_rgba(0,0,0,0.4)]">
                        <p className="text-[8.5px] font-bold tracking-[0.18em] uppercase text-[#A3212A] truncate">{kart.label}</p>
                        <p className="text-[11.5px] font-semibold leading-tight text-[#14183A] break-words line-clamp-2">{kart.value}</p>
                        {kart.sub && <p className="text-[9px] leading-tight text-[#4A4E6E] truncate">{kart.sub}</p>}
                      </div>
                    ) : (
                      <div className="h-[30px]" />
                    )}
                    <div className="-mt-1">
                      <AtSiluet renk={EYER_RENKLERI[i]} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Gece göğü, yıldızlar ve üstte sarkan ampul dizisi. */
function KarincaBackdrop({ hareketli }: BackdropState & { hareketli: boolean }) {
  const ampuller = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12;
    return { x: 4 + t * 92, y: 6 + Math.sin(t * Math.PI) * 10 };
  });
  return (
    <div className={`absolute inset-0 bg-[linear-gradient(180deg,#050A1E_0%,#0A1230_50%,#1A1640_82%,#3A1A33_100%)] ${hareketli ? 'ak-run' : ''}`}>
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#FFF4DA_0.7px,transparent_1px)] bg-[size:38px_38px]" />
      <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="absolute top-0 inset-x-0 w-full h-[70px]" aria-hidden="true">
        <path d="M0 4 Q 50 24 100 4" stroke="#5A4A3A" strokeWidth="0.4" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      {ampuller.map((p, i) => (
        <span
          key={i}
          className="ak-bulb absolute w-2 h-2.5 -ml-1 rounded-full bg-[#FFE7A0] shadow-[0_0_10px_3px_rgba(255,190,90,0.6)]"
          style={{ left: `${p.x}%`, top: `${p.y * (70 / 24)}px`, '--b': `${-(i % 3) * 0.5}s` } as VarStyle}
        />
      ))}
      <div className="absolute bottom-0 inset-x-0 h-1/3 bg-[radial-gradient(ellipse_at_50%_100%,rgba(246,196,83,0.18),transparent_70%)]" />
    </div>
  );
}

function KarincaHero({ invitation, hareketli }: HeroRenderProps & { hareketli: boolean }) {
  const d = useHeroData(invitation);
  const kartlar = useMemo(() => kartlariKur(d, invitation), [d, invitation]);
  const rise = (delay: number) =>
    hareketli
      ? {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const }
        }
      : { initial: false as const };
  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-4 pt-14 pb-24 text-center">
      <motion.p {...rise(0.4)} className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-[#F6C453]">
        {d.title || KARINCA_FLAVOR.tagline}
      </motion.p>
      <h1 className="mt-4 font-cormorant italic font-semibold leading-[1] text-[#FFF3DC] text-[clamp(2.4rem,11cqw,4.8rem)] break-words max-w-full [text-shadow:0_0_22px_rgba(246,196,83,0.45)]">
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && <span className="block my-0.5 text-[0.45em] not-italic text-[#F6C453]">&amp;</span>}
              <motion.span {...rise(0.7 + i * 0.3)} className="block">
                {p}
              </motion.span>
            </React.Fragment>
          ))
        ) : (
          <motion.span {...rise(0.7)} className="block">
            {NO_NAMES}
          </motion.span>
        )}
      </h1>
      <motion.div {...rise(1.1)} className="mt-2 w-full max-w-[460px]">
        <AtliKarinca kartlar={kartlar} hareketli={hareketli} />
      </motion.div>
      <motion.div {...rise(1.5)} className="mt-2">
        <HeroCountdown
          invitation={invitation}
          cellClassName="min-w-[56px] rounded-lg border border-[#F6C453]/30 bg-[#131C45]/70 px-2 py-1.5"
          numberClassName="font-cormorant text-2xl text-[#FFE7A0]"
          labelClassName="text-[10px] text-[#C9C7DC]"
        />
      </motion.div>
      {d.subtitle && (
        <motion.p {...rise(1.8)} className="mt-6 max-w-md font-cormorant italic text-lg text-[#E6E1EE]">
          {d.subtitle}
        </motion.p>
      )}
    </div>
  );
}

/**
 * SunnetAtliKarinca — "Atlı Karınca": CSS 3D bir lunapark atlı karıncası.
 * Çizgili tente, yanıp sönen ampuller, orta direk ve direklerinde inip kalkan
 * altı at; atların sırtındaki kartlar tarih, saat, mekân ve programı taşır.
 * Önizlemede ve "hareketi azalt" tercihinde halka duruktur.
 */
export function SunnetAtliKarinca({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  const hareketli = mode === 'live' && !reduced;
  return (
    <>
      <KarincaStyles />
      <InvitationComposition
        invitation={invitation}
        flavor={KARINCA_FLAVOR}
        mode={mode}
        themeOverride={KARINCA_TEMASI}
        renderBackdrop={(state) => <KarincaBackdrop {...state} hareketli={hareketli} />}
        renderHero={(props) => <KarincaHero {...props} hareketli={hareketli} />}
      />
    </>
  );
}
