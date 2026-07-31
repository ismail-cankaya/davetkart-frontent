/**
 * Davetiye hero katmanının parçacık motoru.
 *
 * Tasarım kararları:
 *  - Tek <canvas>, tek rAF döngüsü. Her efekt için ayrı DOM düğümü üretmek
 *    (yüzlerce <div> + CSS animasyonu) 60fps'i telefonda anında düşürürdü.
 *  - Parçacıklar havuzlanır: ölen parçacık serbest bırakılmaz, yeniden doğar.
 *    Böylece ilk karedeki tahsisten sonra çöp toplayıcı hiç devreye girmez.
 *  - Parlayan efektler her karede gradient üretmez; renk başına bir kez
 *    "sprite" pişirilir ve drawImage ile ölçeklenir. Gradient üretimi karede
 *    200 kez çağrılırsa tek başına ana iş parçacığını yer.
 *
 * Motor şablonları tanımaz: şablon yalnızca hangi ön ayarı (preset), hangi
 * renklerle ve hangi yoğunlukta istediğini söyler.
 */

/* ————————————————— temel tipler ————————————————— */

export interface PointerState {
  /** Canvas'a göre yerel koordinat (CSS px). */
  x: number;
  y: number;
  /** İşaretçi konteyner üzerinde mi — değilse çekim kuvveti uygulanmaz. */
  active: boolean;
}

export interface FieldContext {
  /** Canvas'ın CSS px cinsinden ölçüsü (DPR uygulanmadan). */
  w: number;
  h: number;
  /** Başlangıçtan beri geçen süre (saniye). */
  t: number;
  /** Bir önceki kareden beri geçen süre (saniye, üst sınırı kırpılmış). */
  dt: number;
  pointer: PointerState;
  colors: string[];
  /** Şablondan gelen hız çarpanı. */
  speed: number;
  /** İşaretçi etkisinin şiddeti (0 = kapalı). */
  pointerStrength: number;
  rng: () => number;
}

export interface Particle {
  /** Havuzdaki sabit indeks — grup/faz hesapları buna dayanır. */
  i: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  /** Radyan cinsinden dönüş. */
  rot: number;
  vrot: number;
  /** Kalan ömür (saniye). Sonsuz yaşayan parçacıklarda kullanılmaz. */
  life: number;
  maxLife: number;
  /** Salınım/parıldama için sabit faz kayması. */
  phase: number;
  /** 0 = uzak (küçük, sönük, yavaş), 1 = yakın. Parallax ve alan derinliği. */
  depth: number;
  alpha: number;
  color: string;
  /** Patlama grubu sayacı — yalnızca havai fişek ön ayarında anlamlı. */
  cycle: number;
}

export interface ParticlePreset {
  /** 1e6 CSS px² başına parçacık sayısı. Şablonun density çarpanıyla ölçeklenir. */
  density: number;
  /** Havuz üst sınırı — 4K masaüstünde patlamayı önler. */
  max: number;
  /** Parlayan efektler için 'lighter'; fiziksel objeler için 'source-over'. */
  composite?: GlobalCompositeOperation;
  /** Parçacığı (yeniden) doğurur. `initial` yalnızca ilk dolumda true. */
  spawn(p: Particle, c: FieldContext, initial: boolean): void;
  /** false dönerse parçacık yeniden doğar. */
  update(p: Particle, c: FieldContext): boolean;
  draw(g: CanvasRenderingContext2D, p: Particle, c: FieldContext): void;
  /**
   * Kare başına BİR kez, tüm parçacıklar güncellendikten sonra çağrılır.
   * Parçacıklar arası ilişki çizen efektler (ağ bağlantıları) buraya yazılır:
   * per-particle draw içinden yapılsaydı ilişki taraması her parçacıkta
   * yeniden çalışır ve maliyet O(N²) yerine O(N³) olurdu.
   */
  after?(g: CanvasRenderingContext2D, particles: Particle[], c: FieldContext): void;
}

/** Ön ayarlar fabrikadır: havai fişek gibi paylaşılan durum kapanışta yaşar. */
export type PresetFactory = () => ParticlePreset;

/* ————————————————— yardımcılar ————————————————— */

/** Deterministik PRNG. Aynı tohum => aynı kompozisyon (SSR/snapshot dostu). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rgb = [number, number, number];

/** '#rgb' | '#rrggbb' | 'rgb(r,g,b)' → [r,g,b]. Sprite gradyanları için gerekli. */
function toRgb(color: string): Rgb {
  const value = color.trim();

  if (value.startsWith('#')) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16)
      ];
    }
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    ];
  }

  const match = value.match(/-?\d+(\.\d+)?/g);
  if (match && match.length >= 3) {
    return [Number(match[0]), Number(match[1]), Number(match[2])];
  }
  return [255, 255, 255];
}

function rgba([r, g, b]: Rgb, a: number): string {
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}

/**
 * Sprite önbelleği. Anahtar renk + şekil; iki farklı şablon aynı altın tonunu
 * kullanıyorsa sprite bir kez pişirilir ve paylaşılır.
 */
const spriteCache = new Map<string, HTMLCanvasElement>();

function sprite(key: string, size: number, paint: (g: CanvasRenderingContext2D, s: number) => void) {
  const cached = spriteCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext('2d');
  if (g) paint(g, size);

  spriteCache.set(key, canvas);
  return canvas;
}

