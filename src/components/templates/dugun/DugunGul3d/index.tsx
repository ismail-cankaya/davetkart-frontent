import React, { lazy } from 'react';
import { motion, useReducedMotion, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { GyroButton, ThreeStage } from '../../shared/three';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';

/** three.js ve sahne ayrı chunk: kart HTML'i sahne inmeden çizilir. */
const GulSahnesi = lazy(() => import('./GulSahnesi'));

const GUL_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#1A0A10] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-medium',
  page: 'text-[#F6E7E1]',
  surface: 'bg-[#2A0F18]/80 backdrop-blur-md',
  border: 'border-[#F2C7C2]/15',
  heading: 'text-[#FFF1EC]',
  body: 'text-[#E5C9C4]',
  accent: 'text-[#F2B8B0]',
  accentBg: 'bg-[#E8A0A8]',
  accentSoft: 'bg-[#E8A0A8]/10',
  input:
    'w-full bg-[#1A0A10]/60 border border-[#F2C7C2]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#FFF1EC] placeholder:text-[#C9A9A4] focus:outline-none focus:border-[#E8A0A8] focus:ring-2 focus:ring-[#E8A0A8]/20 transition-all duration-300',
  buttonPrimary: 'bg-[#E8A0A8] hover:bg-[#F2C7C2] text-[#2A0F18] shadow-lg shadow-[#9E1B32]/30',
  buttonGhost: 'border border-[#F2C7C2]/30 text-[#F6E7E1] hover:bg-white/5 hover:border-[#F2C7C2]/50',
  divider: 'bg-[#F2C7C2]/15',
  timelineLine: 'from-[#E8A0A8]/80 via-[#E8A0A8]/40 to-transparent',
  envelope: {
    paper: 'bg-[#F6E3DC]',
    flap: 'bg-[#EBCFC5]',
    seal: 'bg-[#9E1B32] text-[#FFF1EC]',
    glow: 'bg-[#E8A0A8]/25',
    card: 'bg-[#FFF9F4] border border-[#E7C9B5]'
  },
  mapHeader: 'bg-[#3A1420]',
  footer: { names: 'text-[#E5C9C4]', branding: 'text-[#C9A9A4]' }
};

const GUL_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Gül bahçesinde evleniyoruz',
  headings: {
    timeline: 'Günün Akışı',
    details: 'Bahçemizin Adresi',
    gallery: 'Bizden Kareler',
    gift: 'Takı & Hediye',
    rsvp: 'Gelişinizi Bildirin'
  }
};

/** Statik gül: sarmal elips taç yaprakları (WebGL yoksa, yüklenirken ve hareketi azaltınca altta). */
function SvgRose({ className, color }: { className: string; color: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => {
        const r = 8 + i * 3.2;
        return (
          <ellipse
            key={i}
            rx={r}
            ry={r * 0.72}
            transform={`rotate(${i * 137.5})`}
            fill={color}
            fillOpacity={0.22 + (12 - i) * 0.05}
            stroke="#2A0F18"
            strokeOpacity={0.35}
            strokeWidth={0.8}
          />
        );
      })}
    </svg>
  );
}

function GulStatik() {
  return (
    <div className="absolute inset-0">
      <SvgRose className="absolute -top-10 -left-10 w-48 h-48 sm:w-72 sm:h-72" color="#B8314A" />
      <SvgRose className="absolute -bottom-12 -right-10 w-52 h-52 sm:w-80 sm:h-80" color="#9E1B32" />
      <SvgRose className="absolute top-8 -right-8 w-28 h-28 sm:w-40 sm:h-40" color="#E8A0A8" />
      <SvgRose className="absolute bottom-10 -left-6 w-24 h-24 sm:w-36 sm:h-36" color="#D9667A" />
    </div>
  );
}

function GulBackdrop({ revealed, heroExit, mode }: BackdropState & { mode: 'preview' | 'live' }) {
  const dim = useTransform(heroExit, [0, 1], [0, 0.6]);
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#4A1424_0%,#2A0D16_45%,#14070B_100%)]" />
      <ThreeStage mode={mode} fallback={<GulStatik />}>
        {(stage) => <GulSahnesi {...stage} revealed={revealed} heroExit={heroExit} />}
      </ThreeStage>
      <motion.div className="absolute inset-0 bg-[#12060A]" style={{ opacity: dim }} />
    </>
  );
}

