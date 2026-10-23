import React from 'react';
import { HARITA_RENK as R } from '../palet';
import { acikEgri, cizgiyeUzaklik, lekeIciNoktalar, lekeYolu, titrek, tohumlu, type Leke, type Nokta2 } from './cizim';

/**
 * Mahalle krokisi ekseni: birinin peçeteye çizdiği adres tarifi. Birkaç sokak
 * (titrek çift çizgi, içi beyaz), sıra sıra ev simgeleri, bir meydan ve
 * çeşmesi, küçük bir park. Tonlar: arazi, yol (sokak ve ev içi), park, rota;
 * mürekkep çizgileri en çok %50 (perde ölçümü, HaritaSahnesi).
 *
 * Tuval 1200 × 1500, `slice`: meydan ve iki ana yol her kadrajın görünen
 * çekirdeğindedir. Gerçek bir yer değildir; sokak adı yoktur.
 */

interface Sokak {
  noktalar: Nokta2[];
  genislik: number;
}

const SOKAKLAR: Sokak[] = [
  // Ana cadde: soldan sağa hafif inen.
  { noktalar: [[-40, 520], [300, 598], [600, 700], [900, 758], [1240, 800]], genislik: 44 },
  // Dik yol: meydandan geçer.
  { noktalar: [[548, -40], [566, 300], [600, 700], [612, 1080], [590, 1540]], genislik: 34 },
  { noktalar: [[608, 1060], [800, 1086], [1000, 1150], [1240, 1180]], genislik: 28 },
  { noktalar: [[-40, 1000], [250, 1012], [420, 1056], [608, 1066]], genislik: 28 },
  // Kıvrık sokak: caddeden yukarı, dik yola bağlanır.
  { noktalar: [[296, 596], [318, 430], [392, 280], [480, 196], [560, 176]], genislik: 26 },
  // Çıkmaz sokak.
  { noktalar: [[900, 758], [926, 580], [990, 450], [1060, 400]], genislik: 24 },
  { noktalar: [[244, 1012], [222, 1250], [262, 1540]], genislik: 24 },
  { noktalar: [[1000, 1150], [1030, 1340], [1010, 1540]], genislik: 24 }
];

const MEYDAN = { x: 600, y: 700, r: 66 };
const CIKMAZ_SONU = { x: 1066, y: 396, r: 22 };

const PARK: Leke = { cx: 790, cy: 420, rx: 118, ry: 92, aci: -10, tohum: 71, puruz: 0.14 };

/** Sokak kenarları: her sokağın iki yanı ayrı tohumla titrer. */
const KENARLAR = SOKAKLAR.flatMap((s, i) => [
  acikEgri(titrek(s.noktalar, 300 + i * 2, 1.8, 22, s.genislik / 2)),
  acikEgri(titrek(s.noktalar, 301 + i * 2, 1.8, 22, -s.genislik / 2))
]).join('');

/** Bir kırık çizgi boyunca `adim` px'te bir nokta + o noktadaki birim normal. */
function boyunca(noktalar: Nokta2[], adim: number): { n: Nokta2; nx: number; ny: number }[] {
  const sonuc: { n: Nokta2; nx: number; ny: number }[] = [];
  let kalan = adim / 2;
  for (let i = 0; i < noktalar.length - 1; i++) {
    const [ax, ay] = noktalar[i];
    const [bx, by] = noktalar[i + 1];
    const L = Math.hypot(bx - ax, by - ay) || 1;
    let s = kalan;
    while (s < L) {
      const t = s / L;
      sonuc.push({ n: [ax + (bx - ax) * t, ay + (by - ay) * t], nx: -(by - ay) / L, ny: (bx - ax) / L });
      s += adim;
    }
    kalan = s - L;
  }
  return sonuc;
}

