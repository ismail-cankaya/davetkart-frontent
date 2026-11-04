import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import type { Invitation } from '../../../../types';
import { Details } from '../../shared/Details';
import { Gallery } from '../../shared/Gallery';
import { GiftRegistry } from '../../shared/GiftRegistry';
import { RSVPForm } from '../../shared/RSVPForm';
import { Timeline } from '../../shared/Timeline';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { KITAP_TEMASI, KitapKok, romen } from '../../konsept/kitap';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';
import { Kitap, type Leaf } from './Kitap';
import { Buket, ChapterHead, Cloth, Endpaper, Face, Fener, GUL, Kuslar, SOLUK, Vignette, YALDIZ, Yuzukler } from './sayfalar';

/** Bölümler sayfaya sığsın: ortak bölümlerin dolgusu sayfa ölçüsüne iner. */
const SAYFA_ICI = '[&_section]:px-0 [&_section]:py-3';
/** İçindekiler düzeninde program kaydırmayı izlemez; ortak imza için boş ref. */
const NO_SCROLL: React.RefObject<HTMLDivElement | null> = { current: null };
const ILLUSTRASYONLAR = [Kuslar, Yuzukler, Fener, Buket];
const SOZLER = [
  'Ve hikâye burada yeni bir sayfaya geçiyor.',
  'İki yol, tek bir yön.',
  'Işığımız yolunuzu aydınlatsın.',
  'Her sayfada biraz daha çiçek.'
];

function Cover({ d }: { d: HeroData }) {
  return (
    <Cloth side="front">
      <div className="absolute inset-0 flex flex-col items-center justify-center px-9 text-center text-[#E9CF95] [text-shadow:0_-1px_0_rgba(0,0,0,0.35)]">
        <p className="text-[10px] tracking-[0.42em] uppercase opacity-90">Bir Aşk Hikâyesi</p>
        <svg viewBox="0 0 80 40" className="w-16 h-8 mt-5" aria-hidden="true">
          <path d="M40 34 C 20 22, 14 8, 26 6 C 33 5, 38 10, 40 14 C 42 10, 47 5, 54 6 C 66 8, 60 22, 40 34 Z" fill="none" stroke={YALDIZ} strokeWidth="1.6" />
          <path d="M6 20 H 18 M62 20 H 74" stroke={YALDIZ} strokeWidth="1" />
        </svg>
        <h1 className="mt-5 [font-family:var(--kt-baslik-font)] text-[clamp(2rem,11cqw,2.9rem)] leading-[1.05] break-words">
          {d.hasNames
            ? d.people.map((p, i) => (
                <span key={p + i} className="block">
                  {i > 0 && <span className="block text-[0.55em] my-1 italic">&amp;</span>}
                  {p}
                </span>
              ))
            : NO_NAMES}
        </h1>
        {d.date.year && <p className="mt-7 text-sm tracking-[0.3em]">{d.date.year}</p>}
      </div>
    </Cloth>
  );
}

function Story({ d }: { d: HeroData }) {
  const first = d.subtitle.charAt(0);
  return (
    <Face side="front" number={1} head={d.people.join(' & ') || NO_NAMES}>
      <div className="h-full flex flex-col justify-center">
        <ChapterHead numeral="I" title={d.title || 'Hikâyemiz'} />
        <p className="text-center italic text-[15px]" style={{ color: SOLUK }}>
          Bir varmış, bir yokmuş…
        </p>
        <p className="mt-4 text-center [font-family:var(--kt-baslik-font)] text-[1.9rem] leading-tight break-words">
          {d.hasNames ? d.people.join(' & ') : NO_NAMES}
        </p>
        {d.subtitle && (
          <p className="mt-5 text-[15px] leading-relaxed text-justify [hyphens:auto]">
            <span className="float-left mr-2 mt-1 text-[3.1rem] leading-[0.8] [font-family:var(--kt-baslik-font)]" style={{ color: GUL }}>
              {first}
            </span>
            {d.subtitle.slice(1)}
          </p>
        )}
        <Kuslar className="mt-5 mx-auto w-40 h-auto" />
      </div>
    </Face>
  );
}

function Colophon({ invitation, number }: { invitation: Invitation; number: number }) {
  return (
    <Face side="front" number={number}>
      <div className="h-full flex flex-col items-center justify-center text-center">
        <Buket className="w-28 h-auto" />
        <p className="mt-6 italic text-[17px] leading-relaxed max-w-[15rem]">Hikâyemizin devamını birlikte yazmak dileğiyle.</p>
        <p className="mt-3 text-[11px] tracking-[0.3em] uppercase" style={{ color: GUL }}>
          Son
        </p>
        <footer className="mt-10">
          <p className="text-[11px] font-medium tracking-[0.2em]" style={{ color: SOLUK }}>
            {invitation.names || 'DavetKart'}
          </p>
          {invitation.showBranding !== false && (
            <p className="text-[9px] mt-1.5" style={{ color: SOLUK }}>
              DavetKart ile hazırlandı
            </p>
          )}
        </footer>
      </div>
    </Face>
  );
}

