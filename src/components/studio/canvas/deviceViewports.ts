import type { PreviewDevice } from '../../../types';

/** Tuvalin cihaz başına gerçek görüntü alanı (CSS px). Şablon bu genişlikte çizilir, sonra sığdırılır (K320). */
export interface DeviceViewport {
  width: number;
  height: number;
  /** Çerçeve kalınlığı (px, ölçeklenmez). */
  bezel: number;
  /** Dış köşe yarıçapı (px). */
  radius: number;
}

export const DEVICE_VIEWPORTS: Record<PreviewDevice, DeviceViewport> = {
  phone: { width: 390, height: 844, bezel: 12, radius: 52 },
  tablet: { width: 820, height: 1180, bezel: 16, radius: 36 },
  laptop: { width: 1280, height: 800, bezel: 14, radius: 18 }
};

export const DEVICE_ORDER: readonly PreviewDevice[] = ['phone', 'tablet', 'laptop'];

/** Yakınlaştırma: `fit` alana sığdırır; sayı yüzde olarak sabit ölçek. */
export type CanvasZoom = 'fit' | number;

export const ZOOM_STEPS: readonly number[] = [25, 33, 50, 67, 75, 90, 100, 125, 150];

/**
 * Cihazın (çerçeve dahil) alana sığacağı ölçek. `fit` hiçbir zaman büyütmez (en çok 1);
 * sabit yüzde olduğu gibi kullanılır.
 */
export function canvasScale(viewport: DeviceViewport, area: { width: number; height: number }, zoom: CanvasZoom, padding = 24): number {
  if (zoom !== 'fit') return zoom / 100;
  const outerW = viewport.width + viewport.bezel * 2;
  const outerH = viewport.height + viewport.bezel * 2;
  const availW = Math.max(area.width - padding * 2, 50);
  const availH = Math.max(area.height - padding * 2, 50);
  return Math.min(1, availW / outerW, availH / outerH);
}
