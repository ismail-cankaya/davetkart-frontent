import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { NISAN_FLAVOR } from '../flavors';

/* Palet: kâğıt #F6F0E2, mürekkep #1E2333, kırmızı kalem #C2412D. */

/** Bir kelimede en fazla harf (ızgara 390 px'e sığsın diye). */
const MAX_HARF = 14;
/** Izgaranın en geniş hâli (px) ve hücre sınırları. */
const IZGARA_EN = 330;
const HUCRE_MAX = 34;
const HUCRE_MIN = 16;

const BULMACA_TEMASI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#F6F0E2] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#1E2333]',
  surface: 'bg-[#FFFDF7] shadow-[4px_4px_0_0_rgba(30,35,51,0.9)]',
  border: 'border-[#1E2333]',
  heading: 'text-[#1E2333]',
  body: 'text-[#3E4356]',
  accent: 'text-[#C2412D]',
  accentBg: 'bg-[#C2412D]',
  accentSoft: 'bg-[#C2412D]/10',
  input:
    'w-full bg-[#FFFDF7] border-2 border-[#1E2333] rounded-none px-3.5 py-2.5 text-sm text-[#1E2333] placeholder:text-[#8A8C98] focus:outline-none focus:border-[#C2412D] transition-colors duration-300',
  buttonPrimary: 'bg-[#1E2333] hover:bg-[#C2412D] text-[#F6F0E2] rounded-none',
  buttonGhost: 'border-2 border-[#1E2333] text-[#1E2333] hover:bg-[#1E2333]/5 rounded-none',
  divider: 'bg-[#1E2333]/25',
  timelineLine: 'from-[#1E2333] via-[#1E2333]/40 to-transparent',
  envelope: {
    paper: 'bg-[#EFE6D0]',
    flap: 'bg-[#1E2333]',
    seal: 'bg-[#C2412D] text-[#F6F0E2]',
    glow: 'bg-[#C2412D]/25',
    card: 'bg-[#FFFDF7] border-2 border-[#1E2333]'
  },
  mapHeader: 'bg-[#EFE6D0]',
  footer: { names: 'text-[#3E4356]', branding: 'text-[#8A8C98]' }
};

const BULMACA_FLAVOR: TemplateFlavor = {
  ...NISAN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Soldan sağa: söz verdik',
  headings: {
    timeline: 'Yukarıdan Aşağıya: Program',
    details: 'Soldan Sağa: Adres',
    gallery: 'Çözüm Kareleri',
    gift: 'Armağan',
    rsvp: 'Son Kare: Katılımınız'
  }
};

/* ——— Yerleşim ——— */

interface Kelime {
  harfler: string[];
  satir: number;
  sutun: number;
  dikey: boolean;
  /** Kesişim hücresinde ikinci kelime harfi tekrar çizmez. */
  atla?: number;
}

interface Hucre {
  key: string;
  harf: string;
  satir: number;
  sutun: number;
  /** Uçuş sırası. */
  sira: number;
  /** Kelimenin ilk hücresi ise numarası. */
  no?: number;
  tarih: boolean;
}

interface Bulmaca {
  hucreler: Hucre[];
  satirSayisi: number;
  sutunSayisi: number;
}

/** Harf dizisi: Türkçe büyük harf, yalnız harf/rakam; uzun adlar kesilir. */
function harfle(metin: string): string[] {
  return Array.from(metin.toLocaleUpperCase('tr-TR').replace(/[^\p{L}\p{N}]/gu, '')).slice(0, MAX_HARF);
}

/** "2027-06-12…" → "12.06.2027"; ayrıştırılamazsa boş. */
function tarihKelimesi(date: string | null | undefined): string[] {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec((date ?? '').trim());
  return m ? Array.from(`${m[3]}.${m[2]}.${m[1]}`) : [];
}

/**
 * Deterministik yerleşim: 1. ad yatay (0,0). 2. ad ilk ortak harfte dikey
 * keser; ortak harf yoksa iki satır alta yatay yazılır. Tarih en alttaki
 * satırın iki altına yatay gelir. Sonra koordinatlar sıfıra kaydırılır.
 */
