import React, { createContext, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { bandTransform, curl, type Vec } from './curl';

export interface Leaf {
  key: string;
  /** Ekran okuyucu ve sayfa göstergesi için ad. */
  label: string;
  front: ReactNode;
  back: ReactNode;
}

/**
 * Sağdan sola (Arapça) kitapta sırt sağdadır: mekanik bütünüyle aynalanır,
 * sayfa yüzleri yazıyı bu bağlamla yeniden çevirir (okunur kalır).
 */
export const MirrorContext = createContext(false);

interface KitapProps {
  leaves: Leaf[];
  /** Kapak kendiliğinden açılsın mı (hareketi azaltınca hayır). */
  autoOpen: boolean;
  reduced: boolean;
  /** Belge yönü sağdan sola mı (sırt sağda, sayfalar sola doğru açılır). */
  rtl?: boolean;
  /** Masaüstü genişlikte çift sayfa (sol: önceki yaprağın arkası). */
  onPageChange?: (turned: number) => void;
}

interface Drag {
  leaf: number;
  dir: 1 | -1;
  cornerY: number;
}

type Size = { W: number; H: number; spread: boolean };

const BAND = 4000;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Sahneye sığan sayfa boyu: 0.7 oranlı; iki sayfa sığıyorsa çift sayfa. */
function measure(w: number, h: number): Size {
  const H = Math.max(360, Math.min(h - 112, 760));
  const W = Math.min(Math.round(H * 0.7), w - 28);
  const H2 = Math.min(H, Math.round(W / 0.62));
  return { W, H: H2, spread: w >= W * 2 + 96 };
}

/**
 * Kitap: yapraklar üst üste; çevrilmiş yaprak sırtın soluna yatar. Kıvrım
 * kare kare DOM'a doğrudan yazılır (React yeniden çizimi yok); React yalnızca
 * "kaç yaprak çevrildi" ve "hangi yaprak sürükleniyor" durumunu tutar.
 */
export function Kitap({ leaves, autoOpen, reduced, rtl = false, onPageChange }: KitapProps) {
  const sx = rtl ? -1 : 1;
  const N = leaves.length;
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ W: 340, H: 520, spread: false });
  const [turned, setTurned] = useState(0);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [interacted, setInteracted] = useState(false);

  const fronts = useRef<(HTMLDivElement | null)[]>([]);
  const backs = useRef<(HTMLDivElement | null)[]>([]);
  const backInners = useRef<(HTMLDivElement | null)[]>([]);
  const frontBand = useRef<HTMLDivElement>(null);
  const backBand = useRef<HTMLDivElement>(null);
  const underBand = useRef<HTMLDivElement>(null);
  const underWrap = useRef<HTMLDivElement>(null);
  const anim = useRef<number | null>(null);
  const pointer = useRef<{ id: number; x: number; y: number; started: boolean; dir: 1 | -1 | 0; cornerY: number } | null>(null);
  const wheel = useRef({ acc: 0, lock: 0 });
  const hinting = useRef(false);
  const busy = drag !== null;

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setSize(measure(el.clientWidth, el.clientHeight));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => onPageChange?.(turned), [turned, onPageChange]);

  const { W, H, spread } = size;
  // Kitabın yatay kayması: kapalı kapak ortada, açık kitapta sırt ortada.
  const offsetX = !spread ? 0 : turned === 0 ? 0 : turned >= N ? W : W / 2;

  /** Sürüklenen yaprağın kıvrımını yazar. */
  const paint = useCallback(
    (leaf: number, cornerY: number, P: Vec) => {
      const g = curl(W, H, cornerY, P);
      const front = fronts.current[leaf];
      const back = backs.current[leaf];
      const inner = backInners.current[leaf];
      if (!front || !back || !inner) return;
      if (!g) {
        front.style.clipPath = 'none';
        back.style.visibility = 'hidden';
        return;
      }
      front.style.clipPath = g.frontClip;
      back.style.visibility = 'visible';
      back.style.transform = g.backMatrix;
      inner.style.clipPath = g.backClip;
      const shade = Math.sin(g.progress * Math.PI);
      if (frontBand.current) {
        frontBand.current.style.transform = bandTransform(g.frontFold, BAND);
        frontBand.current.style.opacity = String(0.25 + shade * 0.5);
      }
      if (backBand.current) {
        backBand.current.style.transform = bandTransform(g.backFold, BAND);
        backBand.current.style.opacity = String(0.4 + shade * 0.6);
      }
      if (underBand.current) {
        underBand.current.style.transform = bandTransform(g.underFold, BAND);
        underBand.current.style.opacity = String(0.3 + shade * 0.7);
      }
    },
    [W, H]
  );

  const stopAnim = () => {
    if (anim.current !== null) cancelAnimationFrame(anim.current);
    anim.current = null;
  };

  /** P'yi `from`'dan `to`'ya kavisli bir yolla götürür. */
  const tween = useCallback(
    (leaf: number, cornerY: number, from: Vec, to: Vec, ms: number, lift: number, done: () => void) => {
      stopAnim();
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / ms);
        const k = easeInOut(t);
        const up = Math.sin(Math.PI * k) * lift * (cornerY === 0 ? 1 : -1);
        paint(leaf, cornerY, { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k + up });
        if (t < 1) anim.current = requestAnimationFrame(step);
        else {
          anim.current = null;
          done();
        }
      };
      anim.current = requestAnimationFrame(step);
    },
    [paint]
  );

  /** Bir yaprağı ileri (1) ya da geri (-1) çevirir; `fromP` sürüklemeden devralınır. */
  const flip = useCallback(
    (dir: 1 | -1, opts?: { cornerY?: number; fromP?: Vec; complete?: boolean }) => {
      const leaf = dir === 1 ? turned : turned - 1;
      if (leaf < 0 || leaf >= N) return;
      const complete = opts?.complete ?? true;
      if (reduced) {
        if (complete) setTurned((t) => t + dir);
        setDrag(null);
        return;
      }
      const cornerY = opts?.cornerY ?? H;
      const start = opts?.fromP ?? { x: dir === 1 ? W : -W, y: cornerY };
      const end = (dir === 1) === complete ? { x: -W, y: cornerY } : { x: W, y: cornerY };
      setDrag({ leaf, dir, cornerY });
      const distance = Math.abs(end.x - start.x) / (2 * W);
      requestAnimationFrame(() =>
        tween(leaf, cornerY, start, end, 520 + 620 * distance, opts?.fromP ? 0 : H * 0.12, () => {
          if (complete) setTurned((t) => t + dir);
          setDrag(null);
        })
      );
    },
    [turned, N, reduced, H, W, tween]
  );

  const next = useCallback(() => !busy && turned < N && flip(1), [busy, turned, N, flip]);
  const prev = useCallback(() => !busy && turned > 0 && flip(-1), [busy, turned, flip]);

  // Kapak kendiliğinden açılır: açılışın "vay" anı.
  useEffect(() => {
    if (!autoOpen || interacted) return;
    const timer = window.setTimeout(() => {
      if (turned === 0) flip(1);
    }, 1500);
    return () => window.clearTimeout(timer);
    // Yalnızca ilk açılışta: bağımlılıklar bilerek dar.
  }, [autoOpen]);

  // Boşta kalınca köşe hafifçe kalkar: "beni çevir".
  useEffect(() => {
    if (reduced || busy || turned >= N || turned === 0) return;
    const timer = window.setInterval(() => {
      if (pointer.current || anim.current !== null) return;
      const leaf = turned;
      hinting.current = true;
      setDrag({ leaf, dir: 1, cornerY: H });
      requestAnimationFrame(() =>
        tween(leaf, H, { x: W, y: H }, { x: W * 0.82, y: H * 0.9 }, 520, 0, () =>
          tween(leaf, H, { x: W * 0.82, y: H * 0.9 }, { x: W, y: H }, 520, 0, () => {
            hinting.current = false;
            setDrag(null);
          })
        )
      );
    }, 6000);
    return () => window.clearInterval(timer);
  }, [reduced, busy, turned, N, H, W, tween]);

  useEffect(() => () => stopAnim(), []);

  // ——— İşaretçi: yatay sürükleme çevirir, dikey sürükleme sayfa içinde kaydırır ———
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    // Köşe ipucu oynarken dokunan misafir beklemez: ipucu kesilir.
    if (hinting.current) {
      stopAnim();
      hinting.current = false;
      setDrag(null);
    } else if (busy) return;
    if ((e.target as HTMLElement).closest('input, textarea, select, button, a, label, [data-no-flip]')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const localY = e.clientY - rect.top - (rect.height - H) / 2;
    pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, started: false, dir: 0, cornerY: localY < H / 2 ? 0 : H };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    const dx = (e.clientX - p.x) * sx;
    const dy = e.clientY - p.y;
    if (!p.started) {
      if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy)) return;
      const dir = dx < 0 ? 1 : -1;
      if ((dir === 1 && turned >= N) || (dir === -1 && turned <= 0)) return;
      p.started = true;
      p.dir = dir;
      setInteracted(true);
      stopAnim();
      e.currentTarget.setPointerCapture(e.pointerId);
      setDrag({ leaf: dir === 1 ? turned : turned - 1, dir, cornerY: p.cornerY });
    }
    const leaf = p.dir === 1 ? turned : turned - 1;
    const baseX = p.dir === 1 ? W : -W;
    paint(leaf, p.cornerY, { x: baseX + dx * 1.3, y: p.cornerY + dy * 0.45 });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const p = pointer.current;
    pointer.current = null;
    if (!p || p.id !== e.pointerId) return;
    const dx = (e.clientX - p.x) * sx;
    const dy = e.clientY - p.y;
    if (p.started && p.dir !== 0) {
      const from = { x: (p.dir === 1 ? W : -W) + dx * 1.3, y: p.cornerY + dy * 0.45 };
      const complete = p.dir === 1 ? from.x < W * 0.45 : from.x > -W * 0.45;
      flip(p.dir, { cornerY: p.cornerY, fromP: from, complete });
      return;
    }
    // Dokunma: dış kenar şeridi çevirir; içerik (form, bağlantı) hiç etkilenmez.
    if (Math.abs(dx) < 6 && Math.abs(dy) < 6) {
      const rect = e.currentTarget.getBoundingClientRect();
      const bookLeft = rect.left + (rect.width - W) / 2 + offsetX * sx;
      const raw = e.clientX - bookLeft;
      const x = rtl ? W - raw : raw;
      if (x > W * 0.8 && x <= W + 4) {
        setInteracted(true);
        next();
      } else if ((spread && x < 0) || (!spread && x < W * 0.12)) {
        setInteracted(true);
        prev();
      }
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    let el = e.target as HTMLElement | null;
    while (el && el !== e.currentTarget) {
      if (el.scrollHeight > el.clientHeight + 2 && /auto|scroll/.test(getComputedStyle(el).overflowY)) {
        const atEnd = e.deltaY > 0 ? el.scrollTop + el.clientHeight >= el.scrollHeight - 2 : el.scrollTop <= 0;
        if (!atEnd) return;
        break;
      }
      el = el.parentElement;
    }
    const now = performance.now();
    if (now < wheel.current.lock || busy) return;
    wheel.current.acc += e.deltaY + e.deltaX;
    if (Math.abs(wheel.current.acc) > 70) {
      setInteracted(true);
      if (wheel.current.acc > 0) next();
      else prev();
      wheel.current = { acc: 0, lock: now + 900 };
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest('input, textarea, select')) return;
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === forward || e.key === 'PageDown') {
      e.preventDefault();
      setInteracted(true);
      next();
    } else if (e.key === backward || e.key === 'PageUp') {
      e.preventDefault();
      setInteracted(true);
      prev();
    }
  };

  return (
    <MirrorContext.Provider value={rtl}>
    <div
      ref={stageRef}
      tabIndex={0}
      role="group"
      aria-roledescription="kitap"
      aria-label={`${leaves[Math.min(turned, N - 1)]?.label ?? ''} — sayfa ${Math.min(turned + 1, N)} / ${N}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (pointer.current = null)}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      dir="ltr"
      className="absolute inset-0 overflow-hidden select-none outline-none [touch-action:pan-y] focus-visible:ring-2 focus-visible:ring-[#C9A35C]/60"
    >
      <div
        className="absolute left-1/2 top-1/2 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: W, height: H, marginLeft: -W / 2, marginTop: -H / 2 - 18, transform: `translateX(${offsetX * sx}px)${rtl ? ' scaleX(-1)' : ''}` }}
      >
        {/* Kitap gölgesi ve sayfa kenarları (yığın kalınlığı) */}
        <div className="absolute inset-0 rounded-r-[6px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]" />
        {turned < N && (
          <div
            className="absolute top-[3px] bottom-[3px] -right-[5px] w-[6px] rounded-r-[3px] bg-[repeating-linear-gradient(90deg,#E9DFC6_0px,#E9DFC6_1px,#CFC2A3_1.5px)]"
            style={{ opacity: Math.min(1, (N - turned) / 3) }}
          />
        )}
        {spread && turned > 0 && (
          <div
            className="absolute top-[3px] bottom-[3px] w-[6px] rounded-l-[3px] bg-[repeating-linear-gradient(90deg,#CFC2A3_0px,#E9DFC6_0.5px,#E9DFC6_1.5px)]"
            style={{ left: -W - 5, opacity: Math.min(1, turned / 3) }}
          />
        )}

        {/* Alttaki sayfaya düşen gölge (yalnızca kıvrım sırasında) */}
        <div ref={underWrap} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: drag ? 2 * N : -1, display: drag ? 'block' : 'none' }}>
          <div
            ref={underBand}
            className="absolute left-0 top-0 origin-top-left h-[90px] bg-gradient-to-b from-black/35 to-transparent"
            style={{ width: BAND }}
          />
        </div>

        {leaves.map((leaf, i) => {
          const isDrag = drag?.leaf === i;
          const isTurned = i < turned;
          // Yalnızca yakın yapraklar çizilir; ötekiler DOM'da kalır ama görünmez.
          const near = isDrag || (isTurned ? i >= turned - 2 : i <= turned + 1);
          const z = isDrag ? 2 * N + 1 : isTurned ? i + 1 : N - i + N;
          const showFront = isDrag || !isTurned;
          const showBack = isDrag ? true : isTurned && spread;
          return (
            <div
              key={leaf.key}
              className="absolute inset-0"
              style={{ zIndex: z, visibility: near ? 'visible' : 'hidden' }}
              aria-hidden={i !== turned || undefined}
              inert={i !== turned && !(spread && i === turned - 1) ? true : undefined}
            >
              <div
                ref={(el) => {
                  fronts.current[i] = el;
                }}
                className="absolute inset-0"
                style={{ visibility: showFront ? 'visible' : 'hidden', clipPath: isDrag ? undefined : 'none' }}
              >
                {leaf.front}
                {isDrag && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                      ref={frontBand}
                      className="absolute left-0 top-0 origin-top-left h-[46px] bg-gradient-to-b from-black/25 to-transparent"
                      style={{ width: BAND }}
                    />
                  </div>
                )}
              </div>
              <div
                ref={(el) => {
                  backs.current[i] = el;
                }}
                className="absolute left-0 top-0 origin-top-left [filter:drop-shadow(-6px_4px_10px_rgba(0,0,0,0.28))]"
                style={{
                  width: W,
                  height: H,
                  visibility: showBack ? 'visible' : 'hidden',
                  transform: isDrag ? undefined : `translateX(${-W}px)`
                }}
              >
                <div
                  ref={(el) => {
                    backInners.current[i] = el;
                  }}
                  className="absolute inset-0"
                  style={{ clipPath: isDrag ? undefined : 'none' }}
                >
                  {leaf.back}
                  {isDrag && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div
                        ref={backBand}
                        className="absolute left-0 top-0 origin-top-left h-[70px] bg-gradient-to-b from-[#5E4A2E]/30 via-white/25 to-transparent"
                        style={{ width: BAND }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gezinme: büyük dokunma hedefleri, sayfa göstergesi */}
      <div className={`absolute bottom-3 inset-x-0 flex items-center justify-center gap-4 text-[#F2EAD3] ${rtl ? 'flex-row-reverse' : ''}`}>
        <button
          type="button"
          onClick={() => {
            setInteracted(true);
            prev();
          }}
          disabled={turned === 0}
          aria-label="Önceki sayfa"
          className="w-11 h-11 rounded-full grid place-items-center bg-black/25 hover:bg-black/40 disabled:opacity-30 transition-colors"
        >
          {rtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <span className="min-w-[4.5rem] text-center text-[11px] tracking-[0.25em] uppercase tabular-nums" aria-live="polite">
          {turned === 0 ? 'Kapak' : turned >= N ? 'Arka kapak' : `${turned} / ${N - 1}`}
        </span>
        <button
          type="button"
          onClick={() => {
            setInteracted(true);
            next();
          }}
          disabled={turned >= N}
          aria-label="Sonraki sayfa"
          className="w-11 h-11 rounded-full grid place-items-center bg-black/25 hover:bg-black/40 disabled:opacity-30 transition-colors"
        >
          {rtl ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </div>
    </MirrorContext.Provider>
  );
}
