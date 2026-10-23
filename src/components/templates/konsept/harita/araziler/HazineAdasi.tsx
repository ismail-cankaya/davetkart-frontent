import React from 'react';
import { HARITA_RENK as R } from '../palet';
import { lekeIciNoktalar, lekeYolu, tohumlu, type Leke } from './cizim';

/**
 * Hazine haritası ekseni: kurgusal bir ada. Tonlar: sıcak arazi (kum), su,
 * park (koru); rota ve X kapakta ayrı katmandır. Eş yükselti halkaları,
 * palmiyeler, kayalar ve dalgalar mürekkebin ya da beyazın şeffaf hâlidir.
 *
 * Tuval 1200 × 1500, `slice`. Ada dikeyde uzundur (y 150–1370) ve yatayda
 * çekirdeğe sığar (x 270–930): dikey telefonda üstte ve altta, yatay
 * ekranda iki yanda deniz görünür. Gerçek bir yer değildir.
 */

const ADA: Leke = { cx: 600, cy: 760, rx: 330, ry: 610, aci: 6, tohum: 71, puruz: 0.13 };
/**
 * Batı yarımadası: adaya kaynaşan ikinci leke. Dikey telefonda kadrajın
 * dışında kalır (x < 307); yatay ekranda sol yarıyı karaya çevirir — orada
 * duraklar ve X durur, deniz sağda kartuşun altında kalır.
 */
const YARIMADA: Leke = { cx: 330, cy: 720, rx: 290, ry: 330, aci: -8, tohum: 82, puruz: 0.12 };
const ADACIKLAR: Leke[] = [
  { cx: 1080, cy: 300, rx: 70, ry: 46, aci: -18, tohum: 72, puruz: 0.16 },
  { cx: 150, cy: 1230, rx: 84, ry: 52, aci: 24, tohum: 73, puruz: 0.15 },
  { cx: 1010, cy: 1180, rx: 46, ry: 30, aci: 8, tohum: 74, puruz: 0.18 }
];

interface Tepe extends Leke {
  halka: number;
  kayma: [number, number];
}

const TEPELER: Tepe[] = [
  { cx: 470, cy: 520, rx: 150, ry: 115, aci: -10, tohum: 75, puruz: 0.12, halka: 5, kayma: [5, -4] },
  { cx: 740, cy: 1080, rx: 135, ry: 100, aci: 14, tohum: 76, puruz: 0.12, halka: 4, kayma: [-4, 4] }
];

const KORULAR: Leke[] = [
  { cx: 720, cy: 330, rx: 120, ry: 80, aci: 10, tohum: 77, puruz: 0.18 },
  { cx: 420, cy: 960, rx: 105, ry: 140, aci: -6, tohum: 78, puruz: 0.18 },
  { cx: 640, cy: 1300, rx: 120, ry: 54, aci: -4, tohum: 79, puruz: 0.2 },
  { cx: 170, cy: 640, rx: 90, ry: 120, aci: 12, tohum: 83, puruz: 0.18 }
];

/** İç göl: adanın ortasında küçük bir su lekesi. */
const GOL = lekeYolu({ cx: 690, cy: 760, rx: 70, ry: 44, aci: -20, tohum: 80, puruz: 0.14 });

const KARA = [lekeYolu(ADA), lekeYolu(YARIMADA)];
/** Sığlık: kıyının dışında kesik beyaz çizgi (lekelerin büyütülmüş izi; içte kalanı kara örter). */
const SIGLIK = lekeYolu(ADA, 1.07) + lekeYolu(YARIMADA, 1.08);
const ADACIK_YOLLARI = ADACIKLAR.map((a) => lekeYolu(a));
const HALKALAR = TEPELER.flatMap((t) =>
  Array.from({ length: t.halka }, (_, i) => lekeYolu(t, 1 - (i / t.halka) * 0.8, [t.kayma[0] * i, t.kayma[1] * i]))
).join('');
const KORU_YOLLARI = KORULAR.map((k) => lekeYolu(k));

/** Koru içinde yuvarlak ağaç, kıyıda palmiye. Hepsi tek `<path>`. */
const AGACLAR = KORULAR.flatMap((k) => lekeIciNoktalar(k, 34))
  .map(([x, y]) => `M${x - 7} ${y}a7 7 0 1 0 14 0a7 7 0 1 0-14 0M${x} ${y + 7}v6`)
  .join('');