/** Yumuşak ışık topu: merkezde tam renk, kenarda tam saydam. */
function glowSprite(color: string): HTMLCanvasElement {
  return sprite(`glow:${color}`, 64, (g, s) => {
    const rgb = toRgb(color);
    const gradient = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    gradient.addColorStop(0, rgba(rgb, 1));
    gradient.addColorStop(0.25, rgba(rgb, 0.55));
    gradient.addColorStop(0.6, rgba(rgb, 0.12));
    gradient.addColorStop(1, rgba(rgb, 0));
    g.fillStyle = gradient;
    g.fillRect(0, 0, s, s);
  });
}

/** Dört uçlu parıltı (yıldız tozu): ince haç + merkez parlaması. */
function starSprite(color: string): HTMLCanvasElement {
  return sprite(`star:${color}`, 64, (g, s) => {
    const rgb = toRgb(color);
    const c = s / 2;

    const core = g.createRadialGradient(c, c, 0, c, c, c * 0.42);
    core.addColorStop(0, rgba(rgb, 1));
    core.addColorStop(1, rgba(rgb, 0));
    g.fillStyle = core;
    g.fillRect(0, 0, s, s);

    // Işınlar: merkezden dışa incelen dört üçgen çift.
    g.fillStyle = rgba(rgb, 0.85);
    for (let arm = 0; arm < 4; arm++) {
      g.save();
      g.translate(c, c);
      g.rotate((arm * Math.PI) / 2);
      g.beginPath();
      g.moveTo(0, -c);
      g.lineTo(c * 0.1, 0);
      g.lineTo(0, c * 0.12);
      g.lineTo(-c * 0.1, 0);
      g.closePath();
      g.fill();
      g.restore();
    }
  });
}

/** Ölçekli sprite çizimi — dönüş ve saydamlıkla. */
function blit(
  g: CanvasRenderingContext2D,
  image: HTMLCanvasElement,
  x: number,
  y: number,
  size: number,
  alpha: number,
  rot = 0
) {
  if (alpha <= 0.002 || size <= 0) return;
  g.globalAlpha = alpha;

  if (rot === 0) {
    g.drawImage(image, x - size / 2, y - size / 2, size, size);
    return;
  }

  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.drawImage(image, -size / 2, -size / 2, size, size);
  g.restore();
}

/** Havuzdaki renk seçimi — indeks tabanlı ki dağılım dengeli olsun. */
function pickColor(c: FieldContext, p: Particle): string {
  return c.colors[p.i % c.colors.length] ?? '#ffffff';
}

/**
 * İşaretçi itmesi/çekmesi. Yarıçap içinde kalan parçacığa kuvvet uygular;
 * `sign` +1 çekim, -1 itmedir.
 */
function applyPointer(p: Particle, c: FieldContext, radius: number, force: number, sign = 1) {
  if (!c.pointer.active || c.pointerStrength <= 0) return;

  const dx = c.pointer.x - p.x;
  const dy = c.pointer.y - p.y;
  const distanceSq = dx * dx + dy * dy;
  if (distanceSq > radius * radius || distanceSq < 1) return;

  const distance = Math.sqrt(distanceSq);
  // Yakınlıkla kareli artan düşüş: kenarda etki sıfıra yumuşak iner.
  const falloff = 1 - distance / radius;
  const amount = sign * force * falloff * falloff * c.pointerStrength * c.dt;

  p.vx += (dx / distance) * amount;
  p.vy += (dy / distance) * amount;
}

/* ————————————————— ön ayarlar ————————————————— */

/**
 * Altın ışık tozu — düğün/sahil. Yavaşça düşen, sinüs salınımıyla süzülen,
 * fazına göre parıldayan mikro ışıklar.
 */
const fairyDust: PresetFactory = () => ({
  density: 90,
  max: 260,
  composite: 'lighter',
  spawn(p, c, initial) {
    p.depth = 0.25 + c.rng() * 0.75;
    p.x = c.rng() * c.w;
    p.y = initial ? c.rng() * c.h : -20 - c.rng() * 60;
    p.size = (2 + c.rng() * 5) * p.depth;
    p.vx = (c.rng() - 0.5) * 6;
    p.vy = (7 + c.rng() * 16) * p.depth;
    p.phase = c.rng() * Math.PI * 2;
    p.alpha = 0.35 + c.rng() * 0.5;
    p.color = pickColor(c, p);
    p.rot = 0;
    p.vrot = 0;
  },
  update(p, c) {
    p.x += (p.vx + Math.sin(c.t * 0.7 + p.phase) * 9 * p.depth) * c.dt * c.speed;
    p.y += p.vy * c.dt * c.speed;
    applyPointer(p, c, 150, 130, -1);
    // Sürtünme: işaretçi itmesinden sonra hız kendi haline dönsün.
    p.vx *= 0.985;
    return p.y < c.h + 40;
  },
  draw(g, p, c) {
    // İki farklı frekansta parıldama — mekanik "yanıp sönme" hissini kırar.
    const twinkle = 0.55 + 0.45 * Math.sin(c.t * 2.1 + p.phase) * Math.sin(c.t * 0.6 + p.phase * 1.7);
    blit(g, glowSprite(p.color), p.x, p.y, p.size * 7, p.alpha * twinkle * p.depth);
  }
});

/**
 * Taç yaprakları — botanik düğün / kına gülü. Düşerken kendi ekseninde
 * dönen, 3B çevrilme hissi için yatayda ezilen yapraklar.
 */
