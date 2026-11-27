import React from 'react';

/**
 * Category-specific personality injected into the shared sections by each
 * template (dugun/kina/nisan). Sections stay generic; flavor carries the
 * decorative ornament and WHERE the wording comes from (Faz 24: `textScopes`).
 */
export interface TemplateFlavor {
  categoryId: string;
  /** Wax-seal / hero ornament (inline SVG component). */
  Ornament: React.ComponentType<{ size?: number; className?: string }>;
  /** Background pattern specific to the category, rendered fixed behind sections. */
  BackgroundPattern?: React.ComponentType<{ className?: string }>;
  /**
   * Faz 24 (K302): metinler koddan çıktı, `src/invitationText/locales/tr.json`'da durur.
   * Kategori varsayılanı `categoryId`'den; şablona özel olanlar bu kapsamlardan (en özelden genele).
   */
  textScopes?: readonly string[];
  /** Çalışma anında hesaplanan varsayılanlar (ör. "Bölüm II"); anahtar → metin. Kapsamlardan önce gelir. */
  textDefaults?: Readonly<Record<string, string>>;
}
