import type { TemplateFlavor } from '../../shared/flavor';
import { DOGUM_GUNU_FLAVOR } from '../flavors';

/**
 * Doğum gününün harita preset'lerinin flavor'ı: kategori flavor'ının kopyası,
 * bölüm başlıkları haritanın diliyle (HARITA-KONSEPTI §4.2). Hediye başlığı
 * kategorinindir ("Hediye Kutusu"). Kategori deseni kapalı: arkada harita durur.
 * Programın üst etiketi preset'e göre değişir (Hazine Avı kendi kopyasını yapar).
 */
export const DOGUM_GUNU_HARITA_FLAVOR: TemplateFlavor = {
  ...DOGUM_GUNU_FLAVOR,
  BackgroundPattern: undefined,
  headings: {
    ...DOGUM_GUNU_FLAVOR.headings,
    timeline: 'Duraklar',
    details: 'Varış',
    gallery: 'Yol üstünden',
    rsvp: 'Rotaya katılın'
  },
  eyebrows: { timeline: 'Kutlama rotası' }
};
