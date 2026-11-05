import { useEffect, useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { HeroCountdown, NO_NAMES, useHeroData, type HeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';

const KAR_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0F1B2E] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-semibold',
  page: 'text-[#EEF3FA]',
  surface: 'bg-[#1A2C47]/75 backdrop-blur-md shadow-[0_0_40px_-18px_rgba(200,220,255,0.4)]',
  border: 'border-[#C9D8EE]/25',
  heading: 'text-[#EEF3FA]',
  body: 'text-[#BCCAE0]',
  accent: 'text-[#D9B97A]',
  accentBg: 'bg-[#D9B97A]',
  accentSoft: 'bg-[#D9B97A]/10',
  input:
    'w-full bg-[#0F1B2E]/70 border border-[#C9D8EE]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#EEF3FA] placeholder:text-[#8494AE] focus:outline-none focus:border-[#D9B97A] focus:ring-2 focus:ring-[#D9B97A]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#E8CD94,#C29A55)] hover:brightness-110 text-[#0F1B2E] shadow-lg shadow-[#D9B97A]/25',
  buttonGhost: 'border border-[#C9D8EE]/40 text-[#EEF3FA] hover:bg-white/10',
  divider: 'bg-[#C9D8EE]/20',
  timelineLine: 'from-[#D9B97A]/80 via-[#C9D8EE]/40 to-transparent',
  envelope: {
    paper: 'bg-[#1A2C47]',
    flap: 'bg-[#22385A]',
    seal: 'bg-[#D9B97A] text-[#0F1B2E]',
    glow: 'bg-[#C9D8EE]/30',
    card: 'bg-[#F8FAFD] border border-[#D9B97A]/50'
  },
  mapHeader: 'bg-[#1A2C47]',
  footer: { names: 'text-[#BCCAE0]', branding: 'text-[#8494AE]' }
};

const KAR_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  tagline: 'Bir kış masalında, birlikte',
  headings: {
    timeline: 'Masalın Akışı',
    details: 'Köşke Giden Yol',
    gallery: 'Kardan Kareler',
    gift: 'Hediye & Takı',
    rsvp: 'Masalımıza Katılın'
  }
};

/* ——— Kar motoru (canvas 2B) ——— */
interface Tane {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  faz: number;
  durdu: boolean;
}

interface Motor {
  taneler: Tane[];
  yigin: number[];
  R: number;
}

const TANE_SAYISI = 320;
const KUTU = 40; // birikme kovası sayısı

/** Deterministik sözde rastgele (önizleme her seferinde aynı görünsün). */
function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function taneleriKur(R: number, statik: boolean): Tane[] {
  const r = rng(7);
  return Array.from({ length: TANE_SAYISI }, () => {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * R * 0.92;
    return {
      x: Math.cos(a) * d,
      y: statik ? Math.sin(a) * d : -R + r() * R * 1.2,
      vx: 0,
      vy: 6 + r() * 10,
      r: 0.8 + r() * 1.9,
      faz: r() * Math.PI * 2,
      durdu: false
    };
  });
}

/** Küre içi: merkez (0,0), yarıçap R. Zemin = R·0,62 (köşkün durduğu tepe). */
function adim(m: Motor, t: number, dt: number) {
  const { R, yigin } = m;
  const zemin = R * 0.62;
  for (const p of m.taneler) {
    if (p.durdu) continue;
    // Yerçekimi + hava direnci (son hız ~23 px/s) + sinüs sürüklenme.
    p.vy += (60 - p.vy * 2.6) * dt;
    p.vx += (Math.sin(t * 0.9 + p.faz) * 8 - p.vx * 1.8) * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    // Cam: dışarı taşan tane içe yansır.
    const d = Math.hypot(p.x, p.y);
    const lim = R - p.r - 1;
    if (d > lim) {
      const nx = p.x / d;
      const ny = p.y / d;
      p.x = nx * lim;
      p.y = ny * lim;
      const dot = p.vx * nx + p.vy * ny;
      p.vx -= 1.6 * dot * nx;
      p.vy -= 1.6 * dot * ny;
    }
    // Çökelme: yavaşlamış tane zemine/yığına değince durur.
    const k = Math.max(0, Math.min(KUTU - 1, Math.floor(((p.x + R) / (2 * R)) * KUTU)));
    const taban = zemin - yigin[k];
    if (p.y >= taban && p.vy >= 0 && p.vy < 40) {
      p.y = taban;
      p.durdu = true;
      yigin[k] = Math.min(R * 0.12, yigin[k] + p.r * 0.35);
    }
  }
}

