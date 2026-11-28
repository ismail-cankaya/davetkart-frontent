import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import type { PreviewDevice } from '../../../types';
import type { TextEditorBridge } from '../../../invitationText/InvitationTextContext';
import { cn } from '../../../utils/cn';
import { duration, ease } from '../../../utils/motion';
import { DEVICE_VIEWPORTS, canvasScale, type CanvasZoom } from './deviceViewports';
import { useFrameDocument } from './useFrameDocument';
import { findPick, type TextPick } from './textPicking';

type Rect = { top: number; left: number; bottom: number; right: number };

/** Editörde metne tıklayarak düzenleme (K321): eşleme dizini ve seçim. */
export interface CanvasPicker {
  index: ReadonlyMap<string, TextPick>;
  onPick: (pick: TextPick, anchor: Rect) => void;
}

const HOVER_ATTR = 'data-studio-pick';
const HOVER_CSS = `[${HOVER_ATTR}]{outline:1px dashed currentColor;outline-offset:3px;border-radius:3px;cursor:text}`;
const OVERFLOW_ATTR = 'data-studio-overflow';
const OVERFLOW_CSS = `[${OVERFLOW_ATTR}]{outline:2px solid #e11d48 !important;outline-offset:2px}`;

/** Metni kırpılan öğe (K325): kendi metni var, taşmayı gizliyor ve içeriği kutusundan büyük. */
function isClippedText(element: HTMLElement): boolean {
  const ownText = Array.from(element.childNodes).some((node) => node.nodeType === 3 && (node.textContent ?? '').trim() !== '');
  if (!ownText) return false;
  const style = element.ownerDocument.defaultView?.getComputedStyle(element);
  if (!style) return false;
  const clips =
    /hidden|clip/.test(style.overflowX + style.overflowY) || style.textOverflow === 'ellipsis' || (style.webkitLineClamp !== '' && style.webkitLineClamp !== 'none');
  return clips && (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1);
}

const FRAME_DOC = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body></body></html>';

interface DeviceCanvasProps {
  device: PreviewDevice;
  zoom: CanvasZoom;
  /** Editör köprüsü; tuval, tıklanan metnin konumunu iframe'den ana pencereye çevirir. */
  textEditor?: TextEditorBridge | null;
  /** Kullanıcı içeriği ve dize olarak çizilen şablon metinleri için tıklayarak seçme. */
  picker?: CanvasPicker | null;
  /** Taşan metin sayısı (K325); verilirse taşan metinler kırmızı çerçeveyle işaretlenir. */
  onOverflowChange?: (count: number) => void;
  /** Hesaplanan ölçek (araç çubuğundaki yüzde için). */
  onScaleChange?: (scale: number) => void;
  /** Ekran okuyucu için iframe başlığı. */
  title: string;
  /** Alt kenarda tuvalin üstünde duran araç çubuğunun yüksekliği (px): sığdırma onu hesaba katar. */
  insetBottom?: number;
  /** Çerçevesiz: içerik alanın kendisi kadar (telefonda stüdyo; tuval tam ekran, K319). */
  bare?: boolean;
  className?: string;
  /** İframe içinde çizilecek içerik; çevrilmiş köprüyü alır. */
  children: (textEditor: TextEditorBridge | null) => React.ReactNode;
}

/**
 * Tasarım stüdyosunun tuvali (K320): içerik aynı uygulamadaki bir iframe'e, cihazın gerçek genişliğinde çizilir ve
 * kullanılabilir alana sığacak şekilde ölçeklenir. Şablonların `md:`/`lg:` sınıfları böylece cihaza göre çalışır.
 * Ayrıntı: docs/rehber/src/components/studio/canvas/DeviceCanvas.md
 */
