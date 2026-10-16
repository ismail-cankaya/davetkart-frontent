/**
 * Önizleme ekran görüntüleri — headless Chrome, DevTools protokolü (yeni paket yok).
 *
 *   npm run dev -- --port 3101
 *   npx tsx scripts/onizleme/cek.ts --port 3101 --preset dugun-sergi-beyaz-kup
 *
 * Ayrıntılı açıklama: docs/rehber/scripts/onizleme.md
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const CHROME_ADAYLARI = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
].filter((p): p is string => Boolean(p));

/** Genişlik → ekran boyu. 360 telefon, 768 tablet, 1280 dizüstü. */
const BOYUTLAR: Record<string, [number, number]> = { '360': [360, 780], '768': [768, 1024], '1280': [1280, 800] };

function arg(ad: string, varsayilan = ''): string {
  const i = process.argv.indexOf('--' + ad);
  const deger = i >= 0 ? process.argv[i + 1] : undefined;
  return deger && !deger.startsWith('--') ? deger : varsayilan;
}
const bayrak = (ad: string) => process.argv.includes('--' + ad);

const PORT = arg('port', '3000');
const PRESETLER = arg('preset').split(',').filter(Boolean);
const SENARYOLAR = arg('senaryo', 'dolu,kapali').split(',');
const GENISLIKLER = arg('genislik', '360,768,1280').split(',');
const EKRAN = Number(arg('ekran', '8'));
const ZARF = bayrak('zarf');
const AZALT = bayrak('azalt');
const KAPAT = arg('kapat');
const CIKTI = path.resolve(ROOT, arg('cikti', 'node_modules/.cache/onizleme'));
/** Her geliştirme sunucusunun kendi tarayıcı portu: iki ajan aynı anda çekebilir. */
const CDP_PORT = Number(PORT) + 6000;

interface CdpMesaji {
  id?: number;
  method?: string;
  params?: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: { message: string };
}

/** En küçük DevTools istemcisi: istek/yanıt eşlemesi ve olay dinleyicileri. */
class Cdp {
  private sira = 0;
  private bekleyen = new Map<number, { coz: (v: Record<string, unknown>) => void; red: (e: Error) => void }>();
  private dinleyiciler = new Map<string, ((p: Record<string, unknown>) => void)[]>();

  constructor(private ws: WebSocket) {
    ws.onmessage = (olay) => {
      const m = JSON.parse(String(olay.data)) as CdpMesaji;
      if (m.id !== undefined && this.bekleyen.has(m.id)) {
        const b = this.bekleyen.get(m.id)!;
        this.bekleyen.delete(m.id);
        if (m.error) b.red(new Error(m.error.message));
        else b.coz(m.result ?? {});
      } else if (m.method) {
        for (const f of this.dinleyiciler.get(m.method) ?? []) f(m.params ?? {});
      }
    };
  }

  gonder(method: string, params: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    const id = ++this.sira;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((coz, red) => this.bekleyen.set(id, { coz, red }));
  }

  dinle(method: string, f: (p: Record<string, unknown>) => void) {
    this.dinleyiciler.set(method, [...(this.dinleyiciler.get(method) ?? []), f]);
  }

  birKez(method: string): Promise<Record<string, unknown>> {
    return new Promise((coz) => {
      const f = (p: Record<string, unknown>) => {
        this.dinleyiciler.set(method, (this.dinleyiciler.get(method) ?? []).filter((x) => x !== f));
        coz(p);
      };
      this.dinle(method, f);
    });
  }
}

const bekle = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function degerlendir<T>(cdp: Cdp, ifade: string): Promise<T> {
  const r = (await cdp.gonder('Runtime.evaluate', { expression: ifade, awaitPromise: true, returnByValue: true })) as {
    result?: { value?: T };
    exceptionDetails?: { text: string };
  };
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
  return r.result?.value as T;
}

