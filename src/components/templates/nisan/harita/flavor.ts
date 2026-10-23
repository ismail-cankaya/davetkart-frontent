import type { TemplateFlavor } from '../../shared/flavor';
import { NISAN_FLAVOR } from '../flavors';

/**
 * Nişanın harita preset'lerinin flavor'ı: kategori flavor'ının kopyası, bölüm
 * başlıkları haritanın diliyle (HARITA-KONSEPTI §4.2). Programın üst etiketi
 * kategorinin sözü: "Rotamız belli" (§7). Hediye başlığı kategorinindir.
 * Kategori deseni kapalı: arkada harita durur.
 */
export const NISAN_HARITA_FLAVOR: TemplateFlavor = {
  ...NISAN_FLAVOR,
  BackgroundPattern: undefined,
  headings: {
    ...NISAN_FLAVOR.headings,
    timeline: 'Duraklar',
    details: 'Varış',
    gallery: 'Yol üstünden',
    rsvp: 'Rotaya katılın'
  },
  eyebrows: { timeline: 'Rotamız belli' }
};