export function DeviceCanvas({
  device,
  zoom,
  textEditor = null,
  picker = null,
  onOverflowChange,
  onScaleChange,
  title,
  insetBottom = 0,
  bare = false,
  className,
  children
}: DeviceCanvasProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const body = useFrameDocument(frameRef);
  const [area, setArea] = useState({ width: 0, height: 0 });
  // Çerçevesiz kipte görüntü alanı tuvalin kendisidir (gerçek telefon genişliği); aksi halde cihazın sabit ölçüsü.
  const viewport = bare
    ? { width: Math.max(area.width, 320), height: Math.max(area.height - insetBottom, 320), bezel: 0, radius: 0 }
    : DEVICE_VIEWPORTS[device];

  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => setArea({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = area.width === 0 ? 0 : bare ? 1 : canvasScale(viewport, { width: area.width, height: area.height - insetBottom }, zoom);
  useEffect(() => {
    if (scale > 0) onScaleChange?.(scale);
  }, [scale, onScaleChange]);

  // Tıklanan metnin kutusu iframe'in görüntü alanına göredir; ana pencereye çevrilir (popover konumu).
  const toParent = useMemo(
    () =>
      (anchor: Rect): Rect => {
        const frame = frameRef.current;
        if (!frame) return anchor;
        const rect = frame.getBoundingClientRect();
        const k = rect.width / viewport.width || 1;
        return {
          top: rect.top + anchor.top * k,
          bottom: rect.top + anchor.bottom * k,
          left: rect.left + anchor.left * k,
          right: rect.left + anchor.right * k
        };
      },
    [viewport.width]
  );

  const framedEditor = useMemo<TextEditorBridge | null>(() => {
    if (!textEditor) return null;
    return { ...textEditor, select: (request) => textEditor.select({ ...request, anchor: toParent(request.anchor) }) };
  }, [textEditor, toParent]);

  // Metne tıklayarak seçme: yakalama evresinde (şablonun kendi tıklamasından önce), yalnızca eşleşen metinde.
  useEffect(() => {
    const doc = body?.ownerDocument;
    if (!doc || !picker) return;
    const style = doc.createElement('style');
    style.textContent = HOVER_CSS;
    doc.head.appendChild(style);
    let hovered: Element | null = null;
    const setHover = (element: Element | null) => {
      if (hovered === element) return;
      hovered?.removeAttribute(HOVER_ATTR);
      hovered = element;
      hovered?.setAttribute(HOVER_ATTR, '');
    };
    const onMove = (event: Event) => setHover(findPick(event.target as Element, picker.index)?.element ?? null);
    const onClick = (event: MouseEvent) => {
      const found = findPick(event.target as Element, picker.index);
      if (!found) return;
      event.preventDefault();
      event.stopPropagation();
      const r = found.element.getBoundingClientRect();
      picker.onPick(found.pick, toParent({ top: r.top, bottom: r.bottom, left: r.left, right: r.right }));
    };
    doc.addEventListener('pointerover', onMove);
    doc.addEventListener('click', onClick, true);
    return () => {
      setHover(null);
      style.remove();
      doc.removeEventListener('pointerover', onMove);
      doc.removeEventListener('click', onClick, true);
    };
  }, [body, picker, toParent]);

  // Taşma taraması: DOM ya da boyut değişince, yarım saniye sonra (animasyonlar sırasında her karede değil).
  useEffect(() => {
    const doc = body?.ownerDocument;
    if (!doc || !body || !onOverflowChange) return;
    const style = doc.createElement('style');
    style.textContent = OVERFLOW_CSS;
    doc.head.appendChild(style);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const scan = () => {
      let count = 0;
      body.querySelectorAll<HTMLElement>('*').forEach((element) => {
        const clipped = isClippedText(element);
        if (clipped) count += 1;
        if (clipped !== element.hasAttribute(OVERFLOW_ATTR)) element.toggleAttribute(OVERFLOW_ATTR, clipped);
      });
      onOverflowChange(count);
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(scan, 500);
    };
    const mutations = new MutationObserver(schedule);
    mutations.observe(body, { childList: true, subtree: true, characterData: true });
    const resize = new ResizeObserver(schedule);
    resize.observe(body);
    schedule();
    return () => {
      clearTimeout(timer);
      mutations.disconnect();
      resize.disconnect();
      style.remove();
      body.querySelectorAll(`[${OVERFLOW_ATTR}]`).forEach((element) => element.removeAttribute(OVERFLOW_ATTR));
    };
  }, [body, onOverflowChange]);

  const outerW = viewport.width + viewport.bezel * 2;
  const outerH = viewport.height + viewport.bezel * 2;

  return (
    <div ref={areaRef} data-lenis-prevent className={cn('relative h-full w-full overflow-auto', className)}>
      <div className={cn('flex min-h-full min-w-full items-center justify-center', !bare && 'p-6')} style={{ paddingBottom: bare ? insetBottom : 24 + insetBottom }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: scale > 0 ? 1 : 0, y: 0 }}
          transition={{ duration: duration.panel, ease: ease.out }}
          className="relative shrink-0 transition-[width,height] duration-500 ease-out"
          style={{ width: outerW * scale, height: outerH * scale }}
        >
          <div
            className="absolute left-0 top-0 origin-top-left transition-transform duration-500 ease-out"
            style={{ width: outerW, height: outerH, transform: `scale(${scale || 1})` }}
          >
            <div
              className="relative h-full w-full bg-[#0f1412] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.55),inset_0_0_0_1px_rgba(255,255,255,0.08)]"
              style={{ borderRadius: viewport.radius, padding: viewport.bezel }}
            >
              {device === 'phone' && !bare && (
                <span aria-hidden className="absolute left-1/2 top-[18px] z-10 h-[26px] w-[110px] -translate-x-1/2 rounded-full bg-black" />
              )}
              <iframe
                ref={frameRef}
                title={title}
                srcDoc={FRAME_DOC}
                className="block border-0 bg-white"
                style={{ width: viewport.width, height: viewport.height, borderRadius: bare ? 0 : Math.max(viewport.radius - viewport.bezel, 6) }}
              />
            </div>
          </div>
        </motion.div>
      </div>
      {body && createPortal(<div className="flex h-full w-full flex-col">{children(framedEditor)}</div>, body)}
    </div>
  );
}
