import React, { useEffect, useRef } from 'react';
import type { MotionValue } from 'motion/react';
import type { StageState } from '../../shared/three';

/**
 * Suya damlayan mürekkep — tek tam ekran üçgen, tek fragment shader (WebGL1,
 * ek paket yok). Damla merkezleri ve başlangıç saatleri uniform dizisidir;
 * bulut kenarları alan bükmeli (domain warp) fbm ile tüylenir. Tuval yarım
 * çözünürlükte çizilir: yumuşak bir görüntüde fark edilmez, piksel işi 4'te 1.
 */

const MAX_DROPS = 8;

const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_scroll;
uniform vec3 u_drops[${MAX_DROPS}];

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y + u_scroll * 0.35);
  float t = u_time;

  vec2 q = vec2(fbm(p * 2.2 + vec2(0.0, t * 0.06)), fbm(p * 2.2 + vec2(5.2, -t * 0.05)));
  vec2 r = vec2(fbm(p * 3.0 + q * 2.4 + vec2(1.7, t * 0.04)), fbm(p * 3.0 + q * 2.4 + vec2(8.3, -t * 0.03)));

  float ink = 0.0;
  float edge = 0.0;
  for (int i = 0; i < ${MAX_DROPS}; i++){
    vec3 d = u_drops[i];
    float age = t - d.z;
    if (d.z < 0.0 || age < 0.0) continue;
    vec2 c = vec2(d.x * aspect, d.y);
    float radius = 0.62 * (1.0 - exp(-age * 0.55)) + 0.02;
    // Damla aşağı çöker: su içinde mürekkep düşerken açılır.
    vec2 w = p + (r - 0.5) * (0.35 + radius * 0.9) - vec2(0.0, -age * 0.035);
    float dist = length((w - c) * vec2(1.0, 0.85));
    float body = smoothstep(radius, radius * 0.25, dist);
    float wisps = smoothstep(0.35, 0.85, fbm(w * 5.0 + q * 3.0 + float(i) * 3.1));
    float drop = body * (0.55 + 0.6 * wisps) * clamp(1.15 - age * 0.02, 0.6, 1.0);
    ink += drop;
    edge += body * (1.0 - body) * 4.0;
  }
  ink = clamp(ink, 0.0, 1.0);

  vec3 water = mix(vec3(0.957, 0.949, 0.929), vec3(0.918, 0.937, 0.953), uv.y);
  water += (fbm(p * 8.0 + t * 0.1) - 0.5) * 0.03;
  vec3 deep = vec3(0.055, 0.06, 0.12);
  vec3 indigo = vec3(0.16, 0.2, 0.45);
  vec3 wine = vec3(0.36, 0.12, 0.22);
  vec3 inkCol = mix(indigo, deep, smoothstep(0.25, 0.95, ink));
  inkCol = mix(inkCol, wine, clamp(edge, 0.0, 1.0) * 0.35 * smoothstep(0.4, 0.7, r.x));
  vec3 col = mix(water, inkCol, smoothstep(0.02, 0.9, ink) * 0.94);
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Açılışın damlaları: (x, y [0..1, y yukarı], başlangıç saniyesi). */
const OPENING: [number, number, number][] = [
  [0.5, 0.6, 0.15],
  [0.32, 0.46, 0.75],
  [0.7, 0.68, 1.25],
  [0.58, 0.3, 1.9]
];

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

interface Props extends StageState {
  revealed: boolean;
  heroExit: MotionValue<number>;
}

export function MurekkepCanvas({ active, still, quality, onFail, onReady, revealed, heroExit }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef<{ gl: WebGLRenderingContext; prog: WebGLProgram; loc: Record<string, WebGLUniformLocation | null> } | null>(null);
  const drops = useRef<Float32Array>(new Float32Array(MAX_DROPS * 3).fill(-1));
  const nextDrop = useRef(0);
  const start = useRef<number | null>(null);

  const addDrop = (x: number, y: number, at: number) => {
    const i = nextDrop.current % MAX_DROPS;
    drops.current.set([x, y, at], i * 3);
    nextDrop.current++;
  };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
    if (!gl) return onFail();
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return onFail();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return onFail();
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    state.current = {
      gl,
      prog,
      loc: {
        res: gl.getUniformLocation(prog, 'u_res'),
        time: gl.getUniformLocation(prog, 'u_time'),
        scroll: gl.getUniformLocation(prog, 'u_scroll'),
        drops: gl.getUniformLocation(prog, 'u_drops')
      }
    };
    const lost = (e: Event) => {
      e.preventDefault();
      onFail();
    };
    canvas.addEventListener('webglcontextlost', lost);
    return () => {
      // `loseContext` çağrılmaz: StrictMode'daki ikinci kurulum aynı bağlamı alır.
      canvas.removeEventListener('webglcontextlost', lost);
      state.current = null;
    };
  }, [onFail]);

  // Dokunulan yere yeni damla düşer (mikro etkileşim).
  useEffect(() => {
    if (still) return;
    const onDown = (e: PointerEvent) => {
      const canvas = ref.current;
      if (!canvas || start.current === null) return;
      // Düğme, bağlantı ve form alanlarına dokunmak damla düşürmez.
      if (e.target instanceof Element && e.target.closest('button, a, input, textarea, select, label, [role="button"]')) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      addDrop(x, y - heroExit.get() * 0.35, (performance.now() - start.current) / 1000);
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, [still, heroExit]);

  useEffect(() => {
    if (!revealed || start.current !== null) return;
    start.current = performance.now();
    OPENING.forEach(([x, y, at]) => addDrop(x, y, at));
  }, [revealed]);

  useEffect(() => {
    const s = state.current;
    const canvas = ref.current;
    if (!s || !canvas) return;
    const scale = quality === 'high' ? 0.6 : 0.45;
    let raf = 0;
    let readySent = false;
    const draw = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75) * scale;
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const { gl, loc } = s;
      gl.viewport(0, 0, w, h);
      const t = still ? 9 : start.current === null ? 0 : (now - start.current) / 1000;
      gl.uniform2f(loc.res, w, h);
      gl.uniform1f(loc.time, t);
      gl.uniform1f(loc.scroll, heroExit.get());
      gl.uniform3fv(loc.drops, drops.current);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!readySent) {
        readySent = true;
        onReady();
      }
      if (active && !still) raf = requestAnimationFrame(draw);
    };
    if (still) OPENING.forEach(([x, y], i) => drops.current.set([x, y, 0], i * 3));
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [active, still, quality, heroExit, onReady]);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
}
