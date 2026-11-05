/**
 * Arcade motoru — saf canvas 2D, React'ten bağımsız.
 * Dünya birimleri: ekran yüksekliği her zaman VIEW_H birimdir; genişlik orana göre.
 * Fizik sabit adımlıdır (STEP); çizim her karede bir kez yapılır.
 */

export type TokenKind = 'date' | 'venue' | 'program';

export const STEP = 1 / 60;
const VIEW_H = 160;
const GROUND = 132;
const GRAVITY = 900;
const JUMP_V = -330;
const PW = 12;
const PH = 14;

const C = {
  sky0: '#0B0620',
  sky1: '#2A0F5C',
  pink: '#FF3EA5',
  cyan: '#2DE2E6',
  yellow: '#F9F871',
  violet: '#7B2FF7',
  white: '#F4F0FF',
  ink: '#140B33'
};
const TOKEN_COLORS: Record<TokenKind, string> = { date: C.pink, venue: C.cyan, program: C.yellow };
const TOKEN_GLYPH: Record<TokenKind, string> = { date: 'T', venue: 'M', program: 'P' };

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface World {
  crates: Box[];
  tokens: { kind: TokenKind; x: number; y: number }[];
  finishX: number;
}

export function buildWorld(kinds: TokenKind[]): World {
  const crates: Box[] = [];
  const tokens: World['tokens'] = [];
  let x = 170;
  kinds.forEach((kind, i) => {
    const h = i % 2 === 0 ? 14 : 22;
    crates.push({ x, y: GROUND - h, w: 16, h });
    tokens.push({ kind, x: x + 70, y: GROUND - 46 });
    x += 190;
  });
  if (kinds.length === 0) crates.push({ x, y: GROUND - 14, w: 16, h: 14 });
  return { crates, tokens, finishX: x + 60 };
}

interface Input {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export interface GameState {
  player: { x: number; y: number; vx: number; vy: number; onGround: boolean };
  tokens: { kind: TokenKind; x: number; y: number; taken: boolean; flash: number }[];
  frame: number;
  stuck: number;
  finished: boolean;
  step: (input: Input | null) => { collected: TokenKind | null; finished: boolean };
}

const overlap = (a: Box, b: Box) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export function createGame(world: World): GameState {
  const s: GameState = {
    player: { x: 40, y: GROUND - PH, vx: 0, vy: 0, onGround: true },
    tokens: world.tokens.map((t) => ({ ...t, taken: false, flash: 0 })),
    frame: 0,
    stuck: 0,
    finished: false,
    step(input) {
      const p = s.player;
      let collected: TokenKind | null = null;
      s.tokens.forEach((t) => (t.flash = Math.max(0, t.flash - STEP)));
      if (!input || s.finished) {
        // Bekleme / bitiş: karakter yerinde koşar (bitişte bayrağa doğru yürür).
        if (s.finished && p.x < world.finishX + 30) p.x += 40 * STEP;
        s.frame += STEP * 8;
        return { collected, finished: s.finished };
      }
      const target = input.left ? -60 : input.right ? 130 : 86;
      p.vx += (target - p.vx) * Math.min(1, STEP * 10);
      if (input.jump && p.onGround) {
        p.vy = JUMP_V;
        p.onGround = false;
      }
      // Takılırsa (kutunun önünde 1.4 sn) kendiliğinden zıplar — erişilebilirlik yardımı.
      if (p.onGround && Math.abs(p.vx) > 20 && s.stuck > 1.4) {
        p.vy = JUMP_V;
        p.onGround = false;
        s.stuck = 0;
      }
      p.vy += GRAVITY * STEP;

      // Yatay
      const prevX = p.x;
      p.x = Math.max(0, p.x + p.vx * STEP);
      for (const c of world.crates) {
        const box = { x: p.x, y: p.y, w: PW, h: PH };
        if (overlap(box, c)) p.x = p.vx > 0 ? c.x - PW : c.x + c.w;
      }
      s.stuck = Math.abs(p.x - prevX) < 0.05 && p.vx > 20 ? s.stuck + STEP : 0;

      // Dikey
      p.y += p.vy * STEP;
      p.onGround = false;
      if (p.y + PH >= GROUND) {
        p.y = GROUND - PH;
        p.vy = 0;
        p.onGround = true;
      }
      for (const c of world.crates) {
        const box = { x: p.x, y: p.y, w: PW, h: PH };
        if (overlap(box, c)) {
          if (p.vy > 0) {
            p.y = c.y - PH;
            p.vy = 0;
            p.onGround = true;
          } else {
            p.y = c.y + c.h;
            p.vy = 0;
          }
        }
      }

      // Jetonlar
      for (const t of s.tokens) {
        if (!t.taken && overlap({ x: p.x, y: p.y, w: PW, h: PH }, { x: t.x - 6, y: t.y - 6, w: 12, h: 12 })) {
          t.taken = true;
          t.flash = 0.5;
          collected = t.kind;
        }
      }
      if (p.x >= world.finishX) s.finished = true;
      s.frame += Math.abs(p.vx) * STEP * 0.12;
      return { collected, finished: s.finished };
    }
  };
  return s;
}

/** Canvas'ı CSS boyutuna göre DPR (en çok 2) ile ayarlar. */
export function sizeCanvas(canvas: HTMLCanvasElement): { ctx: CanvasRenderingContext2D; w: number; h: number } | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { width, height } = canvas.getBoundingClientRect();
  if (width === 0 || height === 0) return null;
  const pw = Math.round(width * dpr);
  const ph = Math.round(height * dpr);
  if (canvas.width !== pw) canvas.width = pw;
  if (canvas.height !== ph) canvas.height = ph;
  ctx.imageSmoothingEnabled = false;
  return { ctx, w: pw, h: ph };
}

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

