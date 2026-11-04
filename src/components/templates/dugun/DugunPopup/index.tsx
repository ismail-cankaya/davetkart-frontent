import React from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';
import { Agac, Cift, Cimen, Gokyuzu, Kemer, Tepeler } from './katmanlar';

const POPUP_TEMASI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#F3EADF] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#3B3245]',
  surface: 'bg-[#FFFBF5] shadow-[0_14px_30px_-18px_rgba(59,50,69,0.45),0_2px_0_#E8DCCB]',
  border: 'border-[#3B3245]/10',
  heading: 'text-[#2B2433]',
  body: 'text-[#5E5466]',
  accent: 'text-[#B0546A]',
  accentBg: 'bg-[#B0546A]',
  accentSoft: 'bg-[#E79AA6]/15',
  input:
    'w-full bg-white border border-[#3B3245]/15 rounded-lg px-3.5 py-2.5 text-sm text-[#2B2433] placeholder:text-[#8C8294] focus:outline-none focus:border-[#B0546A] focus:ring-2 focus:ring-[#E79AA6]/30 transition-all duration-300',
  buttonPrimary: 'bg-[#3B3245] hover:bg-[#B0546A] text-[#FFFBF5] shadow-[0_4px_0_#2B2433] active:translate-y-[2px] active:shadow-[0_2px_0_#2B2433]',
  buttonGhost: 'border border-[#3B3245]/25 text-[#3B3245] hover:bg-[#3B3245]/5',
  divider: 'bg-[#3B3245]/10',
  timelineLine: 'from-[#B0546A] via-[#E79AA6]/50 to-transparent',
  envelope: {
    paper: 'bg-[#F6D9CF]',
    flap: 'bg-[#EFC9BC]',
    seal: 'bg-[#B0546A] text-[#FFFBF5]',
    glow: 'bg-[#E79AA6]/25',
    card: 'bg-[#FFFBF5] border border-[#E8DCCB]'
  },
  mapHeader: 'bg-[#E8DCCB]',
  footer: { names: 'text-[#5E5466]', branding: 'text-[#5E5466]' }
};

const POPUP_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Açın, hikâyemiz ayağa kalksın',
  headings: { timeline: 'Günün Akışı', details: 'Nerede, Ne Zaman', gallery: 'Bizden Kareler', gift: 'Takı & Hediye', rsvp: 'Katılımınızı Bildirin' }
};

interface LayerSpec {
  key: string;
  /** Tabanın zemindeki yeri (derinlik, 0 arka → 1 ön). */
  base: number;
  /** Genişliğe göre yükseklik. */
  h: number;
  left: number;
  width: number;
  delay: number;
  node: React.ReactNode;
}

const LAYERS: LayerSpec[] = [
  { key: 'gok', base: 0, h: 0.62, left: 0, width: 1, delay: 0.35, node: <Gokyuzu /> },
  { key: 'tepe', base: 0.16, h: 0.3, left: 0, width: 1, delay: 0.55, node: <Tepeler /> },
  { key: 'kemer', base: 0.38, h: 0.6, left: 0.12, width: 0.76, delay: 0.75, node: <Kemer /> },
  { key: 'agac-sol', base: 0.5, h: 0.48, left: -0.02, width: 0.3, delay: 0.9, node: <Agac /> },
  { key: 'agac-sag', base: 0.54, h: 0.44, left: 0.72, width: 0.3, delay: 1.0, node: <Agac flip /> },
  { key: 'cift', base: 0.62, h: 0.44, left: 0.34, width: 0.32, delay: 1.15, node: <Cift /> },
  { key: 'cimen', base: 0.9, h: 0.13, left: 0, width: 1, delay: 1.3, node: <Cimen /> }
];

/** Bir kâğıt katmanı: açılışta yaylı kalkar (iç), kaydırınca katlanır (dış). */
function PaperLayer({ spec, depth, width, fold, reduced }: { spec: LayerSpec; depth: number; width: number; fold: MotionValue<number>; reduced: boolean }) {
  const h = spec.h * width;
  const down = useTransform(fold, (f) => f * 90);
  return (
    <motion.div
      className="absolute origin-bottom [transform-style:preserve-3d]"
      style={{ left: spec.left * width, width: spec.width * width, height: h, top: spec.base * depth - h, rotateX: down }}
    >
      <motion.div
        className="absolute inset-0 origin-bottom [filter:drop-shadow(0_6px_6px_rgba(59,50,69,0.25))]"
        initial={reduced ? { rotateX: -90 } : { rotateX: 0 }}
        animate={{ rotateX: -90 }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 70, damping: 9, mass: 0.9, delay: spec.delay }}
      >
        {spec.node}
      </motion.div>
    </motion.div>
  );
}