const petals: PresetFactory = () => ({
  density: 34,
  max: 110,
  spawn(p, c, initial) {
    p.depth = 0.3 + c.rng() * 0.7;
    p.x = c.rng() * (c.w + 120) - 60;
    p.y = initial ? c.rng() * c.h : -40 - c.rng() * 120;
    p.size = (11 + c.rng() * 16) * p.depth;
    p.vx = (c.rng() - 0.5) * 24 - 10;
    p.vy = (22 + c.rng() * 30) * p.depth;
    p.rot = c.rng() * Math.PI * 2;
    p.vrot = (c.rng() - 0.5) * 1.6;
    p.phase = c.rng() * Math.PI * 2;
    p.alpha = 0.55 + c.rng() * 0.45;
    p.color = pickColor(c, p);
  },
  update(p, c) {
    p.x += (p.vx + Math.sin(c.t * 0.9 + p.phase) * 26 * p.depth) * c.dt * c.speed;
    p.y += p.vy * c.dt * c.speed;
    p.rot += p.vrot * c.dt * c.speed;
    applyPointer(p, c, 170, 200, -1);
    p.vx *= 0.99;
    return p.y < c.h + 60;
  },
  draw(g, p, c) {
    // cos(faz) yaprağı yatayda ezerek kağıdın çevrilmesini taklit eder.
    const flip = Math.cos(c.t * 1.4 * c.speed + p.phase);
    const w = p.size * (0.34 + Math.abs(flip) * 0.66);

    g.save();
    g.globalAlpha = p.alpha * (0.45 + Math.abs(flip) * 0.55);
    g.translate(p.x, p.y);
    g.rotate(p.rot);
    g.fillStyle = p.color;
    g.beginPath();
    // İki bezier: uçları sivri, ortası dolgun klasik yaprak silueti.
    g.moveTo(0, -p.size / 2);
    g.bezierCurveTo(w / 2, -p.size / 5, w / 2, p.size / 3, 0, p.size / 2);
    g.bezierCurveTo(-w / 2, p.size / 3, -w / 2, -p.size / 5, 0, -p.size / 2);
    g.fill();
    g.restore();
  }
});

/**
 * Ateşböcekleri — rustik orman nişanı. Rastgele gezinen, nefes alır gibi
 * sönüp yanan sıcak ışıklar.
 */
const fireflies: PresetFactory = () => ({
  density: 42,
  max: 120,
  composite: 'lighter',
  spawn(p, c) {
    p.depth = 0.3 + c.rng() * 0.7;
    p.x = c.rng() * c.w;
    p.y = c.rng() * c.h;
    p.size = (2 + c.rng() * 3.5) * p.depth;
    p.vx = (c.rng() - 0.5) * 14;
    p.vy = (c.rng() - 0.5) * 10;
    p.phase = c.rng() * Math.PI * 2;
    p.alpha = 0.5 + c.rng() * 0.5;
    p.color = pickColor(c, p);
    p.maxLife = 6 + c.rng() * 8;
    p.life = p.maxLife * c.rng();
  },
  update(p, c) {
    // İki uyumsuz sinüsün toplamı: periyodu gözle yakalanmayan gezinme.
    p.vx += Math.sin(c.t * 0.8 + p.phase) * 13 * c.dt;
    p.vy += Math.cos(c.t * 0.63 + p.phase * 1.4) * 10 * c.dt;
    p.vx *= 0.97;
    p.vy *= 0.97;

    p.x += p.vx * c.dt * c.speed;
    p.y += p.vy * c.dt * c.speed;

    applyPointer(p, c, 190, 90, 1);

    // Kenarlardan sarmalayarak geç — kompozisyon hiç seyrelmesin.
    if (p.x < -30) p.x = c.w + 30;
    if (p.x > c.w + 30) p.x = -30;
    if (p.y < -30) p.y = c.h + 30;
    if (p.y > c.h + 30) p.y = -30;

    p.life -= c.dt;
    return p.life > 0;
  },
  draw(g, p, c) {
    // Ömrün iki ucunda yumuşak giriş/çıkış; ortada tam parlaklık.
    const fade = Math.min(1, Math.min(p.life, p.maxLife - p.life) / 1.5);
    const pulse = 0.25 + 0.75 * Math.pow(0.5 + 0.5 * Math.sin(c.t * 2.4 + p.phase), 2);
    blit(g, glowSprite(p.color), p.x, p.y, p.size * 9, p.alpha * pulse * fade);
  }
});

/**
 * Konfeti — doğum günü / lunapark. Yerçekimi + hava direnci ile düşen,
 * kendi ekseninde takla atan metalik şeritler.
 */
const confetti: PresetFactory = () => ({
  density: 55,
  max: 180,
  spawn(p, c, initial) {
    p.depth = 0.35 + c.rng() * 0.65;
    p.x = c.rng() * c.w;
    p.y = initial ? c.rng() * c.h : -30 - c.rng() * 200;
    p.size = (7 + c.rng() * 9) * p.depth;
    p.vx = (c.rng() - 0.5) * 40;
    p.vy = (40 + c.rng() * 50) * p.depth;
    p.rot = c.rng() * Math.PI * 2;
    p.vrot = (c.rng() - 0.5) * 7;
    p.phase = c.rng() * Math.PI * 2;
    p.alpha = 0.75 + c.rng() * 0.25;
    p.color = pickColor(c, p);
  },
  update(p, c) {
    p.vy += 26 * c.dt; // yerçekimi
    p.vy *= 0.995; // hava direnci: terminal hıza oturur
    p.x += (p.vx + Math.sin(c.t * 1.6 + p.phase) * 34 * p.depth) * c.dt * c.speed;
    p.y += p.vy * c.dt * c.speed;
    p.rot += p.vrot * c.dt * c.speed;
    applyPointer(p, c, 160, 260, -1);
    p.vx *= 0.99;
    return p.y < c.h + 50;
  },
  draw(g, p, c) {
    // Takla: yatay ölçek cos ile daralır, |cos| küçükken şerit "kenarına" döner.
    const spin = Math.cos(c.t * 3.1 * c.speed + p.phase);
    g.save();
    g.globalAlpha = p.alpha;
    g.translate(p.x, p.y);
    g.rotate(p.rot);
    g.scale(1, Math.max(0.08, Math.abs(spin)));
    g.fillStyle = p.color;
    g.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    g.restore();
  }
});

