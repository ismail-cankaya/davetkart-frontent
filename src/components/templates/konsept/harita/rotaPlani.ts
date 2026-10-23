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
 * - `ayna`: kartuş sol altta (klasik başlık bloğu), lejant sağ üstte — dar
 *   ekranda da: lejant üstte, kartuş altta, rota aşağıdan tepeye tırmanır.
 * - `kenar`: kartuş ve lejant tek kenarda, üst üste (başlık bloğu): dar ekranda
 *   altta, genişte sağ sütunda; harita ve iğne kalan alanda.
 * - `kavsak`: rota İKİ kolla başlar ve bir kavşakta birleşir (iki ad varsa).
 *   Dar ekranda kartuş üst sol, lejant alt sol, iğne sağda; genişte kartuş
 *   ve lejant üst satırda karşı köşelerde, rota aşağıdaki araziye iner.
 */
export type Duzen = 'capraz' | 'ayna' | 'kenar' | 'kavsak';

export interface RotaPlani {
  /** Rotanın geçtiği ara noktalar; ilki kartuşun ALTINDA, sonuncusu iğnenin ucu. */
  noktalar: Nokta[];
  igne: Nokta;
  etiket: { yon: 'sag' | 'sol'; genislik: number };
  /** Rotanın başındaki, kartuşun altında kalan uzunluk (px). */
  gizli: number;
  /** İkinci kol (`kavsak`): kartuşun altından başlar, `noktalar[kavsak]`ta ana rotaya katılır. */
  kol?: Nokta[];
  /** Kolun katıldığı ana rota noktasının sırası; duraklar bu noktadan sonra dizilir. */
  kavsak?: number;
}

/** Yatay kadraj mı? Kartuş ile lejant karşı köşelere ancak o zaman ayrılır. */
export function genisMi(w: number, h: number): boolean {
  return w >= 880 && w >= h * 1.05;
}

const ETIKET_ARASI = 22;
const KENAR = 16;
const ETIKET_EN_COK = 220;
/**
 * Rota kartuşun kenarından değil, GIZLI px içeriden başlar ve kenara dik çıkar:
 * kartuş (z-10, opak) başlangıcı örter. Font geç gelip kartuş biraz küçülse de
 * rota kenardan kopmaz (bkz. `planGecerli`).
 */
export const GIZLI = 20;
const CIKIS = 6;
/** İğne başının ucun ne kadar üstünde olduğu (Igne: uç 46, baş merkezi 15, r 11). */
const BAS_USTU = 31;
const BAS_YARICAP = 13;

export type Yon = 'asagi' | 'yukari' | 'saga' | 'sola';

/** Kenarın içinden kenara dik çıkan iki başlangıç noktası. */
export function cikis(kenar: Nokta, yon: Yon): Nokta[] {
  if (yon === 'asagi') return [{ x: kenar.x, y: kenar.y - GIZLI }, { x: kenar.x, y: kenar.y + CIKIS }];
  if (yon === 'yukari') return [{ x: kenar.x, y: kenar.y + GIZLI }, { x: kenar.x, y: kenar.y - CIKIS }];
  if (yon === 'sola') return [{ x: kenar.x + GIZLI, y: kenar.y }, { x: kenar.x - CIKIS, y: kenar.y }];
  return [{ x: kenar.x - GIZLI, y: kenar.y }, { x: kenar.x + CIKIS, y: kenar.y }];
}

export interface PlanGirdisi {
  w: number;
  h: number;
  kartus: Kutu;
  lejant: Kutu | null;
  duzen: Duzen;
  genis: boolean;
  /** `kavsak`: iki ad var mı? Yoksa ikinci kol çizilmez, rota tek koldur. */
  ikiKol?: boolean;
}

