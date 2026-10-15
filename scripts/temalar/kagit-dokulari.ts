/**
 * "Kâğıt / el yapımı" kitinin döşenebilir dokularını üretir.
 *
 *   npx tsx scripts/temalar/kagit-dokulari.ts
 *
 * Dokular çalışma anında üretilmez: SVG `feTurbulence` telefonda her kaydırma
 * karesinde yeniden boyanır. Burada bir kez, headless Chrome'un canvas'ında
 * üretilir ve WebP olarak `shared/paper/doku/` altına yazılır.
 *
 * Çıktılar deterministiktir (sabit tohumlar): betik yeniden çalıştırıldığında
 * aynı desen çıkar; WebP kodlayıcının sürümü değişirse bayt düzeyinde fark
 * olabilir, görünüm değişmez.
 *
 * Ayrıntılı açıklama: docs/rehber/scripts/temalar/kagit-dokulari.md
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'src/components/templates/shared/paper/doku');
const PORT = 9341;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
].filter((p): p is string => Boolean(p));

/**
 * Tarayıcıda koşan üretici. Dize olarak gönderilir: tsx fonksiyonlara
 * yardımcı çağrılar ekleyebildiği için `fn.toString()` tarayıcıda kırılırdı.
 *
 * Bütün gürültüler döşemenin boyuna periyodiktir; kenarlar dikişsiz birleşir.
 */
const GENERATOR = String.raw`
(() => {
  const rng = (s) => () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  // Periyodik değer gürültüsü: size px'lik döşemede cells×cells hücre.
  const noise = (size, cells, r) => {
    const g = Array.from({ length: cells * cells }, r);
    const at = (i, j) => g[(((j % cells) + cells) % cells) * cells + (((i % cells) + cells) % cells)];
    const sm = (t) => t * t * (3 - 2 * t);
    return (x, y) => {
      const fx = (x / size) * cells, fy = (y / size) * cells;
      const i = Math.floor(fx), j = Math.floor(fy), u = sm(fx - i), v = sm(fy - j);
      return (at(i, j) * (1 - u) + at(i + 1, j) * u) * (1 - v) + (at(i, j + 1) * (1 - u) + at(i + 1, j + 1) * u) * v;
    };
  };
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const gray = (img, k, v) => { const b = Math.round(Math.max(0, Math.min(1, v)) * 255); img.data[k] = img.data[k + 1] = img.data[k + 2] = b; img.data[k + 3] = 255; };
  const stats = (c) => {
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, v = [];
    for (let i = 0; i < d.length; i += 4) v.push(d[i + 1] / 255);
    v.sort((a, b) => a - b);
    return { min: v[0], p1: v[Math.floor(v.length * 0.01)], ort: v.reduce((a, b) => a + b, 0) / v.length };
  };

  // Pamuk lifi: bulutlu hamur oluşumu + ince lifler + seyrek kalıntı.
  const lif = () => {
    const S = 256, c = canvas(S, S), x = c.getContext('2d'), r = rng(11);
    const n1 = noise(S, 4, r), n2 = noise(S, 8, r), n3 = noise(S, 16, r), n4 = noise(S, 64, r);
    const img = x.createImageData(S, S);
    for (let y = 0; y < S; y++) for (let X = 0; X < S; X++) {
      const f = 0.5 * n1(X, y) + 0.3 * n2(X, y) + 0.2 * n3(X, y);
      gray(img, (y * S + X) * 4, 1 - 0.045 * f - 0.02 * n4(X, y) - 0.014 * r());
    }
    x.putImageData(img, 0, 0);
    const fiber = (alpha, w) => {
      const x0 = r() * S, y0 = r() * S, ang = r() * Math.PI * 2, len = 4 + r() * 14, bend = (r() - 0.5) * 1.4;
      for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
        x.beginPath();
        x.moveTo(x0 + ox, y0 + oy);
        x.quadraticCurveTo(
          x0 + ox + Math.cos(ang + bend) * len * 0.5, y0 + oy + Math.sin(ang + bend) * len * 0.5,
          x0 + ox + Math.cos(ang) * len, y0 + oy + Math.sin(ang) * len
        );
        x.strokeStyle = 'rgba(72,66,60,' + alpha + ')';
        x.lineWidth = w;
        x.stroke();
      }
    };
    for (let i = 0; i < 130; i++) fiber(0.025 + r() * 0.045, 0.45 + r() * 0.5);
    for (let i = 0; i < 8; i++) {
      const px = r() * S, py = r() * S, rad = 0.45 + r() * 0.6;
      x.fillStyle = 'rgba(64,56,48,' + (0.06 + r() * 0.08) + ')';
      for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) { x.beginPath(); x.arc(px + ox, py + oy, rad, 0, 7); x.fill(); }
    }
    return c;
  };

  // Keten: 4 px adımlı atkı ve çözgü, iplik kalınlığı iplikten ipliğe değişir.
  const keten = () => {
    const S = 256, c = canvas(S, S), x = c.getContext('2d'), r = rng(23);
    const rows = Array.from({ length: S / 4 }, r), cols = Array.from({ length: S / 4 }, r);
    const nx = noise(S, 32, r), ny = noise(S, 32, r), n1 = noise(S, 4, r), px = noise(S, 16, r), py = noise(S, 16, r);
    const img = x.createImageData(S, S);
    for (let y = 0; y < S; y++) for (let X = 0; X < S; X++) {
      const h = 0.5 + 0.5 * Math.cos((2 * Math.PI * (y + 1.6 * (px(X, y) - 0.5))) / 4);
      const v = 0.5 + 0.5 * Math.cos((2 * Math.PI * (X + 1.6 * (py(X, y) - 0.5))) / 4);
      const val = 1
        - 0.03 * h * (0.4 + rows[y >> 2]) * (0.6 + 0.8 * nx(X, y))
        - 0.03 * v * (0.4 + cols[X >> 2]) * (0.6 + 0.8 * ny(X, y))
        - 0.03 * n1(X, y) - 0.012 * r();
      gray(img, (y * S + X) * 4, val);
    }
    x.putImageData(img, 0, 0);
    return c;
  };

  // Mürekkep: damganın eşit dağılmayan boyası (alfa maskesi).
  const murekkep = () => {
    const S = 128, c = canvas(S, S), x = c.getContext('2d'), r = rng(31);
    const n1 = noise(S, 6, r), n2 = noise(S, 24, r), n3 = noise(S, 32, r);
    const img = x.createImageData(S, S);
    for (let y = 0; y < S; y++) for (let X = 0; X < S; X++) {
      const f = 0.6 * n1(X, y) + 0.4 * n2(X, y);
      let a = f > 0.5 ? Math.max(0.1, 1 - (f - 0.5) * 3.2) : 1;
      if (n3(X, y) > 0.76) a *= 0.5;
      const k = (y * S + X) * 4;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = 0;
      img.data[k + 3] = Math.round(a * 255);
    }
    x.putImageData(img, 0, 0);
    return c;
  };

  // Suluboya lekesi: deforme çokgen katmanları (Hobbs yöntemi), kenarda
  // toplanan pigment ve tanecik. Siyah + alfa; rengi CSS maskesiyle alır.
  const leke = () => {
    const S = 200, c = canvas(S, S), x = c.getContext('2d'), r = rng(5);
    const gauss = () => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    const deform = (pts, depth, vr) => {
      if (!depth) return pts;
      const out = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
        const off = gauss() * vr * len;
        out.push(a, [(a[0] + b[0]) / 2 - (dy / len) * off, (a[1] + b[1]) / 2 + (dx / len) * off]);
      }
      return deform(out, depth - 1, vr * 0.92);
    };
    let base = Array.from({ length: 12 }, (_, i) => {
      const t = (i / 12) * Math.PI * 2, rad = 64 + gauss() * 7;
      return [S / 2 + Math.cos(t) * rad * 1.08, S / 2 + Math.sin(t) * rad * 0.92];
    });
    base = deform(base, 4, 0.17);
    for (let i = 0; i < 70; i++) {
      const p = deform(base, 2, 0.2);
      x.beginPath();
      p.forEach(([px, py], j) => (j ? x.lineTo(px, py) : x.moveTo(px, py)));
      x.closePath();
      x.fillStyle = 'rgba(0,0,0,0.017)';
      x.fill();
      x.strokeStyle = 'rgba(0,0,0,0.04)';
      x.lineWidth = 1.6;
      x.stroke();
    }
    const n = noise(S, 20, r);
    const img = x.getImageData(0, 0, S, S);
    for (let k = 0; k < img.data.length; k += 4) {
      const X = (k / 4) % S, y = Math.floor(k / 4 / S);
      img.data[k + 3] = Math.round(img.data[k + 3] * (0.82 + 0.18 * n(X, y)) * (0.93 + 0.07 * r()));
    }
    x.putImageData(img, 0, 0);
    return c;
  };

  const out = {};
  for (const [name, make, q] of [['lif', lif, 0.8], ['keten', keten, 0.8], ['murekkep', murekkep, 0.82], ['leke', leke, 0.85]]) {
    const c = make();
    out[name] = { data: c.toDataURL('image/webp', q), stats: name === 'lif' || name === 'keten' ? stats(c) : null };
  }
  return out;
})()
`;

