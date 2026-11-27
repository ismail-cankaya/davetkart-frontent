/**
 * Ana sayfa vitrin sahnesinin telefonları (Faz 23). Görseller `scripts/showcase/capture.ts` ile üretilir;
 * şablon değişirse aynı komutla yeniden çekilir. Ayrıntı: docs/rehber/src/components/home/showcase.md
 */

/** Telefonun sahnedeki yeri. `start`/`end` yazım yönüne göre sol/sağdır (RTL'de yer değiştirir). */
export type ShowcaseRole = 'center' | 'start' | 'end';

export interface ShowcaseSlide {
  presetId: string;
  /** Tıklanınca önizlemeye aktarılan kategori; şablon birden çok kategoride olabilir. */
  categoryId: string;
  role: ShowcaseRole;
}

/** Sıra = odak sırası (klavye ve ekran okuyucu): önce orta telefon. */
export const SHOWCASE_SLIDES: readonly ShowcaseSlide[] = [
  { presetId: 'dugun-fener', categoryId: 'dugun', role: 'center' },
  { presetId: 'dugun-kelebek', categoryId: 'dugun', role: 'start' },
  { presetId: 'nisan-koi', categoryId: 'nisan', role: 'end' }
];

/** Çekim ölçüsü: 390 × 844 ekranın üç katı, 540 px genişliğe indirilmiş (capture.ts ile aynı). */
export const SHOWCASE_IMAGE = { width: 540, height: 3506 } as const;

export const showcaseImageUrl = (presetId: string): string => `/showcase/${presetId}.webp`;
