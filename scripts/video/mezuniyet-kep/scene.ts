import * as THREE from 'three';
import { createStage } from '../lib/stage';
import { rng } from '../lib/glsl';
import type { SceneDef } from '../lib/types';

/**
 * Kep Atma — gün batımında ağır çekim: aşağıdan fırlatılan kepler dönerek
 * yükselir, tepede asılı kalır; püsküller savrulur, kurdeleler ve pul
 * konfetiler güneşte parlar. Kaydırmaya bağlı oynatılır (kısa GOP).
 */
const D = 8;
const GRAV = 0.55;

function capMesh(board: THREE.Material, gold: THREE.Material): { group: THREE.Group; tassel: THREE.Group } {
  const group = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(1, 0.035, 1), board);
  group.add(top);
  const skull = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.33, 0.28, 32, 1, true), board);
  skull.position.y = -0.155;
  group.add(skull);
  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 16), gold);
  button.position.y = 0.035;
  group.add(button);
  const tassel = new THREE.Group();
  tassel.position.set(0, 0.04, 0);
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.52, 6), gold);
  cord.rotation.z = Math.PI / 2;
  cord.position.x = 0.26;
  tassel.add(cord);
  const hang = new THREE.Group();
  hang.position.x = 0.5;
  const drop = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.18, 6), gold);
  drop.position.y = -0.09;
  hang.add(drop);
  const brush = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 0.2, 12), gold);
  brush.position.y = -0.27;
  hang.add(brush);
  tassel.add(hang);
  group.add(tassel);
  group.userData.hang = hang;
  return { group, tassel };
}

