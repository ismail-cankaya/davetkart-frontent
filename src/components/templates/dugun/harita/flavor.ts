import type { TemplateFlavor } from '../../shared/flavor';
import { DUGUN_FLAVOR } from '../flavors';

/**
 * Düğünün harita preset'lerinin flavor'ı: kategori flavor'ının kopyası,
 * bölüm başlıkları haritanın diliyle (HARITA-KONSEPTI §4.2). Hediye başlığı
 * kategorininkidir. Kategori deseni kapalı: arkada harita durur.
 */
export const DUGUN_HARITA_FLAVOR: TemplateFlavor = {
  ...DUGUN_FLAVOR,
  BackgroundPattern: undefined,
  headings: {
    ...DUGUN_FLAVOR.headings,
    timeline: 'Duraklar',
    details: 'Varış',
    gallery: 'Yol üstünden',
    rsvp: 'Rotaya katılın'
  },
  eyebrows: { timeline: 'Günün rotası' }
};