const PALMIYE_YERLERI: [number, number][] = [
  [380, 260], [330, 700], [120, 880], [250, 470], [860, 560], [880, 860], [340, 1170], [560, 1390], [820, 1290], [530, 170], [900, 1020]
];
const PALMIYELER = PALMIYE_YERLERI.map(
  ([x, y]) => `M${x} ${y}q3-12-1-24M${x - 1} ${y - 24}c-6-4-12-2-15 4M${x - 1} ${y - 24}c6-4 12-2 15 4M${x - 1} ${y - 24}c-2-7 1-11 7-13M${x - 1} ${y - 24}c-5-5-10-6-14-4`
).join('');

/** Denizde dalga ve kaya: tohumlu, adaya ve adacıklara binmeyen noktalar. */
const DENIZ = (() => {
  const r = tohumlu(81);
  const icinde = (x: number, y: number, l: Leke, pay: number) => ((x - l.cx) / (l.rx + pay)) ** 2 + ((y - l.cy) / (l.ry + pay)) ** 2 < 1;
  const dalga: string[] = [];
  const kaya: string[] = [];
  for (let i = 0; i < 140 && dalga.length < 34; i++) {
    const x = 20 + r() * 1160;
    const y = 20 + r() * 1460;
    if (icinde(x, y, ADA, 70) || icinde(x, y, YARIMADA, 60) || ADACIKLAR.some((a) => icinde(x, y, a, 40))) continue;
    if (i % 7 === 3 && kaya.length < 6) kaya.push(`M${Math.round(x)} ${Math.round(y)}l7-11 6 6 5-4 6 9z`);
    else dalga.push(`M${Math.round(x)} ${Math.round(y)}q6-5 12 0t12 0`);
  }
  return { dalga: dalga.join(''), kaya: kaya.join('') };
})();

export function HazineAdasi({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 1500" preserveAspectRatio="xMidYMid slice" className={className ?? 'absolute inset-0 h-full w-full'}>
      <rect x="-20" y="-20" width="1240" height="1540" fill={R.su} />
      <path d={DENIZ.dalga} fill="none" stroke={R.yol} strokeOpacity="0.75" strokeWidth="2.4" strokeLinecap="round" />
      <path d={DENIZ.kaya} fill={R.murekkep} fillOpacity="0.35" />

      <path d={SIGLIK} fill="none" stroke={R.yol} strokeOpacity="0.85" strokeWidth="2.2" strokeDasharray="3 10" strokeLinecap="round" />
      {/* İki leke tek kara: önce kalın kenarlar, üstüne dolgular — içteki kesişme çizgisi örtülür, dışta 1.8 px kalır. */}
      {KARA.map((d, i) => (
        <path key={`k${i}`} d={d} fill="none" stroke={R.murekkep} strokeOpacity="0.45" strokeWidth="3.6" />
      ))}
      {KARA.map((d, i) => (
        <path key={`d${i}`} d={d} fill={R.araziSicak} />
      ))}
      {ADACIK_YOLLARI.map((d, i) => (
        <path key={i} d={d} fill={R.araziSicak} stroke={R.murekkep} strokeOpacity="0.45" strokeWidth="1.6" />
      ))}

      {KORU_YOLLARI.map((d, i) => (
        <path key={i} d={d} fill={R.park} stroke={R.murekkep} strokeOpacity="0.25" strokeWidth="1.4" />
      ))}
      <path d={AGACLAR} fill="none" stroke={R.murekkep} strokeOpacity="0.3" strokeWidth="1.6" strokeLinecap="round" />

      <path d={HALKALAR} fill="none" stroke={R.murekkep} strokeOpacity="0.28" strokeWidth="1.4" />
      <path d={GOL} fill={R.su} stroke={R.murekkep} strokeOpacity="0.35" strokeWidth="1.4" />
      <path d={PALMIYELER} fill="none" stroke={R.murekkep} strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />

      {/* Su adı: süs metni (bilgi değil), yatay italik ve geniş aralıklı. */}
      <text
        x="600"
        y="1452"
        textAnchor="middle"
        fill={R.murekkep}
        fillOpacity="0.5"
        style={{ fontFamily: 'var(--hr-italik)', fontStyle: 'italic', fontSize: 30, letterSpacing: '0.32em' }}
      >
        Mavi Koy
      </text>
    </svg>
  );
}
