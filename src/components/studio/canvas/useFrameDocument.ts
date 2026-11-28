import { useEffect, useState, type RefObject } from 'react';

/** Kopyalanan baş düğümleri: stiller ve yazı tipi bağlantıları. */
const STYLE_SELECTOR = 'style, link[rel="stylesheet"], link[rel="preload"][as="font"]';
const MIRRORED_HTML_ATTRIBUTES = ['lang', 'dir', 'class', 'style', 'data-theme'] as const;
const BASE_CSS = 'html,body{height:100%;margin:0;padding:0}body{overflow:hidden;background:transparent}';

function isStyleNode(node: Node): node is HTMLStyleElement | HTMLLinkElement {
  return node instanceof Element && node.matches(STYLE_SELECTOR);
}

/**
 * Aynı kaynaktaki boş iframe'in belgesini hazırlar (K320): ana belgenin stillerini ve `<html>` özniteliklerini kopyalar,
 * sonradan eklenenleri (tembel parça stilleri, şablon yazı tipleri, Vite HMR) izler, klavye kısayollarını ana pencereye
 * iletir. Hazır olunca `<body>`'yi döner.
 * Ayrıntı: docs/rehber/src/components/studio/canvas/useFrameDocument.md
 */
export function useFrameDocument(frameRef: RefObject<HTMLIFrameElement | null>): HTMLElement | null {
  const [body, setBody] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let cleanup: (() => void) | null = null;

    const setup = () => {
      const doc = frame.contentDocument;
      if (!doc || !doc.body) return;
      cleanup?.();

      const clones = new Map<Node, Node>();
      const base = doc.createElement('style');
      base.textContent = BASE_CSS;
      doc.head.appendChild(base);

      const cloneInto = (node: HTMLStyleElement | HTMLLinkElement) => {
        if (clones.has(node)) return;
        const copy = doc.importNode(node, true);
        clones.set(node, copy);
        doc.head.appendChild(copy);
      };
      document.head.querySelectorAll<HTMLStyleElement | HTMLLinkElement>(STYLE_SELECTOR).forEach(cloneInto);

      const mirrorHtml = () => {
        for (const name of MIRRORED_HTML_ATTRIBUTES) {
          const value = document.documentElement.getAttribute(name);
          if (value === null) doc.documentElement.removeAttribute(name);
          else doc.documentElement.setAttribute(name, value);
        }
      };
      mirrorHtml();

      const headObserver = new MutationObserver((records) => {
        for (const record of records) {
          record.addedNodes.forEach((node) => {
            if (isStyleNode(node)) cloneInto(node);
          });
          record.removedNodes.forEach((node) => {
            const copy = clones.get(node);
            if (copy) {
              copy.parentNode?.removeChild(copy);
              clones.delete(node);
            }
          });
          // HMR ve çalışma anı stilleri `<style>` içeriğini değiştirir.
          if (record.type === 'characterData' || (record.type === 'childList' && record.target instanceof HTMLStyleElement)) {
            const owner = record.target instanceof HTMLStyleElement ? record.target : record.target.parentNode;
            const copy = owner ? clones.get(owner) : undefined;
            if (owner instanceof HTMLStyleElement && copy) copy.textContent = owner.textContent;
          }
        }
      });
      headObserver.observe(document.head, { childList: true, subtree: true, characterData: true });
      const htmlObserver = new MutationObserver(mirrorHtml);
      htmlObserver.observe(document.documentElement, { attributes: true, attributeFilter: [...MIRRORED_HTML_ATTRIBUTES] });

      // Odak iframe'deyken klavye kısayolları (Ctrl+Z, Esc) ana pencereye ulaşmaz: yazı alanı dışındayken iletilir.
      const forwardKey = (event: KeyboardEvent) => {
        const target = event.target as Element | null;
        if (target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
        const copy = new KeyboardEvent('keydown', {
          key: event.key,
          code: event.code,
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
          bubbles: true,
          cancelable: true
        });
        // Gövdeden gönderilir: dinleyiciler hedefin `closest()`'ine bakar (pencerenin yok).
        if (!document.body.dispatchEvent(copy)) event.preventDefault();
      };
      doc.addEventListener('keydown', forwardKey);

      setBody(doc.body);
      cleanup = () => {
        headObserver.disconnect();
        htmlObserver.disconnect();
        doc.removeEventListener('keydown', forwardKey);
      };
    };

    // `srcdoc` belgesi `load` ile hazır olur (önceki `about:blank` belgesi atılır); etki geç kalırsa hemen kurulur.
    frame.addEventListener('load', setup);
    const current = frame.contentDocument;
    if (current?.URL === 'about:srcdoc' && current.readyState === 'complete') setup();
    return () => {
      frame.removeEventListener('load', setup);
      cleanup?.();
      setBody(null);
    };
  }, [frameRef]);

  return body;
}
