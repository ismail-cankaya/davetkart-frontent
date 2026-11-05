import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createStage, type Stage } from '../lib/stage';
import { rng } from '../lib/glsl';
import type { SceneContext } from '../lib/types';

/**
 * Saray Kapısı'nın ortak sahnesi: mermer koridor, sütunlar, kemerler ve
 * sonunda oymalı iki kanatlı kapı. Giriş ve döngü klipleri aynı sahneyi
 * farklı kamera/kapı durumuyla çizer; giriş klibinin son durumu döngünün
 * dinlenme durumudur (kesme görünmez).
 */
export interface SarayState {
  camZ: number;
  camY: number;
  /** 0 = kapalı, 1 = tam açık (~72°). */
  open: number;
  /** Işık huzmelerinin zamanı (döngüde periyodik). */
  rayPhase: number;
  /** Toz zerrelerinin zamanı. */
  dustT: number;
  dustPeriod: number;
}

function marbleTexture(size: number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const img = g.createImageData(size, size);
  const r = rng(31);
  const grid = 64;
  const vals = Array.from({ length: grid * grid }, () => r());
  const vn = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const fx = x - xi, fy = y - yi;
    const s = (k: number) => k * k * (3 - 2 * k);
    const at = (i: number, j: number) => vals[((j % grid) + grid) % grid * grid + (((i % grid) + grid) % grid)];
    const a = at(xi, yi), b = at(xi + 1, yi), cc = at(xi, yi + 1), d = at(xi + 1, yi + 1);
    return a + (b - a) * s(fx) + (cc - a) * s(fy) + (a - b - cc + d) * s(fx) * s(fy);
  };
  const fbm = (x: number, y: number) => {
    let v = 0, a = 0.5;
    for (let o = 0; o < 5; o++) {
      v += a * vn(x, y);
      x *= 2.02;
      y *= 2.02;
      a *= 0.5;
    }
    return v;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * 8, v = (y / size) * 8;
      const n = fbm(u, v);
      const vein = Math.abs(Math.sin((u + v * 0.6) * 1.3 + n * 7.0));
      const fine = Math.pow(1 - vein, 14) * 0.55 + Math.pow(1 - Math.abs(Math.sin(u * 2.7 - v + n * 11)), 30) * 0.3;
      const base = 236 - n * 18;
      const i = (y * size + x) * 4;
      img.data[i] = base - fine * 70;
      img.data[i + 1] = base - 4 - fine * 72;
      img.data[i + 2] = base - 10 - fine * 66;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

/** Oymalı kapı kanadı: çerçeve, çakma paneller, ortada pirinç madalyon. */
function doorLeaf(width: number, height: number, wood: THREE.Material, brass: THREE.Material): THREE.Group {
  const leaf = new THREE.Group();
  const slab = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.14), wood);
  slab.position.set(width / 2, height / 2, 0);
  leaf.add(slab);
  const panel = (w: number, h: number, x: number, y: number) => {
    const outer = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), wood);
    outer.position.set(x, y, 0.09);
    leaf.add(outer);
    const inner = new THREE.Mesh(new THREE.BoxGeometry(w * 0.82, h * 0.86, 0.05), wood);
    inner.position.set(x, y, 0.12);
    leaf.add(inner);
    const rim = new THREE.Mesh(new THREE.BoxGeometry(w * 0.9, 0.025, 0.02), brass);
    rim.position.set(x, y + h * 0.46, 0.13);
    leaf.add(rim);
    const rim2 = rim.clone();
    rim2.position.y = y - h * 0.46;
    leaf.add(rim2);
  };
  panel(width * 0.72, height * 0.36, width / 2, height * 0.72);
  panel(width * 0.72, height * 0.3, width / 2, height * 0.3);
  const medal = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 8), brass);
  medal.rotation.x = Math.PI / 2;
  medal.position.set(width / 2, height * 0.51, 0.13);
  leaf.add(medal);
  const knob = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.02, 8, 24), brass);
  knob.position.set(width * 0.88, height * 0.48, 0.14);
  leaf.add(knob);
  // Çivi sırası
  for (let k = 0; k < 9; k++) {
    for (const yy of [0.08, 0.92]) {
      const stud = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), brass);
      stud.position.set(width * (0.1 + k * 0.1), height * yy, 0.09);
      leaf.add(stud);
    }
  }
  return leaf;
}