/**
 * Kabarcıklar — şampanya / bebek. Yükselirken salınan, ince kenar ışığı ve
 * tek noktasal parlaması olan saydam küreler.
 */
const bubbles: PresetFactory = () => ({
  density: 40,
  max: 120,
  spawn(p, c, initial) {
    p.depth = 0.3 + c.rng() * 0.7;
    p.x = c.rng() * c.w;
    p.y = initial ? c.rng() * c.h : c.h + 30 + c.rng() * 80;
    p.size = (6 + c.rng() * 20) * p.depth;
    p.vx = (c.rng() - 0.5) * 8;
    // Büyük kabarcık daha hızlı yükselir — akışkanlar mekaniği sezgisi.
    p.vy = -(16 + c.rng() * 26) * p.depth;
    p.phase = c.rng() * Math.PI * 2;
    p.alpha = 0.3 + c.rng() * 0.45;
    p.color = pickColor(c, p);
    p.rot = 0;
    p.vrot = 0;
  },
  update(p, c) {
    p.x += (p.vx + Math.sin(c.t * 1.1 + p.phase) * 14 * p.depth) * c.dt * c.speed;
    p.y += p.vy * c.dt * c.speed;
    applyPointer(p, c, 150, 150, -1);
    p.vx *= 0.98;
    return p.y > -60;
  },
  draw(g, p) {
    const r = p.size / 2;
    g.save();
    g.globalAlpha = p.alpha;

    g.beginPath();
    g.arc(p.x, p.y, r, 0, Math.PI * 2);
    g.fillStyle = `${p.color}18`;
    g.fill();

    g.lineWidth = Math.max(0.6, r * 0.08);
    g.strokeStyle = p.color;
    g.globalAlpha = p.alpha * 0.75;
    g.stroke();

    // Sol üstte tek spekülar nokta: kürelik hissini tek başına bu verir.
    g.globalAlpha = p.alpha * 0.9;
    g.beginPath();
    g.arc(p.x - r * 0.32, p.y - r * 0.34, Math.max(0.7, r * 0.17), 0, Math.PI * 2);
    g.fillStyle = '#ffffff';
    g.fill();
    g.restore();
  }
});

/**
 * Yıldız tozu — bebek mevlüdü / müzik kutusu. İşaretçiyi güçlü izleyen,
 * dönerek parıldayan dört uçlu parıltılar.
 */
const stardust: PresetFactory = () => ({
  density: 60,
  max: 180,
  composite: 'lighter',
  spawn(p, c, initial) {
    p.depth = 0.3 + c.rng() * 0.7;
    p.x = c.rng() * c.w;
    p.y = initial ? c.rng() * c.h : c.rng() * c.h;
    p.size = (3 + c.rng() * 7) * p.depth;
    p.vx = (c.rng() - 0.5) * 10;
    p.vy = (c.rng() - 0.5) * 10 - 4;
    p.rot = c.rng() * Math.PI * 2;
    p.vrot = (c.rng() - 0.5) * 1.1;
    p.phase = c.rng() * Math.PI * 2;
    p.alpha = 0.4 + c.rng() * 0.6;
    p.color = pickColor(c, p);
    p.maxLife = 5 + c.rng() * 6;
    p.life = p.maxLife * c.rng();
  },
  update(p, c) {
    p.x += (p.vx + Math.sin(c.t * 0.5 + p.phase) * 11 * p.depth) * c.dt * c.speed;
    p.y += p.vy * c.dt * c.speed;
    p.rot += p.vrot * c.dt * c.speed;
    // Güçlü çekim: imleç ekranda gezerken toz peşinden sürüklensin.
    applyPointer(p, c, 220, 190, 1);
    p.vx *= 0.96;
    p.vy *= 0.96;
    p.life -= c.dt;
    return p.life > 0;
  },
  draw(g, p, c) {
    const fade = Math.min(1, Math.min(p.life, p.maxLife - p.life) / 1.2);
    const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(c.t * 1.9 + p.phase));
    blit(g, starSprite(p.color), p.x, p.y, p.size * 6, p.alpha * twinkle * fade, p.rot);
  }
});

/**
 * Tüyler — melek kanatları. Çok yavaş düşen, geniş yay çizerek sallanan
 * yumuşak tüy siluetleri.
 */
