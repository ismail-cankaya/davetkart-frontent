import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { HARITA_RENK } from './palet';
import { Simge } from './simgeler';
import { egriKur, ornekle, yolDizgisi, type Nokta } from './rotaGeometri';
import { durakOranlari } from './rotaPlani';
import type { Durak } from './veri';
import { useHaritaHareketi } from './hareket';

/**
 * - `cadde`: rota beyaz bir caddenin üstünde noktalar (şehir planı).
 * - `patika`: bant yok; her noktanın arazi renginde kendi halkası var (kır).
 */
export type RotaStili = 'cadde' | 'patika';

const PARCA_SAYISI = 10;

/**
 * Noktalı rota ve durakları. Rota parçalar hâlinde, yalnızca opaklıkla ve
 * sırayla belirir (`pathLength`/`stroke-dashoffset` yok). İlk parça
 * `baslangic`ta başlar, sonuncusu `baslangic + 0.73 s`'de biter (`olcek` ile
 * sıkışır, bkz. `useHaritaHareketi`).
 *
 * `gizli`: rotanın başındaki, kartuşun altında kalan uzunluk (px). Duraklar
 * görünen kısma dağıtılır; hiçbiri kartuşun altına düşmez.
 */
export function Rota({
  noktalar,
  duraklar,
  stil,
  gizli = 0,
  baslangic = 0.15,
  girisBitti = false,
  olcek = 1
}: {
  noktalar: Nokta[];
  duraklar: Durak[];
  stil: RotaStili;
  gizli?: number;
  baslangic?: number;
  girisBitti?: boolean;
  olcek?: number;
}) {
  const h = useHaritaHareketi(girisBitti, olcek);
  const { parcalar, yol, gruplar, durakYerleri } = useMemo(() => {
    const egri = egriKur(noktalar);
    const ornek = ornekle(egri, stil === 'cadde' ? 11 : 10);
    const adim = Math.max(1, Math.ceil(ornek.noktalar.length / PARCA_SAYISI));
    const gruplar: Nokta[][] = [];
    for (let i = 0; i < ornek.noktalar.length; i += adim) gruplar.push(ornek.noktalar.slice(i, i + adim));
    const bas = ornek.uzunluk > 0 ? Math.min(0.5, gizli / ornek.uzunluk) : 0;
    const durakYerleri = durakOranlari(duraklar.length).map((oran) => {
      const gercek = bas + oran * (1 - bas);
      return { oran: gercek, nokta: ornek.konum(gercek) };
    });
    return { parcalar: egri, yol: yolDizgisi(egri), gruplar, durakYerleri };
  }, [noktalar, duraklar.length, stil, gizli]);

  if (!parcalar.length) return null;
  const parcaGecikmesi = (i: number) => baslangic + i * 0.065;

  return (
    <>
      {stil === 'cadde' && (
        <motion.g {...h.belir(baslangic * 0.5, 0.25)}>
          <path d={yol} fill="none" stroke={HARITA_RENK.murekkep} strokeOpacity="0.16" strokeWidth="16" strokeLinecap="round" />
          <path d={yol} fill="none" stroke={HARITA_RENK.yol} strokeWidth="13" strokeLinecap="round" />
        </motion.g>
      )}

      {gruplar.map((grup, i) => (
        <motion.g key={i} {...h.belir(parcaGecikmesi(i), 0.14)}>
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
        </motion.g>
      ))}

      {duraklar.map((durak, i) => {
        const yer = durakYerleri[i];
        if (!yer) return null;
        const grup = Math.min(gruplar.length - 1, Math.floor(yer.oran * gruplar.length));
        return (
          <motion.g key={durak.anahtar} {...h.belir(parcaGecikmesi(grup), 0.2)} style={{ color: HARITA_RENK.rota }}>
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
