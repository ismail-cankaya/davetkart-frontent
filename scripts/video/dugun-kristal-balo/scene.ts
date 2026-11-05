import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createStage } from '../lib/stage';
import { easeInOut, rng } from '../lib/glsl';
import type { SceneDef } from '../lib/types';

/**
 * Kristal Balo — karanlık balo salonunda dönen kristal avize. Kaydırmaya
 * bağlı oynatılır (döngü değil): kamera avizenin altından başlayıp etrafında
 * dönerek yükselir; kristallerde yıldız parıltıları, duvarlarda prizmatik ışık
 * lekeleri, önde bulanık bokeh. Kısa GOP'la kodlanır.
 */
const D = 8;

const scene: SceneDef = {
  duration: D,
  fps: 24,
  loop: false,
  scrub: true,
  poster: 0,
  setup(ctx) {
    const { width: W, height: H } = ctx;
    const portrait = ctx.variant === 'mobile';
    const stage = createStage(ctx, {
      exposure: 1.05,
      bloom: { strength: 1.0, threshold: 0.7, radius: 1 },
      vignette: 0.55,
      grain: 0,
      dither: false,
      samples: 4
    });
    const { renderer } = stage;
    const scene3 = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene3.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene3.background = new THREE.Color('#070814');
    scene3.fog = new THREE.FogExp2('#05060c', 0.035);

    const camera = new THREE.PerspectiveCamera(portrait ? 52 : 40, W / H, 0.1, 100);
    const r = rng(1919);

    const chandelier = new THREE.Group();
    scene3.add(chandelier);
    const gold = new THREE.MeshStandardMaterial({ color: '#c9a25a', metalness: 1, roughness: 0.25, envMapIntensity: 1.4 });
    const crystal = new THREE.MeshStandardMaterial({ color: '#9fb0cc', metalness: 1, roughness: 0.0, envMapIntensity: 1.6, flatShading: true });

    // Gövde: orta sütun + üç kat halka
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 3.2, 24), gold);
    column.position.y = 0.4;
    chandelier.add(column);
    const tiers = [
      { y: 1.2, R: 0.75, drops: 18 },
      { y: 0.35, R: 1.35, drops: 30 },
      { y: -0.55, R: 1.85, drops: 40 }
    ];
    const dropGeo = new THREE.OctahedronGeometry(1, 0);
    dropGeo.scale(0.06, 0.14, 0.06);
    const beadGeo = new THREE.OctahedronGeometry(0.035, 0);
    const dropPositions: THREE.Vector3[] = [];
    const beadPositions: THREE.Vector3[] = [];
    const bulbs: THREE.Vector3[] = [];
    for (const tier of tiers) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(tier.R, 0.035, 12, 96), gold);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = tier.y;
      chandelier.add(ring);
      // Kollar
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, tier.R, 6), gold);
        arm.position.set(Math.cos(a) * tier.R * 0.5, tier.y, Math.sin(a) * tier.R * 0.5);
        arm.rotation.z = Math.PI / 2;
        arm.rotation.y = -a;
        chandelier.add(arm);
        bulbs.push(new THREE.Vector3(Math.cos(a) * tier.R, tier.y + 0.12, Math.sin(a) * tier.R));
      }
      // Sarkan damlalar ve aralarındaki boncuk girlandları
      for (let i = 0; i < tier.drops; i++) {
        const a = (i / tier.drops) * Math.PI * 2;
        const len = 0.25 + (i % 2) * 0.18;
        dropPositions.push(new THREE.Vector3(Math.cos(a) * tier.R, tier.y - len, Math.sin(a) * tier.R));
        const a2 = ((i + 0.5) / tier.drops) * Math.PI * 2;
        for (let b = 1; b < 6; b += 2) {
          const k = b / 6;
          const aa = a + (a2 - a) * k * 2;
          const sag = Math.sin(k * Math.PI) * 0.22;
          beadPositions.push(new THREE.Vector3(Math.cos(aa) * tier.R, tier.y - 0.05 - sag, Math.sin(aa) * tier.R));
        }
      }
    }
    // Alt topuz kristal kümesi
    for (let i = 0; i < 40; i++) {
      const a = r() * Math.PI * 2, rr = r() * 0.5;
      dropPositions.push(new THREE.Vector3(Math.cos(a) * rr, -1.0 - r() * 0.8 * (1 - rr), Math.sin(a) * rr));
    }
    const drops = new THREE.InstancedMesh(dropGeo, crystal, dropPositions.length);
    const m = new THREE.Matrix4();
    dropPositions.forEach((p, i) => drops.setMatrixAt(i, m.compose(p, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, r() * Math.PI, 0)), new THREE.Vector3(1, 1, 1))));
    chandelier.add(drops);
    const beads = new THREE.InstancedMesh(beadGeo, crystal, beadPositions.length);
    beadPositions.forEach((p, i) => beads.setMatrixAt(i, m.makeTranslation(p.x, p.y, p.z)));
    chandelier.add(beads);

    // Ampuller: sıcak, sönmeyen ışık
    const bulbMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(4.0, 2.8, 1.6) });
    const bulbGeo = new THREE.SphereGeometry(0.05, 12, 8);
    for (const b of bulbs) {
      const s = new THREE.Mesh(bulbGeo, bulbMat);
      s.position.copy(b);
      chandelier.add(s);
    }
    const light = new THREE.PointLight('#ffd7a0', 30, 12, 2);
    light.position.set(0, 0.3, 0);
    chandelier.add(light);
    scene3.add(new THREE.AmbientLight('#2a3050', 0.6));

    // Kristal parıltıları: kameraya göre yansıma açısı tutan noktalar.
    const glintPos = [...dropPositions, ...beadPositions.filter((_, i) => i % 2 === 0)];
    const glintGeo = new THREE.BufferGeometry();
    glintGeo.setAttribute('position', new THREE.Float32BufferAttribute(glintPos.flatMap((p) => [p.x, p.y, p.z]), 3));
    glintGeo.setAttribute('aNormal', new THREE.Float32BufferAttribute(glintPos.flatMap(() => {
      const v = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize();
      return [v.x, v.y, v.z];
    }), 3));
    glintGeo.setAttribute('aHue', new THREE.Float32BufferAttribute(glintPos.map(() => r()), 1));
    const glintMat = new THREE.ShaderMaterial({
      uniforms: { uCam: { value: new THREE.Vector3() }, uSize: { value: H / 1080 }, uModel: { value: new THREE.Matrix4() } },
      vertexShader: /* glsl */ `
        attribute vec3 aNormal; attribute float aHue;
        uniform vec3 uCam; uniform float uSize;
        varying float vI; varying vec3 vCol;
        vec3 hue(float h) { return clamp(abs(mod(h * 6.0 + vec3(0, 4, 2), 6.0) - 3.0) - 1.0, 0.0, 1.0); }
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vec3 n = normalize(mat3(modelMatrix) * aNormal);
          vec3 v = normalize(uCam - wp.xyz);
          vec3 l = normalize(vec3(0.0, 0.3, 0.0) - wp.xyz);
          vec3 h = normalize(v - l);
          float s = pow(max(dot(n, h), 0.0), 140.0);
          vI = s;
          vCol = mix(vec3(1.0), hue(aHue), 0.55);
          vec4 mv = viewMatrix * wp;
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (6.0 + 70.0 * s) * uSize * (6.0 / -mv.z);
        }`,
      fragmentShader: /* glsl */ `
        varying float vI; varying vec3 vCol;
        void main() {
          vec2 p = gl_PointCoord - 0.5;
          float d = length(p);
          float star = max(0.0, 1.0 - abs(p.x) * 18.0) * max(0.0, 1.0 - abs(p.y) * 2.2) + max(0.0, 1.0 - abs(p.y) * 18.0) * max(0.0, 1.0 - abs(p.x) * 2.2);
          float core = exp(-d * d * 60.0);
          float a = (core + star * 0.8) * vI;
          gl_FragColor = vec4(vCol * a * 6.0, 1.0);
        }`,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true
    });
    const glints = new THREE.Points(glintGeo, glintMat);
    chandelier.add(glints);

    // Salon: uzakta loş, sıcak bir duvar ışığı (arka plan tamamen kara kalmasın).
    const wall = new THREE.Mesh(
      new THREE.SphereGeometry(30, 32, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: 'varying vec3 vP; void main(){ float h = vP.y; vec3 c = mix(vec3(0.05,0.035,0.03), vec3(0.012,0.014,0.03), smoothstep(-0.2, 0.6, h)); c += vec3(0.10,0.06,0.03) * exp(-pow((h + 0.05) * 5.0, 2.0)); gl_FragColor = vec4(c, 1.0); }'
      })
    );
    scene3.add(wall);
    // Duvarlardaki prizmatik ışık lekeleri: avizeyi saran uzak bir kabuk.
    const specks = 160;
    const sp = new Float32Array(specks * 3);
    const sc = new Float32Array(specks * 3);
    const sph = new Float32Array(specks);
    for (let i = 0; i < specks; i++) {
      const a = r() * Math.PI * 2, y = (r() - 0.3) * 9, R = 9 + r() * 3;
      sp.set([Math.cos(a) * R, y, Math.sin(a) * R], i * 3);
      const c = new THREE.Color().setHSL(r(), 0.9, 0.65);
      sc.set([c.r, c.g, c.b], i * 3);
      sph[i] = r() * 10;
    }
    const speckGeo = new THREE.BufferGeometry();
    speckGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    speckGeo.setAttribute('color', new THREE.BufferAttribute(sc, 3));
    speckGeo.setAttribute('aPh', new THREE.BufferAttribute(sph, 1));
    const speckMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uSize: { value: H / 1080 } },
      vertexShader: /* glsl */ `
        attribute vec3 color; attribute float aPh; uniform float uTime; uniform float uSize; varying vec3 vC; varying float vA;
        void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv;
          vA = 0.4 + 0.6 * pow(0.5 + 0.5 * sin(uTime * 0.6 + aPh), 2.0); vC = color; gl_PointSize = 85.0 * uSize * (8.0 / -mv.z); }`,
      fragmentShader: /* glsl */ `
        varying vec3 vC; varying float vA;
        void main() { vec2 p = gl_PointCoord - 0.5; float d = length(p); float a = smoothstep(0.5, 0.0, d) * vA; gl_FragColor = vec4(vC * a * 0.45, 1.0); }`,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true
    });
    const speckPoints = new THREE.Points(speckGeo, speckMat);
    scene3.add(speckPoints);

    // Ön plan bokeh: kameraya yakın, iri ve yumuşak ışık diskleri.
    const bokehN = 14;
    const bp = new Float32Array(bokehN * 3);
    const bc = new Float32Array(bokehN * 3);
    for (let i = 0; i < bokehN; i++) {
      bp.set([(r() - 0.5) * 10, (r() - 0.3) * 6, (r() - 0.5) * 10], i * 3);
      const c = new THREE.Color().setHSL(0.09 + r() * 0.05, 0.9, 0.62);
      bc.set([c.r, c.g, c.b], i * 3);
    }
    const bokehGeo = new THREE.BufferGeometry();
    bokehGeo.setAttribute('position', new THREE.BufferAttribute(bp, 3));
    bokehGeo.setAttribute('color', new THREE.BufferAttribute(bc, 3));
    const bokehMat = new THREE.ShaderMaterial({
      uniforms: { uSize: { value: H / 1080 } },
      vertexShader: /* glsl */ `attribute vec3 color; uniform float uSize; varying vec3 vC;
        void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; vC = color; gl_PointSize = clamp(900.0 * uSize / -mv.z, 4.0, 420.0); }`,
      fragmentShader: /* glsl */ `varying vec3 vC; void main() { float d = length(gl_PointCoord - 0.5); float a = (smoothstep(0.5, 0.44, d) * 0.5 + smoothstep(0.5, 0.47, d) * smoothstep(0.4, 0.47, d) * 0.6) * 0.09; gl_FragColor = vec4(vC * a, 1.0); }`,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true
    });
    scene3.add(new THREE.Points(bokehGeo, bokehMat));

    const look = new THREE.Vector3();
    return {
      render(t) {
        const k = easeInOut(Math.min(1, t / D));
        // Avize yavaşça döner; kamera alttan başlayıp yan profile yükselir.
        chandelier.rotation.y = 0.3 + t * 0.03; // çok yavaş: paralaksı kamera yörüngesi verir
        const a = -0.4 + k * 1.6;
        const radius = (portrait ? 6.4 : 6.2) - k * 1.0;
        camera.position.set(Math.sin(a) * radius, -2.6 + k * 2.9, Math.cos(a) * radius);
        look.set(0, portrait ? 0.15 - k * 0.2 : -0.1, 0);
        camera.lookAt(look);
        camera.updateMatrixWorld();
        glintMat.uniforms.uCam.value.copy(camera.position);
        speckMat.uniforms.uTime.value = t;
        stage.render(scene3, camera, t);
      }
    };
  }
};

export default scene;
