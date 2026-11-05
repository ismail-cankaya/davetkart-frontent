import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useTransform } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { clipSet, videoSet } from '../../shared/videoAssets';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { CinemaBackdrop, DateCountdown, LightLayer, ScrollCue, useTemplateFont } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { KINA_FLAVOR } from '../flavors';
import { createFogEngine, type FogEngine } from './buguMotoru';

const VIDEO = videoSet('kina-bugulu-ayna', { landscape: '50% 50%', portrait: '50% 50%' });
const BUHAR = clipSet('kina-bugulu-ayna', 'on');
const FONTS = 'Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Allura';
const SCRIPT = "[font-family:'Allura',cursive]";
const SERIF = "[font-family:'Cormorant_Garamond',var(--font-cormorant),serif]";

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#120806] [&_.font-serif]:[font-family:'Cormorant_Garamond',var(--font-cormorant),serif] [&_.font-serif]:font-medium",
  page: 'text-[#F2E3D3]',
  surface: 'bg-[#22110D]/80 backdrop-blur-xl shadow-[0_0_70px_-30px_rgba(226,170,110,0.5)]',
  border: 'border-[#D9A86C]/22',
  heading: 'text-[#F8EBDC]',
  body: 'text-[#CDB5A0]',
  accent: 'text-[#E3B276]',
  accentBg: 'bg-[#9E2A22]',
  accentSoft: 'bg-[#9E2A22]/15',
  input:
    'w-full bg-[#1A0C09]/80 border border-[#D9A86C]/25 rounded-xl px-3.5 py-2.5 text-sm text-[#F8EBDC] placeholder:text-[#8E7563] focus:outline-none focus:border-[#E3B276] focus:ring-2 focus:ring-[#E3B276]/25 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(135deg,#B3342A,#7E1D18)] hover:brightness-110 text-[#FFF3E6] shadow-lg shadow-[#7E1D18]/40',
  buttonGhost: 'border border-[#D9A86C]/35 text-[#F2E3D3] hover:bg-[#D9A86C]/10',
  divider: 'bg-[#D9A86C]/20',
  timelineLine: 'from-[#E3B276]/80 via-[#9E2A22]/45 to-transparent',
  envelope: {
    paper: 'bg-[#3A1410]',
    flap: 'bg-[#4A1A14]',
    seal: 'bg-[#C99A5B] text-[#2A0E0A]',
    glow: 'bg-[#E3B276]/30',
    card: 'bg-[#FBF2E7] border border-[#D9A86C]/45'
  },
  mapHeader: 'bg-[#22110D]',
  footer: { names: 'text-[#CDB5A0]', branding: 'text-[#8E7563]' }
};

const FLAVOR: TemplateFlavor = {
  ...KINA_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Buğuyu silin, aynada bizi görün',
  headings: { timeline: 'Gecenin Akışı', details: 'Kına Mekânı', gallery: 'Aynadaki Kareler', gift: 'Takı & Hediye', rsvp: 'Katılımınızı Bildirin' }
};

/** Aynadaki küçük kına motifi: damla, nokta halkası, sarmal. */
function KinaMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <path d="M60 4c6 8 9 13 9 18a9 9 0 0 1-18 0c0-5 3-10 9-18z" />
      <circle cx="60" cy="22" r="3" fill="currentColor" stroke="none" />
      <path d="M44 22c-6 0-10-4-14-4s-7 3-10 3M76 22c6 0 10-4 14-4s7 3 10 3" />
      {[14, 22, 98, 106].map((x) => (
        <circle key={x} cx={x} cy={22} r="1.4" fill="currentColor" stroke="none" />
      ))}
      <path d="M30 30c4 4 10 5 14 2M90 30c-4 4-10 5-14 2" />
    </svg>
  );
}

/**
 * Buğulu cam: altındaki metin GERÇEK DOM'dur (ekran okuyucu okur); canvas
 * yalnızca görsel buğudur. Masaüstünde imleç gezdikçe, telefonda sürükledikçe
 * silinir. Dikey kaydırma çalışmaya devam eder (`pan-y`).
 */