const feathers: PresetFactory = () => ({
  density: 16,
  max: 46,
  spawn(p, c, initial) {
    p.depth = 0.35 + c.rng() * 0.65;
    p.x = c.rng() * (c.w + 100) - 50;
    p.y = initial ? c.rng() * c.h : -60 - c.rng() * 140;
    p.size = (18 + c.rng() * 24) * p.depth;
    p.vx = (c.rng() - 0.5) * 14;
    p.vy = (9 + c.rng() * 13) * p.depth;
    p.rot = c.rng() * Math.PI * 2;
    p.vrot = (c.rng() - 0.5) * 0.7;
    p.phase = c.rng() * Math.PI * 2;
    p.alpha = 0.4 + c.rng() * 0.45;
    p.color = pickColor(c, p);
  },
  update(p, c) {
    // Geniş genlikli, düşük frekanslı salınım: tüyün havada asılı kalma hissi.
    p.x += (p.vx + Math.sin(c.t * 0.55 + p.phase) * 34 * p.depth) * c.dt * c.speed;
    p.y += p.vy * c.dt * c.speed;
    p.rot += (p.vrot + Math.sin(c.t * 0.5 + p.phase) * 0.35) * c.dt * c.speed;
    applyPointer(p, c, 180, 140, -1);
    p.vx *= 0.99;
    return p.y < c.h + 80;
  },
  draw(g, p) {
    g.save();
    g.globalAlpha = p.alpha;
    g.translate(p.x, p.y);
    g.rotate(p.rot);
    g.fillStyle = p.color;

    // Gövde: uçları sivri ince mekik.
    g.beginPath();
    g.moveTo(0, -p.size / 2);
    g.quadraticCurveTo(p.size * 0.26, 0, 0, p.size / 2);
    g.quadraticCurveTo(-p.size * 0.26, 0, 0, -p.size / 2);
    g.fill();

    // Sap: tüyü "çizim" olmaktan çıkarıp nesneye dönüştüren detay.
    g.globalAlpha = p.alpha * 0.5;
    g.strokeStyle = p.color;
    g.lineWidth = Math.max(0.5, p.size * 0.035);
    g.beginPath();
    g.moveTo(0, -p.size / 2);
    g.lineTo(0, p.size / 2);
    g.stroke();
    g.restore();
  }
});

/**
 * Kor / kıvılcım — kına mumları, ateş. Yükselirken sönen, titreşen sıcak
 * noktalar.
 */
const embers: PresetFactory = () => ({
  density: 55,
  max: 170,
  composite: 'lighter',
  spawn(p, c, initial) {
    p.depth = 0.3 + c.rng() * 0.7;
    p.x = c.rng() * c.w;
    p.y = initial ? c.rng() * c.h : c.h + 20 + c.rng() * 60;
    p.size = (1.5 + c.rng() * 3.5) * p.depth;
    p.vx = (c.rng() - 0.5) * 12;
    p.vy = -(18 + c.rng() * 34) * p.depth;
    p.phase = c.rng() * Math.PI * 2;
    p.alpha = 0.5 + c.rng() * 0.5;
    p.color = pickColor(c, p);
    p.maxLife = 3.5 + c.rng() * 4;
    p.life = initial ? p.maxLife * c.rng() : p.maxLife;
  },
  update(p, c) {
    p.x += (p.vx + Math.sin(c.t * 1.7 + p.phase) * 17 * p.depth) * c.dt * c.speed;
    p.y += p.vy * c.dt * c.speed;
    // Yükseldikçe yavaşlama: sıcak hava soğudukça kaldırma kuvveti düşer.
    p.vy *= 0.995;
    applyPointer(p, c, 140, 120, -1);
    p.life -= c.dt;
    return p.life > 0 && p.y > -40;
  },
  draw(g, p, c) {
    const fade = Math.min(1, p.life / p.maxLife);
    const flicker = 0.45 + 0.55 * Math.abs(Math.sin(c.t * 5.2 + p.phase));
    blit(g, glowSprite(p.color), p.x, p.y, p.size * 8, p.alpha * fade * flicker);
  }
});

/**
 * Ağ düğümleri — kurumsal teknoloji. Yakın düğümler arasına çizilen
 * bağlantılarla veri akışı hissi.
 */
const network: PresetFactory = () => {
  return {
    density: 26,
    max: 80,
    spawn(p, c) {
      p.depth = 0.45 + c.rng() * 0.55;
      p.x = c.rng() * c.w;
      p.y = c.rng() * c.h;
      p.size = (1.6 + c.rng() * 2.6) * p.depth;
      p.vx = (c.rng() - 0.5) * 17;
      p.vy = (c.rng() - 0.5) * 17;
      p.phase = c.rng() * Math.PI * 2;
      p.alpha = 0.5 + c.rng() * 0.5;
      p.color = pickColor(c, p);
      p.rot = 0;
      p.vrot = 0;
    },
    update(p, c) {
      p.x += p.vx * c.dt * c.speed;
      p.y += p.vy * c.dt * c.speed;
      applyPointer(p, c, 200, 70, 1);
      p.vx *= 0.995;
      p.vy *= 0.995;

      // Kenarlardan sek: düğüm sayısı sabit kalsın, ağ seyrelmesin.
      if (p.x < 0 || p.x > c.w) p.vx *= -1;
      if (p.y < 0 || p.y > c.h) p.vy *= -1;
      p.x = Math.max(0, Math.min(c.w, p.x));
      p.y = Math.max(0, Math.min(c.h, p.y));

      return true;
    },
    draw(g, p, c) {
      const glow = 0.4 + 0.6 * Math.abs(Math.sin(c.t * 1.3 + p.phase));
      blit(g, glowSprite(p.color), p.x, p.y, p.size * 7, p.alpha * glow);
    },
    // Bağlantılar kare başına tek geçişte, tüm düğümler yerleştikten sonra.
    after(g, particles, c) {
      const maxDistance = Math.min(190, Math.max(110, c.w * 0.14));
      const limitSq = maxDistance * maxDistance;
      g.lineWidth = 0.7;

      for (let a = 0; a < particles.length; a++) {
        const first = particles[a];
        for (let b = a + 1; b < particles.length; b++) {
          const second = particles[b];
          const dx = first.x - second.x;
          const dy = first.y - second.y;
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq > limitSq) continue;

          // Yakınlaştıkça belirginleşen bağ: uzakta sıfıra yumuşak iner.
          const strength = 1 - Math.sqrt(distanceSq) / maxDistance;
          g.globalAlpha = strength * 0.28;
          g.strokeStyle = first.color;
          g.beginPath();
          g.moveTo(first.x, first.y);
          g.lineTo(second.x, second.y);
          g.stroke();
        }
      }
    }
  };
};