async function main() {
  if (!PRESETLER.length) {
    console.error(
      'Kullanım: npx tsx scripts/onizleme/cek.ts --port 3101 --preset <id>[,<id>] ' +
        '[--senaryo dolu,uzun,bos,kapali] [--genislik 360,768,1280] [--ekran 8] [--zarf] [--azalt] [--kapat timer,gift] [--cikti klasör]'
    );
    process.exit(2);
  }
  try {
    await fetch(`http://localhost:${PORT}/onizleme.html`);
  } catch {
    throw new Error(`http://localhost:${PORT} yanıt vermiyor; önce: npm run dev -- --port ${PORT}`);
  }
  const chrome = CHROME_ADAYLARI.find((p) => fs.existsSync(p));
  if (!chrome) throw new Error('Chrome/Edge bulunamadı; CHROME_PATH ile yolu verin.');

  const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'onizleme-'));
  const tarayici = spawn(chrome, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profil}`, '--hide-scrollbars', 'about:blank'], {
    stdio: 'ignore'
  });

  let sayfaHatasi = 0;
  try {
    let wsUrl = '';
    for (let i = 0; i < 50 && !wsUrl; i++) {
      try {
        const hedefler = (await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json()) as { type: string; webSocketDebuggerUrl: string }[];
        wsUrl = hedefler.find((t) => t.type === 'page')?.webSocketDebuggerUrl ?? '';
      } catch {
        /* tarayıcı henüz dinlemiyor */
      }
      if (!wsUrl) await bekle(200);
    }
    if (!wsUrl) throw new Error('Tarayıcıya bağlanılamadı.');

    const ws = new WebSocket(wsUrl);
    await new Promise((coz, red) => {
      ws.onopen = coz;
      ws.onerror = red;
    });
    const cdp = new Cdp(ws);
    await cdp.gonder('Page.enable');
    await cdp.gonder('Runtime.enable');
    cdp.dinle('Runtime.exceptionThrown', (p) => {
      sayfaHatasi++;
      const d = p.exceptionDetails as { text?: string; exception?: { description?: string } } | undefined;
      console.error('  ! sayfa hatası:', d?.exception?.description ?? d?.text);
    });
    cdp.dinle('Runtime.consoleAPICalled', (p) => {
      if (p.type !== 'error') return;
      sayfaHatasi++;
      const argumanlar = (p.args as { value?: unknown; description?: string }[] | undefined) ?? [];
      console.error('  ! console.error:', argumanlar.map((a) => a.value ?? a.description).join(' '));
    });
    await cdp.gonder('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: AZALT ? 'reduce' : 'no-preference' }]
    });

    for (const preset of PRESETLER)
      for (const senaryo of SENARYOLAR)
        for (const g of GENISLIKLER) {
          const boy = BOYUTLAR[g];
          if (!boy) throw new Error(`Bilinmeyen genişlik: ${g} (360, 768, 1280)`);
          const [w, h] = boy;
          await cdp.gonder('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
          const url =
            `http://localhost:${PORT}/onizleme.html?preset=${encodeURIComponent(preset)}&senaryo=${senaryo}` +
            (ZARF ? '&zarf=1' : '') +
            (KAPAT ? `&kapat=${KAPAT}` : '');
          const yuklendi = cdp.birKez('Page.loadEventFired');
          await cdp.gonder('Page.navigate', { url });
          await yuklendi;

          // Sayfa kendini "hazır" ya da "hata" diye işaretler (main.tsx → durum()).
          const durum = await degerlendir<string>(
            cdp,
            `new Promise(r => { const t0 = Date.now(); const k = () => { const d = document.documentElement.dataset.onizleme;
               if (d || Date.now() - t0 > 15000) r(d || 'zaman-asimi'); else setTimeout(k, 100); }; k(); })`
          );
          if (durum !== 'hazir') {
            const mesaj = await degerlendir<string>(cdp, `document.documentElement.dataset.onizlemeMesaj || ''`);
            throw new Error(`${preset}: ${durum}\n${mesaj}`);
          }
          // Fontlar ve hero girişi (≤ 1 s kuralı) otursun.
          await degerlendir(cdp, `document.fonts.ready.then(() => new Promise(r => setTimeout(r, 1500)))`);

          const klasor = path.join(CIKTI, preset);
          fs.mkdirSync(klasor, { recursive: true });
          const kab = `document.querySelector('#kok [data-lenis-prevent]')`;
          const olcu = await degerlendir<{ yukseklik: number; ekran: number }>(
            cdp,
            `(() => { const e = ${kab}; return e ? { yukseklik: e.scrollHeight, ekran: e.clientHeight } : { yukseklik: innerHeight, ekran: innerHeight }; })()`
          );
          const adet = ZARF ? 1 : Math.min(EKRAN, Math.max(1, Math.ceil(olcu.yukseklik / olcu.ekran)));
          for (let i = 0; i < adet; i++) {
            if (i > 0) {
              await degerlendir(cdp, `(() => { const e = ${kab}; if (e) e.scrollTop = ${i} * e.clientHeight; })()`);
              await bekle(1000);
            }
            const { data } = (await cdp.gonder('Page.captureScreenshot', { format: 'png' })) as { data: string };
            const etiket = [senaryo, ZARF && 'zarf', AZALT && 'azalt', KAPAT && 'k-' + KAPAT.replace(/,/g, '+')].filter(Boolean).join('-');
            const dosya = path.join(klasor, `${preset}--${etiket}--${g}--${i + 1}.png`);
            fs.writeFileSync(dosya, Buffer.from(data, 'base64'));
            console.log(path.relative(ROOT, dosya));
          }
        }
    ws.close();
  } finally {
    tarayici.kill();
  }
  if (sayfaHatasi) {
    console.error(`${sayfaHatasi} sayfa hatası`);
    process.exitCode = 1;
  }
}

main().catch((hata) => {
  console.error(hata instanceof Error ? hata.message : hata);
  process.exit(1);
});
