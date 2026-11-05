import React, { useCallback, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { NO_NAMES, useHeroData } from '../../shared/yedi';
import { DateCountdown, LiveShader, useTemplateFont, type LiveShaderFrame, type UniformValue } from '../../shared/sinema';
import { GyroButton, useDeviceMotion } from '../../shared/three';
import { TemplateProps } from '../../types';
import { PARTI_FLAVOR } from '../flavors';
import { GLASS, KOKTEYL_FRAG } from './kokteylShader';

const FONTS = 'Bodoni+Moda:ital,opsz,wght@0,6..96,500;0,6..96,700;1,6..96,500&family=Manrope:wght@400;600';
const BODONI = "[font-family:'Bodoni_Moda',var(--font-cormorant),serif]";
const MANROPE = "[font-family:'Manrope',var(--font-sans),sans-serif]";
const POUR_SECONDS = 2.8;
const LEVEL = 0.78;

const THEME: SectionTheme = {
  id: 'midnight',
  base: "bg-[#0D0510] [&_.font-serif]:[font-family:'Bodoni_Moda',var(--font-cormorant),serif] [&_.font-serif]:font-medium",
  page: 'text-[#F6E7EC]',
  surface: 'bg-[#1A0B1E]/80 backdrop-blur-xl shadow-[0_0_70px_-30px_rgba(255,120,90,0.4)]',
  border: 'border-[#FF9A7A]/18',
  heading: 'text-[#FFF3F6]',
  body: 'text-[#C9AEB8]',
  accent: 'text-[#FF9A6E]',
  accentBg: 'bg-[#E0336A]',
  accentSoft: 'bg-[#FF9A6E]/10',
  input:
    'w-full bg-[#140816]/80 border border-[#FF9A7A]/22 rounded-xl px-3.5 py-2.5 text-sm text-[#FFF3F6] placeholder:text-[#8E7280] focus:outline-none focus:border-[#FF9A6E] focus:ring-2 focus:ring-[#FF9A6E]/25 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(135deg,#FF9A4E,#E0336A)] hover:brightness-110 text-white shadow-lg shadow-[#E0336A]/30',
  buttonGhost: 'border border-[#FF9A7A]/30 text-[#F6E7EC] hover:bg-[#FF9A7A]/10',
  divider: 'bg-[#FF9A7A]/16',
  timelineLine: 'from-[#FF9A6E]/80 via-[#E0336A]/45 to-transparent',
  envelope: {
    paper: 'bg-[#2A0F25]',
    flap: 'bg-[#351430]',
    seal: 'bg-[#FF9A4E] text-[#2A0F25]',
    glow: 'bg-[#E0336A]/30',
    card: 'bg-[#FFF3F6] border border-[#FF9A7A]/40'
  },
  mapHeader: 'bg-[#1A0B1E]',
  footer: { names: 'text-[#C9AEB8]', branding: 'text-[#8E7280]' }
};

const FLAVOR: TemplateFlavor = {
  ...PARTI_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Kadehler hazır, bir tek siz eksiksiniz',
  headings: { timeline: 'Gecenin Menüsü', details: 'Bar Adresi', gallery: 'Kareler', gift: 'Hediye', rsvp: 'Listeye Adınızı Yazın' }
};

/** Bardağın p uzayındaki konumunu CSS'e taşır: yükseklik × yükseklik kare, ortada. */
const SQUARE = 'absolute left-1/2 top-1/2 h-full aspect-square -translate-x-1/2 -translate-y-1/2';
/** p uzayı y → kare içindeki yüzde (yukarı pozitif). */
const yPct = (y: number) => `${(0.5 - y) * 100}%`;

/** Durağan bardak (önizleme / WebGL yok): shader'la aynı ölçüler. */
function StaticGlass() {
  const { top, bottom, halfBottom: hb, halfTop: ht } = GLASS;
  const level = bottom + 0.035 + LEVEL * (top - bottom - 0.07);
  const yy = (y: number) => -y;
  const wAt = (y: number) => hb + (ht - hb) * ((y - bottom) / (top - bottom));
  return (
    <svg viewBox="-0.5 -0.5 1 1" className={SQUARE} aria-hidden="true">
      <defs>
        <linearGradient id="kokteyl-sivi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF9A4E" />
          <stop offset="1" stopColor="#C8174E" />
        </linearGradient>
      </defs>
      {[[-0.32, -0.3, 0.07, '#FF8A4E'], [0.36, -0.18, 0.09, '#FF4FA0'], [-0.4, 0.12, 0.06, '#7A9BFF'], [0.3, 0.2, 0.05, '#FFB35E']].map(([x, y, r, c]) => (
        <circle key={`${x}`} cx={x as number} cy={yy(y as number)} r={r as number} fill={c as string} opacity="0.22" />
      ))}
      <path d={`M${-wAt(level)} ${yy(level)} L${wAt(level)} ${yy(level)} L${hb - 0.007} ${yy(bottom + 0.028)} L${-hb + 0.007} ${yy(bottom + 0.028)} Z`} fill="url(#kokteyl-sivi)" opacity="0.92" />
      <path d={`M${-ht} ${yy(top)} L${ht} ${yy(top)} L${hb} ${yy(bottom)} L${-hb} ${yy(bottom)} Z`} fill="rgba(220,230,255,0.08)" stroke="rgba(230,235,255,0.55)" strokeWidth="0.006" />
      {[-0.042, 0.014, 0.056].map((x, i) => (
        <rect key={x} x={x - 0.028} y={yy(level) - 0.026} width="0.056" height="0.056" rx="0.01" fill="rgba(225,238,255,0.45)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.003" transform={`rotate(${[12, -18, 25][i]} ${x} ${yy(level)})`} />
      ))}
      <circle cx={ht - 0.008} cy={yy(top + 0.008)} r="0.043" fill="#FFD25E" stroke="#FF9A1E" strokeWidth="0.006" />
    </svg>
  );
}

function initials(people: string[]): string {
  const joined = people.join(' & ');
  if (joined.length <= 12) return joined;
  return people.map((p) => p.trim().charAt(0).toLocaleUpperCase('tr')).join(' & ');
}

function Hero({ invitation, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  useTemplateFont(FONTS);
  const d = useHeroData(invitation);
  const reduced = useReducedMotion() ?? false;
  const live = mode === 'live' && !reduced;
  const fade = (delay: number) =>
    !live ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 1, ease: [0.22, 1, 0.36, 1] as const } };
  const names = d.hasNames ? d.people : [NO_NAMES];
  const engraved = d.hasNames ? initials(d.people) : '';

  // Çalkalanma durumu (kare döngüsünde güncellenir).
  const sim = useRef({ tilt: 0, vel: 0, wave: 0.003, start: -1, clink: -10, iceVel: [0, 0, 0], iceOff: [0, 0, 0], last: -1 });
  const pointerX = useRef<number | null>(null);
  const motionState = useDeviceMotion(live);

  useEffect(() => {
    if (!live) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') pointerX.current = e.clientX / window.innerWidth - 0.5;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [live]);

  const uniforms = useCallback(
    ({ clock }: LiveShaderFrame): Record<string, UniformValue> => {
      const s = sim.current;
      if (s.start < 0) s.start = clock;
      const dt = s.last < 0 ? 1 / 60 : Math.min(0.05, clock - s.last);
      s.last = clock;
      const tIntro = clock - s.start;
      const pourK = Math.min(1, tIntro / POUR_SECONDS);
      const level = LEVEL * (1 - Math.pow(1 - pourK, 2.2));
      const pour = tIntro < POUR_SECONDS ? Math.min(1, tIntro * 3) : Math.max(0, 1 - (tIntro - POUR_SECONDS) * 4);

      // Hedef eğim: telefonun yerçekimi ya da masaüstünde imlecin yatay konumu.
      const m = motionState.current;
      const target = m.live ? Math.max(-0.35, Math.min(0.35, -m.gx * 0.5)) : (pointerX.current ?? 0) * -0.45;
      const acc = -22 * (s.tilt - target) - 3.4 * s.vel;
      s.vel += acc * dt;
      s.tilt = Math.max(-0.4, Math.min(0.4, s.tilt + s.vel * dt));
      const shake = m.shake * 0.004;
      s.wave = Math.min(0.014, s.wave * Math.exp(-dt * 1.4) + Math.abs(s.vel) * 0.0016 * dt * 60 * 0.1 + shake * dt * 10);
      s.wave = Math.max(0.0025 + (pour > 0 ? 0.004 * pour : 0), s.wave);

      const surface = (x: number) => GLASS.bottom + 0.035 + level * (GLASS.top - GLASS.bottom - 0.07) + Math.tan(s.tilt) * x;
      const xs = [-0.042, 0.014, 0.056];
      const ice: number[] = [];
      xs.forEach((x0, i) => {
        // Buz yüzeyde yüzer: yaylı salınım + tokuşma itkisi.
        s.iceVel[i] += (-40 * s.iceOff[i] - 4 * s.iceVel[i]) * dt;
        s.iceOff[i] += s.iceVel[i] * dt;
        const x = x0 + s.tilt * 0.06 + 0.004 * Math.sin(clock * 1.3 + i * 2);
        const y = Math.max(GLASS.bottom + 0.06, surface(x) - 0.018 + s.iceOff[i] + 0.004 * Math.sin(clock * 1.7 + i));
        ice.push(x, y, [0.2, -0.32, 0.45][i] + s.tilt * 1.2 + 0.05 * Math.sin(clock * 0.9 + i));
      });
      return {
        uLevel: { type: '1f', value: level },
        uTilt: { type: '1f', value: s.tilt },
        uWave: { type: '1f', value: s.wave },
        uPour: { type: '1f', value: pour },
        uIce: { type: '3fv', value: ice },
        uClink: { type: '1f', value: s.clink }
      };
    },
    [motionState]
  );

  const onPointer = useCallback((_x: number, _y: number, clock: number) => {
    const s = sim.current;
    s.clink = clock;
    s.iceVel = s.iceVel.map((v, i) => v - 0.25 - i * 0.05);
    s.wave = Math.min(0.014, s.wave + 0.005);
    s.vel += (Math.random() - 0.5) * 1.6;
  }, []);

  return (
    <div className="relative grow flex flex-col">
      <div className="relative h-[100svh] min-h-[560px] overflow-hidden" dir="auto">
        <StaticGlass />
        <LiveShader fragment={KOKTEYL_FRAG} mode={mode} uniforms={uniforms} onPointer={onPointer} />
        {/* Kazıma: buzlu cam üstünde ince, mat harfler */}
        {engraved && (
          <div aria-hidden="true" className={`${SQUARE} pointer-events-none [container-type:size]`}>
            <p
              className={`${BODONI} absolute left-1/2 -translate-x-1/2 -translate-y-1/2 italic text-center whitespace-nowrap tracking-[0.06em] text-white/45 mix-blend-screen [text-shadow:0_1px_0_rgba(255,255,255,0.35),0_-1px_0_rgba(0,0,0,0.25)]`}
              style={{ top: yPct(-0.12), fontSize: '3.2cqh' }}
            >
              {engraved}
            </p>
          </div>
        )}
        {/* Üst: adlar */}
        <div className="absolute inset-x-0 top-0 h-[33%] flex flex-col items-center justify-end px-5 pb-2 text-center pointer-events-none">
          <motion.p {...fade(0.3)} className={`${MANROPE} text-[10px] font-semibold tracking-[0.42em] uppercase text-[#FF9A6E]`}>
            {d.title || 'Kokteyl Daveti'}
          </motion.p>
          <h1 className={`${BODONI} mt-2 font-medium leading-[0.95] tracking-[-0.01em] text-[clamp(2.1rem,9.5cqw,4.6rem)] text-[#FFF3F6] max-w-full break-words`}>
            {names.map((p, i) => (
              <motion.span key={p + i} {...fade(0.6 + i * 0.3)} className="inline">
                {i > 0 && <span className="italic text-[#FF9A6E]"> &amp; </span>}
                {p}
              </motion.span>
            ))}
          </h1>
        </div>
        {/* Alt: tarih, mekân, ipucu */}
        <div className="absolute inset-x-0 bottom-0 h-[20%] flex flex-col items-center justify-start px-5 text-center pointer-events-none">
          <motion.p {...fade(2.6)} className={`${MANROPE} text-[12px] font-semibold tracking-[0.22em] uppercase text-[#FFE9EF]`}>
            {[d.date.dayMonth || d.date.day, d.date.time, d.venue].filter(Boolean).join('  ·  ')}
          </motion.p>
          <motion.p {...fade(2.9)} className={`${BODONI} mt-1.5 italic text-[15px] text-[#E8CCD6] max-w-sm`}>
            {d.subtitle || FLAVOR.tagline}
          </motion.p>
          {live && (
            <motion.p {...fade(3.3)} className={`${MANROPE} mt-2 text-[9px] tracking-[0.3em] uppercase text-[#9C7E8C]`}>
              Eğ · çalkala · dokun, buzlar tokuşsun
            </motion.p>
          )}
          {live && (
            <div className="pointer-events-auto">
              <GyroButton className="mt-2 bg-[#1A0B1E]/70 text-[#FF9A6E] border border-[#FF9A7A]/25" label="Eğerek çalkala" />
            </div>
          )}
        </div>
      </div>
      <DateCountdown
        invitation={invitation}
        eyebrow="Kadehlere kalan"
        classes={{
          root: 'min-h-[75svh]',
          eyebrow: 'text-[#FF9A6E]',
          date: `${BODONI} font-medium text-[clamp(2.6rem,11cqw,5.2rem)] leading-none text-[#FFF3F6]`,
          meta: `${MANROPE} text-[#C9AEB8]`,
          cell: 'rounded-2xl bg-[#140816]/60 backdrop-blur border border-[#FF9A7A]/18 px-2 py-3',
          number: `${BODONI} font-medium text-[#FFF3F6]`,
          label: 'text-[#8E7280]',
          divider: 'hidden'
        }}
      />
    </div>
  );
}

/**
 * PartiKokteyl — "Kokteyl": bar ışıklarının önünde kristal bir bardak.
 * Açılışta yukarıdan dökülen sıvı bardağı doldurur; buz küpleri yüzeyde
 * yüzer, kabarcıklar yükselir, arkadaki ışıklar camdan geçerken kırılır
 * (tek bir canlı WebGL shader'ı). Telefon eğilince sıvı yaylı biçimde
 * çalkalanır (masaüstünde imleç), sallayınca dalgalanır; dokununca buzlar
 * tokuşur ve ağızda bir ışıltı çakar. Bardağa adların baş harfleri kazınmış.
 */
export function PartiKokteyl({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={FLAVOR}
      mode={mode}
      themeOverride={THEME}
      renderBackdrop={() => <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#2A0F25_0%,#0D0510_70%)]" />}
      renderHero={(props) => <Hero {...props} mode={mode} />}
    />
  );
}