function GulHero({ invitation, scrollContainer, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const appear = (delay: number) =>
    reduced
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const }
        };

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-5 pt-16 pb-10">
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.78, y: 40, filter: 'blur(12px)' }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.4, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[19.5rem] sm:max-w-[25rem] rounded-[30px] bg-[#FFF9F4]/95 text-[#3B1420] px-7 py-10 sm:px-10 sm:py-12 text-center shadow-[0_40px_90px_-25px_rgba(0,0,0,0.75)] ring-1 ring-[#E7C9B5]"
      >
        <div className="pointer-events-none absolute inset-2.5 rounded-[22px] border border-[#C9A35C]/45" />
        {d.title && (
          <motion.p {...appear(1.6)} className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-[#9E1B32]">
            {d.title}
          </motion.p>
        )}
        <h1 className="mt-5 font-cormorant italic font-medium leading-[0.95] text-[#3B1420] text-[clamp(2.6rem,12cqw,3.6rem)] break-words">
          {d.hasNames ? (
            d.people.map((name, i) => (
              <React.Fragment key={name + i}>
                {i > 0 && (
                  <motion.span {...appear(2.0)} className="block my-1 text-[0.5em] not-italic text-[#C9A35C]">
                    &amp;
                  </motion.span>
                )}
                <motion.span {...appear(1.75 + i * 0.35)} className="block">
                  {name}
                </motion.span>
              </React.Fragment>
            ))
          ) : (
            <motion.span {...appear(1.75)} className="block">
              {NO_NAMES}
            </motion.span>
          )}
        </h1>
        <motion.div {...appear(2.3)} className="mx-auto my-6 h-px w-24 bg-gradient-to-r from-transparent via-[#C9A35C] to-transparent" />
        {d.date.day && (
          <motion.p {...appear(2.4)} className="font-cormorant text-xl text-[#3B1420]">
            {d.date.weekday && <span className="block text-xs tracking-[0.25em] uppercase text-[#7A4A52] mb-1">{d.date.weekday}</span>}
            {d.date.day}
            {d.date.time && <span className="text-[#9E1B32]"> · {d.date.time}</span>}
          </motion.p>
        )}
        {d.venue && (
          <motion.p {...appear(2.55)} className="mt-2 text-sm text-[#5E3A40]">
            {d.venue}
          </motion.p>
        )}
        {d.subtitle && (
          <motion.p {...appear(2.7)} className="mt-5 font-cormorant italic text-lg leading-snug text-[#5E3A40]">
            {d.subtitle}
          </motion.p>
        )}
      </motion.div>

      <motion.div {...appear(2.9)} className="mt-8">
        <HeroCountdown
          invitation={invitation}
          numberClassName="font-cormorant text-[#FFF1EC] text-3xl"
          labelClassName="text-[#E5C9C4]"
        />
      </motion.div>

      {mode === 'live' && <GyroButton className="mt-6 bg-[#2A0F18]/70 text-[#F2C7C2] hover:text-white" />}
      <motion.button
        type="button"
        {...appear(3.2)}
        onClick={() => scrollContainer?.current?.scrollBy({ top: scrollContainer.current.clientHeight * 0.85, behavior: 'smooth' })}
        className="mt-8 flex flex-col items-center gap-1 text-[11px] tracking-[0.3em] uppercase text-[#F2C7C2] hover:text-white transition-colors"
      >
        Kaydırın
        <ChevronDown size={18} className="motion-safe:animate-bounce" />
      </motion.button>
    </div>
  );
}

/**
 * DugunGul3d — "3D Gül Bahçesi": prosedürel 3B güller kartın çevresinde açar,
 * sarmaşıklar köşelerden uzar, taç yaprakları düşer; kamera güllerin içinden
 * geri çekilirken kart öne gelir. Kart ve bütün metin HTML'dir.
 */
export function DugunGul3d({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={GUL_FLAVOR}
      mode={mode}
      themeOverride={GUL_TEMASI}
      renderBackdrop={(state) => <GulBackdrop {...state} mode={mode} />}
      renderHero={(props) => <GulHero {...props} mode={mode} />}
    />
  );
}
