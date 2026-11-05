import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { clipSet, videoSet } from '../../shared/videoAssets';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { CinemaBackdrop, DateCountdown, ScrollCue, useTemplateFont } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';

/** Döngü (kapı açık) ve tek seferlik giriş (koridor + kapının açılışı). */
const VIDEO = videoSet('dugun-saray-kapisi', { landscape: '50% 45%', portrait: '50% 45%' });
const GIRIS = clipSet('dugun-saray-kapisi', 'giris', { landscape: '50% 45%', portrait: '50% 45%' });
const FONT = 'Marcellus';
const ROMAN = "[font-family:'Marcellus',var(--font-cormorant),serif]";
/** Giriş klibinde kapı ~3.4 sn'de aralanır; adlar ışık dolunca gelir. */
const LIGHT_AT = 4.0;

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#0B0907] [&_.font-serif]:[font-family:'Marcellus',var(--font-cormorant),serif]",
  page: 'text-[#F2E9DC]',
  surface: 'bg-[#16110C]/72 backdrop-blur-md shadow-[0_0_60px_-26px_rgba(255,200,130,0.45)]',
  border: 'border-[#D8B36A]/22',
  heading: 'text-[#FFF5E6]',
  body: 'text-[#C9BBA7]',
  accent: 'text-[#D8B36A]',
  accentBg: 'bg-[#D8B36A]',
  accentSoft: 'bg-[#D8B36A]/10',
  input:
    'w-full bg-[#100C08]/75 border border-[#D8B36A]/25 rounded-sm px-3.5 py-2.5 text-sm text-[#FFF5E6] placeholder:text-[#8E8170] focus:outline-none focus:border-[#D8B36A] focus:ring-2 focus:ring-[#D8B36A]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#EAD08F,#B8873E)] hover:brightness-110 text-[#1A1208] tracking-[0.15em] shadow-lg shadow-[#B8873E]/30',
  buttonGhost: 'border border-[#D8B36A]/35 text-[#F2E9DC] hover:bg-[#D8B36A]/10',
  divider: 'bg-[#D8B36A]/18',
  timelineLine: 'from-[#D8B36A]/80 via-[#D8B36A]/30 to-transparent',
  envelope: {
    paper: 'bg-[#2A2018]',
    flap: 'bg-[#3A2C1F]',
    seal: 'bg-[#D8B36A] text-[#1A1208]',
    glow: 'bg-[#FFD9A0]/30',
    card: 'bg-[#FBF6EC] border border-[#D8B36A]/45'
  },
  mapHeader: 'bg-[#1C150F]',
  footer: { names: 'text-[#C9BBA7]', branding: 'text-[#8E8170]' }
};

const FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Kapılar sizin için açılıyor',
  headings: { timeline: 'Düğün Programı', details: 'Saray', gallery: 'Anılarımız', gift: 'Hediye', rsvp: 'Davete İcabet' }
};

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONT);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const live = mode === 'live' && !reduced;
  const t0 = live ? LIGHT_AT : 0;
  const fade = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: t0 + delay, duration: 1.2, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className="relative grow flex flex-col">
      {/* Kapı kadrajın ortasında: adlar ışığın içinden çıkıp alt üçte bire yerleşir. */}
      <div className="relative min-h-[100svh] @container flex flex-col items-center justify-end px-6 pt-[46svh] pb-24 text-center" dir="auto">
        {live && (
          <span aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.span
            className="absolute left-1/2 top-[42%] w-[60vmin] h-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,240,210,0.9),rgba(255,210,150,0.25)_35%,transparent_65%)] pointer-events-none"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 0], scale: [0.3, 1.4, 2] }}
            transition={{ delay: LIGHT_AT - 0.6, duration: 2.4, ease: 'easeOut' }}
          />
          </span>
        )}
        <motion.p {...fade(0.9)} className={`${ROMAN} text-[10px] sm:text-xs tracking-[0.55em] uppercase text-[#F3DDA8] [text-shadow:0_1px_3px_rgba(20,12,4,0.95),0_0_14px_rgba(20,12,4,0.8)]`}>
          {d.title || 'Düğünümüze Davetlisiniz'}
        </motion.p>
        <motion.h1
          className={`mt-5 ${ROMAN} leading-[1.05] tracking-[0.04em] text-[clamp(2.5rem,11.5cqw,6rem)] text-[#FFF6E8] max-w-full break-words [text-shadow:0_0_26px_rgba(255,214,150,0.55),0_4px_22px_rgba(10,6,2,0.9)]`}
          initial={live ? { opacity: 0, scale: 0.28, y: '-22svh', filter: 'blur(10px) brightness(3)' } : false}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px) brightness(1)' }}
          transition={{ delay: LIGHT_AT - 0.2, duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {(d.hasNames ? d.people : [NO_NAMES]).map((p, i) => (
            <span key={p + i} className="block">
              {i > 0 && <span className="block my-1 font-cormorant italic text-[0.42em] text-[#E7C98A]">&amp;</span>}
              {p}
            </span>
          ))}
        </motion.h1>
        <motion.div
          aria-hidden="true"
          className="mt-6 flex items-center gap-3 text-[#D8B36A]"
          initial={reduced ? false : { opacity: 0, scaleX: 0.2 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: t0 + 1.2, duration: 1.2 }}
        >
          <span className="h-px w-14 bg-[linear-gradient(90deg,transparent,#D8B36A)]" />
          <span className="w-1.5 h-1.5 rotate-45 border border-current" />
          <span className="h-px w-14 bg-[linear-gradient(270deg,transparent,#D8B36A)]" />
        </motion.div>
        <motion.p {...fade(1.5)} className="mt-5 font-cormorant italic text-xl sm:text-2xl text-[#EADCC6] [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
          {d.subtitle || FLAVOR.tagline}
        </motion.p>
        {(d.date.day || d.venue) && (
          <motion.p {...fade(1.8)} className={`mt-4 ${ROMAN} text-[11px] tracking-[0.32em] uppercase text-[#D4C6B0] [text-shadow:0_2px_10px_rgba(0,0,0,0.8)]`}>
            {[d.date.day, d.venue].filter(Boolean).join('  ·  ')}
          </motion.p>
        )}
        <ScrollCue delay={t0 + 2.4} className="text-[#E7C98A]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Büyük güne"
        classes={{
          root: 'min-h-[80svh]',
          eyebrow: `${ROMAN} text-[#E7C98A]`,
          date: `${ROMAN} tracking-[0.04em] text-[clamp(2.8rem,12cqw,5.6rem)] leading-none text-[#FFF6E8] [text-shadow:0_0_24px_rgba(255,214,150,0.4)]`,
          meta: `${ROMAN} text-[#C9BBA7]`,
          cell: 'px-1',
          number: `${ROMAN} text-[#FFF5E6]`,
          label: 'text-[#9C8F7C]',
          divider: 'bg-[#D8B36A]/40'
        }}
      />
    </div>
  );
}

/**
 * DugunSarayKapisi — "Saray Kapısı": kodla üretilmiş iki klip. Giriş: kamera
 * mermer sütunlu koridorda ilerler, oymalı iki kanatlı kapı ışık sızdırarak
 * açılır. Ardından görünmez bir kesmeyle döngü: açık kapıdan süzülen huzmeler
 * ve havada asılı toz. Adlar kapıdaki ışığın içinden küçük ve parlak çıkıp
 * misafire doğru büyüyerek yerine oturur.
 */
export function DugunSarayKapisi({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={FLAVOR}
      mode={mode}
      themeOverride={THEME}
      renderBackdrop={(state) => (
        <CinemaBackdrop
          {...state}
          video={VIDEO}
          mode={mode}
          playback={{ kind: 'intro', intro: GIRIS }}
          base="radial-gradient(ellipse 50% 60% at 50% 45%, #6A5638 0%, #1C150F 55%, #080605 100%)"
          dimRgb="11,9,7"
          dim={0.62}
          zoom={1.12}
        >
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(0deg,rgba(8,6,4,0.85),rgba(8,6,4,0.4)_55%,transparent)]" />
        </CinemaBackdrop>
      )}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