/** Kendi karakterimiz: anten taşıyan küçük bir küp robot ("Bip"). */
function drawHero(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, airborne: boolean) {
  const f = Math.floor(frame) % 2;
  // Anten
  px(ctx, x + 5, y - 4, 1, 3, C.white);
  px(ctx, x + 4, y - 5, 3, 2, C.pink);
  // Gövde
  px(ctx, x, y, PW, 10, C.cyan);
  px(ctx, x + 1, y + 1, PW - 2, 1, '#9FF6F8');
  // Yüz ekranı
  px(ctx, x + 2, y + 2, 8, 5, C.ink);
  px(ctx, x + 3, y + 3, 2, 2, C.yellow);
  px(ctx, x + 7, y + 3, 2, 2, C.yellow);
  px(ctx, x + 4, y + 6, 4, 1, C.pink);
  // Bacaklar
  if (airborne) {
    px(ctx, x + 2, y + 10, 3, 3, C.violet);
    px(ctx, x + 7, y + 10, 3, 2, C.violet);
  } else if (f === 0) {
    px(ctx, x + 1, y + 10, 3, 4, C.violet);
    px(ctx, x + 8, y + 10, 3, 3, C.violet);
  } else {
    px(ctx, x + 3, y + 10, 3, 3, C.violet);
    px(ctx, x + 6, y + 10, 3, 4, C.violet);
  }
}

