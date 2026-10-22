import { useMemo } from 'react';
import type { Invitation } from '../../../../types';
import { hasTimelineEventContent } from '../../../../utils/timelineEvents';
import type { TemplateFlavor } from '../../shared/flavor';
import { displayText, formatDateStr } from '../../utils';

/** Kategoriye göre değişen sergi metinleri; geri kalan başlıklar konseptindir (§4.2). */
export interface SergiMetinleri {
  /** Hediye bölümünün başlığı (ör. "Katkı"). */
  hediye: string;
  /** Hediye bölümünün açıklama cümlesi; bağış kutusu metaforu kullanılmaz. */
  hediyeNotu?: string;
  /**
   * Kategorinin dilindeki bölüm başlıkları (ör. nişanda "Önizleme akışı");
   * verilmeyenler konseptin başlıklarıdır. Modül düzeyinde sabit olmalı.
   */
  basliklar?: Partial<Omit<TemplateFlavor['headings'], 'gift'>>;
}

type Bolum = keyof TemplateFlavor['headings'];

/**
 * Bölümlerin görünüp görünmeyeceği — ortak bölümlerin kendi koşullarıyla
 * aynı (Timeline dolu adım, Details tarih/mekân/harita, Gallery görsel ister).
 */
function gorunenBolumler(invitation: Invitation): Bolum[] {
  const sira: [Bolum, boolean][] = [
    ['timeline', invitation.showTimeline && (invitation.timelineEvents ?? []).some(hasTimelineEventContent)],
    ['details', Boolean(formatDateStr(invitation.date) || displayText(invitation.venue) || displayText(invitation.mapUrl))],
    ['gallery', invitation.showGallery && invitation.galleryImages.length > 0],
    ['gift', invitation.showGift],
    ['rsvp', invitation.showRSVP]
  ];
  return sira.filter(([, gorunur]) => gorunur).map(([bolum]) => bolum);
}

/**
 * Kategori flavor'ının sergi kopyası. Bölüm başlıkları konseptin dilinde,
 * üst etiketler salon numarası: misafir sergiyi salon salon gezer. Numara
 * yalnızca görünen bölümleri sayar; modül kapanınca sıra kaymaz, boşluk kalmaz.
 *
 * Kategori deseni kapatılır: duvar düzdür.
 */
export function useSergiFlavor(taban: TemplateFlavor, invitation: Invitation, metinler: SergiMetinleri): TemplateFlavor {
  const gorunen = gorunenBolumler(invitation).join(',');
  return useMemo(() => {
    const eyebrows: Partial<Record<Bolum, string>> = {};
    gorunen
      .split(',')
      .filter(Boolean)
      .forEach((bolum, i) => {
        eyebrows[bolum as Bolum] = `Salon ${i + 1}`;
      });
    return {
      ...taban,
      BackgroundPattern: undefined,
      headings: {
        timeline: 'Açılış akışı',
        details: 'Ziyaret bilgileri',
        gallery: 'Eserler',
        rsvp: 'Açılış listesi',
        ...metinler.basliklar,
        gift: metinler.hediye
      },
      eyebrows,
      giftNote: metinler.hediyeNotu ?? taban.giftNote
    };
  }, [taban, gorunen, metinler.hediye, metinler.hediyeNotu, metinler.basliklar]);
}