/** Bölümlerin sırası; her biri yalnızca verisi varsa bir yaprak olur. */
function useLeaves(invitation: Invitation, d: HeroData): Leaf[] {
  return useMemo(() => {
    const theme = KITAP_TEMASI;
    const sections: { key: string; label: string; content: React.ReactNode }[] = [];
    const hasDetails = Boolean(d.date.day || d.venue || invitation.mapUrl?.trim());
    const hasTimeline = invitation.showTimeline && invitation.timelineEvents.some((e) => e.title?.trim() || e.time?.trim());
    const hasGallery = invitation.showGallery && invitation.galleryImages.length > 0;

    const chapters: string[] = [];
    if (hasDetails) chapters.push('details');
    if (hasTimeline) chapters.push('timeline');
    if (hasGallery) chapters.push('gallery');
    if (invitation.showGift) chapters.push('gift');
    if (invitation.showRSVP) chapters.push('rsvp');
    const eyebrow = (k: string) => `Bölüm ${romen(chapters.indexOf(k) + 2)}`;
    const flavor: TemplateFlavor = {
      ...DUGUN_FLAVOR,
      BackgroundPattern: undefined,
      headings: { timeline: 'Günün Akışı', details: 'Tarih & Mekân', gallery: 'Resimli Sayfalar', gift: 'Armağan', rsvp: 'Lütfen Cevap Veriniz' },
      eyebrows: { timeline: eyebrow('timeline'), details: eyebrow('details'), gallery: eyebrow('gallery'), gift: eyebrow('gift'), rsvp: eyebrow('rsvp') }
    };

    if (hasDetails)
      sections.push({
        key: 'details',
        label: 'Tarih ve mekân',
        content: (
          <>
            <Details invitation={invitation} theme={theme} flavor={flavor} />
            <HeroCountdown
              invitation={invitation}
              className="mt-1"
              numberClassName="[font-family:var(--kt-baslik-font)] text-[1.7rem] text-[#2B2118]"
              labelClassName="text-[#6B5A45]"
            />
          </>
        )
      });
    if (hasTimeline)
      sections.push({ key: 'timeline', label: 'Program', content: <Timeline invitation={invitation} theme={theme} flavor={flavor} scrollContainer={NO_SCROLL} /> });
    if (hasGallery)
      sections.push({
        key: 'gallery',
        label: 'Galeri',
        content: (
          <div data-no-flip>
            <Gallery invitation={invitation} theme={theme} flavor={flavor} />
          </div>
        )
      });
    if (invitation.showGift)
      sections.push({ key: 'gift', label: 'Hediye', content: <GiftRegistry invitation={invitation} theme={theme} flavor={flavor} /> });
    if (invitation.showRSVP)
      sections.push({ key: 'rsvp', label: 'Katılım bildirimi', content: <RSVPForm invitation={invitation} theme={theme} flavor={flavor} /> });

    const head = d.people.join(' & ');
    const leaves: Leaf[] = [
      { key: 'kapak', label: 'Kapak', front: <Cover d={d} />, back: <Endpaper side="back" /> },
      {
        key: 'hikaye',
        label: 'Hikâye',
        front: <Story d={d} />,
        back: (
          <Vignette number={2} caption={SOZLER[0]}>
            <Kuslar className="w-44 h-auto" />
          </Vignette>
        )
      }
    ];
    sections.forEach((s, i) => {
      const Art = ILLUSTRASYONLAR[(i + 1) % ILLUSTRASYONLAR.length];
      const front = 3 + i * 2;
      leaves.push({
        key: s.key,
        label: s.label,
        front: (
          <Face side="front" number={front} head={head} scroll className={SAYFA_ICI}>
            {s.content}
          </Face>
        ),
        back: (
          <Vignette number={front + 1} caption={SOZLER[(i + 1) % SOZLER.length]}>
            <Art className="w-36 h-auto" />
          </Vignette>
        )
      });
    });
    leaves.push({
      key: 'son',
      label: 'Son sayfa',
      front: <Colophon invitation={invitation} number={3 + sections.length * 2} />,
      back: <Cloth side="back" />
    });
    return leaves;
  }, [invitation, d]);
}

/**
 * DugunKitapSayfa — "Kitap Sayfaları": düz illüstrasyonlu, gerçek bir kitap.
 * Kapak kendiliğinden açılır; sayfalar köşeden tutulup sürüklenerek, tekerlek
 * ya da ok tuşlarıyla, kenara dokunarak çevrilir. Kıvrım 2D: clip-path ile
 * kırpılan ön yüz ve katlama çizgisine göre yansıtılan arka yüz.
 */
export function DugunKitapSayfa({ invitation, mode = 'preview' }: TemplateProps) {
  const d = useHeroData(invitation);
  const leaves = useLeaves(invitation, d);
  const reduced = useReducedMotion() ?? false;
  const [turned, setTurned] = useState(0);

  return (
    <KitapKok>
      <div
        data-mode={mode}
        className={cn(
          KITAP_TEMASI.base,
          'relative w-full h-full overflow-hidden @container bg-[#241812]',
          'bg-[radial-gradient(ellipse_at_50%_35%,#5A4030_0%,#33231A_55%,#1A110C_100%)]'
        )}
      >
        {/* Masa ışığı */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(60%_45%_at_50%_42%,rgba(255,214,150,0.16),transparent_70%)]" />
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: turned > 1 ? 0 : 0.85 }}
          transition={{ duration: 0.8, delay: reduced ? 0 : 2.4 }}
          className="absolute top-3 inset-x-0 text-center text-[10px] tracking-[0.3em] uppercase text-[#E9D9C4] pointer-events-none"
        >
          Köşeden tutup çevirin
        </motion.p>
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0, y: 40, scale: 0.92, rotateX: 18 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformPerspective: 1400 }}
        >
          <Kitap leaves={leaves} autoOpen={!reduced} reduced={reduced} onPageChange={setTurned} />
        </motion.div>
      </div>
    </KitapKok>
  );
}
