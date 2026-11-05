import React, { useCallback, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type BackdropState, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { videoSet } from '../../shared/videoAssets';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { CinemaBackdrop, DateCountdown, LiveShader, ScrollCue, useTemplateFont, type LiveShaderFrame, type UniformValue } from '../../shared/sinema';
import { TemplateProps } from '../../types';
import { PARTI_FLAVOR } from '../flavors';
import { LAZER_FRAG, aimAt } from './lazerShader';

const VIDEO = videoSet('parti-lazer');
const FONT = 'Big+Shoulders+Display:wght@500;800;900';
const DISPLAY = "[font-family:'Big_Shoulders_Display',var(--font-sans),sans-serif]";
const INTERACTIVE = 'a, button, input, select, textarea, label, [role="button"]';

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#05030C] [&_.font-serif]:[font-family:'Big_Shoulders_Display',var(--font-sans),sans-serif] [&_.font-serif]:font-extrabold [&_.font-serif]:tracking-[0.02em] [&_.font-serif]:uppercase",
  page: 'text-[#E8E2FF]',
  surface: 'bg-[#0E0A1F]/75 backdrop-blur-xl shadow-[0_0_70px_-28px_rgba(40,255,140,0.35)]',
  border: 'border-[#7CFFB2]/18',
  heading: 'text-[#F5F2FF]',
  body: 'text-[#ADA4CF]',
  accent: 'text-[#4DFF9A]',
  accentBg: 'bg-[#FF2BB4]',
  accentSoft: 'bg-[#4DFF9A]/10',
  input:
    'w-full bg-[#090614]/80 border border-[#7CFFB2]/22 rounded-xl px-3.5 py-2.5 text-sm text-[#F5F2FF] placeholder:text-[#6E6694] focus:outline-none focus:border-[#4DFF9A] focus:ring-2 focus:ring-[#4DFF9A]/25 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(90deg,#1FE07A,#25C8FF_50%,#FF2BB4)] hover:brightness-110 text-[#05030C] font-semibold shadow-lg shadow-[#1FE07A]/25',
  buttonGhost: 'border border-[#7CFFB2]/30 text-[#E8E2FF] hover:bg-[#7CFFB2]/10',
  divider: 'bg-[#7CFFB2]/16',
  timelineLine: 'from-[#4DFF9A]/80 via-[#FF2BB4]/45 to-transparent',
  envelope: {
    paper: 'bg-[#120C26]',
    flap: 'bg-[#1A1236]',
    seal: 'bg-[#4DFF9A] text-[#05030C]',
    glow: 'bg-[#FF2BB4]/30',
    card: 'bg-[#F5F2FF] border border-[#7CFFB2]/45'
  },
  mapHeader: 'bg-[#0E0A1F]',
  footer: { names: 'text-[#ADA4CF]', branding: 'text-[#6E6694]' }
};

const FLAVOR: TemplateFlavor = {
  ...PARTI_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Sis, ışık ve bütün gece müzik',
  headings: { timeline: 'Set Listesi', details: 'Çatı Katı', gallery: 'Işık Kareleri', gift: 'Hediye', rsvp: 'Misafir Listesi' }
};

/**
 * Lazer yazısı: metin soldan sağa açılır, açılan kenarda yeşil bir lazer
 * noktası ve dikey ışın gezer — sanki lazer havaya yazıyor.
 */