/**
 * Havai fişek — masal şatosu. Parçacıklar gruplara bölünür; her grup kendi
 * zamanlayıcısıyla yeni bir merkezden radyal olarak patlar.
 */
const fireworks: PresetFactory = () => {
  const GROUPS = 4;
  const origins = Array.from({ length: GROUPS }, () => ({ x: 0, y: 0, cycle: 0, next: 0 }));

  return {
    density: 70,
    max: 240,
    composite: 'lighter',
    spawn(p, c) {
      const group = origins[p.i % GROUPS];

      // Grubun zamanı geldiyse yeni patlama merkezi seç ve sayacı ilerlet.
      if (c.t >= group.next) {
        group.x = c.w * (0.15 + c.rng() * 0.7);
        group.y = c.h * (0.12 + c.rng() * 0.4);
        group.cycle++;
        group.next = c.t + 1.6 + c.rng() * 2.4;
      }

      const angle = c.rng() * Math.PI * 2;
      // sqrt: yarıçapa göre düzgün dağılım — merkez tıkanmasın.
      const speed = 60 + Math.sqrt(c.rng()) * 190;

      p.x = group.x;
      p.y = group.y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.size = 1.6 + c.rng() * 2.8;
      p.phase = c.rng() * Math.PI * 2;
      p.alpha = 0.8 + c.rng() * 0.2;
      p.color = pickColor(c, p);
      p.cycle = group.cycle;
      p.maxLife = 1.3 + c.rng() * 1.2;
      p.life = p.maxLife;
      p.depth = 1;
      p.rot = 0;
      p.vrot = 0;
    },
    update(p, c) {
      p.vy += 62 * c.dt; // yerçekimi: patlama şemsiyesi aşağı sarksın
      p.vx *= 0.975; // hava direnci
      p.vy *= 0.975;
      p.x += p.vx * c.dt * c.speed;
      p.y += p.vy * c.dt * c.speed;
      p.life -= c.dt;

      // Grubu yeni bir tura geçtiyse parçacık hemen yeni patlamaya katılır.
      return p.life > 0 && p.cycle === origins[p.i % GROUPS].cycle;
    },
    draw(g, p, c) {
      const fade = Math.pow(Math.max(0, p.life / p.maxLife), 1.5);
      const flicker = 0.6 + 0.4 * Math.sin(c.t * 22 + p.phase);
      blit(g, glowSprite(p.color), p.x, p.y, p.size * 9, p.alpha * fade * flicker);
    }
  };
};

/**
 * Balonlar — sünnet / kutlama. Yükselirken sallanan, ipi olan helyum
 * balonları.
 */
const balloons: PresetFactory = () => ({
  density: 9,
  max: 26,
  spawn(p, c, initial) {
    p.depth = 0.4 + c.rng() * 0.6;
    p.x = c.rng() * c.w;
    p.y = initial ? c.rng() * c.h : c.h + 90 + c.rng() * 180;
    p.size = (26 + c.rng() * 30) * p.depth;
    p.vx = (c.rng() - 0.5) * 7;
    p.vy = -(15 + c.rng() * 18) * p.depth;
    p.phase = c.rng() * Math.PI * 2;
    p.alpha = 0.55 + c.rng() * 0.4;
    p.color = pickColor(c, p);
    p.rot = 0;
    p.vrot = 0;
  },
  update(p, c) {
    p.x += (p.vx + Math.sin(c.t * 0.6 + p.phase) * 15 * p.depth) * c.dt * c.speed;
    p.y += p.vy * c.dt * c.speed;
    // Sallanma açısı yatay hıza bağlanır: balon gittiği yöne doğru yatar.
    p.rot = Math.sin(c.t * 0.6 + p.phase) * 0.16;
    applyPointer(p, c, 190, 120, -1);
    p.vx *= 0.99;
    return p.y > -p.size * 2.4;
  },
  draw(g, p) {
    const w = p.size * 0.78;
    const h = p.size;

    g.save();
    g.globalAlpha = p.alpha;
    g.translate(p.x, p.y);
    g.rotate(p.rot);

    // Gövde: hafif armut formu (alt uç sivri).
    g.fillStyle = p.color;
    g.beginPath();
    g.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    g.fill();

    g.beginPath();
    g.moveTo(-w * 0.09, h * 0.44);
    g.lineTo(0, h * 0.58);
    g.lineTo(w * 0.09, h * 0.44);
    g.closePath();
    g.fill();

    // Spekülar parlama — metalik/sedefli görünümün kaynağı.
    g.globalAlpha = p.alpha * 0.55;
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.ellipse(-w * 0.19, -h * 0.2, w * 0.13, h * 0.19, -0.4, 0, Math.PI * 2);
    g.fill();

    // İp: aşağı doğru salınan yay.
    g.globalAlpha = p.alpha * 0.35;
    g.strokeStyle = p.color;
    g.lineWidth = Math.max(0.5, p.size * 0.018);
    g.beginPath();
    g.moveTo(0, h * 0.58);
    g.quadraticCurveTo(w * 0.22, h * 0.9, 0, h * 1.25);
    g.stroke();
    g.restore();
  }
});