export function rotaPlani({ w, h, kartus: k, lejant: l, duzen, genis, ikiKol = true }: PlanGirdisi): RotaPlani {
  let noktalar: Nokta[];
  let yon: 'sag' | 'sol' = 'sag';
  let kol: Nokta[] | undefined;
  let kavsak: number | undefined;

  // Son parça iğneye dikey ya da yandan-aşağıdan yaklaşır: etiket iğne başı
  // hizasında, yanındadır; rota onun altından geçer, üstüne binmez. Dönüşler
  // iki ara noktaya yayılır; tek noktada keskin bir "V" oluşmaz.
  if (!genis && duzen === 'capraz') {
    // Kartuş üstte, lejant altta: rota kartuşun altından çıkar, S çizerek lejantın üstüne iner.
    const ust = k.y + k.h + 8;
    const alt = (l ? l.y : h - 40) - 14;
    const boy = Math.max(80, alt - ust);
    noktalar = [
      ...cikis({ x: k.x + Math.min(40, k.w * 0.15), y: k.y + k.h }, 'asagi'),
      { x: w * 0.58, y: ust + boy * 0.08 },
      { x: w * 0.8, y: ust + boy * 0.26 },
      { x: w * 0.74, y: ust + boy * 0.46 },
      { x: w * 0.32, y: ust + boy * 0.62 },
      { x: w * 0.24, y: alt }
    ];
  } else if (!genis && duzen === 'ayna') {
    // Lejant üstte, kartuş altta: patika kartuşun üst kenarından çıkar, sağda bir
    // kıvrımla tepeye tırmanır; iğne üstte, lejantın hemen altında; etiket sağında.
    const ust = (l ? l.y + l.h : 0) + 12;
    const alt = k.y - CIKIS;
    const igne = { x: w * 0.38, y: ust + BAS_USTU + BAS_YARICAP + 8 };
    const yukseklik = Math.max(60, alt - igne.y);
    noktalar = [
      ...cikis({ x: k.x + k.w * 0.2, y: k.y }, 'yukari'),
      { x: w * 0.72, y: alt - yukseklik * 0.25 },
      { x: w * 0.82, y: alt - yukseklik * 0.55 },
      { x: w * 0.6, y: alt - yukseklik * 0.85 },
      igne
    ];
  } else if (!genis && duzen === 'kenar') {
    // Kartuş ve lejant altta üst üste; harita üstte. Rota kartuşun üst kenarından
    // çıkar, solda kıvrılıp sağ üstteki iğneye alttan varır; etiket iğnenin solunda.
    yon = 'sol';
    const ust = 16;
    const alt = k.y - CIKIS;
    const igne = { x: w * 0.7, y: ust + BAS_USTU + BAS_YARICAP + 20 };
    const yukseklik = Math.max(60, alt - igne.y);
    noktalar = [
      ...cikis({ x: k.x + k.w * 0.16, y: k.y }, 'yukari'),
      { x: w * 0.24, y: alt - yukseklik * 0.5 },
      { x: w * 0.5, y: alt - yukseklik * 0.56 },
      { x: igne.x, y: igne.y + yukseklik * 0.42 },
      igne
    ];
  } else if (!genis) {
    // `kavsak`, dar: kartuş üst sol, lejant alt sol. İki kol kartuşun alt kenarının
    // iki ucundan çıkar, ortada birleşir; tek rota sağa kıvrılıp iğneye yukarıdan iner.
    yon = 'sol';
    const ust = k.y + k.h + 8;
    const alt = (l ? l.y : h - 40) - 14;
    const boy = Math.max(80, alt - ust);
    // Kavşak kartuşa yakın (bandın %26'sı, en çok 70 px): ortak yol uzun kalsın, duraklar ona sığsın.
    // Kavşak kartuşun ortasının biraz sağında; iki kol kartuşun iki ucundan ona iner.
    const birlesme = { x: k.x + k.w * 0.55, y: ust + Math.min(boy * 0.26, 70) };
    const solUc = k.x + k.w * 0.16;
    const sagUc = k.x + k.w * 0.84;
    noktalar = [
      ...cikis({ x: solUc, y: k.y + k.h }, 'asagi'),
      { x: solUc + (birlesme.x - solUc) * 0.45, y: ust + (birlesme.y - ust) * 0.62 },
      birlesme,
      { x: w * 0.64, y: birlesme.y + (alt - birlesme.y) * 0.3 },
      { x: w * 0.8, y: birlesme.y + (alt - birlesme.y) * 0.6 },
      { x: w * 0.8, y: alt }
    ];
    kavsak = 3;
    if (ikiKol)
      kol = [
        ...cikis({ x: sagUc, y: k.y + k.h }, 'asagi'),
        { x: sagUc - (sagUc - birlesme.x) * 0.45, y: ust + (birlesme.y - ust) * 0.62 },
        birlesme
      ];
  } else if (duzen === 'capraz') {
    // Kartuş sol üst, lejant sağ alt: rota üstten sağa gider, kıvrılıp ortaya iner.
    const igneY = Math.min(h * 0.8, (l ? l.y + l.h : h) - 30);
    const igneX = Math.max(w * 0.46, k.x + k.w + 60);
    noktalar = [
      ...cikis({ x: k.x + k.w, y: k.y + k.h * 0.68 }, 'saga'),
      { x: w * 0.6, y: Math.max(k.y + 30, h * 0.2) },
      { x: w * 0.76, y: h * 0.36 },
      { x: igneX + w * 0.01, y: h * 0.56 },
      { x: igneX, y: igneY }
    ];
  } else if (duzen === 'ayna') {
    // Kartuş sol alt, lejant sağ üst: aynı yolun dikey aynası; iğneye aşağıdan çıkar.
    const igneY = Math.max(h * 0.34, (l ? l.y : 0) + 90);
    const igneX = Math.max(w * 0.46, k.x + k.w + 60);
    noktalar = [
      ...cikis({ x: k.x + k.w, y: k.y + k.h * 0.32 }, 'saga'),
      { x: w * 0.6, y: Math.min(k.y + k.h - 30, h * 0.8) },
      { x: w * 0.76, y: h * 0.64 },
      { x: igneX + w * 0.04, y: h * 0.47 },
      { x: igneX, y: igneY }
    ];
  } else if (duzen === 'kenar') {
    // Kartuş + lejant sağ sütunda: rota kartuşun sol kenarından çıkar, haritanın
    // ortasında bir yay çizer, soldaki iğneye aşağıdan varır; etiket sağında.
    const igneX = Math.min(w * 0.3, k.x - 300);
    const igne = { x: Math.max(w * 0.16, igneX), y: h * 0.44 };
    const ey = k.y + k.h * 0.62;
    noktalar = [
      ...cikis({ x: k.x, y: ey }, 'sola'),
      { x: k.x - w * 0.08, y: Math.min(h * 0.8, ey + h * 0.12) },
      { x: w * 0.42, y: h * 0.8 },
      { x: igne.x + w * 0.02, y: h * 0.7 },
      { x: igne.x, y: igne.y + h * 0.14 },
      igne
    ];
  } else {
    // `kavsak`, geniş: kartuş sol üst, lejant sağ üst. Ana kol kartuşun alt
    // kenarından, ikinci kol sağ kenarından çıkar; kavşaktan sonra tek rota
    // lejantın altındaki araziye kıvrılır, iğneye aşağıdan varır.
    const kb = k.y + k.h;
    const asagi = h - kb;
    const birlesme = { x: Math.max(w * 0.42, k.x + k.w + 70), y: kb + asagi * 0.3 };
    const igne = { x: Math.max(w * 0.64, birlesme.x + 180), y: Math.max((l ? l.y + l.h : 0) + 110, h * 0.56) };
    noktalar = [
      ...cikis({ x: k.x + k.w * 0.3, y: kb }, 'asagi'),
      { x: k.x + k.w * 0.4, y: kb + asagi * 0.2 },
      { x: k.x + k.w * 0.78, y: birlesme.y + asagi * 0.05 },
      birlesme,
      { x: birlesme.x + w * 0.06, y: birlesme.y + (h - birlesme.y) * 0.5 },
      { x: (birlesme.x + igne.x) / 2 + w * 0.03, y: h - Math.min(70, asagi * 0.2) },
      { x: igne.x, y: igne.y + (h - igne.y) * 0.45 },
      igne
    ];
    kavsak = 4;
    if (ikiKol)
      kol = [
        ...cikis({ x: k.x + k.w, y: k.y + k.h * 0.56 }, 'saga'),
        { x: birlesme.x + w * 0.035, y: k.y + k.h * 0.8 },
        { x: birlesme.x + w * 0.02, y: (kb + birlesme.y) / 2 },
        birlesme
      ];
  }

  const igne = noktalar[noktalar.length - 1];
  const basY = igne.y - BAS_USTU;

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

  return {
    noktalar,
    igne,
    etiket: { yon, genislik: Math.max(0, Math.min(ETIKET_EN_COK, genislik)) },
    gizli: GIZLI,
    ...(kol ? { kol } : {}),
    ...(kavsak !== undefined ? { kavsak } : {})
  };
}