function FoggedGlass({ active, children }: { active: boolean; children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<FogEngine | null>(null);
  const lastPt = useRef<{ x: number; y: number } | null>(null);
  const [shown, setShown] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!active || !canvas) return;
    const fog = createFogEngine(canvas);
    engine.current = fog;
    const t1 = window.setTimeout(() => setShown(true), 600);
    // İpucu: buğu oturunca bir el kendiliğinden kıvrımlı bir yol siler.
    let raf = 0;
    const t2 = window.setTimeout(() => {
      const r = canvas.getBoundingClientRect();
      const start = performance.now();
      let prev: { x: number; y: number } | null = null;
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / 1500);
        const x = r.width * (0.16 + 0.68 * k);
        const y = r.height * (0.47 + 0.07 * Math.sin(k * Math.PI * 2.2));
        if (prev) fog.wipe(prev.x, prev.y, x, y);
        prev = { x, y };
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, 2300);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      cancelAnimationFrame(raf);
      fog.destroy();
      engine.current = null;
    };
  }, [active]);

  const point = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!engine.current) return;
    // Fare: üzerinde gezinmek siler. Dokunma/kalem: yalnızca basılıyken.
    if (e.pointerType !== 'mouse' && e.buttons === 0) return;
    const p = point(e);
    const prev = lastPt.current ?? p;
    engine.current.wipe(prev.x, prev.y, p.x, p.y);
    lastPt.current = p;
  };

  return (
    <div className="relative">
      {children}
      {active && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          onPointerDown={(e) => {
            lastPt.current = point(e);
            engine.current?.wipe(lastPt.current.x, lastPt.current.y, lastPt.current.x + 0.1, lastPt.current.y);
          }}
          onPointerMove={onMove}
          onPointerLeave={() => (lastPt.current = null)}
          onPointerUp={() => (lastPt.current = null)}
          className={`absolute inset-0 w-full h-full rounded-t-full rounded-b-[28px] [touch-action:pan-y] cursor-crosshair transition-opacity duration-[1400ms] ${shown && !cleared ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {active && !cleared && (
        <button
          type="button"
          onClick={() => {
            engine.current?.clearAll();
            setCleared(true);
          }}
          className={`${SERIF} absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#D9A86C]/35 bg-[#1A0C09]/60 backdrop-blur px-4 py-2 min-h-11 text-[11px] italic tracking-[0.12em] text-[#E8CDAE] hover:bg-[#2A140F]/70 transition-colors`}
        >
          Buğuyu tamamen sil
        </button>
      )}
    </div>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONTS);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const still = reduced || mode === 'preview';
  const fade = (delay: number) =>
    still ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 1, ease: [0.22, 1, 0.36, 1] as const } };
  const names = d.hasNames ? d.people : [NO_NAMES];

  return (
    <div className="relative grow flex flex-col">
      <div className="relative min-h-[100svh] flex flex-col items-center justify-center px-5 pt-12 pb-24" dir="auto">
        <motion.p {...fade(0.2)} className={`${SERIF} text-[11px] tracking-[0.42em] uppercase text-[#E3B276] mb-5`}>
          {d.title || 'Kına Gecesi'}
        </motion.p>

        {/* Ayna: pirinç çerçeve, sivri kemer, cam yansıması. */}
        <motion.div
          className="relative w-[min(78vw,400px)]"
          initial={still ? false : { opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="rounded-t-full rounded-b-[36px] p-[10px] bg-[linear-gradient(160deg,#F4D59A_0%,#9A6A32_28%,#E9C27E_52%,#7A4E22_78%,#D4A862_100%)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),0_0_60px_-10px_rgba(227,178,118,0.35)]">
            <div className="rounded-t-full rounded-b-[28px] p-[3px] bg-[#3A1F10]">
              <FoggedGlass active={!still}>
                <div className="relative rounded-t-full rounded-b-[28px] overflow-hidden aspect-[3/4.2] bg-[radial-gradient(ellipse_80%_60%_at_50%_42%,#4A231A_0%,#2A120D_55%,#160806_100%)] flex flex-col items-center justify-center text-center px-6">
                  {/* Cam yansıması */}
                  <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,240,220,0.14)_0%,transparent_32%,transparent_62%,rgba(255,240,220,0.07)_74%,transparent_80%)]" />
                  <KinaMotif className="relative w-24 text-[#D9A86C]/80 mb-3" />
                  <h1 className={`${SCRIPT} relative text-[#F6DDBF] leading-[1.02] text-[clamp(2.6rem,12.5cqw,4.4rem)] break-words max-w-full [text-shadow:0_0_24px_rgba(227,178,118,0.35)]`}>
                    {names.map((p, i) => (
                      <span key={p + i} className="block">
                        {i > 0 && <span className={`${SERIF} block text-[0.36em] italic text-[#E3B276] my-1`}>ve</span>}
                        {p}
                      </span>
                    ))}
                  </h1>
                  {(d.date.day || d.venue) && (
                    <div className={`${SERIF} relative mt-5 text-[13px] tracking-[0.16em] uppercase text-[#E8CDAE]/90 space-y-1`}>
                      {d.date.day && <p>{[d.date.dayMonth || d.date.day, d.date.time].filter(Boolean).join(' · ')}</p>}
                      {d.venue && <p className="normal-case tracking-[0.04em] italic text-[15px]">{d.venue}</p>}
                    </div>
                  )}
                </div>
              </FoggedGlass>
            </div>
          </div>
        </motion.div>

        <motion.p {...fade(still ? 0 : 3.6)} className={`${SERIF} mt-16 text-lg italic text-[#E8D3BE] max-w-sm text-center`}>
          {d.subtitle || FLAVOR.tagline}
        </motion.p>
        <ScrollCue delay={still ? 0 : 4.2} className="text-[#E3B276]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Kına gecesine"
        classes={{
          root: 'min-h-[80svh]',
          eyebrow: 'text-[#E3B276]',
          date: `${SERIF} font-medium text-[clamp(2.6rem,11cqw,5.4rem)] leading-none text-[#F8EBDC]`,
          meta: 'text-[#CDB5A0]',
          cell: 'rounded-2xl bg-[#1A0C09]/60 backdrop-blur border border-[#D9A86C]/20 px-2 py-3',
          number: `${SERIF} font-medium text-[#F8EBDC]`,
          label: 'text-[#B0927A]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

/** Aynanın önünden geçen buhar (ekran harmanı: siyah = görünmez); hero'dan çıkınca söner. */
function Steam({ heroExit, mode }: BackdropState & { mode: 'preview' | 'live' }) {
  const opacity = useTransform(heroExit, [0, 0.6], [1, 0]);
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <LightLayer video={BUHAR} mode={mode} opacity={0.6} />
    </motion.div>
  );
}

function Backdrop(props: BackdropState & { mode: 'preview' | 'live' }) {
  return (
    <CinemaBackdrop
      {...props}
      video={VIDEO}
      base="radial-gradient(ellipse 60% 70% at 50% 45%, #4A211A 0%, #1E0D0A 60%, #0C0504 100%)"
      dimRgb="14,6,5"
      dim={0.64}
      zoom={1.1}
    />
  );
}

/**
 * KinaBuguluAyna — "Buğulu Ayna": gelin hamamının kemerli nişinde pirinç
 * çerçeveli bir ayna. Kubbe filgözlerinden huzmeler süzülür, buhar yükselir
 * (kodla üretilmiş video). Ayna buğulanır; misafir parmağıyla sildikçe
 * adlar ve kına gecesi bilgileri görünür, silinen yerden damlalar akar ve
 * buğu yavaşça geri gelir. Önden geçen buhar ayrı bir ışık katmanı videosudur.
 */
export function KinaBuguluAyna({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={FLAVOR}
      mode={mode}
      themeOverride={THEME}
      renderBackdrop={(state) => <Backdrop {...state} mode={mode} />}
      renderForeground={(state) => <Steam {...state} mode={mode} />}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