function yerlestir(a: string[], b: string[], t: string[]): Bulmaca {
  const kelimeler: Kelime[] = [];
  if (a.length) kelimeler.push({ harfler: a, satir: 0, sutun: 0, dikey: false });
  if (b.length) {
    let kesisim: { i: number; j: number } | null = null;
    if (a.length) {
      for (let i = 0; i < a.length && !kesisim; i++) {
        const j = b.indexOf(a[i]);
        if (j >= 0) kesisim = { i, j };
      }
    }
    if (kesisim) kelimeler.push({ harfler: b, satir: -kesisim.j, sutun: kesisim.i, dikey: true, atla: kesisim.j });
    else kelimeler.push({ harfler: b, satir: a.length ? 2 : 0, sutun: 0, dikey: false });
  }
  if (t.length) {
    const alt = kelimeler.reduce((m, k) => Math.max(m, k.satir + (k.dikey ? k.harfler.length - 1 : 0)), -2);
    kelimeler.push({ harfler: t, satir: alt + 2, sutun: 0, dikey: false });
  }

  let minS = Infinity, minC = Infinity, maxS = -Infinity, maxC = -Infinity;
  for (const k of kelimeler) {
    const sonS = k.satir + (k.dikey ? k.harfler.length - 1 : 0);
    const sonC = k.sutun + (k.dikey ? 0 : k.harfler.length - 1);
    minS = Math.min(minS, k.satir); minC = Math.min(minC, k.sutun);
    maxS = Math.max(maxS, sonS); maxC = Math.max(maxC, sonC);
  }
  if (!kelimeler.length) return { hucreler: [], satirSayisi: 0, sutunSayisi: 0 };

  const hucreler: Hucre[] = [];
  let sira = 0;
  kelimeler.forEach((k, ki) => {
    k.harfler.forEach((harf, i) => {
      if (k.atla === i) return;
      const satir = k.satir - minS + (k.dikey ? i : 0);
      const sutun = k.sutun - minC + (k.dikey ? 0 : i);
      hucreler.push({ key: `${ki}-${i}`, harf, satir, sutun, sira: sira++, no: i === 0 ? ki + 1 : undefined, tarih: k.harfler === t });
    });
  });
  return { hucreler, satirSayisi: maxS - minS + 1, sutunSayisi: maxC - minC + 1 };
}

/** Sabit (rastgele olmayan) uçuş başlangıcı. */
function ucus(n: number) {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  const r = s - Math.floor(s);
  const aci = r * Math.PI * 2;
  return { x: Math.cos(aci) * 180, y: Math.sin(aci) * 220 - 60, rotate: (r - 0.5) * 140 };
}

