import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { DateCountdown, ScrollCue, useTemplateFont } from '../../shared/sinema';
import { GyroButton, useDeviceMotion } from '../../shared/three';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';

const FONTS = 'Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Caveat:wght@500;700&family=Special+Elite';
const SERIF = "[font-family:'Cormorant_Garamond',var(--font-cormorant),serif]";
const HAND = "[font-family:'Caveat',cursive]";
const TYPE = "[font-family:'Special_Elite',ui-monospace,monospace]";

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#0E0405] [&_.font-serif]:[font-family:'Cormorant_Garamond',var(--font-cormorant),serif] [&_.font-serif]:font-medium",
  page: 'text-[#F1E2DC]',
  surface: 'bg-[#1C0B0C]/80 backdrop-blur-xl shadow-[0_0_70px_-30px_rgba(255,60,50,0.4)]',
  border: 'border-[#FF5A4E]/18',
  heading: 'text-[#FBEDE7]',
  body: 'text-[#C9ABA4]',
  accent: 'text-[#FF7A6B]',
  accentBg: 'bg-[#B8231E]',
  accentSoft: 'bg-[#FF5A4E]/10',
  input:
    'w-full bg-[#160708]/80 border border-[#FF5A4E]/22 rounded-xl px-3.5 py-2.5 text-sm text-[#FBEDE7] placeholder:text-[#8A6A64] focus:outline-none focus:border-[#FF7A6B] focus:ring-2 focus:ring-[#FF7A6B]/25 transition-all duration-300',
  buttonPrimary: 'bg-[#B8231E] hover:bg-[#CC2D27] text-[#FFF2EE] shadow-lg shadow-[#B8231E]/35',
  buttonGhost: 'border border-[#FF5A4E]/30 text-[#F1E2DC] hover:bg-[#FF5A4E]/10',
  divider: 'bg-[#FF5A4E]/16',
  timelineLine: 'from-[#FF7A6B]/80 via-[#B8231E]/45 to-transparent',
  envelope: {
    paper: 'bg-[#2A0E0E]',
    flap: 'bg-[#361212]',
    seal: 'bg-[#B8231E] text-[#FFF2EE]',
    glow: 'bg-[#FF5A4E]/30',
    card: 'bg-[#F6EFE6] border border-[#FF5A4E]/30'
  },
  mapHeader: 'bg-[#1C0B0C]',
  footer: { names: 'text-[#C9ABA4]', branding: 'text-[#8A6A64]' }
};

const FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Hikâyemizin en güzel karesine davetlisiniz',
  headings: { timeline: 'Günün Kareleri', details: 'Çekim Yeri', gallery: 'Banyodan Çıkanlar', gift: 'Takı & Hediye', rsvp: 'Kareye Girin' }
};

/**
 * Galeri boşken kullanılan fotoğraflar: CSS degradeleriyle çizilmiş, gerçek
 * bir yere ya da kişiye benzemeyen atmosfer kareleri (gün batımı, bokeh, çiçek…).
 */
const FALLBACK_SCENES = [
  'radial-gradient(circle at 70% 30%, #FFE3A6 0 9%, transparent 10%), linear-gradient(180deg, #F6A57C 0%, #E5736B 45%, #3E4F7A 46%, #26345A 100%)',
  'radial-gradient(circle at 25% 35%, rgba(255,220,170,0.9) 0 7%, transparent 8%), radial-gradient(circle at 60% 55%, rgba(255,190,140,0.8) 0 10%, transparent 11%), radial-gradient(circle at 80% 25%, rgba(255,240,200,0.8) 0 5%, transparent 6%), linear-gradient(160deg, #2B1D2E, #5B3446)',
  'radial-gradient(circle at 50% 55%, #F3B6C2 0 18%, #D9879A 19% 26%, transparent 27%), radial-gradient(circle at 30% 70%, #9FC59A 0 12%, transparent 13%), linear-gradient(180deg, #F7EADF, #E8D3C4)',
  'linear-gradient(180deg, #CFE3EA 0%, #A9C9D6 55%, #E8DCC8 56%, #D8C7AE 100%)',
  'radial-gradient(ellipse at 50% 100%, #F2D49B 0 30%, transparent 31%), linear-gradient(180deg, #1C2440 0%, #3B3F6E 60%, #8A6E8F 100%)'
];

