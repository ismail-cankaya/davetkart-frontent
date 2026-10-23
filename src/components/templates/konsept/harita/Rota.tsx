import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { HARITA_RENK } from './palet';
import { Simge } from './simgeler';
import { egriKur, ornekle, yolDizgisi, type Nokta, type Ornek } from './rotaGeometri';
import { durakOranlari } from './rotaPlani';
import type { Durak } from './veri';
import { useHaritaHareketi } from './hareket';

/**
 * - `cadde`: rota beyaz bir caddenin üstünde noktalar (şehir planı).
 * - `patika`: bant yok; her noktanın arazi renginde kendi halkası var (kır).
 * - `kroki`: elle çizilmiş kesik çizgi + yön okları; her çizginin altında
 *   beyaz bir kesik (mahalle krokisi: rota sokak çizgilerinin üstünden geçer).
 */
export type RotaStili = 'cadde' | 'patika' | 'kroki';

const PARCA_SAYISI = 10;
const ARALIK: Record<RotaStili, number> = { cadde: 11, patika: 10, kroki: 7 };

/** Örneklenmiş noktaları sırayla `adet` parçaya böler. */
function parcala(noktalar: Nokta[], adet: number): Nokta[][] {
  const adim = Math.max(1, Math.ceil(noktalar.length / adet));
  const gruplar: Nokta[][] = [];
  for (let i = 0; i < noktalar.length; i += adim) gruplar.push(noktalar.slice(i, i + adim));
  return gruplar;
}

