import type { Nokta } from './rotaGeometri';
import { cikis, GIZLI, type Kutu } from './rotaPlani';

/**
 * `IzKapak`'ın rotası. `HaritaKapak`'ta duraklar rotanın üstüne eşit aralıkla
 * dizilir; burada tersi: duraklar sayfada gerçek metin kutularıdır (program
 * adımları) ve rota onların ölçülen rozetlerinden geçer. Rota kutuların
 * altında kalır (z-0); görünen parçalar kutudan kutuya uzanır.
 *
 * - `hazine`: kartuştan çıkan kesik çizgi, sağlı sollu dizilmiş durakların
 *   rozetlerinden zikzakla geçer, X'te biter. Aralık uzunsa araya bir kıvrım
 *   noktası girer (yön her seferinde değişir): patika düz inmez.
 * - `hat`: duraklar dikey bir hattın istasyonlarıdır; rota başlangıç
 *   halkasından istasyonlara, oradan iğnenin ucuna dümdüz iner. Genişte
 *   kartuş solda, hat sağdadır: rota kartuştan çıkıp haritayı geçer, hatta katılır.
 */
export type IzDuzeni = 'hazine' | 'hat';

/** Kapağın içinde `data-iz` ile işaretli bir çapa: hattın başı, bir durağın rozeti ya da hedef. */
export interface Capa {
  tur: 'bas' | 'durak' | 'hedef';
  n: Nokta;
}

export interface IzGirdisi {
  duzen: IzDuzeni;
  genis: boolean;
  w: number;
  h: number;
  kartus: Kutu;
  capalar: Capa[];
}

export interface IzPlani {
  noktalar: Nokta[];
  /** Rotanın başında kartuşun altında kalan uzunluk (px); hat dar düzende 0. */
  gizli: number;
  /** Hattın başlangıç halkası (`hat`): dar ekranda rotanın ilk noktası, genişte kolun hatta katıldığı yer. */
  halka?: Nokta;
}

/** İki çapa bu kadar uzaksa araya kıvrım girer (px). */
const KIVRIM_ESIGI = 150;
const KENAR = 24;

export function izPlani({ duzen, genis, w, kartus: k, capalar }: IzGirdisi): IzPlani | null {
  const hedef = capalar.find((c) => c.tur === 'hedef')?.n;
  if (!hedef) return null;
  const bas = capalar.find((c) => c.tur === 'bas')?.n;
  const duraklar = capalar.filter((c) => c.tur === 'durak').map((c) => c.n);

  if (duzen === 'hat') {
    const govde = [bas ?? { x: hedef.x, y: k.y + 28 }, ...duraklar, hedef];
    if (!genis) return { noktalar: govde, gizli: 0, halka: govde[0] };
    // Kartuş solda: rota sağ kenarından çıkar, haritada hafifçe sarkar, hattın
    // başına soldan katılır. Katılma noktasındaki dönüşü başlangıç halkası örter.
    const y0 = k.y + Math.min(64, k.h * 0.3);
    const [gizliUc, kenar] = cikis({ x: k.x + k.w, y: y0 }, 'saga');
    const ilk = govde[0];
    return {
      noktalar: [
        gizliUc,
        kenar,
        { x: kenar.x + (ilk.x - kenar.x) * 0.5, y: Math.max(y0, ilk.y) + 34 },
        { x: ilk.x - 30, y: ilk.y + 4 },
        ...govde
      ],
      gizli: GIZLI,
      halka: ilk
    };
  }

  // Hazine: dar ekranda kartuş üstte, rota alt kenarının ortasından iner;
  // genişte kartuş sağ üstte, rota sol kenarından zikzak sütununa geçer.
  const giris = genis ? cikis({ x: k.x, y: k.y + k.h * 0.32 }, 'sola') : cikis({ x: k.x + k.w / 2, y: k.y + k.h }, 'asagi');
  const noktalar: Nokta[] = [...giris];
  let yon = genis ? -1 : 1;
  for (const b of [...duraklar, hedef]) {
    const a = noktalar[noktalar.length - 1];
    const uzunluk = Math.hypot(b.x - a.x, b.y - a.y);
    if (uzunluk > KIVRIM_ESIGI) {
      // Kıvrım parçaya diktir (yatay parçada yukarı/aşağı, dikeyde sağa/sola):
      // patika kendi üstüne dönmez. Genlik parçanın %22'si, en çok 90 px.
      const genlik = Math.min(90, uzunluk * 0.22) * yon;
      const nx = -(b.y - a.y) / uzunluk;
      const ny = (b.x - a.x) / uzunluk;
      noktalar.push({
        x: Math.min(w - KENAR, Math.max(KENAR, (a.x + b.x) / 2 + nx * genlik)),
        y: (a.y + b.y) / 2 + ny * genlik
      });
      yon = -yon;
    }
    noktalar.push(b);
  }
  return { noktalar, gizli: GIZLI };
}
