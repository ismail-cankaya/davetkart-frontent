import { useMemo } from 'react';
import type { Invitation } from '../../../../types';
import { hasTimelineEventContent } from '../../../../utils/timelineEvents';
import type { TemplateFlavor } from '../../shared/flavor';
import { displayText, formatDateStr } from '../../utils';
import { staticFixedText } from '../../../../invitationText/InvitationTextContext';

export type BolumAdi = 'timeline' | 'details' | 'gallery' | 'gift' | 'rsvp';

/** Kompozisyonun bölümleri çizdiği sıra (InvitationComposition). */
const SIRA: readonly BolumAdi[] = ['timeline', 'details', 'gallery', 'gift', 'rsvp'];

/**
 * Kitap dilinde bölüm adları ("İçindekiler", "Yer ve Zaman"…) Faz 24'ten beri
 * `invitationText/locales/tr.json` → `scopes.kitap`'ta; `useKitapFlavor` bu kapsamı ekler.
 */
export const KITAP_KAPSAMI = 'kitap';

const ROMEN: readonly [number, string][] = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I']
];

/** 1 → "I", 6 → "VI". Bölüm sayısı en çok altıdır (hero + beş bölüm). */
export function romen(n: number): string {
  let kalan = Math.max(1, Math.floor(n));
  let sonuc = '';
  for (const [deger, harf] of ROMEN) {
    while (kalan >= deger) {
      sonuc += harf;
      kalan -= deger;
    }
  }
  return sonuc;
}

/**
 * Davetiyede gerçekten çizilecek bölümler, sırasıyla. Bayrak açık ama içi boş
 * bölüm (dolu adımı olmayan program, fotoğrafsız galeri, tarihi/mekânı/haritası
 * olmayan detay) ortak bileşende kendini gizler; burada da sayılmaz — yoksa
 * numara atlardı.
 */
export function cizilenBolumler(invitation: Invitation): BolumAdi[] {
  const gorunur: Record<BolumAdi, boolean> = {
    timeline: invitation.showTimeline && (invitation.timelineEvents ?? []).some(hasTimelineEventContent),
    details: Boolean(formatDateStr(invitation.date) || displayText(invitation.venue) || displayText(invitation.mapUrl)),
    gallery: invitation.showGallery && invitation.galleryImages.length > 0,
    gift: invitation.showGift,
    rsvp: invitation.showRSVP
  };
  return SIRA.filter((ad) => gorunur[ad]);
}

/** Sıra numarasından üst etiket: "Bölüm II". Kategori kendi biçimini verebilir. */
export type EtiketBicimi = (sira: number) => string;

/** Varsayılan: kitap bölümleri ("Bölüm II"). */
export const bolumEtiketi: EtiketBicimi = (sira) => staticFixedText('design.kitap.bolum').replace('{n}', romen(sira));

/**
 * Bölüm etiketleri: hero I. bölümdür, ilk çizilen bölüm II'den başlar.
 * Kapalı bölüm numara atlatmaz.
 */
export function bolumEtiketleri(
  bolumler: readonly BolumAdi[],
  ilk = 2,
  bicim: EtiketBicimi = bolumEtiketi
): Partial<Record<BolumAdi, string>> {
  const etiketler: Partial<Record<BolumAdi, string>> = {};
  bolumler.forEach((ad, i) => {
    etiketler[ad] = bicim(ilk + i);
  });
  return etiketler;
}

/**
 * Kategori flavor'ının kitap kopyası: bölüm adları kitap dilinde (`scopes.kitap`), üst
 * etiketler açık bölümlerden numaralı. Kategori deseni kapatılır — sayfa
 * düz şamuadır. `bicim` çağıranın modül sabiti olmalı (bağımlılık) ve etiketin
 * dilini verir: düğünde "Bölüm II", nişanda (önsöz, henüz bölüm yok) "Önsöz · II".
 */
export function useKitapFlavor(
  temel: TemplateFlavor,
  invitation: Invitation,
  bicim: EtiketBicimi = bolumEtiketi
): TemplateFlavor {
  // Liste her çizimde ucuzca hesaplanır; flavor yalnızca liste değişince yenilenir.
  const anahtar = cizilenBolumler(invitation).join(',');

  return useMemo(() => {
    const bolumler = anahtar ? (anahtar.split(',') as BolumAdi[]) : [];
    const etiketler: Record<string, string> = {};
    for (const [ad, etiket] of Object.entries(bolumEtiketleri(bolumler, 2, bicim))) {
      if (etiket) etiketler[`${ad}.eyebrow`] = etiket;
    }
    return {
      ...temel,
      BackgroundPattern: undefined,
      textScopes: [...(temel.textScopes ?? []).slice(0, 1), KITAP_KAPSAMI, ...(temel.textScopes ?? []).slice(1)],
      textDefaults: { ...temel.textDefaults, ...etiketler }
    };
  }, [temel, anahtar, bicim]);
}