/** Bir parçanın çizimi: noktalar ya da (kroki) noktaların ikişer ikişer kesik çizgileri. */
function Parca({ grup, stil, bas, sonraki }: { grup: Nokta[]; stil: RotaStili; bas: number; sonraki?: Nokta }) {
  if (stil === 'kroki') {
    // Kesik çizgi: çift sıradaki noktadan sonrakine (7 px çizgi, 7 px boşluk).
    // Parçanın son çizgisi bir sonraki parçanın ilk noktasına uzanır.
    const tum = sonraki ? [...grup, sonraki] : grup;
    let d = '';
    for (let j = 0; j < tum.length - 1; j++) {
      if ((bas + j) % 2 !== 0) continue;
      const [a, b] = [tum[j], tum[j + 1]];
      d += `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }
    return (
      <>
        <path d={d} stroke={HARITA_RENK.yol} strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d={d} stroke={HARITA_RENK.rotaAcik} strokeWidth="3" strokeLinecap="round" fill="none" />
      </>
    );
  }
  return (
    <>
      {grup.map((n, j) =>
        stil === 'cadde' ? (
          <circle key={j} cx={n.x} cy={n.y} r="2.5" fill={HARITA_RENK.rotaAcik} />
        ) : (
          <circle
            key={j}
            cx={n.x}
            cy={n.y}
            r="2.7"
            fill={HARITA_RENK.rotaAcik}
            stroke={HARITA_RENK.arazi}
            strokeWidth="2.6"
            paintOrder="stroke"
          />
        )
      )}
    </>
  );
}

/** Kroki yön okları: yay boyunca ~110 px'te bir, durakların 26 px yakınına konmaz. */
function oklar(ornek: Ornek, bas: number, son: number, duraklar: Nokta[]): { n: Nokta; aci: number; oran: number }[] {
  const L = ornek.uzunluk;
  const sonuc: { n: Nokta; aci: number; oran: number }[] = [];
  for (let s = bas * L + 50; s < son * L - 40; s += 110) {
    const o = s / L;
    const n = ornek.konum(o);
    if (duraklar.some((d) => Math.hypot(d.x - n.x, d.y - n.y) < 26)) continue;
    const a = ornek.konum(Math.max(0, o - 4 / L));
    const b = ornek.konum(Math.min(1, o + 4 / L));
    sonuc.push({ n, aci: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI, oran: o });
  }
  return sonuc;
}

const OK = 'M-4.5-5.5 1.5 0l-6 5.5';

/**
 * Noktalı rota ve durakları. Rota parçalar hâlinde, yalnızca opaklıkla ve
 * sırayla belirir (`pathLength`/`stroke-dashoffset` yok). İlk parça
 * `baslangic`ta başlar, sonuncusu `baslangic + 0.73 s`'de biter (`olcek` ile
 * sıkışır, bkz. `useHaritaHareketi`).
 *
 * `gizli`: rotanın başındaki, kartuşun altında kalan uzunluk (px). Duraklar
 * görünen kısma dağıtılır; hiçbiri kartuşun altına düşmez.
 *
 * `kol` + `kavsak` (kavşaklı rota): ikinci kol ana rotanın kavşağa kadarki
 * kısmıyla aynı anda belirir (iki yol aynı anda ilerleyip buluşur); duraklar
 * kavşaktan sonraki ortak yola dizilir.
 */
export function Rota({
  noktalar,
  duraklar,
  stil,
  gizli = 0,
  kol,
  kavsak,
  baslangic = 0.15,
  girisBitti = false,
  olcek = 1
}: {
  noktalar: Nokta[];
  duraklar: Durak[];
  stil: RotaStili;
  gizli?: number;
  kol?: Nokta[];
  kavsak?: number;
  baslangic?: number;
  girisBitti?: boolean;
  olcek?: number;
}) {
  const h = useHaritaHareketi(girisBitti, olcek);
  const cizim = useMemo(() => {
    const egri = egriKur(noktalar);
    const ornek = ornekle(egri, ARALIK[stil]);
    const gruplar = parcala(ornek.noktalar, PARCA_SAYISI);
    const L = ornek.uzunluk || 1;
    const bas = Math.min(0.5, gizli / L);

    // Kavşağın ana rotadaki oranı: kavşağa kadarki eğrinin uzunluğu / toplam.
    const kavsakOrani =
      kavsak !== undefined && kavsak > 0 && kavsak < noktalar.length - 1
        ? ornekle(egriKur(noktalar.slice(0, kavsak + 1)), 50).uzunluk / L
        : null;
    const oranlar =
      kavsakOrani === null
        ? durakOranlari(duraklar.length).map((o) => bas + o * (1 - bas))
        : // Son 60 px iğnenin başına kalır (iğneye yukarıdan inen rotada baş rotanın üstündedir).
          durakOranlari(duraklar.length, kavsakOrani + 0.07, Math.min(0.86, 1 - 60 / L));
    const durakYerleri = oranlar.map((oran) => ({ oran, nokta: ornek.konum(oran) }));

    // İkinci kol: ana rotanın kavşağa kadarki parça sayısı kadar parçaya bölünür.
    let kolCizim: { yol: string; gruplar: Nokta[][] } | null = null;
    if (kol && kol.length > 1) {
      const kolEgri = egriKur(kol);
      const kolOrnek = ornekle(kolEgri, ARALIK[stil]);
      const adet = Math.max(1, Math.round((kavsakOrani ?? 0.4) * PARCA_SAYISI));
      kolCizim = { yol: yolDizgisi(kolEgri), gruplar: parcala(kolOrnek.noktalar, adet) };
    }

    const okYerleri =
      stil === 'kroki'
        ? oklar(
            ornek,
            bas,
            0.9,
            durakYerleri.map((d) => d.nokta)
          )
        : [];
    return { parcalar: egri, yol: yolDizgisi(egri), gruplar, durakYerleri, kolCizim, okYerleri, adim: gruplar[0]?.length ?? 1 };
  }, [noktalar, duraklar.length, stil, gizli, kol, kavsak]);

  const { parcalar, yol, gruplar, durakYerleri, kolCizim, okYerleri, adim } = cizim;
  if (!parcalar.length) return null;
  const parcaGecikmesi = (i: number) => baslangic + i * 0.065;
  const grupSirasi = (oran: number) => Math.min(gruplar.length - 1, Math.floor(oran * gruplar.length));

  return (
    <>
      {stil === 'cadde' && (
        <motion.g {...h.belir(baslangic * 0.5, 0.25)}>
          {[kolCizim?.yol, yol].filter(Boolean).map((d, i) => (
            <path key={`k${i}`} d={d} fill="none" stroke={HARITA_RENK.murekkep} strokeOpacity="0.16" strokeWidth="16" strokeLinecap="round" />
          ))}
          {[kolCizim?.yol, yol].filter(Boolean).map((d, i) => (
            <path key={`b${i}`} d={d} fill="none" stroke={HARITA_RENK.yol} strokeWidth="13" strokeLinecap="round" />
          ))}
        </motion.g>
      )}

      {kolCizim?.gruplar.map((grup, i) => (
        <motion.g key={`kol-${i}`} {...h.belir(parcaGecikmesi(i), 0.14)}>
          <Parca grup={grup} stil={stil} bas={i * (kolCizim.gruplar[0]?.length ?? 1)} sonraki={kolCizim.gruplar[i + 1]?.[0]} />
        </motion.g>
      ))}

      {gruplar.map((grup, i) => (
        <motion.g key={i} {...h.belir(parcaGecikmesi(i), 0.14)}>
          <Parca grup={grup} stil={stil} bas={i * adim} sonraki={gruplar[i + 1]?.[0]} />
        </motion.g>
      ))}

      {okYerleri.map(({ n, aci, oran }, i) => {
        const donus = `translate(${n.x.toFixed(1)} ${n.y.toFixed(1)}) rotate(${aci.toFixed(1)})`;
        return (
          <motion.g key={`ok-${i}`} {...h.belir(parcaGecikmesi(grupSirasi(oran)), 0.14)}>
            <path d={OK} transform={donus} fill="none" stroke={HARITA_RENK.yol} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d={OK} transform={donus} fill="none" stroke={HARITA_RENK.rota} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
        );
      })}

      {duraklar.map((durak, i) => {
        const yer = durakYerleri[i];
        if (!yer) return null;
        return (
          <motion.g key={durak.anahtar} {...h.belir(parcaGecikmesi(grupSirasi(yer.oran)), 0.2)} style={{ color: HARITA_RENK.rota }}>
            <circle cx={yer.nokta.x} cy={yer.nokta.y} r="14" fill={HARITA_RENK.yol} stroke={HARITA_RENK.rota} strokeWidth="2" />
            {durak.simge ? (
              <Simge ad={durak.simge} boyut={16} x={yer.nokta.x - 8} y={yer.nokta.y - 8} />
            ) : (
              <text
                x={yer.nokta.x}
                y={yer.nokta.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={HARITA_RENK.rota}
                style={{ fontFamily: 'var(--hr-etiket)', fontWeight: 600, fontSize: 15 }}
              >
                {durak.sira}
              </text>
            )}
          </motion.g>
        );
      })}
    </>
  );
}