const scene: SceneDef = {
  duration: D,
  fps: 24,
  loop: false,
  scrub: true,
  poster: 4.6,
  setup(ctx) {
    const { width: W, height: H } = ctx;
    const portrait = ctx.variant === 'mobile';
    const stage = createStage(ctx, {
      exposure: 1.0,
      bloom: { strength: 0.8, threshold: 0.8, radius: 1 },
      vignette: 0.4,
      grain: 0,
      dither: false,
      samples: 4
    });
    const scene3 = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(portrait ? 62 : 45, W / H, 0.1, 200);
    camera.position.set(0, -1.5, 9);
    camera.lookAt(0, 2.2, 0);

    // Gökyüzü kubbesi: ufukta turuncu, yukarıda gül → mor-mavi; güneş diski.
    const sunDir = new THREE.Vector3(portrait ? -0.25 : -0.45, 0.12, -1).normalize();
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(100, 48, 24),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uSun: { value: sunDir } },
        vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader: /* glsl */ `
          uniform vec3 uSun; varying vec3 vD;
          void main() {
            float h = vD.y;
            vec3 c = mix(vec3(1.0, 0.45, 0.12), vec3(0.85, 0.36, 0.40), smoothstep(-0.05, 0.3, h));
            c = mix(c, vec3(0.30, 0.24, 0.52), smoothstep(0.25, 0.7, h));
            c = mix(c, vec3(0.10, 0.11, 0.30), smoothstep(0.65, 1.0, h));
            float s = max(dot(normalize(vD), uSun), 0.0);
            c += vec3(1.0, 0.75, 0.45) * pow(s, 18.0) * 1.2;
            c += vec3(1.0, 0.9, 0.7) * pow(s, 900.0) * 18.0;
            gl_FragColor = vec4(c * 0.7, 1.0);
          }`
      })
    );
    scene3.add(sky);

    const board = new THREE.MeshStandardMaterial({ color: '#141623', roughness: 0.55, metalness: 0.1 });
    const gold = new THREE.MeshStandardMaterial({ color: '#e0b860', roughness: 0.35, metalness: 0.9, emissive: '#3a2408' });
    const sun = new THREE.DirectionalLight('#ffb86a', 3.6);
    sun.position.copy(sunDir).multiplyScalar(20);
    scene3.add(sun);
    scene3.add(new THREE.HemisphereLight('#9fa8ff', '#ff9a5a', 0.9));
    const fill = new THREE.DirectionalLight('#ffd9c0', 0.6);
    fill.position.set(3, -2, 6);
    scene3.add(fill);

    const r = rng(2026);
    interface Cap { g: THREE.Group; p0: THREE.Vector3; v: THREE.Vector3; t0: number; spin: THREE.Vector3; ph: number }
    const caps: Cap[] = [];
    const count = portrait ? 11 : 14;
    for (let i = 0; i < count; i++) {
      const { group } = capMesh(board, gold);
      const spread = portrait ? 4.5 : 10;
      const x0 = (r() - 0.5) * spread;
      group.scale.setScalar(0.75 + r() * 0.5);
      const cap: Cap = {
        g: group,
        p0: new THREE.Vector3(x0, -6 - r() * 2, (r() - 0.5) * 4),
        v: new THREE.Vector3((r() - 0.5) * 0.5 + x0 * 0.05, 3.0 + r() * 0.9, (r() - 0.5) * 0.3),
        t0: -1.4 + r() * 2.6,
        spin: new THREE.Vector3((r() - 0.5) * 1.6, (r() - 0.5) * 2.0, (r() - 0.5) * 1.6),
        ph: r() * 6
      };
      scene3.add(group);
      caps.push(cap);
    }

    // Kurdeleler: helis şeritler, dönerek süzülür.
    const ribbonMatA = new THREE.MeshStandardMaterial({ color: '#e7c06a', metalness: 0.8, roughness: 0.3, side: THREE.DoubleSide });
    const ribbonMatB = new THREE.MeshStandardMaterial({ color: '#2b3a8c', metalness: 0.3, roughness: 0.5, side: THREE.DoubleSide });
    interface Rib { m: THREE.Mesh; p0: THREE.Vector3; v: THREE.Vector3; spin: number; t0: number }
    const ribbons: Rib[] = [];
    for (let i = 0; i < 10; i++) {
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k <= 40; k++) {
        const a = k * 0.45;
        pts.push(new THREE.Vector3(Math.cos(a) * 0.12, k * 0.025, Math.sin(a) * 0.12));
      }
      const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.012, 3, false);
      geo.scale(1, 1, 3.5);
      const m = new THREE.Mesh(geo, i % 3 === 0 ? ribbonMatB : ribbonMatA);
      scene3.add(m);
      ribbons.push({ m, p0: new THREE.Vector3((r() - 0.5) * (portrait ? 4 : 8), -5 - r() * 2, (r() - 0.5) * 3), v: new THREE.Vector3((r() - 0.5) * 0.5, 2.6 + r() * 0.9, 0), spin: (r() - 0.5) * 3, t0: -1 + r() * 2.4 });
    }

    // Pul konfeti: güneşte parlayan küçük kareler (instanced).
    const confN = 260;
    const conf = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.06, 0.06), new THREE.MeshStandardMaterial({ color: '#ffe2a0', metalness: 1, roughness: 0.2, side: THREE.DoubleSide, emissive: '#2a1a05' }), confN);
    const confData = Array.from({ length: confN }, () => ({ p: new THREE.Vector3((r() - 0.5) * 12, -4 + r() * 12, (r() - 0.5) * 6), ph: r() * 6, s: 0.6 + r() * 0.8 }));
    scene3.add(conf);

    // Mercek parlaması: güneş yönünde ekrana yapışık hayalet halkalar.
    const flareTex = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const g = c.getContext('2d')!;
      const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(255,220,170,0.9)');
      gr.addColorStop(0.4, 'rgba(255,170,90,0.25)');
      gr.addColorStop(1, 'rgba(255,150,80,0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })();
    const ghosts = [0.0, 0.35, 0.6, 1.1, 1.4].map((k, i) => {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: flareTex, blending: THREE.AdditiveBlending, depthTest: false, transparent: true, opacity: i === 0 ? 0.9 : 0.18 }));
      sp.userData.k = k;
      sp.scale.setScalar(i === 0 ? 3.2 : 0.4 + i * 0.25);
      scene3.add(sp);
      return sp;
    });

    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const sunScreen = new THREE.Vector3();
    return {
      render(t) {
        for (const c of caps) {
          const tau = Math.max(0, t - c.t0) * 0.85;
          c.g.position.set(c.p0.x + c.v.x * tau, c.p0.y + c.v.y * tau - 0.5 * GRAV * tau * tau, c.p0.z + c.v.z * tau);
          c.g.rotation.set(0.35 + c.spin.x * tau, c.ph + c.spin.y * tau, 0.2 + c.spin.z * tau);
          const hang = c.g.userData.hang as THREE.Group;
          hang.rotation.z = 0.6 * Math.sin(tau * 3 + c.ph);
          hang.rotation.x = 0.4 * Math.cos(tau * 2.3 + c.ph);
        }
        for (const rb of ribbons) {
          const tau = Math.max(0, t - rb.t0) * 0.85;
          rb.m.position.set(rb.p0.x + rb.v.x * tau, rb.p0.y + rb.v.y * tau - 0.5 * GRAV * 0.8 * tau * tau, rb.p0.z);
          rb.m.rotation.set(rb.spin * tau * 0.4, rb.spin * tau, 0.3);
        }
        confData.forEach((cd, i) => {
          const y = cd.p.y + Math.sin(t * 0.6 + cd.ph) * 0.4 - t * 0.15;
          e.set(t * 2 + cd.ph, t * 1.3 + cd.ph * 2, cd.ph);
          q.setFromEuler(e);
          m4.compose(new THREE.Vector3(cd.p.x + Math.sin(t + cd.ph) * 0.3, y, cd.p.z), q, new THREE.Vector3(cd.s, cd.s, cd.s));
          conf.setMatrixAt(i, m4);
        });
        conf.instanceMatrix.needsUpdate = true;
        // Kamera ağır ağır yukarı bakar: keplerin tepe noktasına eşlik eder.
        const k = t / D;
        camera.position.set(Math.sin(k * 0.6) * 0.6, -1.5 + k * 1.2, 9 - k * 0.8);
        camera.lookAt(0, 1.4 + k * 2.2, 0);
        camera.updateMatrixWorld();
        // Parlama: güneşin ekran konumundan merkeze doğru dizilir.
        sunScreen.copy(sunDir).multiplyScalar(50).add(camera.position).project(camera);
        ghosts.forEach((g) => {
          const kk = g.userData.k as number;
          const ndc = new THREE.Vector3(sunScreen.x * (1 - kk), sunScreen.y * (1 - kk), 0.5).unproject(camera);
          g.position.copy(ndc);
          const dist = ndc.clone().sub(camera.position).length();
          g.scale.setScalar(((kk === 0 ? 3.2 : 0.3 + kk * 0.4) * dist) / 10);
        });
        stage.render(scene3, camera, t);
      }
    };
  }
};

export default scene;