/**
 * Uçuşan sayfalar — mezuniyet. Aşağıdan yukarı savrulan, takla atan kağıtlar.
 */
const pages: PresetFactory = () => ({
  density: 20,
  max: 60,
  spawn(p, c, initial) {
    p.depth = 0.35 + c.rng() * 0.65;
    p.x = c.rng() * c.w;
    p.y = initial ? c.rng() * c.h : c.h + 40 + c.rng() * 120;
    p.size = (14 + c.rng() * 18) * p.depth;
    p.vx = (c.rng() - 0.5) * 34;
    p.vy = -(34 + c.rng() * 48) * p.depth;
    p.rot = c.rng() * Math.PI * 2;
    p.vrot = (c.rng() - 0.5) * 3.4;
    p.phase = c.rng() * Math.PI * 2;
    p.alpha = 0.5 + c.rng() * 0.4;
    p.color = pickColor(c, p);
  },
  update(p, c) {
    p.x += (p.vx + Math.sin(c.t * 1.2 + p.phase) * 30 * p.depth) * c.dt * c.speed;
    p.y += p.vy * c.dt * c.speed;
    p.vy += 12 * c.dt; // yükseliş yavaşlar, tepede asılı kalır
    p.rot += p.vrot * c.dt * c.speed;
    applyPointer(p, c, 170, 220, -1);
    p.vx *= 0.99;
    return p.y > -80;
  },
  draw(g, p, c) {
    const flip = Math.cos(c.t * 2.3 * c.speed + p.phase);
    g.save();
    g.globalAlpha = p.alpha * (0.4 + Math.abs(flip) * 0.6);
    g.translate(p.x, p.y);
    g.rotate(p.rot);
    g.scale(Math.max(0.1, Math.abs(flip)), 1);
    g.fillStyle = p.color;
    // A-serisi orana yakın dikdörtgen: "kağıt" okunurluğu.
    g.fillRect(-p.size * 0.35, -p.size / 2, p.size * 0.7, p.size);
    g.restore();
  }
});

/**
 * Işık hüzmeleri — mezuniyet/zirve. Aşağıdan yukarı hızla yükselen, uçları
 * sönümlenen ince ışık çizgileri.
 */
const streaks: PresetFactory = () => ({
  density: 26,
  max: 70,
  composite: 'lighter',
  spawn(p, c, initial) {
    p.depth = 0.3 + c.rng() * 0.7;
    p.x = c.rng() * c.w;
    p.y = initial ? c.rng() * c.h : c.h + 60 + c.rng() * 200;
    // size = çizgi uzunluğu; derinlikle birlikte kalınlık da ölçeklenir.
    p.size = (60 + c.rng() * 190) * p.depth;
    p.vx = 0;
    p.vy = -(150 + c.rng() * 320) * p.depth;
    p.phase = c.rng() * Math.PI * 2;
    p.alpha = 0.18 + c.rng() * 0.4;
    p.color = pickColor(c, p);
    p.rot = 0;
    p.vrot = 0;
  },
  update(p, c) {
    p.y += p.vy * c.dt * c.speed;
    p.x += Math.sin(c.t * 0.4 + p.phase) * 6 * c.dt * c.speed;
    return p.y > -p.size - 40;
  },
  draw(g, p, c) {
    const rgb = toRgb(p.color);
    // Dikey gradient: baş taraf parlak, kuyruk saydam.
    const gradient = g.createLinearGradient(p.x, p.y, p.x, p.y + p.size);
    gradient.addColorStop(0, rgba(rgb, 0));
    gradient.addColorStop(0.45, rgba(rgb, 0.8));
    gradient.addColorStop(1, rgba(rgb, 0));

    g.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(c.t * 1.6 + p.phase));
    g.fillStyle = gradient;
    g.fillRect(p.x - Math.max(0.6, p.depth * 1.5), p.y, Math.max(1.2, p.depth * 3), p.size);
  }
});

/**
 * Sis parçaları — orman/mistik. Çok büyük, çok sönük, yavaş sürüklenen
 * yumuşak lekeler. Canvas'ta yapılır çünkü CSS blur'ü bu ölçekte pahalıdır.
 */
const haze: PresetFactory = () => ({
  density: 7,
  max: 20,
  composite: 'lighter',
  spawn(p, c, initial) {
    p.depth = 0.4 + c.rng() * 0.6;
    p.x = initial ? c.rng() * c.w : -c.w * 0.3;
    p.y = c.h * (0.3 + c.rng() * 0.7);
    p.size = (c.w * 0.25 + c.rng() * c.w * 0.3) * p.depth;
    p.vx = 6 + c.rng() * 14;
    p.vy = -(1 + c.rng() * 3);
    p.phase = c.rng() * Math.PI * 2;
    p.alpha = 0.05 + c.rng() * 0.1;
    p.color = pickColor(c, p);
    p.rot = 0;
    p.vrot = 0;
  },
  update(p, c) {
    p.x += p.vx * c.dt * c.speed;
    p.y += (p.vy + Math.sin(c.t * 0.25 + p.phase) * 4) * c.dt * c.speed;
    return p.x < c.w + p.size;
  },
  draw(g, p, c) {
    const breathe = 0.65 + 0.35 * Math.sin(c.t * 0.35 + p.phase);
    blit(g, glowSprite(p.color), p.x, p.y, p.size, p.alpha * breathe);
  }
});

