import type { Nokta } from './rotaGeometri';

/**
 * Kapakta rotanın nereden geçeceği. Kartuş ve lejant serbest yerleşir ve
 * boyları veriye göre değişir (uzun ad, kapalı program); rota bu yüzden
 * sabit bir çizim değildir: ikisinin ölçülen kutusundan, aralarındaki boş
 * alanda kurulur. İğne her zaman boş alanda kalır, etiketi kutulara binmez.
 */

export interface Kutu {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * - `capraz`: kartuş sol üstte, lejant sağ altta (her genişlikte).
 * - `ayna`: dar ekranda kartuş sol üst, lejant sol alt; geniş ekranda kartuş
 *   sol alt (klasik başlık bloğu), lejant sağ üst.
 */
export type Duzen = 'capraz' | 'ayna';

export interface RotaPlani {
  /** Rotanın geçtiği ara noktalar; ilki kartuşun kenarı, sonuncusu iğnenin ucu. */
  noktalar: Nokta[];
  igne: Nokta;
  etiket: { yon: 'sag' | 'sol'; genislik: number };
}

/** Yatay kadraj mı? Kartuş ile lejant karşı köşelere ancak o zaman ayrılır. */
export function genisMi(w: number, h: number): boolean {
  return w >= 880 && w >= h * 1.05;
}

const ETIKET_ARASI = 22;
const KENAR = 16;
const ETIKET_EN_COK = 220;

export function rotaPlani({
  w,
  h,
  kartus: k,
  lejant: l,
  duzen,
  genis
}: {
  w: number;
  h: number;
  kartus: Kutu;
  lejant: Kutu | null;
  duzen: Duzen;
  genis: boolean;
}): RotaPlani {
  let noktalar: Nokta[];
  let yon: 'sag' | 'sol' = 'sag';

  // Her düzende son parça iğneye yukarıdan (ya da aşağıdan) iner: etiket
  // iğnenin yanında durur, rota onun altından geçmez. Dönüşler iki ara
  // noktaya yayılır; tek noktada keskin bir "V" oluşmaz.
  if (!genis) {
    // Alt alta: rota kartuşun altından çıkar, S çizerek lejantın üstüne iner.
    const ust = k.y + k.h + 8;
    const alt = (l ? l.y : h - 40) - 14;
    const boy = Math.max(80, alt - ust);
    if (duzen === 'capraz') {
      noktalar = [
        { x: k.x + Math.min(40, k.w * 0.15), y: k.y + k.h },
        { x: w * 0.58, y: ust + boy * 0.08 },
        { x: w * 0.8, y: ust + boy * 0.26 },
        { x: w * 0.74, y: ust + boy * 0.46 },
        { x: w * 0.32, y: ust + boy * 0.62 },
        { x: w * 0.24, y: alt }
      ];
    } else {
      yon = 'sol';
      noktalar = [
        { x: Math.min(k.x + k.w - 40, w * 0.62), y: k.y + k.h },
        { x: w * 0.42, y: ust + boy * 0.08 },
        { x: w * 0.2, y: ust + boy * 0.26 },
        { x: w * 0.26, y: ust + boy * 0.46 },
        { x: w * 0.68, y: ust + boy * 0.62 },
        { x: w * 0.76, y: alt }
      ];
    }
  } else if (duzen === 'capraz') {
    // Kartuş sol üst, lejant sağ alt: rota üstten sağa gider, kıvrılıp ortaya iner.
    const igneY = Math.min(h * 0.8, (l ? l.y + l.h : h) - 30);
    const igneX = Math.max(w * 0.46, k.x + k.w + 60);
    noktalar = [
      { x: k.x + k.w, y: k.y + k.h * 0.68 },
      { x: w * 0.6, y: Math.max(k.y + 30, h * 0.2) },
      { x: w * 0.76, y: h * 0.36 },
      { x: igneX + w * 0.01, y: h * 0.56 },
      { x: igneX, y: igneY }
    ];
  } else {
    // Kartuş sol alt, lejant sağ üst: aynı yolun dikey aynası; iğneye aşağıdan çıkar.
    const igneY = Math.max(h * 0.34, (l ? l.y : 0) + 90);
    const igneX = Math.max(w * 0.46, k.x + k.w + 60);
    noktalar = [
      { x: k.x + k.w, y: k.y + k.h * 0.32 },
      { x: w * 0.6, y: Math.min(k.y + k.h - 30, h * 0.8) },
      { x: w * 0.76, y: h * 0.64 },
      { x: igneX + w * 0.04, y: h * 0.47 },
      { x: igneX, y: igneY }
    ];
  }

  const igne = noktalar[noktalar.length - 1];
  const basY = igne.y - 31;

  // Etiketin yatay sınırı: kadraj kenarı ya da aynı yükseklikteki kutu.
  const ayniSirada = (b: Kutu | null) => b && basY + 24 > b.y && basY - 24 < b.y + b.h;
  let genislik: number;
  if (yon === 'sag') {
    let sinir = w - KENAR;
    for (const b of [k, l]) if (b && ayniSirada(b) && b.x > igne.x) sinir = Math.min(sinir, b.x - KENAR);
    genislik = sinir - (igne.x + ETIKET_ARASI);
  } else {
    let sinir = KENAR;
    for (const b of [k, l]) if (b && ayniSirada(b) && b.x + b.w < igne.x) sinir = Math.max(sinir, b.x + b.w + KENAR);
    genislik = igne.x - ETIKET_ARASI - sinir;
  }

  return { noktalar, igne, etiket: { yon, genislik: Math.max(0, Math.min(ETIKET_EN_COK, genislik)) } };
}

/** Durakların rota üzerindeki yeri (yay uzunluğu oranı): eşit aralık; son üçte birlik iğneye ve etiketine kalır. */
export function durakOranlari(adet: number): number[] {
  return Array.from({ length: adet }, (_, i) => 0.1 + ((i + 0.5) / adet) * 0.56);
}