function Izgara({ bulmaca, hareketli }: { bulmaca: Bulmaca; hareketli: boolean }) {
  const { hucreler, satirSayisi, sutunSayisi } = bulmaca;
  const boyut = Math.max(HUCRE_MIN, Math.min(HUCRE_MAX, Math.floor(IZGARA_EN / Math.max(1, sutunSayisi))));
  const dolu = new Set(hucreler.map((h) => `${h.satir}:${h.sutun}`));
  const bos: { satir: number; sutun: number }[] = [];
  for (let s = 0; s < satirSayisi; s++) for (let c = 0; c < sutunSayisi; c++) if (!dolu.has(`${s}:${c}`)) bos.push({ satir: s, sutun: c });

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto border-2 border-[#1E2333] bg-[#1E2333] shadow-[6px_6px_0_0_rgba(194,65,45,0.85)]"
      style={{ width: sutunSayisi * boyut + 4, height: satirSayisi * boyut + 4 }}
    >
      {bos.map((b) => (
        <div
          key={`b${b.satir}:${b.sutun}`}
          className="absolute bg-[repeating-linear-gradient(45deg,#1E2333_0_3px,#2A3044_3px_6px)]"
          style={{ left: b.sutun * boyut, top: b.satir * boyut, width: boyut, height: boyut }}
        />
      ))}
      {hucreler.map((h) => {
        const u = ucus(h.sira + 1);
        return (
          <div
            key={h.key}
            className="absolute border border-[#1E2333] bg-[#FFFDF7]"
            style={{ left: h.sutun * boyut, top: h.satir * boyut, width: boyut, height: boyut }}
          >
            {h.no !== undefined && boyut >= 22 && (
              <span className="absolute left-[2px] top-0 text-[8px] leading-[10px] font-semibold text-[#3E4356]">{h.no}</span>
            )}
            <motion.span
              className={`absolute inset-0 flex items-center justify-center font-bold font-mono leading-none ${h.tarih ? 'text-[#C2412D]' : 'text-[#1E2333]'}`}
              style={{ fontSize: Math.round(boyut * 0.56) }}
              {...(hareketli
                ? {
                    initial: { opacity: 0, x: u.x, y: u.y, rotate: u.rotate, scale: 1.6 },
                    animate: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
                    transition: { delay: 0.5 + h.sira * 0.07, type: 'spring' as const, stiffness: 170, damping: 17 }
                  }
                : { initial: false as const })}
            >
              {h.harf}
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}

function BulmacaBackdrop() {
  return (
    <div className="absolute inset-0 bg-[#F6F0E2]">
      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(#1E2333_1px,transparent_1px),linear-gradient(90deg,#1E2333_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(246,240,226,0)_0%,rgba(214,200,170,0.45)_100%)]" />
    </div>
  );
}

function BulmacaHero({ invitation, hareketli }: HeroRenderProps & { hareketli: boolean }) {
  const d = useHeroData(invitation);
  const bulmaca = useMemo(() => {
    const [p1 = '', p2 = ''] = d.hasNames ? d.people : [NO_NAMES];
    return yerlestir(harfle(p1), harfle(p2), tarihKelimesi(invitation.date));
  }, [d.hasNames, d.people, invitation.date]);
  const adSayisi = d.hasNames ? d.people.length : 1;
  const ipuclari = [
    ...(d.hasNames ? d.people.map((p, i) => `${i + 1} · ${p}`) : []),
    tarihKelimesi(invitation.date).length ? `${adSayisi + 1} · ${[d.date.weekday, d.date.dayMonth || d.date.day, d.date.year].filter(Boolean).join(' ')}` : ''
  ].filter(Boolean);
  const rise = (delay: number) =>
    hareketli
      ? {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const }
        }
      : { initial: false as const };

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-4 pt-14 pb-24 text-center text-[#1E2333]">
      <motion.p {...rise(0.2)} className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-[#C2412D] font-semibold">
        {d.title || BULMACA_FLAVOR.tagline}
      </motion.p>
      <h1 className="sr-only">{d.hasNames ? d.people.join(' & ') : NO_NAMES}</h1>
      {bulmaca.hucreler.length > 0 && (
        <div className="mt-6 w-full max-w-[340px] py-2">
          <Izgara bulmaca={bulmaca} hareketli={hareketli} />
        </div>
      )}
      {ipuclari.length > 0 && (
        <motion.ul
          {...rise(hareketli ? 0.8 + bulmaca.hucreler.length * 0.07 : 0)}
          className="mt-6 w-full max-w-[320px] text-left border-t-2 border-[#1E2333] pt-2 space-y-1 font-mono text-[12px] text-[#3E4356]"
        >
          {ipuclari.map((x) => (
            <li key={x} className="break-words">{x}</li>
          ))}
          {d.date.time && <li>Saat: {d.date.time}</li>}
          {d.venue && <li className="break-words">Yer: {d.venue}</li>}
        </motion.ul>
      )}
      <motion.div {...rise(hareketli ? 1.2 + bulmaca.hucreler.length * 0.07 : 0)} className="mt-6">
        <HeroCountdown
          invitation={invitation}
          cellClassName="min-w-[56px] border-2 border-[#1E2333] bg-[#FFFDF7] px-2 py-1.5"
          numberClassName="font-mono font-bold text-2xl text-[#1E2333]"
          labelClassName="text-[10px] text-[#3E4356]"
        />
      </motion.div>
      {d.subtitle && (
        <motion.p {...rise(1.4)} className="mt-6 max-w-md font-cormorant italic text-lg text-[#3E4356]">
          {d.subtitle}
        </motion.p>
      )}
    </div>
  );
}

/**
 * NisanBulmaca — "Bulmaca": gazete bulmacası ızgarasında çiftin adları
 * kesişen kelimeler olarak, tarih ise kırmızı rakamlarla belirir; harfler
 * dağınık yerlerden uçarak hücrelerine oturur. Önizlemede ve "hareketi
 * azalt" tercihinde ızgara çözülmüş hâliyle durur.
 */
export function NisanBulmaca({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  const hareketli = mode === 'live' && !reduced;
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={BULMACA_FLAVOR}
      mode={mode}
      themeOverride={BULMACA_TEMASI}
      renderBackdrop={() => <BulmacaBackdrop />}
      renderHero={(props) => <BulmacaHero {...props} hareketli={hareketli} />}
    />
  );
}
