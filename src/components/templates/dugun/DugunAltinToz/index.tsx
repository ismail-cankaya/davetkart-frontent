import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { InvitationComposition, type HeroRenderProps } from '../../shared/InvitationComposition';
import type { SectionTheme } from '../../shared/palette';
import type { TemplateFlavor } from '../../shared/flavor';
import { useStageActive } from '../../shared/three';
import { HeroCountdown, NO_NAMES, useHeroData } from '../../shared/yedi';
import { TemplateProps } from '../../types';
import { DUGUN_FLAVOR } from '../flavors';
import { DustField, fitText, sampleText, type TextLayout } from './tozMotoru';

const FAMILY = '"Cormorant Garamond", Georgia, serif';
const GOLD_TEXT = 'text-transparent bg-clip-text bg-[linear-gradient(180deg,#FFF1C9_0%,#F2C566_45%,#B9822A_100%)]';

const TOZ_TEMASI: SectionTheme = {
  id: 'midnight',
  base: 'bg-[#0B0A08] [&_.font-serif]:[font-family:var(--font-cormorant)] [&_.font-serif]:font-medium',
  page: 'text-[#F5E6C4]',
  surface: 'bg-[#16130E]/85 backdrop-blur-md',
  border: 'border-[#E2B85C]/20',
  heading: 'text-[#F8EBCB]',
  body: 'text-[#CDBF9F]',
  accent: 'text-[#E8C16F]',
  accentBg: 'bg-[#E2B85C]',
  accentSoft: 'bg-[#E2B85C]/10',
  input:
    'w-full bg-[#0B0A08]/70 border border-[#E2B85C]/25 rounded-lg px-3.5 py-2.5 text-sm text-[#F8EBCB] placeholder:text-[#9C8F72] focus:outline-none focus:border-[#E2B85C] focus:ring-2 focus:ring-[#E2B85C]/20 transition-all duration-300',
  buttonPrimary: 'bg-[linear-gradient(180deg,#F6D88C,#D9A441)] hover:brightness-110 text-[#1A1408] shadow-lg shadow-[#E2B85C]/20',
  buttonGhost: 'border border-[#E2B85C]/35 text-[#F5E6C4] hover:bg-[#E2B85C]/10',
  divider: 'bg-[#E2B85C]/15',
  timelineLine: 'from-[#E2B85C]/80 via-[#E2B85C]/35 to-transparent',
  envelope: {
    paper: 'bg-[#1A1610]',
    flap: 'bg-[#221C13]',
    seal: 'bg-[#E2B85C] text-[#1A1408]',
    glow: 'bg-[#E2B85C]/25',
    card: 'bg-[#F8EBCB] border border-[#E2B85C]/40'
  },
  mapHeader: 'bg-[#1A1610]',
  footer: { names: 'text-[#CDBF9F]', branding: 'text-[#9C8F72]' }
};

const TOZ_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  headings: { timeline: 'Gecenin Akışı', details: 'Adres', gallery: 'Altın Anlar', gift: 'Takı & Hediye', rsvp: 'Katılımınızı Bildirin' }
};

interface Stage {
  key: string;
  lines: string[];
  eyebrow?: string;
  caption?: React.ReactNode;
}

function DustBackdrop() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#1F1910_0%,#0B0A08_65%)]">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#E2B85C_0.8px,transparent_1px)] bg-[size:38px_38px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
    </div>
  );
}