/** Evler sokak boyunca iki yana dizilir; sokağa, meydana, parka ve birbirine binmez. */
function evleriYerlestir(): { evler: Nokta2[]; agaclar: Nokta2[] } {
  const r = tohumlu(91);
  const evler: Nokta2[] = [];
  const agaclar: Nokta2[] = [];
  const bos = (p: Nokta2, pay: number) =>
    SOKAKLAR.every((s) => cizgiyeUzaklik(p, s.noktalar) > s.genislik / 2 + pay) &&
    Math.hypot(p[0] - MEYDAN.x, p[1] - MEYDAN.y) > MEYDAN.r + pay + 6 &&
    ((p[0] - PARK.cx) / (PARK.rx + 30)) ** 2 + ((p[1] - PARK.cy) / (PARK.ry + 30)) ** 2 > 1 &&
    Math.hypot(p[0] - CIKMAZ_SONU.x, p[1] - CIKMAZ_SONU.y) > CIKMAZ_SONU.r + pay;
  for (const s of SOKAKLAR) {
    for (const { n, nx, ny } of boyunca(s.noktalar, 58)) {
      for (const yan of [1, -1]) {
        const uzak = s.genislik / 2 + 28 + r() * 8;
        const p: Nokta2 = [Math.round(n[0] + nx * uzak * yan), Math.round(n[1] + ny * uzak * yan)];
        if (p[0] < -20 || p[0] > 1220 || p[1] < -20 || p[1] > 1520) continue;
        if (!bos(p, 18)) continue;
        if (evler.some((e) => Math.hypot(e[0] - p[0], e[1] - p[1]) < 44)) continue;
        // Arada bir ev yerine ağaç: sıra düz bir duvar gibi okunmasın.
        if (r() < 0.16) agaclar.push(p);
        else evler.push(p);
      }
    }
  }
  return { evler, agaclar };
}

const { evler: EVLER, agaclar: SOKAK_AGACLARI } = evleriYerlestir();

/** Ev simgesi: dik duran beşgen (gövde 28 × 17, çatı 11); kroki geleneği, döndürülmez. */
const EVLER_YOLU = EVLER.map(([x, y]) => `M${x - 14} ${y + 10}V${y - 7}L${x} ${y - 18}L${x + 14} ${y - 7}V${y + 10}Z`).join('');
/** Kapılar: ev başına kısa bir dikey çizgi. */
const KAPILAR = EVLER.map(([x, y]) => `M${x} ${y + 10}v-7`).join('');

const PARK_YOLU = lekeYolu(PARK);
const AGACLAR = [...lekeIciNoktalar(PARK, 32), ...SOKAK_AGACLARI];
const AGAC_YOLU = AGACLAR.map(([x, y]) => `M${x - 8} ${y + 1}a8 8 0 1 1 16 0a8 8 0 1 1-16 0M${x} ${y + 9}v6`).join('');

const MEYDAN_YOLU = lekeYolu({ cx: MEYDAN.x, cy: MEYDAN.y, rx: MEYDAN.r, ry: MEYDAN.r, tohum: 81, puruz: 0.04 });

export function MahalleKrokisi({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 1500" preserveAspectRatio="xMidYMid slice" className={className ?? 'absolute inset-0 h-full w-full'}>
      <rect x="-20" y="-20" width="1240" height="1540" fill={R.arazi} />

      <path d={PARK_YOLU} fill={R.park} />

      {/* Önce kenar çizgileri, sonra sokakların içi: kavşaklarda çizgiler beyazın altında kalır. */}
      <path d={KENARLAR} fill="none" stroke={R.murekkep} strokeOpacity="0.5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <g fill="none" stroke={R.yol} strokeLinecap="round" strokeLinejoin="round">
        {SOKAKLAR.map((s, i) => (
          <path key={i} d={acikEgri(s.noktalar)} strokeWidth={s.genislik - 3} />
        ))}
      </g>
      <path d={MEYDAN_YOLU} fill={R.yol} stroke={R.murekkep} strokeOpacity="0.5" strokeWidth="1.6" />
      <circle cx={CIKMAZ_SONU.x} cy={CIKMAZ_SONU.y} r={CIKMAZ_SONU.r} fill={R.yol} stroke={R.murekkep} strokeOpacity="0.5" strokeWidth="1.6" />
      {/* Çeşme: meydanın ortasında iç içe iki halka. */}
      <g fill="none" stroke={R.murekkep} strokeOpacity="0.45" strokeWidth="1.6">
        <circle cx={MEYDAN.x} cy={MEYDAN.y} r="16" />
        <circle cx={MEYDAN.x} cy={MEYDAN.y} r="6" />
      </g>

      <path d={EVLER_YOLU} fill={R.yol} stroke={R.murekkep} strokeOpacity="0.45" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={KAPILAR} fill="none" stroke={R.murekkep} strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
      <path d={AGAC_YOLU} fill="none" stroke={R.murekkep} strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
