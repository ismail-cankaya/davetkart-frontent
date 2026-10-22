import { useMemo } from 'react';
import type { Invitation } from '../../../../types';
import { hasTimelineEventContent } from '../../../../utils/timelineEvents';
import type { TemplateFlavor } from '../../shared/flavor';
import { displayText, formatDateStr } from '../../utils';

export type BolumAdi = keyof TemplateFlavor['headings'];

/** Kompozisyonun bölümleri çizdiği sıra (InvitationComposition). */
const SIRA: readonly BolumAdi[] = ['timeline', 'details', 'gallery', 'gift', 'rsvp'];

/** Kitap dilinde bölüm adları; kategori bunları kendi kopyasında ezebilir. */
export const KITAP_BASLIKLARI: TemplateFlavor['headings'] = {
  // Program şimdilik ortak düzende; noktalı "içindekiler" satırları ortak
  // Timeline'da değişiklik ister (KITAP-KONSEPTI §4.2, öneri).
  timeline: 'İçindekiler',
  details: 'Yer ve Zaman',
  gallery: 'Resimli Sayfalar',
  gift: 'Armağan',
  rsvp: 'Cevabınız'
};

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
export const bolumEtiketi: EtiketBicimi = (sira) => `Bölüm ${romen(sira)}`;

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

const BOS_BASLIK: Partial<TemplateFlavor['headings']> = {};

/**
 * Kategori flavor'ının kitap kopyası: bölüm adları kitap dilinde, üst
 * etiketler açık bölümlerden numaralı. Kategori deseni kapatılır — sayfa
 * düz şamuadır. `basliklar` ve `bicim` çağıranın modül sabiti olmalı
 * (bağımlılık). `bicim` etiketin dilini verir: düğünde "Bölüm II", nişanda
 * (önsöz, henüz bölüm yok) "Önsöz · II".
 */
export function useKitapFlavor(
  temel: TemplateFlavor,
  invitation: Invitation,
  basliklar: Partial<TemplateFlavor['headings']> = BOS_BASLIK,
  bicim: EtiketBicimi = bolumEtiketi
): TemplateFlavor {
  // Liste her çizimde ucuzca hesaplanır; flavor yalnızca liste değişince yenilenir.
  const anahtar = cizilenBolumler(invitation).join(',');

  return useMemo(() => {
    const bolumler = anahtar ? (anahtar.split(',') as BolumAdi[]) : [];
    return {
      ...temel,
      BackgroundPattern: undefined,
      headings: { ...KITAP_BASLIKLARI, ...basliklar },
      eyebrows: { ...temel.eyebrows, ...bolumEtiketleri(bolumler, 2, bicim) }
    };
  }, [temel, anahtar, basliklar, bicim]);
}
