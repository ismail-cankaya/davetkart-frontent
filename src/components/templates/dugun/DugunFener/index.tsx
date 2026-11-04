import React, { lazy } from 'react';
import { motion, useReducedMotion, useTransform } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { ThreeStage } from '../../shared/three';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';

const FenerSahnesi = lazy(() => import('./FenerSahnesi'));

const GLOW = '[text-shadow:0_0_24px_rgba(255,190,110,0.55),0_0_2px_rgba(255,230,190,0.8)]';

const FENER_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0B1026] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-medium',
  page: 'text-[#F3E6D0]',
  surface: 'bg-[#121A3A]/75 backdrop-blur-md shadow-[0_0_40px_-18px_rgba(255,170,80,0.45)]',
  border: 'border-[#FFC27A]/20',
  heading: 'text-[#FFF1DC]',
  body: 'text-[#C9C3D8]',
  accent: 'text-[#FFC27A]',
  accentBg: 'bg-[#FFB45E]',
  accentSoft: 'bg-[#FFB45E]/10',
  input:
    'w-full bg-[#0B1026]/70 border border-[#FFC27A]/25 rounded-lg px-3.5 py-2.5 text-sm text-[#FFF1DC] placeholder:text-[#8F8AA6] focus:outline-none focus:border-[#FFC27A] focus:ring-2 focus:ring-[#FFC27A]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#FFD08A,#F29A45)] hover:brightness-110 text-[#1B1206] shadow-lg shadow-[#F29A45]/30',
  buttonGhost: 'border border-[#FFC27A]/35 text-[#F3E6D0] hover:bg-[#FFC27A]/10',
  divider: 'bg-[#FFC27A]/15',
  timelineLine: 'from-[#FFC27A]/80 via-[#FFC27A]/35 to-transparent',
  envelope: {
    paper: 'bg-[#16204A]',
    flap: 'bg-[#1C2858]',
    seal: 'bg-[#FFB45E] text-[#1B1206]',
    glow: 'bg-[#FFB45E]/30',
    card: 'bg-[#FFF4E2] border border-[#FFC27A]/40'
  },
  mapHeader: 'bg-[#16204A]',
  footer: { names: 'text-[#C9C3D8]', branding: 'text-[#9C97B4]' }
};

const FENER_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Dileklerimizi göğe bırakıyoruz',
  headings: { timeline: 'Gecenin Akışı', details: 'Buluşma Yeri', gallery: 'Işıklı Anlar', gift: 'Takı & Hediye', rsvp: 'Dileğinizi Bize Yollayın' }
};

/** Statik gök: yıldız noktaları + birkaç CSS fener (WebGL yokken, yüklenirken). */
function FenerStatik() {
  const spots = [
    [18, 70, 1], [34, 56, 0.8], [62, 64, 1.1], [78, 46, 0.7], [48, 34, 0.6], [26, 24, 0.5], [70, 18, 0.55], [86, 74, 0.9]
  ];
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(#FFF4DA_0.7px,transparent_1px)] bg-[size:46px_46px]" />
      {spots.map(([x, y, s], i) => (
        <div key={i} className="absolute" style={{ left: `${x}%`, top: `${y}%`, transform: `scale(${s})` }}>
          <div className="absolute -inset-6 rounded-full bg-[#FFB45E]/30 blur-xl" />
          <div className="relative w-4 h-5 rounded-[3px] bg-[linear-gradient(180deg,#F29A45,#FFE3A8)]" />
        </div>
      ))}
    </div>
  );
}