const kesisir = (a: Kutu, b: Kutu) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

/**
 * Daha önce kurulmuş bir plan yeni ölçüde hâlâ doğru mu? Kapak planı ilk
 * ölçümde sabitler (font geç gelince iğne yerinden oynamasın); kutular
 * değişince yalnızca plan bozulduysa yeniden kurar:
 *  - rotanın (ya da kolun) başı artık kartuşun altında değilse,
 *  - iğne ya da mekân etiketi bir kutunun altına girdiyse.
 *
 * `etiketYari`: etiketin baş hizasından yukarı/aşağı yarı yüksekliği (tek satır
 * 14, iki satır 26; üst etiketli mekân +9).
 */
export function planGecerli(
  plan: RotaPlani,
  { kartus: k, lejant: l, etiketYari }: { kartus: Kutu; lejant: Kutu | null; etiketYari: number }
): boolean {
  const altinda = (n: Nokta) => n.x >= k.x - 1 && n.x <= k.x + k.w + 1 && n.y >= k.y - 1 && n.y <= k.y + k.h + 1;
  if (!altinda(plan.noktalar[0]) || (plan.kol && !altinda(plan.kol[0]))) return false;
  const { igne, etiket } = plan;
  const igneKutu: Kutu = { x: igne.x - BAS_YARICAP, y: igne.y - BAS_USTU - BAS_YARICAP, w: BAS_YARICAP * 2, h: BAS_USTU + BAS_YARICAP };
  const etiketKutu: Kutu | null =
    etiket.genislik < 80
      ? null
      : {
          x: etiket.yon === 'sag' ? igne.x + ETIKET_ARASI : igne.x - ETIKET_ARASI - etiket.genislik,
          y: igne.y - BAS_USTU - etiketYari,
          w: etiket.genislik,
          h: etiketYari * 2
        };
  for (const b of [k, l]) {
    if (!b) continue;
    if (kesisir(igneKutu, b) || (etiketKutu && kesisir(etiketKutu, b))) return false;
  }
  return true;
}

/**
 * Durakların rota üzerindeki yeri (yay uzunluğu oranı): eşit aralık. Varsayılan
 * pencere %10–%66: son üçte birlik iğneye ve etiketine kalır. Kavşaklı rotada
 * pencere kavşaktan başlar (duraklar ortak yolda).
 */
export function durakOranlari(adet: number, bas = 0.1, son = 0.66): number[] {
  return Array.from({ length: adet }, (_, i) => bas + ((i + 0.5) / adet) * (son - bas));
}
