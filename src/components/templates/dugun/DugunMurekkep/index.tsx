import React from 'react';
import { motion, useReducedMotion, useTransform } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { ThreeStage } from '../../shared/three';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';
import { MurekkepCanvas } from './MurekkepCanvas';

const MUREKKEP_TEMASI: SectionTheme = {
  id: 'stone',
  base: 'bg-[#F4F2ED] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#1B1F3B]',
  surface: 'bg-white/85 backdrop-blur-md shadow-[0_12px_40px_-24px_rgba(27,31,59,0.5)]',
  border: 'border-[#1B1F3B]/12',
  heading: 'text-[#0E1022]',
  body: 'text-[#4A4F6A]',
  accent: 'text-[#2A3473]',
  accentBg: 'bg-[#1B1F3B]',
  accentSoft: 'bg-[#2A3473]/8',
  input:
    'w-full bg-white border border-[#1B1F3B]/20 rounded-lg px-3.5 py-2.5 text-sm text-[#0E1022] placeholder:text-[#7A7F96] focus:outline-none focus:border-[#2A3473] focus:ring-2 focus:ring-[#2A3473]/15 transition-all duration-300',
  buttonPrimary: 'bg-[#1B1F3B] hover:bg-[#2A3473] text-[#F4F2ED] shadow-lg shadow-[#1B1F3B]/20',
  buttonGhost: 'border border-[#1B1F3B]/30 text-[#1B1F3B] hover:bg-[#1B1F3B]/5',
  divider: 'bg-[#1B1F3B]/12',
  timelineLine: 'from-[#1B1F3B] via-[#2A3473]/40 to-transparent',
  envelope: {
    paper: 'bg-[#F4F2ED]',
    flap: 'bg-[#E7E4DC]',
    seal: 'bg-[#1B1F3B] text-[#F4F2ED]',
    glow: 'bg-[#2A3473]/15',
    card: 'bg-white border border-[#1B1F3B]/15'
  },
  mapHeader: 'bg-[#E7E4DC]',
  footer: { names: 'text-[#4A4F6A]', branding: 'text-[#4A4F6A]' }
};

const MUREKKEP_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Aynı suya düşen iki damla',
  headings: { timeline: 'Günün Akışı', details: 'Buluşma Yeri', gallery: 'Anılar', gift: 'Takı & Hediye', rsvp: 'Katılımınızı Bildirin' }
};

/** WebGL yoksa ya da yüklenirken: bulanık lekeler (statik). */
function InkFallback() {
  return (
    <div className="absolute inset-0 bg-[#F4F2ED]">
      <div className="absolute left-[18%] top-[16%] w-[64%] aspect-square rounded-full bg-[#1B1F3B]/70 blur-[60px]" />
      <div className="absolute left-[8%] top-[38%] w-[40%] aspect-square rounded-full bg-[#2A3473]/50 blur-[50px]" />
      <div className="absolute right-[6%] top-[12%] w-[34%] aspect-square rounded-full bg-[#5C1F38]/35 blur-[50px]" />
    </div>
  );
}

function InkBackdrop({ revealed, heroExit, mode }: BackdropState & { mode: 'preview' | 'live' }) {
  // Kaydırdıkça su durulur: bölümlerin metni açık zeminde okunur.
  const wash = useTransform(heroExit, [0, 0.9], [0, 0.78]);
  return (
    <>
      <ThreeStage mode={mode} fallback={<InkFallback />}>
        {(stage) => <MurekkepCanvas {...stage} revealed={revealed} heroExit={heroExit} />}
      </ThreeStage>
      <motion.div className="absolute inset-0 bg-[#F4F2ED]" style={{ opacity: wash }} />
    </>
  );
}

function InkHero({ invitation }: HeroRenderProps) {
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  // Adlar mürekkebin içinden çıkar: bulanık, geniş aralıklı → keskin.
  const emerge = (delay: number) =>
    reduced
      ? { initial: false as const }
      : {
          initial: { opacity: 0, filter: 'blur(18px)', letterSpacing: '0.35em' },
          animate: { opacity: 1, filter: 'blur(0px)', letterSpacing: '0.01em' },
          transition: { duration: 2, delay, ease: [0.22, 1, 0.36, 1] as const }
        };
  const fade = (delay: number) =>
    reduced ? { initial: false as const } : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay } };

  return (
    <div className="grow flex flex-col items-center justify-center px-6 py-16 text-center">
      {d.title && (
        <motion.p {...fade(2.2)} className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-[#F4F2ED]/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
          {d.title}
        </motion.p>
      )}
      <h1 className="mt-5 font-cormorant font-semibold italic text-[#F7F5F0] leading-[0.95] text-[clamp(3rem,15cqw,6.5rem)] [text-shadow:0_2px_30px_rgba(10,12,30,0.65)] break-words max-w-full">
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && (
                <motion.span {...fade(1.9)} className="block text-[0.45em] my-1 not-italic text-[#E7D3A8]">
                  &amp;
                </motion.span>
              )}
              <motion.span {...emerge(0.6 + i * 0.6)} className="block">
                {p}
              </motion.span>
            </React.Fragment>
          ))
        ) : (
          <motion.span {...emerge(0.6)} className="block">
            {NO_NAMES}
          </motion.span>
        )}
      </h1>
      {(d.date.day || d.venue) && (
        <motion.div {...fade(2.4)} className="mt-8 rounded-full bg-[#0E1022]/55 backdrop-blur-md px-5 py-2.5 text-[#F4F2ED] text-sm">
          {[d.date.day, d.date.time, d.venue].filter(Boolean).join(' · ')}
        </motion.div>
      )}
      <motion.div {...fade(2.7)} className="mt-7 rounded-2xl bg-[#F4F2ED]/80 backdrop-blur-md px-4 py-3">
        <HeroCountdown invitation={invitation} numberClassName="font-cormorant font-semibold text-[#0E1022]" labelClassName="text-[#4A4F6A]" />
      </motion.div>
      {d.subtitle && (
        <motion.p {...fade(3)} className="mt-6 max-w-md font-cormorant italic text-xl text-[#F7F5F0] [text-shadow:0_1px_14px_rgba(10,12,30,0.7)]">
          {d.subtitle}
        </motion.p>
      )}
      <motion.p {...fade(3.4)} className="mt-8 text-[10px] tracking-[0.35em] uppercase text-[#F4F2ED]/80">
        Dokunun, bir damla daha düşsün
      </motion.p>
    </div>
  );
}

/**
 * DugunMurekkep — "Mürekkep & Su": suya damlayan mürekkep bulutları (WebGL
 * fragment shader), adlar mürekkebin içinden netleşerek belirir. Dokunulan
 * yere yeni damla düşer; kaydırınca su durulur ve bölümler açık zeminde akar.
 */
export function DugunMurekkep({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={MUREKKEP_FLAVOR}
      mode={mode}
      themeOverride={MUREKKEP_TEMASI}
      renderBackdrop={(state) => <InkBackdrop {...state} mode={mode} />}
      renderHero={(props) => <InkHero {...props} />}
    />
  );
}
