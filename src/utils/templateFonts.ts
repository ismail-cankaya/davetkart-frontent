/** SEC-12: every template family's @font-face, self-hosted (generated from fontsource packages). */
export const TEMPLATE_FONTS_HREF = '/fonts/templates.css';

const LINK_ID = 'dk-template-fonts';
let loaded: Promise<void> | null = null;

/**
 * Adds the template stylesheet once. Font files download only when a family is
 * used. Resolves on load or error (fallback fonts render); no-op on the server.
 */
export function loadTemplateFonts(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  if (loaded) return loaded;
  loaded = new Promise<void>((resolve) => {
    const link = document.createElement('link');
    link.id = LINK_ID;
    link.rel = 'stylesheet';
    link.href = TEMPLATE_FONTS_HREF;
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });
  return loaded;
}
