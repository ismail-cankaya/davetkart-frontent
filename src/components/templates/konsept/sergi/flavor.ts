import { useMemo } from 'react';
import type { Invitation } from '../../../../types';
import { hasTimelineEventContent } from '../../../../utils/timelineEvents';
import type { TemplateFlavor } from '../../shared/flavor';
import { displayText, formatDateStr } from '../../utils';

/**
 * Kategoriye göre değişen sergi metinleri (Faz 24): metinlerin kendisi `invitationText/locales/tr.json`'da,
 * `scopes[kapsam]` altında; ortak sergi başlıkları `scopes.sergi`'de.
 */
export interface SergiMetinleri {
  /** Kategorinin sergi kapsamı (ör. `dugun-sergi`). */
  kapsam: string;
}

type Bolum = 'timeline' | 'details' | 'gallery' | 'gift' | 'rsvp';

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
    const salonlar: Record<string, string> = {};
    for (const [bolum, etiket] of Object.entries(eyebrows)) salonlar[`${bolum}.eyebrow`] = etiket;
    return {
      ...taban,
      BackgroundPattern: undefined,
      textScopes: [metinler.kapsam, 'sergi', ...(taban.textScopes ?? [])],
      textDefaults: { ...taban.textDefaults, ...salonlar }
    };
  }, [taban, gorunen, metinler.kapsam]);
}