export function drawScene(ctx: CanvasRenderingContext2D, w: number, h: number, world: World, s: GameState, t: number) {
  const scale = h / VIEW_H;
  const viewW = w / scale;
  const cam = Math.max(0, s.player.x - viewW * 0.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.imageSmoothingEnabled = false;

  // Gökyüzü
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, C.sky0);
  g.addColorStop(0.75, C.sky1);
  g.addColorStop(1, '#4A1470');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  // Yıldızlar (paralaks 0.1)
  for (let i = 0; i < 40; i++) {
    const sx = (((i * 97) % 600) - cam * 0.1 + 600 * 4) % 600;
    const sy = (i * 53) % 90;
    const tw = (Math.sin(t * 2 + i) + 1) / 2;
    px(ctx, sx % (viewW + 10), sy, 1, 1, tw > 0.5 ? C.white : C.violet);
  }

  // Çizgili güneş (paralaks 0.05)
  const sunX = viewW * 0.7 - cam * 0.05;
  const sunY = 78;
  const sunR = 34;
  for (let yy = -sunR; yy < 0; yy += 2) {
    const band = yy > -14 && Math.floor(yy / 3) % 2 === 0;
    if (band) continue;
    const half = Math.sqrt(sunR * sunR - yy * yy);
    const mix = (yy + sunR) / sunR;
    px(ctx, sunX - half, sunY + yy, Math.round(half * 2), 2, mix < 0.5 ? C.yellow : C.pink);
  }

  // Dağ silüeti (paralaks 0.3)
  ctx.fillStyle = '#1C0B45';
  for (let i = -1; i < viewW / 40 + 2; i++) {
    const base = Math.floor(cam * 0.3 / 40) + i;
    const mx = base * 40 - cam * 0.3;
    const mh = 18 + ((base * 37) % 5) * 6;
    ctx.beginPath();
    ctx.moveTo(mx, GROUND);
    ctx.lineTo(mx + 20, GROUND - mh);
    ctx.lineTo(mx + 40, GROUND);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(-Math.round(cam), 0);

  // Zemin: neon ızgara
  px(ctx, cam - 2, GROUND, viewW + 4, VIEW_H - GROUND, '#160838');
  px(ctx, cam - 2, GROUND, viewW + 4, 1, C.pink);
  for (let gx = Math.floor(cam / 12) * 12; gx < cam + viewW + 12; gx += 12) px(ctx, gx, GROUND + 1, 1, VIEW_H - GROUND, 'rgba(255,62,165,0.35)');
  for (let gy = GROUND + 6; gy < VIEW_H; gy += 7) px(ctx, cam - 2, gy, viewW + 4, 1, 'rgba(45,226,230,0.25)');

  // Kutular
  for (const c of world.crates) {
    px(ctx, c.x, c.y, c.w, c.h, C.violet);
    px(ctx, c.x + 1, c.y + 1, c.w - 2, c.h - 2, '#3A1680');
    px(ctx, c.x, c.y, c.w, 1, C.cyan);
    px(ctx, c.x + 3, c.y + 3, c.w - 6, 1, C.cyan);
    px(ctx, c.x + 3, c.y + c.h - 4, c.w - 6, 1, C.cyan);
  }

  // Bitiş bayrağı
  px(ctx, world.finishX, GROUND - 46, 2, 46, C.white);
  const wave = Math.round(Math.sin(t * 6));
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) px(ctx, world.finishX + 2 + i * 4, GROUND - 46 + j * 4 + (i % 2 ? wave : 0), 4, 4, (i + j) % 2 ? C.pink : C.white);

  // Jetonlar
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const tk of s.tokens) {
    if (tk.taken) {
      if (tk.flash > 0) {
        const r = (0.5 - tk.flash) * 40;
        ctx.strokeStyle = TOKEN_COLORS[tk.kind];
        ctx.globalAlpha = tk.flash * 2;
        ctx.strokeRect(tk.x - r, tk.y - r, r * 2, r * 2);
        ctx.globalAlpha = 1;
      }
      continue;
    }
    const bob = Math.round(Math.sin(t * 4 + tk.x) * 2);
    const color = TOKEN_COLORS[tk.kind];
    px(ctx, tk.x - 5, tk.y - 7 + bob, 10, 14, color);
    px(ctx, tk.x - 7, tk.y - 5 + bob, 14, 10, color);
    px(ctx, tk.x - 4, tk.y - 4 + bob, 8, 8, C.ink);
    ctx.fillStyle = color;
    ctx.fillText(TOKEN_GLYPH[tk.kind], tk.x, tk.y + bob + 0.5);
  }

  // Karakter
  const p = s.player;
  px(ctx, p.x + 1, GROUND + 1, PW - 2, 1, 'rgba(0,0,0,0.5)');
  drawHero(ctx, p.x, p.y, s.frame, !p.onGround);

  ctx.restore();
}