function LaserLine({ text, delay, still, className }: { text: string; delay: number; still: boolean; className?: string }) {
  if (still) return <span className={className}>{text}</span>;
  return (
    <span className={`relative inline-block ${className ?? ''}`}>
      <motion.span
        className="inline-block"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(-30% -2% -30% 0)' }}
        transition={{ delay, duration: 1.1, ease: 'linear' }}
      >
        {text}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="absolute top-[-20%] bottom-[-20%] w-[2px] bg-[#7CFFB2] shadow-[0_0_10px_2px_#4DFF9A,0_0_30px_6px_rgba(77,255,154,0.5)] rounded-full"
        initial={{ left: '0%', opacity: 0 }}
        animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
        transition={{ delay, duration: 1.1, ease: 'linear', times: [0, 0.05, 0.9, 1] }}
      />
    </span>
  );
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONT);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const still = reduced || mode === 'preview';
  const fade = (delay: number) =>
    still ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } };
  const names = d.hasNames ? d.people : [NO_NAMES];
  const lines = [d.date.dayMonth || d.date.day, d.date.time, d.venue].filter(Boolean);

  return (
    <div className="relative grow flex flex-col">
      <div className="relative min-h-[100svh] flex flex-col items-center justify-center px-5 pt-14 pb-24 text-center" dir="auto">
        <motion.p {...fade(0.3)} className={`${DISPLAY} font-medium text-sm tracking-[0.5em] uppercase text-[#4DFF9A] [text-shadow:0_0_14px_rgba(77,255,154,0.7)]`}>
          {d.title || 'Lazer Gecesi'}
        </motion.p>
        <h1 className={`${DISPLAY} mt-4 font-black uppercase leading-[0.86] tracking-[-0.01em] text-[clamp(3.4rem,17cqw,9.5rem)] max-w-full break-words`}>
          {names.map((p, i) => (
            <motion.span
              key={p + i}
              className="block text-[#F7F3FF] [text-shadow:0_0_2px_#fff,0_0_18px_rgba(255,43,180,0.75),0_0_48px_rgba(37,200,255,0.45)]"
              initial={still ? false : { opacity: 0, letterSpacing: '0.25em', filter: 'blur(12px)' }}
              animate={{ opacity: 1, letterSpacing: '-0.01em', filter: 'blur(0px)' }}
              transition={{ delay: 0.6 + i * 0.35, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {i > 0 && <span className="block text-[0.3em] tracking-[0.4em] text-[#FF2BB4] my-1">&amp;</span>}
              {p}
            </motion.span>
          ))}
        </h1>
        {lines.length > 0 && (
          <div className={`${DISPLAY} mt-8 flex flex-col items-center gap-1.5 text-[clamp(1.2rem,5cqw,1.9rem)] font-extrabold uppercase tracking-[0.12em] text-[#DFFFEB] [text-shadow:0_0_10px_rgba(77,255,154,0.65)]`}>
            {lines.map((t, i) => (
              <LaserLine key={t} text={t} delay={2.2 + i * 1.0} still={still} />
            ))}
          </div>
        )}
        <motion.p {...fade(still ? 0 : 2.6 + lines.length)} className="mt-6 text-sm sm:text-base text-[#C9C1EC] max-w-md">
          {d.subtitle || FLAVOR.tagline}
        </motion.p>
        {mode === 'live' && !reduced && (
          <motion.p {...fade(3 + lines.length)} className={`${DISPLAY} mt-5 text-xs tracking-[0.4em] uppercase text-[#8C82B8]`}>
            Parmağınla lazerleri yönlendir
          </motion.p>
        )}
        <ScrollCue delay={still ? 0 : 3.4 + lines.length} className="text-[#7CFFB2]" />
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Işıklar yanıyor"
        classes={{
          root: 'min-h-[80svh]',
          eyebrow: 'text-[#4DFF9A]',
          date: `${DISPLAY} font-black uppercase text-[clamp(3rem,14cqw,7rem)] leading-[0.9] text-[#F7F3FF] [text-shadow:0_0_24px_rgba(255,43,180,0.55)]`,
          meta: 'text-[#ADA4CF]',
          cell: 'rounded-xl bg-[#090614]/60 backdrop-blur border border-[#7CFFB2]/18 px-2 py-3',
          number: `${DISPLAY} font-extrabold text-[#F7F3FF]`,
          label: 'text-[#8C82B8]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

/**
 * Sahne: video + canlı shader. Lazer yelpazeleri dokunulmadığı sürece
 * videodaki yolu izler; parmak/imleç hareket edince ona doğru yaylı kayar,
 * 4 sn boşta kalınca yeniden videodaki yola döner.
 */
function Backdrop(props: BackdropState & { mode: 'preview' | 'live' }) {
  const reduced = useReducedMotion() ?? false;
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pointer = useRef<{ x: number; y: number; at: number } | null>(null);
  const aim = useRef<[number, number] | null>(null);
  const flash = useRef<[number, number]>([0, 0]);
  const [flashOn, setFlashOn] = React.useState(0);

  const onVideo = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
  }, []);

  useEffect(() => {
    if (props.mode !== 'live' || reduced) return;
    const toP = (cx: number, cy: number) => {
      const r = frameRef.current?.getBoundingClientRect();
      if (!r || r.height === 0) return null;
      return { x: (cx - r.left - r.width / 2) / r.height, y: -(cy - r.top - r.height / 2) / r.height };
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.buttons === 0) return;
      const p = toP(e.clientX, e.clientY);
      if (p) pointer.current = { ...p, at: performance.now() };
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest(INTERACTIVE)) return;
      const p = toP(e.clientX, e.clientY);
      if (p) pointer.current = { ...p, at: performance.now() };
      flash.current = [performance.now() / 1000, 1];
      setFlashOn((n) => n + 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [props.mode, reduced]);

  const uniforms = useCallback(({ t, width, height }: LiveShaderFrame): Record<string, UniformValue> => {
    const auto = aimAt(t, width / height);
    const ptr = pointer.current;
    const idle = !ptr || performance.now() - ptr.at > 4000;
    const target: [number, number] = idle || !ptr ? auto : [ptr.x, Math.max(-0.25, ptr.y)];
    const cur = aim.current ?? auto;
    const k = idle ? 0.03 : 0.12;
    aim.current = [cur[0] + (target[0] - cur[0]) * k, cur[1] + (target[1] - cur[1]) * k];
    return {
      uAim: { type: '2f', value: aim.current },
      uFlash: { type: '2f', value: flash.current }
    };
  }, []);

  return (
    <CinemaBackdrop
      {...props}
      video={VIDEO}
      onVideo={onVideo}
      base="radial-gradient(ellipse 80% 70% at 50% 40%, #1C0E3A 0%, #0A0518 60%, #030208 100%)"
      dimRgb="5,3,12"
      dim={0.6}
      zoom={1.1}
    >
      <div ref={frameRef} className="absolute inset-0" />
      <LiveShader fragment={LAZER_FRAG} mode={props.mode} uniforms={uniforms} timeSource={() => videoRef.current?.currentTime ?? null} />
      {flashOn > 0 && (
        <motion.div
          key={flashOn}
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(200,170,255,0.18),transparent_70%)] mix-blend-screen"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_45%,rgba(3,2,8,0.55),transparent_80%)]" />
    </CinemaBackdrop>
  );
}

/**
 * PartiLazer — "Lazer Gösterisi": sisli çatı katında üç kaynaktan açılan
 * yelpaze lazerler (kodla üretilmiş video). Canlıda video aynı shader'ı çizen
 * WebGL katmanına devreder: lazerler parmağı/imleci izler, dokununca sis
 * flaşla aydınlanır. Tarih, saat ve mekân lazerle havaya yazılır.
 */
export function PartiLazer({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={FLAVOR}
      mode={mode}
      themeOverride={THEME}
      renderBackdrop={(state) => <Backdrop {...state} mode={mode} />}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