function salla(m: Motor, vx: number, vy: number) {
  const r = rng(Math.floor(performance.now()));
  m.yigin.fill(0);
  for (const p of m.taneler) {
    p.durdu = false;
    p.vx += vx * (0.4 + r() * 0.6) + (r() - 0.5) * 120;
    p.vy += vy * (0.4 + r() * 0.6) - 60 - r() * 140;
  }
}

function ciz(ctx: CanvasRenderingContext2D, m: Motor, w: number) {
  ctx.clearRect(0, 0, w, w);
  ctx.save();
  ctx.translate(w / 2, w / 2);
  ctx.fillStyle = '#FFFFFF';
  for (const p of m.taneler) {
    ctx.globalAlpha = p.durdu ? 0.95 : 0.55 + p.r * 0.18;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function Kosk() {
  return (
    <svg viewBox="0 0 120 80" className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[50%]" aria-hidden="true">
      <path d="M0 80 C 20 64, 100 64, 120 80 Z" fill="#F4F7FB" />
      <rect x="34" y="40" width="52" height="30" fill="#1C2F4C" />
      <path d="M28 42 L 60 18 L 92 42 Z" fill="#14233A" />
      <path d="M56 18 L 60 6 L 64 18 Z" fill="#D9B97A" />
      <rect x="54" y="52" width="12" height="18" rx="6" fill="#FFD98A" />
      <rect x="40" y="48" width="8" height="8" fill="#FFD98A" opacity="0.85" />
      <rect x="72" y="48" width="8" height="8" fill="#FFD98A" opacity="0.85" />
      <path d="M8 74 L 16 50 L 24 74 Z M98 74 L 106 46 L 114 74 Z" fill="#2E4A3A" />
    </svg>
  );
}

function Kure({ hareketli }: { hareketli: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motorRef = useRef<Motor | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let raf = 0;
    let w = 0;
    let last = performance.now();

    const boyutla = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(w * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const R = w / 2;
      const eski = motorRef.current;
      if (!eski || Math.abs(eski.R - R) > 1) {
        const m: Motor = { taneler: taneleriKur(R, !hareketli), yigin: new Array<number>(KUTU).fill(0), R };
        // Durgun son kare: 8 sn'lik yağış önceden hesaplanır.
        if (!hareketli) for (let i = 0; i < 240; i++) adim(m, i / 30, 1 / 30);
        motorRef.current = m;
      }
      if (!hareketli && motorRef.current) ciz(ctx, motorRef.current, w);
    };
    boyutla();
    const ro = new ResizeObserver(boyutla);
    ro.observe(canvas);

    const kare = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const m = motorRef.current;
      if (m) {
        adim(m, now / 1000, dt);
        ciz(ctx, m, w);
      }
      raf = requestAnimationFrame(kare);
    };
    if (hareketli) raf = requestAnimationFrame(kare);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [hareketli]);

  const sallaHiz = (vx: number, vy: number) => {
    const m = motorRef.current;
    const kis = (v: number) => Math.max(-600, Math.min(600, v)) * 0.5;
    if (m && hareketli) salla(m, kis(vx), kis(vy));
  };

  return (
    <motion.div
      initial={hareketli ? { opacity: 0, filter: 'brightness(0.15) blur(4px)' } : false}
      animate={{ opacity: 1, filter: 'brightness(1) blur(0px)' }}
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-[min(78vw,300px)] aspect-square"
    >
      <div className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(255,230,170,0.22),transparent_65%)]" aria-hidden="true" />
      <motion.div
        role={hareketli ? 'button' : undefined}
        tabIndex={hareketli ? 0 : undefined}
        aria-label={hareketli ? 'Kar küresini salla' : undefined}
        drag={hareketli ? 'x' : false}
        dragSnapToOrigin
        dragElastic={0.25}
        dragConstraints={{ left: -40, right: 40 }}
        onDrag={(_, info) => {
          if (Math.abs(info.velocity.x) > 250) sallaHiz(info.velocity.x, -Math.abs(info.velocity.x) * 0.6);
        }}
        onTap={() => sallaHiz(0, -300)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            sallaHiz(0, -300);
          }
        }}
        whileTap={hareketli ? { scale: 0.97 } : undefined}
        className={`absolute inset-0 rounded-full overflow-hidden border border-white/40 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.28),rgba(120,160,220,0.18)_45%,rgba(15,27,46,0.55)_100%)] shadow-[inset_0_0_40px_rgba(255,255,255,0.18),0_20px_60px_-20px_rgba(200,220,255,0.5)] ${hareketli ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        <Kosk />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
        <span className="pointer-events-none absolute left-[18%] top-[12%] w-[22%] h-[12%] rounded-full bg-white/25 blur-md rotate-[-30deg]" />
      </motion.div>
    </motion.div>
  );
}

function satirlar(d: HeroData): { k: string; l: string; v: string }[] {
  const s: { k: string; l: string; v: string }[] = [];
  if (d.date.day) s.push({ k: 'tarih', l: 'Tarih', v: [d.date.dayMonth || d.date.day, d.date.weekday].filter(Boolean).join(' · ') });
  if (d.date.time) s.push({ k: 'saat', l: 'Saat', v: d.date.time });
  if (d.venue) s.push({ k: 'mekan', l: 'Mekân', v: d.venue });
  return s;
}

function KarHero({ invitation, hareketli }: HeroRenderProps & { hareketli: boolean }) {
  const d = useHeroData(invitation);
  const bilgi = useMemo(() => satirlar(d), [d]);
  const belir = (delay: number) =>
    hareketli
      ? { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay } }
      : { initial: false as const };

  return (
    <div dir="auto" className="grow flex flex-col items-center justify-center px-5 pt-14 pb-16 text-center">
      <motion.p {...belir(0.2)} className="mb-6 text-[10px] sm:text-[11px] tracking-[0.42em] uppercase text-[#D9B97A]">
        {d.title || KAR_FLAVOR.tagline}
      </motion.p>
      <Kure hareketli={hareketli} />
      {/* Kaide: adlar burada yazar. */}
      <motion.div
        {...belir(0.6)}
        className="-mt-3 w-[min(86vw,330px)] rounded-b-[40px] rounded-t-xl bg-[linear-gradient(180deg,#5A3A22,#3A2414)] border-t-4 border-[#D9B97A] px-4 py-4 shadow-xl"
      >
        <motion.h1
          initial={hareketli ? { clipPath: 'inset(0 100% 0 0)' } : false}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1.6, delay: 1.6, ease: 'easeInOut' }}
          className="font-cormorant italic font-semibold leading-tight text-[clamp(1.5rem,7.5cqw,2.4rem)] break-words bg-[linear-gradient(180deg,#FBE7B0,#D9B97A_55%,#A97E3C)] bg-clip-text text-transparent"
        >
          {d.hasNames ? d.people.join(' & ') : NO_NAMES}
        </motion.h1>
      </motion.div>
      {hareketli && <p className="mt-3 text-[10px] tracking-[0.3em] uppercase text-[#8494AE]">Küreyi salla ya da dokun</p>}

      {bilgi.length > 0 && (
        <dl className="mt-7 w-full max-w-[320px] space-y-2.5">
          {bilgi.map((s, i) => (
            <motion.div key={s.k} {...belir(1 + i * 0.25)} className="flex items-baseline justify-between gap-4 border-b border-[#C9D8EE]/20 pb-2 text-left">
              <dt className="shrink-0 text-[10px] tracking-[0.3em] uppercase text-[#9FB0C8]">{s.l}</dt>
              <dd className="min-w-0 text-right font-cormorant text-lg text-[#EEF3FA] break-words">{s.v}</dd>
            </motion.div>
          ))}
        </dl>
      )}
      <motion.div {...belir(1.8)} className="mt-8">
        <HeroCountdown
          invitation={invitation}
          cellClassName="min-w-[56px] rounded-lg border border-[#C9D8EE]/30 bg-[#1A2C47]/70 px-2 py-1.5"
          numberClassName="font-cormorant text-2xl text-[#F3E2BC]"
          labelClassName="text-[10px] text-[#9FB0C8]"
        />
      </motion.div>
      {d.subtitle && <p className="mt-6 max-w-md font-cormorant italic text-lg text-[#D6DFEC]">{d.subtitle}</p>}
    </div>
  );
}

/**
 * DugunKarKuresi — cam kürede yağan kar ve küçük bir köşk; küreye dokununca kar
 * yeniden savrulur. Adlar kürenin altındaki ahşap kaidede yazar.
 * Önizleme / "hareketi azalt" → kar taneleri sabit durur.
 */
export function DugunKarKuresi({ invitation, mode = 'preview' }: TemplateProps) {
  const reduced = useReducedMotion() ?? false;
  const hareketli = mode === 'live' && !reduced;
  return (
    <InvitationComposition
        invitation={invitation}
        flavor={KAR_FLAVOR}
        mode={mode}
        themeOverride={KAR_TEMASI}
        renderBackdrop={() => (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,#22385A_0%,#0F1B2E_60%,#080F1B_100%)]" />
        )}
        renderHero={(props) => <KarHero {...props} hareketli={hareketli} />}
      />
  );
}
