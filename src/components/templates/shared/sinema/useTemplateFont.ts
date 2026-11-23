import { useEffect } from 'react';
import { loadTemplateFonts } from '../../../../utils/templateFonts';

/**
 * Şablonun yazı tiplerini yalnızca o şablon çizilince yükler: yerel
 * `/fonts/templates.css` (SEC-12; Google'a istek yok). `verify:fonts` her
 * `family` ailesinin orada tanımlı olduğunu denetler.
 */
export function useTemplateFont(family: string): void {
  useEffect(() => {
    void loadTemplateFonts();
  }, [family]);
}