async function main() {
  const chrome = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
  if (!chrome) throw new Error('Chrome/Edge bulunamadı; CHROME_PATH ile yolu verin.');

  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'kagit-doku-'));
  const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], {
    stdio: 'ignore'
  });

  try {
    let wsUrl = '';
    for (let i = 0; i < 50 && !wsUrl; i++) {
      try {
        const targets = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()) as { type: string; webSocketDebuggerUrl: string }[];
        wsUrl = targets.find((t) => t.type === 'page')?.webSocketDebuggerUrl ?? '';
      } catch {
        /* tarayıcı henüz dinlemiyor */
      }
      if (!wsUrl) await new Promise((r) => setTimeout(r, 200));
    }
    if (!wsUrl) throw new Error('Tarayıcıya bağlanılamadı.');

    const ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });
    const result = await new Promise<Record<string, { data: string; stats: { min: number; p1: number; ort: number } | null }>>(
      (resolve, reject) => {
        ws.onmessage = (event) => {
          const msg = JSON.parse(String(event.data));
          if (msg.id !== 1) return;
          if (msg.result?.exceptionDetails) reject(new Error(msg.result.exceptionDetails.text));
          else resolve(msg.result.result.value);
        };
        ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: GENERATOR, returnByValue: true } }));
      }
    );
    ws.close();

    fs.mkdirSync(OUT, { recursive: true });
    let total = 0;
    for (const [name, { data, stats }] of Object.entries(result)) {
      const bytes = Buffer.from(data.split(',')[1], 'base64');
      fs.writeFileSync(path.join(OUT, `${name}.webp`), bytes);
      total += bytes.length;
      const s = stats ? `  en koyu ${stats.min.toFixed(3)} · %1 ${stats.p1.toFixed(3)} · ort ${stats.ort.toFixed(3)}` : '';
      console.log(`${name}.webp  ${(bytes.length / 1024).toFixed(1)} KB${s}`);
    }
    console.log(`toplam ${(total / 1024).toFixed(1)} KB`);
  } finally {
    proc.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
