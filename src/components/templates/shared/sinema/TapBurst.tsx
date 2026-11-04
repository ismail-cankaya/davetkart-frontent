import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';

export interface BurstStyle {
  colors: string[];
  /** Patlama başına parçacık. */
  count?: number;
  /** Başlangıç hızı (px/sn). */
  speed?: number;
  /** Yerçekimi (px/sn²); negatif yükselir. */
  gravity?: number;
  /** Ömür (sn). */
  life?: number;
  /** Parçacık yarıçapı (px). */
  size?: number;
  /** Işıltı: kuyruk çizgisi bırakır (havai fişek). */
  trail?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  color: string;
  size: number;
  twinkle: number;
}

const INTERACTIVE = 'a, button, input, select, textarea, label, [role="button"], [contenteditable="true"]';

/**
 * Dokunulan yerde ışık patlaması (mikro etkileşim). Yalnızca canlı modda ve
 * hareketi azalt kapalıyken; parçacık yokken kare döngüsü durur. Düğmeye ve
 * forma dokunmak patlama üretmez.
 */
export function TapBurst({
  style,
  enabled,
  className,
  autoBursts
}: {
  style: BurstStyle;
  enabled: boolean;
  className?: string;
  /** Kendiliğinden patlamalar arası süre (sn); verilmezse yalnızca dokunuş. */
  autoBursts?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion() ?? false;
  const styleRef = useRef(style);
  styleRef.current = style;

  useEffect(() => {
    const canvas = ref.current;
    if (!enabled || reduced || !canvas) return;
    const g = canvas.getContext('2d');
    if (!g) return;
    const particles: Particle[] = [];
    let raf = 0;
    let last = 0;
    let idle = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const frame = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      const s = styleRef.current;
      g.setTransform(1, 0, 0, 1, 0, 0);
      if (s.trail) {
        g.globalCompositeOperation = 'destination-out';
        g.fillStyle = 'rgba(0,0,0,0.22)';
        g.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        g.clearRect(0, 0, canvas.width, canvas.height);
      }
      g.globalCompositeOperation = 'lighter';
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += dt;
        if (p.age >= p.life) {
          particles.splice(i, 1);
          continue;
        }
        p.vx *= 1 - 1.6 * dt;
        p.vy = p.vy * (1 - 1.6 * dt) + (s.gravity ?? 60) * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const k = 1 - p.age / p.life;
        const tw = 0.6 + 0.4 * Math.sin(p.age * 30 + p.twinkle);
        g.globalAlpha = Math.max(0, k * k * tw);
        g.fillStyle = p.color;
        g.beginPath();
        g.arc(p.x, p.y, p.size * (0.5 + 0.5 * k), 0, Math.PI * 2);
        g.fill();
      }
      g.globalAlpha = 1;
      idle = particles.length ? 0 : idle + 1;
      // Kuyruklu stilde son izler sönene dek birkaç kare daha çizilir.
      if (idle < (s.trail ? 24 : 1)) raf = requestAnimationFrame(frame);
      else {
        raf = 0;
        last = 0;
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const burst = (x: number, y: number) => {
      const s = styleRef.current;
      const n = s.count ?? 28;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.4;
        const v = (s.speed ?? 160) * (0.45 + Math.random() * 0.75);
        particles.push({
          x,
          y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          age: 0,
          life: (s.life ?? 1.1) * (0.7 + Math.random() * 0.5),
          color: s.colors[i % s.colors.length],
          size: (s.size ?? 2) * (0.6 + Math.random() * 0.8),
          twinkle: Math.random() * 10
        });
      }
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest(INTERACTIVE)) return;
      const r = canvas.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      burst(e.clientX - r.left, e.clientY - r.top);
    };
    window.addEventListener('pointerdown', onDown, { passive: true });

    let auto = 0;
    if (autoBursts) {
      auto = window.setInterval(() => {
        if (document.visibilityState !== 'visible') return;
        const r = canvas.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        burst(r.width * (0.15 + Math.random() * 0.7), r.height * (0.12 + Math.random() * 0.35));
      }, autoBursts * 1000);
    }

    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.clearInterval(auto);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, reduced, autoBursts]);

  return <canvas ref={ref} aria-hidden="true" className={cn('absolute inset-0 w-full h-full pointer-events-none', className)} />;
}
