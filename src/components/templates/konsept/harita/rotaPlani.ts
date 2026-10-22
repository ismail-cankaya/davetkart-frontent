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
 */
export type Duzen = 'capraz' | 'ayna';

export interface RotaPlani {
  /** Rotanın geçtiği ara noktalar; ilki kartuşun ALTINDA, sonuncusu iğnenin ucu. */
  noktalar: Nokta[];
  igne: Nokta;
  etiket: { yon: 'sag' | 'sol'; genislik: number };
  /** Rotanın başındaki, kartuşun altında kalan uzunluk (px). */
  gizli: number;
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
const GIZLI = 20;
const CIKIS = 6;
/** İğne başının ucun ne kadar üstünde olduğu (Igne: uç 46, baş merkezi 15, r 11). */
const BAS_USTU = 31;
const BAS_YARICAP = 13;

/** Kenarın içinden kenara dik çıkan iki başlangıç noktası. */
function cikis(kenar: Nokta, yon: 'asagi' | 'yukari' | 'saga'): Nokta[] {
  if (yon === 'asagi') return [{ x: kenar.x, y: kenar.y - GIZLI }, { x: kenar.x, y: kenar.y + CIKIS }];
  if (yon === 'yukari') return [{ x: kenar.x, y: kenar.y + GIZLI }, { x: kenar.x, y: kenar.y - CIKIS }];
  return [{ x: kenar.x - GIZLI, y: kenar.y }, { x: kenar.x + CIKIS, y: kenar.y }];
}

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
  } else if (!genis) {
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
  } else {
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

  return { noktalar, igne, etiket: { yon, genislik: Math.max(0, Math.min(ETIKET_EN_COK, genislik)) }, gizli: GIZLI };
}

const kesisir = (a: Kutu, b: Kutu) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

/**
 * Daha önce kurulmuş bir plan yeni ölçüde hâlâ doğru mu? Kapak planı ilk
 * ölçümde sabitler (font geç gelince iğne yerinden oynamasın); kutular
 * değişince yalnızca plan bozulduysa yeniden kurar:
 *  - rotanın başı artık kartuşun altında değilse (kartuş küçüldü, rota koptu),
 *  - iğne ya da mekân etiketi bir kutunun altına girdiyse.
 */
export function planGecerli(plan: RotaPlani, { kartus: k, lejant: l, genis }: { kartus: Kutu; lejant: Kutu | null; genis: boolean }): boolean {
  const bas = plan.noktalar[0];
  if (bas.x < k.x - 1 || bas.x > k.x + k.w + 1 || bas.y < k.y - 1 || bas.y > k.y + k.h + 1) return false;
  const { igne, etiket } = plan;
  const igneKutu: Kutu = { x: igne.x - BAS_YARICAP, y: igne.y - BAS_USTU - BAS_YARICAP, w: BAS_YARICAP * 2, h: BAS_USTU + BAS_YARICAP };
  const satir = genis ? 26 : 14;
  const etiketKutu: Kutu | null =
    etiket.genislik < 80
      ? null
      : {
          x: etiket.yon === 'sag' ? igne.x + ETIKET_ARASI : igne.x - ETIKET_ARASI - etiket.genislik,
          y: igne.y - BAS_USTU - satir,
          w: etiket.genislik,
          h: satir * 2
        };
  for (const b of [k, l]) {
    if (!b) continue;
    if (kesisir(igneKutu, b) || (etiketKutu && kesisir(etiketKutu, b))) return false;
  }
  return true;
}

/** Durakların rota üzerindeki yeri (yay uzunluğu oranı): eşit aralık; son üçte birlik iğneye ve etiketine kalır. */
export function durakOranlari(adet: number): number[] {
  return Array.from({ length: adet }, (_, i) => 0.1 + ((i + 0.5) / adet) * 0.56);
}