function PopupHero({ invitation, scrollContainer }: HeroRenderProps) {
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const { scrollY } = useScroll({ container: scrollContainer });
  // Kaydırınca katmanlar yeniden yatar, kart kapanır gibi eğilir.
  const fold = useTransform(scrollY, [0, 520], [0, reduced ? 0 : 1], { clamp: true });
  const tilt = useTransform(scrollY, [0, 520], [58, reduced ? 58 : 72]);
  const width = 340;
  const depth = width * 0.72;

  const fade = (delay: number) =>
    reduced ? { initial: false as const } : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay } };

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-5 pt-12 pb-12 text-center overflow-hidden">
      {d.title && (
        <motion.p {...fade(0.2)} className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-[#B0546A]">
          {d.title}
        </motion.p>
      )}
      {/* Sahne: ölçü sabit (340 px) ve dar ekranda ölçeklenir; 3B dönüşümler px ister. */}
      <div className="relative mt-2 w-full max-w-[460px] h-[300px] sm:h-[340px] [perspective:900px]">
        <div className="absolute left-1/2 top-[64%] -translate-x-1/2 scale-[0.92] sm:scale-110 origin-top">
          <motion.div
            className="relative [transform-style:preserve-3d]"
            style={{ width, height: depth, rotateX: tilt, marginTop: -depth * 0.25 }}
            initial={reduced ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Kartın zemin yarısı */}
            <div className="absolute inset-0 rounded-[6px] bg-[#FBF6EE] shadow-[0_30px_50px_-20px_rgba(59,50,69,0.5)]">
              <div className="absolute inset-x-0 top-0 h-px bg-[#D9CBB8]" />
              <div className="absolute inset-0 rounded-[6px] bg-[radial-gradient(#E8DCCB_1px,transparent_1.2px)] bg-[size:14px_14px] opacity-60" />
            </div>
            {LAYERS.map((l) => (
              <PaperLayer key={l.key} spec={l} depth={depth} width={width} fold={fold} reduced={reduced} />
            ))}
          </motion.div>
        </div>
      </div>
      <h1 className="relative z-10 mt-4 font-cormorant font-semibold italic leading-[0.98] text-[#2B2433] text-[clamp(2.5rem,11cqw,4.4rem)] break-words max-w-full">
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && (
                <motion.span {...fade(1.75)} className="inline-block mx-3 text-[0.6em] not-italic text-[#B0546A]">
                  &amp;
                </motion.span>
              )}
              <motion.span {...fade(1.6 + i * 0.3)} className="inline-block">
                {p}
              </motion.span>
            </React.Fragment>
          ))
        ) : (
          <motion.span {...fade(1.6)}>{NO_NAMES}</motion.span>
        )}
      </h1>
      {(d.date.day || d.venue) && (
        <motion.p {...fade(2.1)} className="mt-4 text-sm text-[#5E5466]">
          {[d.date.weekday, d.date.day, d.date.time].filter(Boolean).join(' · ')}
          {d.venue && <span className="block mt-1 font-medium text-[#3B3245]">{d.venue}</span>}
        </motion.p>
      )}
      <motion.div {...fade(2.4)} className="mt-6">
        <HeroCountdown
          invitation={invitation}
          className="rounded-2xl bg-[#FFFBF5] px-4 py-3 shadow-[0_10px_24px_-16px_rgba(59,50,69,0.5),0_2px_0_#E8DCCB]"
          numberClassName="font-cormorant font-semibold text-[#2B2433]" labelClassName="text-[#8C8294]" />
      </motion.div>
      {d.subtitle && (
        <motion.p {...fade(2.6)} className="mt-6 max-w-md font-cormorant italic text-lg text-[#5E5466]">
          {d.subtitle}
        </motion.p>
      )}
    </div>
  );
}

function PopupBackdrop() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#FBF3EA_0%,#F3EADF_60%,#EADCCB_100%)]">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#E79AA6_1px,transparent_1.4px),radial-gradient(#9DB48D_1px,transparent_1.4px)] bg-[size:56px_56px,56px_56px] bg-[position:0_0,28px_28px]" />
    </div>
  );
}

/**
 * DugunPopup — "Pop-up Kart": açılışta kâğıt katmanlar (gökyüzü, tepeler,
 * çiçekli kemer, ağaçlar, çift silueti, çimen) yaylı bir 2.5B hareketle
 * ayağa kalkar; kaydırınca yeniden yatar. Saf CSS 3D (perspective + rotateX).
 */
export function DugunPopup({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={POPUP_FLAVOR}
      mode={mode}
      themeOverride={POPUP_TEMASI}
      renderBackdrop={() => <PopupBackdrop />}
      renderHero={(props) => <PopupHero {...props} />}
    />
  );
}