/** Sahne: tuval + her aşamanın HTML yazısı aynı kutuda, üst üste. */
function GoldStage({ stages, index, scattered, mode }: { stages: Stage[]; index: number; scattered: boolean; mode: 'preview' | 'live' }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const field = useRef<DustField | null>(null);
  const reduced = useReducedMotion() ?? false;
  const active = useStageActive(box);
  // Düzen hangi aşamaya ait: aşama değişip yazı henüz ölçülmeden eski düzenle çizilmez.
  const [measured, setMeasured] = useState<{ key: string; layout: TextLayout } | null>(null);
  const [formed, setFormed] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Aşama değişince: yazı ölçülür, tozun hedefleri yenilenir.
  useEffect(() => {
    const c = canvas.current;
    if (!c || size.w === 0) return;
    let cancelled = false;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    c.width = size.w * dpr;
    c.height = size.h * dpr;
    const narrow = size.w < 640;
    const count = mode === 'preview' ? 900 : narrow ? 1500 : 2800;
    if (!field.current || field.current.count !== count) {
      field.current = new DustField(count, size.w, size.h);
      if (!reduced) field.current.burst(size.w / 2, size.h * 0.42);
    }
    field.current.resize(size.w, size.h);
    setFormed(false);
    document.fonts.ready.then(() => {
      if (cancelled || !field.current) return;
      const stage = stages[index];
      if (scattered || !stage) {
        setMeasured(null);
        field.current.setTargets(null);
        return;
      }
      const maxSize = Math.min(size.w * (stage.lines.length > 1 ? 0.2 : 0.16), 132);
      const l = fitText(ctx, stage.lines, size.w * 0.86, maxSize, FAMILY, size.h * 0.42);
      setMeasured({ key: stage.key, layout: l });
      field.current.setTargets(sampleText(l, size.w, size.h, count));
      if (reduced) field.current.snap();
    });
    const timer = window.setTimeout(() => !cancelled && setFormed(true), reduced ? 0 : 1700);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [size, index, scattered, stages, mode, reduced]);

  // Kare döngüsü: yalnızca ekranda ve hareket serbestken.
  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx || !field.current) return;
    const dpr = c.width / Math.max(1, size.w);
    if (reduced || !active) {
      field.current.settle = formed ? 1 : 0;
      field.current.draw(ctx, dpr, 0);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const f = field.current;
      if (f) {
        f.settle += ((formed ? 1 : 0) - f.settle) * 0.05;
        f.step(dt, now / 1000);
        f.draw(ctx, dpr, now / 1000);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, formed, size]);

  const stage = stages[index];
  const layout = measured && stage && measured.key === stage.key ? measured.layout : null;
  return (
    <div ref={box} className="absolute inset-0">
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 w-full h-full" />
      <AnimatePresence mode="wait">
        {stage && !scattered && layout && (
          <motion.div key={stage.key} className="absolute inset-x-0 top-0 bottom-0">
            {stage.eyebrow && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: formed ? 0.9 : 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 text-center text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-[#E8C16F]"
                style={{ top: layout.centerY - (layout.lines.length * layout.lineHeight) / 2 - 34 }}
              >
                {stage.eyebrow}
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: formed ? 1 : 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.9 }}
              className={`absolute inset-x-0 text-center italic font-medium ${GOLD_TEXT}`}
              style={{
                top: layout.centerY - (layout.lines.length * layout.lineHeight) / 2,
                fontFamily: FAMILY,
                fontSize: layout.fontSize,
                lineHeight: `${layout.lineHeight}px`
              }}
            >
              {stage.lines.map((line, i) => (
                <div key={i} className="whitespace-nowrap">
                  {line}
                </div>
              ))}
            </motion.div>
            {stage.caption && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: formed ? 1 : 0, y: formed ? 0 : 8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="absolute inset-x-0 px-6 text-center"
                style={{ top: layout.centerY + (layout.lines.length * layout.lineHeight) / 2 + 18 }}
              >
                {stage.caption}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToZHero({ invitation, scrollContainer, mode }: HeroRenderProps & { mode: 'preview' | 'live' }) {
  const d = useHeroData(invitation);
  const hero = useRef<HTMLDivElement>(null);
  const [viewH, setViewH] = useState(700);
  const [index, setIndex] = useState(0);
  const [scattered, setScattered] = useState(false);

  useEffect(() => {
    const el = scrollContainer?.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setViewH(el.clientHeight || 700));
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrollContainer]);

  const stages = useMemo<Stage[]>(() => {
    const list: Stage[] = [
      {
        key: 'adlar',
        lines: d.hasNames ? (d.people.length > 1 ? [d.people[0], '&', d.people[1]] : d.people) : [NO_NAMES],
        eyebrow: d.title || undefined,
        caption: d.subtitle ? <p className="mx-auto max-w-sm font-cormorant italic text-lg text-[#CDBF9F]">{d.subtitle}</p> : undefined
      }
    ];
    if (d.date.day)
      list.push({
        key: 'tarih',
        lines: [d.date.dayMonth || d.date.day, ...(d.date.year ? [d.date.year] : [])],
        eyebrow: [d.date.weekday, d.date.time].filter(Boolean).join(' · ') || undefined,
        caption: <HeroCountdown invitation={invitation} numberClassName="font-cormorant text-[#F8EBCB] text-3xl" labelClassName="text-[#9C8F72]" />
      });
    if (d.venue)
      list.push({
        key: 'mekan',
        lines: [d.venue],
        eyebrow: 'Mekân',
        caption: <p className="text-[11px] tracking-[0.3em] uppercase text-[#9C8F72]">Ayrıntılar aşağıda</p>
      });
    return list;
  }, [d, invitation]);

  const { scrollYProgress } = useScroll({ container: scrollContainer, target: hero, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setScattered(p > 0.94);
    setIndex(Math.min(stages.length - 1, Math.floor(p * stages.length * 1.02)));
  });

  return (
    <div dir="auto" ref={hero} className="relative" style={{ height: viewH * (1 + stages.length * 0.8) }}>
      {/* Ekran okuyucu için tek parça künye; görünen aşama yazıları bunun görsel kopyasıdır. */}
      <div className="sr-only">
        <h1>{d.hasNames ? d.people.join(' & ') : NO_NAMES}</h1>
        {d.title && <p>{d.title}</p>}
        {d.date.day && <p>{[d.date.weekday, d.date.day, d.date.time].filter(Boolean).join(' ')}</p>}
        {d.venue && <p>{d.venue}</p>}
        {d.subtitle && <p>{d.subtitle}</p>}
      </div>
      <div className="sticky top-0" style={{ height: viewH }} aria-hidden="true">
        <GoldStage stages={stages} index={index} scattered={scattered} mode={mode} />
        <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-2 text-[#E8C16F]/80">
          <div className="flex gap-1.5" aria-hidden="true">
            {stages.map((s, i) => (
              <span key={s.key} className={`h-1 rounded-full transition-all duration-500 ${i === index && !scattered ? 'w-6 bg-[#E2B85C]' : 'w-1.5 bg-[#E2B85C]/35'}`} />
            ))}
          </div>
          <span className="text-[10px] tracking-[0.35em] uppercase">Kaydırın</span>
          <ChevronDown size={16} className="motion-safe:animate-bounce" />
        </div>
      </div>
    </div>
  );
}

/**
 * DugunAltinToz — "Altın Toz": açılışta tek noktadan patlayan binlerce altın
 * zerre çiftin adlarını yazar; kaydırdıkça dağılıp tarihi, sonra mekânı yazar.
 * Toz tuvalde, yazı her zaman aynı yerde duran HTML'dir.
 */
export function DugunAltinToz({ invitation, mode = 'preview' }: TemplateProps) {
  return (
    <InvitationComposition
      invitation={invitation}
      flavor={TOZ_FLAVOR}
      mode={mode}
      themeOverride={TOZ_TEMASI}
      renderBackdrop={() => <DustBackdrop />}
      renderHero={(props) => <ToZHero {...props} mode={mode} />}
    />
  );
}