interface Hang {
  angle: number;
  vel: number;
  develop: number;
  /** Banyonun başlayacağı an (sn, açılıştan itibaren). */
  start: number;
}

function Photo({ src, fallback, className, children, devRef, tall }: { src?: string; fallback: string; className?: string; children?: React.ReactNode; devRef: (el: HTMLDivElement | null) => void; tall?: boolean }) {
  return (
    <div className={`relative bg-[#F6EFE6] p-[6%] ${tall ? 'pb-[34%]' : 'pb-[22%]'} shadow-[0_10px_24px_-8px_rgba(0,0,0,0.8)] ${className ?? ''}`}>
      <div ref={devRef} className="relative aspect-square overflow-hidden bg-[#2A1A18] [--dev:1]" style={{ filter: 'brightness(calc(1 + 2.2 * (1 - var(--dev)))) contrast(calc(0.25 + 0.75 * var(--dev))) saturate(calc(0.15 + 0.85 * var(--dev))) sepia(calc(0.55 * (1 - var(--dev))))' }}>
        {src ? (
          <img src={src} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover select-none" />
        ) : (
          <div className="absolute inset-0" style={{ background: fallback }} />
        )}
        {/* Düzensiz banyo: iki kimyasal leke katmanı farklı hızda çekilir. */}
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,#fff_0,transparent_45%),radial-gradient(circle_at_75%_70%,#fff_0,transparent_40%)]" style={{ opacity: 'calc(max(0, 1 - var(--dev) * 1.6))' }} />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_60%_20%,#fff_0,transparent_50%),radial-gradient(circle_at_20%_85%,#fff_0,transparent_45%)]" style={{ opacity: 'calc(max(0, 0.9 - var(--dev) * 1.1))' }} />
        {/* Film greni */}
        <div aria-hidden="true" className="absolute inset-0 opacity-25 mix-blend-overlay bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22/></svg>')]" />
      </div>
      {children}
    </div>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONTS);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const live = mode === 'live' && !reduced;
  const names = d.hasNames ? d.people : [NO_NAMES];
  const photos = invitation.showGallery ? invitation.galleryImages.slice(0, 5).map((g) => g.url) : [];
  const hangCount = 4;

  const hangs = useRef<Hang[]>(Array.from({ length: hangCount + 1 }, (_, i) => ({ angle: i % 2 ? 6 : -5, vel: 0, develop: live ? 0 : 1, start: i === hangCount ? 0.9 : 2.4 + i * 0.9 })));
  const hangEls = useRef<(HTMLDivElement | null)[]>([]);
  const devEls = useRef<(HTMLDivElement | null)[]>([]);
  const drag = useRef<{ i: number; x: number } | null>(null);
  const boost = useRef(0);
  const motionState = useDeviceMotion(live, () => {
    // Sallama: ipteki kareler savrulur, banyo hızlanır.
    boost.current = 1;
    hangs.current.forEach((h, i) => (h.vel += (i % 2 ? 1 : -1) * 90));
  });

  useEffect(() => {
    const apply = () => {
      hangs.current.forEach((h, i) => {
        const el = hangEls.current[i];
        if (el && i < hangCount) el.style.transform = `rotate(${h.angle.toFixed(2)}deg)`;
        devEls.current[i]?.style.setProperty('--dev', h.develop.toFixed(3));
      });
    };
    if (!live) {
      hangs.current.forEach((h) => (h.develop = 1));
      apply();
      return;
    }
    let raf = 0;
    let last = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      const t = (now - t0) / 1000;
      boost.current = Math.max(0, boost.current - dt * 0.6);
      const shake = motionState.current.shake;
      hangs.current.forEach((h, i) => {
        // Sönümlü sarkaç: hafif hava akımı + sürükleme + sallama.
        const breeze = Math.sin(t * 0.7 + i * 1.3) * 0.6;
        const acc = -14 * h.angle - 1.6 * h.vel + breeze * 8;
        h.vel += acc * dt;
        h.angle = Math.max(-40, Math.min(40, h.angle + h.vel * dt));
        if (t > h.start) h.develop = Math.min(1, h.develop + dt * (1 / 4.2) * (1 + boost.current * 3 + shake * 2));
      });
      apply();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [live, motionState]);

  const onDown = (i: number) => (e: React.PointerEvent) => {
    if (!live) return;
    drag.current = { i, x: e.clientX };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const g = drag.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    g.x = e.clientX;
    hangs.current[g.i].vel += dx * 9;
  };
  const onUp = () => (drag.current = null);

  const fade = (delay: number) =>
    !live ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 1.1, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className="relative grow flex flex-col">
      <div className="relative min-h-[100svh] flex flex-col items-center px-4 pt-10 pb-24 text-center overflow-hidden" dir="auto">
        <motion.p {...fade(0.2)} className={`${TYPE} text-[11px] tracking-[0.3em] uppercase text-[#FF8A7C]`}>
          {d.title || 'Düğünümüze davetlisiniz'}
        </motion.p>

        {/* İp ve mandallı kareler */}
        <div className="relative w-full max-w-[640px] mt-6 h-[150px] sm:h-[190px]">
          <svg aria-hidden="true" viewBox="0 0 400 40" preserveAspectRatio="none" className="absolute inset-x-0 top-0 w-full h-10">
            <path d="M0 6 Q200 34 400 6" fill="none" stroke="#B89A86" strokeWidth="1.2" />
          </svg>
          {Array.from({ length: hangCount }, (_, i) => {
            const x = 12 + i * 25.3;
            const sag = Math.sin((x / 100) * Math.PI) * 18;
            return (
              <div
                key={i}
                className="absolute w-[21%] max-w-[120px] -translate-x-1/2 origin-top cursor-grab active:cursor-grabbing [touch-action:pan-y]"
                style={{ left: `${x}%`, top: `${4 + sag}px` }}
                ref={(el) => {
                  hangEls.current[i] = el;
                }}
                onPointerDown={onDown(i)}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
              >
                {/* Mandal */}
                <div aria-hidden="true" className="mx-auto w-2.5 h-6 -mb-3 relative z-10 rounded-sm bg-[linear-gradient(90deg,#C9A27A,#E8C9A2,#B88E64)] shadow" />
                <Photo src={photos[i + 1]} fallback={FALLBACK_SCENES[(i + 1) % FALLBACK_SCENES.length]} devRef={(el) => {
                    devEls.current[i] = el;
                  }} />
              </div>
            );
          })}
        </div>

        {/* Banyo tepsisi ve ana kare */}
        <motion.div {...fade(0.5)} className="relative mt-6 w-[min(84vw,360px)] rounded-[18px] p-4 pb-5 bg-[linear-gradient(180deg,#2A1414,#1A0909)] shadow-[inset_0_2px_0_rgba(255,255,255,0.06),inset_0_-20px_40px_rgba(0,0,0,0.6),0_30px_60px_-20px_rgba(0,0,0,0.9)] border border-[#3A1A18]">
          {/* Banyo sıvısı: kırmızı ışıkta parlayan yüzey */}
          <div aria-hidden="true" className="absolute inset-3 rounded-xl bg-[linear-gradient(180deg,rgba(255,80,60,0.12),rgba(120,20,20,0.25))] overflow-hidden">
            {live && (
              <motion.div
                className="absolute -inset-[30%] bg-[repeating-radial-gradient(circle_at_40%_45%,rgba(255,140,120,0.1)_0_2px,transparent_2px_14px)]"
                animate={{ scale: [1, 1.08, 1], rotate: [0, 3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
          <div className="relative rotate-[-2deg] mx-auto w-[86%]">
            <Photo tall src={photos[0]} fallback={FALLBACK_SCENES[0]} devRef={(el) => {
                devEls.current[hangCount] = el;
              }}>
              <p className={`${HAND} absolute inset-x-0 bottom-0 h-[29%] flex items-center justify-center text-[#2B1B19] leading-[0.95] text-[clamp(1.25rem,6.2cqw,2rem)] font-bold break-words px-3`}>
                {names.join(' & ')}
              </p>
            </Photo>
          </div>
        </motion.div>

        <motion.h1 {...fade(1.6)} className={`${SERIF} sr-only`}>
          {names.join(' ve ')}
        </motion.h1>
        <motion.div {...fade(2.2)} className={`${TYPE} mt-7 flex flex-wrap justify-center gap-2 text-[12px] tracking-[0.12em] uppercase text-[#F1D6CE]`}>
          {[d.date.day && `Tarih · ${d.date.dayMonth || d.date.day}`, d.date.time && `Saat · ${d.date.time}`, d.venue && `Yer · ${d.venue}`]
            .filter(Boolean)
            .map((t) => (
              <span key={t as string} className="bg-[#F6EFE6] text-[#2B1B19] px-3 py-1.5 rotate-[-1deg] shadow-md">
                {t}
              </span>
            ))}
        </motion.div>
        <motion.p {...fade(2.6)} className={`${SERIF} mt-5 text-lg italic text-[#E6CFC8] max-w-md`}>
          {d.subtitle || FLAVOR.tagline}
        </motion.p>
        {live && (
          <motion.p {...fade(3.2)} className={`${TYPE} mt-4 text-[10px] tracking-[0.25em] uppercase text-[#A07A72]`}>
            Kareleri sürükleyin · telefonu sallayın, fotoğraflar hızlansın
          </motion.p>
        )}
        {live && <GyroButton className="mt-3 bg-[#1C0B0C]/70 text-[#FF8A7C] border border-[#FF5A4E]/25" label="Sallama için izin ver" />}
        <ScrollCue delay={live ? 3.6 : 0} className="text-[#FF8A7C]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Deklanşöre kalan"
        classes={{
          root: 'min-h-[80svh]',
          eyebrow: 'text-[#FF8A7C]',
          date: `${SERIF} font-medium text-[clamp(2.6rem,11cqw,5.2rem)] leading-none text-[#FBEDE7]`,
          meta: `${TYPE} text-[#C9ABA4]`,
          cell: 'bg-[#F6EFE6] px-2 py-3 shadow-md',
          number: `${TYPE} text-[#2B1B19]`,
          label: 'text-[#7A5A54]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

/** Karanlık oda: kırmızı güvenlik lambası, kurumaya asılı ipler, ıslak zemin parıltısı. */
function Backdrop({ still }: { still: boolean }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-[#0E0405] overflow-hidden">
      <motion.div
        className="absolute left-1/2 -top-[20%] w-[140vmax] h-[90vmax] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(220,40,30,0.38),rgba(120,15,12,0.18)_45%,transparent)]"
        animate={still ? undefined : { opacity: [0.85, 1, 0.9, 1, 0.85] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute left-1/2 top-3 -translate-x-1/2 w-16 h-6 rounded-b-full bg-[radial-gradient(ellipse_at_50%_0%,#FF5A4E,#7A0F0C)] shadow-[0_0_60px_20px_rgba(255,60,40,0.35)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(0deg,rgba(0,0,0,0.6),transparent)]" />
    </div>
  );
}

/**
 * DugunKaranlikOda — "Karanlık Oda": kırmızı güvenlik ışığının altında bir
 * fotoğraf banyosu. Çiftin kendi galeri fotoğrafları (yoksa atmosfer
 * kareleri) önce bembeyaz, sonra düzensizce koyulaşarak belirir; ana kare
 * banyo tepsisinde, adlar polaroidin altına elle yazılmış. İpteki kareler
 * sürüklenince yaylı sarkaç gibi sallanır; telefonu sallamak hem kareleri
 * savurur hem de banyoyu hızlandırır.
 */
export function DugunKaranlikOda({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={FLAVOR}
      mode={mode}
      themeOverride={THEME}
      renderBackdrop={() => <Backdrop still={reduced || mode === 'preview'} />}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
