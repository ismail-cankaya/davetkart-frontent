import { useEffect } from 'react';

/**
 * Şablona özel Google yazı tipini yalnızca o şablon çizilince yükler.
 * `index.css`'e eklenseydi her sayfa (pano, editör) bu aileleri indirirdi;
 * premium şablonların her biri kendi chunk'ında kendi ailesini ister.
 *
 * `family`: css2 sorgu parçası, ör. `Marcellus` ya da `Bodoni+Moda:ital,wght@0,400..700;1,400..700`.
 * Aynı aile iki kez istenirse tek `<link>` kalır.
 */
export function useTemplateFont(family: string): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const id = `sablon-font-${family.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
    document.head.appendChild(link);
  }, [family]);
}
