import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '../../../../utils/cn';
import { hasWebGL, isVeryLowEnd, preferredQuality } from '../three/support';
import { useCanvasSlot } from '../three/canvasSlot';
import { useStageActive } from '../three/useStageActive';

export type UniformValue =
  | { type: '1f'; value: number }
  | { type: '2f'; value: [number, number] }
  | { type: '2fv' | '3fv' | '4fv'; value: number[] };

export interface LiveShaderFrame {
  /** Sahne zamanı (sn): verilen zaman kaynağından ya da saatten. */
  t: number;
  /** Gerçek saat (sn), dokunuş dalgaları gibi döngü dışı olaylar için. */
  clock: number;
  width: number;
  height: number;
}

interface LiveShaderProps {
  /** GLSL ES 1.0 parça gölgelendiricisi (`varying vec2 vUv`, `uTime`, `uResolution`). */
  fragment: string;
  mode: 'preview' | 'live';
  /** Her karede ek uniform'lar. */
  uniforms?: (frame: LiveShaderFrame) => Record<string, UniformValue>;
  /** Sahne zamanını videoya eşler: ilk karede bir kez okunur, sonra saat ilerletir. */
  timeSource?: () => number | null;
  /** Dokunuş: kanvas içindeki konum, shader'ın `p` uzayında (yükseklik = 1). */
  onPointer?: (x: number, y: number, clock: number) => void;
  className?: string;
  /** İlk kare çizildi (video artık altta kalabilir). */
  onReady?: () => void;
}

const VERT = 'attribute vec2 aPos; varying vec2 vUv; void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }';
const INTERACTIVE = 'a, button, input, select, textarea, label, [role="button"]';

/**
 * Videonun üstüne binen canlı WebGL katmanı (three.js'siz, ~3 kB). Video ile
 * AYNI shader'ı çizer; ilk kare çizilince yavaşça belirir ve video altta
 * kalır. Önizlemede, hareketi azalt'ta, WebGL'siz ya da çok zayıf cihazda
 * hiç açılmaz; sayfada tek WebGL yuvası kuralına uyar (canvasSlot).
 */
export function LiveShader({ fragment, mode, uniforms, timeSource, onPointer, className, onReady }: LiveShaderProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [shown, setShown] = useState(false);
  useEffect(() => setMounted(true), []);
  const eligible = mounted && mode === 'live' && !reduced && !failed && hasWebGL() && !isVeryLowEnd();
  const slot = useCanvasSlot(eligible);
  const active = useStageActive(ref);

  const uniformsRef = useRef(uniforms);
  uniformsRef.current = uniforms;
  const timeRef = useRef(timeSource);
  timeRef.current = timeSource;
  const pointerRef = useRef(onPointer);
  pointerRef.current = onPointer;
  const readyRef = useRef(onReady);
  readyRef.current = onReady;
  const offsetRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!slot || !active || !canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
    if (!gl) {
      setFailed(true);
      return;
    }
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, `precision highp float;\n${fragment}`);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      setFailed(true);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const locs = new Map<string, WebGLUniformLocation | null>();
    const u = (name: string) => {
      if (!locs.has(name)) locs.set(name, gl.getUniformLocation(prog, name));
      return locs.get(name) ?? null;
    };
    // Tam ekran shader: düşük kalitede 0.6, yüksekte 0.85 çözünürlük yeter.
    const scale = preferredQuality(mode) === 'high' ? 0.85 : 0.6;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * scale;
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onLost = (e: Event) => {
      e.preventDefault();
      setFailed(true);
    };
    canvas.addEventListener('webglcontextlost', onLost);

    const onDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest(INTERACTIVE)) return;
      const r = canvas.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      const x = (e.clientX - r.left - r.width / 2) / r.height;
      const y = -(e.clientY - r.top - r.height / 2) / r.height;
      pointerRef.current?.(x, y, performance.now() / 1000);
    };
    window.addEventListener('pointerdown', onDown, { passive: true });

    let raf = 0;
    let first = true;
    const frame = (now: number) => {
      const clock = now / 1000;
      if (offsetRef.current === null) {
        const vt = timeRef.current?.() ?? null;
        offsetRef.current = (vt ?? 0) - clock;
      }
      const t = clock + offsetRef.current;
      gl.uniform1f(u('uTime'), t);
      gl.uniform1f(u('uClock'), clock);
      gl.uniform2f(u('uResolution'), canvas.width, canvas.height);
      const extra = uniformsRef.current?.({ t, clock, width: canvas.width, height: canvas.height }) ?? {};
      for (const [name, spec] of Object.entries(extra)) {
        const l = u(name);
        if (!l) continue;
        if (spec.type === '1f') gl.uniform1f(l, spec.value);
        else if (spec.type === '2f') gl.uniform2f(l, spec.value[0], spec.value[1]);
        else if (spec.type === '2fv') gl.uniform2fv(l, spec.value);
        else if (spec.type === '3fv') gl.uniform3fv(l, spec.value);
        else gl.uniform4fv(l, spec.value);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (first) {
        first = false;
        setShown(true);
        readyRef.current?.();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('webglcontextlost', onLost);
      ro.disconnect();
    };
  }, [slot, active, fragment, mode]);

  if (!slot) return null;
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn('absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-[1600ms] ease-out', shown ? 'opacity-100' : 'opacity-0', className)}
    />
  );
}