export function buildSaray(ctx: SceneContext) {
  const { width: W, height: H } = ctx;
  const portrait = ctx.variant === 'mobile';
  const stage: Stage = createStage(ctx, {
    exposure: 0.7,
    bloom: { strength: 1.2, threshold: 0.85, radius: 1 },
    vignette: 0.55,
    grain: 0,
    dither: false,
    samples: 4
  });
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(stage.renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.background = new THREE.Color('#080605');
  scene.fog = new THREE.Fog('#0d0a07', 7, 26);
  const camera = new THREE.PerspectiveCamera(portrait ? 62 : 46, W / H, 0.1, 80);

  const marble = marbleTexture(1024);
  const floorTex = marble.clone();
  floorTex.repeat.set(2, 6);
  floorTex.needsUpdate = true;
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 30),
    new THREE.MeshStandardMaterial({ map: floorTex, color: '#a89c8c', roughness: 0.1, metalness: 0.0, envMapIntensity: 0.18 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = 12;
  scene.add(floor);
  const wallMat = new THREE.MeshStandardMaterial({ map: marble, roughness: 0.35, envMapIntensity: 0.08, color: '#6e655a' });
  for (const side of [-1, 1]) {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(30, 10), wallMat);
    wall.rotation.y = -side * Math.PI / 2;
    wall.position.set(side * 3.4, 5, 12);
    scene.add(wall);
  }
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(7, 30), new THREE.MeshStandardMaterial({ color: '#2a231b', roughness: 0.8 }));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(0, 8.8, 12);
  scene.add(ceil);

  const gold = new THREE.MeshStandardMaterial({ color: '#c9a35e', metalness: 1, roughness: 0.3, envMapIntensity: 0.9 });
  const colMat = new THREE.MeshStandardMaterial({ map: marble, roughness: 0.2, envMapIntensity: 0.15, color: '#b3a897' });
  // Sütunlar + kemerler
  for (let i = 0; i < 7; i++) {
    const z = 0.5 + i * 3.2;
    for (const side of [-1, 1]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 5.2, 28), colMat);
      col.position.set(side * 2.75, 2.6, z);
      scene.add(col);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.22, 0.8), colMat);
      cap.position.set(side * 2.75, 5.3, z);
      scene.add(cap);
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.25, 0.75), colMat);
      base.position.set(side * 2.75, 0.12, z);
      scene.add(base);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.03, 8, 32), gold);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(side * 2.75, 5.1, z);
      scene.add(ring);
    }
    const arch = new THREE.Mesh(new THREE.TorusGeometry(2.75, 0.16, 10, 48, Math.PI), colMat);
    arch.position.set(0, 5.4, z);
    scene.add(arch);
    const archGold = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.03, 6, 48, Math.PI), gold);
    archGold.position.set(0, 5.4, z);
    scene.add(archGold);
  }

  // Kapı: kemerli çerçeve + iki kanat, arkasında ışık.
  const doorW = 1.55, doorH = 4.6, doorZ = -1.6;
  const hole = new THREE.Shape();
  hole.moveTo(-3.5, 0);
  hole.lineTo(3.5, 0);
  hole.lineTo(3.5, 9);
  hole.lineTo(-3.5, 9);
  hole.lineTo(-3.5, 0);
  const opening = new THREE.Path();
  opening.moveTo(-doorW, 0);
  opening.lineTo(doorW, 0);
  opening.lineTo(doorW, doorH);
  opening.absarc(0, doorH, doorW, 0, Math.PI, false);
  opening.lineTo(-doorW, 0);
  hole.holes.push(opening);
  const frame = new THREE.Mesh(
    new THREE.ExtrudeGeometry(hole, { depth: 0.4, bevelEnabled: false }),
    new THREE.MeshStandardMaterial({ map: marble, color: '#8a8070', roughness: 0.3, envMapIntensity: 0.1 })
  );
  frame.position.set(0, 0, doorZ - 0.2);
  scene.add(frame);
  const archTrim = new THREE.Mesh(new THREE.TorusGeometry(doorW + 0.08, 0.06, 10, 48, Math.PI), gold);
  archTrim.position.set(0, doorH, doorZ + 0.22);
  scene.add(archTrim);
  // Kemerin üstünde lunet: ışık geçiren kafes (sabit)
  const wood = new THREE.MeshStandardMaterial({ color: '#4a2f1a', roughness: 0.55, metalness: 0.05, envMapIntensity: 0.5 });
  const leftHinge = new THREE.Group();
  leftHinge.position.set(-doorW, 0, doorZ);
  leftHinge.add(doorLeaf(doorW, doorH, wood, gold));
  scene.add(leftHinge);
  const rightHinge = new THREE.Group();
  rightHinge.position.set(doorW, 0, doorZ);
  const rl = doorLeaf(doorW, doorH, wood, gold);
  rl.scale.x = -1;
  rightHinge.add(rl);
  scene.add(rightHinge);
  const lunette = new THREE.Mesh(new THREE.CircleGeometry(doorW, 48, 0, Math.PI), new THREE.MeshStandardMaterial({ color: '#3a2414', roughness: 0.5 }));
  lunette.position.set(0, doorH, doorZ - 0.02);
  scene.add(lunette);

  // Kapının ardındaki ışık: HDR düzlem (bloom'u besler).
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(10, 9), new THREE.MeshBasicMaterial({ color: new THREE.Color(6.5, 5.2, 3.6) }));
  glow.position.set(0, 3.5, doorZ - 1.2);
  scene.add(glow);

  // Zemine düşen ışık halısı: kapı aralığıyla genişleyen yamuk.
  const carpetMat = new THREE.ShaderMaterial({
    uniforms: { uOpen: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: /* glsl */ `
      uniform float uOpen; varying vec2 vUv;
      void main() {
        float z = vUv.y;               // 0: kapı, 1: koridor
        float half_ = mix(0.02 + uOpen * 0.28, 0.06 + uOpen * 0.62, z);
        float x = abs(vUv.x - 0.5);
        float m = smoothstep(half_, half_ - 0.08, x) * (1.0 - smoothstep(0.0, 1.0, z)) * (0.15 + uOpen);
        gl_FragColor = vec4(vec3(1.0, 0.78, 0.5) * m * 0.9, 1.0);
      }`
  });
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(6, 16), carpetMat);
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.set(0, 0.01, doorZ + 8);
  scene.add(carpet);

  // Işık huzmeleri: kapıdan kameraya doğru açılan eklemeli düzlemler.
  const rayMat = new THREE.ShaderMaterial({
    uniforms: { uOpen: { value: 0 }, uPhase: { value: 0 } },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: /* glsl */ `
      uniform float uOpen, uPhase; varying vec2 vUv;
      void main() {
        float x = vUv.x - 0.5;
        float beams = 0.55 + 0.45 * sin(x * 38.0 + sin(uPhase) * 1.5) * sin(x * 17.0 - cos(uPhase) * 2.0 + 1.3);
        float fall = pow(1.0 - vUv.y, 1.6);
        float edge = smoothstep(0.5, 0.15, abs(x));
        float a = beams * fall * edge * uOpen * 0.11;
        gl_FragColor = vec4(vec3(1.0, 0.82, 0.58) * a, 1.0);
      }`
  });
  for (let i = 0; i < 3; i++) {
    const ray = new THREE.Mesh(new THREE.PlaneGeometry(3.4 + i * 1.6, 14), rayMat);
    ray.position.set(0, 2.6 - i * 0.2, doorZ + 7);
    ray.rotation.x = -Math.PI / 2 + 0.22 + i * 0.12;
    scene.add(ray);
  }

  // Sıcak duvar aplikleri
  scene.add(new THREE.AmbientLight('#2a1f18', 0.18));
  for (let i = 0; i < 4; i++) {
    const p = new THREE.PointLight('#ffa95a', 6, 5, 2);
    p.position.set(i % 2 ? 2.2 : -2.2, 3.6, 2.4 + i * 3.2);
    scene.add(p);
  }
  const doorLight = new THREE.SpotLight('#ffdcae', 0, 30, 0.6, 0.6, 1.2);
  doorLight.position.set(0, 3, doorZ - 1);
  doorLight.target.position.set(0, 0, 10);
  scene.add(doorLight, doorLight.target);

  // Toz zerreleri: ışıkta asılı (noktalar).
  const r = rng(77);
  const N = 500;
  const pos = new Float32Array(N * 3);
  const seed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    pos.set([(r() - 0.5) * 4, r() * 5, doorZ + 1 + r() * 9], i * 3);
    seed[i] = r() * 6.283;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const dustMat = new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 }, uP: { value: 10 }, uOpen: { value: 0 }, uSize: { value: H / 1080 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute float aSeed; uniform float uT, uP, uSize; varying float vA;
      void main() {
        float w = 6.2831853 * uT / uP;
        vec3 p = position + vec3(sin(w + aSeed) * 0.15, sin(w * 2.0 + aSeed * 1.7) * 0.12, cos(w + aSeed * 0.5) * 0.15);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        vA = 0.4 + 0.6 * pow(0.5 + 0.5 * sin(w * 3.0 + aSeed * 4.0), 2.0);
        gl_PointSize = 5.0 * uSize * (6.0 / -mv.z);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uOpen; varying float vA;
      void main() { float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d) * vA * uOpen * 0.8; gl_FragColor = vec4(vec3(1.0, 0.85, 0.6) * a, 1.0); }`
  });
  scene.add(new THREE.Points(dustGeo, dustMat));

  const look = new THREE.Vector3();
  return {
    render(s: SarayState, t: number) {
      const ang = s.open * 1.25;
      leftHinge.rotation.y = -ang;
      rightHinge.rotation.y = ang;
      const lightK = 0.12 + 0.88 * s.open;
      (glow.material as THREE.MeshBasicMaterial).color.setRGB(6.5 * lightK + 0.4, 5.2 * lightK + 0.3, 3.6 * lightK + 0.2);
      carpetMat.uniforms.uOpen.value = s.open;
      rayMat.uniforms.uOpen.value = s.open;
      rayMat.uniforms.uPhase.value = s.rayPhase;
      dustMat.uniforms.uT.value = s.dustT;
      dustMat.uniforms.uP.value = s.dustPeriod;
      dustMat.uniforms.uOpen.value = 0.3 + 0.7 * s.open;
      doorLight.intensity = 90 * s.open;
      camera.position.set(0, s.camY, s.camZ);
      look.set(0, s.camY * 0.55 + 0.9, doorZ);
      camera.lookAt(look);
      stage.render(scene, camera, t);
    }
  };
}