export const PRESETS = {
  fairyDust,
  petals,
  fireflies,
  confetti,
  bubbles,
  stardust,
  feathers,
  embers,
  network,
  fireworks,
  balloons,
  pages,
  streaks,
  haze
} satisfies Record<string, PresetFactory>;

export type PresetName = keyof typeof PRESETS;

/* ————————————————— motor ————————————————— */

export interface FieldOptions {
  preset: PresetName;
  /** Parçacık renk paleti (hex ya da rgb()). Şablonun paletinden gelir. */
  colors: string[];
  /** Yoğunluk çarpanı (1 = ön ayarın kendi değeri). */
  density?: number;
  /** Hız çarpanı. */
  speed?: number;
  /** İşaretçi etkisi (0 = kapalı, 1 = normal). */
  pointerStrength?: number;
  /** Katmanın toplam saydamlığı. */
  opacity?: number;
  /** Deterministik kompozisyon tohumu. */
  seed?: number;
}

export interface FieldHandle {
  /** Görünürlük değişiminde döngüyü duraklatır/sürdürür. */
  setRunning(running: boolean): void;
  destroy(): void;
}

/** DPR üst sınırı: 3x ekranda 3x piksel doldurmak kazanç değil, ısı üretir. */
const MAX_DPR = 2;
/** Sekme arka plandayken dönen dev dt'nin fiziği patlatmasını engeller. */
const MAX_DT = 1 / 30;

/**
 * Canvas'a bir parçacık alanı bağlar. Döngü `setRunning(false)` ile tamamen
 * durur (rAF iptal edilir) — görünmeyen hero için tek kare bile çizilmez.
 */
export function createParticleField(
  canvas: HTMLCanvasElement,
  options: FieldOptions,
  { staticFrame = false }: { staticFrame?: boolean } = {}
): FieldHandle {
  const g = canvas.getContext('2d', { alpha: true });
  if (!g) {
    return { setRunning: () => undefined, destroy: () => undefined };
  }

  const preset = PRESETS[options.preset]();
  const rng = mulberry32(options.seed ?? 0x5eed);

  const context: FieldContext = {
    w: 1,
    h: 1,
    t: 0,
    dt: 0,
    pointer: { x: -9999, y: -9999, active: false },
    colors: options.colors.length ? options.colors : ['#ffffff'],
    speed: options.speed ?? 1,
    pointerStrength: options.pointerStrength ?? 1,
    rng
  };

  let particles: Particle[] = [];
  let dpr = 1;
  let raf = 0;
  let running = false;
  let last = 0;

  function blankParticle(i: number): Particle {
    return {
      i,
      x: 0, y: 0, vx: 0, vy: 0,
      size: 1, rot: 0, vrot: 0,
      life: 1, maxLife: 1,
      phase: 0, depth: 1, alpha: 1,
      color: '#ffffff',
      cycle: 0
    };
  }

  /** Havuzu alana göre yeniden boyutlandırır; mevcut parçacıklar korunur. */
  function sizePool() {
    const area = (context.w * context.h) / 1e6;
    const target = Math.max(
      6,
      Math.min(preset.max, Math.round(preset.density * area * (options.density ?? 1)))
    );

    if (target === particles.length) return;

    if (target < particles.length) {
      particles.length = target;
      return;
    }

    for (let i = particles.length; i < target; i++) {
      const p = blankParticle(i);
      preset.spawn(p, context, true);
      particles.push(p);
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.w = width;
    context.h = height;

    sizePool();
    if (staticFrame) renderOnce();
  }

  function step(now: number) {
    if (!running) return;

    const seconds = now / 1000;
    context.dt = Math.min(MAX_DT, last ? seconds - last : 1 / 60);
    context.t = seconds;
    last = seconds;

    draw();
    raf = requestAnimationFrame(step);
  }

  function draw() {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, context.w, context.h);
    g.globalCompositeOperation = preset.composite ?? 'source-over';
    g.globalAlpha = 1;

    for (const p of particles) {
      if (!preset.update(p, context)) preset.spawn(p, context, false);
      preset.draw(g, p, context);
    }

    preset.after?.(g, particles, context);

    g.globalAlpha = 1;
    g.globalCompositeOperation = 'source-over';
  }

  /** "Hareketi azalt" modunda tek durağan kare: kompozisyon boş kalmasın. */
  function renderOnce() {
    context.dt = 0;
    context.t = 0;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, context.w, context.h);
    g.globalCompositeOperation = preset.composite ?? 'source-over';
    for (const p of particles) preset.draw(g, p, context);
    preset.after?.(g, particles, context);
    g.globalAlpha = 1;
    g.globalCompositeOperation = 'source-over';
  }

  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    context.pointer.x = x;
    context.pointer.y = y;
    context.pointer.active =
      x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
  };

  const onPointerLeave = () => {
    context.pointer.active = false;
  };

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  if (!staticFrame && (options.pointerStrength ?? 1) > 0) {
    // Katman pointer-events:none olduğu için dinleyici window'da durur.
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  }

  return {
    setRunning(next: boolean) {
      if (staticFrame || next === running) return;
      running = next;

      if (next) {
        last = 0;
        raf = requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(raf);
      }
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    }
  };
}