function FenerBackdrop({ revealed, progress, heroExit, mode }: BackdropState & { mode: 'preview' | 'live' }) {
  const hills = useTransform(heroExit, [0, 1], ['0%', '60%']);
  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#05071A_0%,#0B1026_45%,#2A1D3E_80%,#5A2E3A_100%)]">
      <ThreeStage mode={mode} fallback={<FenerStatik />}>
        {(stage) => <FenerSahnesi {...stage} revealed={revealed} progress={progress} />}
      </ThreeStage>
      {/* Ufuk: tepe silueti ve gölde ışık; kaydırınca aşağı iner */}
      <motion.svg style={{ y: hills }} viewBox="0 0 400 80" preserveAspectRatio="none" className="absolute bottom-0 inset-x-0 w-full h-[16%]" aria-hidden="true">
        <path d="M0 50 C 60 30, 110 42, 160 34 C 220 24, 270 44, 330 30 C 360 24, 385 30, 400 34 V 80 H 0 Z" fill="#070918" />
        <rect y="62" width="400" height="18" fill="#0B1026" />
        <path d="M120 66 h 30 M220 70 h 50 M300 66 h 20" stroke="#FFB45E" strokeOpacity="0.35" strokeWidth="1.2" />
      </motion.svg>
    </div>
  );
}

function FenerHero({ invitation }: HeroRenderProps) {
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const rise = (delay: number) =>
    reduced
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 26, filter: 'blur(8px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] as const }
        };
  return (
    <div className="grow flex flex-col items-center justify-center px-6 pt-16 pb-28 text-center">
      <motion.p {...rise(1.4)} className="text-[10px] sm:text-[11px] tracking-[0.45em] uppercase text-[#FFC27A]">
        {d.title || FENER_FLAVOR.tagline}
      </motion.p>
      <h1 className={`mt-6 font-cormorant italic font-medium leading-[0.98] text-[#FFF1DC] text-[clamp(2.8rem,13cqw,5.6rem)] break-words max-w-full ${GLOW}`}>
        {d.hasNames ? (
          d.people.map((p, i) => (
            <React.Fragment key={p + i}>
              {i > 0 && (
                <motion.span {...rise(2.0)} className="block my-1 text-[0.45em] not-italic text-[#FFC27A]">
                  &amp;
                </motion.span>
              )}
              <motion.span {...rise(1.7 + i * 0.5)} className="block">
                {p}
              </motion.span>
            </React.Fragment>
          ))
        ) : (
          <motion.span {...rise(1.7)} className="block">
            {NO_NAMES}
          </motion.span>
        )}
      </h1>
      {d.date.day && (
        <motion.p {...rise(2.5)} className={`mt-7 font-cormorant text-2xl text-[#FFF1DC] ${GLOW}`}>
          {d.date.weekday && <span className="block text-[11px] tracking-[0.35em] uppercase text-[#C9C3D8] mb-1">{d.date.weekday}</span>}
          {d.date.day}
          {d.date.time && ` · ${d.date.time}`}
        </motion.p>
      )}
      {d.venue && (
        <motion.p {...rise(2.7)} className="mt-2 text-sm text-[#C9C3D8]">
          {d.venue}
        </motion.p>
      )}
      <motion.div {...rise(3)} className="mt-8">
        <HeroCountdown invitation={invitation} numberClassName={`font-cormorant text-[#FFE3B5] ${GLOW}`} labelClassName="text-[#9C97B4]" />
      </motion.div>
      {d.subtitle && (
        <motion.p {...rise(3.2)} className="mt-7 max-w-md font-cormorant italic text-lg text-[#E3DBEA]">
          {d.subtitle}
        </motion.p>
      )}
    </div>
  );
}

/**
 * DugunFener — "Dilek Fenerleri": gece gökyüzüne yükselen sıcak ışıklı
 * fenerler (R3F, tek InstancedMesh + eklemeli hale). Açılışta fenerler
 * ufkun altından dalga hâlinde salınır; kaydırdıkça kamera fenerlerle yükselir.
 */
export function DugunFener({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={FENER_FLAVOR}
      mode={mode}
      themeOverride={FENER_TEMASI}
      renderBackdrop={(state) => <FenerBackdrop {...state} mode={mode} />}
      renderHero={(props) => <FenerHero {...props} />}
    />
  );
}
